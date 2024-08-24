import { Button, Form, Input, Spin } from 'antd'
import { UserAddEditForm } from './UserAddEditForm'
import { useInfiniteQuery } from '@tanstack/react-query'
import { SearchOutlined } from '@ant-design/icons'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { createSchemaFieldRule } from 'antd-zod'
import { useSearchParams } from 'react-router-dom'
import { Toolbar } from '@/components/Layout/Toolbar'
import { PageContainer } from '@/components/Layout/PageContainer'
import { UserRowCard } from './UserRowCard'
import { z } from 'zod'
import { UserWalletForm } from './UserWalletForm'
import { findUsers } from '@/api/clients/user.client'

const FullNameSearch = z.object({
  full_name: z
    .string()
    .regex(/^[a-zA-Z0-9 ]*$/, 'Must be alphanumeric and can include spaces'),
})

export const UsersList = () => {
  const [form] = Form.useForm()
  const { ref, inView } = useInView()
  const [searchParams, setSearchParams] = useSearchParams({
    firstName: '',
    limit: '10',
  })

  const firstName = searchParams.get('firstName') || ''
  const limit = searchParams.get('limit') || ''

  const usePaginatedQuery = useInfiniteQuery({
    queryKey: ['users', { firstName }],
    getNextPageParam: (prevData) => prevData.cursor,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      findUsers({
        pageParam,
        searchParams: { firstName, limit: parseInt(limit, 10) },
      }),
    initialPageParam: null,
    select: ({ pages }) => pages.flatMap(({ items }) => items),
  })

  useEffect(() => {
    if (inView && usePaginatedQuery.hasNextPage) {
      usePaginatedQuery.fetchNextPage()
    }
  }, [inView])

  const FullNameSearchRule = createSchemaFieldRule(FullNameSearch)

  const onSearch = async () => {
    usePaginatedQuery.refetch()
  }

  return (
    <>
      <Toolbar className="bg-white shadow-sm">
        <Form form={form} layout="inline" onFinish={onSearch}>
          <Form.Item
            initialValue={firstName}
            name="fullName"
            rules={[FullNameSearchRule]}
          >
            <Input
              size="large"
              allowClear
              placeholder="Name"
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchParams((prev: URLSearchParams) => {
                  prev.set('firstName', e.target.value)
                  return prev
                })
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              hidden={true}
              loading={usePaginatedQuery.isLoading && `${firstName}` !== ''}
              htmlType="submit"
            >
              Search
            </Button>
          </Form.Item>
        </Form>
        <UserAddEditForm />
        <UserWalletForm />
      </Toolbar>
      <PageContainer className="flex flex-col gap-2">
        {usePaginatedQuery?.data?.map((user) => (
          <UserRowCard key={user.id} user={user} />
        ))}

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
