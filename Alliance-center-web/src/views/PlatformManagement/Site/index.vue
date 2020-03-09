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
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [mixin],
  data() {
    let vm = this
    return {
      listApi: 'platformSiteList',
      dialogOptions: {
        visible: false,
        title: '新增平台站点',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增平台站点'
              ? `main/platformSiteSave`
              : `main/platformSiteUpdate`
          let data = vm.$refs.add.formData
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增平台站点') return
          vm.$api[`main/platformSiteInfo`]({ platformSiteId: vm.editId })
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
            vm.openAdd('新增平台站点')
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
      tableCols: [
        {
          label: '平台名称',
          prop: 'platformCode',
          render(h, scope) {
            let {platformCode} = scope.row, str = '-'
            let el = vm.platformList.find(el => el.value === platformCode)
            if (el) {
              str = el.label
            }
            return <span>{str}</span>
          },
        },
        {
          label: '国家名称',
          prop: 'countryCode',
          render(h, scope) {
            let {countryCode} = scope.row, str = '-'
            let el = vm.countryList.find(el => el.value === countryCode)
            if (el) {
              str = el.label
            }
            return <span>{str}</span>
          },
        },
        {
          label: '站点编码',
          prop: 'platformSiteCode'
        },
        {
          label: '站点中文名称',
          prop: 'cnName'
        },
        {
          label: '站点英文名称',
          prop: 'enName'
        },
        {
          label: '站点URL',
          prop: 'url'
        }
      ]
    }
  },
  created() {
    this.getPlatformList()
    this.getCountry()
  },
  computed: {
    ...mapState(['countryList', 'platformList']),
    searchFields() {
      return [
        {
          name: 'platformCode',
          type: 'select',
          options: this.platformList,
          label: '平台名称'
        },
        {
          name: 'countryCode',
          label: '国家名称',
          type: 'select',
          options: this.countryList
        }
      ]
    },
    addFields() {
      return [
        {
          name: 'platformCode',
          label: '平台名称',
          span: 12,
          type: 'select',
          options: this.platformList,
          onChange(item, val, data) {
            if (
              val != null &&
              val !== '' &&
              data.countryCode != null &&
              data.countryCode !== ''
            ) {
              data.platformSiteCode = val + '-' + data.countryCode
            }
          },
          required: true
        },
        {
          name: 'countryCode',
          label: '国家名称',
          type: 'select',
          options: this.countryList,
          onChange(item, val, data) {
            if (
              val != null &&
              val !== '' &&
              data.platformCode != null &&
              data.platformCode !== ''
            ) {
              data.platformSiteCode = data.platformCode + '-' + val
            }
          },
          span: 12,
          required: true
        },
        {
          name: 'platformSiteCode',
          label: '站点编码',
          span: 12,
          disabled: true,
          required: false
        },
        {
          name: 'cnName',
          label: '站点中文名称',
          span: 12,
          required: true
        },
        {
          name: 'enName',
          label: '站点英文名称',
          span: 12,
          required: true
        },
        {
          name: 'url',
          label: '站点URL',
          span: 12,
          required: 'url'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getPlatformList', 'getCountry']),
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    edit(row) {
      if (row) {
        this.openAdd('编辑平台站点', row.platformSiteId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑平台站点', data[0].platformSiteId)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此平台站点？',
          'platformSiteRemove',
          'platformSiteId'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除此平台站点？',
            'platformSiteRemove',
            'platformSiteId'
          )
        }
      }
    }
  }
}
</script>

<style>
</style>
