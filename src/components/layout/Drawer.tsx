import { isLoginAtom } from '@/store/auth.atom'
import cn from 'classnames'
import { useAtom } from 'jotai'

export interface IDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean
  onClose: () => void
}

export const Drawer = (props: IDrawerProps) => {
  const { className, children, show, onClose, ...restProps } = props
  const [isLogin] = useAtom(isLoginAtom)
  return (
    isLogin && (
      <>
        <div
          className={cn(
            'z-30 fixed md:relative w-60 inset-y-0 md:translate-x-0',
            'transform transition-all duration-300 ease-in-out',
            className,
            { 'translate-x-0': show },
            { '-translate-x-full block': !show },
          )}
          {...restProps}
        >
          {children}
        </div>
        {/* Overlay */}
        {show && (
          <div
            onClick={() => onClose()}
            className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
          ></div>
        )}
      </>
    )
  )
}
