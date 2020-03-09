import {
  getGroupingList,
  getkeywordLib,
  getProductLib
} from '@/api/globalGroup'

export default {

  // 获取分组 groupType 0-关键词库,1-产品库,2-竞品分析,3-店铺分析,4-销量分析
  async updateGroupData({
    commit
  }, params) {
    params = {
      groupType: 1,
      ...params
    }
    let res = await getGroupingList(params)
    if (params.groupType === 1) {
      commit('updateGroupData', res)
    }
    if (params.groupType === 0) {
      commit('updateGroupDataKeyword', res)
    }
  },

  // 获取产品库列表
  async updateProductLib({
    commit
  }, params) {
    let res = await getProductLib({
      ...params
    }, true)
    commit('updateProductLib', res)
  },

  // 获取关键词库列表
  async updatekeywordLib({
    commit
  }, params) {
    commit('setLoading', true)
    let res = await getkeywordLib({
      ...params
    })

    commit('updatekeywordLib', res)
    commit('setLoading', false)
  }
}
