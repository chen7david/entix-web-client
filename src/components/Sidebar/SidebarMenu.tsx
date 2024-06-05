import { useState } from 'react'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { sidebarAdminMenuData, sidebarMenuData } from './SidebarMenuItems'

export interface SidebarMenuProps {
  onClick: () => void
  isAdmin: boolean
}

export const SidebarMenu = ({ onClick, isAdmin }: SidebarMenuProps) => {
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
      mode="inline"
      items={
        isAdmin ? sidebarMenuData.concat(sidebarAdminMenuData) : sidebarMenuData
      }
      style={{ borderRight: 'none' }}
    />
  )
}
