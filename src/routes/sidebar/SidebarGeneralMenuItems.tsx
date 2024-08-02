import {
  HomeOutlined,
  BookOutlined,
  ShoppingOutlined,
  WalletOutlined,
  UserOutlined,
  YoutubeOutlined,
  TruckOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

export const sidebarGeneralMenuItems: MenuItem[] = [
  {
    label: 'Home',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: 'Profile',
    key: '/profile',
    icon: <UserOutlined />,
  },
  {
    label: 'Lessons',
    key: '/lessons',
    icon: <BookOutlined />,
  },
  {
    label: 'Shop',
    key: '/shop',
    icon: <ShoppingOutlined />,
  },
  {
    label: 'Wallet',
    key: '/wallet',
    icon: <WalletOutlined />,
  },
  {
    label: 'Movies',
    key: '/movies',
    icon: <YoutubeOutlined />,
  },

  {
    label: 'Orders',
    key: '/orders',
    icon: <TruckOutlined />,
  },
]
