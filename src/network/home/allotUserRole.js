import {request} from '../request'

export function allotUserRole(id, rid) {
  return request({
    url: 'users/'+id+'/role',
    method: "put",
    data: {
      rid: rid
    }
  })
}