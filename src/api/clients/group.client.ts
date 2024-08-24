import {
  ICreateGroupDto,
  IGroup,
  IGroupQueryParams,
  IPaginatedResponse,
  IUpdateGroupDto,
  IUser,
  IUserGroup,
} from 'entix-shared'
import { http } from '../http'
import { formatUrlParams } from '../http.helpers'

export const findGroups = async ({
  pageParam,
  searchParams,
}: {
  pageParam: string | null
  searchParams: IGroupQueryParams
}): Promise<IPaginatedResponse<IGroup[]>> => {
  const queryParams = formatUrlParams(pageParam, searchParams)
  const response = await http.get(`/api/v1/groups?${queryParams}`)
  return response.data
}

export const findOneGroups = async (
  id: number | string,
): Promise<IPaginatedResponse<IGroup[]>> => {
  const response = await http.get(`/api/v1/groups?${id}`)
  return response.data
}

export const createGroup = async (
  formData: ICreateGroupDto,
): Promise<IGroup> => {
  const response = await http.post('/api/v1/groups', formData)
  return response.data
}

export const updateGroup = async ({
  groupId,
  formData,
}: {
  groupId: number
  formData: IUpdateGroupDto
}): Promise<IGroup> => {
  const response = await http.patch('/api/v1/groups/' + groupId, formData)
  return response.data
}

export const deleteGroup = async (
  groupId: number,
): Promise<{ success: boolean }> => {
  const response = await http.delete('/api/v1/groups/' + groupId)
  return response.data
}

/** START: GROUP USER ACTIONS */

export const getGroupUsers = async ({
  queryKey,
}: {
  queryKey: [string, number]
}): Promise<IUser[]> => {
  const groupId = queryKey[1]
  const response = await http.get(`/api/v1/groups/${groupId}/users`)
  return response.data
}

export const relateGroupUser = async (payload: {
  userId: string | number
  groupId: string | number
}): Promise<IUserGroup> => {
  const response = await http.post('/api/v1/user-groups', payload)
  return response.data
}

export const unRelateGroupUser = async ({
  userId,
  groupId,
}: {
  userId: string | number
  groupId: string | number
}): Promise<{ success: boolean }> => {
  const response = await http.delete(
    `/api/v1/groups/${groupId}/users/${userId}`,
  )
  return response.data
}

/** END: GROUP USER ACTIONS */
