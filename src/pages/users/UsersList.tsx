import { Table, TableColumnsType } from 'antd'
import { IViewUserDto } from 'entix-shared'
import { UserCreateModal } from './UserCreateModal'
import { UserDeleteModel } from './UserDeleteModel'
import { useQuery } from '@tanstack/react-query'
import { findUsers } from './../../api/client.api'

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

  const columns: TableColumnsType<IViewUserDto> = [
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
