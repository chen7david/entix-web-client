import axios, { AxiosError } from 'axios'
import { message } from 'antd'
import { HeaderKey, IErrorResponse, StorageKey } from 'entix-shared'

export const http = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  // baseURL: 'https://api.entix.me',
  baseURL: 'http://localhost:3000',
})

let isRefreshing: boolean = false

http.interceptors.request.use(
  (config) => {
    isRefreshing = false
    const accessTokenString = localStorage.getItem(StorageKey.AccessToken)
    if (accessTokenString) {
      console.log({ accessTokenString })
      const accessToken = JSON.parse(accessTokenString) as string
      config.headers[HeaderKey.Authorization] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error: AxiosError<IErrorResponse>) => {
    if (error.response) {
      const { status, data, config: originalRequest } = error.response

      if (data.message !== 'Expired token') {
        message.error(data.message)
      } else if (!isRefreshing && status === 401) {
        isRefreshing = true
        const refreshToken = JSON.parse(
          `${localStorage.getItem(StorageKey.RefreshToken)}`,
        )
        const { data } = await http.post('/api/v1/auth/refresh', {
          refreshToken,
        })
        localStorage.setItem(
          StorageKey.AccessToken,
          JSON.stringify(data.accessToken),
        )
        originalRequest.headers[HeaderKey.Authorization] =
          `Bearer ${data.accessToken}`
        return await http(originalRequest)
      }
    } else if (error.request) {
      message.error('Please check your internet connection')
      console.error('Request error:', error.request)
    }
    return Promise.reject(error)
  },
)
