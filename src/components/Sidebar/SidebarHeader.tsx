import cn from 'classnames'
export interface ISidebarDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...restProps } = props
  return (
    <div className={cn(className, 'flex h-24')} {...restProps}>
      {children}
    </div>
  )
}
