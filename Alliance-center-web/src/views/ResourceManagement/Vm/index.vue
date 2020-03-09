<template>
  <div style="height:100%">
    <main-layout
      :btns="btns"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      nodeKey="categoryId"
      :treeCrud="true"
      :loadNode="_loadNode"
      ref="lay"
      editWidth="100px"
      :tableCols="tableCols"
      :outerParams="outerParams"
      @treeCurrentChange="handleTreeCurrentChange"
      @clear="handleClear"
    >
    </main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <component :is="componentId" :title="dialogOptions.title" ref="com"></component>
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapActions, mapState } from 'vuex'

export default {
  mixins: [mixin],
  components: {
    Add: () => import('./add.vue')
  },
  data() {
    let vm = this
    return {
      componentId: 'Add',
      listApi: 'vmShopList',
      outerParams: {},
      dialogOptions: {
        visible: false,
        title: '新增虚拟机',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let add = vm.$refs.com
          let data = add.$refs.add.formData
          let editTitle = ['编辑虚拟机']
          let api =
            editTitle.indexOf(vm.dialogOptions.title) > -1
              ? `vmShopUpdate`
              : 'vmShopSave'
          return add.$refs.add.validate().then(() => {
            vm.$api[`main/${api}`]({...data, categoryId: vm.outerParams.categoryId || -1})
              .then(data => {
                vm.dialogOptions.visible = false
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          })
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增虚拟机') {
            return
          }
          vm.$api[`main/vmShopInfo`]({ vmId: vm.editId })
            .then(data => {
              setTimeout(() => {
                vm.$nextTick(() => {
                  vm.$refs.com.setData(data.rows)
                })
              })
            })
            .catch(err => {})
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            if (vm.outerParams.categoryId == null) {
              vm.$message.warning('请在左侧选择类目后新增')
              return
            }
            vm.componentId = 'Add'
            vm.openAdd('新增虚拟机')
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
            vm.componentId = 'Add'
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
          name: '打开',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            this.$.showWarning('是否打开虚拟机？', () => {
              const loading = this.$loading({
                lock: true,
                text: '打开中...',
                spinner: 'el-icon-loading'
              })
              this.$api[`main/vmShopOpen`]({ vmId: scope.row.vmId })
                .then(data => {
                  loading.close()
                })
                .catch(err => {
                  loading.close()
                })
            })
          }
        },
        {
          name: '关闭',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            this.$.showWarning('是否关闭虚拟机？', () => {
              const loading = this.$loading({
                lock: true,
                text: '关闭中...',
                spinner: 'el-icon-loading'
              })
              this.$api[`main/vmShopClose`]({ vmId: scope.row.vmId })
                .then(data => {
                  loading.close()
                })
                .catch(err => {
                  loading.close()
                })
            })
          }
        }
      ],
      searchFields: [
        {
          label: '虚拟机名称',
          name: 'name'
        }
      ],
      tableCols: [
        {
          label: '虚拟机名称',
          prop: 'name'
        },
        {
          label: 'IP',
          prop: 'ip'
        },
        {
          label: '内网IP',
          prop: 'intranetIp'
        },
        {
          label: '备注',
          prop: 'remark',
          minWidth: 120
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ]
    }
  },
  computed: {
    ...mapState(['platformSite'])
  },
  methods: {
    ...mapActions(['getPlatformSite']),
    // 侧边栏类目树获取
    _loadNode(node) {
      let { data } = node,
        params

      if (data) {
        params = {
          level: data.level + 1,
          parentCategoryId: data.categoryId
        }
      } else {
        params = {
          level: 1,
          parentCategoryId: 0
        }
      }

      return this.$api[`main/categoryVmShopList`](params)
      // return Promise.resolve([
      //   {
      //     categoryId: 6,
      //     categoryMap: null,
      //     parentId: 5,
      //     name: '类目2:类目2.1:类目2.1.1',
      //     parentName: '类目2:类目2.1',
      //     hasChild: false,
      //     level: 3
      //   }
      // ])
    },
    handleClear() {
      this.outerParams = {
      }
      this.$nextTick(() => {
        this.$refs.lay.handleSearch()
      })
    },
    handleTreeCurrentChange(data, node) {
      // console.log(data, node)
      // let { categoryId, level } = data
      this.outerParams = {
        categoryId: data.categoryId
      }
      this.$nextTick(() => {
        this.$refs.lay.handleSearch()
      })
    },
    edit(row) {
      if (row) {
        // vm.componentId = 'Add'
        this.openAdd('编辑虚拟机', row.vmId)
      } else {
        let data = this.checked(false)
        if (data) {
          // vm.componentId = 'Add'
          this.openAdd('编辑虚拟机', data[0].vmId)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此虚拟机？',
          'vmShopRemove',
          'vmId'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除此虚拟机？',
            'vmShopRemove',
            'vmId'
          )
        }
      }
    }
  }
}
</script>

<style>
</style>
