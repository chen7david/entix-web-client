import cn from 'classnames'

export const PageContainer = ({
  className,
  children,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('m-5 max-w-1200', className)} {...restProps}>
      {children}
    </div>
  )
}
