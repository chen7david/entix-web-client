import { AccessToken } from 'entix-shared'
import { jwtDecode } from 'jwt-decode'

export const decodeToken = (token: string) => {
  const decoded = jwtDecode(token)
  const { success, error, data } = AccessToken.safeParse(decoded)
  if (!success) {
    console.error(error)
    throw error
  }
  return data
}
