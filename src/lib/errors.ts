/**
 * Error handling utilities
 *
 * Provides structured error handling with error codes,
 * categorization, and detailed error information.
 */

/**
 * Error codes for different types of failures
 */
export enum NotionErrorCode {
  // API errors
  API_UNAUTHORIZED = 'API_UNAUTHORIZED',
  API_FORBIDDEN = 'API_FORBIDDEN',
  API_NOT_FOUND = 'API_NOT_FOUND',
  API_RATE_LIMITED = 'API_RATE_LIMITED',
  API_SERVER_ERROR = 'API_SERVER_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',

  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Data errors
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  INVALID_SLUG = 'INVALID_SLUG',
  EMPTY_DATABASE = 'EMPTY_DATABASE',

  // Configuration errors
  MISSING_API_KEY = 'MISSING_API_KEY',
  MISSING_DATABASE_ID = 'MISSING_DATABASE_ID',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Error category for grouping related errors
 */
export enum ErrorCategory {
  API = 'API',
  VALIDATION = 'VALIDATION',
  DATA = 'DATA',
  CONFIGURATION = 'CONFIGURATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Map error codes to categories
 */
const ERROR_CODE_CATEGORY_MAP: Record<NotionErrorCode, ErrorCategory> = {
  [NotionErrorCode.API_UNAUTHORIZED]: ErrorCategory.API,
  [NotionErrorCode.API_FORBIDDEN]: ErrorCategory.API,
  [NotionErrorCode.API_NOT_FOUND]: ErrorCategory.API,
  [NotionErrorCode.API_RATE_LIMITED]: ErrorCategory.API,
  [NotionErrorCode.API_SERVER_ERROR]: ErrorCategory.API,
  [NotionErrorCode.API_TIMEOUT]: ErrorCategory.API,

  [NotionErrorCode.VALIDATION_FAILED]: ErrorCategory.VALIDATION,
  [NotionErrorCode.INVALID_RESPONSE]: ErrorCategory.VALIDATION,
  [NotionErrorCode.MISSING_REQUIRED_FIELD]: ErrorCategory.VALIDATION,

  [NotionErrorCode.POST_NOT_FOUND]: ErrorCategory.DATA,
  [NotionErrorCode.INVALID_SLUG]: ErrorCategory.DATA,
  [NotionErrorCode.EMPTY_DATABASE]: ErrorCategory.DATA,

  [NotionErrorCode.MISSING_API_KEY]: ErrorCategory.CONFIGURATION,
  [NotionErrorCode.MISSING_DATABASE_ID]: ErrorCategory.CONFIGURATION,
  [NotionErrorCode.INVALID_CONFIGURATION]: ErrorCategory.CONFIGURATION,

  [NotionErrorCode.UNKNOWN_ERROR]: ErrorCategory.UNKNOWN,
}

/**
 * Enhanced Notion API Error with structured error information
 */
import { logger } from '@/lib/logger';

export class NotionApiError extends Error {
  public readonly code: NotionErrorCode
  public readonly category: ErrorCategory
  public readonly status?: number
  public readonly retryable: boolean
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    code: NotionErrorCode = NotionErrorCode.UNKNOWN_ERROR,
    options: {
      status?: number
      retryable?: boolean
      context?: Record<string, unknown>
      cause?: Error
    } = {}
  ) {
    super(message, { cause: options.cause })

    this.name = 'NotionApiError'
    this.code = code
    this.category = ERROR_CODE_CATEGORY_MAP[code]
    this.status = options.status
    this.retryable = options.retryable ?? this.isRetryableByDefault()
    this.context = options.context

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotionApiError)
    }
  }

  /**
   * Determine if error is retryable based on code and status
   */
  private isRetryableByDefault(): boolean {
    // Retryable error codes
    const retryableCodes = [
      NotionErrorCode.API_RATE_LIMITED,
      NotionErrorCode.API_SERVER_ERROR,
      NotionErrorCode.API_TIMEOUT,
    ]

    if (retryableCodes.includes(this.code)) {
      return true
    }

    // 5xx status codes are generally retryable
    if (this.status && this.status >= 500 && this.status < 600) {
      return true
    }

    return false
  }

  /**
   * Check if this error is of a specific category
   */
  isCategory(category: ErrorCategory): boolean {
    return this.category === category
  }

  /**
   * Create error from HTTP status code
   */
  static fromHttpStatus(
    status: number,
    message: string,
    context?: Record<string, unknown>
  ): NotionApiError {
    let code: NotionErrorCode

    switch (status) {
      case 401:
        code = NotionErrorCode.API_UNAUTHORIZED
        break
      case 403:
        code = NotionErrorCode.API_FORBIDDEN
        break
      case 404:
        code = NotionErrorCode.API_NOT_FOUND
        break
      case 429:
        code = NotionErrorCode.API_RATE_LIMITED
        break
      case 500:
      case 502:
      case 503:
      case 504:
        code = NotionErrorCode.API_SERVER_ERROR
        break
      default:
        code = NotionErrorCode.UNKNOWN_ERROR
    }

    return new NotionApiError(message, code, { status, context })
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      category: this.category,
      status: this.status,
      retryable: this.retryable,
      context: this.context,
      stack: this.stack,
    }
  }
}

/**
 * Helper to check if an error is a NotionApiError
 */
export function isNotionApiError(error: unknown): error is NotionApiError {
  return error instanceof NotionApiError
}

/**
 * Helper to wrap unknown errors as NotionApiError
 */
export function wrapError(
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred'
): NotionApiError {
  if (isNotionApiError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new NotionApiError(
      error.message || defaultMessage,
      NotionErrorCode.UNKNOWN_ERROR,
      { cause: error }
    )
  }

  return new NotionApiError(
    defaultMessage,
    NotionErrorCode.UNKNOWN_ERROR,
    { context: { originalError: error } }
  )
}

/**
 * Get a user-friendly error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isNotionApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

/**
 * Log error to console with formatted output
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '[Error]'

  if (isNotionApiError(error)) {
    logger.error(prefix, error.toJSON())
  } else if (error instanceof Error) {
    logger.error(prefix, error.message, error.stack)
  } else {
    logger.error(prefix, error)
  }
}
