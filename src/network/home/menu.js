import {request} from "../request"

export function getMenuData(config) {
  return request({
    method: "get",
    url: 'menus'
  })
}