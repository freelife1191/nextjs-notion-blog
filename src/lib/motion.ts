/**
 * Framer Motion 애니메이션 변형 및 헬퍼 함수
 * 레퍼런스 블로그의 부드러운 전환과 애니메이션을 위한 중앙 집중식 관리
 */

import { Variants, Transition } from 'framer-motion'

/**
 * 기본 전환 설정
 */
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // ease-out
}

/**
 * 빠른 전환 설정 (호버 효과용)
 */
export const quickTransition: Transition = {
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1],
}

/**
 * 느린 전환 설정 (페이지 전환용)
 */
export const slowTransition: Transition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
}

/**
 * 애니메이션 스케일 상수
 */
export const ANIMATION_SCALE = {
  /** 일반적인 호버 효과 (배지, 태그) */
  HOVER_SMALL: 1.1,
  /** 강조된 호버 효과 (라벨, 버튼) */
  HOVER_MEDIUM: 1.15,
  /** 미묘한 호버 효과 (카드) */
  HOVER_SUBTLE: 1.02,
  /** 일반적인 탭 효과 */
  TAP_MEDIUM: 0.95,
  /** 강한 탭 효과 (태그, 작은 요소) */
  TAP_SMALL: 0.9,
  /** 미묘한 탭 효과 (카드) */
  TAP_SUBTLE: 0.98,
} as const

/**
 * 애니메이션 지속시간 상수
 */
export const ANIMATION_DURATION = {
  /** 무지개 테두리 애니메이션 */
  RAINBOW_BORDER: 1.5,
  /** 리스트 아이템 스태거 지연 */
  STAGGER_DELAY: 0.05,
} as const

/**
 * 페이드 인/아웃 애니메이션
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: quickTransition,
  },
}

/**
 * 슬라이드 업 애니메이션 (리스트 아이템용)
 */
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: quickTransition,
  },
}

/**
 * 스케일 애니메이션 (카드 호버용)
 */
export const scaleVariants: Variants = {
  hidden: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: quickTransition,
  },
  tap: {
    scale: 0.98,
    transition: quickTransition,
  },
}

/**
 * 페이지 전환 애니메이션
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  in: {
    opacity: 1,
    x: 0,
    transition: slowTransition,
  },
  out: {
    opacity: 0,
    x: -20,
    transition: quickTransition,
  },
}

/**
 * 스태거 애니메이션 (리스트 아이템 순차 등장)
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
}

/**
 * 모바일 메뉴 애니메이션
 */
export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: defaultTransition,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
}

/**
 * 오버레이 애니메이션
 */
export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: quickTransition,
  },
}

/**
 * 로딩 스피너 애니메이션
 */
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

/**
 * 펄스 애니메이션 (스켈레톤 로딩용)
 */
export const pulseVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * 타이핑 애니메이션 (텍스트 등장용)
 */
export const typewriterVariants: Variants = {
  hidden: {
    width: 0,
  },
  visible: {
    width: 'auto',
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
}

/**
 * 애니메이션 헬퍼 함수들
 */

/**
 * 뷰포트에 들어왔을 때 애니메이션 트리거
 */
export const useInViewAnimation = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-50px' },
}

/**
 * 호버 애니메이션 트리거
 */
export const useHoverAnimation = {
  whileHover: 'hover',
  whileTap: 'tap',
}

/**
 * 페이지 전환 애니메이션 트리거
 */
export const usePageAnimation = {
  initial: 'initial',
  animate: 'in',
  exit: 'out',
}

/**
 * 스태거 애니메이션 트리거
 */
export const useStaggerAnimation = {
  variants: staggerContainer,
  initial: 'hidden',
  animate: 'visible',
}

/**
 * 커스텀 애니메이션 생성 헬퍼
 */
export function createCustomVariants(
  from: Record<string, any>,
  to: Record<string, any>,
  transition?: Transition
): Variants {
  return {
    hidden: from,
    visible: {
      ...to,
      transition: transition || defaultTransition,
    },
  }
}

/**
 * 지연된 애니메이션 생성 헬퍼
 */
export function createDelayedVariants(
  baseVariants: Variants,
  delay: number
): Variants {
  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...defaultTransition,
        delay,
      },
    },
  }
}
