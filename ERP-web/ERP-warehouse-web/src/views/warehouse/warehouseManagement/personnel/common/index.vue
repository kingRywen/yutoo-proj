<template>
  <div class="personel-common">
    <yt-page
      url="warehouse/WmWarehouseStaffPage"
      reserveSelection="wmWarehouseStaffId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="selectChange"
      ref="page"
      :staffType="types"
    >
      <template slot="table">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit iconBtn" @click="handleEdit(scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :open-delay="500">
              <i class="el-icon-delete iconBtn" @click="handleDelete(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </yt-page>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

function getInit(type, vm) {
  if (type == 1) {
    // 仓库管理人员
    vm.searchConfig = [
      {
        value: 'userName',
        label: '用户名称:',
        placeholder: '',
        type: 'input'
      },
      {
        value: 'wmWarehouseId',
        label: '负责仓库:',
        placeholder: '',
        type: 'select',
        children: []
      }
    ]
    vm.tableConfig = [
      {
        label: '用户名称',
        value: 'userName'
      },
      {
        label: '负责仓库',
        value: 'wmWarehouseName'
      },
      {
        label: '状态',
        render: vm.$.checkFlag((index, row) => {
          let wmWarehouseStaffId = row.wmWarehouseStaffId
          let activateFlag = row.activateFlag == 1 ? 0 : 1
          vm.$api['warehouse/WmWarehouseActiveUpdate']({
            wmWarehouseStaffId,
            activateFlag
          }).then(() => {
            vm.$refs.page.getList('search')
          })
        })
      }
    ]
    console.log(vm)
  } else if (type == 2) {
    // 拣货人员
    vm.searchConfig = [
      {
        value: 'userName',
        placeholder: '拣货人名称',
        type: 'input'
      },
      {
        value: 'wmWarehouseIds',
        placeholder: '仓库（多选）',
        type: 'multiple',
        children: []
      },
      {
        value: 'locationCode',
        placeholder: '负责库位',
        type: 'input'
      }
    ]
    vm.tableConfig = [
      {
        label: '仓库',
        value: 'wmWarehouseName'
      },
      {
        label: '拣货人名称',
        value: 'userName'
      },
      {
        label: '负责库位',
        render(h, scope) {
          return (
            <span
              style="color:#108ee9"
              onClick={() => {
                vm.handlClickStorage(scope.row)
              }}
            >
              {scope.row.num || scope.row.num == 0 ? scope.row.num : '-'}
            </span>
          )
        }
      },
      {
        label: '状态',
        render: vm.$.checkFlag((index, row) => {
          let wmWarehouseStaffId = row.wmWarehouseStaffId
          let activateFlag = row.activateFlag == 1 ? 0 : 1
          vm.$api['warehouse/WmWarehouseActiveUpdate']({
            wmWarehouseStaffId,
            activateFlag
          }).then(() => {
            vm.$refs.page.getList('search')
          })
        })
      },
      {
        label: '添加时间',
        value: 'createTime'
      },
      {
        label: '添加人员',
        value: 'userName'
      },
      {
        label: '拣货总数',
        value: 'historyPickingCount'
      }
    ]
  } else {
    // 包装人员管理
    vm.searchConfig = [
      {
        value: 'userName',
        label: '用户名称:',
        placeholder: '',
        type: 'input'
      },
      {
        value: 'wmWarehouseId',
        label: '所属仓库',
        placeholder: '',
        type: 'select',
        children: []
      }
    ]
    vm.tableConfig = [
      {
        label: '用户名称',
        value: 'userName'
      },
      {
        label: '所属仓库',
        value: 'wmWarehouseName'
      },
      {
        label: '状态',
        render: vm.$.checkFlag((index, row) => {
          let wmWarehouseStaffId = row.wmWarehouseStaffId
          let activateFlag = row.activateFlag == 1 ? 0 : 1
          vm.$api['warehouse/WmWarehouseActiveUpdate']({
            wmWarehouseStaffId,
            activateFlag
          }).then(() => {
            vm.$refs.page.getList('search')
          })
        })
      }
    ]
  }
}

export default {
  props: {
    types: {
      default: 1
    }
  },
  data() {
    let vm = this
    return {
      // type: 1,
      btnConfig: [
        {
          name: '添加',
          fn: () => {
            let params = {}
            if (vm.types == 1) {
              params = {
                title: '添加仓库管理人员',
                width: '400px',
                visible: true,
                component: () => import('./addWarehouseManager.vue')
              }
            } else if (vm.types == 2) {
              params = {
                title: '添加拣货人员',
                width: '600px',
                visible: true,
                component: () => import('./addOderManager.vue')
              }
            } else {
              params = {
                title: '添加包装人员',
                width: '400px',
                visible: true,
                component: () => import('./addPackageManager.vue')
              }
            }
            vm.$refs.page.$dialog(params)
          }
        },
        {
          name: '删除',
          fn: () => {
            vm.handleDelete()
          }
        }
      ],
      searchConfig: [],
      tableConfig: [],
      selectData: []
    }
  },
  created() {
    let vm = this
    getInit(vm.types, vm)
    vm.queryData(3)
    if (vm.types == 2) {
      vm.getWmWarehouseGlobalLists()
    }
  },
  computed: {
    ...mapState('vmWarehouse', ['warehouseList']),
    ...mapState('logistics', ['WmWarehouseGlobalLists'])
  },
  watch: {
    warehouseList(val) {
      let vm = this
      if (vm.types == 1 || vm.types == 3) {
        vm.searchConfig[1].children = val
      }
    },
    WmWarehouseGlobalLists(val) {
      let vm = this
      if (this.types == 2) {
        vm.searchConfig[1].children = val
      }
    }
  },
  methods: {
    ...mapActions('vmWarehouse', ['queryData']),
    ...mapActions('logistics', ['getWmWarehouseGlobalLists']),
    searchData(val) {
      if (val.wmWarehouseId) {
        val.wmWarehouseIds = [val.wmWarehouseId]
        delete val.wmWarehouseId
      }
      return val
    },
    selectChange(val) {
      this.selectData = val
    },
    submitForm(val, title) {
      let vm = this
      switch (title) {
        case '添加仓库管理人员':
          vm.handleAdd(val)
          break
        case '编辑仓库管理人员':
          vm.handleAdd(val)
          break
        case '添加拣货人员':
          vm.handleAdd(val)
          break
        case '编辑拣货人员':
          vm.handleAdd(val)
          break
        case '添加包装人员':
          vm.handleAdd(val)
          break
        case '编辑包装人员':
          vm.handleAdd(val)
          break
        case '查看库位':
          vm.$refs.page.closeForm()
          break

        default:
          break
      }
    },
    handleAdd(val) {
      let params = val
      let vm = this
      if (vm.types == 1 || vm.types == 3) {
        if (vm.$.dataType(params.userId) == 'Number') {
          vm.$api[`warehouse/WmWarehouseStaffSave`](params).then(() => {
            vm.$refs.page.closeForm()
          })
        } else if (vm.$.dataType(params.userId) == 'Array') {
          let len = params.userId.length
          params.userId.map(async (item, index) => {
            let obj = {
              ...vm.$clone(params),
              userId: item
            }
            await vm.$api[`warehouse/WmWarehouseStaffSave`](obj)
            if (index == len - 1) {
              vm.$refs.page.closeForm()
            }
          })
        }
      } else {
        vm.$api[`warehouse/WmWarehouseStaffSave`](params).then(() => {
          vm.$refs.page.closeForm()
        })
      }
    },
    handleEdit(row) {
      let vm = this
      let wmWarehouseStaffId = row.wmWarehouseStaffId
      let params = {}
      if (vm.types == 1) {
        params = {
          title: '编辑仓库管理人员',
          width: '400px',
          visible: true,
          component: () => import('./addWarehouseManager.vue'),
          childFn: [
            {
              name: 'eidt',
              params: {
                wmWarehouseStaffId
              }
            }
          ]
        }
      } else if (vm.types == 2) {
        params = {
          title: '编辑拣货人员',
          width: '600px',
          visible: true,
          component: () => import('./addOderManager.vue'),
          childFn: [
            {
              name: 'eidt',
              params: {
                wmWarehouseStaffId
              }
            }
          ]
        }
      } else {
        params = {
          title: '编辑包装人员',
          width: '400px',
          visible: true,
          component: () => import('./addPackageManager.vue'),
          childFn: [
            {
              name: 'eidt',
              params: {
                wmWarehouseStaffId
              }
            }
          ]
        }
      }
      vm.$refs.page.$dialog(params)
    },
    handleDelete(row) {
      let vm = this
      let wmWarehouseStaffIds = []
      if (row) {
        wmWarehouseStaffIds = [row.wmWarehouseStaffId]
      } else {
        if (vm.$editMsg(vm.selectData, false)) {
          return
        }
        wmWarehouseStaffIds = vm.selectData.map(item => item.wmWarehouseStaffId)
      }

      let params = {
        wmWarehouseStaffIds
      }
      vm.$api[`warehouse/WmWarehouseStaffRemove`](params).then(data => {
        vm.$deleteMsg(data)
        vm.$refs.page.clearSelection()
        vm.$refs.page.getList('search')
      })
    },
    handlClickStorage(row) {
      this.$refs.page.$dialog({
        title: '查看库位',
        visible: true,
        width: '600px',
        component: () => import('./editLocation.vue'),
        childFn: [
          {
            name: 'getAreaId',
            params: {
              wmWarehouseIds: [row.wmWarehouseId]
            }
          },
          {
            name: 'getWmWarehouseStaffId',
            params: {
              wmWarehouseStaffId: row.wmWarehouseStaffId,
              wmWarehouseId: row.wmWarehouseId
            }
          },
          {
            name: 'getList',
            params: 'search'
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss'>
.personel-common {
  background: #fff;
}
</style>