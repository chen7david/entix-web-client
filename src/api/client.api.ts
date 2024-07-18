import {
  ILoginUserDto,
  IViewUserDto,
  IViewUserLoginDto,
  IPaginatedFilterResponse,
  ICreateUserDto,
} from 'entix-shared'
import { http } from './http'

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

export const deleteUser = async (
  userId: number,
): Promise<{ success: boolean }> => {
  const response = await http.delete('/api/v1/users/' + userId)
  return response.data
}
