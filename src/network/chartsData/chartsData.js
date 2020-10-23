import {request} from '../request'

export function chartsData() {
  return request({
    url: 'reports/type/1',
    method: 'get'
  })
}