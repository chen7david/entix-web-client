import { useState } from 'react'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { sidebarAdminMenuData, sidebarMenuData } from './SidebarMenuItems'
import { useAtom } from 'jotai'
import { isAdminAtom } from '@/store/auth.atom'
import { sidebarOpenAtom } from '@/store/sidebar.atom'

export const SidebarMenu = () => {
  const [current, setCurrent] = useState('mail')
  const navigate = useNavigate()
  const [isAdmin] = useAtom(isAdminAtom)
  const [isSideBarOpen, setIsSideBarOpenAtom] = useAtom(sidebarOpenAtom)

  const menuOnClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    navigate(e.key)
    setIsSideBarOpenAtom(!isSideBarOpen)
  }

  return (
    <Menu
      onClick={menuOnClick}
      selectedKeys={[current]}
      mode="inline"
      items={
        isAdmin ? sidebarMenuData.concat(sidebarAdminMenuData) : sidebarMenuData
      }
      style={{ borderRight: 'none', backgroundColor: '#f5f5f5' }}
    />
  )
}
