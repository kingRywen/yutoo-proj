// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import inject from './plugins/inject'
import router from './router'
import Mint from 'mint-ui'
import store from './store'

import {
  XHeader,
  Scroller,
  Selector,
  Group,
  Cell,
  CellBox,
  XButton,
  XTable,
  PopupPicker,
  XInput,
  Flexbox,
  FlexboxItem,
  Icon,
  ToastPlugin,
  CheckIcon,
  XDialog,
  XTextarea,
  Search,
  XNumber,
  Swiper,
  Tab,
  TabItem
} from 'vux'

import {
  MessageBox,
  Swipe,
  SwipeItem
} from 'mint-ui'
import '@/assets/css/common.scss'
import '@/components'
import echarts from 'echarts'



Vue.prototype.$echarts = echarts
// 全局 event bus 用来发布订阅
// eslint-disable-next-line node/no-deprecated-api
GLOBAL.vbus = new Vue()

Vue.use(inject)
Vue.use(ToastPlugin)
Vue.prototype.MessageBox = MessageBox

Vue.component('x-table', XTable)
Vue.component('x-scroller', Scroller)
Vue.component('x-header', XHeader)
Vue.component('group', Group)
Vue.component('popup-picker', PopupPicker)
Vue.component('selector', Selector)
Vue.component('cell', Cell)
Vue.component('cell-box', CellBox)
Vue.component('x-button', XButton)
Vue.component('x-input', XInput)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('icon', Icon)
Vue.component('check-icon', CheckIcon)
Vue.component('x-dialog', XDialog)
Vue.component('x-textarea', XTextarea)
Vue.component('search', Search)
Vue.component('x-number', XNumber)
Vue.component('swiper', Swiper)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.use(Mint)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
