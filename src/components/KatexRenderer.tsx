'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

/**
 * KaTeX 수식 렌더링 컴포넌트
 * 페이지 로드 후 모든 .katex-equation 요소를 찾아 LaTeX 수식을 렌더링
 *
 * 성능 최적화:
 * - KaTeX 라이브러리 (~250KB)는 수식이 있을 때만 동적으로 로드
 * - 수식이 없는 페이지에서는 번들에 포함되지 않음
 */
export function KatexRenderer() {
  useEffect(() => {
    // 모든 KaTeX 방정식 요소 찾기
    const equations = document.querySelectorAll('.katex-equation');

    // 수식이 없으면 조기 종료 (KaTeX 로드 안 함)
    if (equations.length === 0) return;

    // 수식이 있을 때만 KaTeX 라이브러리 동적 로드
    import('katex').then(({ default: katex }) => {
      equations.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const latex = htmlElement.dataset.latex;

        if (latex) {
          try {
            // KaTeX로 수식 렌더링
            katex.render(latex, htmlElement, {
              displayMode: true, // 블록 레벨 수식
              throwOnError: false, // 에러 시 에러 메시지 표시
              output: 'html', // HTML 출력
              strict: false, // 엄격 모드 비활성화
              trust: false, // 위험한 HTML 비활성화
            });
          } catch (error) {
            logger.error('KaTeX rendering error:', error);
            // 에러 발생 시 원본 LaTeX 표시
            htmlElement.textContent = `Error rendering: ${latex}`;
          }
        }
      });
    }).catch(error => {
      logger.error('Failed to load KaTeX library:', error);
    });
  }, []);

  return null; // 렌더링할 UI 없음
}
