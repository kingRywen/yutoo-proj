export default {

  // 分组数据
  groupList: state => {
    return [state.groupData]
  },

  // 选项数据
  selectGroupList: state => {
    return state.groupData.groupingVOS || []
  },

  // 添加分组数据
  addGroupList: state => {
    let changedGroupData = state.groupData ? JSON.parse(JSON.stringify(state.groupData)) : null
    let data = changedGroupData && changedGroupData.groupingVOS
    if (data) {
      let index = data.findIndex(el => el.groupId === -1)
      data.splice(index, 1)
    }

    return data || []
  }

}
