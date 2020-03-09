<template>
  <main-layout
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    :right-edit-btns="editBtns"
    :topBatchBtn="topBatchBtn"
    :btnFn="btnFn"
    @left-batch-change="leftBatchChange"
    url="productAnalysis/ptTaskList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  data() {
    let vm = this
    return {
      topBatchBtn: {
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
            this.showDialogGlobal(`添加任务`, '100%', {}, () =>
              import('./dialogs/add.vue')
            )
          }
        }
      ],
      searchFields: {
        taskName: {
          placeholder: '任务名称',
          labelWidth: '80px'
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
        },
        status: {
          hidden: true,
          labelWidth: '80px',
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
            let params = {
              taskIds: [scope.row.taskId],
              ...vm.outerParams,
              dataTime: scope.row.dataTime.split(' ')[0]
            }
            this.showDialogGlobal(
              `评价曲线`,
              '100%',
              params,
              () =>
                import(
                  'Views/modules/Product/productTrendAnalysis/dialogs/echarts.vue'
                ),
              '',
              '关闭'
            )
          }
        },
        {
          name: '重新抓取',
          fn: scope => {
            let params = { taskIds: [scope.row.taskId], ...vm.outerParams }
            this.showConfirmGlobal(
              'productAnalysis/ptReCrawlTask',
              params,
              '重新抓取'
            )
          }
        },
        {
          name: '编辑',
          show: scope => {
            return scope.row.dataType === 0
          },
          fn: scope => {
            this.showDialogGlobal(
              `编辑任务`,
              '100%',
              { edit: true, data: scope.row },
              () => import('./dialogs/add.vue')
            )
          }
        },
        {
          name: '删除',
          fn: scope => {
            let params = { taskIds: [scope.row.taskId], ...vm.outerParams }
            this.showConfirmGlobal(
              'productAnalysis/ptRemoveTask',
              params,
              '删除'
            )
          }
        }
      ],
      columns: [
        {
          label: '任务名称',
          value: 'taskName'
        },
        {
          label: '数据类型',
          value: 'dataType',
          _enum: {
            0: '产品',
            1: 'Top100链接'
          }
        },
        {
          label: '数据源',
          value: 'defaultSource',
          url: true,
          showTooltip: true,
          numField: 'resourceCnt',
          showBtn: true,
          btnClick: scope => {
            let { dataType, taskId } = scope.row
            if (dataType !== 0) {
              window.open(scope.row.defaultSource)
            } else {
              vm.showDialog(taskId)
            }
          }
        },
        //123/
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
    btnFn({ status, dataType }) {
      if (status == 1) {
        return [4]
      }
      if (status == 2 && dataType === 0) {
        return [1, 2, 3, 4]
      } else {
        return [1, 2, 4]
      }
      if ((status == 3 || status > 3) && dataType === 0) {
        return [2, 3, 4]
      } else {
        return [2, 4]
      }
    },
    showDialog(id) {
      this.showDialogGlobal(
        `数据源`,
        '100%',
        { id: id, url: 'productAnalysis/ptAsinList' },
        () =>
          import(
            'Views/modules/Product/productTrendAnalysis/dialogs/table.vue'
          ),
        '',
        '关闭'
      )
    },
    leftBatchChange(type, data) {
      let params = {
        ...this.outerParams,
        taskIds: data.map(e => e.taskId)
      }
      switch (type[0]) {
        case '重新抓取':
          this.showConfirmGlobal(
            'productAnalysis/ptReCrawlTask',
            params,
            '重新抓取'
          )
          break
        case '删除':
          this.showConfirmGlobal('productAnalysis/ptRemoveTask', params, '删除')
          break
      }
    }
  },
  computed: {
    outerParams() {
      return {
        platformId: this.storeInfo.platformId,
        siteId: this.storeInfo.siteId
      }
    }
  }
}
</script>