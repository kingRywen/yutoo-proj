import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import { deepClone } from 'Utils/tools';

// 要重置的数据
const initState = {
  clearCate: null,
  sellerData: {

  },
  siteId__: null,
  select_parentSku: null,
  select_parentSkuMain: null,
  select_childSku: null,
  stateData: null,
  seller_Name: '选择店铺',
  seller_Img: null,
  parentSkus: null,
  childSkus: null,
  childSkus_1: null,
  isChildSku: false,
  selectParentSkus: null,
  selectChildSkus: null,
  afterDelGetList: null,
  routerType: null,

  parentSkusAll: null,
  childSkusAll: null,
}

const state = {
  ...deepClone(initState),
  initState() {
    return initState
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
