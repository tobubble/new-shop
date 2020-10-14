import {request} from '../request'

export function deleteRightById(role, rightId) {
  return request({
    url: 'roles/'+role.id+'/rights/' + rightId,
    method: 'delete'
  })
}