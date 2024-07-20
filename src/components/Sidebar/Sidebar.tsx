import { Avatar, Button } from 'antd'
import cn from 'classnames'
import React from 'react'
import { SidebarMenu } from './SidebarMenu'
import { useAtom } from 'jotai'
import { currUserAtom, isAdminAtom, isLoginAtom } from '@/store/auth.atom'
import { BrowserStore } from '@/store/browserstore.store'
import { sideBarOpenAtom } from '@/store/sidebar.atom'

export interface ISidebarDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarDrawer = (props: ISidebarDrawerProps) => {
  const { className, children, ...restProps } = props
  const [isSideBarOpen, setIsSideBarOpen] = useAtom(sideBarOpenAtom)
  return (
    <>
      <div
        className={cn(
          className,
          'fixed z-30 md:relative md:translate-x-0 inset-y-0 w-56 transform transition-transform duration-300 ease-in-out',
          { 'translate-x-0': isSideBarOpen },
          { '-translate-x-full': !isSideBarOpen },
        )}
        {...restProps}
      >
        {children}
      </div>
      {/* Overlay */}
      {isSideBarOpen && (
        <div
          onClick={() => setIsSideBarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
        ></div>
      )}
    </>
  )
}

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
  const [, setIsLogin] = useAtom(isLoginAtom)
  const [, setIsAdmin] = useAtom(isAdminAtom)
  const [currUser] = useAtom(currUserAtom)

  const onLogout = () => {
    setIsLogin(false)
    setIsAdmin(false)
    BrowserStore.clear()
  }

  return (
    <SidebarDrawer className="bg-white">
      <SidebarContainer>
        <SidebarHeader className=" p-4 flex items-center gap-2">
          <Avatar
            src={currUser?.profile_image_url}
            style={{ backgroundColor: '#3291a8' }}
            size={56}
          >
            {currUser?.first_name[0]}
          </Avatar>
          <div className="flex flex-col">
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
      </SidebarContainer>
    </SidebarDrawer>
  )
}
