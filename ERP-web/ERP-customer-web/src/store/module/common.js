export default {
  state: {
    platformAndStore: [], //所有平台=>对应的店铺，订单来源，来源店铺
    storeList: [], // 所有店铺
    transportTypeList: [], //运输方式
    ebayTransportTypeList: [], //ebay运输方式
    countryList: [], //国家列表
    warehouseList: [], //所有仓库
    ebayWarehouseList: [], //ebay所有仓库
    bankList: [],
    //procurement采购人员
    //saleman销单人员
    //delevlop开发人员
    //finance财务人员
    //operator 操作人员
    //platformCharge平台负责人
    handleUser: {} //所有操作人员
  },
  getters: {
    allHandleUser(state) {
      return state.handleUser
    },
    bankList(state) {
      return state.bankList
    },
    warehouseList(state) {
      return state.warehouseList
    },
    ebayWarehouseList(state) {
      return state.ebayWarehouseList
    },
    ebayTransportTypeList(state) {
      return state.ebayTransportTypeList
    },
    platformAndStore(state) {
      return state.platformAndStore
    },
    transportTypeList(satte) {
      let arr = []
      arr = satte.transportTypeList.map(i => {
        return {
          label: i.transportTypeName,
          value: i.transportTypeId
        }
      })
      return arr
    },
    countryList(satte) {
      let arr = []
      arr = satte.countryList.map(i => {
        return {
          label: i.countryName,
          value: i.countryId
        }
      })
      return arr
    }
  },
  actions: {
    //获取所有操作人
    getHandleUser({ commit }) {
      return GLOBAL.ajax['order/userListGetUserList']()
        .then(res => {
          commit('setHandleUser', res.rows)
          return res.rows
        })
        .catch(() => {
          return false
        })
    },
    getWarehouseList({ commit }, type = 0) {
      //0 全部 1 本地仓 2 海外仓
      return GLOBAL.ajax['order/warehousesGetWarehouseList']({
        type
      })
        .then(res => {
          commit('setWarehouseList', res.rows)
        })
        .catch(() => {
          return false
        })
    },
    getPlatformAndStore({ commit }) {
      return GLOBAL.ajax['product/store_list_all']().then(res => {
        commit('setPlatformAndStore', res.rows)
      })
    },
    getTransportTypeList(
      { commit },
      params = {
        type: 3
      }
    ) {
      return GLOBAL.ajax['order/getTransportTypeList'](params).then(res => {
        commit('setTransportTypeList', res.rows)
      })
    },
    getCountryList({ commit }) {
      return GLOBAL.ajax['order/getCountryList']({}).then(res => {
        commit('setCountryList', res.rows)
      })
    },
    getBankList({ commit }) {
      return GLOBAL.ajax['order/getBankList']()
        .then(res => {
          commit('setBankList', res.rows)
        })
        .catch(() => {
          return false
        })
    }
  },
  mutations: {
    setHandleUser(state, obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key]
          element.forEach(el => {
            el.label = el.nickName
            el.value = el.userId
          })
        }
      }
      state.handleUser = obj
    },
    setBankList(state, list) {
      state.bankList = list
    },
    setWarehouseList(state, list) {
      state.warehouseList = list
      state.ebayWarehouseList = list.map(item => {
        return {
          label: item.warehouseName,
          value: item.warehouseId
        }
      })
    },
    setCountryList(state, list) {
      state.countryList = list
    },
    setTransportTypeList(state, list) {
      state.transportTypeList = list
      state.ebayTransportTypeList = list.map(item => {
        return {
          label: item.transportTypeName,
          value: item.transportTypeId
        }
      })
    },
    setPlatformAndStore(state, list) {
      state.platformAndStore = list.map(el => ({
        ...el,
        storeId: el.platformId,
        storeRealName: el.platformId != null ? el.name : el.storeRealName
      }))
      let arr
      list.forEach(i => {
        arr = i.stores.map(j => {
          return {
            label: j.name,
            value: j.storeId
          }
        })
      })
      state.storeList = arr
    }
  }
}
