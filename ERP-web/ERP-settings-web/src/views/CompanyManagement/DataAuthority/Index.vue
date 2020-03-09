<template>
  <div>
    <main-layout
      rowKey="userId"
      labelWidth="70px"
      :loadData="loadData"
      :tableCols="tableCols"
      ref="main"
      :btns="btns"
      :edits="edits"
      :searchFields="searchFields"
    ></main-layout>
    <!-- 新增用户权限 -->
    <yt-dialog :events="addEvents" :options="addOpts">
      <component ref="com" :is="componentName" :edit-id="editId" :edit-row="editRow"></component>
      <!-- <Add ref="add"></Add> -->
    </yt-dialog>
  </div>
</template>

<script>
import Add from './components/add'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    Add
  },
  data() {
    let vm = this
    return {
      componentName: null,
      editId: null,
      editRow: {},
      tableCols: [
        {
          label: '角色',
          prop: 'roleNams'
        },
        {
          label: '人员名称',
          prop: 'userName'
        },
        {
          label: '所属店铺',
          prop: 'storeNames'
        }
      ],
      btns: [
        {
          name: '添加',
          fn() {
            vm.editId = null
            vm.toggleComponent('Add', '添加数据权限', false)
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
        }
      ],
      edits: [
        {
          show: true,
          name: '编辑',
          fn(scope) {
            vm.editId = scope.row.userId
            vm.toggleComponent('Add', '编辑数据权限', true, scope.row)
          }
        },
        {
          show: true,
          name: '删除',
          fn(scope) {
            vm.handleDel([scope.row.userId])
          }
        }
      ],

      // 新增用户权限选项
      addOpts: {
        visible: false,
        title: '新增用户',
        okBtnText: '保存',
        edit: false,
        width: '600px'
      },
      // 新增事件
      addEvents: {
        handleOpen() {
          vm.$nextTick(() => {
            vm.$refs.com._initData && vm.$refs.com._initData()
          })
        },
        close() {
          vm.$refs.com.clear()
        },
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
  computed: {
    ...mapState('common', ['merchantRoleAllList', 'AllStores', 'userAllList']),
    searchFields() {
      return [
        {
          label: '角色',
          name: 'roleName',
          type: 'select',
          // multi: true,
          canInput: true,
          options: this.merchantRoleAllList,
          maxChangeLen:255,
          bind: {
            value: 'label'
          }
        },
        {
          label: '人员',
          name: 'userName',
          maxChangeLen:255,
          type: 'select',
          // multi: true,
          canInput: true,
          options: this.userAllList,
          bind: {
            value: 'label'
          }
        },
        {
          label: '店铺',
          name: 'storeIds',
          type: 'select',
          multi: true,
          options: this.AllStores
        }
      ]
    }
  },
  created() {
    this.pullAllRoleList()
    this.pullAllStores()
    this.pullUserAllList()
  },
  methods: {
    ...mapActions('common', [
      'pullAllRoleList',
      'pullAllStores',
      'pullUserAllList'
    ]),
    handleDel(userIds) {
      let vm = this
      vm.$confirm('是否删除选中的用户数据权限?', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`perms/permissionStoreDataDelete`]({
            userIds
          })
            .then(() => {
              vm.$refs.main.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    toggleComponent(name, title, edit = false, editRow) {
      let vm = this
      vm.addOpts.title = title
      vm.addOpts.edit = edit
      editRow && (vm.editRow = editRow)
      vm.addOpts.visible = true
      vm.componentName = name
    },
    getId(selection) {
      return selection.map(el => el.userId)
    },
    loadData(params) {
      return this.$api[`perms/permissionStoreDataList`](params).then(data => {
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
