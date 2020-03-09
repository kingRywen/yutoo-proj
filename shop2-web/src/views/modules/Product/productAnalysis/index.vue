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
    url="productAnalysis/paTaskList"
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
        // a: {
        //   type: 'object',
        //   label: '搜索量',
        //   properties: {
        //     min: {
        //       widget: 'number',
        //       width: 30,
        //       span: 12
        //     },
        //     max: {
        //       widget: 'number',
        //       labelWidth: '20px',
        //       label: '~',
        //       width: 30,
        //       span: 12
        //     }
        //   }
        // },
        createTime: {
          labelWidth: '70px',
          widget: 'daterange',
          label: '创建时间',
          fields: ['createStartTime', 'createEndTime']
        },
        status: {
          labelWidth: '51px',
          widget: 'select',
          options: this.$const[`PRODUCTANALYSIS/status`],
          label: '状态'
        },
        resultTime: {
          hidden: true,
          labelWidth: '110px',
          widget: 'daterange',
          label: '数据更新时间',
          fields: ['dataStartTime', 'dataEndTime']
          // time: true
        },
        asin: {
          hidden: true,
          label: 'ASIN',
          labelWidth: '56px'
        }
      },
      edits: [
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            this.$router.push({
              path: '/product/productAnalysis/details',
              query: {
                taskId: scope.row.taskId,
                asin: scope.row.asin,
                endTime: scope.row.dataTime
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
          name: '删除',
          fn: scope => {
            this.del([scope.row.taskId])
          }
        }
      ],
      columns: [{
          label: '主图',
          img: true,
          width: 85,
          value: 'imageUrl'
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        
        {
          label: '创建时间',
          value: 'createTime',
          sortable: 'custom'
        },
        {
          label: '数据更新时间',
          value: 'dataTime',
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
        }
      ]
    }
  },
  methods: {
    btnFn({ status }) {
      if (status == 1) {
        return [3]
      }
      if (status == 2) {
        return [1, 2, 3]
      }
      if (status == 3) {
        return [2, 3]
      }
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
        return vm.$api[`productAnalysis/paReCrawlTask`](
          vm.addParams({ taskIds })
        )
      })
    },
    // 删除
    del(taskIds) {
      let vm = this
      this.showTips({ msg: '是否删除任务?' }, () => {
        return vm.$api[`productAnalysis/paRemoveTask`](
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
