import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { menu, submenu } from '@/config/navConfig'
import perms from './module/perms'
import warehouse from './module/warehouse'
import storeModule from './module/store'
import common from './module/common'
import tempEdit from './module/tempEdit'

const store = new Vuex.Store({
  modules: {
    perms,
    common,
    store: storeModule,
    warehouse,
    tempEdit
  },
  state: {
    nav: {
      menu,
      submenu: submenu.salesManagement
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
    changeSubmenu(state, nav) {
      state.nav.submenu = submenu[nav]
    },
    changeSubmenuUnfold(state) {
      state.isSubmenuUnfold = !state.isSubmenuUnfold
    },
    changUser(state, user) {
      state.user.merchantName = user.merchantName
      state.user.merchantId = user.merchantId
      state.user.username = user.username
      state.user.nickname = user.nickname
    },
    changeNetwork(state, boole) {
      state.network = boole
    }
  },
  actions: {}
})

export default store
