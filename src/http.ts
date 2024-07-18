import axios, { AxiosError } from 'axios'
import { message } from 'antd'
import { HeaderKey, ErrorKey, IErrorResponse, makeBearer } from 'entix-shared'
import { BrowserStore } from './store/browserstore.store'
import { clientConfig } from './config'

export const http = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: clientConfig.baseUrl,
})

http.interceptors.request.use(
  (config) => {
    const accessToken = BrowserStore.getAccessToken()
    if (accessToken)
      config.headers[HeaderKey.Authorization] = makeBearer(accessToken)
    return config
  },
  (error) => Promise.reject(error),
)

http.interceptors.response.use(
  async (response) => response,
  async (error: AxiosError<IErrorResponse>) => {
    if (error.response) {
      const { request, status, data, config: originalRequest } = error.response
      const responseURL = `${request.responseURL}`

      const isRefreshResponse = responseURL.includes('/refresh')
      const isTokenExpired = data.message === ErrorKey.ExpiredToken
      const isUnauthorized = status === 401

      if (!isTokenExpired) {
        message.error(data.message)
      } else if (!isRefreshResponse && isUnauthorized) {
        const refreshToken = BrowserStore.getRefreshToken()
        const { data } = await http.post('/api/v1/auth/refresh', {
          refreshToken,
        })
        BrowserStore.setAccessToken(data.accessToken)
        originalRequest.headers[HeaderKey.Authorization] = makeBearer(
          data.accessToken,
        )
        return await http(originalRequest)
      }
    } else if (error.request) {
      message.error('Please check your internet connection')
      console.error('Request error:', error.request)
    }
    return Promise.reject(error)
  },
)
