import { IGroupEntity, IGroupWithUsersModel } from 'entix-shared'
import { useAtom } from 'jotai'
import { editGroupAtom, editGroupStatusAtom } from '@/store/group.atom'
import { Avatar, Button, Tooltip } from 'antd'
import cn from 'classnames'
import {
  EditOutlined,
  WalletOutlined,
  CalendarOutlined,
  UserOutlined,
  AntDesignOutlined,
} from '@ant-design/icons'

export interface IGroupRowCard extends React.HTMLAttributes<HTMLDivElement> {
  group: IGroupWithUsersModel
}

export const GroupRowCard = ({ group, className, ...props }: IGroupRowCard) => {
  const [, setEditGroup] = useAtom(editGroupAtom)
  const [, setIsEditingGroup] = useAtom(editGroupStatusAtom)
  return (
    <div
      {...props}
      className={cn(
        'bg-white rounded-lg items-center text-sm text-slate-700 p-2 md:p-4 grid grid-flow-row grid-rows-3  grid-cols-[0.5fr,1fr,0.2fr] md:grid-flow-cols md:grid-rows-1 md:grid-cols-[0.5fr,1fr,1fr,1fr,1fr]',
        className,
      )}
    >
      <div className="flex h-full row-span-3 justify-center items-center md:justify-start">
        <Avatar.Group maxCount={2}>
          {group &&
            group?.users?.map((user) => (
              <Tooltip
                key={user.id}
                title={`${user.first_name} ${user.last_name}`}
                placement="top"
              >
                <Avatar
                  style={{
                    backgroundColor:
                      user?.sex == 'male' ? '#3291a8' : '#cc233f',
                  }}
                  src={user.profile_image_url}
                >
                  {user.first_name[0]}
                </Avatar>
              </Tooltip>
            ))}
        </Avatar.Group>
      </div>
      <span className="">{group.name}</span>
      <div
        id="actions"
        className="flex flex-col md:flex-row md:gap-1 col-start-3 col-end-4 row-start-1 row-end-4 md:col-start-auto md:col-end-auto md:row-start-auto md:row-end-auto"
      >
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => {
            setEditGroup(group)
            setIsEditingGroup(true)
          }}
        />
        <Button
          type="text"
          shape="circle"
          icon={<WalletOutlined />}
          //   onClick={() => {
          //     console.log('hello there')
          //     setEditGroup(user)
          //     setIsManageWallet(true)
          //   }}
        />
        <Button type="text" shape="circle" icon={<CalendarOutlined />} />
      </div>
    </div>
  )
}
