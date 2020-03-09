<template>
  <div>
    <main-layout
      rowKey="merchantDepartmentId"
      labelWidth="70px"
      :loadData="loadData"
      :tableCols="tableCols"
      ref="main"
      :btns="btns"
      :edits="edits"
      :searchFields="searchFields"
      :row-style="showRow"
    ></main-layout>
    <!-- 新增部门权限 -->
    <yt-dialog :events="addEvents" :options="addOpts">
      <component ref="com" :is="componentName" :edit-id="editId"></component>
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
          prop: 'merchantDepartmentId'
        },
        {
          label: '部门名称',
          prop: 'name',
          render(h, scope) {
            let { childs, name, _expanded, _level } = scope.row
            let index = scope.$index
            console.log(childs)
            return (
              <span
                onClick={() => {
                  const record = vm.$refs.main.tableData[index]
                  record._expanded = !record._expanded
                }}
              >
                {childs ? (
                  !_expanded ? (
                    <el-button type="text" icon="el-icon-plus" />
                  ) : (
                    <el-button type="text" icon="el-icon-minus" />
                  )
                ) : (
                  <span
                    style={{ width: '20px', marginLeft: _level * 15 + 'px' }}
                  >
                    &nbsp;
                  </span>
                )}
                &nbsp;{name}
              </span>
            )
          }
        },
        {
          label: '描述',
          prop: 'description'
        },
        // {
        //   label: '部门负责人',
        //   prop: ''
        // },
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
            vm.toggleComponent('Add', '添加部门', false)
          }
        },
        {
          name: '修改',
          disabled(selection) {
            return selection.length !== 1
          },
          fn(selection) {
            vm.editId = selection[0].merchantDepartmentId
            vm.toggleComponent('Add', '编辑部门', true)
          }
        },
        {
          name: '删除',
          disabled(selection) {
            return selection.length === 0
          },
          fn(selection) {
            vm.$confirm('是否删除选中的部门?', '警告', {
              type: 'danger'
            })
              .then(() => {
                vm.$api[`perms/departmentRemove`]({
                  merchantDepartmentIds: vm.getId(selection)
                })
                  .then(() => {
                    vm.$refs.main.clearSelection()
                    vm.$refs.main.getList()
                  })
                  .catch(() => {})
              })
              .catch(() => {})
          }
        }
      ],
      edits: [],
      searchFields: [
        {
          label: '部门名称',
          name: 'name'
        }
      ],

      // 新增用户权限选项
      addOpts: {
        visible: false,
        title: '新增部门',
        okBtnText: '保存',
        edit: false,
        width: '60%'
      },
      // 新增用户权限事件
      addEvents: {
        handleOpen() {
          vm.$nextTick(() => {
            vm.$refs.com.initData()
          })
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
  methods: {
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    toggleComponent(name, title, edit = false) {
      let vm = this
      vm.addOpts.title = title
      vm.addOpts.edit = edit
      vm.addOpts.visible = true
      vm.componentName = name
    },
    getId(selection) {
      return selection.map(el => el.merchantDepartmentId).join(',')
    },
    treeToArray(data, expandAll, parent = null, level = null) {
      // debugger
      let vm = this
      let tmp = []
      Array.from(data).forEach(function(record) {
        if (record._expanded === undefined) {
          vm.$set(record, '_expanded', expandAll)
        }
        let _level = 1
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        vm.$set(record, '_level', _level)
        // 如果有父元素
        if (parent) {
          vm.$set(record, 'parent', parent)
        }
        tmp.push(record)
        if (record.childs && record.childs.length > 0) {
          const children = vm.treeToArray(
            record.childs,
            expandAll,
            record,
            _level
          )
          tmp = tmp.concat(children)
        }
      })
      return tmp
    },
    loadData(params) {
      return this.$api[`perms/departmentList`](params).then(data => {
        let rows = this.treeToArray(data.rows)
        return Promise.resolve({
          rows: rows
        })
      })
    },
    handleSuccess() {
      this.$refs.main.getList()
    }
  }
}
</script>

<style lang='scss'>
.customCate {
  display: flex;
  .btn {
    width: 16px;
  }
  .text {
    display: flex;
    align-items: center;
  }
}
</style>
