import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')

const Home = () => import('views/home/Home')
const CharacterList = () => import("views/home/views/CharacterList")
const ClassifyList = () => import("views/home/views/ClassifyParams")
const DataReport = () => import("views/home/views/DataReport")
const ItemClassify = () => import("views/home/views/ItemClassify")
const ItemList = () => import("views/home/views/ItemList")
const OrderList = () => import("views/home/views/OrderList")
const RootList = () => import("views/home/views/RootList")
const UserList = () => import("views/home/views/UserList")
const Welcome = () => import("views/home/views/Welcome")
const AddGoodsCpn = () => import("views/home/views/AddGoodsCpn")

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
    component: Home,
    children: [
      {path: '', redirect: "/welcome"},
      {path: "/welcome", component: Welcome},
      {path: "/characterList", component: CharacterList},
      {path: "/classifyList", component: ClassifyList},
      {path: "/dataReport", component: DataReport},
      {path: "/itemClassify", component: ItemClassify},
      {path: "/itemList", component: ItemList},
      {path: "/orderList", component: OrderList},
      {path: "/rootList", component: RootList},
      {path: "/userList", component: UserList},
      {path: "/addGoodsCpn", component: AddGoodsCpn},
    ]
  }
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
