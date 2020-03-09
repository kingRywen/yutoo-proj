<template>
  <main-layout
    :outerParams="storeInfo"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    :right-edit-btns="editBtns"
    @left-batch-change="handleLeftBatchChange"
    url="productAnalysis/rcTaskList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          label: '店铺名称',
          value: 'name'
        },
        {
          label: 'eBay账号',
          value: 'id'
        },
        {
          label: '授权类型',
          value: 'id'
        },
        {
          label: '密钥到期时间',
          value: 'id'
        }
      ],
      edits: [
        {
          name: '重新授权',
          perm: 'addTask',
          fn: scope => {}
        },
        {
          name: '绑定邮箱',
          perm: 'addTask',
          fn: scope => {}
        },
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {}
        }
      ],
      editBtns: [
        {
          name: '添加授权',
          perm: 'add',
          fn: () => {}
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {}
  }
}
</script>