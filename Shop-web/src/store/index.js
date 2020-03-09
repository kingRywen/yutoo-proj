import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import common from './modules/Common'
import keywordExcavate from './modules/KeywordExcavate'
import CateSetup from './modules/CateSetup'
import ShopWarning from './modules/ShopWarning'
import pubilcTime from './modules/pubilcTime'
const state = {
    // 返回路由，遇到特殊处理的路由时需要
    backRoutes: [],
    backBtn: false,
    // 显示响应失败页面
    showNoresponsePage: false,
    // 默认loading
    isloading: false,
    // api接口加了singleLoading: true 生效的loading
    loading: false,
    btnLoading: false,
}

function resetState(state, moduleState) {
    const mState = state[moduleState];
    
    if (mState.initState && typeof mState.initState === 'function') {
        const initState = mState.initState();
        for (const key in initState) {
            mState[key] = initState[key];
        }
    }

}
const mutations = {
    // 重置需要重置的vuex模块
    resetState(state) {
        
        for (const moduleState in state) {
            resetState(state, moduleState);
        }
    },
    setBackBtn(state, payload) {
        state.backBtn = payload
    },
    pushBackRoutes(state, payload) {
        state.backRoutes.push(payload)
    },
    spliceBackRoutes(state, payload) {
        let { index } = payload
        state.backRoutes.splice(index, 1)
    },
    setBackRoutes(state, payload) {
        state.backRoutes = payload
    }
}
const actions = {}
const getters = {}
const store = new Vuex.Store({
    modules: { common, keywordExcavate, CateSetup, ShopWarning, pubilcTime },
    state,
    mutations,
    getters,
    actions,
})

export default store