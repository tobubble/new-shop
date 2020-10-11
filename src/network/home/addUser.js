import {request} from '../request'

export function addUser (config) {
  return request({
    url: 'users',
    method: 'post',
    data: {
      username: config.userName,
      password: config.password,
      email: config.email,
      mobile: config.telphone
    }
  })
}