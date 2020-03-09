import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {
  submenu
} from '@/config/navConfig'
import perms from './module/perms'
import email from './module/email'
import product from './module/product'
import common from './module/common'
import order from './module/order'

const store = new Vuex.Store({
  modules: {
    perms,
    email,
    product,
    order,
    common
  },
  state: {
    nav: {
      submenu
    },
    isSubmenuUnfold: false, //控制左侧菜单是否打开
    user: {
      merchantName: '', //商户名称
      merchantId: '', //商户id
      username: '', //用户名称
      nickname: '' //用户昵称
    },
    token: '',
    network: true, //是否有网
    isloading: false, //全局loading
    loading: false //局部loading
  },
  mutations: {
    changeSubmenuUnfold(state) {
      state.isSubmenuUnfold = !state.isSubmenuUnfold
    },
    changUser(state, {
      merchantName,
      merchantId,
      username,
      nickname
    }) {
      state.user.merchantName = merchantName
      state.user.merchantId = merchantId
      state.user.username = username
      state.user.nickname = nickname
    },
    changeNetwork(state, boole) {
      state.network = boole
    }
  },
  actions: {}
})

export default store