import { PageContainer } from '@/components/Layout/PageContainer'
import { Toolbar } from '@/components/Layout/Toolbar'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Form, Input, Spin } from 'antd'
import { createSchemaFieldRule } from 'antd-zod'
import { CreateGroupDto } from 'entix-shared'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useSearchParams } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import { GroupAddEditForm } from './GroupAddEditForm'
import { findGroups } from '@/api/clients/group.client'
import { GroupRowCard } from './GroupRowCard'

export const GroupList = () => {
  const [form] = Form.useForm()
  const { ref, inView } = useInView()
  const [searchParams, setSearchParams] = useSearchParams({
    name: '',
    limit: '10',
  })

  const name = searchParams.get('name') || ''
  const limit = searchParams.get('limit') || ''

  const usePaginatedQuery = useInfiniteQuery({
    queryKey: ['groups', { name }],
    initialPageParam: null,
    getNextPageParam: (prevData) => prevData.cursor,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      findGroups({
        pageParam,
        searchParams: { name, limit: parseInt(limit, 10) },
      }),
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
            initialValue={name}
            name="name"
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
                  prev.set('name', e.target.value)
                  return prev
                })
              }}
            />
          </Form.Item>
        </Form>
        <GroupAddEditForm />
      </Toolbar>
      <PageContainer className="flex flex-col gap-2">
        {usePaginatedQuery?.data?.pages
          ?.flatMap(({ items }) => items)
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
