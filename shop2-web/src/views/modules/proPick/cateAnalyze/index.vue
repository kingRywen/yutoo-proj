<template>
  <main-layout
    :outerParams="storeInfo"
    :searchFields="searchFields"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="proPick/categoryTaskMerchantList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  data() {
    return {
      topBatchBtn: {
        title: '类目',
        options: [
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        searchText: {
          placeholder: '请输入类目..'
        }
      },
      columns: [
        {
          label: '类目',
          noTooltip: true,
          copyProps: 'category',
          // value: '',
          render(h, scope) {
            let { category, categoryUrl } = scope.row
            let cates = category.split(':')
            return (
              <el-tooltip placement="top-start" content={category}>
                <a class="link" href={categoryUrl} target="_blank">
                  {cates.length > 3
                    ? cates.slice().shift() + '：......：' + cates.slice().pop()
                    : category}
                </a>
              </el-tooltip>
            )
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
      ],
      edits: [
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            this.$router.push({
              path: '/proPick/cateAnalyze/detail',
              query: {
                id: scope.row.merchantTaskId,
                title: scope.row.category
              }
            })
          }
        },
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {
            this.del([scope.row.merchantTaskId])
          }
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      switch (val[0]) {
        case '删除':
          this.del(sel.map(e => e.merchantTaskId))
          break

        default:
          break
      }
    },
    del(merchantTaskIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`proPick/categoryTaskMerchantRemove`]({
          ...this.storeInfo,
          merchantTaskIds
        })
      })
    },
    add() {
      this.$_dialog({
        size: 'medium',
        title: '添加类目',
        params: {},
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/add.vue')
      })
    }
  }
}
</script>