import axios, { AxiosError } from 'axios'
import { message } from 'antd'
import { HeaderKey, IErrorResponse } from 'entix-shared'
import { BrowserStore } from './store/browserstore.store'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export const http = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: apiBaseUrl,
})

let isRefreshing: boolean = false

http.interceptors.request.use(
  (config) => {
    isRefreshing = false
    const accessToken = BrowserStore.getAccessToken()
    if (accessToken) {
      console.log({ accessToken })
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
        const refreshToken = BrowserStore.getRefreshToken()
        console.log({ refreshToken })
        const { data } = await http.post('/api/v1/auth/refresh', {
          refreshToken,
        })
        BrowserStore.setAccessToken(data.accessToken)
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
