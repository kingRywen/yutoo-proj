<template>
  <div class="national-area-manage">
    <el-row>
      <ElCol :span="24">
        <el-form ref="form" :inline="true" size="small" :model="form" label-width="80px">
          <!-- <el-form-item>
            <el-select size="small" v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <el-select v-model="form.provinceId" clearable filterable placeholder="请选择">
              <el-option v-for="item in provinceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
          reserveSelection="provinceId"
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
import storage from 'Utils/saver'
export default {
  props: ['props'],
  data() {
    return {
      loading: false,
      pageNo: 1,
      pageSize: 10,
      total: 1,
      form: {},
      columns: [
        {
          label: '省',
          value: 'provinceName'
        }
      ],
      tableData: [],
      selectData: [],
      logisticRegionId: null,
      logisticCountryId: null,
      logisticProvinceEntityIdList: [],
      provinceList: [],
      params: {},
      obj: {},
      objNum: 0,
      logisticProvinceEntityList: []
    }
  },
  mounted() {},
  watch: {
    params(val) {
      let vm = this
      if (val.countryId) {
        let { countryId } = vm.params
        let params = {
          countryId
        }
        vm.$api['warehouse/logisticProvinceSearchList'](params).then(data => {
          let { rows } = data
          vm.provinceList = rows.map(item => {
            return {
              label: item.provinceName,
              value: item.provinceId
            }
          })
        })
      }
    }
  },
  created() {},
  methods: {
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
      this.selectData = vm.formatArr(val, 'provinceId')
    },
    formatArr(arr, id) {
      let obj = {}
      let paramsArr = storage.get('local', `${this.$route.name}paramsArr`)
      arr.map(item => {
        if (!obj[item[id]] && obj[item[id]] != 0) {
          obj[item[id]] = item
        }
      })
      arr = Object.values(obj)
      if (paramsArr.length) {
        arr.map(item => {
          paramsArr = paramsArr.filter(el => el[id] != item[id])
        })
        storage.set('local', `${this.$route.name}paramsArr`, paramsArr)
      }
      return [...arr, ...paramsArr]
    },
    submitForm(cb) {
      let vm = this
      let provinces = [...vm.selectData, ...Object.values(vm.obj)]
      let params = {
        provinces
      }
      cb && cb(params)
    },
    getList(type, ...obj) {
      let vm = this
      if (vm.$.dataType(obj[0]) === 'Object') {
        vm.params = JSON.parse(JSON.stringify(obj[0]))
        Array.isArray(vm.params.logisticProvinceEntityList) ||
          (vm.params.logisticProvinceEntityList = [])
        vm.params.logisticProvinceEntityIdList = vm.params.logisticProvinceEntityList.map(
          item => item.provinceId
        )
        vm.selectData = vm.$clone(vm.params.logisticProvinceEntityList)
        storage.set(
          'local',
          `${this.$route.name}paramsArr`,
          vm.$clone(vm.params.logisticProvinceEntityList)
        )
      } else if (!obj[0]) {
        vm.pageNo = 1
      }
      let { countryId } = vm.params
      let params = {
        sortOrder: 'asc',
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        countryId
      }
      if (type) {
        let form = JSON.parse(JSON.stringify(vm.form))
        params = Object.assign({}, params, form)
      }
      vm.$api['order/ebayNoTransportRegionProvinceEditList'](params)
        .then(data => {
          let { rows = [], total = 0, pageSize = 10, pageNo = 1 } = data
          vm.tableData = rows.map(item => {
            vm.$.dataType(item.provinceId) === 'String' &&
              (item.provinceId = Number(item.provinceId))
            //回显
            if (
              vm.selectData &&
              vm.selectData.find(el => el.provinceId == item.provinceId)
            ) {
              vm.$refs['table'].toggleRowSelection(item)
            }
            return item
          })
          vm.total = total
          vm.pageSize = pageSize
          vm.pageNo = pageNo
        })
        .catch(err => {
          console.log(err)
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
