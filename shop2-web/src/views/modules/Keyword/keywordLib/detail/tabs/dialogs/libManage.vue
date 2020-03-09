<template>
  <div class="w1100">
    <main-layout
      :outerParams="{...storeInfo,categoryId}"
      :searchFields="searchFields"
      :columns="columns"
      edit-width="160px"
      :right-edit-btns="editBtns"
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="keyword/keywordLibProductList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['categoryId', 'closeFn'],
  data() {
    return {
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        searchText: {
          placeholder: '产品名称'
          // suffix: 'el-icon-search'
        }
      },
      columns: [
        {
          label: '产品名称',
          value: 'productName',
          editFn: (row, val) => {
            // console.log(row)
            return this.editPro(row, val)
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          perm: 'add',
          fn: scope => {
            this.$refs.layout.toggleRowEdit(scope.row, 'productName', true)
          }
        }
      ],
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.add()
          }
        }
      ]
    }
  },

  methods: {
    editPro(row, val) {
      return this.$api[`keyword/keywordLibUpdateProduct`]({
        ...this.storeInfo,
        categoryId: this.categoryId,
        productId: row.productId,
        productName: val
      })
    },
    _close() {
      this.closeFn()
    },
    add() {
      this._openDialog({
        size: 'medium',
        title: '添加产品',
        params: {
          categoryId: this.categoryId
        },
        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./add.vue')
      })
    },
    del(productIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`keyword/keywordLibRemoveProduct`]({
          ...this.storeInfo,
          categoryId: this.categoryId,
          productIds
        })
      })
    },
    handleLeftBatchChange(val, select) {
      switch (val[0]) {
        case '删除':
          this.del(select.map(el => el.productId))
          break

        default:
          break
      }
    }
  }
}
</script>