import { useEffect, useState } from 'react'
import { http } from './../../http'
import { Button, Table, TableColumnsType } from 'antd'

export type IUserEntity = {
  id: number
  accid: string
  username: string
  email: string
  password: string
  avatar_url?: string
  activated_at?: Date | null
}

const columns: TableColumnsType<IUserEntity> = [
  {
    title: 'Accid',
    dataIndex: 'accid',
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
  const [users, setUsers] = useState<IUserEntity[]>([])

  async function getUsers() {
    const { data } = await http.get('/api/v1/users')
    setUsers(data)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="">
      <Button className="mb-5">New User</Button>
      <Table dataSource={users} columns={columns} />
    </div>
  )
}
