import cn from 'classnames'
import React from 'react'

export interface ISidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClick: () => void
}

export const Sidebar = (props: ISidebarProps) => {
  const { className, isOpen, onClick, children, ...restProps } = props
  return (
    <>
      <div
        className={cn(
          className,
          'fixed z-30 md:relative md:translate-x-0 inset-y-0 w-64 transform transition-transform duration-300 ease-in-out',
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
    <div className={cn(className, 'flex h-16')} {...restProps}>
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
    <div className={cn(className, 'flex-1 overflow-y-scroll')} {...restProps}>
      {children}
    </div>
  )
}
