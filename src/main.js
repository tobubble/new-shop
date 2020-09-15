import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "assets/css/base.css"
// import './plugins/element-ui'
import {Form, Input, formItem, Button, Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Form)
Vue.use(Input)
Vue.use(Button)
Vue.use(formItem)

Vue.config.productionTip = false

Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
