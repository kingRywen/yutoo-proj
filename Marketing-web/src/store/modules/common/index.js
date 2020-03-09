import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = {
  pathFromCheckProductAnalysis: '', // 竞品分析查看高亮path
  breadList: [],
  setLoginData: '',
  pageId: "",
  savePlatformIdAndSiteId: '',
  type_keyword: '',
  key_index_charge: "",
  userSelect: '',
  unreadCnt: '',
  messageArr: '',
  messageUrl: '',
  num: 0,
  groupingVOS: [],
  downName: '',
  showResidualCapacity: true,
  residualCapacity: null
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
