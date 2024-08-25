import { Toolbar } from '@/components/Layout/Toolbar'
import { DatePicker, Form, Spin } from 'antd'
import { useParams, useSearchParams } from 'react-router-dom'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { PageContainer } from '@/components/Layout/PageContainer'
import { SessionAddEditForm } from './SessionAddEditForm'
import { findSessions } from '@/api/clients/session.client'
import { SessionRowCard } from './SessionRowCard'
dayjs.extend(utc)

export const SessionList = () => {
  const [form] = Form.useForm()
  const { ref, inView } = useInView()
  const [searchParams, setSearchParams] = useSearchParams({
    startDate: dayjs().utc().subtract(1, 'month').toISOString(),
    endDate: dayjs().utc().toISOString(),
    groupId: '',
    name: '',
    limit: '10',
  })
  const limit = searchParams.get('limit') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''

  const getOneGroupQuery = useQuery({
    queryKey: ['groups'],
    queryFn: async () => findOneGroup(id ?? 0),
  })

  console.log(getOneGroupQuery.data)

  const usePaginatedQuery = useInfiniteQuery({
    queryKey: ['sessions', { startDate, endDate }],
    initialPageParam: null,
    getNextPageParam: (prevData) => prevData.cursor,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      findSessions({
        pageParam,
        searchParams: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          limit: parseInt(limit, 10),
        },
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
              size="large"
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
        <SessionAddEditForm session={getOneGroupQuery?.data} />
      </Toolbar>
      <PageContainer className="flex flex-col gap-2">
        {usePaginatedQuery?.data?.pages
          ?.flatMap(({ items }) => items)
          .flat()
          .map((session) => {
            return <SessionRowCard key={session.id} session={session} />
          })}

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
