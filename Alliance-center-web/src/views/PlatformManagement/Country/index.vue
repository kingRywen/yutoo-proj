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
      listApi: 'countryList',
      dialogOptions: {
        visible: false,
        title: '新增国家',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增国家'
              ? `main/countrySave`
              : `main/countryUpdate`
          let data = vm.$refs.add.formData
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增国家') return
          vm.$api[`main/countryInfo`]({ countryCode: vm.editId })
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
            vm.openAdd('新增国家')
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
          name: 'countryCode',
          label: '国家编码',
          span: 12,
          disabled: data => {
            return vm.dialogOptions.title === '编辑国家'
          },
          required: true
        },
        {
          name: 'cnName',
          label: '国家中文名',
          span: 12,
          required: 'cn'
        },
        {
          name: 'enName',
          label: '国家英文名',
          span: 12,
          required: 'en'
        },
        {
          name: 'enNameAcronym',
          label: '国家英文缩写',
          span: 12,
          required: 'en'
        }
      ],
      tableCols: [
        {
          label: '国家编码',
          prop: 'countryCode'
        },
        {
          label: '国家中文名称',
          prop: 'cnName'
        },
        {
          label: '国家英文名称',
          prop: 'enName'
        },
        {
          label: '国家英文缩写',
          prop: 'enNameAcronym'
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
        this.openAdd('编辑国家', row.countryCode)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑国家', data[0].countryCode)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此国家？',
          'countryRemove',
          'countryCode'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除此国家？',
            'countryRemove',
            'countryCode'
          )
        }
      }
    }
  }
}
</script>

<style>
</style>
