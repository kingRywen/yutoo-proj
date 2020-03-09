<template>
  <div class="national-area-manage">
    <el-row>
      <ElCol :span="24">
        <el-form ref="form" :inline="true" :model="form" label-width="80px">
          <el-form-item>
            <el-select size="small" v-model="form.countryId" clearable placeholder="国家">
              <!-- <el-option label="区域一" value="shanghai"></el-option> -->
              <el-option v-for="item in nationList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </ElCol>
    </el-row>
    <el-row class="mb10">
      <ElCol :span="24">
        <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="small" @click="handleEdit">编辑</el-button>
        <el-button type="primary" size="small" @click="handlDelete">删除</el-button>
      </ElCol>
    </el-row>
    <el-row>
      <ElCol :span="24">
        <yt-table
          :columns="columns"
          :data="tableData"
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
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 1,
      reserveSelection: 'areaId',
      form: {},
      columns: [
        {
          label: '国家',
          value: 'countryName'
        },
        {
          label: '省',
          value: 'province'
        }
      ],
      tableData: [],
      logisticRegionId: null,
      selectData: []
    }
  },
  created() {
    // this.getList()
    this.getNationList()
  },
  computed: {
    ...mapState('logistics', ['nationList'])
  },
  methods: {
    ...mapActions('logistics', ['getNationList']),
    search() {
      this.getList('search')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
    },
    selectChange(val) {
      this.selectData = val
    },
    handleEdit() {
      let vm = this
      if (this.$editMsg(vm.selectData)) return
      let countryId = vm.selectData[0].countryId
      let logisticRegionId = vm.logisticRegionId
      let logisticCountryId = vm.selectData[0].logisticCountryId
      let logisticProvinceEntityList =
        vm.selectData[0].logisticProvinceEntityList
      vm.$refs.dialog.$dialog({
        visible: true,
        title: '编辑省份',
        okBtnText: '选择',
        width: '780px',
        component: () => import('./edit.vue'),
        childFn: [
          {
            name: 'getList',
            params: {
              countryId,
              logisticRegionId,
              logisticCountryId,
              logisticProvinceEntityList
            }
          }
        ],
        submitForm: data => {
          let params = {
            logisticCountryId: this.logisticCountryId,
            ...data
          }
          return this.$api['warehouse/provinceEditSelect'](params).then(() => {
            vm.getList()
            vm.$refs['table'].clearSelection()
            return Promise.resolve()
          })
        }
      })
    },
    handleAdd() {
      let vm = this
      let logisticRegionId = vm.logisticRegionId
      vm.$refs.dialog.$dialog({
        visible: true,
        title: '选择省份',
        width: '780px',
        okBtnText: '选择',
        component: () => import('./add.vue'),
        submitForm(data) {
          return vm.$api['warehouse/provinceAddSelect'](data).then(() => {
            vm.getList()
            return Promise.resolve()
          })
        },
        childFn: [
          {
            name: 'getList',
            params: {
              logisticRegionId
            }
          }
        ]
      })
    },
    handlDelete() {
      let vm = this
      let logisticCountryIdList = vm.selectData.map(
        item => item.logisticCountryId
      )
      if (vm.$editMsg(logisticCountryIdList, false)) return
      this.$api['warehouse/regionCountryRemove']({
        logisticCountryIdList
      }).then(data => {
        vm.$deleteMsg(data)
        vm.$refs.table.clearSelection()
      })
    },
    getList(type, ...obj) {
      let vm = this
      if (obj[0]) {
        vm.logisticRegionId = obj[0].logisticRegionId
      }
      console.log(vm.logisticRegionId)

      let params = {
        sortOrder: 'asc',
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        logisticRegionId: vm.logisticRegionId
      }
      if (type) {
        let form = JSON.parse(JSON.stringify(vm.form))
        params = Object.assign({}, params, form)
      }
      vm.$api['warehouse/logisticRegionNationProvincePage'](params)
        .then(data => {
          let { rows, total, pageSize, pageNo } = data
          vm.$set(vm, 'tableData', rows)
          vm.tableData.map(item => {
            item.province = item.logisticProvinceEntityList
              .map(item => item.provinceName)
              .join(',')
          })
          vm.total = total
          vm.pageSize = pageSize
          vm.pageNo = pageNo
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
.national-area-manage {
  background: #fff;
  .pagination {
    text-align: right;
    margin-top: 10px;
    // position: absolute;
    // bottom: 10px;
    // left: 0;
    // right: 0;
  }
}
</style>
