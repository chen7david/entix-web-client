import { ICreatePaymentDto, IPaymentEntity } from 'entix-shared'
import { http } from '../http'

export const makePayment = async (
  ledgerPaymentDto: ICreatePaymentDto,
): Promise<{ sender: IPaymentEntity; recipient: IPaymentEntity }> => {
  const response = await http.post('/api/v1/payments', ledgerPaymentDto)
  return response.data
}
