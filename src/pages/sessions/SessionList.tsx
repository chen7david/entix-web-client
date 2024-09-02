import { Toolbar } from '@/components/Layout/Toolbar'
import { DatePicker, Form, Spin } from 'antd'
import { useSearchParams } from 'react-router-dom'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { PageContainer } from '@/components/Layout/PageContainer'
import { SessionAddEditForm } from './SessionAddEditForm'
import { findSessions } from '@/api/clients/session.client'
import { SessionRowCard } from './SessionRowCard'
dayjs.extend(utc)

export const SessionList = () => {
  const [form] = Form.useForm()
  const { ref, inView } = useInView()

  // Set today's start and end dates
  const todayStart = dayjs().utc().startOf('day').toISOString()
  const todayEnd = dayjs().utc().endOf('day').toISOString()

  const [searchParams, setSearchParams] = useSearchParams({
    startDate: todayStart,
    endDate: todayEnd,
    groupId: '',
    name: '',
    limit: '10',
  })

  const limit = searchParams.get('limit') || ''
  const startDate = searchParams.get('startDate') || todayStart
  const endDate = searchParams.get('endDate') || todayEnd

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

  const onSearch = async () => {
    // console.log(v)
  }

  return (
    <>
      <Toolbar className="bg-white shadow-sm">
        <Form form={form} layout="inline" onFinish={onSearch}>
          <Form.Item>
            <DatePicker.RangePicker
              presets={[
                {
                  label: 'Today',
                  value: [dayjs().startOf('day'), dayjs().endOf('day')],
                },
                {
                  label: 'Tomorrow',
                  value: [
                    dayjs().add(1, 'day').startOf('day'),
                    dayjs().add(1, 'day').endOf('day'),
                  ],
                },
                {
                  label: 'Next Month',
                  value: [
                    dayjs().add(1, 'month').startOf('month'),
                    dayjs().add(1, 'month').endOf('month'),
                  ],
                },
                {
                  label: 'Next Year',
                  value: [
                    dayjs().add(1, 'year').startOf('year'),
                    dayjs().add(1, 'year').endOf('year'),
                  ],
                },
                {
                  label: 'Last 7 Days',
                  value: [
                    dayjs().add(-7, 'd').startOf('day'),
                    dayjs().endOf('day'),
                  ],
                },
                {
                  label: 'Last 14 Days',
                  value: [
                    dayjs().add(-14, 'd').startOf('day'),
                    dayjs().endOf('day'),
                  ],
                },
                {
                  label: 'Last 30 Days',
                  value: [
                    dayjs().add(-30, 'd').startOf('day'),
                    dayjs().endOf('day'),
                  ],
                },
                {
                  label: 'Last 90 Days',
                  value: [
                    dayjs().add(-90, 'd').startOf('day'),
                    dayjs().endOf('day'),
                  ],
                },
              ]}
              size="large"
              defaultValue={[dayjs(todayStart), dayjs(todayEnd)]}
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
