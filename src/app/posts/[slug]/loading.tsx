/**
 * 포스트 로딩 UI
 * 포스트 데이터를 가져오는 동안 표시되는 스켈레톤 UI
 */

export default function Loading() {
  return (
    <div className="animate-pulse space-y-8">
      {/* 커버 이미지 스켈레톤 */}
      <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-800 rounded-lg" />

      {/* 헤더 정보 스켈레톤 */}
      <div className="space-y-4">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>

      {/* 콘텐츠 스켈레톤 */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  )
}
