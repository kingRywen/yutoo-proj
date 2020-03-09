import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router/index'
import storage from 'Utils/saver'
Vue.use(Vuex)
const state = {
    keepAlive: {
        cachePage: ['taskSource'],
        max: 2
    },
    dialogIsOpen: false,
    // 当日操作任务数
    taskAllotCount: [],
    // 任务类型下拉值
    taskType: [],
    // 消息提示
    msg: [],
    ipCase: {},
    isloading: false,
    // loading: false,
    userInfo: {}, //用户信息
    platformList: [], // 平台
    siteList: [], // 站点
    defalutSiteName: '',
    defaultSiteIndex: '',
    originMobile: null,
    // 归属国家
    countryList: [],
    currentSiteInfo: {
        selectedSite: ['']
    }, // 当前站点信息
    // 店铺列表
    storeList: [],
    // 商品回收费用说明
    cstInfo: {}
}
const mutations = {
    resetMobile(state) {
        state.userInfo.merchantMobile = state.originMobile
    },
    closeLoading(state) {
        state.isloading = false
    },
    setCst(state, data) {
        state.cstInfo = data
    },
    dialogState(state, bool) {
        state.dialogIsOpen = bool
    },
    setCountry(state, data) {
        state.countryList = data
    },
    setIpCase(state, data) {
        state.ipCase = data
    },
    setTaskType(state, data) {
        state.taskType = data
    },
    setUserInfo(state, data) {
        if (data.isAdmin) {
            storage.set('local', 'userInfo', data)
        } else {
            storage.set('local', 'userInfo_a', data)
        }
        state.originMobile = data.merchantMobile

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
    setcurrentSiteInfo(state, data) {
        state.currentSiteInfo = data
    },
    setSiteList(state, data) {
        state.siteList = data
    },
    setMsg(state, data) {
        state.msg = data
    },
    setTaskAllotCount(state, data) {
        state.taskAllotCount = data.split('/')
    }
}
const actions = {
    getCst({
        commit,
        state
    }) {
        return GLOBAL.ajax['main/recycleExplainInfo']({
            platformCode: state.currentSiteInfo.platformCode
        }).then(data => {
            commit('setCst', data.rows)
        })
    },
    getStore({
        commit
    }) {
        GLOBAL.ajax['main/pcCountryList']().then(data => {
            commit('setCountry', data.rows.map(el => ({
                label: el.cnName,
                value: el.countryCode
            })))
        })
    },
    getCountryList({
        commit
    }) {
        GLOBAL.ajax['main/pcCountryList']().then(data => {
            commit('setCountry', data.rows.map(el => ({
                label: el.cnName,
                value: el.countryCode
            })))
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
    getIpCase({
        commit
    }) {
        GLOBAL.ajax[`main/ipBindRecordGetIpCase`]({})
            .then(data => {
                commit('setIpCase', data)
            })
    },
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
        // 
        // let {
        //     path:_path
        // } = router.history.current
        // const notRequiredTokens = GLOBAL.$const['OTHER/urlWhiteList']
        // if (notRequiredTokens.indexOf(_path) === -1) {
        //     return
        // }
        return GLOBAL.ajax[`main/sysUserInfo`]().then(data => {
            commit('setUserInfo', data ? data.user : {})
        })
    },
    async getPlatform({
        commit,
        dispatch,
        state
    }) {
        try {
            // 

            let {
                path: _path
            } = router.history.current

            const notRequiredTokens = GLOBAL.$const['OTHER/urlWhiteList']
            // 
            if (notRequiredTokens.indexOf(_path) > -1) {
                return
            }
            // 

            await dispatch('getUserInfo')
            let defaultSite = state.userInfo.defaultSite,
                defaultSiteName, defaultSiteIndex, currentSiteInfo

            return GLOBAL.ajax[`main/platformSiteGetPlatformSite`]({}).then(data => {
                let {
                    country,
                    platform,
                    platformSite
                } = data
                platform.forEach(element => {
                    let childs = []
                    let child = platformSite.filter(el => el.platformCode === element.code)
                    child = JSON.parse(JSON.stringify(child))
                    child.forEach(_el => {

                        let _site = country.find(el => el.code === _el.countryCode)
                        childs.push({
                            ..._site,
                            platformSiteId: _el.platformSiteId
                        })
                        if (_el.platformSiteId === defaultSite) {

                            defaultSiteName = element.enName + '-' + _site.cnName
                            defaultSiteIndex = _el.platformSiteId + '-' + _site.cnName
                            currentSiteInfo = {
                                ..._site,
                                platformSiteId: _el.platformSiteId,
                                selectedSite: [element.enName, _el.platformSiteId],
                                platformCode: element.code
                            }
                        }
                    })
                    element.platformSiteId = element.enName
                    element.childs = childs
                });

                commit('setPlatformList', platform)

                commit('setdefaultSiteName', defaultSiteName)
                commit('setdefaultSiteIndex', defaultSiteIndex)
                commit('setcurrentSiteInfo', currentSiteInfo)
            })
        } catch (error) {

            // Vue.prototype.$message.error('初始化数据失败，请刷新重试')
        }
    },
    getSite({
        commit
    }) {
        return GLOBAL.ajax[`main/platformSiteListSite`]().then(data => {
            commit('setSiteList', data)
        })
    }
}
const getters = {
    layoutLoading(state) {
        return !state.dialogIsOpen && state.isloading
    },
    isAmazon(state) {
        return state.currentSiteInfo.platformCode === 'amazon'
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