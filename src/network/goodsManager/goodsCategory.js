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

// 获取所有的商品分类
export function goodsCategory2 () {
  return request({
    url: 'categories',
    method: 'get'
  })
}