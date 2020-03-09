<template>
  <main-layout
    :outerParams="storeInfo"
    :searchFields="searchFields"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    :btnFn="btnFn"
    @left-batch-change="handleLeftBatchChange"
    url="proPick/categoryDepthTaskMerchantList"
    ref="layout"
  ></main-layout>
</template>
<script>
import { timeField } from 'Utils/table-render.js'
export default {
  data() {
    let status = this.$const['PRODUCTANALYSIS/status']
    return {
      searchFields: {
        searchText: {
          placeholder: '请输入类目..'
        },
        createTime: timeField('创建时间', 'createTime'),
        resultTime: timeField('更新时间', 'resultTime'),
        status: {
          label: '状态',
          labelWidth: '50px',
          widget: 'select',
          hidden: true,
          options: status
        }
      },
      columns: [
        {
          label: '类目',
          copyProps: 'category',
          noTooltip: true,
          render(h, scope) {
            let { category, categoryUrl } = scope.row
            let cates = category.split(':')
            return (
              <a class="link" href={categoryUrl} target="_blank">
                {cates.length > 3 ? (
                  <el-tooltip placement="top" content={category}>
                    <span>
                      {cates.slice().shift() +
                        '：......：' +
                        cates.slice().pop()}
                    </span>
                  </el-tooltip>
                ) : (
                  category
                )}
              </a>
            )
          }
        },
        {
          label: '创建时间',
          value: 'createTime',
          sortable: 'custom'
        },
        {
          label: '状态',
          value: 'status',
          _enum: this.cfuns.arrayToObj(status)
        },
        {
          label: '数据更新时间',
          value: 'resultTime',
          sortable: 'custom'
        }
      ],
      edits: [
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            this.$router.push({
              path: '/proPick/deepCateAnalyze/detail',
              query: {
                id: scope.row.merchantTaskId,
                category:
                  scope.row.category.indexOf(':') > -1
                    ? scope.row.category.split(':').pop()
                    : scope.row.category
              }
            })
          }
        },
        {
          name: '重新抓取',
          perm: 'addTask',
          fn: scope => {
            this.batch([scope.row.merchantTaskId], '重新抓取')
          }
        },
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {
            this.batch([scope.row.merchantTaskId], '删除')
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
      topBatchBtn: {
        title: '类目',
        options: [
          {
            label: '重新抓取'
          },
          {
            label: '删除'
          }
        ]
      }
    }
  },
  methods: {
    add() {
      this.$_dialog({
        size: 'medium',
        title: '添加类目',
        params: {
          type: 'depth'
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('../cateAnalyze/dialogs/add')
      })
    },
    handleLeftBatchChange(val, sel) {
      let merchantTaskIds = sel.map(e => e.merchantTaskId)
      switch (val[0]) {
        case '重新抓取':
          this.batch(merchantTaskIds, '重新抓取')
          break
        case '删除':
          this.batch(merchantTaskIds, '删除')
          break

        default:
          break
      }
    },
    batch(merchantTaskIds, type) {
      this.showTips({ msg: `此操作将${type}数据, 是否继续?` }, () => {
        return this.$api[
          `proPick/categoryDepthTaskMerchant${
            type == '重新抓取' ? 'ReCrawl' : 'Remove'
          }`
        ]({
          ...this.storeInfo,
          merchantTaskIds
        })
      })
    },
    btnFn(row) {
      let { status } = row
      if (status == 1) {
        return [3]
      }
      if (status == 2) {
        return [1, 2, 3]
      }
      if (status == 3) {
        return [2, 3]
      }
    }
  }
}
</script>