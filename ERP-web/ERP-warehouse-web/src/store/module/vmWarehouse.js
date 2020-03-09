/**
 * 仓库管理模块
 */
const state = {
  warehouseType: [], // 仓库类型
  warehouseStatus: [], // 仓库状态
  countrys: [], // 国家列表
  warehouseList: [], // 仓库列表
  regionalList: [], // 区域列表
  warehouseLocationStatus: [], // 仓库库位状态
  warehouseLocationActiveState: [], // 仓库库位激活状态
  locationSizeList: [], // 库位大小
  locationSpecifications: [], // 库位规格

}
const getters = {}
const actions = {
  queryData({
    commit
  }, type) {
    /**
     * type = 0 仓库类型
     *        1 仓库状态
     *        2 国家列表
     *        3 仓库列表
     *        4 区域列表 (传参可获取仓库列表)
     *        5 仓库库位状态
     *        6 仓库库位激活状态
     *        7 库位大小
     *        8 库位规格
     */
    let outParams = {}
    if (typeof type === 'object') {
      outParams = type.outParams
      type = type.type
    }
    let api = ['wmWarehouseGlobalType', 'wmWarehouseGlobalStatus', 'wmWarehouseGlobalCountry', 'wmWarehouseGlobalList', 'wmWarehouseGlobalDivisionList', 'wmWarehouseGlobalLocationStatus', 'wmWarehouseGlobalLocationActivated', 'wmWarehouseGlobalLocationNorm', 'wmLocationNormGlobalList']
    let params = Object.assign({}, outParams)
    if (type == 3) {
      params.activated = 1
    }
    console.log(outParams);
    return GLOBAL.ajax[`warehouse/${api[type]}`](params).then((data) => {
      data = data.list.map(el => ({
        label: el.name,
        value: el.id
      }))
      commit('setWarehouseType', {
        data: data,
        type
      })
      return data
    })
  },
}
const mutations = {
  clearRegionalList(state) {
    state.regionalList.splice(0)
  },
  setWarehouseType(state, {
    data,
    type
  }) {

    switch (type) {
      case 0:
        state.warehouseType = data
        break;
      case 1:
        state.warehouseStatus = data
        break;
      case 2:
        state.countrys = data
        break;
      case 3:
        state.warehouseList = data
        break;
      case 4:
        state.regionalList = data
        break;
      case 5:
        state.warehouseLocationStatus = data
        break;
      case 6:
        state.warehouseLocationActiveState = data
        break;
      case 7:
        state.locationSizeList = data
        break;
      case 8:
        state.locationSpecifications = data
        break;

      default:
        break;
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