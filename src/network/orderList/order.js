import {request} from '../request'

export function oderList (config) {
  return request({
    url: 'orders',
    method: 'get',
    params: {
      query: config.query || '',
      pagenum: config.pagenum,
      pagesize: config.pagesize,
      user_id: config.user_id || '',
      pay_status: config.pay_status || '',
      is_send: config.is_send || '',
      order_fapiao_title: config.order_fapiao_title || '',
      order_fapiao_company: config.order_fapiao_company || '',
      order_fapiao_content: config.order_fapiao_content || '',
      consignee_addr: config.consignee_addr || ''
    }
  })
}

export function kuaidiProgress (id) {
  return request({
    url: '/kuaidi/1106975712662',
    method: 'get',
  })
}