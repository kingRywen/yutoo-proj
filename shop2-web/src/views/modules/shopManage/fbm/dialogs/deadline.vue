<template>
  <main-layout
    :outerParams="storeInfo"
    :columns="columns"
    :edit-btns="edits"
    :isShowPag="false"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="fba/"
    ref="layout"
  ></main-layout>
</template>
<script>
// FIXME:
export default {
  data() {
    return {
      topBatchBtn: {
        title: '店铺',
        options: [
          {
            label: '编辑'
          }
        ]
      },
      columns: [
        {
          label: '店铺名称',
          value: ''
        },
        {
          label: '发货期限',
          value: ''
        }
      ],
      edits: [
        {
          name: '编辑',
          perm: 'addTask',
          fn: scope => {}
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {}
  }
}
</script>