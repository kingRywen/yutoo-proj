import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  // 分组数据
  groupData: {},
  // table展示数据
  analysisList: {},

  tableLoading: false
}

// export default {
//   install () {
//     Store.registerModule('saleVolume', {
//       getters,
//       actions,
//       mutations,
//       state,
//       namespaced: true
//     })
//   },
//   uninstall () {
//     Store.unregisterModule('saleVolume')
//   }
// }
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
