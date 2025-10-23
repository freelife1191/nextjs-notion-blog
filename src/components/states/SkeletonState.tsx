/**
 * 스켈레톤 로딩 상태 컴포넌트
 * 데이터 로딩 중 표시되는 UI
 */

import { Skeleton } from '@/components/ui/skeleton'

/**
 * 포스트 리스트 스켈레톤
 */
export function PostListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-content">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border-b border-border pb-6">
          <div className="space-tight">
            {/* 카테고리 */}
            <Skeleton className="h-4 w-16" />

            {/* 제목 */}
            <Skeleton className="h-6 w-3/4" />

            {/* 요약 */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * 포스트 상세 스켈레톤
 */
export function PostDetailSkeleton() {
  return (
    <div className="space-section">
      {/* 히어로 이미지 */}
      <Skeleton className="h-64 w-full rounded-lg" />

      {/* 제목 */}
      <Skeleton className="h-8 w-3/4" />

      {/* 메타 정보 */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* 본문 */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 프로필 사이드바 스켈레톤
 */
export function ProfileSidebarSkeleton() {
  return (
    <div className="space-section">
      {/* 아바타 */}
      <Skeleton className="h-24 w-24 rounded-full mx-auto" />
      
      {/* 이름 */}
      <Skeleton className="h-6 w-32 mx-auto" />
      
      {/* 직무 */}
      <Skeleton className="h-4 w-24 mx-auto" />
      
      {/* 소개 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* 네비게이션 */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      
      {/* 소셜 링크 */}
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  )
}

/**
 * 페이지네이션 스켈레톤
 */
export function PaginationSkeleton() {
  return (
    <div className="flex justify-center items-center space-x-4 py-8">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
    </div>
  )
}

/**
 * 카드 스켈레톤 (범용)
 */
export function CardSkeleton({ 
  showImage = false, 
  showMeta = true 
}: { 
  showImage?: boolean
  showMeta?: boolean 
}) {
  return (
    <div className="border border-border rounded-lg p-6 space-y-4">
      {showImage && (
        <Skeleton className="h-48 w-full rounded-md" />
      )}
      
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {showMeta && (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      )}
    </div>
  )
}
