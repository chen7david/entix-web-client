import { Avatar, Badge } from 'antd'
import { IUser } from 'entix-shared'
import cn from 'classnames'

export interface IUserAvatar extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
}

export const UserAvatar = ({ user, className, ...props }: IUserAvatar) => {
  return (
    <div {...props} className={cn('flex items-center', className)}>
      <Badge className="mr-2" color={user.activatedAt ? 'green' : 'orange'} />
      <Avatar
        src={user?.imageUrl}
        style={{
          backgroundColor: user?.sex == 'm' ? '#3291a8' : '#cc233f',
        }}
        size={38}
      >
        {user?.firstName[0]}
      </Avatar>
    </div>
  )
}
