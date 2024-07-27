import {
  ILoginUserDto,
  IViewUserDto,
  IViewUserLoginDto,
  IPaginatedFilterResponse,
  ICreateUserDto,
  ICloudinaryUploadResponse,
  ISignedCloudinaryResponse,
  IUpdateUserDto,
} from 'entix-shared'
import { http } from './http'
import axios from 'axios'

export const loginUser = async (
  loginDto: ILoginUserDto,
): Promise<IViewUserLoginDto> => {
  const response = await http.post('/api/v1/auth/login', loginDto)
  return response.data
}

export const renewToken = async (
  refreshToken: string,
): Promise<IViewUserLoginDto> => {
  const response = await http.post('/api/v1/auth/refresh', { refreshToken })
  return response.data
}

export const findUsers = async (): Promise<
  IPaginatedFilterResponse<IViewUserDto[]>
> => {
  const response = await http.get(`/api/v1/users?sortBy=id:desc`)
  return response.data
}

export const createUser = async (
  formData: ICreateUserDto,
): Promise<IViewUserDto> => {
  const response = await http.post('/api/v1/users', formData)
  return response.data
}

export const updateUser = async ({
  userId,
  formData,
}: {
  userId: number
  formData: IUpdateUserDto
}): Promise<IViewUserDto> => {
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
