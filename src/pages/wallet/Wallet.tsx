import { getStatements } from '@/api/client.api'
import { PageContainer } from '@/components/Layout/PageContainer'
import { Toolbar } from '@/components/Layout/Toolbar'
import { useInfiniteQuery } from '@tanstack/react-query'
import { DatePicker, Select, Spin } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { StatementRowCard } from './StatementRowCard'
import { currUserAtom, isAdminAtom } from '@/store/auth.atom'
import { useAtom } from 'jotai'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
dayjs.extend(utc)

export const Wallet = () => {
  const [currUser] = useAtom(currUserAtom)
  const [isAdmin] = useAtom(isAdminAtom)
  const { ref, inView } = useInView()
  const [searchParams, setSearchParams] = useSearchParams({
    startDate: dayjs().utc().startOf('day').toISOString(),
    endDate: dayjs().utc().endOf('day').toISOString(),
    limit: '10',
    currencyType: 'ETP',
    userId: `${currUser?.id}`,
  })
  const currencyType = searchParams.get('currencyType') || ''
  const limit = searchParams.get('limit') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const userId = `${currUser?.id}`

  const statementsQuery = useInfiniteQuery({
    queryKey: ['statements', { startDate, endDate, currencyType, userId }],
    getNextPageParam: (prevData) => prevData.cursor,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      getStatements({
        pageParam,
        searchParams: { currencyType, limit, startDate, endDate, userId },
      }),
    initialPageParam: null,
    select: ({ pages }) => pages.flatMap(({ items }) => items),
  })

  useEffect(() => {
    if (inView && statementsQuery.hasNextPage) {
      statementsQuery.fetchNextPage()
    }
  }, [inView])

  return (
    <>
      <Toolbar className="bg-white shadow-sm flex gap-2">
        <DatePicker.RangePicker
          size="large"
          defaultValue={[dayjs().startOf('day'), dayjs().endOf('day')]}
          presets={[
            {
              label: 'Today',
              value: [dayjs().startOf('day'), dayjs().endOf('day')],
            },
            {
              label: 'Last 7 Days',
              value: [
                dayjs().subtract(7, 'days').startOf('day'),
                dayjs().endOf('day'),
              ],
            },
            {
              label: 'Last 14 Days',
              value: [
                dayjs().subtract(14, 'days').startOf('day'),
                dayjs().endOf('day'),
              ],
            },
            {
              label: 'Last 30 Days',
              value: [
                dayjs().subtract(30, 'days').startOf('day'),
                dayjs().endOf('day'),
              ],
            },
            {
              label: 'Last 90 Days',
              value: [
                dayjs().subtract(90, 'days').startOf('day'),
                dayjs().endOf('day'),
              ],
            },
          ]}
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
        {isAdmin && (
          <Select
            size="large"
            defaultValue={'ETP'}
            options={[
              { value: 'ETP', label: 'ETP' },
              { value: 'CNY', label: 'CNY' },
            ]}
            onChange={(currencyType) => {
              setSearchParams((prev: URLSearchParams) => {
                prev.set('currencyType', currencyType)
                return prev
              })
            }}
          />
        )}
      </Toolbar>
      <PageContainer className="flex flex-col gap-2">
        {statementsQuery.data?.map((item) => (
          <StatementRowCard key={item.id} item={item} />
        ))}
        {statementsQuery.isFetching ? (
          <span className="m-6 flex justify-center">
            <Spin />
          </span>
        ) : (
          <div ref={ref}></div>
        )}
        {!statementsQuery.data?.length && (
          <div className="text-gray-400 justify-center w-full">
            No records found
          </div>
        )}
      </PageContainer>
    </>
  )
}
