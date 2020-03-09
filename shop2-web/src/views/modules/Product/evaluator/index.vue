<template>
  <div>
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
      url="productAnalysis/reviewerTaskList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
import { arrayToObj } from 'Utils'
export default {
  data() {
    return {
      searchFields: {
        taskName: {
          placeholder: '请输入任务ID',
          suffixIcon: 'el-icon-search'
        },
        createTime: {
          hidden: true,
          labelWidth: '80px',
          widget: 'daterange',
          label: '创建时间',
          fields: ['createStartTime', 'createEndTime']
        },
        resultTime: {
          hidden: true,
          labelWidth: '80px',
          widget: 'daterange',
          label: '更新时间',
          fields: ['dataStartTime', 'dataEndTime']
          // time: true
        },
        status: {
          hidden: true,
          labelWidth: '80px',
          widget: 'select',
          width: '100px',
          options: this.$const[`PRODUCTANALYSIS/status`],
          label: '抓取状态'
        }
      },
      columns: [
        {
          label: '任务ID',
          value: 'taskName'
        },
        {
          label: '数据类型',
          value: 'dataType',
          _enum: arrayToObj(this.$const['PRODUCTANALYSIS/evaDataType'])
        },

        {
          label: '数据源',
          value: 'defaultSource',
          url: true,
          showTooltip: true,
          numField: 'resultCnt',
          showBtn: true,
          btnClick: scope => {
            let { dataType, taskId } = scope.row
            if (dataType == 2 || dataType == 1) {
              window.open(scope.row.defaultSource)
            } else {
              this.$_dialog({
                size: 'medium',
                title: '数据源',
                params: { taskId },
                cancelBtnText: '关闭',
                component: () => import('./dialogs/source.vue')
              })
            }
          }
        },
        {
          label: '创建时间',
          sortable: 'custom',
          value: 'createTime'
        },
        {
          label: '抓取状态',
          value: 'status',
          _enum: arrayToObj(this.$const['PRODUCTANALYSIS/status'])
        },
        {
          label: '数据更新时间',
          sortable: 'custom',
          value: 'dataTime'
        }
      ],
      edits: [
        {
          name: '查看',
          fn: scope => {
            this.$router.push({
              path: '/product/evaluator/list',
              query: {
                taskId: scope.row.taskId
              }
            })
          }
        },
        {
          name: '重新抓取',
          fn: scope => {
            this.reCrawl([scope.row.taskId])
          }
        },
        {
          name: '删除',
          fn: scope => {
            this.del([scope.row.taskId])
          }
        }
      ],
      editBtns: [
        {
          name: '添加任务',
          perm: 'add',
          fn: () => {
            this.addTask()
          }
        }
      ],
      topBatchBtn: {
        loading: false,
        title: '任务',
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
    reCrawl(taskIds) {
      this.showTips({ msg: '是否重新抓取任务？' }, () => {
        return this.$api[`productAnalysis/reviewerReCrawlTask`]({
          ...this.storeInfo,
          taskIds
        })
      })
    },
    del(taskIds) {
      this.showTips({ msg: '是否删除任务？' }, () => {
        return this.$api[`productAnalysis/reviewerRemoveTask`]({
          ...this.storeInfo,
          taskIds
        })
      })
    },
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
    handleLeftBatchChange(val, selection) {
      let taskIds = selection.map(el => el.taskId)
      switch (val[0]) {
        case '重新抓取':
          this.reCrawl(taskIds)
          break
        case '删除':
          this.del(taskIds)
          break

        default:
          break
      }
    }
  }
}
</script>