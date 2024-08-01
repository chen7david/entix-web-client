import cn from 'classnames'

export const PageContainer = ({
  className,
  children,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('m-5', className)} {...restProps}>
      {children}
    </div>
  )
}
