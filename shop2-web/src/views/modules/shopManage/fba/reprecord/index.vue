<template>
  <main-layout
    :outerParams="storeInfo"
    :searchFields="searchFields"
    :columns="columns"
    edit-width="160px"
    tbRightFixed="right"
    :edit-btns="edits"
    :topBatchBtn="topBatchBtn"
    :tableRowClassName="tableRowClassName"
    @left-batch-change="handleLeftBatchChange"
    url="fba/FbaReplenishInfoList"
    ref="layout"
  ></main-layout>
</template>
<script>
import { timeField } from 'Utils/table-render.js'
import { downloadFile } from 'Utils'
export default {
  data() {
    const tranType = this.$const['FBA/tranType']
    return {
      searchFields: {
        status: {
          widget: 'select',
          options: [
            {
              label: '未处理',
              value: 1
            },
            {
              label: '已处理（未发货）',
              value: 2
            },
            {
              label: '已处理（已发货）',
              value: 3
            },
            {
              label: '取消',
              value: 4
            },
            {
              label: '超时',
              value: 5
            }
          ]
        },
        confirmTime: timeField('确认时间', 'confirmTime'),
        bacthNumber: {
          label: '批次号',
          hidden: true,
          labelWidth: '70px'
        },
        transportId: {
          hidden: true,
          label: '运输方式',
          widget: 'select',
          options: tranType
        }
      },
      topBatchBtn: {
        title: '记录',
        options: [
          {
            label: '下载'
          },
          {
            label: '取消补货'
          }
        ]
      },

      edits: [
        {
          name: '下载',
          perm: 'addTask',
          fn: scope => {
            this.download([scope.row.replenishInfoId])
          }
        },
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            this.$_dialog({
              size: 'medium',
              title: '查看',
              params: {
                replenishInfoId: scope.row.replenishInfoId
              },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./view.vue')
            })
          }
        }
      ],
      columns: [
        {
          label: '批次号',
          value: 'batchNum'
        },
        {
          label: '店铺',
          value: 'storeName'
        },
        {
          label: '运输方式',
          value: 'transportName'
        },
        {
          label: '确认时间',
          sortable: 'custom',
          value: 'confirmTime'
        },
        {
          label: '剩余备货天数',
          value: 'lastDay'
        },
        {
          label: '状态',
          value: 'statusName'
        }
      ]
    }
  },

  methods: {
    tableRowClassName({ row }) {
      if (row.statusName == '超时') {
        return '_delay'
      }
    },
    handleLeftBatchChange(val, sel) {
      const ids = sel.map(el => el.replenishInfoId)
      switch (val[0]) {
        case '下载':
          this.download(ids)
          break
        case '取消补货':
          this.cancel(ids)
          break

        default:
          break
      }
    },
    download(replenishInfoIds) {
      this.$api[`fba/FbaReplenishInfoDownload`]({ replenishInfoIds }).then(
        data => {
          downloadFile(data.path)
        }
      )
    },
    cancel(replenishInfoIds) {
      this.showTips({ msg: '此操作将取消补货, 是否继续?' }, () => {
        return this.$api[`fba/FbaReplenishInfoCancel`]({ replenishInfoIds })
      })
    }
  }
}
</script>
<style lang="scss">
.el-table__row._delay .cell .over span {
  color: #c9c9c9;
}
</style>