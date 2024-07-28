import { Avatar, Badge, Table, TableColumnsType } from 'antd'
import { IViewUserDto, daysUntilBirthday, getAge } from 'entix-shared'
import { UserAddEditForm } from './UserAddEditForm'
import { useQuery } from '@tanstack/react-query'
import { findUsers } from '@/api/client.api'
import { useAtom } from 'jotai'
import { editUserAtom, editUserStatusAtom } from '@/store/update.atom'
import { Indicator } from '@/components/Indicator'

export const UsersList = () => {
  const [, setEditUser] = useAtom(editUserAtom)
  const [, setIsEditingUser] = useAtom(editUserStatusAtom)

  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: findUsers,
  })

  const tableAvatar = (user: IViewUserDto) => {
    return (
      <Avatar
        src={user?.profile_image_url}
        style={{ backgroundColor: user.sex == 'male' ? '#3291a8' : '#cc233f' }}
        size={38}
      >
        {user?.first_name[0]}
      </Avatar>
    )
  }

  const columns: TableColumnsType<IViewUserDto> = [
    {
      title: '#',
      dataIndex: 'avatar',
      key: 'profile_image_url',
      responsive: ['md'],
      render: (_, user) => tableAvatar(user),
    },
    {
      title: 'id',
      dataIndex: 'userid',
      key: 'accid',
      responsive: ['md'],
      render: (text) => <span className="text-sm cursor-pointer">{text}</span>,
    },
    {
      title: 'username',
      dataIndex: 'username',
      key: 'username',
      render: (text, user) => (
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => {
            setEditUser(user)
            setIsEditingUser(true)
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'age',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      render: (text) => (
        <div className="flex">
          <span>{getAge(text)}</span>
          <span className="ml-5">
            <Badge
              count={
                daysUntilBirthday(text) < 30
                  ? `${daysUntilBirthday(text)} days`
                  : 0
              }
            ></Badge>
          </span>
        </div>
      ),
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg'],
      render: (text, user) => (
        <span className="">
          <Indicator color={user.activated_at ? 'green' : 'orange'} />
          {text}
        </span>
      ),
    },
  ]

  return (
    <div>
      <UserAddEditForm />
      <Table
        loading={userQuery.isLoading}
        rowKey="id"
        dataSource={userQuery.data?.data}
        columns={columns}
      />
    </div>
  )
}
