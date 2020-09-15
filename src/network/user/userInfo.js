import {request} from '../request'

export function getUserInfo(config) {
  return request({
    method: "post",
    url: 'login',
    data: config
  })
}