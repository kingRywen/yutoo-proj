<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      editWidth="120px"
      ref="lay"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="options" :events="events">
      <component :is="comName" v-if="!options.type" :edit="options.edit" labelWidth="80px" ref="add" />
    </yt-dialog>
  </div>
</template>

<script>
import Add from './Add'
import PermSetting from './PermSetting'
export default {
  components: {
    Add,
    PermSetting
  },
  data() {
    let vm = this
    return {
      events: {
        handleOkClick() {
          return vm.submit(vm.options.edit ? 'edit' : 'add', vm.options.type)
        },
        close() {
          vm.options.edit = false
        }
      },
      comName: 'Add',
      options: {
        title: '新增角色',
        width: '800px',
        visible: false,
        edit: false,
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      btns: [
        {
          name: '新增',
          fn: () => {
            vm.openDialog('新增角色')
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
              vm.openDialog('编辑角色', data[0].roleId)
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

              vm.handleDel(data.map(el => ({ roleId: el.roleId })))
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
            vm.openDialog('编辑角色', scope.row.roleId)
          }
        },
        {
          name: '权限设置',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.openDialog('权限设置', scope.row.roleId, 'PermSetting')
          }
        },
        {
          name: '删除',
          show: scope => {
            return scope.row.isAdmin != 1
          },
          fn: (scope, item) => {
            vm.handleDel([{ roleId: scope.row.roleId }])
          }
        }
      ],
      searchFields: [
        {
          name: 'roleName',
          label: '角色名称'
        }
        // {
        //   name: 'isAdmin',
        //   label: '超级管理员',
        //   type: 'select',
        //   options: [
        //     { label: '是', value: '1' },
        //     { label: '否', value: '0' }
        //   ]
        // },
        // {
        //   name: 'status',
        //   label: '用户状态',
        //   type: 'select',
        //   options: [
        //     { label: '禁用', value: '0' },
        //     { label: '正常', value: '1' }
        //   ]
        // }
      ],
      tableCols: [
        {
          label: '角色名称',
          prop: 'roleName'
        },
        // {
        //   label: '组织机构',
        //   prop: 'orgName'
        // },
        {
          label: '角色标识',
          prop: 'roleSign'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  methods: {
    openDialog(title, data, type = 'Add') {
      this.comName = type
      this.options.title = title
      this.options.visible = true
      this.options.edit = data
    },
    handleDel(row) {
      let vm = this
      vm.$confirm('是否删除角色？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/sysRoleRemove`](row.map(el => el.roleId))
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
      return this.$api[`main/sysRoleList`](params)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    submit(type) {
      let api = type === 'add' ? 'sysRoleSave' : 'sysRoleUpdate'
      let params
      if (this.comName === "PermSetting") {
        api = 'sysRoleAuthorizeOpt'
        params = {
          roleId: this.options.edit,
          menuIdList: this.$refs.add.$refs.tree.getCheckedKeys()
        }
      } else {
        params = this.$refs.add.$refs.add.formData
      }
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
