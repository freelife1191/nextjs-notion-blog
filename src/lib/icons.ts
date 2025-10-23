/**
 * Lucide 아이콘 매핑 및 재사용 가능한 아이콘 컴포넌트
 * 레퍼런스 블로그에서 사용되는 아이콘들을 중앙 관리
 */

import React from 'react'
import {
  // 네비게이션
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Home,
  User,

  // 소셜
  Linkedin,
  Instagram,
  Mail,
  Github,
  AtSign,
  BookOpen,
  StickyNote,
  Twitter,
  Youtube,
  Radio,
  MessageCircle,
  Facebook,
  Music,
  Plane,
  MessagesSquare,

  // 콘텐츠
  Calendar,
  Tag,
  Clock,
  Eye,
  Heart,
  Share2,

  // 액션
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,

  // 상태
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,

  // 파일/미디어
  FileText,
  Image,
  Video,
  Download,

  // 기타
  ExternalLink,
  Copy,
  Bookmark,
  Star,

  // 테마
  Sun,
  Moon,
  Monitor,

  type LucideIcon,
} from 'lucide-react'
import { logger } from '@/lib/logger'

/**
 * 아이콘 매핑 객체
 * 컴포넌트에서 일관된 아이콘 사용을 위한 중앙 집중식 매핑
 */
export const icons = {
  // 네비게이션
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  menu: Menu,
  close: X,
  home: Home,
  user: User,
  
  // 소셜
  linkedin: Linkedin,
  instagram: Instagram,
  mail: Mail,
  github: Github,
  
  // 콘텐츠
  calendar: Calendar,
  tag: Tag,
  clock: Clock,
  eye: Eye,
  heart: Heart,
  share: Share2,
  
  // 액션
  search: Search,
  filter: Filter,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  
  // 상태
  loading: Loader2,
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
  refreshCw: RefreshCw,
  
  // 파일/미디어
  file: FileText,
  image: Image,
  video: Video,
  download: Download,
  
  // 기타
  externalLink: ExternalLink,
  copy: Copy,
  bookmark: Bookmark,
  star: Star,
} as const

/**
 * 아이콘 타입 정의
 */
export type IconName = keyof typeof icons

/**
 * 아이콘 컴포넌트 Props
 */
export interface IconProps {
  name: IconName
  size?: number
  className?: string
}

/**
 * 재사용 가능한 아이콘 컴포넌트
 * @param name - 아이콘 이름
 * @param size - 아이콘 크기 (기본값: 16)
 * @param className - 추가 CSS 클래스
 */
export function Icon({ name, size = 16, className = '' }: IconProps) {
  const IconComponent = icons[name] as LucideIcon
  
  if (!IconComponent) {
    logger.warn(`아이콘 '${name}'을 찾을 수 없습니다.`)
    return null
  }
  
  return React.createElement(IconComponent, { size, className })
}

/**
 * 소셜 아이콘 매핑
 * 프로필 사이드바에서 사용
 */
export const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  email: Mail,
  github: Github,
  threads: AtSign,
  blog: BookOpen,
  notion: StickyNote,
  twitter: Twitter,
  youtube: Youtube,
  kakao: MessageCircle,
  kakaoChannel: Radio,
  facebook: Facebook,
  tiktok: Music,
  telegram: Plane,
  line: MessagesSquare,
} as const

export type SocialIconName = keyof typeof socialIcons

/**
 * 소셜 아이콘 컴포넌트
 * @param platform - 소셜 플랫폼 이름
 * @param size - 아이콘 크기
 * @param className - 추가 CSS 클래스
 */
export function SocialIcon({ 
  platform, 
  size = 20, 
  className = '' 
}: { 
  platform: SocialIconName
  size?: number
  className?: string 
}) {
  const IconComponent = socialIcons[platform] as LucideIcon
  
  if (!IconComponent) {
    logger.warn(`소셜 아이콘 '${platform}'을 찾을 수 없습니다.`)
    return null
  }
  
  return React.createElement(IconComponent, { size, className })
}

/**
 * 네비게이션 아이콘 매핑
 * 페이지네이션에서 사용
 */
export const navigationIcons = {
  prev: ArrowLeft,
  next: ArrowRight,
} as const

export type NavigationIconName = keyof typeof navigationIcons

/**
 * 네비게이션 아이콘 컴포넌트
 * @param direction - 방향 (prev/next)
 * @param size - 아이콘 크기
 * @param className - 추가 CSS 클래스
 */
export function NavigationIcon({
  direction,
  size = 16,
  className = ''
}: {
  direction: NavigationIconName
  size?: number
  className?: string
}) {
  const IconComponent = navigationIcons[direction] as LucideIcon

  return React.createElement(IconComponent, { size, className })
}

/**
 * 테마 아이콘 매핑
 * ThemeToggle에서 사용
 */
export const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const

export type ThemeIconName = keyof typeof themeIcons

/**
 * 테마 아이콘 컴포넌트
 * @param theme - 테마 이름 (light/dark/system)
 * @param size - 아이콘 크기
 * @param className - 추가 CSS 클래스
 */
export function ThemeIcon({
  theme,
  size = 20,
  className = ''
}: {
  theme: ThemeIconName
  size?: number
  className?: string
}) {
  const IconComponent = themeIcons[theme] as LucideIcon

  return React.createElement(IconComponent, { size, className })
}
