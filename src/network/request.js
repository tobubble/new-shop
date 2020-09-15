import axios from 'axios'

export function request(config) {
  const instance1 = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  instance1.interceptors.response.use(config => {
    return config
  }, err => {
    console.log(err)
  })

  return instance1(config)
}