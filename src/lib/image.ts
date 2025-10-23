/**
 * Image optimization utilities
 *
 * Notion 이미지 최적화를 위한 유틸리티 함수들
 */

/**
 * 이미지 크기 프리셋
 */
import { logger } from '@/lib/logger';

export const IMAGE_SIZE = {
  /** 썸네일 (목록용) - 256px */
  THUMBNAIL: 256,
  /** 작은 이미지 (프로필) - 400px */
  SMALL: 400,
  /** 중간 이미지 (포스트 커버) - 800px */
  MEDIUM: 800,
  /** 큰 이미지 (히어로 이미지) - 1200px */
  LARGE: 1200,
  /** 원본 (상세 페이지) - 1600px */
  ORIGINAL: 1600,
} as const;

/**
 * Notion 이미지 URL에 리사이징 파라미터 추가
 *
 * Notion은 AWS S3에 호스팅된 이미지에 대해 쿼리 파라미터로 리사이징을 지원합니다.
 * 이 함수는 URL에 `?table=block&width={width}` 파라미터를 추가하여
 * Notion CDN에서 최적화된 이미지를 제공받도록 합니다.
 *
 * @param url - Notion 이미지 URL
 * @param width - 원하는 이미지 너비 (픽셀)
 * @returns 리사이징 파라미터가 추가된 URL
 *
 * @example
 * ```ts
 * const optimized = optimizeNotionImageUrl(
 *   'https://s3.amazonaws.com/notion/image.jpg',
 *   IMAGE_SIZE.MEDIUM
 * );
 * // => 'https://s3.amazonaws.com/notion/image.jpg?table=block&width=800'
 * ```
 */
export function optimizeNotionImageUrl(url: string | undefined, width: number): string | undefined {
  if (!url) return undefined;

  try {
    const urlObj = new URL(url);

    // AWS S3 서명된 URL인 경우 최적화 건너뛰기
    // 서명된 URL에 파라미터를 추가하면 서명이 무효화되어 이미지가 깨짐
    if (urlObj.searchParams.has('X-Amz-Signature') ||
        urlObj.searchParams.has('X-Amz-Algorithm')) {
      return url; // 원본 URL 그대로 반환
    }

    // 이미 리사이징 파라미터가 있는 경우 업데이트
    if (urlObj.searchParams.has('width')) {
      urlObj.searchParams.set('width', width.toString());
    } else {
      // 새로운 리사이징 파라미터 추가
      urlObj.searchParams.append('table', 'block');
      urlObj.searchParams.append('width', width.toString());
    }

    return urlObj.toString();
  } catch (error) {
    // URL 파싱 실패 시 원본 반환
    logger.warn('[WARN] Failed to parse image URL for optimization:', url, error);
    return url;
  }
}

/**
 * 반응형 이미지를 위한 srcset 생성
 *
 * 다양한 화면 크기에 대응하기 위해 여러 크기의 이미지 URL을 생성합니다.
 *
 * @param url - Notion 이미지 URL
 * @param sizes - 생성할 이미지 크기 배열 (픽셀)
 * @returns srcset 문자열
 *
 * @example
 * ```ts
 * const srcset = generateImageSrcSet(
 *   'https://s3.amazonaws.com/notion/image.jpg',
 *   [400, 800, 1200]
 * );
 * // => 'https://...?width=400 400w, https://...?width=800 800w, https://...?width=1200 1200w'
 * ```
 */
export function generateImageSrcSet(url: string | undefined, sizes: number[]): string | undefined {
  if (!url) return undefined;

  try {
    return sizes
      .map(size => {
        const optimizedUrl = optimizeNotionImageUrl(url, size);
        return `${optimizedUrl} ${size}w`;
      })
      .join(', ');
  } catch (error) {
    logger.warn('[WARN] Failed to generate srcset:', url, error);
    return undefined;
  }
}

/**
 * 이미지 타입에 따른 최적 크기 반환
 *
 * @param type - 이미지 사용 타입
 * @returns 최적 이미지 너비 (픽셀)
 */
export function getOptimalImageSize(type: 'thumbnail' | 'cover' | 'hero' | 'profile'): number {
  switch (type) {
    case 'thumbnail':
      return IMAGE_SIZE.THUMBNAIL;
    case 'cover':
      return IMAGE_SIZE.MEDIUM;
    case 'hero':
      return IMAGE_SIZE.LARGE;
    case 'profile':
      return IMAGE_SIZE.SMALL;
    default:
      return IMAGE_SIZE.MEDIUM;
  }
}
