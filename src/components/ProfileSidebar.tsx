/**
 * 프로필 사이드바 컴포넌트
 * 레퍼런스 블로그의 좌측 고정 사이드바 구현
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SocialIcon } from '@/lib/icons'
import { motion } from 'framer-motion'
import { fadeVariants, useInViewAnimation } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DevelopmentStatusModal } from './DevelopmentStatusModal'
import { Markdown } from './Markdown'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'

interface ProfileSidebarProps {
  profile?: {
    name: string
    photoUrl?: string
    bio?: string
    jobTitle?: string
    socialLinks: {
      linkedin?: string
      instagram?: string
      email?: string
      github?: string
      threads?: string
      blog?: string
      notion?: string
      twitter?: string
      youtube?: string
      kakao?: string
      kakaoChannel?: string
      facebook?: string
      tiktok?: string
      telegram?: string
      line?: string
    }
  }
}

const NAV_ITEMS = [
  { href: '/', label: 'Articles' },
  { href: '/about', label: 'About me' },
]

export function ProfileSidebar({
  profile = {
    name: '작성자',
    photoUrl: '/images/profile.jpg',
    bio: 'Notion Profile 데이터베이스를 설정하여 자신을 소개하세요',
    jobTitle: '직업',
    socialLinks: {
      github: 'https://github.com/yourusername',
      instagram: 'https://instagram.com/yourname',
      email: 'mailto:hello@example.com',
      blog: 'https://blog.example.com',
    }
  },
}: ProfileSidebarProps) {
  const pathname = usePathname()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  return (
    <motion.aside
      className="container-sidebar w-full max-w-full"
      variants={fadeVariants}
      {...useInViewAnimation}
    >
      <div className="space-section w-full">
        {/* 프로필 이미지 */}
        <div className="mb-6 -ml-1 pl-1">
          <motion.div
            className={cn("inline-block", profile.photoUrl && "cursor-pointer")}
            whileHover={profile.photoUrl ? { scale: 1.05 } : {}}
            whileTap={profile.photoUrl ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => profile.photoUrl && setIsImageModalOpen(true)}
          >
            <Avatar className="w-24 h-24 border-2 border-border transition-shadow hover:shadow-lg hover:border-primary/50">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.name}
                  fill
                  className="object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                  sizes="96px"
                  draggable={false}
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-2xl font-bold text-primary-foreground">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </motion.div>
        </div>

        {/* 이름 & 테마 토글 */}
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            className="text-heading-2 text-foreground"
            variants={fadeVariants}
            transition={{ delay: 0.1 }}
          >
            {profile.name}
          </motion.h1>
          <ThemeToggle />
        </div>

        {/* 직무 */}
        <motion.p
          className="text-body-small text-muted-foreground mb-6"
          variants={fadeVariants}
          transition={{ delay: 0.2 }}
        >
          {profile.jobTitle}
        </motion.p>

        {/* 소개 */}
        <motion.div
          className="text-sm lg:text-base text-foreground mb-8 leading-relaxed break-words"
          variants={fadeVariants}
          transition={{ delay: 0.3 }}
        >
          <Markdown className="[&>*]:text-sm lg:[&>*]:text-base [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {profile.bio || ''}
          </Markdown>
        </motion.div>

        {/* 네비게이션 */}
        <motion.nav
          className="space-y-1 mb-8"
          variants={fadeVariants}
          transition={{ delay: 0.4 }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block py-1 text-lg font-medium transition-colors duration-200 underline-offset-[10px]',
                  'text-foreground hover:text-pink-600 hover:underline hover:decoration-pink-600',
                  isActive && 'underline decoration-2 decoration-foreground'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </motion.nav>

        {/* 소셜 링크 */}
        <motion.div
          className="flex justify-start gap-2 flex-wrap w-full max-w-full overflow-hidden"
          variants={fadeVariants}
          transition={{ delay: 0.5 }}
        >
          {([
            { key: 'kakaoChannel', label: 'KakaoTalk Channel', external: true },
            { key: 'kakao', label: 'KakaoTalk Open Chat', external: true },
            { key: 'twitter', label: 'Twitter', external: true },
            { key: 'threads', label: 'Threads', external: true },
            { key: 'instagram', label: 'Instagram', external: true },
            { key: 'youtube', label: 'YouTube', external: true },
            { key: 'blog', label: 'Blog', external: true },
            { key: 'notion', label: 'Notion', external: true },
            { key: 'email', label: 'Email', external: false },
            { key: 'github', label: 'GitHub', external: true },
            { key: 'facebook', label: 'Facebook', external: true },
            { key: 'tiktok', label: 'TikTok', external: true },
            { key: 'telegram', label: 'Telegram', external: true },
            { key: 'line', label: 'LINE', external: true },
          ] as const).map(({ key, label, external }) => {
            const url = profile.socialLinks[key as keyof typeof profile.socialLinks]
            if (!url) return null

            return (
              <a
                key={key}
                href={url}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md border border-gray-200 dark:border-gray-700 transition-all"
                aria-label={label}
              >
                <SocialIcon platform={key} size={20} />
              </a>
            )
          })}
        </motion.div>

        {/* 저작권 & 개발 상태 */}
        <motion.div
          className="flex items-center justify-between mt-8 pr-2"
          variants={fadeVariants}
          transition={{ delay: 0.6 }}
        >
          <p className="text-caption text-muted-foreground">
            © Minseung Kwon All rights reserved.
          </p>
          <DevelopmentStatusModal />
        </motion.div>
      </div>

      {/* 프로필 이미지 확대 모달 */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent
          className="max-w-3xl p-0 overflow-hidden bg-transparent border-0"
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{profile.name}의 프로필 사진</DialogTitle>
            <DialogDescription>프로필 이미지 확대 보기</DialogDescription>
          </DialogHeader>

          <div className="relative w-full aspect-square">
            {profile.photoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full"
              >
                <Image
                  src={profile.photoUrl}
                  alt={profile.name}
                  fill
                  className="object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 768px) 100vw, 768px"
                  loading="lazy"
                />
              </motion.div>
            )}
          </div>

          {/* 커스텀 닫기 버튼 */}
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 rounded-full p-2 bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors z-10"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogContent>
      </Dialog>
    </motion.aside>
  )
}
