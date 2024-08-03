import {
  UserOutlined,
  ScheduleOutlined,
  LockOutlined,
  AreaChartOutlined,
  TeamOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

export const adminSidebarMenuItems: MenuItem[] = [
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
        label: 'List',
        key: '/users/list',
        icon: <UserOutlined />,
      },
      {
        label: 'Groups',
        key: '/groups/list',
        icon: <TeamOutlined />,
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
