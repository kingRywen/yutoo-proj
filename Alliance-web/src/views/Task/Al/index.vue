<template>
  <div>
    <NewMainLayout
      ref="lay"
      url="main/taskAllotTaskList"
      :searchFunc="searchFunc"
      editWidth="110px"
      :showError="showError"
      :searchFields="searchFields"
      :columns="columns"
    >
      <template slot="errorMsg" slot-scope="scope">
        <span class="danger">{{scope.row.exception == 0 ? '不能登录' : scope.row.exception == 1 ? '不能评价' : '' }}</span>
      </template>
    </NewMainLayout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      taskInfo: {},
      events: {},
      options: {
        title: '分配手动任务',
        width: '800px',
        visible: false
      },
      infoOptions: {
        title: '任务详情',
        width: '600px',
        visible: false
      },
      infoEvents: {},
      searchFields: {
        email: {
          label: '操作员账号'
        },
        account: {
          label: '平台账号'
        },
        status: {
          label: '任务状态',
          widget: 'select',
          options: [
            { label: '未开始', value: '0' },
            { label: '进行中', value: '1' },
            { label: '已完成', value: '2' },
            { label: '已过期', value: '3' },
            { label: '已失败', value: '4' }
          ]
        },
        terminalType: {
          label: '终端类型',
          widget: 'select',
          options: this.$const['OTHER/termnalType'].concat({
            label: '虚拟机',
            value: 3
          })
        },
        terminalCode: {
          label: '终端编号'
        }
        // taskTypeName: {
        //   label: '任务类型',
        //   widget: 'select',
        //   options: () =>
        //     this.$api[`main/taskAllotTaskTypeList`]({}).then(data =>
        //       data.rows.map(el => ({ label: el.name, value: el.taskTypeId }))
        //     )
        // },
        // taskName: {
        //   label: '任务ID'
        // }
      },
      addFields: [],
      columns: [
        {
          label: '操作员账号',
          value: 'email',
          // copy: true,
          noTooltip: true,
          minWidth: 130
        },
        {
          label: '平台账号',
          value: 'account',
          noTooltip: true,
          minWidth: 130
        },
        {
          label: '平台账号名称',
          value: 'name',
          noTooltip: true,
          minWidth: 100
        },

        {
          label: '终端类型',
          width: 70,
          value: 'terminalType',
          render(h, scope) {
            let { terminalType } = scope.row
            return (
              <span>
                {terminalType == 2
                  ? 'PC'
                  : terminalType == 1
                  ? '手机'
                  : terminalType == 3
                  ? '虚拟机'
                  : '-'}
              </span>
            )
          },
          minWidth: 50
        },
        {
          label: '终端编号',
          value: 'terminalCode',
          minWidth: 100
        },
        {
          label: '任务类型',
          value: 'taskTypeName',
          width: 120
        },
        {
          label: '任务ID',
          value: 'taskName',
          width: 100
        },

        {
          label: '状态',
          value: 'targetProductId',
          render(h, scope) {
            let { status } = scope.row
            return (
              <span
                class={
                  status == 0
                    ? 'default'
                    : status == 1
                    ? 'success'
                    : status == 3
                    ? 'warning'
                    : status == 4
                    ? 'danger'
                    : ''
                }
              >
                {status == 0
                  ? '未开始'
                  : status == 1
                  ? '进行中'
                  : status == 2
                  ? '已完成'
                  : status == 3
                  ? '已过期'
                  : status == 4
                  ? '已失败'
                  : ''}
              </span>
            )
          },
          width: 70
        },
        {
          label: '异常',
          value: 'exception',
          noTooltip: true,
          minWidth: 50
        },
        {
          label: '计划开始执行时间',
          value: 'planStartTime',
          width: 140
        },
        {
          label: '计划完成执行时间',
          value: 'planEndTime',
          width: 140
        },
        {
          label: '备注',
          value: 'remark',
          minWidth: 80
        }
      ]
    }
  },
  methods: {
    btnFn(row) {
      let btn = []
      if (row.executeTaskFlag) {
        btn.push(0)
      }
      if (row.status == 1 && row.terminalType == 1) {
        btn.push(1)
      }

      return btn
    },
    showError(scope) {
      // console.log(scope.row.executeTaskFlag === false && scope.row.exception !== null);

      return scope.row.executeTaskFlag === false && scope.row.exception !== null
    },
    // 列表
    searchFunc(data) {
      let { time, ...info } = data
      let [queryStartDate, queryEndDate] = time || []
      let params = { queryStartDate, queryEndDate, ...info }
      return params
    }
  }
}
</script>

<style>
</style>
