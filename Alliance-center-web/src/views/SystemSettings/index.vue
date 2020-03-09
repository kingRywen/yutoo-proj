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
      <SimpleForm :defaultData="defaultData" label-width="120px" :fields="addFields" ref="add" />
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'

export default {
  mixins: [mixin],
  name: 'SystemSettings',
  data() {
    let vm = this
    return {
      defaultData: {
        activateFlag: 1,
        id: new Array(1)
      },
      listApi: 'systemSettingList',
      dialogOptions: {
        visible: false,
        title: '新增系统设置',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增系统设置'
              ? `main/systemSettingSave`
              : `main/systemSettingUpdate`
          let data = vm.$refs.add.formData
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增系统设置') return
          vm.$api[`main/systemSettingInfo`]({ systemSettingId: vm.editId })
            .then(data => {
              vm.$refs.add.setData(data.rows)
            })
            .catch(err => {})
        }
      },
      btns: [],
      edits: [
        {
          name: '编辑',
          show: scope => {
            return scope.row.editFlag
          },
          fn: (scope, item) => {
            vm.edit(scope.row)
          }
        }
      ],
      searchFields: [
        {
          label: '设置编码',
          name: 'settingCode'
        }
      ],
      tableCols: [
        {
          label: '设置编码',
          prop: 'settingCode'
        },
        {
          label: '设置值',
          prop: 'settingValue'
        },
        {
          label: '单位',
          prop: 'unit'
        },
        {
          label: '备注',
          prop: 'remark',
          minWidth: 500
        },
        {
          label: '是否可编辑',
          prop: 'editFlag',
          render(h, scope) {
            return (
              <i
                class={
                  scope.row.editFlag
                    ? 'el-icon-check success'
                    : 'el-icon-close danger'
                }
                style={{ fontSize: '22px' }}
              />
            )
          }
        }
      ]
    }
  },

  computed: {
    addFields() {
      return [
        {
          name: 'settingCode',
          label: '设置编码',
          span: 12,
          required: true
        },
        {
          name: 'settingValue',
          label: '设置值',
          span: 12,
          required: true
        },
        {
          name: 'unit',
          label: '单位',
          span: 12,
          required: true
        },
        {
          name: 'remark',
          label: '备注',
          span: 24,

          type: 'textarea',
          rows: 5,
          required: true
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
        this.openAdd('编辑系统设置', row.systemSettingId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑系统设置', data[0].systemSettingId)
        }
      }
    }
  }
}
</script>

<style>
</style>
