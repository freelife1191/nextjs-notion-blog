'use client'

import React from 'react'
import { useTheme } from './ThemeProvider'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeIcon, type ThemeIconName } from '@/lib/icons'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getCurrentTheme = (): ThemeIconName => {
    if (theme === 'system') {
      return 'system'
    }
    if (resolvedTheme === 'dark') {
      return 'dark'
    }
    return 'light'
  }

  const getTooltip = () => {
    if (theme === 'system') {
      return '시스템 설정 사용 중'
    }
    if (resolvedTheme === 'dark') {
      return '다크 모드'
    }
    return '라이트 모드'
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <ThemeIcon theme={getCurrentTheme()} size={20} />
      </motion.div>
    </Button>
  )
}
