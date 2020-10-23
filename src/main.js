import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "assets/css/base.css"
import "./assets/fonts/iconfont.css"
// 导富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)

// import './plugins/element-ui'
import {
  Form, Input, FormItem, Button, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card
  , Table, TableColumn, Switch, Tooltip, Pagination, Dialog, Tag, Row, Col, Tree, Select, Option,
  cascader, Alert, Tabs, TabPane, Step, Steps, CheckboxGroup, Checkbox, Timeline, TimelineItem
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

// 引入 element ui 的 messageBox 的 confoirm 全局组件
import { MessageBox, Upload } from "element-ui"

// // 导入 nprogress 插件(导入本体和 css 文件)
// import NProgress from 'nprogress'
// import "nprogress/nprogress.css"------- 此次操作可以在导航首位的 foreach 中使用

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
Vue.use(cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


Vue.config.productionTip = false

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

// 定义一个全局的时间过滤函数
Vue.filter('dateFormat', function(originVal) {
  // 后台传递的是 s
  // 我们这里用到的是 毫秒
  originVal = originVal * 1000
  const dt = new Date(originVal)
  // padStart 方法是给一个字符串指定一个长度，如果长度不够那么可以在这个长度的前面添加一个 0(自定义的)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, "0") // 月份要加 1
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
