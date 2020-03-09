import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
    // 任务类型下拉值
    taskType: [],
    isloading: false,
    // loading: false,
    userInfo: {}, //用户信息
    platformList: [], // 平台
    siteList: [], // 站点
    defalutSiteName: '',
    defaultSiteIndex: ''
}
const mutations = {
    setTaskType(state, data) {
        state.taskType = data
    },
    setUserInfo(state, data) {
        state.userInfo = data
    },
    setPlatformList(state, data) {
        state.platformList = data
    },
    setdefaultSiteName(state, data) {
        state.defalutSiteName = data
    },
    setdefaultSiteIndex(state, data) {
        state.defaultSiteIndex = data
    },
    setSiteList(state, data) {
        state.siteList = data
    }
}
const actions = {
    getTaskType({
        commit,
        state
    }) {
        if (state.taskType.length) {
            return
        }
        return GLOBAL.ajax[`main/taskTypeDropdownList`]().then(data => {
            commit('setTaskType', data)
        })
    },
    async getUserInfo({
        commit
    }) {
        return GLOBAL.ajax[`main/sysUserInfo`]().then(data => {
            commit('setUserInfo', data.user)
        })
    },
    async getPlatform({
        commit,
        dispatch,
        state
    }) {

        await dispatch('getUserInfo')
        let defaultSite = state.userInfo.defaultSite,
            defaultSiteName, defaultSiteIndex

        return GLOBAL.ajax[`main/platformSiteGetPlatformSite`]({}).then(data => {
            let {
                site,
                platform,
                platformSite
            } = data
            platform.forEach(element => {
                let childs = []
                let child = platformSite.filter(el => el.platformCode === element.code)
                child = JSON.parse(JSON.stringify(child))
                child.forEach(_el => {

                    let _site = site.find(el => el.code === _el.siteCode)
                    childs.push({ ..._site,
                        platformSiteId: _el.platformSiteId
                    })
                    if (_el.platformSiteId === defaultSite) {
                        console.log(_el.platformCode);
                        defaultSiteName = element.name + '-' + _site.name
                        defaultSiteIndex = _el.platformSiteId + '-' + _site.name
                    }
                })
                element.childs = childs
            });

            commit('setPlatformList', platform)

            commit('setdefaultSiteName', defaultSiteName)
            commit('setdefaultSiteIndex', defaultSiteIndex)
        })
    },
    getSite({
        commit
    }) {
        return GLOBAL.ajax[`main/platformSiteListSite`]().then(data => {
            commit('setSiteList', data)
        })
    }
}
const getters = {}
const store = new Vuex.Store({
    modules: {},
    state,
    mutations,
    getters,
    actions,
})

export default store