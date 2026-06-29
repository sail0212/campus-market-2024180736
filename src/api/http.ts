import axios from 'axios'

// JSON Server 默认地址
const BASE_URL = 'http://localhost:3001'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default http
