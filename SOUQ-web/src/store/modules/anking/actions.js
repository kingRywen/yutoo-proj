import {

  // getkeywordRankingList, // 关键词排名列表获取
  addKeywordRankingTask, // 关键词排名_添加任务
  getCategoryRankingList, // 类目排名列表获取
  getAdvertisementRankingList
} from '../../../api/get'

export default {

  // 关键词排名列表获取
  // async getkeywordRankingListApi({
  //   commit
  // }, params) {
  //   let res = await getkeywordRankingList(params)
  //   commit('getWordRankingLists', res)
  // },
  // 关键词排名_添加任务
  async addKeywordRankingTaskApi ({
    commit
  }, params) {
    let res = await addKeywordRankingTask(params)
    commit('addKeywordRankingTasks', res)
  }
  // // 类目排名列表获取
  // async getCategoryRankingListsApi ({
  //   commit
  // }, params) {
  //   let res = await getCategoryRankingList(params)
  //   commit('addLisRankings', res)
  // }
  // // 广告排名列表获取
  // async getAdvertisementRankingListApi ({
  //   commit
  // }, params) {
  //   let res = await getAdvertisementRankingList(params)
  //   commit('getAdvertisementRankingList', res)
  // }

}
