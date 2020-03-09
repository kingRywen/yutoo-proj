<template>
  <div>
    <main-layout
      :btns="btns"
      :search-fields="searchFields"
      :tree="true"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      :tableCols="tableCols"
      :outer-params="params"
      @treeCurrentChange="handleTreeCurrentChange"
      @clear="handleClear"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm :fields="addFields" ref="add"></SimpleForm>
    </yt-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      edit: null,
      params: {
        level: 1,
        parentId: 0
      },
      dialogOptions: {
        visible: false,
        title: '新增类目',
        width: '400px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let { name, id1 } = vm.$refs.add.formData,
            api = `main/categorySave`
          if (!id1) {
            id1 = {
              categoryId: 0,
              level: 0
            }
          }
          if (vm.edit) {
            api = `main/categoryUpdate`
          }
          let { categoryId: parentId, level } = id1
          let categoryId = vm.edit
          let params = {}
          if (vm.edit) {
            params = {
              name,
              parentId: vm.edit.parentId,
              categoryId: vm.edit.categoryId,
              level: vm.edit.level
            }
          } else {
            params = {
              name,
              parentId,
              level: level + 1
            }
          }
          return vm.$api[api](params).then(data => {
            vm.dialogOptions.visible = false
            vm.$refs.lay.refreshTree()
            vm.$refs.lay.handleSearch()
          })
        }
      },
      btns: [
        {
          name: '新增',
          fn: () => {
            vm.setDisabled()
            vm.dialogOptions.title = '新增类目'
            vm.edit = null
            this.dialogOptions.visible = true
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
            let { categoryId } = data[0]
            vm.edit = data[0]
            // vm.setDisabled(true)
            vm.handleEdit(categoryId)
          }
        },
        {
          name: '删除',
          fn: () => {
            let data = vm.checked()
            if (data) {
              vm.handleDel(data.map(el => ({ categoryId: el.categoryId })))
            }
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          show: true,
          fn: (scope, item) => {
            vm.edit = scope.row
            // vm.setDisabled(true)
            vm.handleEdit(scope.row.categoryId)
          }
        },
        {
          name: '删除',
          show: true,
          fn: (scope, item) => {
            //
            vm.handleDel([{ categoryId: scope.row.categoryId }])
          }
        }
      ],
      searchFields: [
        {
          name: 'name',
          label: '类目名称'
        }
      ],
      addFields: [
        {
          name: 'name',
          label: '类目名称',
          required: true
        },
        {
          type: 'cascader',
          name: 'id',
          getEl: true,
          label: '类目',
          options: this.loadTree,
          itemDisabled: data => {
            return data.cateId
          },
          bind: {
            label: 'name',
            value: 'categoryId',
            children: 'childs',
            enabled: 'enabled'
          }
        }
      ],
      tableCols: [
        {
          label: '类目',
          prop: 'name',
          render(h, scope) {
            let {
              name,
              hasChild,
              expand,
              loading,
              _num,
              level,
              categoryId
            } = scope.row
            let { $index: index } = scope
            return (
              <div
                class="customCate"
                style={{ paddingLeft: (level - 1) * 20 + 'px' }}
              >
                <div class="btn">
                  {hasChild ? (
                    <el-button
                      disabled={loading}
                      icon={
                        loading
                          ? 'el-icon-loading'
                          : expand
                          ? 'el-icon-minus'
                          : 'el-icon-plus'
                      }
                      onClick={() => {
                        vm.$set(scope.row, 'expand', !expand)
                        if (!expand) {
                          vm.$set(scope.row, 'loading', true)
                          vm.loadData({
                            level: level + 1,
                            parentId: categoryId
                          })
                            .then(data => {
                              vm.$set(scope.row, 'loading', false)
                              vm.$set(scope.row, '_num', data.rows.length)
                              vm.$refs.lay.tableData.splice(
                                index + 1,
                                0,
                                ...data.rows
                              )
                            })
                            .catch(() => {
                              vm.$set(scope.row, 'loading', false)
                            })
                        } else {
                          let allNum = 0
                          let array = vm.$refs.lay.tableData
                          for (let i = index + 1; i < array.length; i++) {
                            const element = array[i]
                            if (element.level > level) {
                              allNum++
                              // vm.$refs.lay.tableData.splice(i, 1)
                            }
                            if (element.level === level) {
                              break
                            }
                          }
                          vm.$refs.lay.tableData.splice(index + 1, allNum)
                        }
                        vm.$nextTick(() => {
                          vm.$refs.lay.fixedTableHeight()
                        })
                      }}
                      type="text"
                    />
                  ) : null}
                </div>
                <div class="text">{name}</div>
              </div>
            )
          }
        },
        {
          label: '上级类目',
          prop: 'parentName'
        },
        {
          label: '层级',
          prop: 'level'
        }
      ]
    }
  },
  created() {
    let vm = this
    GLOBAL.vbus.$on('dash.refresh', () => {
      console.log('object')
      vm.$nextTick(() => {
        vm.$refs.lay.handleSearch()
        vm.$refs.lay.refreshTree()
      })
    })
  },
  methods: {
    setDisabled(disabled = false) {
      let el = this.addFields[1]
      el.disabled = disabled
      this.addFields.splice(1, 1, el)
    },
    handleEdit(categoryId) {
      let vm = this
      vm.dialogOptions.title = '编辑类目'
      vm.dialogOptions.visible = true
      // vm.edit = categoryId
      vm.$nextTick(() => {
        this.$api[`main/categoryInfo`]({ categoryId })
          .then(data => {
            let { categoryId, name, categoryMap } = data.rows
            let id
            if (categoryMap) {
              id = [...categoryMap[categoryId]]
            } else {
              id = []
            }
            console.log({ id, id1: data.rows, name })
            vm.$refs.add.setData({ id, name, cateId:categoryId })
          })
          .catch(err => {})
      })
    },
    handleDel(row) {
      let vm = this
      vm.$confirm('是否删除选中的类目？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/categoryRemove`](row)
            .then(data => {
              vm.$refs.lay.handleSearch()
              vm.$refs.lay.refreshTree()
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
    loadData(data) {
      return this.$api[`main/categoryList`](data)
        .then(data => {
          return Promise.resolve({ rows: data })
        })
        .catch(err => {})
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
      this.params = {
        parentId: data.categoryId + '',
        level: data.level + 1
      }
      this.$nextTick(() => this.$refs.lay.getList())
    },

    handleClear() {
      this.params = {
        parentId: 0,
        level: 1
      }
      this.$nextTick(() => this.$refs.lay.getList())
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
