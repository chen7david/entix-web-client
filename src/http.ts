import axios from 'axios'

export const http = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://api.entix.me',
})
