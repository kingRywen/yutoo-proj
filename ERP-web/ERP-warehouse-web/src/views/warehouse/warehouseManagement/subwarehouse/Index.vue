<template>
  <!-- <div>仓库管理</div> -->
  <div>
    <yt-page
      url="warehouse/wmWarehouseList"
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
            <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit iconBtn" @click="edit(scope)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="打印布局图" placement="top" :open-delay="500">
              <i class="el-icon-printer iconBtn" @click="printLayout(scope)"/>
            </el-tooltip>
            <!-- <el-button type="text" size="mini">编辑</el-button> -->
            <!-- <el-button type="text" size="mini">打印布局图</el-button> -->
          </template>
        </el-table-column>
      </template>
    </yt-page>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    let vm = this
    return {
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
        { value: 'warehouseShort', label: '排序' },
        { value: 'wmName', label: '仓库名称' },
        { value: 'warehouseNumber', label: '仓库编号' },
        { value: 'warehouseTypeName', label: '仓库类型' },
        {
          value: 'countryEnName',
          label: '所在国家',
          render(h, scope) {
            return (
              <div class="flex-c">
                <div>
                  <img
                    width="30"
                    style={{ display: 'block' }}
                    src={scope.row.countryImagePath}
                  />
                </div>
                <span style={{ marginLeft: '6px' }}>
                  {scope.row.countryEnName}
                </span>
              </div>
            )
          }
        },
        {
          value: 'activatedFlag',
          label: '是否激活',
          render(h, scope) {
            let { activatedFlag } = scope.row
            return (
              <el-button
                type="text"
                class="__table-btn"
                icon={activatedFlag ? `el-icon-check` : `el-icon-close`}
                on-click={() => {
                  let params = {
                    ids: [scope.row.wmWarehouseId],
                    activatedFlag: activatedFlag ? 0 : 1
                  }
                  vm.$api[`warehouse/wmWarehouseActivated`](params)
                    .then(() => {
                      vm.$refs.page.getList(true)
                    })
                    .catch(() => {})
                }}
              />
            )
          }
        },
        {
          value: 'partitionsNumber',
          label: '区域',
          render(h, scope) {
            return (
              <el-button
                type="text"
                onClick={() => {
                  return vm.openDialog(scope.row.wmWarehouseId)
                }}
              >
                <b style="font-weight:bolder">{scope.row.partitionsNumber}</b>
              </el-button>
            )
          }
        },
        { value: 'createUserName', label: '添加人' },
        { value: 'createTimeString', label: '添加时间', width: 180 }
      ],

      btnConfig: [
        {
          name: '添加',
          fn: () => {
            // this.$refs.page.submitForm()
            this.$refs.page.$dialog({
              title: '添加仓库',
              visible: true,
              okBtnText: '确认',
              cancelBtnText: '取消',
              component: () => import('./components/AddWarehouse.vue')
            })
          }
        },
        {
          name: '添加区域',
          disabled: () => {
            return vm.selection.length !== 1
          },
          fn: () => {
            this.openDialog()
          }
        },
        {
          name: '删除',
          type: 'danger',
          fn: () => {
            this.batchModify('wmWarehouseDelete', '是否删除仓库?')
          }
        },
        {
          name: '激活',
          fn: () => {
            this.batchModify('wmWarehouseActivated', null, { activatedFlag: 1 })
          }
        },
        {
          name: '禁用',
          fn: () => {
            this.batchModify('wmWarehouseActivated', '是否禁用仓库?', {
              activatedFlag: 0
            })
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('vmWarehouse', ['warehouseType', 'warehouseStatus']),
    searchConfig() {
      let vm = this
      return [
        {
          label: '仓库名称',
          value: 'name',
          type: 'input'
        },
        {
          label: '仓库类型',
          value: 'types',
          type: 'multiple',
          children: vm.warehouseType
        },
        {
          label: '状态',
          value: 'status',
          type: 'select',
          children: vm.warehouseStatus
        }
      ]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    ...mapActions('vmWarehouse', ['queryData']),
    edit(scope) {
      this.$refs.page.$dialog({
        title: '编辑仓库',
        visible: true,
        okBtnText: '确认',
        cancelBtnText: '取消',
        params: scope.row,
        component: () => import('./components/AddWarehouse.vue')
      })
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
      this.$refs.page.$dialog({
        title: '添加区域',
        visible: true,
        component: () => import('./components/AddArea.vue')
      })
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
      Promise.all([this.queryData(0), this.queryData(1)]).catch(() => {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '初始化数据失败，请刷新重试'
        })
      })
    },
    searchData(val) {
      return val
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