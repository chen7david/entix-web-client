import { useEffect, useState } from 'react'
import { http } from './../../http'
import { Button, Table, TableColumnsType } from 'antd'
import {
  IViewUserDto,
  IPaginatedFilterResponse,
  ICreateUserDto,
} from 'entix-shared'
import { UserCreateModal } from './UserCreateModal'

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

const columns: TableColumnsType<IViewUserDto> = [
  {
    title: 'UserId',
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
  },
]

export const UsersList = () => {
  const [users, setUsers] = useState<IViewUserDto[]>([])

  async function getUsers() {
    const { data } = await http.get<IPaginatedFilterResponse<IViewUserDto[]>>(
      '/api/v1/users?sortBy=id:desc',
    )
    setUsers(data.data)
  }

  useEffect(() => {
    getUsers()
  }, [])

  async function createUser(formData: ICreateUserDto) {
    const { data: user } = await http.post('/api/v1/users', formData)
    setUsers((prevUsers) => [...prevUsers, user])
  }

  return (
    <div className="">
      <UserCreateModal onSubmit={createUser} />
      <Table rowKey="id" dataSource={users} columns={columns} />
    </div>
  )
}
