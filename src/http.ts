import axios from 'axios'

export const http = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://api.entix.me',
  // baseURL: 'http://localhost:3000',
})

http.interceptors.request.use(
  (config) => {
    const accessTokenString = localStorage.getItem('token')
    if (accessTokenString) {
      const accessToken = JSON.parse(accessTokenString) as string
      console.log(accessToken)
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
