import Vue from 'vue'
import App from './App'
import store from './store'

import * as api from '@/api';
import uniRouterApis from '@/common/js/router';

import weixin from '@/common/js/weixin';

Vue.config.productionTip = false

Vue.prototype.$weixin = weixin
Vue.prototype.$api = api

Object.assign(Vue.prototype, uniRouterApis)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
