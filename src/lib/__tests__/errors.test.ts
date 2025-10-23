/**
 * Error Handling Utilities Tests
 *
 * 구조화된 에러 처리 시스템 테스트
 *
 * 테스트 범위:
 * - NotionApiError 클래스 생성 및 속성
 * - 에러 카테고리 분류
 * - 재시도 가능성 판단
 * - HTTP 상태 코드 기반 에러 생성
 * - 헬퍼 함수들 (isNotionApiError, wrapError, getErrorMessage, logError)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  NotionApiError,
  NotionErrorCode,
  ErrorCategory,
  isNotionApiError,
  wrapError,
  getErrorMessage,
  logError,
} from '../errors'
import { logger } from '../logger'

describe('NotionApiError', () => {
  describe('Constructor', () => {
    it('should create error with message and default code', () => {
      const error = new NotionApiError('Test error')

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(NotionApiError)
      expect(error.name).toBe('NotionApiError')
      expect(error.message).toBe('Test error')
      expect(error.code).toBe(NotionErrorCode.UNKNOWN_ERROR)
      expect(error.category).toBe(ErrorCategory.UNKNOWN)
    })

    it('should create error with specific error code', () => {
      const error = new NotionApiError('Unauthorized', NotionErrorCode.API_UNAUTHORIZED)

      expect(error.message).toBe('Unauthorized')
      expect(error.code).toBe(NotionErrorCode.API_UNAUTHORIZED)
      expect(error.category).toBe(ErrorCategory.API)
    })

    it('should set status code from options', () => {
      const error = new NotionApiError('Server error', NotionErrorCode.API_SERVER_ERROR, {
        status: 500,
      })

      expect(error.status).toBe(500)
    })

    it('should set context from options', () => {
      const context = { slug: 'test-post', attempt: 3 }
      const error = new NotionApiError('Failed to fetch', NotionErrorCode.POST_NOT_FOUND, {
        context,
      })

      expect(error.context).toEqual(context)
    })

    it('should set cause error from options', () => {
      const cause = new Error('Original error')
      const error = new NotionApiError('Wrapped error', NotionErrorCode.UNKNOWN_ERROR, {
        cause,
      })

      expect(error.cause).toBe(cause)
    })

    it('should set explicit retryable flag', () => {
      const retryableError = new NotionApiError('Temporary error', NotionErrorCode.UNKNOWN_ERROR, {
        retryable: true,
      })

      const nonRetryableError = new NotionApiError('Fatal error', NotionErrorCode.API_SERVER_ERROR, {
        retryable: false,
      })

      expect(retryableError.retryable).toBe(true)
      expect(nonRetryableError.retryable).toBe(false)
    })
  })

  describe('Error Categorization', () => {
    it('should categorize API errors correctly', () => {
      const errors = [
        { code: NotionErrorCode.API_UNAUTHORIZED, category: ErrorCategory.API },
        { code: NotionErrorCode.API_FORBIDDEN, category: ErrorCategory.API },
        { code: NotionErrorCode.API_NOT_FOUND, category: ErrorCategory.API },
        { code: NotionErrorCode.API_RATE_LIMITED, category: ErrorCategory.API },
        { code: NotionErrorCode.API_SERVER_ERROR, category: ErrorCategory.API },
        { code: NotionErrorCode.API_TIMEOUT, category: ErrorCategory.API },
      ]

      errors.forEach(({ code, category }) => {
        const error = new NotionApiError('Test', code)
        expect(error.category).toBe(category)
      })
    })

    it('should categorize validation errors correctly', () => {
      const errors = [
        { code: NotionErrorCode.VALIDATION_FAILED, category: ErrorCategory.VALIDATION },
        { code: NotionErrorCode.INVALID_RESPONSE, category: ErrorCategory.VALIDATION },
        { code: NotionErrorCode.MISSING_REQUIRED_FIELD, category: ErrorCategory.VALIDATION },
      ]

      errors.forEach(({ code, category }) => {
        const error = new NotionApiError('Test', code)
        expect(error.category).toBe(category)
      })
    })

    it('should categorize data errors correctly', () => {
      const errors = [
        { code: NotionErrorCode.POST_NOT_FOUND, category: ErrorCategory.DATA },
        { code: NotionErrorCode.INVALID_SLUG, category: ErrorCategory.DATA },
        { code: NotionErrorCode.EMPTY_DATABASE, category: ErrorCategory.DATA },
      ]

      errors.forEach(({ code, category }) => {
        const error = new NotionApiError('Test', code)
        expect(error.category).toBe(category)
      })
    })

    it('should categorize configuration errors correctly', () => {
      const errors = [
        { code: NotionErrorCode.MISSING_API_KEY, category: ErrorCategory.CONFIGURATION },
        { code: NotionErrorCode.MISSING_DATABASE_ID, category: ErrorCategory.CONFIGURATION },
        { code: NotionErrorCode.INVALID_CONFIGURATION, category: ErrorCategory.CONFIGURATION },
      ]

      errors.forEach(({ code, category }) => {
        const error = new NotionApiError('Test', code)
        expect(error.category).toBe(category)
      })
    })

    it('should categorize unknown errors correctly', () => {
      const error = new NotionApiError('Test', NotionErrorCode.UNKNOWN_ERROR)
      expect(error.category).toBe(ErrorCategory.UNKNOWN)
    })
  })

  describe('Retryability', () => {
    it('should mark rate limited errors as retryable', () => {
      const error = new NotionApiError('Rate limited', NotionErrorCode.API_RATE_LIMITED)
      expect(error.retryable).toBe(true)
    })

    it('should mark server errors as retryable', () => {
      const error = new NotionApiError('Server error', NotionErrorCode.API_SERVER_ERROR)
      expect(error.retryable).toBe(true)
    })

    it('should mark timeout errors as retryable', () => {
      const error = new NotionApiError('Timeout', NotionErrorCode.API_TIMEOUT)
      expect(error.retryable).toBe(true)
    })

    it('should mark 5xx status codes as retryable', () => {
      const error = new NotionApiError('Server error', NotionErrorCode.UNKNOWN_ERROR, {
        status: 503,
      })
      expect(error.retryable).toBe(true)
    })

    it('should mark client errors as non-retryable', () => {
      const errors = [
        new NotionApiError('Unauthorized', NotionErrorCode.API_UNAUTHORIZED),
        new NotionApiError('Forbidden', NotionErrorCode.API_FORBIDDEN),
        new NotionApiError('Not found', NotionErrorCode.API_NOT_FOUND),
      ]

      errors.forEach((error) => {
        expect(error.retryable).toBe(false)
      })
    })

    it('should mark validation errors as non-retryable', () => {
      const error = new NotionApiError('Validation failed', NotionErrorCode.VALIDATION_FAILED)
      expect(error.retryable).toBe(false)
    })

    it('should mark data errors as non-retryable', () => {
      const error = new NotionApiError('Post not found', NotionErrorCode.POST_NOT_FOUND)
      expect(error.retryable).toBe(false)
    })

    it('should respect explicit retryable flag over default', () => {
      // Normally non-retryable, but explicitly set to retryable
      const error1 = new NotionApiError('Not found', NotionErrorCode.API_NOT_FOUND, {
        retryable: true,
      })
      expect(error1.retryable).toBe(true)

      // Normally retryable, but explicitly set to non-retryable
      const error2 = new NotionApiError('Rate limited', NotionErrorCode.API_RATE_LIMITED, {
        retryable: false,
      })
      expect(error2.retryable).toBe(false)
    })
  })

  describe('isCategory method', () => {
    it('should return true for matching category', () => {
      const error = new NotionApiError('Test', NotionErrorCode.API_UNAUTHORIZED)
      expect(error.isCategory(ErrorCategory.API)).toBe(true)
    })

    it('should return false for non-matching category', () => {
      const error = new NotionApiError('Test', NotionErrorCode.API_UNAUTHORIZED)
      expect(error.isCategory(ErrorCategory.VALIDATION)).toBe(false)
      expect(error.isCategory(ErrorCategory.DATA)).toBe(false)
      expect(error.isCategory(ErrorCategory.CONFIGURATION)).toBe(false)
    })
  })

  describe('fromHttpStatus factory method', () => {
    it('should create error for 401 Unauthorized', () => {
      const error = NotionApiError.fromHttpStatus(401, 'Unauthorized')

      expect(error.code).toBe(NotionErrorCode.API_UNAUTHORIZED)
      expect(error.status).toBe(401)
      expect(error.message).toBe('Unauthorized')
    })

    it('should create error for 403 Forbidden', () => {
      const error = NotionApiError.fromHttpStatus(403, 'Forbidden')

      expect(error.code).toBe(NotionErrorCode.API_FORBIDDEN)
      expect(error.status).toBe(403)
    })

    it('should create error for 404 Not Found', () => {
      const error = NotionApiError.fromHttpStatus(404, 'Not Found')

      expect(error.code).toBe(NotionErrorCode.API_NOT_FOUND)
      expect(error.status).toBe(404)
    })

    it('should create error for 429 Rate Limited', () => {
      const error = NotionApiError.fromHttpStatus(429, 'Rate Limited')

      expect(error.code).toBe(NotionErrorCode.API_RATE_LIMITED)
      expect(error.status).toBe(429)
      expect(error.retryable).toBe(true)
    })

    it('should create error for 5xx server errors', () => {
      const statuses = [500, 502, 503, 504]

      statuses.forEach((status) => {
        const error = NotionApiError.fromHttpStatus(status, 'Server Error')
        expect(error.code).toBe(NotionErrorCode.API_SERVER_ERROR)
        expect(error.status).toBe(status)
        expect(error.retryable).toBe(true)
      })
    })

    it('should create unknown error for unrecognized status codes', () => {
      const error = NotionApiError.fromHttpStatus(418, "I'm a teapot")

      expect(error.code).toBe(NotionErrorCode.UNKNOWN_ERROR)
      expect(error.status).toBe(418)
    })

    it('should include context when provided', () => {
      const context = { url: '/api/posts', method: 'GET' }
      const error = NotionApiError.fromHttpStatus(500, 'Server Error', context)

      expect(error.context).toEqual(context)
    })
  })

  describe('toJSON method', () => {
    it('should serialize error to JSON', () => {
      const error = new NotionApiError('Test error', NotionErrorCode.API_UNAUTHORIZED, {
        status: 401,
        context: { attempt: 1 },
      })

      const json = error.toJSON()

      expect(json).toEqual({
        name: 'NotionApiError',
        message: 'Test error',
        code: NotionErrorCode.API_UNAUTHORIZED,
        category: ErrorCategory.API,
        status: 401,
        retryable: false,
        context: { attempt: 1 },
        stack: expect.any(String),
      })
    })

    it('should include stack trace', () => {
      const error = new NotionApiError('Test')
      const json = error.toJSON()

      expect(json.stack).toBeDefined()
      expect(json.stack).toContain('NotionApiError')
    })
  })
})

describe('Helper Functions', () => {
  describe('isNotionApiError', () => {
    it('should return true for NotionApiError instances', () => {
      const error = new NotionApiError('Test')
      expect(isNotionApiError(error)).toBe(true)
    })

    it('should return false for standard Error instances', () => {
      const error = new Error('Test')
      expect(isNotionApiError(error)).toBe(false)
    })

    it('should return false for non-error values', () => {
      expect(isNotionApiError('error')).toBe(false)
      expect(isNotionApiError(null)).toBe(false)
      expect(isNotionApiError(undefined)).toBe(false)
      expect(isNotionApiError(42)).toBe(false)
      expect(isNotionApiError({})).toBe(false)
    })
  })

  describe('wrapError', () => {
    it('should return NotionApiError as-is', () => {
      const original = new NotionApiError('Test', NotionErrorCode.API_UNAUTHORIZED)
      const wrapped = wrapError(original)

      expect(wrapped).toBe(original)
    })

    it('should wrap standard Error with default message', () => {
      const original = new Error('Original error')
      const wrapped = wrapError(original)

      expect(wrapped).toBeInstanceOf(NotionApiError)
      expect(wrapped.message).toBe('Original error')
      expect(wrapped.code).toBe(NotionErrorCode.UNKNOWN_ERROR)
      expect(wrapped.cause).toBe(original)
    })

    it('should use custom default message for Error', () => {
      const original = new Error('')
      const wrapped = wrapError(original, 'Custom message')

      expect(wrapped.message).toBe('Custom message')
    })

    it('should wrap non-error values', () => {
      const wrapped = wrapError('string error', 'Default message')

      expect(wrapped).toBeInstanceOf(NotionApiError)
      expect(wrapped.message).toBe('Default message')
      expect(wrapped.code).toBe(NotionErrorCode.UNKNOWN_ERROR)
      expect(wrapped.context).toEqual({ originalError: 'string error' })
    })

    it('should wrap null/undefined values', () => {
      const wrappedNull = wrapError(null)
      const wrappedUndefined = wrapError(undefined)

      expect(wrappedNull).toBeInstanceOf(NotionApiError)
      expect(wrappedUndefined).toBeInstanceOf(NotionApiError)
      expect(wrappedNull.message).toBe('An unexpected error occurred')
      expect(wrappedUndefined.message).toBe('An unexpected error occurred')
    })

    it('should wrap object values', () => {
      const obj = { error: 'Something went wrong', code: 123 }
      const wrapped = wrapError(obj, 'Custom message')

      expect(wrapped).toBeInstanceOf(NotionApiError)
      expect(wrapped.message).toBe('Custom message')
      expect(wrapped.context).toEqual({ originalError: obj })
    })
  })

  describe('getErrorMessage', () => {
    it('should extract message from NotionApiError', () => {
      const error = new NotionApiError('Notion error message')
      expect(getErrorMessage(error)).toBe('Notion error message')
    })

    it('should extract message from standard Error', () => {
      const error = new Error('Standard error message')
      expect(getErrorMessage(error)).toBe('Standard error message')
    })

    it('should convert non-error values to string', () => {
      expect(getErrorMessage('string error')).toBe('string error')
      expect(getErrorMessage(42)).toBe('42')
      expect(getErrorMessage(null)).toBe('null')
      expect(getErrorMessage(undefined)).toBe('undefined')
      expect(getErrorMessage({ message: 'object' })).toContain('object')
    })
  })

  describe('logError', () => {
    let loggerErrorSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      loggerErrorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      loggerErrorSpy.mockRestore()
    })

    it('should log NotionApiError with toJSON output', () => {
      const error = new NotionApiError('Test error', NotionErrorCode.API_UNAUTHORIZED, {
        status: 401,
      })

      logError(error)

      expect(loggerErrorSpy).toHaveBeenCalledWith('[Error]', error.toJSON())
    })

    it('should log NotionApiError with context prefix', () => {
      const error = new NotionApiError('Test error')

      logError(error, 'API Request')

      expect(loggerErrorSpy).toHaveBeenCalledWith('[API Request]', error.toJSON())
    })

    it('should log standard Error with message and stack', () => {
      const error = new Error('Standard error')

      logError(error, 'Test Context')

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        '[Test Context]',
        'Standard error',
        expect.any(String)
      )
    })

    it('should log non-error values directly', () => {
      logError('string error', 'Test')

      expect(loggerErrorSpy).toHaveBeenCalledWith('[Test]', 'string error')
    })

    it('should log without context prefix when not provided', () => {
      const error = new Error('Test')

      logError(error)

      expect(loggerErrorSpy).toHaveBeenCalledWith('[Error]', 'Test', expect.any(String))
    })
  })
})
