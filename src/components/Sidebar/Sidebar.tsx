import { Avatar, Button } from 'antd'
import cn from 'classnames'
import React from 'react'
import { SidebarMenu } from './SidebarMenu'
import { useAtom } from 'jotai'
import { currUserAtom } from './../../store/auth.atom'

export interface ISidebarDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClick: () => void
}

export interface ISidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  isAdmin: boolean
  onToggleOpen: () => void
  onLogout: () => void
}

export const SidebarDrawer = (props: ISidebarDrawerProps) => {
  const { className, isOpen, onClick, children, ...restProps } = props
  return (
    <>
      <div
        className={cn(
          className,
          'fixed z-30 md:relative md:translate-x-0 inset-y-0 w-56 transform transition-transform duration-300 ease-in-out',
          { 'translate-x-0': isOpen },
          { '-translate-x-full': !isOpen },
        )}
        {...restProps}
      >
        {children}
      </div>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClick}
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

export function Sidebar({
  isOpen,
  isAdmin,
  onLogout,
  onToggleOpen,
}: ISidebarProps) {
  const [currUser] = useAtom(currUserAtom)
  return (
    <SidebarDrawer className="bg-white" isOpen={isOpen} onClick={onToggleOpen}>
      <SidebarContainer>
        <SidebarHeader className=" p-4 flex items-center gap-2">
          <Avatar size={50} />
          <div className="flex flex-col">
            <div className="text-sm font-bold">
              {currUser ? currUser.username : 'unkown'}
            </div>
            <div className="text-xs font-light ">Teacher</div>
          </div>
          <hr className="lex-grow border-gray-200" />
        </SidebarHeader>
        <SidebarBody>
          <SidebarMenu isAdmin={isAdmin} onClick={onToggleOpen} />
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
