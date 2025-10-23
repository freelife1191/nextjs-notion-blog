/**
 * 모바일 메뉴 컴포넌트
 * 768px 이하에서 표시되는 햄버거 메뉴와 오버레이
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, SocialIcon } from '@/lib/icons'
import { mobileMenuVariants, overlayVariants } from '@/lib/motion'

interface MobileMenuProps {
  profile?: {
    name: string
    socialLinks: {
      linkedin?: string
      instagram?: string
      email?: string
      github?: string
      notion?: string
    }
  }
}

export function MobileMenu({
  profile = {
    name: '작성자',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/yourusername',
      instagram: 'https://instagram.com/yourname',
      email: 'mailto:hello@example.com',
      github: 'https://github.com/yourusername',
    }
  }
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-background border border-border rounded-md shadow-lg"
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Icon name={isOpen ? 'close' : 'menu'} size={24} />
      </button>

      {/* 오버레이와 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* 메뉴 패널 */}
            <motion.div
              id="mobile-menu"
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-background border-l border-border z-50 lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              <div className="flex flex-col h-full">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 id="mobile-menu-title" className="text-heading-3 text-foreground">
                    {profile.name}
                  </h2>
                  <button
                    onClick={closeMenu}
                    className="p-2 hover:bg-muted rounded-md transition-colors"
                    aria-label="메뉴 닫기"
                  >
                    <Icon name="close" size={20} />
                  </button>
                </div>

                {/* 네비게이션 */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-4">
                    <li>
                      <Link
                        href="/"
                        onClick={closeMenu}
                        className="block px-4 py-3 text-body text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        Articles
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        onClick={closeMenu}
                        className="block px-4 py-3 text-body text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        About
                      </Link>
                    </li>
                  </ul>
                </nav>

                {/* 소셜 링크 */}
                <div className="p-6 border-t border-border">
                  <h3 className="text-body-small text-muted-foreground mb-4">
                    Follow me
                  </h3>
                  <div className="flex space-x-4">
                    {profile.socialLinks.linkedin && (
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="LinkedIn"
                      >
                        <SocialIcon platform="linkedin" size={20} />
                      </a>
                    )}
                    
                    {profile.socialLinks.instagram && (
                      <a
                        href={profile.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Instagram"
                      >
                        <SocialIcon platform="instagram" size={20} />
                      </a>
                    )}
                    
                    {profile.socialLinks.email && (
                      <a
                        href={profile.socialLinks.email}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Email"
                      >
                        <SocialIcon platform="email" size={20} />
                      </a>
                    )}
                    
                    {profile.socialLinks.github && (
                      <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="GitHub"
                      >
                        <SocialIcon platform="github" size={20} />
                      </a>
                    )}

                    {profile.socialLinks.notion && (
                      <a
                        href={profile.socialLinks.notion}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Notion"
                      >
                        <SocialIcon platform="notion" size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
