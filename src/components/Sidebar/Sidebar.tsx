import { Avatar, Button } from 'antd'
import cn from 'classnames'
import React from 'react'
import { SidebarMenu } from './SidebarMenu'
import { useAtom } from 'jotai'
import { currUserAtom, isAdminAtom, isLoginAtom } from '@/store/auth.atom'
import { BrowserStore } from '@/store/browserstore.store'

export interface ISidebarDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContainer = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const { className, children, ...restProps } = props
  return (
    <div className={cn(className, 'flex flex-col h-full')} {...restProps}>
      {children}
    </div>
  )
}

export const SidebarHeader = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...restProps } = props
  return (
    <div className={cn(className, 'flex h-24')} {...restProps}>
      {children}
    </div>
  )
}

export const SidebarFooter = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...restProps } = props
  return (
    <div className={cn(className, 'flex h-16')} {...restProps}>
      {children}
    </div>
  )
}

export const SidebarBody = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...restProps } = props
  return (
    <div
      className={cn(className, 'flex-1 overflow-y-scroll p-2')}
      {...restProps}
    >
      {children}
    </div>
  )
}

export function Sidebar() {
  const [isLogin, setIsLogin] = useAtom(isLoginAtom)
  const [, setIsAdmin] = useAtom(isAdminAtom)
  const [currUser] = useAtom(currUserAtom)

  const onLogout = () => {
    setIsLogin(false)
    setIsAdmin(false)
    BrowserStore.clear()
  }

  return (
    isLogin && (
      <div className="flex flex-col h-full">
        <SidebarHeader className="p-4 flex items-center gap-2">
          <Avatar
            src={currUser?.profile_image_url}
            style={{ backgroundColor: '#3291a8' }}
            size={52}
          >
            {currUser?.first_name[0]}
          </Avatar>
          <div className="flex flex-col text-gray-800">
            <div className="text-sm font-bold">
              {currUser ? currUser.username : 'unkown'}
            </div>
            <div className="text-xs font-light ">
              {currUser ? currUser.userid : 'unkown'}
            </div>
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
