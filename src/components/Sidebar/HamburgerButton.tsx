import { useAtom } from 'jotai'
import React from 'react'
import { sidebarOpenAtom } from '../../store/sidebar.atom'

export const HamburgerButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const [isSideBarOpen, setIsSideBarOpenAtom] = useAtom(sidebarOpenAtom)

  const toggleSidebar = () => {
    setIsSideBarOpenAtom(!isSideBarOpen)
  }
  return (
    <button onClick={toggleSidebar} {...props}>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  )
}
