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
      <SimpleForm label-width="120px" :fields="addFields" ref="add"/>
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'

export default {
  mixins: [mixin],
  data() {
    let vm = this
    return {
      listApi: 'platformList',
      dialogOptions: {
        visible: false,
        title: '新增平台',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增平台'
              ? `main/platformSave`
              : `main/platformUpdate`
          let data = vm.$refs.add.formData
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增平台') return
          vm.$api[`main/platformInfo`]({ platformCode: vm.editId })
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
            vm.openAdd('新增平台')
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
        },
        {
          name: '删除',
          type: 'danger',
          disabled: selection => {
            if (!selection.length) {
              return true
            }
            return false
          },
          fn() {
            vm.del()
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
        },
        {
          name: '删除',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.del(scope.row)
          }
        }
      ],
      searchFields: [],
      addFields: [
        {
          name: 'platformCode',
          label: '平台编码',
          span: 12,
          disabled: data => {
            return vm.dialogOptions.title === '编辑平台'
          },
          required: true
        },
        {
          name: 'cnName',
          label: '平台中文名称',
          span: 12,
          required: true
        },
        {
          name: 'enName',
          label: '平台英文名称',
          span: 12,
          required: true
        },
        {
          name: 'typeFlag',
          label: '手动/自动任务',
          span: 12,
          type: 'radio',
          options: [
            {
              label: '自动',
              value: 0
            },
            {
              label: '自动+手动',
              value: 1
            }
          ],
          required: true
        }
      ],
      tableCols: [
        {
          label: '平台编码',
          prop: 'platformCode'
        },
        {
          label: '平台中文名称',
          prop: 'cnName'
        },
        {
          label: '平台英文名称',
          prop: 'enName'
        },
        {
          label: '手动/自动任务',
          prop: 'typeFlag',
          render(h, scope) {
            let { typeFlag } = scope.row
            if (typeFlag == 0) {
              return (
                <span size="small" class="success">
                  自动
                </span>
              )
            } else {
              return <span size="small">自动+手动</span>
            }
          }
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
        this.openAdd('编辑平台', row.platformCode)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑平台', data[0].platformCode)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此平台？',
          'platformRemove',
          'platformCode'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除此平台？',
            'platformRemove',
            'platformCode'
          )
        }
      }
    }
  }
}
</script>

<style>
</style>
