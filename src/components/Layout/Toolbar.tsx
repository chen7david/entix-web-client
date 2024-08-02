import { Form } from 'antd'
import cn from 'classnames'
import { HamburgerButton } from '../Sidebar/HamburgerButton'

export const Toolbar = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'z-10 flex items-center sticky top-0 h-16 md:pr-4 md:pl-0 px-4',
        className,
      )}
      {...rest}
    >
      <Form layout="inline">
        <Form.Item>
          <HamburgerButton className="md:hidden" />
        </Form.Item>
      </Form>
      {children}
    </div>
  )
}
