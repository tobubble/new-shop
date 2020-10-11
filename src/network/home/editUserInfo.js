import {request} from '../request'

export function editUserInfo(config) {
  return request({
    url: "users/" + config.id,
    method: "put",
    data: {
      email: config.email,
      mobile: config.telphone
    }
  })
}