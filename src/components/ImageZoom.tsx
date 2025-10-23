/**
 * 이미지 확대/축소 라이트박스 컴포넌트
 * prose 내부의 이미지를 클릭하면 원본 크기로 확대
 */

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'

export function ImageZoom() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageAlt, setImageAlt] = useState<string>('')

  useEffect(() => {
    // prose 내부의 모든 이미지에 클릭 이벤트 추가
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // img 태그이고, prose 내부에 있는 경우에만 처리
      if (target.tagName === 'IMG' && target.closest('.prose')) {
        const img = target as HTMLImageElement

        // 이미 작은 아이콘이나 프로필 이미지는 제외
        if (img.width < 100 || img.height < 100) return

        setSelectedImage(img.src)
        setImageAlt(img.alt || '')
        document.body.style.overflow = 'hidden' // 스크롤 방지
      }
    }

    document.addEventListener('click', handleImageClick)
    return () => {
      document.removeEventListener('click', handleImageClick)
      document.body.style.overflow = '' // 클린업
    }
  }, [])

  useEffect(() => {
    // ESC 키로 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeModal()
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  const closeModal = () => {
    setSelectedImage(null)
    setImageAlt('')
    document.body.style.overflow = ''
  }

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="이미지 확대 보기"
        >
          {/* 닫기 버튼 */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 hover:bg-white/10 rounded-full transition-all z-10"
            aria-label="이미지 닫기"
          >
            <X size={24} />
          </button>

          {/* 이미지 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[95vw] max-h-[95vh] w-auto h-auto cursor-default"
            onClick={(e) => e.stopPropagation()} // 이미지 클릭 시 모달 닫기 방지
          >
            <Image
              src={selectedImage}
              alt={imageAlt}
              width={1920}
              height={1080}
              className="max-w-full max-h-[95vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              unoptimized
            />

            {/* 이미지 설명 */}
            {imageAlt && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-4 rounded-b-lg">
                {imageAlt}
              </div>
            )}
          </motion.div>

          {/* 안내 텍스트 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            클릭 또는 ESC 키로 닫기
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
