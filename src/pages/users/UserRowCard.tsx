import { UserAvatar } from './UserAvatar'
import { daysUntilBirthday, getAge, IUser } from 'entix-shared'
import { useAtom } from 'jotai'
import {
  editUserAtom,
  editUserStatusAtom,
  manageWalletStatusAtom,
} from '@/store/update.atom'
import { Badge, Button } from 'antd'
import cn from 'classnames'
import {
  EditOutlined,
  WalletOutlined,
  CalendarOutlined,
} from '@ant-design/icons'

export interface IUserRowCard extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
}

export const UserRowCard = ({ user, className, ...props }: IUserRowCard) => {
  const [, setEditUser] = useAtom(editUserAtom)
  const [, setIsEditingUser] = useAtom(editUserStatusAtom)
  const [, setIsManageWallet] = useAtom(manageWalletStatusAtom)
  return (
    <div
      {...props}
      className={cn(
        'bg-white rounded-lg items-center text-sm text-slate-700 p-2 md:p-4 grid grid-flow-row grid-rows-3  grid-cols-[0.5fr,1fr,0.2fr] md:grid-flow-cols md:grid-rows-1 md:grid-cols-[0.5fr,1fr,1fr,1fr,1fr]',
        className,
      )}
    >
      <div className="flex h-full row-span-3 justify-center items-center md:justify-start">
        <UserAvatar className="" user={user} />
      </div>
      <span className="">{`${user.firstName} ${user.lastName}`}</span>

      <div id="age" className="flex md:gap-1 ">
        <span>{getAge(user.dateOfBirth.toString())}</span>
        <Badge
          className="ml-3"
          count={
            daysUntilBirthday(user.dateOfBirth.toString()) < 30
              ? `${daysUntilBirthday(user.dateOfBirth.toString())} days`
              : 0
          }
        ></Badge>
      </div>
      <div className="text-xs">{user.xid}</div>
      <div
        id="actions"
        className="flex flex-col md:flex-row md:gap-1 col-start-3 col-end-4 row-start-1 row-end-4 md:col-start-auto md:col-end-auto md:row-start-auto md:row-end-auto"
      >
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => {
            setEditUser(user)
            setIsEditingUser(true)
          }}
        />
        <Button
          type="text"
          shape="circle"
          icon={<WalletOutlined />}
          onClick={() => {
            setEditUser(user)
            setIsManageWallet(true)
          }}
        />
        <Button type="text" shape="circle" icon={<CalendarOutlined />} />
      </div>
    </div>
  )
}
