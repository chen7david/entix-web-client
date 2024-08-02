import { Avatar, Badge } from 'antd'
import { IViewUserDto } from 'entix-shared'
import cn from 'classnames'

export interface IUserAvatar extends React.HTMLAttributes<HTMLDivElement> {
  user: IViewUserDto
}

export const UserAvatar = ({ user, className, ...props }: IUserAvatar) => {
  return (
    <div {...props} className={cn('flex items-center', className)}>
      <Badge className="mr-2" color={user.activated_at ? 'green' : 'orange'} />
      <Avatar
        src={user?.profile_image_url}
        style={{
          backgroundColor: user?.sex == 'male' ? '#3291a8' : '#cc233f',
        }}
        size={38}
      >
        {user?.first_name[0]}
      </Avatar>
    </div>
  )
}
