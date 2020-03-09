import Vue from 'vue';
import Vuex from 'vuex';
import api from "../apis/api";
Vue.use(Vuex);

import modules from './module';

console.log(modules);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        // 全局loading
        isloading: false,
        // 单独的loading
        loading: false,
        separatorList: [{
            name: "我的工作台",
            url: "/"
        }], //面包屑导航列表
        // 智能补货列表
        sourcePlatformList: [], // 来源平台数据
        sourceShopList: [], // 来源店铺数据
        intelligentReplenishmentList: {}, // 智能补货列表数据
        intelligentReplenishmentSelected: {}, // 智能补货选择数据
        cycleType: [], // 生命周期类型列表
        cycleList: [], // 生命周期类型列表
        transportType: [], // 获取运输方式

        isLoading: true // 加载中变量

    },
    mutations: {
        SET_LOADING(state, payload) {
            state[payload.name] = payload.value
        },
        setLoading(state, flag) {
            state.isLoading = flag
        },
        // 清空补货的数据选择项
        clearIntelligentReplenishmentList(state) {
            state.intelligentReplenishmentSelected = {}
        },

        insertIntelligentReplenishmentList(state, payload) {
            state.intelligentReplenishmentList.rows.splice(payload.index + 1, 0, ...payload.info)
        },

        delIntelligentReplenishmentList(state, payload) {
            state.intelligentReplenishmentList.rows.splice(payload.index + 1, payload.len)
        },

        setSourcePlatformList(state, payload) {
            if (payload.length) {
                payload = payload.map(el => ({
                    value: el.platformId,
                    label: el.name
                }));
            }
            state.sourcePlatformList = payload;
        },
        setSourceShopList(state, payload) {
            if (payload.length) {
                payload = payload.map(el => ({
                    value: el.storeId,
                    label: el.storeRealName
                }));
            }
            state.sourceShopList = payload;
        },
        // 智能补货列表数据
        setIntelligentReplenishmentList(state, payload) {
            state.intelligentReplenishmentList = payload;
        },
        // 智能补货列表数据
        setCycleType(state, payload) {
            let ret = []
            if (payload) {
                for (const key in payload) {
                    if (payload.hasOwnProperty(key)) {
                        const element = payload[key];
                        ret.push({
                            value: element,
                            label: key
                        })
                    }
                }
            }
            state.cycleList = payload
            state.cycleType = ret;
        },
        // 获取运输方式列表数据
        setTransportType(state, payload) {
            if (payload.length > 0) {
                payload = payload.map(el => ({
                    label: el.freightTypeName,
                    value: el.transportFirstId
                }))
            }
            state.transportType = payload;
        },
        setIntelligentSelected(state, {
            item
        }) {
            if (item.length > 0) {
                state.intelligentReplenishmentSelected[state.intelligentReplenishmentList.pageNo] = item
            } else {
                delete state.intelligentReplenishmentSelected[state.intelligentReplenishmentList.pageNo]
            }

        }
    },
    actions: {
        // 获取来源平台数据
        async getSourcePlatformList({
            commit
        }) {
            commit("setSourcePlatformList", await api.gotSourcePlatformList());
        },
        // 获取来源店铺数据
        async getSourceShopList({
            commit
        }, params = {}) {
            commit("setSourceShopList", await api.gotSourceShopList(params));
        },
        // 获取智能补货列表
        async getIntelligentReplenishmentList({
            commit
        }, payload = {}) {
            try {
                commit(
                    "setIntelligentReplenishmentList",
                    await api.gotIntelligentReplenishmentList(payload)
                );
            } catch (error) {
                return Promise.reject(error)
            }


        },
        // 获取生命周期类型列表
        async getCycleType({
            commit
        }) {
            commit(
                "setCycleType",
                await api.gotCycleType()
            );
        },
        // 获取生命周期类型列表
        async getCycleList({
            commit
        }) {
            commit(
                "setCycleType",
                await api.gotCycleType()
            );
        },
        // 获取运输方式
        async getTransportType({
            commit
        }, params) {
            commit(
                "setTransportType",
                await api.gotTransportType(params)
            );
        }
    },
    modules
});

export default store;
