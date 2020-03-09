<template>
  <!-- 区域 -->
  <div>
    <div class="btnbox">
      <el-button size="mini" type="success" @click="add">添 加</el-button>
      <el-button size="mini" type="danger" @click="del" :disabled="wmLocationIds.length?false:true">删 除</el-button>
    </div>
    <div>
      <yt-table ref="table" :data="checkedLists" :columns="columns" :border="true" @selectChange="selectChange"></yt-table>
      <ElPagination
        :total="checkedList.length"
        :current-page="checkedListPag.pageNumber"
        :page-size="checkedListPag.pageSize"
        @size-change="handleCheckedListSizeChange"
        @current-change="handleCheckedListCurrentChange"
        layout="total, prev, pager, next"
      ></ElPagination>
    </div>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  props: {
    columns: {
      type: Array,
      default: () => [
        { value: 'locationName', label: '库位' },
        { value: 'locationNormName', label: '规格' }
      ]
    },
    checkedList: {
      type: Array,
      default: () => []
    },
    wmWarehouseId: {
      default: null
    },
    reserveSelection: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      visible: false,
      wmLocationIds: [],
      selectData: [],
      checkedListPag: {
        total: 0,
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  created() {},
  computed: {
    checkedLists: {
      get() {
        if (!this.checkedList || !this.checkedList.length) {
          return []
        }
        const { total, pageSize, pageNumber } = this.checkedListPag
        return this.checkedList.slice(
          (pageNumber - 1) * pageSize,
          pageNumber * pageSize
        )
      },
      set(val) {
        let vm = this
        if (this.wmLocationIds.length > 0) {
          val = vm.checkedList.filter(
            item => vm.wmLocationIds.indexOf(item.wmLocationId) < 0
          )
        }
        vm.$emit('update:checkedList', val)
      }
    }
  },
  methods: {
    handleCheckedListSizeChange(val) {
      this.checkedListPag.pageSize = val
    },
    handleCheckedListCurrentChange(val) {
      this.checkedListPag.pageNumber = val
    },
    del() {
      let vm = this
      vm.checkedLists = vm.checkedLists.filter(item => {
        return vm.wmLocationIds.indexOf(item.wmLocationId) < 0
      })
      // this.$set(vm,'checkedLists',vm.checkedLists.filter(item => {
      //   return vm.wmLocationIds.indexOf(item.wmLocationId) < 0
      // }))
    },
    add() {
      let vm = this
      if (!vm.wmWarehouseId && vm.wmWarehouseId != 0) {
        this.$message('请先选择仓库')
        return
      }

      this.$refs.dialog.$dialog({
        title: '添加',
        visible: true,
        width: '600px',
        component: () => import('./choseLocation'),
        childFn: [
          {
            name: 'getList',
            params: {
              checkedLists: vm.checkedList
            }
          },
          {
            name: 'getAreaId',
            params: {
              wmWarehouseIds: [vm.wmWarehouseId]
            }
          }
        ],
        submitForm(val) {
          vm.checkedLists = val
          return Promise.resolve()
        }
      })
    },
    selectChange(val) {
      this.wmLocationIds = val.map(item => item.wmLocationId)
    }
  }
}
</script>
<style>
.btnbox {
  padding: 10px 0 10px 10px;
  border: 1px solid #ebeef5;
  border-bottom: none;
}
.content {
  min-height: 300px;
  max-height: 560px;
  overflow-y: auto;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>

