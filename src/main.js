// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import promise from 'es6-promise'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './common/public.scss'
import './common/reset.scss'
import './assets/fonts/iconfont.css'
import VueClipboard from 'vue-clipboard2'
import store from './store/index'
import Vuex from 'vuex'
import u from './utils/util'

Vue.use(Vuex)
Vue.use(VueClipboard)
Vue.use(ElementUI)
promise.polyfill()

let JZY_FUN = {
  u: u
}
Vue.prototype.JZY = JZY_FUN
window.JZY = Vue.prototype.JZY

Vue.prototype.$axios = axios
Vue.prototype.$ELEMENT = { size: 'mini' }
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
