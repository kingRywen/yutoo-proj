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
import monitor from './modules/monitor'
import imgUpload from './modules/imgUpload'
import createLogger from '../plugins/logger'
import shopAuthorization from './modules/shopAuthorization'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    platformList: [], //平台列表
    platformId: 1, //平台id
  },
  mutations: {
    setPlatformId(state, id) {
      state.platformId = id
    }
  },
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
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
