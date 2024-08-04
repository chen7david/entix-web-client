import { findGroups } from '@/api/client.api'
import { PageContainer } from '@/components/Layout/PageContainer'
import { Toolbar } from '@/components/Layout/Toolbar'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { Button, Form, Input, Spin } from 'antd'
import { createSchemaFieldRule } from 'antd-zod'
import { CreateGroupDto, IGroupEntity } from 'entix-shared'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useSearchParams } from 'react-router-dom'
import { UserAddEditForm } from '../users/UserAddEditForm'
import { UserWalletForm } from '../users/UserWalletForm'
import { SearchOutlined } from '@ant-design/icons'
import { GroupRowCard } from './GroupRowCard'
import { GroupAddEditForm } from './GroupAddEditForm'

export const GroupList = () => {
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
    queryKey: ['groups', q],
    queryFn: ({ pageParam }: QueryFunctionContext<string[], number>) => {
      const searchParams = { q, sortBy, limit }
      return findGroups({ pageParam, searchParams })
    },
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: IGroupEntity[],
      allPages: IGroupEntity[][],
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

  const CreateGroupDtoRule = createSchemaFieldRule(CreateGroupDto)

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
            rules={[CreateGroupDtoRule]}
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
        <GroupAddEditForm />
        <UserWalletForm />
      </Toolbar>
      <PageContainer className="flex flex-col gap-2">
        {usePaginatedQuery?.data?.pages
          .flat()
          .map((group) => <GroupRowCard key={group.id} group={group} />)}

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
