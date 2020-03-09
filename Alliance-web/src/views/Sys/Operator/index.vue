<template>
  <div>
    <NewMainLayout
      ref="lay"
      url="main/sysUserList"
      :edit-btns="edits"
      editWidth="120px"
      :btnFn="btnFn"
      :searchFields="searchFields"
      :right-edit-btns="editBtns"
      :columns="columns"
      :searchFunc="searchFunc"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
    ></NewMainLayout>
    <yt-dialog :options="options" :events="events">
      <Add :edit="options.edit" labelWidth="80px" ref="add" />
    </yt-dialog>
  </div>
</template>

<script>
import Add from './Add'
export default {
  components: {
    Add
  },
  data() {
    let vm = this
    return {
      editBtns: [
        {
          perm: 'add',
          name: '新增',
          fn: () => {
            vm.openDialog('新增操作员')
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
      events: {
        handleOkClick() {
          return vm.submit(vm.options.edit ? 'edit' : 'add')
        },
        close() {
          vm.options.edit = false
        }
      },
      options: {
        title: '新增操作员',
        width: '1000px',
        visible: false,
        edit: false,

        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      btns: [
        {
          name: '新增',

          fn: () => {
            vm.openDialog('新增操作员')
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
              vm.openDialog('编辑操作员', data[0].userId)
            }
          }
        },
        {
          name: '删除',
          disabled: selection => {
            return selection.length === 0
          },
          fn: () => {
            console.log('删除')
            let data = vm.checked()
            if (data) {
              // 判断是否包含了已经开始的任务
              let startTask = data.find(el => el.status === 1)

              vm.handleDel(data.map(el => ({ userId: el.userId })))
            }
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.openDialog('编辑操作员', scope.row.userId)
          }
        },
        {
          name: '删除',
          show: scope => {
            return scope.row.isAdmin != 1
          },
          fn: (scope, item) => {
            vm.handleDel([{ userId: scope.row.userId }])
          }
        },
        {
          name: '重置密码',
          show: scope => {
            return scope.row.isAdmin != 1
          },
          fn: (scope, item) => {
            this.$prompt('请输入密码', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /\S+/,
              inputErrorMessage: '密码不能为空'
            })
              .then(({ value }) => {
                vm.$api[`main/sysUserReset`]({
                  userId: scope.row.userId,
                  password: value
                })
                  .then(data => {})
                  .catch(err => {})
              })
              .catch(() => {})
          }
        }
      ],

      searchFields: {
        username: {
          label: '用户名'
        },
        status: {
          label: '用户状态',
          widget: 'select',
          options: [
            { label: '禁用', value: '0' },
            { label: '正常', value: '1' }
          ]
        }
      },
      columns: [
        {
          label: '用户名',
          value: 'username'
        },
        // {
        //   label: '组织机构',
        //   value: 'orgName'
        // },
        {
          label: '邮箱',
          value: 'email'
        },
        {
          label: '手机号码',
          value: 'mobile'
        },
        {
          label: '备注',
          value: 'remark'
        },
        // {
        //   label: '超级管理员',
        //   value: 'isAdmin',
        //   render(h, scope) {
        //     let { isAdmin: status } = scope.row
        //     return <span>{status == 0 ? '否' : status == 1 ? '是' : '-'}</span>
        //   }
        // },
        {
          label: '用户状态',
          value: 'status',
          render(h, scope) {
            let { status } = scope.row
            return (
              <span class={status == 0 ? 'danger' : 'success'}>
                {status == 0 ? '禁用' : status == 1 ? '正常' : '-'}
              </span>
            )
          }
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      val = val[0]
      if (val === '删除') {
        this.handleDel(sel.map(el => ({ userId: el.userId })))
      }
    },
    btnFn(row) {
      let btn = [0]
      if (row.isAdmin != 1) {
        btn.push(1, 2)
      }
      return btn
    },
    openDialog(title, data) {
      this.options.title = title
      this.options.visible = true
      this.options.edit = data
    },
    handleDel(row) {
      let vm = this
      vm.$confirm('是否删除操作员？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/merchantRecipientRemove`]({
            idArray: row.map(el => el.userId)
          })
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
      let [queryStartDate, queryEndDate] = time || []
      let params = { queryStartDate, queryEndDate, ...info }
      return this.$api[`main/sysUserList`](params)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    searchFunc(data) {
      let { time, ...info } = data
      let [queryStartDate, queryEndDate] = time || []
      let params = { queryStartDate, queryEndDate, ...info }
      return params
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    submit(type) {
      let api = type === 'add' ? 'sysUserSave' : 'sysUserUpdate'
      let params = this.$refs.add.$refs.add.formData
      this.$api[`main/${api}`](params)
        .then(data => {
          this.$refs.lay.getList()
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
