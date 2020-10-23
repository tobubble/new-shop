import axios from 'axios'

// 导入 nprogress 插件(导入本体和 css 文件)
import NProgress from 'nprogress'
import "nprogress/nprogress.css"
// 上面的东西是用来展示进度条的

export function request(config) {
  const instance1 = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    // baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    timeout: 5000
  })

  // 请求拦截
  instance1.interceptors.request.use(config => {
    // 在请求拦截器中展示进度条   NProgress.start()
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
  })

  // 响应拦截
  instance1.interceptors.response.use(config => {
    // 在响应拦截器中隐藏进度条   NProgress.done()
    NProgress.done()
    return config
  }, err => {
    console.log(err)
  })

  return instance1(config)
}