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
      <SimpleForm :defaultData="defaultData" label-width="120px" :fields="addFields" ref="add"/>
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapActions, mapState } from 'vuex'

export default {
  mixins: [mixin],
  data() {
    let vm = this
    return {
      defaultData: {
        activateFlag: 1,
        id: new Array(1)
      },
      listApi: 'processList',
      dialogOptions: {
        visible: false,
        title: '新增流程定义',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增流程定义'
              ? `main/processSave`
              : `main/processUpdate`
          let {id, ...info} = vm.$refs.add.formData
          let processActionArray = id.map(el => ({actionId: el}))
          return vm.$api[api]({...info, processActionArray})
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增流程定义') return
          vm.$api[`main/processInfo`]({ processId: vm.editId })
            .then(data => {
              // 处理动作参数
              let {processActionArray, ...info} = data.rows
              let id = processActionArray.map(el => el.actionId)
              
              vm.$refs.add.setData({...info, id})
            })
            .catch(err => {})
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增流程定义')
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
          label: '流程名称',
          name: 'processName'
        }
      ],
      tableCols: [
        {
          label: '流程编号',
          prop: 'processId'
        },
        {
          label: '流程名称',
          prop: 'processName'
        },
        {
          label: '任务类型',
          prop: 'taskTypeId',
          render(h, scope) {
            let {taskTypeId} = scope.row
            let str = '-'
            let el = vm.taskTypeList.find(el => el.value === taskTypeId)
            if (el) {
              str = el.label
            }
            return <span>{str}</span>
          }
        },
        {
          label: '激活状态',
          prop: 'activateFlag',
          render(h, scope) {
            return <span>{scope.row.activateFlag ? '是' : '否'}</span>
          }
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ]
    }
  },
  created() {
    this.getTaskTypeList()
    this.getActionList()
  },
  computed: {
    ...mapState(['taskTypeList', 'actionList']),
    addFields() {
      return [
        {
          name: 'processId',
          label: '流程编号',
          span: 12,
          requiredText: '必须是整数且不能为空',
          type: 'number',
          min:1,
          precision: 0,
          max: 999999999,
          controls: false,
          // hidden: data => {
          //   return !data.processId
          // },
          disabled: data => {
            return this.dialogOptions.title !== '新增流程定义'
          },
          required: true
        },
        {
          name: 'processName',
          label: '流程名称',
          span: 12,
          required: true
        },
        {
          name: 'taskTypeId',
          label: '任务类型',
          span: 12,
          type: 'select',
          options: this.taskTypeList,
          required: true
        },
        {
          name: 'activateFlag',
          label: '激活',
          span: 12,
          type: 'switch',
          default: 1,
          required: true
        },
        {
          name: 'remark',
          label: '备注',
          span: 24,
          type: 'textarea',
          rows: 5,
          // required: true
        },
        {
          title: '动作列表'
        },
        {
          name: 'id',
          type: 'select',
          options: this.actionList,
          add: '1-',
          label: '动作名称',
          span: 12,
          required: true
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getTaskTypeList', 'getActionList']),
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    edit(row) {
      if (row) {
        this.openAdd('编辑流程定义', row.processId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑流程定义', data[0].processId)
        }
      }
    }
  }
}
</script>

<style>
</style>
