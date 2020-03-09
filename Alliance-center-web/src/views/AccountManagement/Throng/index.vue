<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :expand="expand"
      :edits="edits"
      ref="lay"
      :outerParams.sync="defaultData"
      editWidth="160px"
      :tableCols="tableCols"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <Add ref="add" />
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
      expand: false,
      defaultData: {
        crowdName: null
      },
      listApi: 'crowdList',
      dialogOptions: {
        visible: false,
        title: '新增人群',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增人群'
              ? `main/crowdSave`
              : `main/crowdUpdate`
          let data = vm.$refs.add.data
          return vm.$refs.add.$refs.form.validate().then(() => {
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
            vm.$refs.add.init()
            if (vm.dialogOptions.title === '新增人群') {
              vm.$refs.add.setData(true)
              return
            }
            vm.$api[`main/crowdInfo`]({ crowdId: vm.editId })
              .then(data => {
                vm.$refs.add.setData(data.rows)
              })
              .catch(err => {})
          })
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增人群')
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
          label: '人群编号',
          prop: 'crowdId'
        },
        {
          label: '人群名称',
          prop: 'crowdName'
        },
        {
          label: '习惯',
          prop: 'habitName'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  created() {
    if (this.$route.query.crowdName) {
      this.defaultData.crowdName = this.$route.query.crowdName
      this.expand = true
      this.$router.replace({
        path: this.$route.path,
        query: {}
      })
    }
  },
  computed: {
    searchFields() {
      return [
        {
          name: 'crowdName',
          label: '人群名称'
        }
      ]
    }
  },
  methods: {
    edit(row) {
      if (row) {
        this.openAdd('编辑人群', row.crowdId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑人群', data[0].crowdId)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此人群？',
          'crowdRemove',
          'crowdId'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(data, '是否删除此人群？', 'crowdRemove', 'crowdId')
        }
      }
    }
  }
}
</script>

<style>
</style>
