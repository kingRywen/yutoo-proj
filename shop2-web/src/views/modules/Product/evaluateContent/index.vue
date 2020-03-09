<template>
  <main-layout
    :outerParams="storeInfo"
    :searchFields="searchFields"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    :btnFn="btnFn"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="productAnalysis/rcTaskList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  data() {
    return {
      topBatchBtn: {
        title: '任务',
        options: [
          {
            label: '重新抓取'
          },
          {
            label: '删除'
          }
        ]
      },
      editBtns: [
        {
          name: '添加任务',
          // // icon: 'el-icon-plus',
          perm: 'add',
          fn: () => {
            this.addTask()
          }
        }
      ],
      searchFields: {
        taskName: {
          placeholder: '任务名称',
          suffixIcon: 'el-icon-search'
        },
        createTime: {
          labelWidth: '78px',
          widget: 'daterange',
          hidden: true,
          label: '创建时间',
          fields: ['startTime', 'endTime']
        },
        resultTime: {
          hidden: true,
          labelWidth: '78px',
          widget: 'daterange',
          label: '更新时间'
          // time: true
        },
        status: {
          hidden: true,
          labelWidth: '80px',
          width: '120px',
          widget: 'select',
          options: this.$const[`PRODUCTANALYSIS/status`],
          label: '抓取状态'
        }
      },
      edits: [
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            this.$router.push({
              path: '/product/evaluateContent/rep',
              query: {
                taskId: scope.row.taskId
                // asin: scope.row.defaultAsin
              }
            })
          }
        },
        {
          name: '重新抓取',
          fn: scope => {
            this.reCawl([scope.row.taskId])
          }
        },
        {
          name: '编辑',
          fn: scope => {
            this._edit(scope.row)
          }
        },
        {
          name: '删除',
          fn: scope => {
            this.del([scope.row.taskId])
          }
        }
      ],
      columns: [
        {
          label: '任务名称',
          value: 'taskName'
        },
        {
          label: '数据源',
          url: true,
          showBtn: true,
          numField: 'resultCnt',
          btnClick: scope => {
            // console.log(2)
            this.showSc(scope.row.taskId, scope.row)
          },
          value: 'defaultAsin'
        },
        {
          label: '创建时间',
          value: 'createTime',
          sortable: 'custom'
        },
        {
          label: '抓取状态',
          value: 'status',
          _enum: {
            1: '抓取中',
            2: '抓取成功',
            '>=3': '抓取失败'
          }
        },
        {
          label: '数据更新时间',
          value: 'dataTime',
          sortable: 'custom'
        }
      ]
    }
  },
  methods: {
    btnFn({ status }) {
      if (status == 1) {
        return [4]
      }
      if (status == 2) {
        return [1, 2, 3, 4]
      }
      if (status == 3) {
        return [2, 3, 4]
      }
    },
    showSc(taskId) {
      this.$_dialog({
        size: 'medium',
        fullscreen: false,
        title: '数据源',
        params: {
          taskId,
          stats: this.columns.find(el => el.value === 'status')._enum
        },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/source.vue')
      })
    },
    handleLeftBatchChange(val, selection) {
      let select = selection.map(el => el.taskId)
      switch (val[0]) {
        case '重新抓取':
          this.reCawl(select)
          break
        case '删除':
          this.del(select)
          break

        default:
          break
      }
    },
    // 重新抓取
    reCawl(taskIds) {
      let vm = this
      this.showTips({ msg: '是否重新抓取任务?' }, () => {
        return vm.$api[`productAnalysis/rcReCrawlTask`](
          vm.addParams({ taskIds })
        )
      })
    },
    _edit({ taskId, taskName }) {
      this.$_dialog({
        size: 'medium',
        title: '编辑任务',
        params: {
          taskId,
          info: { taskName }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/add.vue')
      })
    },
    // 删除
    del(taskIds) {
      let vm = this
      this.showTips({ msg: '是否删除任务?' }, () => {
        return vm.$api[`productAnalysis/rcRemoveTask`](
          vm.addParams({ taskIds })
        )
      })
    },
    addTask() {
      this.$_dialog({
        size: 'medium',
        title: '添加任务',
        params: {},
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/add.vue')
      })
    },
    addParams(data) {
      return { ...this.storeInfo, ...data }
    }
  }
}
</script>
