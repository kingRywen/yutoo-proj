<template>
  <div>
    <main-layout
      :columns="columns"
      :searchFields="searchFields"
      url="fba/FbaReplenishRecordMwsList"
      :edit-btns="rightEditBtns"
      ref="layout"
      :btnFn="btnFn"
    ></main-layout>
  </div>
</template>
<script>
import { timeField } from 'Utils/table-render'
import { downloadFile } from 'Utils'
export default {
  data() {
    return {
      searchFields: {
        time: timeField(
          '同步时间',
          'synTime',
          '70px',
          'datetimerange',
          false,
          true
        )
      },
      rightEditBtns: [
        {
          name: '下载',
          perm: 'add',
          fn: scope => {
            downloadFile(scope.row.reportPath)
          }
        },
        {
          name: '重试',
          perm: 'add',
          fn: scope => {
            const params = { mwsRecordId: scope.row.mwsRecordId }
            this.$api[`fba/FbaReplenishRecordMwsAgain`](params).then(data => {
              this.$refs.layout.getList()
            })
          }
        }
      ],
      columns: [
        {
          label: '操作时间',
          value: 'synTime'
        },
        {
          label: '店铺',
          value: 'storeName'
        },
        {
          label: '状态',
          value: '',
          render(h, scope) {
            const { synCount, synSuccCount, synFailureCount } = scope.row
            return (
              <span>
                同步总数量:{synCount}, 成功数:{synSuccCount}, 失败数:
                {synFailureCount}
              </span>
            )
          }
        },
        {
          label: '描述',
          value: 'remarks'
        }
      ]
    }
  },
  methods: {
    btnFn(row) {
      if (row.reportPath) {
        return [1, 2]
      } else {
        return [2]
      }
    }
  }
}
</script>