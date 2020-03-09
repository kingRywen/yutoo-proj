import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import { deepClone } from 'Utils/tools';

//需要存储的时间
const initState = {
  customerAnalysisTime: null,
  customerDistributionTime:null,
  adManualOptimizeTime:null,
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
