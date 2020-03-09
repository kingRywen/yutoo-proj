<template>
  <!-- <div>仓库管理</div> -->
  <div>
    <yt-page
      url="product/globalReportList"
      reserveSelection="wmWarehouseId"
      :fixedPage="true"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="selectChange"
      :dialogEvents="dialogEvents"
      ref="page"
    >
      <template slot="tableLeft">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.savePath" effect="dark" content="下载" placement="top" :open-delay="500">
              <i class="el-icon-download iconBtn" @click="edit(scope)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </yt-page>
  </div>
</template>
<script>
// import { mapState, mapActions } from 'vuex'
import { downloadFile } from 'Utils/tools'
export default {
  data() {
    let vm = this
    return {
      globalReportReportModelTypeList: [],
      wmWarehouseId: null,
      selection: [],
      dialogEvents: {
        open() {
          vm.$nextTick(() => {
            let component = vm.$refs.page.$refs.component
            if (vm.selection.length) {
              // 传外面的id进弹窗组件
              component.wmWarehouseId = vm.selection[0].wmWarehouseId
            } else if (vm.wmWarehouseId) {
              component.wmWarehouseId = vm.wmWarehouseId
            }
            component._initData && component._initData()
          })
        },
        close() {
          console.log(333)
        },
        handleOkClick() {
          return vm.$refs.page.$refs.component.submit().then(() => {
            vm.$refs.page.getList(true)
          })
        },
        handleEditClick() {}
      },
      tableConfig: [
        { value: 'reportName', label: '报告名称' },
        { value: 'modelName', label: '模块名称' },
        {
          value: 'statusString',
          label: '状态',
          render(h, scope) {
            return (
              <span class={scope.row.reportStatus == 1 ? '' : 'success'}>
                {scope.row.reportStatus == 1 ? '处理中' : '处理成功'}
              </span>
            )
          }
        },
        { value: 'userName', label: '操作人' },
        {
          value: 'createTime',
          label: '操作时间'
        }
      ],

      btnConfig: [
        // {
        //   name: '下载',
        //   fn: () => {
        //   }
        // },
        // {
        //   name: '删除',
        //   type: 'danger',
        //   fn: () => {}
        // }
        // {
        //   name: '添加区域',
        //   disabled: () => {
        //     return vm.selection.length !== 1
        //   },
        //   fn: () => {
        //     this.openDialog()
        //   }
        // },
        // {
        //   name: '删除',
        //   type: 'danger',
        //   fn: () => {
        //     this.batchModify('wmWarehouseDelete', '是否删除仓库?')
        //   }
        // },
        // {
        //   name: '激活',
        //   fn: () => {
        //     this.batchModify('wmWarehouseActivated', null, { activatedFlag: 1 })
        //   }
        // },
        // {
        //   name: '禁用',
        //   fn: () => {
        //     this.batchModify('wmWarehouseActivated', '是否禁用仓库?', {
        //       activatedFlag: 0
        //     })
        //   }
        // }
      ]
    }
  },
  computed: {
    // ...mapState('vmWarehouse', ['warehouseType', 'warehouseStatus']),
    searchConfig() {
      let vm = this
      return [
        {
          label: '模块名称',
          value: 'modelType',
          type: 'select',
          children: vm.globalReportReportModelTypeList
        },
        {
          label: '报告名称',
          value: 'reportName',
          type: 'input'
        },
        {
          label: '导出时间',
          value: 'time',
          type: 'time'
          // format: 'yyyy-MM-dd'
        }
      ]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // ...mapActions('vmWarehouse', ['queryData']),
    getGlobalReportReportModelType() {
      this.$api[`product/globalReportReportModelType`]({})
        .then(data => {
          this.globalReportReportModelTypeList = data.list.map(el => ({
            label: el.name,
            value: el.id
          }))
        })
        .catch(() => {})
    },
    edit(scope) {
      downloadFile(scope.row.savePath)
    },
    printLayout(scope) {
      let routeUrl = this.$router.resolve({
        name: 'subwarehousePrintLayout',
        params: { wmWarehouseId: scope.row.wmWarehouseId }
      })
      window.open(routeUrl.href, '_blank')
    },
    openDialog(id) {
      if (id) {
        this.wmWarehouseId = id
      } else {
        this.wmWarehouseId = null
      }
      // this.$refs.page.$dialog({
      //   title: '添加区域',
      //   visible: true,
      //   component: () => import('./components/AddArea.vue')
      // })
    },
    batchModify(api, content, params) {
      let ids = this.getChecked()
      if (ids) {
        if (content) {
          this.$.showWarning(content, () => {
            this.$api[`warehouse/${api}`]({ ids, ...params })
              .then(() => {
                this.refresh()
              })
              .catch(() => {})
          })
        } else {
          this.$api[`warehouse/${api}`]({ ids, ...params })
            .then(() => {
              this.refresh()
            })
            .catch(() => {})
        }
      }
    },
    getChecked(key = true) {
      if (this.selection.length) {
        if (key) {
          return this.selection.map(el => el.wmWarehouseId)
        }
        return this.selection
      } else {
        this.$message.warning('请选择数据进行操作')
      }
    },
    initData() {
      this.getGlobalReportReportModelType()
      // Promise.all([this.queryData(0), this.queryData(1)]).catch(() => {
      //   this.$notify({
      //     title: '警告',
      //     type: 'warning',
      //     message: '初始化数据失败，请刷新重试'
      //   })
      // })
    },
    searchData(val) {
      let { time = [], ...info } = val
      if (time === '') {
        time = []
      }
      let [exportStartTime, exportEndTime] = time
      return { exportStartTime, exportEndTime, ...info }
    },
    selectChange(val) {
      this.selection = val
    },
    getList() {
      return this.$refs.page.getList()
    },
    refresh() {
      return this.$refs.page.getList(true)
    },
    submitForm() {
      // console.log('submitForm')
      // this.$refs.page.$dialog({
      //   visible: false
      // })
      // //this.$refs.page.getList()
    }
  }
}
</script>
<style lang="scss">
</style>