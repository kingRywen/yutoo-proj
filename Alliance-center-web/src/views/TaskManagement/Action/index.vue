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
      <Add ref="add" :title="dialogOptions.title"/>
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapActions, mapState } from 'vuex'
import Add from './components/add'

export default {
  name: 'Action',
  mixins: [mixin],
  components: { Add },
  data() {
    let vm = this
    return {
      listApi: 'actionList',
      dialogOptions: {
        visible: false,
        title: '新增动作定义',
        width: '1000px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增动作定义'
              ? `main/actionSave`
              : `main/actionUpdate`
          let data = vm.$refs.add.formData
          return vm.$refs.add.validate().then(() => {
            return vm.$api[api](data)
              .then(data => {
                vm.dialogOptions.visible = false
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          })
        },
        close() {
          vm.$refs.add.close()
        },
        handleOpen() {
          vm.$nextTick(() => {
            vm.$refs.add.clearValidate()
          })

          if (vm.dialogOptions.title === '新增动作定义') return
          vm.$api[`main/actionInfo`]({ actionId: vm.editId })
            .then(data => {
              vm.$refs.add.setData(data.rows)
            })
            .catch(err => {})
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增动作定义')
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
          label: '动作名称',
          name: 'actionName'
        }
      ],
      tableCols: [
        {
          label: '动作编号',
          prop: 'actionId'
        },
        {
          label: '动作名称',
          prop: 'actionName'
        },
        {
          label: '处理类',
          prop: 'actionHandleClass'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },

  methods: {
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    edit(row) {
      if (row) {
        this.openAdd('编辑动作定义', row.actionId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑动作定义', data[0].actionId)
        }
      }
    }
  }
}
</script>

<style>
</style>
