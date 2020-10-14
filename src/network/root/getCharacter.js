import {request} from '../request'

export function getCharacter() {
  return request({
    url: 'roles',
    method: 'get'
  })
}