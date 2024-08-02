import cn from 'classnames'

export const MainContainer = ({
  className,
  children,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex-1 overflow-y-auto', className)} {...restProps}>
      {children}
    </div>
  )
}
