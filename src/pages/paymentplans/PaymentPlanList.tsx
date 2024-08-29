import { findPaymentPlans } from '@/api/clients/paymentplans.client'
import { PageContainer } from '@/components/Layout/PageContainer'
import { Toolbar } from '@/components/Layout/Toolbar'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Form, Spin } from 'antd'
import { useInView } from 'react-intersection-observer'
import { useSearchParams } from 'react-router-dom'
import { PaymentPlanRowCard } from './PaymentPlanRowCard'

export const PaymentPlanList = () => {
  const [form] = Form.useForm()
  const { ref, inView } = useInView()
  const [searchParams, setSearchParams] = useSearchParams({
    name: '',
    limit: '10',
  })
  const name = searchParams.get('name') || ''
  const limit = searchParams.get('limit') || ''
  const usePaginatedQuery = useInfiniteQuery({
    queryKey: ['paymentplans', { name }],
    initialPageParam: null,
    getNextPageParam: (prevData) => prevData.cursor,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      findPaymentPlans({
        pageParam,
        searchParams: {
          name,
          limit: parseInt(limit, 10),
        },
      }),
  })
  return (
    <>
      <Toolbar className="bg-white shadow-sm"></Toolbar>
      <PageContainer className="flex flex-col gap-2">
        {usePaginatedQuery?.data?.pages
          ?.flatMap(({ items }) => items)
          .flat()
          .map((paymentPlan) => {
            return <PaymentPlanRowCard paymentPlan={paymentPlan} />
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
