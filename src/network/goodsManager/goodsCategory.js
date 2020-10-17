import {request} from '../request'

export function goodsCategory (config) {
  return request({
    url: 'categories',
    method: 'get',
    params: {
      type: config.type,
      pagenum: config.pagenum,
      pagesize: config.pagesize,
    }
  })
}