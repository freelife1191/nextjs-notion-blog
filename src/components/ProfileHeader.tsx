import Image from 'next/image';
import Link from 'next/link';

export function ProfileHeader() {
  return (
    <header className="w-full border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-4 py-6 flex items-center gap-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/profile.jpg"
            alt="프로필 이미지"
            width={48}
            height={48}
            className="rounded-full object-cover"
            priority
          />
          <div>
            <div className="text-lg font-semibold leading-none">작성자</div>
            <div className="text-xs text-gray-500">Notion으로 관리하는 개인 블로그</div>
          </div>
        </Link>
      </div>
    </header>
  );
}


