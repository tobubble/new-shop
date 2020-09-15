import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 每次跳转页面之前我们都需要进行判断， 是否携带令牌
router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // from：代表从哪个页面跳转过来的
  // next 等同于 resolve，不调用的话，不会跳转页面
  if(to.path === '/login') return next()
  const token = window.sessionStorage.token // 获取令牌
  if(token) return next()
  next('/login')

})

export default router
