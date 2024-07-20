import { Avatar, Table, TableColumnsType } from 'antd'
import { IViewUserDto } from 'entix-shared'
import { UserCreateModal } from './UserCreateModal'
import { UserDeleteModel } from './UserDeleteModel'
import { useQuery } from '@tanstack/react-query'
import { findUsers } from '@/api/client.api'

function getAge(dobString: string) {
  const dob = new Date(dobString)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

export const UsersList = () => {
  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: findUsers,
  })

  const tableAvatar = (user: IViewUserDto) => {
    return (
      <Avatar
        src={user?.profile_image_url}
        style={{ backgroundColor: '#3291a8' }}
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
    },
    {
      title: 'username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'age',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      render: (text) => getAge(text),
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg'],
    },
    {
      title: 'actions',
      dataIndex: 'email',
      render: (_, user) => <UserDeleteModel user={user} />,
    },
  ]

  return (
    <div>
      <UserCreateModal />
      <Table
        loading={userQuery.isLoading}
        rowKey="id"
        dataSource={userQuery.data?.data}
        columns={columns}
      />
    </div>
  )
}
