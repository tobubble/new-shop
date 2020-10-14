import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "assets/css/base.css"
import "./assets/fonts/iconfont.css"
// import './plugins/element-ui'
import {Form, Input, FormItem, Button, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card
,Table, TableColumn,Switch, Tooltip, Pagination, Dialog, Tag, Row, Col, Tree, Select, Option} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

// 引入 element ui 的 messageBox 的 confoirm 全局组件
import { MessageBox } from "element-ui"

Vue.use(Form)
Vue.use(Input)
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)


Vue.config.productionTip = false

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
