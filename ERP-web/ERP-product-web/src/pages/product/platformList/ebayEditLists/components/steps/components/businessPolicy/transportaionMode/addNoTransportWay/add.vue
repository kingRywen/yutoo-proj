<template>
  <div class="national-area-manage">
    <el-row>
      <ElCol :span="24">
        <el-form ref="form" :inline="true" :model="form" size="small" label-width="80px">
          <!-- <el-form-item>
            <el-select multiple collapse-tags v-model="form.countryIdList" clearable placeholder="国家(多选)">
              <el-option v-for="item in nationList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <!-- <el-select size="small" v-model="form.provinceId" placeholder="省">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>-->
            <el-input v-model="filterText" placeholder="请输入关键字"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-button size="small" type="primary" @click="search">搜索</el-button>
          </el-form-item> -->
        </el-form>
      </ElCol>
    </el-row>
    <el-row>
      <ElCol :span="24">
        <ElTree
          :filter-node-method="filterNode"
          :data="treeData"
          :expand-on-click-node="false"
          :check-on-click-node="true"
          ref="tree"
          node-key="name"
          show-checkbox
          :props="defaultProps"
          check-strictly
          @check-change="handleCheckChange"
        ></ElTree>
        <!-- <yt-table
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
        </section>-->
      </ElCol>
    </el-row>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode, showToast } from 'common/common'
import YtTable from '../../../table/index'

export default {
  props: ['selectedList'],
  data() {
    return {
      filterText: null,
      treeData: [],
      defaultProps: {
        children: 'chiledList',
        label: 'supperName',
        disabled: 'disabled'
      },
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
      selectData: [],
      nationList: []
    }
  },
  watch: {
      filterText(val) {
        val = val.trim()
        this.$refs.tree.filter(val);
      }
    },
  created() {
    this.getTreeData()
    let vm = this
    // vm.getData('LOGISTIC_COUNTRY_SEARCH_LIST', {}, res => {
    //   vm.nationList = res.data.rows.map(el => ({
    //     label: el.countryName,
    //     value: el.countryId
    //   }))
    // })
  },
  computed: {},
  methods: {
    filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
    handleCheckChange(data, isChecked, hasChildChecked) {
      console.log(data, isChecked, hasChildChecked)
      if (data.areaId == null) {
        // 选中的是区域节点，把子节点置为不可用
        data.chiledList.forEach(el => {
          if (isChecked) {
            this.$refs.tree.setChecked(el.name, false)
          }
          this.$set(el, 'disabled', isChecked)
        })
      }
    },
    getTreeData(data = {}) {
      let vm = this
      fetchData({
        ...apis.PRODUCT_PLATFORM_AREA_LIST,
        data
      }).then(res => {
        handlerCode(
          res,
          () => {
            res.data.rows.forEach(el => {
              el.name = el.supperName
              if (el.chiledList) {
                el.chiledList.forEach(_el => {
                  _el.supperName = _el.areaName
                  _el.supperId = _el.areaId
                  _el.parentName = el.supperName
                  _el.parentId = el.supperId
                  _el.name = _el.areaName
                })
              }
            })
            vm.treeData = res.data.rows
            vm.setDisabled()
          },
          () => {},
          true
        )
      })
    },
    setDisabled() {
      let checkedName = []
      this.selectedList.forEach(el => {
        if (!el.country.length) {
          // 洲
          checkedName.push(el.name)
          let child = this.treeData.find(_el => _el.name === el.name)
          child.chiledList.forEach(_el => {
            checkedName.push(_el.name)
          })
        } else {
          // 有国家
          el.country.forEach(_el => {
            checkedName.push(_el.name)
          })
        }
      })

      console.log(checkedName)

      this.treeData.forEach(el => {
        if (checkedName.indexOf(el.name) > -1) {
          this.$set(el, 'disabled', true)
        } else {
          this.$set(el, 'disabled', false)
        }

        if (el.chiledList && el.chiledList.length) {
          el.chiledList.forEach(_el => {
            if (checkedName.indexOf(_el.name) > -1) {
              this.$set(_el, 'disabled', true)
            } else {
              this.$set(_el, 'disabled', false)
            }
          })
        }
      })
    },
    edit(val) {
      console.log(val)
    },
    getData(name, params = {}, cb) {
      return fetchData({
        ...apis[name],
        data: params
      }).then(res => {
        if (cb) {
          return cb(res)
        }
        return res.data.rows.map(el => ({ label: el.name, value: el.id }))
      })
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
      this.selectData = val
    },
    submitForm(cb) {
      // let provinces = this.selectData
      let provinces = this.$refs.tree.getCheckedNodes()
      console.log(provinces)
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
      // vm.getData('ebayNoTransportRegionProvinceList', params, res => {
      //   let { rows, total, pageSize, pageNo } = res.data
      //   vm.tableData = rows
      //   vm.total = total
      //   vm.pageSize = pageSize
      //   vm.pageNo = pageNo
      // })
    },
    resetForm() {
      this.tableData = []
    }
  },
  components: {
    YtTable
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
