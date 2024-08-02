import cn from 'classnames'
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
