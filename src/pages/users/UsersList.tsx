import { Button, Form, Input, Spin } from 'antd'
import { IGroupEntity, IViewUserDto } from 'entix-shared'
import { UserAddEditForm } from './UserAddEditForm'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { findUsers } from '@/api/client.api'
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

const FullNameSearch = z.object({
  full_name: z
    .string()
    .regex(/^[a-zA-Z0-9 ]*$/, 'Must be alphanumeric and can include spaces'),
})

export const UsersList = () => {
  const [form] = Form.useForm()
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
    queryFn: ({ pageParam }: QueryFunctionContext<string[], number>) =>
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
              placeholder="Name"
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
        <UserWalletForm />
      </Toolbar>
      <PageContainer className="flex flex-col gap-2">
        {usePaginatedQuery?.data?.pages
          .flat()
          .map((user) => <UserRowCard key={user.id} user={user} />)}

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
