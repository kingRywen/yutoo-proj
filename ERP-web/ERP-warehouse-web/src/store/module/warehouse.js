const state = {
  localWhouse: [], // 本地仓库
  overseeWhouse: [], // 海外仓库
  deliveryModeList: [] // 所有发货方式
}
const getters = {}
const actions = {
  initWhouse({
    commit
  }, type) {
    return GLOBAL.ajax['order/getWarehouseList']({
      type
    }).then((data) => {
      const _data = data.rows.map(el => ({
        label: el.warehouseName,
        value: el.warehouseId
      }))
      commit('setMenuList', {
        data: _data,
        type
      })
      return _data
    })
  },
  initDeliveryModeList({
    commit
  }, type = 0) {
    return GLOBAL.ajax['order/GetDeliveryModeList']({
      type
    }).then((data) => {
      const _data = data.rows.map(el => ({
        label: el.deliveryName,
        value: el.deliveryId
      }))
      commit('setDeliveryModeList', {
        data: _data,
        type
      })
      return _data
    })
  }
}
const mutations = {
  setMenuList(state, {
    data,
    type
  }) {
    if (type === 1) {
      state.localWhouse = data
    }
    if (type === 2) {
      state.overseeWhouse = data
    }

  },
  setDeliveryModeList(state, {
    data,
    type
  }) {
    if (type === 0) {
      state.deliveryModeList = data
    }

  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}