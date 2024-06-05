import {
  HomeOutlined,
  BookOutlined,
  ShoppingOutlined,
  WalletOutlined,
  UserOutlined,
  ScheduleOutlined,
  YoutubeOutlined,
  LockOutlined,
  TruckOutlined,
  AreaChartOutlined,
  TeamOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

export const sidebarAdminMenuData: MenuItem[] = [
  {
    label: 'Admin',
    key: '/admin',
    type: 'group',
    children: [
      {
        label: 'Reports',
        key: '/reports',
        icon: <AreaChartOutlined />,
      },
      {
        label: 'Users',
        key: '/users',
        icon: <TeamOutlined />,
        children: [
          {
            label: 'List',
            key: '/users/list',
            icon: <UserOutlined />,
          },
          {
            label: 'Create',
            key: '/users/create',
            icon: <UserOutlined />,
          },
        ],
      },
      {
        label: 'Roles',
        key: '/roles',
        icon: <LockOutlined />,
      },

      {
        label: 'Store',
        key: '/store',
        icon: <ShopOutlined />,
        children: [
          {
            label: 'Products',
            key: '/store/products',
            icon: <ShopOutlined />,
          },
          {
            label: 'Categories',
            key: '/store/categories',
            icon: <ShopOutlined />,
          },
        ],
      },
    ],
  },
  {
    label: 'Calendar',
    key: '/calendar',
    icon: <ScheduleOutlined />,
  },
]

export const sidebarMenuData: MenuItem[] = [
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
