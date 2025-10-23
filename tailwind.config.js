/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
    // Notion 텍스트 색상
    'text-gray-600',
    'text-amber-700',
    'text-orange-600',
    'text-yellow-600',
    'text-green-600',
    'text-blue-600',
    'text-purple-600',
    'text-pink-600',
    'text-red-600',
    'dark:text-gray-400',
    'dark:text-amber-300',
    'dark:text-orange-400',
    'dark:text-yellow-400',
    'dark:text-green-400',
    'dark:text-blue-400',
    'dark:text-purple-400',
    'dark:text-pink-400',
    'dark:text-red-400',
    // Notion 배경 색상 (라이트 모드) - 투명도 포함
    'bg-gray-100',
    'bg-gray-100/50',
    'bg-amber-100',
    'bg-amber-100/50',
    'bg-orange-100',
    'bg-orange-100/50',
    'bg-yellow-100',
    'bg-yellow-100/50',
    'bg-green-100',
    'bg-green-100/50',
    'bg-blue-100',
    'bg-blue-100/50',
    'bg-purple-100',
    'bg-purple-100/50',
    'bg-pink-100',
    'bg-pink-100/50',
    'bg-red-100',
    'bg-red-100/50',
    // Notion 배경 색상 (다크 모드) - 투명도 포함
    'dark:bg-gray-700',
    'dark:bg-gray-800/50',
    'dark:bg-amber-800',
    'dark:bg-amber-900/20',
    'dark:bg-orange-700',
    'dark:bg-orange-900/20',
    'dark:bg-yellow-900/30',
    'dark:bg-yellow-900/20',
    'dark:bg-green-700',
    'dark:bg-green-900/20',
    'dark:bg-blue-700',
    'dark:bg-blue-900/20',
    'dark:bg-purple-700',
    'dark:bg-purple-900/30',
    'dark:bg-pink-700',
    'dark:bg-pink-900/20',
    'dark:bg-red-700',
    'dark:bg-red-900/20',
    // Notion 배경색 텍스트 (라이트 모드)
    'text-gray-900',
    'text-amber-900',
    'text-orange-900',
    'text-yellow-900',
    'text-green-900',
    'text-blue-900',
    'text-purple-900',
    'text-pink-900',
    'text-red-900',
    // Notion 배경색 텍스트 (다크 모드)
    'dark:text-gray-100',
    'dark:text-amber-100',
    'dark:text-amber-200',
    'dark:text-orange-100',
    'dark:text-orange-200',
    'dark:text-yellow-100',
    'dark:text-yellow-200',
    'dark:text-green-100',
    'dark:text-green-200',
    'dark:text-blue-100',
    'dark:text-blue-200',
    'dark:text-purple-100',
    'dark:text-purple-200',
    'dark:text-pink-100',
    'dark:text-pink-200',
    'dark:text-red-100',
    'dark:text-red-200',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(55 65 81)', // gray-700
            fontSize: '1rem',
            lineHeight: '1.75',
            // GitHub 스타일 개선
            // GitHub 스타일 색상 변수
            '--tw-prose-body': 'rgb(55 65 81)', // gray-700
            '--tw-prose-headings': 'rgb(17 24 39)', // gray-900
            '--tw-prose-lead': 'rgb(75 85 99)', // gray-600
            '--tw-prose-links': 'rgb(37 99 235)', // blue-600
            '--tw-prose-bold': 'rgb(17 24 39)', // gray-900
            '--tw-prose-counters': 'rgb(107 114 128)', // gray-500
            '--tw-prose-bullets': 'rgb(75 85 99)', // gray-600 (글씨색과 동일)
            '--tw-prose-hr': 'rgb(229 231 235)', // gray-200
            '--tw-prose-quotes': 'rgb(17 24 39)', // gray-900
            '--tw-prose-quote-borders': 'rgb(229 231 235)', // gray-200
            '--tw-prose-captions': 'rgb(107 114 128)', // gray-500
            '--tw-prose-code': 'rgb(220 38 127)', // pink-600
            '--tw-prose-pre-code': 'rgb(229 231 235)', // gray-200
            '--tw-prose-pre-bg': 'rgb(17 24 39)', // gray-900
            '--tw-prose-th-borders': 'rgb(209 213 219)', // gray-300
            '--tw-prose-td-borders': 'rgb(229 231 235)', // gray-200
            '--tw-prose-invert-body': 'rgb(226 232 240)', // slate-200
            '--tw-prose-invert-headings': 'rgb(248 250 252)', // slate-50
            '--tw-prose-invert-lead': 'rgb(203 213 225)', // slate-300
            '--tw-prose-invert-links': 'rgb(147 197 253)', // blue-300
            '--tw-prose-invert-bold': 'rgb(248 250 252)', // slate-50
            '--tw-prose-invert-counters': 'rgb(203 213 225)', // slate-300
            '--tw-prose-invert-bullets': 'rgb(203 213 225)', // slate-300 (글씨색과 동일)
            '--tw-prose-invert-hr': 'rgb(71 85 105)', // slate-600
            '--tw-prose-invert-quotes': 'rgb(226 232 240)', // slate-200
            '--tw-prose-invert-quote-borders': 'rgb(71 85 105)', // slate-600
            '--tw-prose-invert-captions': 'rgb(148 163 184)', // slate-400
            '--tw-prose-invert-code': 'rgb(244 114 182)', // pink-400
            '--tw-prose-invert-pre-code': 'rgb(203 213 225)', // slate-300
            '--tw-prose-invert-pre-bg': 'rgb(15 23 42)', // slate-900
            '--tw-prose-invert-th-borders': 'rgb(71 85 105)', // slate-600
            '--tw-prose-invert-td-borders': 'rgb(51 65 85)', // slate-700
            // GitHub 스타일 링크
            a: {
              color: 'rgb(59 130 246)', // blue-500
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              textUnderlineOffset: '3px',
              textDecorationColor: 'rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'rgb(37 99 235)', // blue-600
                textDecorationColor: 'rgb(37 99 235)',
                textDecorationThickness: '2px',
              },
            },
            // GitHub 스타일 인라인 코드
            code: {
              color: 'rgb(220 38 127)', // pink-600
              backgroundColor: 'rgb(229 231 235)', // gray-200 (더 진한 배경)
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: '1px solid rgb(209 213 219)', // gray-300 (경계선 추가)
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            // GitHub 스타일 코드 블록
            pre: {
              backgroundColor: 'rgb(17 24 39)', // gray-900
              color: 'rgb(229 231 235)', // gray-200
              padding: '1rem',
              borderRadius: '0.375rem',
              overflow: 'auto',
              fontSize: '0.875rem',
              lineHeight: '1.6',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              borderRadius: '0',
            },
            // GitHub 스타일 테이블
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              marginLeft: '1rem',
              marginRight: '1rem',
            },
            'th:first-child, td:first-child': {
              paddingLeft: '1rem !important',
            },
            th: {
              backgroundColor: 'rgb(249 250 251)', // gray-50
              border: '1px solid rgb(209 213 219)', // gray-300
              padding: '0.75rem 1rem',
              textAlign: 'left',
              fontWeight: '600',
              fontSize: '0.875rem',
            },
            td: {
              border: '1px solid rgb(209 213 219)', // gray-300
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
            },
            // GitHub 스타일 인용구
            blockquote: {
              borderLeft: '4px solid rgb(209 213 219)', // gray-300
              paddingLeft: '1.5rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              marginTop: '2rem',
              marginBottom: '2rem',
              backgroundColor: 'rgb(249 250 251)', // gray-50
              fontStyle: 'normal',
            },
            // GitHub 스타일 이미지
            img: {
              borderRadius: '0.375rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            // GitHub 스타일 구분선
            hr: {
              borderColor: 'rgb(229 231 235)', // gray-200
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            // 리스트 스타일 - 여백 줄이고 색상 밝게
            ul: {
              paddingLeft: '1.25rem', // 기본 1.625rem에서 줄임
              color: 'rgb(75 85 99)', // gray-600 (더 밝게)
            },
            ol: {
              paddingLeft: '1.25rem', // 기본 1.625rem에서 줄임
              color: 'rgb(75 85 99)', // gray-600 (더 밝게)
            },
            li: {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              paddingLeft: '0.25rem',
              color: 'rgb(75 85 99)', // gray-600 (더 밝게)
            },
            'ul > li': {
              paddingLeft: '0.25rem',
            },
            'ol > li': {
              paddingLeft: '0.25rem',
            },
            'ul > li::marker': {
              color: 'rgb(75 85 99)', // gray-600 (글씨색과 동일)
            },
            'ol > li::marker': {
              color: 'rgb(75 85 99)', // gray-600 (글씨색과 동일)
            },
            // 비디오 임베딩 스타일
            'figure.video-embed': {
              maxWidth: '100%',
              margin: '2rem auto',
              padding: '0',
            },
            iframe: {
              maxWidth: '100%',
              margin: '0',
              padding: '0',
            },
            // 북마크 스타일
            '.bookmark': {
              border: '1px solid rgb(209 213 219)',
              borderRadius: '0.5rem',
              padding: '1rem',
              margin: '1.5rem 0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.875rem',
              backgroundColor: 'rgb(249 250 251)',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'rgb(147 197 253)',
                backgroundColor: 'rgb(239 246 255)',
                boxShadow: '0 4px 12px -2px rgb(59 130 246 / 0.15)',
                transform: 'translateY(-2px)',
              },
            },
            '.bookmark-icon': {
              width: '1.25rem',
              height: '1.25rem',
              flexShrink: '0',
              marginTop: '0.125rem',
              marginRight: '0.25rem',
              color: 'rgb(59 130 246)',
            },
            '.bookmark-content': {
              flex: '1',
              minWidth: '0',
            },
            '.bookmark-title': {
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'rgb(17 24 39)',
              marginBottom: '0.25rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            '.bookmark-url': {
              fontSize: '0.75rem',
              color: 'rgb(107 114 128)',
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              '&:hover': {
                color: 'rgb(59 130 246)',
              },
            },
            // 파일 다운로드 스타일
            '.file-download': {
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgb(249 250 251)',
              border: '1px solid rgb(209 213 219)',
              borderRadius: '0.5rem',
              margin: '1rem 0',
              gap: '0.875rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'rgb(239 246 255)',
                borderColor: 'rgb(147 197 253)',
                boxShadow: '0 2px 8px -2px rgb(59 130 246 / 0.2)',
                transform: 'translateX(2px)',
              },
            },
            '.file-icon': {
              width: '1.25rem',
              height: '1.25rem',
              flexShrink: '0',
              marginRight: '0.25rem',
              color: 'rgb(59 130 246)',
            },
            '.file-name': {
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'rgb(55 65 81)',
              textDecoration: 'none',
              '&:hover': {
                color: 'rgb(59 130 246)',
              },
            },
            '.file-size': {
              fontSize: '0.75rem',
              color: 'rgb(107 114 128)',
              marginLeft: '0.5rem',
            },
          },
        },
        // 다크모드 invert 스타일
        invert: {
          css: {
            // 다크모드 링크
            a: {
              color: 'rgb(96 165 250)', // blue-400
              textDecorationColor: 'rgba(96, 165, 250, 0.4)',
              '&:hover': {
                color: 'rgb(147 197 253)', // blue-300
                textDecorationColor: 'rgb(147 197 253)',
                textDecorationThickness: '2px',
              },
            },
            // 다크모드 인라인 코드 스타일
            code: {
              color: 'rgb(244 114 182)', // pink-400 (더 밝은 pink)
              backgroundColor: 'rgb(31 41 55)', // gray-800 (어두운 배경)
              border: '1px solid rgb(55 65 81)', // gray-700
            },
            // 다크모드 코드 블록
            pre: {
              backgroundColor: 'rgb(15 23 42)', // slate-900
              color: 'rgb(203 213 225)', // slate-300
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              borderRadius: '0',
              border: 'none',
            },
            // 다크모드 테이블
            th: {
              backgroundColor: 'rgb(31 41 55)', // gray-800
              border: '1px solid rgb(55 65 81)', // gray-700
              color: 'rgb(229 231 235)', // gray-200
            },
            td: {
              border: '1px solid rgb(55 65 81)', // gray-700
              color: 'rgb(209 213 219)', // gray-300
            },
            // 다크모드 인용구
            blockquote: {
              borderLeft: '4px solid rgb(55 65 81)', // gray-700
              backgroundColor: 'rgb(31 41 55)', // gray-800
              color: 'rgb(229 231 235)', // gray-200
            },
            // 다크모드 리스트 스타일 - 여백 줄이고 색상 밝게
            ul: {
              paddingLeft: '1.25rem',
              color: 'rgb(203 213 225)', // slate-300 (더 밝게)
            },
            ol: {
              paddingLeft: '1.25rem',
              color: 'rgb(203 213 225)', // slate-300 (더 밝게)
            },
            li: {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              paddingLeft: '0.25rem',
              color: 'rgb(203 213 225)', // slate-300 (더 밝게)
            },
            'ul > li': {
              paddingLeft: '0.25rem',
            },
            'ol > li': {
              paddingLeft: '0.25rem',
            },
            'ul > li::marker': {
              color: 'rgb(203 213 225)', // slate-300 (글씨색과 동일)
            },
            'ol > li::marker': {
              color: 'rgb(203 213 225)', // slate-300 (글씨색과 동일)
            },
            // 다크모드 비디오 임베딩
            'figure.video-embed': {
              maxWidth: '100%',
              margin: '2rem auto',
              padding: '0',
            },
            iframe: {
              maxWidth: '100%',
              margin: '0',
              padding: '0',
            },
            // 다크모드 북마크
            '.bookmark': {
              border: '1px solid rgb(55 65 81)',
              backgroundColor: 'rgb(31 41 55)',
              gap: '0.875rem',
              '&:hover': {
                borderColor: 'rgb(96 165 250)',
                backgroundColor: 'rgb(30 58 138)',
                boxShadow: '0 4px 12px -2px rgb(96 165 250 / 0.2)',
              },
            },
            '.bookmark-icon': {
              color: 'rgb(147 197 253)',
              marginRight: '0.25rem',
            },
            '.bookmark-title': {
              color: 'rgb(243 244 246)',
            },
            '.bookmark-url': {
              color: 'rgb(156 163 175)',
              '&:hover': {
                color: 'rgb(147 197 253)',
              },
            },
            // 다크모드 파일 다운로드
            '.file-download': {
              backgroundColor: 'rgb(31 41 55)',
              border: '1px solid rgb(55 65 81)',
              gap: '0.875rem',
              '&:hover': {
                backgroundColor: 'rgb(30 58 138)',
                borderColor: 'rgb(96 165 250)',
                boxShadow: '0 2px 8px -2px rgb(96 165 250 / 0.3)',
              },
            },
            '.file-icon': {
              color: 'rgb(147 197 253)',
              marginRight: '0.25rem',
            },
            '.file-name': {
              color: 'rgb(229 231 235)',
              '&:hover': {
                color: 'rgb(147 197 253)',
              },
            },
            '.file-size': {
              color: 'rgb(156 163 175)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}