import { Toolbar } from '@/components/Layout/Toolbar'
import { DatePicker, Form, Spin } from 'antd'
import { useParams, useSearchParams } from 'react-router-dom'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { findGroups, findOneGroups } from '@/api/clients/group.client'
import { useEffect } from 'react'
import { PageContainer } from '@/components/Layout/PageContainer'
import { GroupRowCard } from '../groups/GroupRowCard'
import { SessionAddEditForm } from './SessionAddEditForm'
dayjs.extend(utc)

export const GroupSessionList = () => {
  const { id } = useParams()
  const [form] = Form.useForm()
  const { ref, inView } = useInView()
  const [searchParams, setSearchParams] = useSearchParams({
    startDate: dayjs().utc().subtract(1, 'month').toISOString(),
    endDate: dayjs().utc().toISOString(),
    name: '',
    limit: '10',
  })
  const limit = searchParams.get('limit') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''

  const getOneGroupQuery = useQuery({
    queryKey: ['groups', { id }],
    queryFn: async () => findOneGroups(id ?? 0),
  })

  console.log(getOneGroupQuery.data)

  const usePaginatedQuery = useInfiniteQuery({
    queryKey: [`groups/${id}/sessions`, { startDate, endDate }],
    initialPageParam: null,
    getNextPageParam: (prevData) => prevData.cursor,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      findGroups({
        pageParam,
        searchParams: { id, startDate, endDate, limit: parseInt(limit, 10) },
      }),
  })

  useEffect(() => {
    if (inView && usePaginatedQuery.hasNextPage) {
      usePaginatedQuery.fetchNextPage()
    }
  }, [inView])

  const onSearch = async (v) => {
    console.log(v)
  }
  return (
    <>
      <Toolbar className="bg-white shadow-sm">
        <Form form={form} layout="inline" onFinish={onSearch}>
          <Form.Item>
            <DatePicker.RangePicker
              defaultValue={[dayjs(startDate), dayjs(endDate)]}
              onChange={(dates) => {
                if (!dates) return
                const [startDate, endDate] = dates
                if (!startDate || !endDate) return
                setSearchParams((prev: URLSearchParams) => {
                  prev.set(
                    'startDate',
                    startDate?.utc().startOf('day').toISOString(),
                  )
                  prev.set('endDate', endDate?.utc().endOf('day').toISOString())
                  return prev
                })
              }}
            />
          </Form.Item>
        </Form>
        <SessionAddEditForm />
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
