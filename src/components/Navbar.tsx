import React from 'react'

export const Navbar = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <header className="flex items-center justify-between h-16 px-4">
      {children}
    </header>
  )
}
