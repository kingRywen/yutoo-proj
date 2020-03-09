<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      btns: [
        {
          name: '新增',
          fn: () => {
            vm.$router.push({ name: 'taskAdd' })
          }
        },
        {
          name: '编辑',
          disabled: selection => {
            if (selection.length !== 1) {
              return true
            }
            return false
          },
          fn: () => {
            let data = vm.checked()
            if (data) {
              vm.$router.push({
                name: 'taskEdit',
                query: { taskId: data[0].taskId }
              })
            }
          }
        },
        {
          name: '删除',
          fn: () => {
            console.log('删除')
            let data = vm.checked()
            if (data) {
              vm.handleDel(data.map(el => ({ taskId: el.taskId })))
            }
          }
        }
      ],
      edits: [
        {
          name: '查看结果',
          show: scope => {
            return scope.row.status === 1 || scope.row.status === 2
          },
          fn: (scope, item) => {
            vm.$router.push({
              name: 'taskResult',
              query: { taskId: scope.row.taskId }
            })
          }
        },
        {
          name: '取消任务',
          show: scope => {
            return scope.row.status === 0
          },
          fn: (scope, item) => {
            vm.handleCancel([{ taskId: scope.row.taskId }])
          }
        },
        {
          name: '删除任务',
          show: scope => {
            return scope.row.status === 0 || scope.row.status === 3
          },
          fn: (scope, item) => {
            vm.handleDel([{ taskId: scope.row.taskId }])
          }
        }
      ],
      searchFields: [
        {
          name: 'taskName',
          label: '任务名称'
        },
        {
          name: 'status',
          label: '任务状态',
          type: 'select',
          options: [
            { label: '未开始', value: '0' },
            { label: '进行中', value: '1' },
            { label: '已完成', value: '2' },
            { label: '已取消', value: '3' }
          ]
        },
        {
          name: 'time',
          label: '任务时间',
          type: 'dateRange'
        }
      ],
      addFields: [],
      tableCols: [
        {
          label: '任务名称',
          prop: 'taskName'
        },
        {
          label: '目标产品ID',
          prop: 'targetProductId'
        },
        {
          label: '产品名称',
          prop: 'productName'
        },
        {
          label: '任务状态',
          prop: 'status',
          render(h, scope) {
            let { status } = scope.row
            // ：0-未开始；1-进行中；2-已完成；3-已取消；
            if (status === 0) {
              return <span>未开始</span>
            }
            if (status === 1) {
              return <span class="warning">进行中</span>
            }
            if (status === 2) {
              return <span class="success">已完成</span>
            }
            if (status === 3) {
              return <span class="danger">已取消</span>
            }
          }
        },
        {
          label: '任务进度（已完成/总数）',
          prop: 'taskProgress'
        },
        {
          label: '完成情况（成功/失败）',
          prop: 'performance'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  methods: {
    handleEdit(orderId) {
      let vm = this
      vm.dialogOptions.visible = true
      vm.$nextTick(() => {
        this.$api[`main/taskInfo`]({ orderId })
          .then(data => {
            let { orderId, name } = data.rows
            vm.$refs.payMoney.setData({ id: [orderId], id1: data.rows, name })
          })
          .catch(err => {})
      })
    },
    handleDel(row) {
      let vm = this
      vm.$confirm('是否删除任务？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/taskRemove`](row)
            .then(data => {
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        })
        .catch(() => {})
    },
    handleCancel(row) {
      let vm = this
      vm.$confirm('是否取消任务？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/taskCancel`](row)
            .then(data => {
              vm.$refs.lay.handleSearch()
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
    loadData(data) {
      let { time = [], ...info } = data
      let [queryStartDate, queryEndDate] = time
      let params = { queryStartDate, queryEndDate, ...info }
      return this.$api[`main/taskList`](params)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    }
  }
}
</script>

<style>
</style>
