import {
  Avatar,
  Badge,
  Button,
  Form,
  Input,
  Spin,
  Table,
  TableColumnsType,
} from 'antd'
import { IViewUserDto, daysUntilBirthday, getAge } from 'entix-shared'
import { UserAddEditForm } from './UserAddEditForm'
import { useInfiniteQuery } from '@tanstack/react-query'
import { findUsers } from '@/api/client.api'
import { useAtom } from 'jotai'
import { editUserAtom, editUserStatusAtom } from '@/store/update.atom'
import { SearchOutlined } from '@ant-design/icons'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { z } from 'zod'
import { createSchemaFieldRule } from 'antd-zod'
import { useSearchParams } from 'react-router-dom'
import { Toolbar } from '@/components/Layout/Toolbar'
import { PageContainer } from '@/components/Layout/PageContainer'

const FullNameSearch = z.object({
  full_name: z
    .string()
    .regex(/^[a-zA-Z0-9 ]*$/, 'Must be alphanumeric and can include spaces'),
})

export const UsersList = () => {
  const [form] = Form.useForm()
  const [, setEditUser] = useAtom(editUserAtom)
  const [, setIsEditingUser] = useAtom(editUserStatusAtom)
  const { ref, inView } = useInView()
  const [searchParams, setSearchParams] = useSearchParams({
    q: '',
    sortBy: 'created_at:desc',
    limit: '10',
  })

  const q = searchParams.get('q') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const limit = searchParams.get('limit') || ''

  const usePaginatedQuery = useInfiniteQuery({
    queryKey: ['users', q],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      findUsers({ pageParam, searchParams: { q, sortBy, limit } }),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: IViewUserDto[],
      allPages: IViewUserDto[][],
    ) => {
      const nextPage = lastPage.length ? allPages.length * 10 : undefined
      return nextPage
    },
  })

  useEffect(() => {
    if (inView && usePaginatedQuery.hasNextPage) {
      usePaginatedQuery.fetchNextPage()
    }
  }, [inView])

  const tableAvatar = (user: IViewUserDto) => {
    return (
      <Avatar
        src={user?.profile_image_url}
        style={{ backgroundColor: user?.sex == 'male' ? '#3291a8' : '#cc233f' }}
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
      width: '20%',
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
      title: 'name',
      dataIndex: 'first_name',
      key: 'first_name',
      width: '30%',
      render: (_, user) => (
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => {
            setEditUser(user)
            setIsEditingUser(true)
          }}
        >
          <Badge
            className="pr-2"
            color={user.activated_at ? 'green' : 'orange'}
          />
          {`${user.first_name} ${user.last_name}`}
        </span>
      ),
    },
    {
      title: 'age',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      // responsive: ['md'],
      width: '20%',
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
  ]

  const FullNameSearchRule = createSchemaFieldRule(FullNameSearch)

  const onSearch = async () => {
    usePaginatedQuery.refetch()
  }

  return (
    <>
      <Toolbar className="bg-white shadow-sm">
        <Form form={form} layout="inline" onFinish={onSearch}>
          <Form.Item
            initialValue={q}
            name="full_name"
            rules={[FullNameSearchRule]}
          >
            <Input
              size="large"
              allowClear
              placeholder="Firstname lastname"
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchParams((prev: URLSearchParams) => {
                  prev.set('q', e.target.value)
                  return prev
                })
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              hidden={true}
              loading={usePaginatedQuery.isLoading && `${q}` !== ''}
              htmlType="submit"
            >
              Search
            </Button>
          </Form.Item>
        </Form>
        <UserAddEditForm />
      </Toolbar>
      <PageContainer className="flex flex-col gap-4">
        <Table
          showHeader={false}
          pagination={false}
          loading={usePaginatedQuery.isLoading}
          rowKey="id"
          dataSource={usePaginatedQuery?.data?.pages.flat()}
          columns={columns}
          style={{ borderRadius: 0, marginTop: '8px' }}
        />

        {usePaginatedQuery.isFetching ? (
          <span className="m-6 flex justify-center">
            <Spin />
          </span>
        ) : (
          <div ref={ref}></div>
        )}
      </PageContainer>
    </>
  )
}
