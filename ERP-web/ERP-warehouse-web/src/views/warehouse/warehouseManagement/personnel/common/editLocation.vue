<template>
  <div class="edit-location">
    <ElRow>
      <ElCol :span="24">
        <span style="padding: 0 4px">区域:</span>
        <el-select v-model="form.wmWarehouseDivisionId" size="small" clearable placeholder="请选择活动区域">
          <!-- <el-option label="区域一" value="shanghai"></el-option> -->
          <el-option v-for="item in wmWarehouseIds" :label="item.label" :value="item.value" :key="item.id"></el-option>
          <!-- <el-option label="区域二" value="beijing"></el-option> -->
        </el-select>
        <span style="padding: 0 4px">行:</span>
        <el-input-number
          v-model="form.rowStartIndex"
          :controls="false"
          size="small"
          :min="0"
          :max="9999"
          class="small-input"
        ></el-input-number>~
        <el-input-number
          v-model="form.rowEndIndex"
          :controls="false"
          size="small"
          :min="0"
          :max="9999"
          class="small-input"
        ></el-input-number>
        <span style="padding: 0 4px">列:</span>
        <el-input-number
          v-model="form.columnStartIndex"
          :controls="false"
          size="small"
          :min="0"
          :max="9999"
          class="small-input"
        ></el-input-number>~
        <el-input-number
          v-model="form.columnEndIndex"
          :controls="false"
          size="small"
          :min="0"
          :max="9999"
          class="small-input"
        ></el-input-number>
      </ElCol>
    </ElRow>
    <ElRow style="margin-top: 10px">
      <ElCol :span="24">
        <span style="padding: 0 4px">层:</span>
        <el-input-number
          v-model="form.floorStartIndex"
          :controls="false"
          size="small"
          :min="0"
          :max="9999"
          class="small-input"
        ></el-input-number>~
        <el-input-number
          v-model="form.floorEndIndex"
          :controls="false"
          size="small"
          :min="0"
          :max="9999"
          class="small-input"
        ></el-input-number>
        <span style="padding: 0 4px"></span>
        <ElButton size="small" type="primary" @click="search">搜索</ElButton>
      </ElCol>
    </ElRow>
    <ElRow style="margin-top: 10px;">
      <ElCol :span="24">
        <ElButton type="primary" size="small" @click="handlAdd">添加</ElButton>
        <ElButton type="primary" size="small" @click="handleRemove">删除</ElButton>
      </ElCol>
    </ElRow>
    <ElRow style="margin-top: 10px;">
      <ElCol :span="24">
        <yt-table :columns="columns" :data="data" @selectChange="selectChange"></yt-table>
      </ElCol>
    </ElRow>
    <ElRow style="margin-top: 10px;">
      <ElCol :span="24" class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10,30,60,80]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </ElCol>
    </ElRow>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 1,
      form: {},
      columns: [
        {
          label: '库位',
          value: 'locationName'
        },
        {
          label: '规格',
          value: 'divisionName'
        }
      ],
      data: [],
      wmWarehouseStaffId: null,
      wmWarehouseIds: [],
      wmWarehouseId: null,
      selectData: []
    }
  },
  mounted() {},
  methods: {
    getAreaId(params) {
      let vm = this
      let wmWarehouseIds = params.wmWarehouseIds
      vm.$api[`warehouse/wmWarehouseGlobalDivisionList`]({
        wmWarehouseIds
      }).then(({ list }) => {
        vm.wmWarehouseIds = list.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      })
    },
    selectChange(val) {
      this.selectData = val
    },
    search() {
      let vm = this
      if (vm.form.wmWarehouseDivisionId && vm.form.wmWarehouseDivisionId != 0) {
        vm.form.wmWarehouseDivisionIds = [vm.form.wmWarehouseDivisionId]
      }
      this.getList('search')
    },
    handlAdd() {
      let vm = this
      if (!vm.wmWarehouseId && vm.wmWarehouseId != 0) {
        this.$message('未获取到仓库')
        return
      }
      this.$refs.dialog.$dialog({
        title: '添加',
        visible: true,
        width: '600px',
        component: () => import('./choseLocation'),
        childFn: [
          {
            name: 'getAreaId',
            params: {
              wmWarehouseIds: [vm.wmWarehouseId],
              wmWarehouseStaffId: vm.wmWarehouseStaffId
            }
          },
          {
            name: 'getList',
            params: {
              checkedLists: vm.data
            }
          }
        ],
        submitForm: val => {
          let vm = this
          let locationIds = val.map(item => item.wmLocationId)
          let params = {
            locationIds,
            wmWarehouseStaffId: vm.wmWarehouseStaffId
          }
          return vm.$api[`warehouse/WmWarehouseBatchAdd`](params).then(() => {
            vm.getList()
            return Promise.resolve()
          })
        }
      })
    },
    submitForm(cb) {
      cb && cb()
    },
    resetForm() {},
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList('search', true)
    },
    getWmWarehouseStaffId(params) {
      this.wmWarehouseStaffId = params.wmWarehouseStaffId
      this.wmWarehouseId = params.wmWarehouseId
    },
    handleRemove() {
      let vm = this

      if (vm.$editMsg(vm.selectData, false)) {
        return
      }
      let params = {
        wmWarehouseStaffId: vm.wmWarehouseStaffId,
        locationIds: vm.selectData.map(item => item.wmLocationId)
      }
      vm.$api[`warehouse/WmWarehouseBatchRemove`](params).then(() => {
        vm.getList()
      })
    },
    getList(type, flag) {
      let vm = this
      if (flag != true) {
        vm.pageNo = 1
      }
      let params = {
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        id: vm.wmWarehouseStaffId
      }
      if (type) {
        params = Object.assign({}, params, vm.form)
      }
      vm.$api[`warehouse/WmWarehouseGlobalPage`](params).then(
        ({ page = {} }) => {
          vm.pageNo = page.pageNo
          vm.pageSize = page.pageSize
          vm.total = page.total
          vm.data = page.rows
        }
      )
    }
  }
}
</script>

<style lang='scss'>
.edit-location {
  background: #fff;
  .small-input {
    width: 60px;
  }
  .pagination {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
  }
}
</style>