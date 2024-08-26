import { IPaginatedResponse, IUser, IUserQueryParams } from 'entix-shared'
import { http } from '../http'
import { formatUrlParams } from '../http.helpers'

export const findUsers = async ({
  pageParam,
  searchParams,
}: {
  pageParam: string | null
  searchParams: IUserQueryParams
}): Promise<IPaginatedResponse<IUser>> => {
  const queryParams = formatUrlParams(pageParam, searchParams)
  const response = await http.get(`/api/v1/users?${queryParams}`)
  return response.data
}

export const findSessionUsers = async (
  sessionId: number | string,
): Promise<IUser[]> => {
  const response = await http.get(`/api/v1/sessions/${sessionId}/users`)
  return response.data
}
