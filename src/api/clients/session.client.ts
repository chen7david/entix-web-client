import {
  ICreateSessionDto,
  ISession,
  ISessionQueryParams,
  IPaginatedResponse,
  IUpdateSessionDto,
  IUser,
  IUserSession,
} from 'entix-shared'
import { http } from '../http'
import { formatUrlParams } from '../http.helpers'

export const findSessions = async ({
  pageParam,
  searchParams,
}: {
  pageParam: string | null
  searchParams: ISessionQueryParams
}): Promise<IPaginatedResponse<ISession[]>> => {
  const queryParams = formatUrlParams(pageParam, searchParams)
  const response = await http.get(`/api/v1/sessions?${queryParams}`)
  return response.data
}

export const findOneSession = async (
  id: number | string,
): Promise<ISession> => {
  const response = await http.get(`/api/v1/sessions/${id}`)
  return response.data
}

export const createSession = async (
  formData: ICreateSessionDto,
): Promise<ISession> => {
  const response = await http.post(
    `/api/v1/groups/${formData.groupId}/sessions`,
    formData,
  )
  return response.data
}

export const updateSession = async ({
  sessionId,
  formData,
}: {
  sessionId: number | string
  formData: IUpdateSessionDto
}): Promise<ISession> => {
  const response = await http.patch('/api/v1/sessions/' + sessionId, formData)
  return response.data
}

export const deleteSession = async (
  sessionId: number,
): Promise<{ success: boolean }> => {
  const response = await http.delete('/api/v1/sessions/' + sessionId)
  return response.data
}

/** START: Session USER ACTIONS */

export const getSessionUsers = async ({
  queryKey,
}: {
  queryKey: [string, number]
}): Promise<IUser[]> => {
  const sessionId = queryKey[1]
  const response = await http.get(`/api/v1/sessions/${sessionId}/users`)
  return response.data
}

export const relateSessionUser = async (payload: {
  userId: string | number
  sessionId: string | number
}): Promise<IUserSession> => {
  const response = await http.post('/api/v1/user-Sessions', payload)
  return response.data
}

export const unRelateSessionUser = async ({
  userId,
  sessionId,
}: {
  userId: string | number
  sessionId: string | number
}): Promise<{ success: boolean }> => {
  const response = await http.delete(
    `/api/v1/sessions/${sessionId}/users/${userId}`,
  )
  return response.data
}

/** END: Session USER ACTIONS */
