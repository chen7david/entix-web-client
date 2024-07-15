import { useEffect, useState } from 'react'
import { http } from './../../http'
import { Button, Table, TableColumnsType } from 'antd'
import { IViewUserDto, IPaginatedFilterResponse } from 'entix-shared'

const columns: TableColumnsType<IViewUserDto> = [
  {
    title: 'UserId',
    dataIndex: 'userid',
    key: 'accid',
    responsive: ['md'],
  },
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'username',
    dataIndex: 'username',
    key: 'username',
  },
]

export const UsersList = () => {
  const [users, setUsers] = useState<IViewUserDto[]>([])

  async function getUsers() {
    const { data } =
      await http.get<IPaginatedFilterResponse<IViewUserDto[]>>('/api/v1/users')
    setUsers(data.data)
  }

  useEffect(() => {
    getUsers()
  }, [])

  async function createUser() {
    await http.post('/api/v1/users', {})
  }

  return (
    <div className="">
      <Button onClick={createUser} className="mb-5">
        New User
      </Button>
      <Table rowKey="id" dataSource={users} columns={columns} />
    </div>
  )
}
