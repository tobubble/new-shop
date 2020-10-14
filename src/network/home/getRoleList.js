import {request} from '../request'

export function getRoleList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}