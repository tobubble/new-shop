import {request} from '../request'

export function searchUser (id) {
  return request({
    method: 'get',
    url: 'users/' + id
  })
}