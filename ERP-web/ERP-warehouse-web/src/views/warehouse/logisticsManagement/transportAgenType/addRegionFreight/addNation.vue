<template>
  <div class="national-area-manage">
    <el-row>
      <ElCol :span="24">
        <el-form ref="form" :inline="true" :model="form" label-width="80px">
          <!-- <el-form-item>
            <el-select size="small" v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <el-input size="small" v-model="form.region" :placeholder="columns[0].label"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
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
  </div>
</template>

<script>
export default {
  props: {
    reserveSelection: {
      type: String,
      default: 'provinceId'
    }
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 1,
      form: {
        region: ''
      },
      columns: [
        {
          label: '区域名称',
          value: 'areaName'
        }
      ],
      tableData: [],
      nationId: null,
      selectData: [],
      params: {},
      obj: {},
      objNum: 0
    }
  },
  created() {
    console.log(this.reserveSelection)
  },
  methods: {
    edit(val) {
      console.log(val)
    },
    search() {
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
    selectChange(val) {
      let vm = this
      vm.selectData = val
      let list = []
      if (vm.params && vm.params.title == '选择更多国家') {
        list = [...vm.params.logisticCountryList]
      } else if (vm.params && vm.params.title == '选择更多省') {
        list = [...vm.params.logisticProvinceList]
      }
      vm.$.mergeId(val, list, 'provinceId', vm)
    },
    submitForm(cb) {
      let vm = this
      let countryIdList = []
      let provinceIdList = []
      let logisticRegionId = vm.params.logisticRegionId
      if (vm.params && vm.params.title == '选择更多国家') {
        countryIdList = [...vm.selectData, ...Object.values(vm.obj)].map(
          item => item.countryId
        )
        vm.params.logisticProvinceList
          ? (provinceIdList = vm.params.logisticProvinceList.map(
              item => item.provinceId
            ))
          : []
      } else if (vm.params && vm.params.title == '选择更多省') {
        provinceIdList = [...vm.selectData, ...Object.values(vm.obj)].map(
          item => item.provinceId
        )
        vm.params.logisticCountryList
          ? (countryIdList = vm.params.logisticCountryList.map(
              item => item.countryId
            ))
          : []
      }

      let params = {
        provinceIdList,
        countryIdList,
        logisticRegionId
      }
      console.log(params)

      cb && cb(params)
    },
    getList(type, ...obj) {
      let vm = this
      if (vm.$.dataType(obj[0]) === 'Object') {
        vm.params = obj[0] ? obj[0] : vm.params
        vm.params.logisticProvinceList = vm.params.logisticProvinceList
          ? vm.params.logisticProvinceList
          : []
        vm.params.logisticCountryList = vm.params.logisticCountryList
          ? vm.params.logisticCountryList
          : []
      } else if (!obj[0]) {
        vm.pageNo = 1
      }
      let params = {
        sortOrder: 'asc',
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo
      }
      if (vm.params && vm.params.title == '选择更多国家') {
        params.countryIdList = vm.params.logisticCountryList.map(
          item => item.countryId
        )
        vm.columns = [
          {
            label: '国家',
            value: 'countryName'
          }
        ]
        if (type) {
          params.countryName = vm.form.region
        }
      } else if (vm.params && vm.params.title == '选择更多省') {
        params.provinceIdList = vm.params.logisticProvinceList.map(
          item => item.provinceId
        )
        vm.columns = [
          {
            label: '省',
            value: 'provinceName'
          }
        ]
        if (type) {
          params.provinceName = vm.form.region
        }
      }
      vm.$api[vm.params.url](params).then(data => {
        let { rows, total, pageNo, pageSize } = data
        vm.tableData = rows.map(item => {
          if (vm.params && vm.params.title == '选择更多国家') {
            vm.params.logisticCountryList.map(el => {
              if (el.countryId === item.countryId) {
                vm.$refs['table'].toggleRowSelection(item)
                console.log(item.countryId)
              }
            })
          } else if (vm.params && vm.params.title == '选择更多省') {
            vm.params.logisticProvinceList.map(el => {
              el.provinceId === item.provinceId &&
                vm.$refs['table'].toggleRowSelection(item)
            })
          }
          return item
        })
        vm.total = total
        vm.pageNo = pageNo
        vm.pageSize = pageSize
      })
    },
    resetForm() {
      this.tableData = []
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
