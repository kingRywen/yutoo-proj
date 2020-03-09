<template>
  <div>
    <main-layout
      rowKey="id"
      labelWidth="70px"
      :loadData="loadData"
      :tableCols="tableCols"
      ref="main"
      :btns="btns"
      :edits="edits"
      :searchFields="searchFields"
    ></main-layout>
    <!-- 新增角色权限 -->
    <yt-dialog :events="addEvents" :options="addOpts">
      <component v-if="addOpts.visible" ref="com" :is="componentName" :edit-id="editId"></component>
      <!-- <Add ref="add"></Add> -->
    </yt-dialog>
  </div>
</template>

<script>
import Add from './components/add'
import Log from './components/log'
export default {
  components: {
    Add,
    Log
  },
  data() {
    let vm = this
    return {
      componentName: null,
      editId: null,
      tableCols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '角色名称',
          prop: 'name'
        },
        {
          label: '角色标识',
          prop: 'sign'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '是否激活',
          prop: 'activateFlag',
          render(h, scope) {
            return (
              <i
                style={{ fontSize: '20px' }}
                class={
                  scope.row.activateFlag
                    ? `el-icon-check success`
                    : `el-icon-close danger`
                }
              />
            )
          }
        }
      ],
      btns: [
        {
          name: '添加',
          fn() {
            vm.editId = null
            vm.toggleComponent('Add', '添加角色', false)
          }
        },
        {
          name: '修改',
          disabled(selection) {
            return selection.length !== 1
          },
          fn(selection) {
            vm.editId = selection[0].id
            vm.toggleComponent('Add', '编辑角色', true)
          }
        },
        {
          name: '删除',
          disabled(selection) {
            return selection.length === 0
          },
          fn(selection) {
            vm.handleDel(vm.getId(selection))
          }
        },
        // {
        //   name: '批量授权',
        //   fn() {}
        // },
        // {
        //   name: '批量取消授权',
        //   fn() {}
        // },
        {
          name: '查看操作日志',
          disabled(selection) {
            return selection.length !== 1
          },
          fn() {
            vm.toggleComponent('Log', '查看操作日志')
            // vm.$api[`perms/roleLog`]({ roleId: selection[0].id })
            //   .then(data => {
            //     console.log(data)
            //   })
            //   .catch(err => {})
          }
        }
      ],
      edits: [
        {
          show: true,
          name: '编辑',
          fn(scope) {
            vm.editId = scope.row.id
            vm.toggleComponent('Add', '编辑角色', true)
          }
        },
        {
          show: true,
          name: '删除',
          fn(scope) {
            vm.handleDel([scope.row.id].join(','))
          }
        }
      ],
      searchFields: [
        {
          label: '角色名称',
          name: 'name'
        },
        {
          label: '是否激活',
          name: 'activateFlag',
          type: 'select',
          options: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        }
      ],

      // 新增用户权限选项
      addOpts: {
        visible: false,
        title: '新增角色',
        okBtnText: '保存',
        edit: false,
        width: '60%'
      },
      // 新增用户权限事件
      addEvents: {
        handleOkClick() {
          return vm.$refs.com.save(0).then(() => {
            vm.$refs.main.getList()
            return Promise.resolve()
          })
        },
        handleEditOkClick() {
          return vm.$refs.com.save(1).then(() => {
            vm.$refs.main.getList()
            return Promise.resolve()
          })
        }
      }
    }
  },
  methods: {
    handleDel(roleIds) {
      let vm = this
      vm.$confirm('是否删除选中的角色?', '警告', {
        type: 'danger'
      })
        .then(() => {
          vm.$api[`perms/roleRemoveConfirm`]({
            roleIds
          })
            .then(() => {
              vm.$refs.main.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    toggleComponent(name, title, edit = false) {
      let vm = this
      if (name === 'Log') {
        vm.addOpts.okBtnText = null
      }
      vm.addOpts.title = title
      vm.addOpts.edit = edit
      vm.addOpts.visible = true
      vm.componentName = name
    },
    getId(selection) {
      return selection.map(el => el.id).join(',')
    },
    loadData(params) {
      return this.$api[`perms/roleList`](params).then(data => {
        return Promise.resolve(data.page)
      })
    },
    handleSuccess() {
      this.$refs.main.getList()
    }
  }
}
</script>

<style>
</style>
