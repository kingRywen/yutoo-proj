<template>
  <main-layout
    class="w600"
    :outerParams="{...storeInfo,merchantTaskId}"
    :columns="columns"
    edit-width="160px"
    :right-edit-btns="editBtns"
    :isShowPag="false"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="proPick/categoryDepthTaskMerchantAttrList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  props: ['merchantTaskId'],
  data() {
    return {
      columns: [
        {
          label: '属性名称',
          value: 'attrKey'
        }
      ],
      topBatchBtn: {
        title: '属性',
        options: [
          {
            label: '删除属性'
          }
        ]
      },
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.addProp(this.$refs.layout.tableList)
          }
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      switch (val[0]) {
        case '删除属性':
          this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
            return this.delProp(sel.map(e => e.attrKey))
          })
          break

        default:
          break
      }
    },
    addProp(select) {
      this._openDialog({
        size: 'medium',
        title: '添加/编辑属性',
        params: {
          select,
          merchantTaskId: this.merchantTaskId
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./addProp.vue')
      })
    },
    delProp(attrKeys) {
      let params = {
        ...this.storeInfo,
        merchantTaskId: this.merchantTaskId,
        attrKeys
      }
      return this.$api[`proPick/categoryDepthTaskMerchantRemoveAttr`](params)
    }
  }
}
</script>