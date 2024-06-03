import cn from 'classnames'
import React from 'react'

export const AppContainer = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...restProps } = props
  return (
    <div
      className={cn('flex h-[calc(100dvh)] bg-blue-100', className)}
      {...restProps}
    >
      {children}
    </div>
  )
}

export const Main = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...restProps } = props
  return (
    <div className={cn('flex flex-col flex-1', className)} {...restProps}>
      {children}
    </div>
  )
}

export const MainContainer = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...restProps } = props
  return (
    <div className={cn('flex-1 overflow-y-auto p-4', className)} {...restProps}>
      {children}
    </div>
  )
}
