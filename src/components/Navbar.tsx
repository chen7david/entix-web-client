import React, { useState } from 'react'
import { HomeOutlined, BookOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Menu, Avatar } from 'antd'
import viteLogo from '/vite.svg'

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    label: 'Home',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: 'Register',
    key: '/register',
    icon: <BookOutlined />,
  },
]

export const Navbar: React.FC = () => {
  const [current, setCurrent] = useState('mail')
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    navigate(e.key)
  }

  return (
    <div className="flex items-center">
      <Avatar shape="square" className="m-3" src={viteLogo} />
      <Menu
        className="pt-5"
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
    </div>
  )
}
