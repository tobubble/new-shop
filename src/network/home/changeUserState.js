import {request} from "../request"

export function changeUserState(id, state) {
  return request({
    url:"users/"+ id +"/state/"+ state,
    method: 'put'
  })
} 