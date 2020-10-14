import {request} from '../request'

export function allotRight(roleId, rids) {
  return request({
    url: 'roles/'+roleId+'/rights',
    method: 'post',
    data: {
      rids: rids
    }
  })
}