import {request} from '../request'

export function getGoodList(config) {
  return request({
    url: 'goods',
    method: 'get',
    params: {
      query: config.query,
      pagenum: config.pagenum,
      pagesize: config.pagesize,
    }
  })
}

// 添加商品
export function addGoods(config) {
  return request({
    url: 'goods',
    method: 'post',
    data: {
      goods_name: config.goods_name,
      goods_cat: config.goods_cat,
      goods_price: config.goods_price,
      goods_number: config.goods_number,
      goods_weight: config.goods_weight,
      goods_introduce: config.goods_introduce,
      pics: config.pics,
      attrs: config.attrs
    }
  })
}