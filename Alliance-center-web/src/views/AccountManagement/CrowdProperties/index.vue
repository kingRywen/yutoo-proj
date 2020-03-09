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
      <Add ref="add"/>
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [mixin],
  components: {
    Add: () => import('./add.vue')
  },
  data() {
    let vm = this
    return {
      listApi: 'crowdPropertyList',
      dialogOptions: {
        visible: false,
        title: '新增人群属性',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let add = vm.$refs.add
          return add.$refs.form.validate().then(() => {
            let api =
              vm.dialogOptions.title === '新增人群属性'
                ? `main/crowdPropertySave`
                : `main/crowdPropertyUpdate`
            let data = add.data
            return vm.$api[api](data)
              .then(data => {
                vm.dialogOptions.visible = false
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          })
        },
        handleOpen() {
          vm.$nextTick(() => {
            if (vm.dialogOptions.title === '新增人群属性') {
              vm.$refs.add.setData(true)
              return
            }
            vm.$api[`main/crowdPropertyInfo`]({ crowdPropertyId: vm.editId })
              .then(data => {
                vm.$refs.add.setData(data.rows)
              })
              .catch(err => {})
          })
        },
        close() {
          vm.$refs.add.clear()
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增人群属性')
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
          label: '人群属性编号',
          prop: 'crowdPropertyId'
        },
        {
          label: '人群属性名称',
          prop: 'crowdPropertyName'
        },
        {
          label: '属性值数量',
          prop: 'crowdPropertyValueCount'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  computed: {
    searchFields() {
      return [
        {
          name: 'crowdPropertyName',
          label: '人群属性名称'
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
        this.openAdd('编辑人群属性', row.crowdPropertyId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑人群属性', data[0].crowdPropertyId)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此人群属性？',
          'crowdPropertyRemove',
          'crowdPropertyId'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除此人群属性？',
            'crowdPropertyRemove',
            'crowdPropertyId'
          )
        }
      }
    }
  }
}
</script>

<style>
</style>
