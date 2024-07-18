import { http } from './../../http'
import { Table, TableColumnsType } from 'antd'
import {
  IViewUserDto,
  IPaginatedFilterResponse,
  ICreateUserDto,
} from 'entix-shared'
import { UserCreateModal } from './UserCreateModal'
import { UserDeleteModel } from './UserDeleteModel'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function getAge(dobString: string) {
  // Parse the date string to a Date object
  const dob = new Date(dobString)

  // Get today's date
  const today = new Date()

  // Calculate the age
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  // Check if the birthday has occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

export const UsersList = () => {
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 2,
  })

  const userCreateMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData(['users'], (oldUsers: IViewUserDto[]) => [
        newUser,
        ...oldUsers,
      ])
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: (delUser) => {
      queryClient.setQueryData(['users'], (oldUsers: IViewUserDto[]) =>
        oldUsers.filter((u) => u.id !== delUser.id),
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
      render: (_, object) => (
        <UserDeleteModel
          user={object}
          onSubmit={async (formData: IViewUserDto) =>
            deleteUserMutation.mutate(formData)
          }
        />
      ),
    },
  ]

  async function getUsers() {
    const { data } = await http.get<IPaginatedFilterResponse<IViewUserDto[]>>(
      '/api/v1/users?sortBy=id:desc',
    )
    return data.data
  }

  async function createUser(formData: ICreateUserDto): Promise<IViewUserDto> {
    const { data: user } = await http.post('/api/v1/users', formData)
    return user
  }

  async function deleteUser(user: IViewUserDto) {
    const { data } = await http.delete('/api/v1/users/' + user.id)
    return data
  }

  return (
    <div className="">
      <UserCreateModal
        onSubmit={async (data) => userCreateMutation.mutate(data)}
      />
      <Table
        loading={userQuery.isLoading}
        rowKey="id"
        dataSource={userQuery.data}
        columns={columns}
      />
    </div>
  )
}
