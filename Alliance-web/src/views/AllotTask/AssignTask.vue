<template>
  <div>
    <main-layout :sideBar="false" :search-fields="searchFields" :loadData="loadData" ref="lay" :tableCols="tableCols"></main-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchFields: [
        {
          name: 'taskName',
          label: '任务名称',
          span: 12
        },
        {
          type: 'cascader',
          name: 'categoryId',
          getEl: true,
          label: '类目',
          options: this.loadTree,
          span: 12,
          bind: {
            label: 'name',
            value: 'categoryId',
            children: 'childs',
            enabled: 'enabled',
            
          }
        }
      ],
      recipientUsers: [],

      tableCols: [
        {
          label: '任务名称',
          prop: 'taskName'
        }
      ]
    }
  },
  methods: {
    // 列表
    loadData(data) {
      let { time = [], ...info } = data
      let [queryStartDate, queryEndDate] = time
      let params = { queryStartDate, queryEndDate, ...info }
      return this.$api[`main/taskListUnAllot`](params)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    init() {
      let params = {
        pageSize: 50,
        pageNumber: 1
      }
      this.$api[`main/taskListUnAllot`](params)
        .then(data => {})
        .catch(err => {})
    },
    getRecipientUsers() {
      this.$api[`sysUserRecipientDropdownList`]({})
        .then(data => {
          this.recipientUsers = data
        })
        .catch(err => {})
    }
  }
}
</script>

<style>
</style>
