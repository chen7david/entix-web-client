import { findPaymentPlans } from '@/api/clients/paymentplans.client'
import { PageContainer } from '@/components/Layout/PageContainer'
import { Toolbar } from '@/components/Layout/Toolbar'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { PaymentPlanRowCard } from './PaymentPlanRowCard'
import { PaymentPlanAddEditForm } from './PaymentPlanAddEditForm'

export const PaymentPlanList = () => {
  const [searchParams] = useSearchParams({
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
      <Toolbar className="bg-white shadow-sm">
        <PaymentPlanAddEditForm />
      </Toolbar>
      <PageContainer className="flex flex-col gap-2">
        {usePaginatedQuery?.data?.pages
          ?.flatMap(({ items }) => items)
          .flat()
          .map((paymentPlan) => {
            return (
              <PaymentPlanRowCard
                key={paymentPlan.id}
                paymentPlan={paymentPlan}
              />
            )
          })}
      </PageContainer>
    </>
  )
}
