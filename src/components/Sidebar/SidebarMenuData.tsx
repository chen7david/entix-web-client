import { HomeOutlined, BookOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

export const sidebarMenuData: MenuItem[] = Array.from(new Array(100)).map(
  (_, i) => ({
    label: 'Register',
    key: `/${i}`,
    icon: i % 2 === 0 ? <BookOutlined /> : <HomeOutlined />,
  }),
)
