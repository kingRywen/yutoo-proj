import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
    // 今日充值金额
    currentM: '-',
    // 消息提示
    msg: [],
    dialogIsOpen: false,
    loading: false, // 局部loaidng
    isloading: false, // 全局loading
    countryList: [], //国家列表
    platformList: [], //平台列表
    userInfo: {}, //用户信息
    platformSite: [], //平台站点
    hasGetPlatSite: false,
    platformSite1: [], //平台站点
    taskTypeList: [], //任务类型
    actionList: [], //动作定义
    habitList: [], // 习惯下拉值
    expendOption: [], // 支出项
}
const mutations = {
    setExpendOption(state, val) {
        state.expendOption = val
    },
    dialogState(state, bool) {
        state.dialogIsOpen = bool
    },
    setUserInfo(state, data) {
        state.userInfo = data
    },
    setCountry(state, data) {
        state.countryList = data.map(el => ({
            value: el.code,
            label: el.cnName
        }))
    },
    setPlatform(state, data) {
        state.platformList = data.map(el => ({
            value: el.code,
            label: el.enName
        }))
    },
    setPlatformSite(state, data) {
        // data.map(el => ({...el, value: el.value.toLowerCase()}))
        let el = data.map(el => {
            let children = el.childArray.map(e => ({ label: e.cnName, value: e.platformSiteId }))
            return {
                value: el.enName,
                label: el.enName,
                children
            }
        })
        state.platformSite = el
        state.platformSite1 = el.map(el => ({ ...el, value: el.value.toLowerCase() }))
        state.hasGetPlatSite = true
    },
    setTaskTypeList(state, data) {
        state.taskTypeList = data.map(el => ({
            value: el.taskTypeId,
            label: el.name,
            param: el.param
        }))
    },
    setActionList(state, data) {
        state.actionList = data.map(el => ({
            value: el.actionId,
            label: el.actionName
        }))
    },
    setHabitList(state, data) {
        state.habitList = data.map(el => ({
            value: el.habitId,
            label: el.habitName
        }))
    },
    setMsg(state, data) {
        state.msg = data
    },
    setCurrentM(state, m) {
        state.currentM = m
    }
}
const actions = {
    async getExpendOption({ commit }) {
        let { rows } = await GLOBAL.ajax[`main/expendOptionDropdownList`]({})
        commit('setExpendOption', rows.map(el => ({ label: el.value, value: el.key })))
    },
    getCurrentM({
        commit
    }) {
        GLOBAL.ajax[`main/merchantPayCurrentDateStatistics`]({})
            .then(data => {
                commit('setCurrentM', data.rows.money)
            })
    },
    getMsg({
        commit
    }) {
        GLOBAL.ajax[`main/msgList`]({})
            .then(data => {
                if (!data || data === '') {
                    data = []
                }
                commit('setMsg', data)
            })
    },
    async getUserInfo({
        commit
    }) {
        return GLOBAL.ajax[`main/sysUserInfo`]().then(data => {
            commit('setUserInfo', data ? data.user : {})
        })
    },
    async getPlatform({
        dispatch
    }) {
        await dispatch('getUserInfo')
    },
    getCountry({
        commit
    }) {
        return GLOBAL.ajax[`main/countryDropdownList`]().then(data => {
            commit('setCountry', data)
        })
    },
    getPlatformList({
        commit
    }) {
        return GLOBAL.ajax[`main/platformDropdownList`]().then(data => {
            commit('setPlatform', data)
        })
    },
    getPlatformSite({
        commit, state
    }) {
        if (state.hasGetPlatSite) {
            return state.platformList
        }
        return GLOBAL.ajax[`main/platformSiteDropdownList`]().then(data => {
            commit('setPlatformSite', data)
            // commit('setPlatformSite', )
        })
    },
    getTaskTypeList({
        commit
    }) {
        return GLOBAL.ajax[`main/taskTypeDropdownList`]().then(data => {
            commit('setTaskTypeList', data)
        })
    },
    getActionList({
        commit
    }) {
        return GLOBAL.ajax[`main/actionDropdownList`]().then(data => {
            commit('setActionList', data)
        })
    },
    getHabitList({
        commit
    }) {
        return GLOBAL.ajax[`main/habitDropdownList`]().then(data => {
            commit('setHabitList', data)
        })
    }
}
const getters = {
    layoutLoading(state) {
        return !state.dialogIsOpen && state.isloading
    }
}
const store = new Vuex.Store({
    modules: {},
    state,
    mutations,
    getters,
    actions,
})

export default store