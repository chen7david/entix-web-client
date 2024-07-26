import { isLoginAtom } from '@/store/auth.atom'
import { useAtom } from 'jotai'
import React from 'react'

export const Navbar = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
  const [isLogin] = useAtom(isLoginAtom)
  return (
    isLogin && (
      <header className="flex items-center justify-between h-16 px-4">
        {children}
      </header>
    )
  )
}
