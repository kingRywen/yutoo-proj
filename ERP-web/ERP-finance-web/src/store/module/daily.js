const state = {
  inventoryType: [
    //盘点类型
    {
      label: '大盘',
      value: 1
    },
    {
      label: '中盘',
      value: 2
    },
    {
      label: '小盘',
      value: 3
    }
  ],
  //盘点状态
  inventoryStatus: [
    {
      label: '待审核',
      value: 1
    },
    {
      label: '待盘点',
      value: 2
    },
    {
      label: '盘点中',
      value: 3
    },
    {
      label: '已完成',
      value: 4
    },
    {
      label: '审核不通过',
      value: 5
    }
  ],
  packageList: [
    // { label: '待拣货', value: 1 },
    // { label: '拣货中', value: 2 },
    // { label: '待打印发货清单', value: 3 },
    // { label: '待打包核对', value: 4 },
    // { label: '待称重', value: 5 },
    // { label: '待打印面单', value: 6 },
    // { label: '待揽件', value: 7 },
    // { label: '已发货', value: 8 }
  ],
  //盘点库存范围
  inventoryRange: [
    {
      label: '所有库存',
      value: 1
    },
    {
      label: '部分库存',
      value: 2
    }
  ],
  //退换货原因
  problemTypeList: [
    {
      label: '库房致残',
      value: 1
    },
    {
      label: '无实物少配件',
      value: 2
    },
    {
      label: '没有收到包裹',
      value: 3
    },
    {
      label: '到货商品有残损',
      value: 4
    },
    {
      label: '商品错发',
      value: 5
    },
    {
      label: '客户无理由退换',
      value: 6
    },
    {
      label: '其他',
      value: 7
    }
  ],
  warehousingStatus: [
    {
      label: '已入库',
      value: 1
    },
    {
      label: '未入库',
      value: 2
    },
    {
      label: '部分入库',
      value: 3
    }
  ],
  //移库管理状态
  movelibraryStatus: [
    {
      label: '待审核',
      value: 1
    },
    {
      label: '移库中',
      value: 2
    },
    {
      label: '已完成',
      value: 3
    },
    {
      label: '审核不通过',
      value: 4
    }
  ],
  //仓库列表
  warehouseList: [],
  //篮子规格管理
  wmPickingBasketNormList: [],
  //人员
  personnel: {
    pickingList: [], //拣货人
    warehouseList: [], //仓库
    packingList: [] //包装
  },
  //运输方式
  logisticTlist: [],
  //物流属性
  logisticTypeList: [],
  //來源店鋪
  storeAllList: []
}
const getters = {
  wmPickingBasketNormList(state) {
    return state.wmPickingBasketNormList
  }
}
const actions = {
  getPackageList({ commit }) {
    GLOBAL.ajax['warehouse/packageState']({}).then(res => {
      commit('setPackageList', res.rows)
    })
  },
  getStoreAllList({ commit }) {
    GLOBAL.ajax['product/store_list_all']({}).then(res => {
      res.rows.forEach(item => {
        item['storeId'] = item.name
      })
      commit('setStoreAllList', res.rows)
    })
  },
  getLogisticTypeList({ commit }, type) {
    GLOBAL.ajax['product/globalEnumList']({
      type
    }).then(data => {
      let _data = data.map(el => {
        return {
          label: el.value,
          value: el.value // el.key
        }
      })
      commit('setRiskTypeList', _data)
    })
  },
  getLogisticTlist({ commit }) {
    return GLOBAL.ajax['warehouse/logisticTransportList']({}).then(res => {
      let list = res.rows.filter(i => i.activateFlag == 1)
      let result = list.map(i => {
        return {
          label: i.transportTypeName,
          value: i.logisticTransportTypeId,
          type: i.transportTypeStr
        }
      })
      commit('setLogisticTlist', result)
      return result
    })
  },
  getPersonnel({ commit }) {
    return GLOBAL.ajax['warehouse/wmWarehouseUserlist']({
      name: null
    }).then(res => {
      let arr = [...res.rows]
      arr.forEach(i => {
        i['label'] = i.name
        i['value'] = i.id
      })
      const obj = {
        warehouseList: arr.filter(i => i.staffType == 1),
        pickingList: arr.filter(i => i.staffType == 2),
        packingList: arr.filter(i => i.staffType == 3)
      }
      commit('setPersonnel', obj)
      return obj
    })
  },
  getWarehouseList({ commit }, activated = null) {
    return GLOBAL.ajax['warehouse/WmWarehouseGlobalList']({
      activated
    }).then(res => {
      let list = res.list.map(i => {
        return {
          label: i.name,
          value: i.id
        }
      })
      commit('setWarehouseList', list)
      return list
    })
  },
  getWmPickingBasketNormList({ commit }) {
    return GLOBAL.ajax['warehouse/WmPickingBasketNormgetList']({}).then(res => {
      let list = res.rows.map(i => {
        return {
          label: i.name,
          value: i.id
        }
      })
      commit('setWmPickingBasketNormList', list)
      return list
    })
  }
}
const mutations = {
  setPackageList(state, list) {
    state.packageList = list.map(i => {
      return {
        label: i.name,
        value: i.id
      }
    })
  },
  setStoreAllList(state, list) {
    state.storeAllList = list
  },
  setRiskTypeList(state, list) {
    state.logisticTypeList = list
  },
  setLogisticTlist(state, list) {
    state.logisticTlist = list
  },
  setPersonnel(state, obj) {
    state.personnel.pickingList = obj.pickingList
    state.personnel.warehouseList = obj.warehouseList
    state.personnel.packingList = obj.packingList
  },
  setWarehouseList(state, list) {
    state.warehouseList = list
  },
  setWmPickingBasketNormList(state, list) {
    state.wmPickingBasketNormList = list
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
