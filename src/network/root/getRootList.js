import {request} from '../request'

export function getRootList() {
  return request({
    url: "rights/" + "list",  
    method: "get",
  })
}

export function getRootTree() {
  return request({
    url: "rights/" + "tree",  
    method: "get",
  })
}

