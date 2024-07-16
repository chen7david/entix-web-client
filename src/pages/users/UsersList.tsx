import { useEffect, useState } from 'react'
import { http } from './../../http'
import { Table, TableColumnsType } from 'antd'
import {
  IViewUserDto,
  IPaginatedFilterResponse,
  ICreateUserDto,
} from 'entix-shared'
import { UserCreateModal } from './UserCreateModal'
import { UserDeleteModel } from './UserDeleteModel'

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
  const [users, setUsers] = useState<IViewUserDto[]>([])

  useEffect(() => {
    getUsers()
  }, [])

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
        <UserDeleteModel user={object} onSubmit={deleteUser} />
      ),
    },
  ]

  async function getUsers() {
    const { data } = await http.get<IPaginatedFilterResponse<IViewUserDto[]>>(
      '/api/v1/users?sortBy=id:desc',
    )
    setUsers(data.data)
  }

  async function createUser(formData: ICreateUserDto) {
    const { data: user } = await http.post('/api/v1/users', formData)
    setUsers((prevUsers) => [user, ...prevUsers])
  }

  async function deleteUser(user: IViewUserDto) {
    const { data } = await http.delete('/api/v1/users/' + user.id)
    console.log(data)
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id))
  }

  return (
    <div className="">
      <UserCreateModal onSubmit={createUser} />
      <Table rowKey="id" dataSource={users} columns={columns} />
    </div>
  )
}
