<template>
  <div>
    <NewMainLayout
      ref="lay"
      url="main/taskList"
      :edit-btns="edits"
      editWidth="120px"
      :btnFn="btnFn"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      :searchFields="searchFields"
      :right-edit-btns="editBtns"
      :columns="columns"
      :searchFunc="searchFunc"
      :loadNode="_loadNode"
      :leftTree="true"
    ></NewMainLayout>
    <yt-dialog :options="options" :events="events">
      <AssignTask ref="AssignTask" />
    </yt-dialog>
    <yt-dialog :options="importDialogOptions" :events="importDialogEvents" v-loading="importWrapperLoading">
      <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
      <el-upload
        class="custom-upload"
        :before-upload="handleBeforeUpload"
        :action="uploadConfig.url"
        :headers="uploadConfig.headers"
        :data="uploadConfig.data"
        :show-file-list="false"
        :on-success="handleOnSuccess"
        :on-error="handleOnError"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </yt-dialog>
  </div>
</template>

<script>
import AssignTask from './AssignTask'
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
import download from 'Utils/download'

const token = storage.get('local', 'token')
export default {
  components: {
    AssignTask
  },
  data() {
    let vm = this
    return {
      editBtns: [
        {
          name: '新增',
          show: true,
          fn: () => {
            vm.$router.push({ name: 'taskAdd' })
          }
        },

        {
          name: '导入任务',
          show: true,
          fn: () => {
            this.importDialogOptions.visible = true
          }
        },
        {
          name: '分配手动任务',
          show: true,
          fn: () => {
            vm.options.visible = true
          }
        }
      ],
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '删除'
          }
        ]
      },
      uploadConfig: {
        url: CONST_PORT_CONFIG.BASE_URL + 'Task/importData',
        headers: {
          token
        },
        data: {
          token
        }
      },
      importDialogOptions: {
        visible: false,
        title: '导入评价',
        width: '500px'
        // okBtnText: '确定',
        // cancelBtnText: '取消'
      },
      importWrapperLoading: false,
      importDialogEvents: {
        close() {
          vm.notifyVm && vm.notifyVm.close()
        },
        handleOkClick() {}
      },
      events: {
        handleOkClick() {
          return vm.submitAssignTask()
        },
        close() {
          // vm.$refs.
        }
      },
      options: {
        title: '分配手动任务',
        width: '800px',
        visible: false,
        okBtnText: '分配',
        cancelBtnText: '取消'
      },
      edits: [
        {
          name: '查看结果',
          fn: (scope, item) => {
            vm.$router.push({
              name: 'taskResult',
              query: { taskId: scope.row.taskId }
            })
          }
        },
        {
          name: '取消任务',
          fn: (scope, item) => {
            vm.handleCancel([{ taskId: scope.row.taskId }], scope.row.status)
          }
        },
        {
          name: '重新抓取',
          fn: (scope, item) => {
            vm.$api[`main/taskRegrab`]({ taskId: scope.row.taskId })
              .then(data => {
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          }
        },
        {
          name: '删除任务',
          fn: (scope, item) => {
            vm.handleDel(
              [{ taskId: scope.row.taskId }],
              scope.row.status === 1 ? scope.row.taskName : null
            )
          }
        },
        {
          name: '编辑任务',
          fn: scope => {
            vm.$router.push({
              name: 'taskEdit',
              query: { taskId: scope.row.taskId }
            })
          }
        },
        {
          name: '克隆任务',
          fn: scope => {
            vm.$router.push({
              name: 'taskClone',
              query: { taskId: scope.row.taskId, copy: true }
            })
          }
        }
      ],
      searchFields: {
        taskName: {
          label: '任务名称'
        },
        terminalType: {
          label: '终端类型',
          widget: 'select',
          options: this.$const['OTHER/termnalType']
        },
        status: {
          label: '任务状态',
          widget: 'select',
          options: [
            { label: '已暂存', value: '4' },
            { label: '抓取中', value: '5' },
            { label: '抓取失败', value: '6' },
            { label: '未开始', value: '0' },
            { label: '进行中', value: '1' },
            { label: '已完成', value: '2' },
            { label: '已取消', value: '3' }
          ]
        },
        time: {
          label: '任务时间',
          widget: 'daterange'
        }
      },

      addFields: [],
      columns: [
        {
          label: '任务名称',
          value: 'taskName',
          width: 150
        },
        {
          label: '终端类型',
          value: 'terminalType',
          width: 80,
          _enum: this.$const['OTHER/termnalType'].reduce((prev, cur) => {
            prev[cur.value] = cur.label
            return prev
          }, {})
        },
        {
          label: '任务来源',
          value: 'taskSource',
          width: 80,
          _enum: this.$const['OTHER/taskSource'].map(el => el.label)
        },

        {
          label: '目标产品ID',
          width: 100,
          value: 'targetProductId'
        },
        {
          label: '产品名称',
          value: 'productName',
          minWidth: 100
        },
        {
          label: '任务状态',
          width: 75,
          value: 'status',
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
            if (status === 4) {
              return <span class="info">已暂存</span>
            }
            if (status === 5) {
              return <span class="info">抓取中</span>
            }
            if (status === 6) {
              return <span class="info">抓取失败</span>
            }
          }
        },
        {
          label: '任务进度',
          width: 90,
          question: '已完成 / 总数',
          value: 'taskProgress'
        },
        {
          label: '完成情况',
          width: 100,
          question: '成功 / 失败',
          value: 'performance'
        },
        {
          width: 140,
          label: '创建时间',
          value: 'createTime'
        },
        {
          label: '备注',
          value: 'remark',
          minWidth: 50
        }
        // {
        //   label: '临时地址异常',
        //   question: '未校验 / 成功 / 失败',
        //   value: 'addrTemporaryVerifyCase',
        //   render(h, scope) {
        //     return (
        //       <el-popover
        //         placement="left"
        //         title="临时地址"
        //         width="700"
        //         trigger="click"
        //         on-show={() => {
        //           if (scope.row._show) {
        //             return
        //           }
        //           vm.$set(scope.row, '_show', true)
        //         }}
        //       >
        //         {scope.row._show ? (
        //           <main-layout
        //             table-row-key="addrTemporaryId"
        //             side-bar={false}
        //             outer-params={{taskId: scope.row.taskId}}
        //             load-data={vm.loadData1}
        //             selection-flag={false}
        //             edit-width="60px"
        //             ref="lay"
        //             table-cols={vm.tableCols1}
        //           ></main-layout>
        //         ) : null}

        //         <el-button class="danger" type="text" slot="reference">
        //           {scope.row.addrTemporaryVerifyCase}
        //         </el-button>
        //       </el-popover>
        //     )
        //   }
        // }
      ]
    }
  },
  methods: {
    btnFn(row) {
      if (row.taskSource == 1) {
        return []
      }
      let btn = [4]
      if (row.status === 1 || row.status === 2) {
        btn.push(0)
      }
      if (row.status === 0 || row.status === 1) {
        btn.push(1)
      }
      if (row.optionType == 0 && row.status == 6) {
        btn.push(2)
      }
      btn.push(5)

      if (
        row.status === 0 ||
        row.status === 3 ||
        row.status === 4 ||
        row.status === 5 ||
        row.status === 6
      ) {
        btn.push(3)
      }

      return btn
    },
    handleLeftBatchChange(val, sel) {
      val = val[0]
      if (val === '删除') {
        this.handleDel(sel.map(el => ({ categoryId: el.categoryId })))
      }
      if (val === '扩展类目账号') {
        this.expandCategory = this.$refs.lay.getCheckedData()
        this.dialogExpandOptions.visible = true
      }
    },
    handleOnSuccess(res, file, fileList) {
      this.importWrapperLoading = false
      let { msg: message, code } = res
      if (code !== 0) {
        // this.$message.error(message)
        this.notifyVm = this.$notify({
          title: '上传失败',
          dangerouslyUseHTMLString: true,
          message,
          type: 'error',
          customClass: 'customErrorNotify',
          duration: 3000
        })
        return
      }

      this.$notify({
        title: '上传成功',
        dangerouslyUseHTMLString: true,
        message,
        duration: 3000,
        type: 'success'
      })
      this.importDialogOptions.visible = false
      this.$refs.lay.handleSearch()
    },
    handleOnError(err) {
      this.importWrapperLoading = false
      this.$message.error(err.message)
    },
    handleBeforeUpload(file) {
      this.importWrapperLoading = true
      return Promise.resolve()
    },
    downloadTemp() {
      this.$api[`main/taskExportTemplate`]({})
        .then(data => {
          download(data, '任务导入模板.xls')
        })
        .catch(err => {})
    },
    loadData1(data) {
      return this.$api[`main/addrTemporaryList`]({ taskId: data.taskId })
        .then(data => {
          return Promise.resolve({ rows: data })
        })
        .catch(err => {})
    },
    handleClear() {
      this.$refs.lay.getList()
    },
    submitAssignTask() {
      let table = this.$refs.AssignTask.$refs.lay
      if (!table.selection.length) {
        this.$message.warning('请选择要分配的任务')
        return Promise.reject()
      }
      let obj = {
        userIdArray: this.$refs.AssignTask.$refs.form.formData.userIdArray,
        taskIdArray: table.selection.map(el => el.taskId)
      }
      return this.$api[`main/taskAllotAllot`](obj)
        .then(data => {
          // this.options.visible = false
          table.getList()
          return Promise.reject()
        })
        .catch(err => {})
    },
    searchFunc(data) {
      const { time, ...info } = data
      const [startTime, endTime] = time || []
      return {
        ...info,
        startTime,
        endTime
      }
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
          .catch(err => {})
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
              vm.$refs.lay.handleSearch()
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

    handleTreeCurrentChange(data, node) {
      this.$refs.lay.getList({ categoryId: data.categoryId })
    }
  }
}
</script>

<style>
</style>
