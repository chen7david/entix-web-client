import { IUserWithAttendance, IWord } from 'entix-shared'
import { http } from '../http'

export const createSessionWords = async ({
  sessionId,
  words,
}: {
  sessionId: number | string
  words: string[]
}): Promise<IUserWithAttendance[]> => {
  const response = await http.post(`/api/v1/session-words`, {
    sessionId,
    words,
  })
  return response.data
}

export const getSessionWords = async (
  sessionId: number | string,
): Promise<IWord[]> => {
  const response = await http.get(`/api/v1/sessions/${sessionId}/words`)
  return response.data
}
