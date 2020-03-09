import {
  getMainIcon,
  getSubMenu,
  addCompeteKeywordAnalysis // 添加关键词竞争分析
} from '../../../api/get'

export default {
  async getMain({
    commit
  }, {
    route
  }) {
    // console.log(route)

    commit('getmain', await getMainIcon(route))
  },

  async getSiderBar({
    commit
  }, {
    route,
    mes,
    router
  }) {
    try {
      try {
        let res = await getSubMenu(route)
        if (res.data && res.data.code === 401) {
          // mes.error(res.data.msg)
          router.push('/login')
          return
        }
        commit('getSubMenu', res.data.menuList)
      } catch (e) {
        mes.error(e.message)
      }
    } catch (e) { }
  },
  // 关键词竞争分析添加的action写法
  async addCompeteKeywordAnalysisApi(
    { commit },
    params
  ) {
    // console.log(params)
    try {
      let res = await addCompeteKeywordAnalysis(params)
      if (res && res.code === 0) {
        // console.log(res)
        commit('addKeywordAnalysis', res)
        return
      }
    }
    catch (err) {
      // console.log(err)
    }
  }
}