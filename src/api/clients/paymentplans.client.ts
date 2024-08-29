import {
  ICreatePaymentPlanDto,
  IPaginatedResponse,
  IPaymentPlan,
  IPaymentPlanQueryParams,
  IUpdatePaymentPlanDto,
} from 'entix-shared'
import { http } from '../http'
import { formatUrlParams } from '../http.helpers'

export const findPaymentPlans = async ({
  pageParam,
  searchParams,
}: {
  pageParam: string | null
  searchParams: IPaymentPlanQueryParams
}): Promise<IPaginatedResponse<IPaymentPlan>> => {
  const queryParams = formatUrlParams(pageParam, searchParams)
  const response = await http.get(`/api/v1/paymentplans?${queryParams}`)
  return response.data
}

export const createPaymentPlan = async (
  createPaymentPlanDto: ICreatePaymentPlanDto,
): Promise<IPaymentPlan> => {
  const response = await http.post('/api/v1/paymentplans', createPaymentPlanDto)
  return response.data
}

export const updatePaymentPlan = async (
  id: number | string,
  updatePaymentPlanDto: IUpdatePaymentPlanDto,
): Promise<IPaymentPlan> => {
  const response = await http.patch(
    '/api/v1/paymentplans/' + id,
    updatePaymentPlanDto,
  )
  return response.data
}
