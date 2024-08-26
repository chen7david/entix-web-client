import { IUserWithAttendance } from 'entix-shared'
import { http } from '../http'

export const markUserSessionPresent = async ({
  userId,
  sessionId,
}: {
  userId: number | string
  sessionId: number | string
}): Promise<IUserWithAttendance[]> => {
  const response = await http.patch(
    `/api/v1/users/${userId}/sessions/${sessionId}/present`,
  )
  return response.data
}

export const markUserSessionAbsent = async ({
  userId,
  sessionId,
}: {
  userId: number | string
  sessionId: number | string
}): Promise<IUserWithAttendance[]> => {
  const response = await http.patch(
    `/api/v1/users/${userId}/sessions/${sessionId}/absent`,
  )
  return response.data
}

export const markUserSessionComplete = async ({
  userId,
  sessionId,
}: {
  userId: number | string
  sessionId: number | string
}): Promise<IUserWithAttendance[]> => {
  const response = await http.patch(
    `/api/v1/users/${userId}/sessions/${sessionId}/complete`,
  )
  return response.data
}

export const markUserSessionIncomplete = async ({
  userId,
  sessionId,
}: {
  userId: number | string
  sessionId: number | string
}): Promise<IUserWithAttendance[]> => {
  const response = await http.patch(
    `/api/v1/users/${userId}/sessions/${sessionId}/incomplete`,
  )
  return response.data
}
