import { IUserWithAttendance } from 'entix-shared'
import { http } from '../http'

export const updateUserSession = async ({
  userId,
  sessionId,
  item,
}: {
  userId: number | string
  sessionId: number | string
  item: Partial<any>
}): Promise<IUserWithAttendance[]> => {
  const response = await http.patch(
    `/api/v1/user-sessions/${userId}/sessions/${sessionId}`,
    item,
  )
  return response.data
}
