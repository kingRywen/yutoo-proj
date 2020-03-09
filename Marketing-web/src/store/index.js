import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import competitive from './modules/competitive'
import menu from './modules/menu'
import anking from './modules/anking'
import selectPlatform from './modules/selectPlatform'
import selectionTool from './modules/selectionTool'
import KeywordMining from './modules/KeywordMining'
import editingTools from './modules/editingTools'
import point from './modules/point'
import monitor from './modules/monitor'
import imgUpload from './modules/imgUpload'
import createLogger from '../plugins/logger'
import shopAuthorization from './modules/shopAuthorization'
import myAttention from './modules/myAttention'
import saleVolume from './modules/salesVolume'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    platformList: [], // 平台列表
    platformId: 1 // 平台id
  },
  mutations: {},
  modules: {
    monitor,
    menu,
    common,
    competitive,
    anking,
    editingTools,
    shopAuthorization,
    imgUpload,
    selectionTool,
    KeywordMining,
    selectPlatform,
    myAttention,
    saleVolume,
    point
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
