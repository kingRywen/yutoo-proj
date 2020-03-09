<template>
  <div class="national-area-manage">
    <el-row>
      <ElCol :span="24">
        <el-form ref="form" :inline="true" :model="form" size="small" label-width="80px">
          <el-form-item>
            <el-select multiple collapse-tags v-model="form.countryIdList" clearable placeholder="国家(多选)">
              <!-- <el-option label="区域一" value="shanghai"></el-option> -->
              <el-option v-for="item in nationList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- <el-select size="small" v-model="form.provinceId" placeholder="省">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>-->
            <el-input v-model="form.provinceName" placeholder="省"></el-input>
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
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 1,
      reserveSelection: 'id',
      form: {
        countryIdList: [],
        provinceName: ''
      },
      columns: [
        {
          label: '省',
          value: 'provinceName'
        }
      ],
      tableData: [],
      ebayTransportTypeInfoId: null,
      selectData: []
    }
  },
  created() {
    this.getNationList()
  },
  computed: {
    ...mapState('common', ['nationList'])
  },
  methods: {
    ...mapActions('common', ['getNationList']),
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
      console.log(val)
      this.selectData = val
    },
    submitForm(cb) {
      let provinces = this.selectData
      let params = {
        provinces
      }
      cb && cb(params)
    },
    getList(type, ...obj) {
      let vm = this
      console.log(obj)
      if (obj[0] && typeof obj[0] == 'object') {
        vm.ebayTransportTypeInfoId = obj[0].ebayTransportTypeInfoId
      } else if (!obj[0]) {
        vm.pageNo = 1
      }
      let params = {
        sortOrder: 'asc',
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        ebayTransportTypeInfoId: vm.ebayTransportTypeInfoId
      }
      if (type) {
        let form = JSON.parse(JSON.stringify(vm.form))
        params = Object.assign({}, params, form)
      }
      vm.$api['order/ebayNoTransportRegionProvinceList'](params)
        .then(data => {
          let { rows, total, pageSize, pageNo } = data
          vm.tableData = rows.map(item => {
            vm.$.dataType(item.provinceId) === 'String' &&
              (item.provinceId = Number(item.provinceId))
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
