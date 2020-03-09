<template>
  <div class="chose-location">
    <ElRow>
      <ElCol :span="24">
        <span style="padding: 0 4px">区域:</span>
        <el-select v-model="form.wmWarehouseDivisionId" size="small" clearable placeholder="请选择活动区域">
          <!-- <el-option label="区域一" value="shanghai"></el-option> -->
          <el-option v-for="item in wmWarehouseIds" :label="item.label" :value="item.value" :key="item.id"></el-option>
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
        <yt-table
          ref="table"
          :columns="columns"
          :data="data"
          @selectChange="selectChange"
          :reserveSelection="reserveSelection"
        ></yt-table>
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
  </div>
</template>

<script>
import { minx } from './minx.js'
export default {
  mixins: [minx],
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
      wmWarehouseIds: [],
      selectData: [],
      wmWarehouseStaffId: null,
      reserveSelection: 'wmLocationId'
    }
  },
  created() {},
  watch: {},
  methods: {
    getAreaId(params) {
      let vm = this
      let wmWarehouseIds = params.wmWarehouseIds
      vm.wmWarehouseStaffId = params.wmWarehouseStaffId
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
    search() {
      let vm = this
      if (vm.form.wmWarehouseDivisionId && vm.form.wmWarehouseDivisionId != 0) {
        vm.form.wmWarehouseDivisionIds = [vm.form.wmWarehouseDivisionId]
      } else {
        vm.form.wmWarehouseDivisionIds = []
      }
      this.getList('search')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList('search', true)
    },

    getList(type, flag) {
      let vm = this
      if (flag != true) {
        vm.pageNo = 1
      }
      let params = {
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo
      }
      if (vm.wmWarehouseStaffId) {
        params.id = vm.wmWarehouseStaffId
      }
      if (vm.$.dataType(flag) === 'Object') {
        // 保存回显数据
        this.selectEchoInit(flag.checkedLists)
      }
      if (vm.$.dataType(type) === 'String') {
        params = Object.assign({}, params, vm.form)
      }
      vm.$api[`warehouse/wmLocationGlobalList`](params).then(
        ({ page = {} }) => {
          vm.pageNo = page.pageNo
          vm.pageSize = page.pageSize
          vm.total = page.total
          vm.data = page.rows
          page.rows.map(item => {
            // 回显勾选数据
            vm.selectData.map(el => {
              if (item.wmLocationId == el.wmLocationId) {
                vm.$refs.table.toggleRowSelection(item)
              }
            })
          })
        }
      )
    }
  }
}
</script>

<style lang='scss'>
.chose-location {
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