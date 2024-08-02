import cn from 'classnames'
export interface ISidebarDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

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
