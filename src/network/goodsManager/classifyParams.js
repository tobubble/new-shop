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

export function getGoodsParams (id,sel) {
  return request({
    url: 'categories/'+id+'/attributes',
    method: 'get',
    params: {
      sel: sel
    }
  })
}

export function addGoodsParams (config) {
  return request({
    url: 'categories/'+config.id+'/attributes',
    method: 'post',
    data: {
      attr_sel: config.attr_sel,
      attr_name: config.attr_name,
    }
  })
}

// 添加参数
export function editGoodsParams (config) {
  return request({
    url: 'categories/'+config.id+'/attributes/' + config.attrid,
    method: 'put',
    data: {
      attr_sel: config.attr_sel,
      attr_name: config.attr_name,
    }
  })
}

// 添加参数的值
export function editGoodsParams2 (config) {
  return request({
    url: 'categories/'+config.id+'/attributes/' + config.attrId,
    method: 'put',
    data: {
      attr_sel: config.attr_sel,
      attr_name: config.attr_name,
      attr_vals: config.attr_vals
    }
  })
}

export function deleteGoodsParams (config) {
  return request({
    url: 'categories/'+config.id+'/attributes/' + config.attr_id,
    method: 'delete'
  })
}