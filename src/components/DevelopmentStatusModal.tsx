/**
 * 개발 진행 상태 모달
 * 서비스 개발 진행 상황과 완료 일자를 표시합니다.
 */

'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Code2, X, Info, Sparkles } from 'lucide-react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ANIMATION_SCALE, ANIMATION_DURATION } from '@/lib/motion'

interface FeatureStatus {
  name: string
  status: 'completed' | 'testing' | 'developing'
  description: string
  completedDate?: string
  isSubFeature?: boolean
  isSection?: boolean
}

const FEATURES: FeatureStatus[] = [
  {
    name: '💬 댓글',
    status: 'completed',
    description: 'Giscus 댓글 시스템',
    completedDate: '2025-10-22',
  },
  {
    name: '👤 About Me',
    status: 'completed',
    description: '프로필 페이지',
    completedDate: '2025-10-22',
  },
  {
    name: '⚙️ 프로필 설정',
    status: 'completed',
    description: 'Notion 기반 프로필 관리',
    completedDate: '2025-10-20',
  },
  {
    name: '📝 블로그 포스팅',
    status: 'testing',
    description: 'Notion CMS 연동',
  },
  {
    name: '🎨 사이트 설정',
    status: 'testing',
    description: 'Notion 기반 사이트 설정',
    isSection: true,
  },
  {
    name: '📄 기본 정보',
    status: 'testing',
    description: '사이트 제목, 설명, 파비콘',
    isSubFeature: true,
  },
  {
    name: '📊 분석 도구',
    status: 'testing',
    description: 'Google Analytics 4 연동',
    isSubFeature: true,
  },
  {
    name: '💰 수익화',
    status: 'testing',
    description: 'Google AdSense 연동',
    isSubFeature: true,
  },
  {
    name: '🔍 SEO 최적화',
    status: 'testing',
    description: '메타 태그, sitemap, RSS',
    isSubFeature: true,
  },
  {
    name: '🎨 테마 설정',
    status: 'developing',
    description: '색상, 폰트 커스터마이징',
    isSubFeature: true,
  },
  {
    name: '🌐 사이트 URL 설정',
    status: 'testing',
    description: '도메인 및 경로 설정',
    isSection: true,
  },
  {
    name: '📌 Base Path',
    status: 'testing',
    description: 'GitHub Pages 경로 설정',
    isSubFeature: true,
  },
  {
    name: '🏠 커스텀 도메인',
    status: 'testing',
    description: '개인 도메인 연결 가이드',
    isSubFeature: true,
  },
  {
    name: '🔒 HTTPS',
    status: 'completed',
    description: '자동 SSL 인증서 (GitHub Pages)',
    isSubFeature: true,
    completedDate: '2025-10-22',
  },
]

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    label: '완료',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  testing: {
    icon: AlertCircle,
    label: '검증중',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  developing: {
    icon: Code2,
    label: '개발중',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
} as const

export function DevelopmentStatusModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden'

      // 모든 iframe에 pointer-events: none 추가하여 iframe이 모달 클릭을 방해하지 않도록 함
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        iframe.style.pointerEvents = 'none'
      })
    } else {
      // 모달이 닫힐 때 복원
      document.body.style.overflow = ''

      const iframes = document.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        iframe.style.pointerEvents = ''
      })
    }

    return () => {
      document.body.style.overflow = ''
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        iframe.style.pointerEvents = ''
      })
    }
  }, [isOpen])

  return (
    <>
      {/* 트리거 버튼 */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-muted transition-colors relative"
        title="서비스 개발 진행 상태"
        aria-label="서비스 개발 진행 상태 보기"
        whileHover={{ scale: ANIMATION_SCALE.HOVER_SMALL }}
        whileTap={{ scale: ANIMATION_SCALE.TAP_MEDIUM }}
      >
        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* 모달 - React Portal을 사용하여 body에 직접 렌더링 */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              style={{ isolation: 'isolate' }}
            >
              {/* 모달 컨텐츠 */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300
                }}
                className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[85vh] overflow-y-auto bg-background rounded-lg shadow-2xl border border-border"
                onClick={(e) => e.stopPropagation()}
                style={{ isolation: 'isolate', willChange: 'transform' }}
              >
                {/* 헤더 */}
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background z-10 backdrop-blur-sm bg-background/95">
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Code2 className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">서비스 개발 진행 상태</h2>
                  </motion.div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    aria-label="닫기"
                    whileHover={{ rotate: 90, scale: ANIMATION_SCALE.HOVER_SMALL }}
                    whileTap={{ scale: ANIMATION_SCALE.TAP_SMALL }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* 콘텐츠 */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FEATURES.map((feature, index) => {
                    const config = STATUS_CONFIG[feature.status]
                    const Icon = config.icon

                    // 섹션 헤더 스타일 (전체 너비)
                    if (feature.isSection) {
                      return (
                        <motion.div
                          key={feature.name}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            delay: 0.1 + index * ANIMATION_DURATION.STAGGER_DELAY,
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                          }}
                          className="col-span-full mt-4 mb-2"
                        >
                          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider px-2">
                            {feature.name}
                          </h3>
                          <p className="text-xs text-muted-foreground px-2 mt-1">
                            {feature.description}
                          </p>
                        </motion.div>
                      )
                    }

                    // 일반 기능 및 서브 기능 스타일
                    return (
                      <motion.div
                        key={feature.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.1 + index * ANIMATION_DURATION.STAGGER_DELAY,
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                        className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} relative overflow-hidden`}
                      >
                        {/* 배경 그라데이션 효과 */}
                        {feature.status === 'completed' && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        )}

                        <div className="flex items-start justify-between gap-3 relative z-10">
                          <div className="flex items-start gap-3 flex-1">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.2 + index * ANIMATION_DURATION.STAGGER_DELAY,
                                type: "spring",
                                stiffness: 500,
                                damping: 15
                              }}
                            >
                              <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.color}`} />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold text-foreground ${feature.isSubFeature ? 'text-sm' : ''}`}>
                                {feature.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {feature.description}
                              </p>
                              {feature.completedDate && (
                                <motion.p
                                  className="text-xs text-muted-foreground mt-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 + index * ANIMATION_DURATION.STAGGER_DELAY }}
                                >
                                  완료일: {feature.completedDate}
                                </motion.p>
                              )}
                            </div>
                          </div>
                          <motion.div
                            className={`flex-shrink-0 px-2 py-1 rounded-md text-xs font-medium ${config.color} ${config.bgColor}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.25 + index * ANIMATION_DURATION.STAGGER_DELAY,
                              type: "spring",
                              stiffness: 500,
                              damping: 15
                            }}
                          >
                            {config.label}
                          </motion.div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* 푸터 */}
                <motion.div
                  className="sticky bottom-0 p-4 border-t border-border bg-muted/50 text-center z-10 backdrop-blur-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <p className="text-xs text-muted-foreground">
                      지속적으로 개발 중입니다
                    </p>
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      🚀
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
