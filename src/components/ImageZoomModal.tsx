/**
 * 이미지 확대 모달
 * 포스트 내 이미지 클릭 시 전체 화면으로 확대하여 표시
 */

'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

export function ImageZoomModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [mounted, setMounted] = useState(false)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('image-zoomable')) {
        e.preventDefault()
        const img = target as HTMLImageElement
        setImageSrc(img.getAttribute('data-zoom-src') || img.src)
        setImageAlt(img.alt || '')
        setScale(1)
        setIsOpen(true)
      }
    }

    document.addEventListener('click', handleImageClick)
    return () => document.removeEventListener('click', handleImageClick)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setScale(1)
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* 컨트롤 버튼 */}
          <div className="fixed top-4 right-4 z-[10001] flex items-center gap-2">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation()
                handleZoomOut()
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="축소"
            >
              <ZoomOut className="w-5 h-5" />
            </motion.button>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 }}
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="확대"
            >
              <ZoomIn className="w-5 h-5" />
            </motion.button>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* 확대 비율 표시 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="fixed top-4 left-4 z-[10001] px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium"
          >
            {Math.round(scale * 100)}%
          </motion.div>

          {/* 이미지 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="fixed inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{
                scale,
                transformOrigin: 'center',
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              drag={scale > 1}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
