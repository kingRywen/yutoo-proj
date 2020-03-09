<template>
  <div class="add-region-freight">
    <el-row class="mb10">
      <ElCol :span="24">
        <el-button size="small" type="primary" @click="handleAdd">添加</el-button>
        <el-button size="small" type="primary" @click="handleEdit">修改</el-button>
        <el-button size="small" type="primary" @click="handleDelete">删除</el-button>
        <el-button size="small" type="primary" @click="setPredictData">设置预计到达天数</el-button>
      </ElCol>
    </el-row>
    <el-row>
      <ElCol :span="24">
        <yt-table
          :columns="columns"
          :data="tableData"
          :border="true"
          @selectChange="selectChange"
          :reserveSelection="reserveSelection"
          ref="table"
        ></yt-table>
        <section class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10,30,60,80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </section>
      </ElCol>
    </el-row>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>

<script>
import addRegionalFreight from './addRegionalFreight'
export default {
  data() {
    return {
      params: {},
      reserveSelection: 'logisticForwarderFreightId',
      pageNo: 1,
      pageSize: 10,
      total: 10,
      columns: [
        {
          label: '区域名称',
          value: 'logisticRegionName'
        },
        {
          label: '国家',
          value: 'nations'
        },
        {
          label: '省',
          value: 'provinces'
        },
        {
          label: '预计到达天数',
          value: 'predicTime'
        }
      ],
      tableData: [],
      predictEvents: {
        handleOkClick: () => {}
      },
      selectData: []
    }
  },
  mounted() {},
  methods: {
    handleAdd() {
      let vm = this
      this.$refs.dialog.$dialog({
        title: '添加运费信息',
        width: '880px',
        visible: true,
        component: () => import('./addRegionalFreight.vue'),
        childFn: [
          {
            name: 'getParams',
            params: vm.params
          }
        ],
        submitForm: vm.submitFreight
      })
    },
    handleEdit() {
      let vm = this
      if (vm.$editMsg(vm.selectData)) return
      let logisticForwarderFreightId =
        vm.selectData[0].logisticForwarderFreightId
      this.$refs.dialog.$dialog({
        title: '编辑运费信息',
        width: '880px',
        visible: true,
        component: () => import('./addRegionalFreight.vue'),
        childFn: [
          {
            name: 'edit',
            params: { logisticForwarderFreightId }
          },
          {
            name: 'getParams',
            params: vm.params
          }
        ],
        submitForm: vm.submitFreight
      })
    },
    submitFreight(data) {
      let vm = this
      return vm.$api['warehouse/forwarderTransportTypeRegionFreightSave'](
        data
      ).then(() => {
        vm.getList(null, vm.params)
        return Promise.resolve()
      })
    },
    handleDelete() {
      let vm = this
      if (vm.$editMsg(vm.selectData, false)) return
      let logisticForwarderFreightIdList = vm.selectData.map(
        item => item.logisticForwarderFreightId
      )
      this.$api['warehouse/forwarderTransportTypeRegionFreightRemove']({
        logisticForwarderFreightIdList
      }).then(data => {
        vm.$deleteMsg(data)
        vm.getList(null, vm.params)
        vm.$refs['table'].clearSelection()
      })
    },
    setPredictData() {
      let vm = this
      if (vm.$editMsg(vm.selectData, false)) return
      vm.$refs.dialog.$dialog({
        title: '设置预计到达天数',
        width: '460px',
        visible: true,
        component: () => import('./setPredictDay.vue'),
        childFn: [
          {
            name: 'getId',
            params: {
              logisticForwarderFreightIdList: vm.selectData.map(
                item => item.logisticForwarderFreightId
              )
            }
          }
        ],
        submitForm(data) {
          return vm.$api[
            'warehouse/forwarderTransportTypeRegionFreightTimeSet'
          ](data).then(data => {
            vm.$deleteMsg(data)
            vm.getList(null, vm.params)
          })
        }
      })
    },
    resetForm() {},
    submitForm(cb) {
      cb && cb()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList()
    },
    selectChange(val) {
      this.selectData = val
    },
    getList(type, ...obj) {
      let vm = this
      if (obj[0]) {
        vm.params = obj[0]
      }
      let { logisticForwarderTransportTypeId } = vm.params
      let params = {
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        sortOrder: 'asc',
        logisticForwarderTransportTypeId
      }
      this.$api['warehouse/forwarderTransportTypeRegionFreightPage'](params)
        .then(data => {
          let { rows, total, pageNo, pageSize } = data
          vm.tableData = rows
          vm.tableData.map(item => {
            item.nations = item.logisticCountryList
              .map(el => el.countryName)
              .join(',')

            item.provinces = item.logisticProvinceList
              .map(el => el.provinceName)
              .join(',')
            item.predicTime = `${item.predictTimeStart}~${item.predictTimeEnd}`
          })

          vm.total = total
          vm.pageNo = pageNo
          vm.pageSize = pageSize
        })
        .catch(() => {})
    }
  },
  components: {
    addRegionalFreight
  }
}
</script>

<style lang="scss">
.add-region-freight {
  background: #fff;
}
.small-input-width {
  width: 80px;
}
</style>
