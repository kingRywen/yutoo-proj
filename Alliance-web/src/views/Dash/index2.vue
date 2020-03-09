<template>
  <div>
    <main-layout
      :btns="btns"
      :search-fields="searchFields"
      :tree="true"
      :loadData="loadData"
      :defaultShowTree="false"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      :tableCols="tableCols"
      :outer-params="params"
      @treeCurrentChange="handleTreeCurrentChange"
      @clear="handleClear"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm v-if="editFlag" :fields="addFields" ref="add"></SimpleForm>
    </yt-dialog>
    <yt-dialog :options="dialogExpandOptions" :events="dialogExpandEvents">
      <ExpandForm :list="expandCategory" v-if="dialogExpandOptions.visible" ref="expand"></ExpandForm>
    </yt-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ExpandForm from './ExpandForm'
export default {
  components: {
    ExpandForm
  },
  data() {
    let vm = this
    return {
      lastLevelDiss: false,
      editFlag: true,
      expandCategory: [],
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
        close() {
          vm.lastLevelDiss = false
        },
        handleOkClick() {
          let {
              name,
              id1,
              id,
              lastLevel,
              categorySysId,
              platformSiteId
            } = vm.$refs.add.formData,
            api = `main/categorySave`
          // debugger
          if (!id1) {
            id1 = {
              categoryId: 0,
              level: 0
            }
          }
          categorySysId = categorySysId && categorySysId.slice(0).pop()
          platformSiteId = platformSiteId && platformSiteId.slice(0).pop()
          if (vm.edit) {
            api = `main/categoryUpdate`
          }
          let { categoryId: parentId, level } = id1
          let categoryId = vm.edit
          let params = {}
          if (vm.edit) {
            params = {
              name,
              parentId: id.slice(0).pop(),
              categoryId: vm.edit.categoryId,
              categorySysId,
              platformSiteId
              // level: level + 1
            }
          } else {
            params = {
              name,
              parentId,
              level: level + 1,
              platformSiteId,
              categorySysId
            }
          }
          if (lastLevel && lastLevel[0] === 1) {
            params.lastLevel = 1
          } else {
            params.lastLevel = 0
            delete params.categorySysId
          }
          return vm.$refs.add.validate().then(() => {
            return vm.$api[api](params).then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.refreshTree()
              vm.$refs.lay.handleSearch()
            })
          })
        },
        handleOpen() {
          vm.$nextTick(() => {
            vm.$refs.add.setData({
              platformSiteId: vm.$store.state.currentSiteInfo.selectedSite
            })
          })
        }
      },
      dialogExpandOptions: {
        visible: false,
        title: '扩展类目账号',
        width: '600px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogExpandEvents: {
        handleOkClick() {
          let api = `main/categoryExtend`,
            list = vm.$refs.expand.list,
            params = list.map(el => ({
              categoryId: el.categoryId,
              extendType: el.extendType,
              quantity: el.quantity
            }))

          return vm.$refs.expand.validate().then(() => {
            vm.$api[api](params).then(data => {
              //
              vm.$confirm(`${data.msg}`, '扩展成功', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确认',
                showCancelButton: false,
                type: 'success'
              })
                .then(() => {
                  vm.dialogExpandOptions.visible = false
                  vm.$refs.lay.refreshTree()
                  vm.$refs.lay.handleSearch()
                })
                .catch(() => {
                  vm.$refs.lay.refreshTree()
                  vm.$refs.lay.handleSearch()
                })
            })
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
        },
        {
          name: '扩展类目账号',
          type: 'primary',
          plain: true,
          disabled: selection => {
            return selection.length === 0
          },
          fn: () => {
            vm.expandCategory = JSON.parse(
              JSON.stringify(vm.$refs.lay.getCheckedData())
            )
            vm.dialogExpandOptions.visible = true
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
      // addFields: ,
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
                          ? 'el-icon-caret-bottom'
                          : 'el-icon-caret-right'
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
        },
        {
          label: '是否底层类目',
          prop: 'lastLevel',
          render(h, scope) {
            let { lastLevel } = scope.row
            return <span>{lastLevel ? '是' : '否'}</span>
          }
        },
        {
          label: '当前已分配账号数',
          prop: 'alreadyAllocationCount'
        },
        {
          label: '剩余可分配账号数',
          prop: 'allowAllocationCount'
        }
      ]
    }
  },
  created() {
    let vm = this
    GLOBAL.vbus.$on('dash.refresh', () => {
      //
      setTimeout(() => {
        vm.$nextTick(() => {
          vm.$refs.lay.handleSearch()
          vm.$refs.lay.refreshTree()
        })
      })
    })
  },
  computed: {
    ...mapState(['platformList']),
    addFields() {
      let vm = this
      return [
        {
          name: 'name',
          label: '类目名称',
          required: true
        },
        {
          type: 'cascader',
          name: 'id',
          getEl: true,
          label: '上级类目',
          options: this.loadTreeNoLast,
          itemDisabled: data => {
            if (vm.dialogOptions.title == '新增类目') {
              return
            }
            if (!data.cateId) {
              return (
                vm.$refs.lay.selection[0] &&
                vm.$refs.lay.selection[0].categoryId
              )
            }
            return data.cateId
          },
          bind: {
            label: 'name',
            value: 'categoryId',
            children: 'childs',
            enabled: 'enabled'
          }
        },
        {
          type: 'checkbox',
          disabled: data => {
            return vm.lastLevelDiss
          },
          options: [
            {
              label: '最底层目录',
              value: 1
            }
          ],
          label: '',
          name: 'lastLevel'
        },
        {
          type: 'cascader',
          name: 'platformSiteId',
          getEl: true,
          label: '平台站点',
          options: this.platformList,
          hidden: data => {
            return data.lastLevel && data.lastLevel.indexOf(1) > -1
          },
          disabled: true,
          bind: {
            label: 'cnName',
            value: 'platformSiteId',
            children: 'childs',
            enabled: 'enabled'
          }
          // required: true
        },
        {
          type: 'cascader',
          name: 'categorySysId',
          getEl: true,
          label: '系统类目',
          options: this.loadTree2,
          last: true,
          bind: {
            label: 'categoryName',
            value: 'categorySysId',
            children: 'childs',
            enabled: 'enabled'
          },
          required: true,
          hidden: data => {
            return data.lastLevel && data.lastLevel.indexOf(1) > -1
          }
        }
      ]
    }
  },
  methods: {
    loadTree2(id = [0], selEl) {
      if (!selEl) {
        selEl = {
          categorySysId: 0,
          level: 0
        }
      }
      let { categorySysId: categoryId, level, childs } = selEl
      let params = {
        level: level + 1,
        parentCategoryId: categoryId
      }

      return this.$api[`main/categorySysDropdownListHasLastLevel`](params)
        .then(data => {
          if (!data) {
            this.$message.error(data.msg)
            return
          }
          data = data.map(el => {
            return {
              ...el,
              childs: el.hasChild ? [] : null,
              enabled: el.hasChild ? true : !!el.lastLevel,
              isLeaf: !el.hasChild
            }
          })
          return data
        })
        .catch(() => {})
    },

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
            let {
              categoryId,
              name,
              lastLevel,
              categoryMap,
              categorySysMap,
              categorySysId
            } = data.rows
            if (lastLevel) {
              this.lastLevelDiss = true
              lastLevel = [1]
            } else {
              this.lastLevelDiss = false
              lastLevel = []
            }
            let id
            if (categoryMap) {
              id = [...categoryMap[categoryId]]
            } else {
              id = []
            }
            if (categorySysMap) {
              categorySysId = categorySysMap[categorySysId].concat([
                categorySysId
              ])
            } else {
              categorySysId = [categorySysId]
            }
            vm.$refs.add.setData({
              id,
              name,
              lastLevel,
              cateId: categoryId,
              categorySysId
            })
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
      data.queryAccountCountFlag = 1
      return this.$api[`main/categoryList`](data)
        .then(data => {
          return Promise.resolve({ rows: data })
        })
        .catch(err => {})
    },
    handleTreeCurrentChange(data, node) {
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
