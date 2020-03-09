// import { deleteObj } from '../../../plugins/utils'

export default {
  // 添加tabs
  addTabs (state, data) {
    state.options.push(data)
  },
  // 删除tabs
  deleteTabs (state, route) {
    let index = 0
    for (const option of state.options) {
      if (option.route === route) {
        break
      }
      index++
    }
    state.options.splice(index, 1)
  },
  // 设置激活当前tab
  setActiveTab (state, index) {
    state.activeIndex = index
  },
  // 初始化数据
  clean (state) {
    console.log('delete')
    // deleteObj(state)
    state.options = []
    state.activeIndex = '/user'
  }
}
