import axios, { AxiosError } from 'axios'
import { isLoginAtom } from './store/auth.atom'
import { appStore } from './store/app.atom'
import { globalFormValidationAtom } from './store/error.atom'

export type IResponseError = {
  status: string
  message: string
  details?: {
    [key: string]: {
      _errors: string[]
    }
  }
}

export const http = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://api.entix.me',
  // baseURL: 'http://localhost:3000',
})

let isRefreshing: boolean = false

http.interceptors.request.use(
  (config) => {
    isRefreshing = false
    const accessTokenString = localStorage.getItem('token')
    if (accessTokenString) {
      console.log({ accessTokenString })
      const accessToken = JSON.parse(accessTokenString) as string
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response
  },
  async (error: AxiosError<IResponseError>) => {
    // Handle error responses
    if (error.response) {
      const { data, status, config: originalRequest } = error.response
      console.log({ data, status })
      if (status === 400 && data.details && data.message == 'ValidationError') {
        appStore.set(isLoginAtom, false)
        appStore.set(globalFormValidationAtom, data.details)
        console.log('hanle validation error: set them')
      } else if (!isRefreshing && status === 401) {
        isRefreshing = true
        const refresTokenString = localStorage.getItem('refreshToken')
        const refreshToken = JSON.parse(refresTokenString || '')
        const res = await http.post('/api/v1/auth/refresh', { refreshToken })
        const { accessToken } = res.data
        localStorage.setItem('token', JSON.stringify(accessToken))
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return await http(originalRequest)
        console.log('handle expired token')
      } else if (status > 401 && status < 500) {
        console.log('regular notice error')
      }
      console.error('Response errorXXX:', error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request)
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  },
)
