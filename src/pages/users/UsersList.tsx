import { Table, TableColumnsType } from 'antd'
import { IPaginatedFilterResponse, IViewUserDto } from 'entix-shared'
import { UserCreateModal } from './UserCreateModal'
import { UserDeleteModel } from './UserDeleteModel'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, findUsers } from './../../api/client.api'

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
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: findUsers,
  })

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData(
        ['users'],
        (oldUsers: IPaginatedFilterResponse<IViewUserDto[]>) => {
          oldUsers.data = [newUser, ...oldUsers.data]
          return oldUsers
        },
      )
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: (userId) => {
      queryClient.setQueryData(
        ['users'],
        (oldUsers: IPaginatedFilterResponse<IViewUserDto[]>) => {
          oldUsers.data = oldUsers.data.filter((u) => u.id !== userId)
          return oldUsers
        },
      )
    },
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
      render: (_, user) => (
        <UserDeleteModel
          user={user}
          onSubmit={async (id) => deleteUserMutation.mutate(id)}
        />
      ),
    },
  ]

  return (
    <div>
      <UserCreateModal
        onSubmit={async (data) => createUserMutation.mutate(data)}
      />
      <Table
        loading={userQuery.isLoading}
        rowKey="id"
        dataSource={userQuery.data?.data}
        columns={columns}
      />
    </div>
  )
}
