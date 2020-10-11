import {request} from '../request'

export function getUserList(info) {
  return request({
    url: 'users',
    method: "get",
    params: {
      query: info.query,
      pagenum: info.pagenum,
      pagesize: info.pagesize
    }
  })
}