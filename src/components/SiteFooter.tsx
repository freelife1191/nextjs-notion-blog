/**
 * 사이트 푸터 컴포넌트
 * 저작권 정보와 소셜 링크를 포함한 푸터
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeVariants, useInViewAnimation } from '@/lib/motion'
import { Github, Mail, AtSign, BookOpen } from 'lucide-react'

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className="border-t border-border mt-4 pt-6 pb-6"
      variants={fadeVariants}
      {...useInViewAnimation}
    >
      <div className="container-blog">
        {/* Navigation Links */}
        <nav className="mb-6" aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <a
                href="/rss.xml"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                RSS Feed
              </a>
            </li>
          </ul>
        </nav>

        {/* Footer Bottom - Two Columns */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Original Author Credit */}
          <div className="text-center md:text-left">
            <p className="text-caption text-muted-foreground">
              © {currentYear} Minseung Kwon. Designed by Minseung Kwon. Licensed under MIT.
            </p>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center justify-center md:justify-end gap-3">
            <a
              href="https://github.com/freelife1191/nextjs-notion-blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="mailto:freelife1191.good@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://www.threads.com/@freelife1191"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Threads"
            >
              <AtSign size={18} />
            </a>
            <a
              href="https://freedeveloper.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Blog"
            >
              <BookOpen size={18} />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
