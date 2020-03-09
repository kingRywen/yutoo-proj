const state = {
  transportationList: [], //运输方列表
  forwarderList: [], //运输商列表
  transportTypeList: [], //运输类型列表(运输方api管理页面)
  transportList: [], //运输方式列表(运输方api管理页面)
  forwarderTypeList: [], // 所有运输方运输方式列表
  faceSheetTempList: [], //面单单模板列表
  manifestTempList: [], //报关单模板列表
  customFaceSheetTempList: [], //自定义面单单模板列表
  customManifestTempList: [], //自定义报关单模板列表
  declareList: [], //申报规则列表
  WmWarehouseGlobalLists: [], //发货仓库列表
  currencyTypeList: [], //货币类型列表
  areaList: [], //区域列表
  productTypeList: [], //限制物流属性列表
  logisticRegionList: [], //区域列表
  nationList: [], //国家列表
  provinceList: [], //省份列表
  unitItemTypeList: [
    {
      label: 'CM',
      value: 'cm'
    },
    {
      label: 'M',
      value: 'm'
    }
  ], //货币列表
  unitList: [], // 4 重量
  currencyList: [], //3 货币
  WmWarehouseStaffList: [], //三种管理人员,
  wmWarehouseGlobalAllList: [] // 所有仓库列表
}
const getters = {
  deliveryWarehouseList(state) {
    return state.deliveryWarehouseList
  }
}
const actions = {
  getWmWarehouseGlobalAllList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/wmWarehouseGlobalAllList'](params).then(
      data => {
        commit('setWmWarehouseGlobalAllList', data.list)
      }
    )
  },
  getTransportationList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/transportationList'](params).then(data => {
      commit('setTransportationList', data.rows)
    })
  },
  getForwarderList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/forwarderList'](params).then(data => {
      console.log(data)

      commit('setForwarderList', data.rows)
    })
  },
  getTransportTypeList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/transportTypeList'](params).then(data => {
      commit('setTransportTypeList', data.rows)
    })
  },
  getTransportList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/transportList'](params).then(data => {
      commit('setTransportList', data.rows)
    })
  },
  getForwarderTypeList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/forwarderTypeList'](params).then(data => {
      commit('setForwarderTypeList', data.rows)
    })
  },
  getManifestTempList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/manifestTempList'](params).then(data => {
      commit('setManifestTempList', data.rows)
    })
  },
  getFaceSheetTempList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/faceSheetTempList'](params).then(data => {
      commit('setFaceSheetTempList', data.rows)
    })
  },
  getCustomFaceSheetTempList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/customFaceSheetTempList'](params).then(
      data => {
        commit('setCustomFaceSheetTempList', data.rows)
      }
    )
  },
  getCustomManifestTempList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/customManifestTempList'](params).then(
      data => {
        commit('setCustomManifestTempList', data.rows)
      }
    )
  },
  getDeclareList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/transportTypeDeclareList'](params).then(
      data => {
        commit('setDeclareList', data.rows)
      }
    )
  },
  getWmWarehouseGlobalLists({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/WmWarehouseGlobalLists'](params).then(
      data => {
        commit('setWmWarehouseGlobalLists', data.list)
      }
    )
  },
  getCurrencyTypeList({ commit }) {
    let params = {}
    return GLOBAL.ajax['product/store_list_all'](params).then(data => {
      commit('setCurrencyTypeList', data.rows)
    })
  },
  getAreaList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/logisticRegionList'](params).then(data => {
      commit('setAreaList', data.rows)
    })
  },
  getProductTypeList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/productTypeListGet'](params).then(data => {
      commit('setProductTypeList', data.rows)
    })
  },
  getLogisticRegionList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/logisticRegionList'](params).then(data => {
      commit('setLogisticRegionList', data.rows)
    })
  },
  getNationList({ commit }) {
    let params = {}
    return GLOBAL.ajax['warehouse/nationList'](params).then(data => {
      commit('setNationList', data.rows)
    })
  },
  getUnitList({ commit }) {
    let params = {
      type: 4
    }
    return GLOBAL.ajax['warehouse/globalUnitList'](params).then(data => {
      commit('setUnitList', data.rows)
    })
  },
  getCurrencyList({ commit }) {
    let params = {
      type: 3
    }
    return GLOBAL.ajax['warehouse/globalUnitList'](params).then(data => {
      commit('setCurrencyList', data.rows)
    })
  },
  getWmWarehouseStaffList({ commit }, staffType) {
    let params = {
      staffType
    }
    return GLOBAL.ajax['warehouse/WmWarehouseStaffList'](params).then(data => {
      commit('setWmWarehouseStaffList', data.rows)
    })
  }
}
const mutations = {
  setWmWarehouseGlobalAllList(state, data) {
    state.wmWarehouseGlobalAllList = data.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
  },
  setTransportationList(state, data) {
    state.transportationList = data.map(item => {
      return {
        label: item.logisticTransportationName,
        value: item.logisticTransportationId
      }
    })
  },
  setForwarderList(state, data) {
    state.forwarderList = data.map(item => {
      return {
        label: item.forwarderName,
        value: item.logisticForwarderId
      }
    })
  },
  setTransportTypeList(state, data) {
    state.transportTypeList = data.map(item => {
      return {
        label: item.value,
        value: item.key
      }
    })
  },
  setTransportList(state, data) {
    state.transportList = data.map(item => {
      return {
        label: item.transportTypeName,
        value: item.logisticTransportTypeId
      }
    })
  },
  setForwarderTypeList(state, data) {
    state.forwarderTypeList = data.map(item => {
      return {
        label: item.transportTypeName,
        value: item.logisticTransportTypeId
      }
    })
  },
  setManifestTempList(state, data) {
    state.manifestTempList = data.map(item => {
      return {
        label: item.customsDeclarationName,
        value: item.customsDeclarationId
      }
    })
  },
  setFaceSheetTempList(state, data) {
    state.faceSheetTempList = data.map(item => {
      return {
        label: item.customsDeclarationName,
        value: item.customsDeclarationId
      }
    })
  },
  setCustomFaceSheetTempList(state, data) {
    state.customFaceSheetTempList = data.map(item => {
      return {
        label: item.customsDeclarationName,
        value: item.customsDeclarationId
      }
    })
  },
  setCustomManifestTempList(state, data) {
    state.customManifestTempList = data.map(item => {
      return {
        label: item.customsDeclarationName,
        value: item.customsDeclarationId
      }
    })
  },
  setDeclareList(state, data) {
    state.declareList = data.map(item => {
      return {
        label: item.declareName,
        value: item.logisticDeclareId
      }
    })
  },
  setWmWarehouseGlobalLists(state, data) {
    state.WmWarehouseGlobalLists = data.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
  },
  setCurrencyTypeList(state, data) {
    console.log(data)
    // state.currencyTypeList = data  数据处理
  },
  setAreaList(state, data) {
    state.areaList = data.map(item => {
      return {
        label: item.logisticRegionName,
        value: item.logisticRegionId
      }
    })
  },
  setLogisticRegionList(state, data) {
    state.logisticRegionList = data.map(item => {
      return {
        label: item.logisticRegionName,
        value: item.logisticRegionId
      }
    })
  },
  setProductTypeList(state, data) {
    state.productTypeList = data.map(item => {
      return {
        label: item.value,
        value: item.key
      }
    })
  },
  setNationList(state, data) {
    state.nationList = data.map(item => {
      return {
        label: item.countryName,
        value: item.countryId
      }
    })
  },
  setUnitList(state, data) {
    state.unitList = data.map(item => {
      return {
        label: item,
        value: item
      }
    })
  },
  setCurrencyList(state, data) {
    state.currencyList = data.map(item => {
      return {
        label: item,
        value: item
      }
    })
  },
  setWmWarehouseStaffList(state, data) {
    state.WmWarehouseStaffList = data.map(item => {
      return {
        label: item.nickName,
        value: item.userId,
        staffType: item.staffType
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
