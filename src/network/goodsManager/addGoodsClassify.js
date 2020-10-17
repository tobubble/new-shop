import {request} from '../request'

export function addGoodsClassify(config) {
  return request({
    url: 'categories',
    method: 'post',
    data: {
      cat_pid: config.cat_pid,
      cat_name: config.cat_name,
      cat_level: config.cat_level
    }
  })
}

export function deleteGoodsClassify(id) {
  return request({
    url: 'categories/' + id,
    method: 'delete'
  })
}

export function editGoodsClassifyName(config) {
  return request({
    url: 'categories/' + config.id,
    method: 'put',
    data: {
      cat_name: config.cat_name
    }
  })
}

export function searchGoodsClassifyName(id) {
  return request({
    url: 'categories/' + id,
    method: 'get'
  })
}