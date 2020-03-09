<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      editWidth="160px"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm label-width="120px" :fields="addFields" ref="add" :defaultData="{showFlag: 0}"/>
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Task',
  mixins: [mixin],
  data() {
    let vm = this
    return {
      listApi: 'taskTypeList',
      dialogOptions: {
        visible: false,
        title: '新增任务类型',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增任务类型'
              ? `main/taskTypeSave`
              : `main/taskTypeUpdate`
          let data = vm.$refs.add.formData
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          if (!vm.platformList.length) {
            vm.getPlatformList()
          }
          if (!vm.taskTypeList.length) {
            vm.getTaskTypeList()
          }
          if (vm.dialogOptions.title === '新增任务类型') return
          vm.$api[`main/taskTypeInfo`]({ taskTypeId: vm.editId })
            .then(data => {
              let { platformCodeArray, ...info } = data.rows
              vm.$refs.add.setData({ ...info, platformCodeArray })
            })
            .catch(err => {})
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增任务类型')
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
          fn() {
            vm.edit()
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
            vm.edit(scope.row)
          }
        }
      ],
      searchFields: [
        {
          label: '任务类型',
          name: 'name'
        }
      ],
      tableCols: [
        {
          label: '任务类型编码',
          prop: 'taskTypeCode'
        },
        {
          label: '任务类型',
          prop: 'name'
        },
        {
          label: '支持平台',
          prop: 'platformCount',
          render(h, scope) {
            let { platformCount, _plat, taskTypeId, _loading } = scope.row
            return (
              <el-popover
                onShow={() => {
                  if (!_plat && !_loading) {
                    vm.$set(scope.row, '_loading', true)
                    vm.$api[`main/taskTypeListPlatform`]({ taskTypeId })
                      .then(data => {
                        scope.row._loading = false
                        vm.$set(scope.row, '_plat', data)
                      })
                      .catch(err => {})
                  }
                }}
                open-delay={200}
                placement="right"
                trigger="hover"
              >
                <div v-loading={!_plat}>
                  {scope.row._plat ? (
                    scope.row._plat.map(el => (
                      <el-tag style="margin-right:6px">{el.enName}</el-tag>
                    ))
                  ) : (
                    <span>无数据</span>
                  )}
                </div>
                <el-button slot="reference" type="text">
                  <b>{platformCount}</b>
                </el-button>
              </el-popover>
            )
          }
        },
        {
          label: '备注',
          prop: 'description'
        }
      ]
    }
  },
  computed: {
    ...mapState(['platformList', 'taskTypeList']),
    addFields() {
      return [
        {
          name: 'taskTypeCode',
          label: '任务类型编码',
          span: 12,
          required: true
        },
        {
          name: 'name',
          label: '任务类型',
          span: 12,
          // type: 'select',
          // options: this.taskTypeList,
          required: true
        },

        {
          name: 'platformCodeArray',
          label: '支持平台',
          type: 'checkbox',
          options: this.platformList,
          span: 24,
          required: true
        },
        {
          name: 'showFlag',
          label: '是否展示',
          span: 12,
          type: 'switch',
          required: true
        },
        {
          name: 'description',
          label: '备注',
          type: 'textarea',
          rows: 5,
          span: 24
          // required: true
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getPlatformList', 'getTaskTypeList']),
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    edit(row) {
      if (row) {
        this.openAdd('编辑任务类型', row.taskTypeId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑任务类型', data[0].taskTypeId)
        }
      }
    }
  }
}
</script>

<style>
</style>
