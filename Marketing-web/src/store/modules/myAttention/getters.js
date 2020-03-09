export default {

  // 分组数据 - 产品库
  productGroupList: state => {
    return [state.productGrouping]
  },

  // 分组数据 - 产品库 (选项)
  selectProductGroupList: state => {
    return state.productGrouping.groupingVOS || []
  },

  // 添加分组数据 产品库
  addProductGroupList: state => {
    let changedGroupData = state.productGrouping ? JSON.parse(JSON.stringify(state.productGrouping)) : null
    let data = changedGroupData && changedGroupData.groupingVOS
    if (data) {
      let index = data.findIndex(el => el.groupId === -1)
      data.splice(index, 1)
    }

    return data || []
  },

  // 分组数据 - 关键词库
  keywordGroupList: state => {
    return [state.keywordGrouping]
  },

  // 分组数据 - 关键词库 (选项)
  selectKeywordGroupList: state => {
    return state.keywordGrouping.groupingVOS || []
  },

  // 添加分组数据 关键词库
  addKeywordGroupList: state => {
    let changedGroupData = state.keywordGrouping ? JSON.parse(JSON.stringify(state.keywordGrouping)) : null
    let data = changedGroupData && changedGroupData.groupingVOS
    if (data) {
      let index = data.findIndex(el => el.groupId === -1)
      data.splice(index, 1)
    }

    return data || []
  }

}
