import { ICreatePaymentDto, IPaymentEntity } from 'entix-shared'
import { http } from '../http'

export const makePayment = async (
  ledgerPaymentDto: ICreatePaymentDto,
): Promise<{ sender: IPaymentEntity; recipient: IPaymentEntity }> => {
  const response = await http.post('/api/v1/payments', ledgerPaymentDto)
  return response.data
}

export const getUserCnyBalance = async ({
  userId,
}: {
  userId: number
}): Promise<{ balance: number }> => {
  const response = await http.get(`/api/v1/users/${userId}/cny-balance`)
  return response.data
}

export const getUserEtpBalance = async ({
  userId,
}: {
  userId: number
}): Promise<{ balance: number }> => {
  const response = await http.get(`/api/v1/users/${userId}/etp-balance`)
  return response.data
}
