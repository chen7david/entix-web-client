import { useState } from 'react'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { sidebarMenuData } from './SidebarMenuData'

export interface SidebarMenuProps {
  onClick: () => void
}

export const SidebarMenu = ({ onClick }: SidebarMenuProps) => {
  const [current, setCurrent] = useState('mail')
  const navigate = useNavigate()

  const menuOnClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    navigate(e.key)
    onClick()
  }

  return (
    <Menu
      onClick={menuOnClick}
      selectedKeys={[current]}
      mode="vertical"
      items={sidebarMenuData}
      style={{ borderRight: 'none' }}
    />
  )
}
