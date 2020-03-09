<template>
  <div>
    <NewMainLayout
      ref="lay"
      url="main/taskAllotList"
      :edit-btns="edits"
      :searchFunc="searchFunc"
      editWidth="110px"
      :showError="showError"
      :searchFields="searchFields"
      :btnFn="btnFn"
      :columns="columns"
    >
      <template slot="errorMsg" slot-scope="scope">
        <span class="danger">{{scope.row.exception == 0 ? '不能登录' : scope.row.exception == 1 ? '不能评价' : '' }}</span>
      </template>
    </NewMainLayout>
    <yt-dialog :options="options" :events="events">
      <AssignTask />
    </yt-dialog>
    <yt-dialog :options="infoOptions" :events="infoEvents">
      <TaskInfo @success="handleSuccess" :data="taskInfo" />
    </yt-dialog>
  </div>
</template>

<script>
import AssignTask from './AssignTask'
import secret from './secret'
import TaskInfo from './TaskInfo'
const Decrypt = secret.Decrypt
export default {
  components: {
    AssignTask,
    TaskInfo
  },
  data() {
    let vm = this
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
      edits: [
        {
          name: '执行任务',
          fn: scope => {
            this.$confirm('是否确认执行此任务？', '注意', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                vm.$api[`main/taskAllotExecuteTask`]({
                  taskAllotId: scope.row.taskAllotId
                })
                  .then(() => {
                    vm.$refs.lay.getList()
                  })
                  .catch(() => {})
              })
              .catch(() => {})
          }
        },
        {
          name: '查看任务',
          fn: scope => {
            vm.taskInfo = null
            vm.$api[`main/extensionTaskInfo`]({
              taskAllotId: scope.row.taskAllotId
            })
              .then(data => {
                try {
                  vm.taskInfo = data.rows
                  vm.infoOptions.visible = true
                } catch (error) {
                  console.info(error)
                }
              })
              .catch(() => {})
          }
        }
      ],
      searchFields: {
        account: {
          label: '账号'
        },
        status: {
          label: '任务状态',
          widget: 'select',
          options: [
            { label: '未开始', value: '0' },
            { label: '进行中', value: '1' },
            { label: '已过期', value: '3' }
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
        },
        taskTypeName: {
          label: '任务类型',
          widget: 'select',
          options: () =>
            this.$api[`main/taskAllotTaskTypeList`]({}).then(data =>
              data.rows.map(el => ({ label: el.name, value: el.taskTypeId }))
            )
        },
        taskName: {
          label: '任务ID'
        }
      },
      addFields: [],
      columns: [
        {
          label: '平台账号',
          value: 'account',
          copy: true,
          minWidth: 130
        },
        {
          label: '平台账号名称',
          value: 'name',
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
                    ? 'warning'
                    : status == 3
                    ? 'danger'
                    : ''
                }
              >
                {status == 0
                  ? '未开始'
                  : status == 1
                  ? '进行中'
                  : status == 3
                  ? '已过期'
                  : ''}
              </span>
            )
          },
          width: 70
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
        }
        // {
        //   label: '备注',
        //   value: 'remark',
        //   minWidth: 80
        // }
      ]
    }
  },
  created() {
    this.getCount()
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
    getCount() {
      this.$api[`main/taskAllotExecuteTaskCase`]({})
        .then(data => {
          this.$store.commit('setTaskAllotCount', data)
        })
        .catch(err => {})
    },
    handleSuccess(type) {
      this.infoOptions.visible = false
      this.$refs.lay.getList()
    },
    handleEdit(orderId) {
      let vm = this
      vm.dialogOptions.visible = true
      vm.$nextTick(() => {
        this.$api[`main/taskInfo`]({ orderId })
          .then(data => {
            let { orderId, name } = data.rows
            vm.$refs.payMoney.setData({ id: [orderId], id1: data.rows, name })
          })
          .catch(() => {})
      })
    },
    handleDel(row, name) {
      let vm = this
      if (name) {
        this.$message.warning('任务已经下发执行，不可删除')
        return
      }
      vm.$confirm(
        name
          ? `任务已经开始执行，不可删除`
          : '任务未开始，可以直接删除，请确认',
        '警告',
        {
          type: 'warning'
        }
      )
        .then(() => {
          vm.$api[`main/taskRemove`](row)
            .then(data => {
              vm.$refs.lay.getList()
            })
            .catch(err => {})
        })
        .catch(() => {})
    },
    handleCancel(row, status) {
      let vm = this
      vm.$confirm(
        status === 4
          ? `任务还没开始，可以直接取消，请确认`
          : `任务已经下发执行，系统将尽可能拦截未执行的任务`,
        '警告',
        {
          type: 'warning'
        }
      )
        .then(() => {
          vm.$api[`main/taskCancel`](row)
            .then(data => {
              vm.$refs.lay.getList()
            })
            .catch(err => {})
        })
        .catch(() => {})
    },
    checked(more = true) {
      let data = this.$refs.lay.getCheckedData()
      if (more && !data.length) {
        this.$message.warning('请选择数据进行操作')
        return
      }
      if (!more && data.length !== 1) {
        this.$message.warning('请选择一条数据进行操作')
        return
      }
      return this.$refs.lay.getCheckedData()
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
