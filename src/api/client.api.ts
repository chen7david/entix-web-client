import {
  ILoginUserDto,
  IUser,
  IAuthUserContext,
  ICreateUserDto,
  ICloudinaryUploadResponse,
  ISignedCloudinaryResponse,
  IUpdateUserDto,
  ICreateTransferDto,
  ILedgerEntity,
  IPaginatedRespose,
  ILedgerWithUser,
} from 'entix-shared'
import { http } from './http'
import axios from 'axios'

type ISearchQueryParams = {
  firstName?: string
  currencyType?: string
  limit?: string
  startDate?: string
  endDate?: string
  trxid?: string
  userId?: string
}

export const loginUser = async (
  loginDto: ILoginUserDto,
): Promise<IAuthUserContext> => {
  const response = await http.post('/api/v1/auth/login', loginDto)
  return response.data
}

export const renewToken = async (
  refreshToken: string,
): Promise<IAuthUserContext> => {
  const response = await http.post('/api/v1/auth/refresh', { refreshToken })
  return response.data
}

export const findUsers = async ({
  pageParam,
  searchParams,
}: {
  pageParam: string | null
  searchParams: ISearchQueryParams
}): Promise<IPaginatedRespose<IUser>> => {
  const queryParams = new URLSearchParams({
    ...searchParams,
    cursor: `${pageParam}`,
  }).toString()
  const response = await http.get(`/api/v1/users?${queryParams}`)
  return response.data
}

export const createUser = async (formData: ICreateUserDto): Promise<IUser> => {
  const response = await http.post('/api/v1/users', formData)
  return response.data
}

export const getCurrUserEtpBalance = async (): Promise<{ balance: number }> => {
  const response = await http.get('/api/v1/ledgers/etp-balance')
  return response.data
}

export const makeTransfer = async (
  ledgerTransferDto: ICreateTransferDto,
): Promise<{ sender: ILedgerEntity; recipient: ILedgerEntity }> => {
  const response = await http.post(
    '/api/v1/ledgers/transfers',
    ledgerTransferDto,
  )
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

export const getStatements = async ({
  pageParam,
  searchParams,
}: {
  pageParam: string | null
  searchParams: ISearchQueryParams
}): Promise<IPaginatedRespose<ILedgerWithUser>> => {
  const queryParams = new URLSearchParams({
    ...searchParams,
    cursor: `${pageParam}`,
  }).toString()
  const response = await http.get(`/api/v1/ledgers/statements?${queryParams}`)
  return response.data
}

export const updateUser = async ({
  userId,
  formData,
}: {
  userId: number
  formData: IUpdateUserDto
}): Promise<IUser> => {
  const response = await http.patch('/api/v1/users/' + userId, formData)
  return response.data
}

export const forceActivateAccount = async (
  userId: number,
): Promise<{ success: boolean }> => {
  const response = await http.post(`/api/v1/users/${userId}/activate`)
  return response.data
}

export const activateAccount = async ({
  passcode,
}: {
  passcode: string
}): Promise<{ success: boolean }> => {
  const response = await http.post('/api/v1/opt/verify-email', {
    passcode,
  })
  return response.data
}

export const sendAccountActivationEmail = async (
  username: string,
): Promise<{ success: boolean }> => {
  const response = await http.post('/api/v1/opt/email-verification', {
    username,
  })
  return response.data
}

export const sendPasswordRecoveryEmail = async ({
  username,
}: {
  username: string
}): Promise<{ success: boolean }> => {
  const response = await http.post('/api/v1/opt/password-recovery', {
    username,
  })
  return response.data
}

export const deleteUser = async (
  userId: number,
): Promise<{ success: boolean }> => {
  const response = await http.delete('/api/v1/users/' + userId)
  return response.data
}

export const getCloudinarySingedUrl = async (
  folder?: string,
): Promise<ISignedCloudinaryResponse> => {
  const response = await http.post('/api/v1/sign/cloudinary', { folder })
  return response.data
}

export const uploadToCloudinary = async (
  file: any,
): Promise<ICloudinaryUploadResponse> => {
  const { timestamp, apiKey, signature, cloudName } =
    await getCloudinarySingedUrl()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('timestamp', timestamp)
  formData.append('api_key', apiKey)
  formData.append('signature', signature)

  // Upload to Cloudinary
  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
  )
  return data
}
