import {
  ICreateGroupDto,
  IGroup,
  IGroupQueryParams,
  IPaginatedRespose,
  IUpdateGroupDto,
} from 'entix-shared'
import { http } from '../http'
import { formatUrlParams } from '../http.helpers'

export const findGroups = async ({
  pageParam,
  searchParams,
}: {
  pageParam: string | null
  searchParams: IGroupQueryParams
}): Promise<IPaginatedRespose<IGroup[]>> => {
  const queryParams = formatUrlParams(pageParam, searchParams)
  const response = await http.get(`/api/v1/groups?${queryParams}`)
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
