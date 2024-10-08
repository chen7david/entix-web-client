import { Avatar, Button } from 'antd'
import cn from 'classnames'
import React from 'react'
import { SidebarMenu } from './SidebarMenu'
import { useAtom } from 'jotai'
import { currUserAtom, isAdminAtom, isLoginAtom } from '@/store/auth.atom'
import { BrowserStore } from '@/store/browserstore.store'
import { useQuery } from '@tanstack/react-query'
import { getCurrUserEtpBalance } from '@/api/client.api'
import { SidebarHeader } from './SidebarHeader'
import { SidebarBody } from './SidebarBody'
import { SidebarFooter } from './SidebarFooter'
import { MoneyBadge } from '../MoneyBadge'

export interface ISidebarDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: ISidebarDrawerProps) {
  const [isLogin, setIsLogin] = useAtom(isLoginAtom)
  const [, setIsAdmin] = useAtom(isAdminAtom)
  const [currUser] = useAtom(currUserAtom)

  const getBalanceQuery = useQuery({
    queryKey: ['currUser:etpBalance'],
    queryFn: getCurrUserEtpBalance,
  })

  const onLogout = () => {
    setIsLogin(false)
    setIsAdmin(false)
    BrowserStore.clear()
  }

  return (
    isLogin && (
      <div {...props} className={cn('flex flex-col h-full', className)}>
        <SidebarHeader className="p-4 flex items-center gap-2">
          <Avatar
            src={currUser?.imageUrl}
            style={{ backgroundColor: '#3291a8' }}
            size={52}
          >
            {currUser?.firstName[0]}
          </Avatar>
          <div className="flex flex-col text-gray-800 gap-1">
            <div className="text-sm font-bold">
              {currUser ? currUser.username : 'unkown'}
            </div>
            <MoneyBadge
              balance={getBalanceQuery.data?.balance}
              currency="USD"
              decimals={0}
            />
          </div>
          <hr className="lex-grow border-gray-200" />
        </SidebarHeader>
        <SidebarBody>
          <SidebarMenu />
        </SidebarBody>
        <SidebarFooter className="p-4 flex items-center justify-between">
          <Button onClick={onLogout} block>
            Logout
          </Button>
        </SidebarFooter>
      </div>
    )
  )
}
