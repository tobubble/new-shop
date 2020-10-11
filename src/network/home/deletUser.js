import {request} from '../request'

export function deletUser (id) {
  return request({
    url: 'users/' + id,
    method: "delete"
  })
}