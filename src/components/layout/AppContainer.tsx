import cn from 'classnames'

export const AppContainer = ({
  className,
  children,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex h-[calc(100dvh)]', className)} {...restProps}>
      {children}
    </div>
  )
}
