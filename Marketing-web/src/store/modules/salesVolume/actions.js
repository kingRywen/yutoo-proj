import {
  getSalesAnalysisList
} from '@/api/saleVolumeAnd'
import {
  getGroupingList
} from '@/api/globalGroup'

export default {

  // 获取分组
  async updateGroupData ({
    commit
  }, params) {
    let res = await getGroupingList(params)
    commit('updateGroupData', res)
  },

  // 获取市场列表
  async getSalesAnalysisList ({
    commit
  }, params) {
    commit('showLoading')
    let res = await getSalesAnalysisList(params)
    commit('hideLoading')
    commit('setSalesAnalysisList', res)
  }
}
