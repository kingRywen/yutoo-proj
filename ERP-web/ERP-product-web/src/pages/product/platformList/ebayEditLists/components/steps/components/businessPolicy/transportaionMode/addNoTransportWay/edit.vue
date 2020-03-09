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
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="defaultExpandedKeys"
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
        </section> -->
      </ElCol>
    </el-row>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode } from 'common/common'
import YtTable from '../../../table/index'
const backShow = 'backShow'
const storage = {
  local: localStorage,
  session: sessionStorage,
  host: window.location.host,
  get(type, name) {
    const item = this[type].getItem(this.host + '_' + name)
    return !item ? null : JSON.parse(item)
  },
  set(type, name, val) {
    return this[type].setItem(this.host + '_' + name, JSON.stringify(val))
  },
  remove(type, name) {
    return this[type].removeItem(this.host + '_' + name)
  },
  clear(type) {
    return this[type].clear()
  }
}
export default {
  props: ['props'],
  data() {
    return {
      filterText: null,
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      treeData: [],
      defaultProps: {
        children: 'chiledList',
        label: 'supperName',
        disabled: 'disabled'
      },
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
        // vm.getData('logisticProvinceSearchList', {}, res => {
        //   vm.provinceList = res.data.rows.map(el => ({
        //     label: el.provinceName,
        //     value: el.provinceId
        //   }))
        // })
      }
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
  watch: {
      filterText(val) {
        val = val.trim()
        this.$refs.tree.filter(val);
      }
    },
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
            if (vm.cbSet) {
              vm.cbSet()
            }
          },
          () => {},
          true
        )
      })
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
    selectChange(val) {
      let vm = this
      this.selectData = vm.formatArr(val, 'provinceId')
    },
    formatArr(arr, id) {
      let obj = {}
      let paramsArr = storage.get('local', `${backShow}paramsArr`)
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
        storage.set('local', `${backShow}paramsArr`, paramsArr)
      }
      return [...arr, ...paramsArr]
    },
    submitForm(cb) {
      let vm = this
      let provinces = this.$refs.tree.getCheckedNodes()
      let params = {
        provinces
      }
      cb && cb(params)
    },
    setDisabled(name) {
      let el = this.treeData.find(el => el.name === name)
      el.chiledList.forEach(_el => {
        this.$set(_el, 'disabled', true)
      })
    },
    getList(type, ...obj) {
      let {row} = obj[0]
      row = JSON.parse(JSON.stringify(row))
      if (row.country.length) {
        // 洲有国家
        this.defaultExpandedKeys = [row.name]
        this.defaultCheckedKeys = row.country.map(el => el.name)
      } else {
        this.defaultCheckedKeys = [row.name]
        if (this.treeData.length) {
          this.setDisabled(row.name)
        } else {
          this.cbSet = this.setDisabled.bind(this, row.name)
        }
      }
      // 
      // let vm = this
      // if (Object.prototype.toString.call(obj[0]) == '[object Object]') {
      //   vm.params = JSON.parse(JSON.stringify(obj[0]))
      //   Array.isArray(vm.params.logisticProvinceEntityList) ||
      //     (vm.params.logisticProvinceEntityList = [])
      //   vm.params.logisticProvinceEntityIdList = vm.params.logisticProvinceEntityList.map(
      //     item => item.provinceId
      //   )
      //   vm.selectData = vm.$clone(vm.params.logisticProvinceEntityList)
      //   storage.set(
      //     'local',
      //     `${backShow}paramsArr`,
      //     vm.$clone(vm.params.logisticProvinceEntityList)
      //   )
      // } else if (!obj[0]) {
      //   vm.pageNo = 1
      // }
      // let { countryId } = vm.params
      // let params = {
      //   sortOrder: 'asc',
      //   pageSize: vm.pageSize,
      //   pageNumber: vm.pageNo,
      //   countryId
      // }
      // if (type) {
      //   let form = JSON.parse(JSON.stringify(vm.form))
      //   params = Object.assign({}, params, form)
      // }

      // vm.getData('ebayNoTransportRegionProvinceEditList', params, res => {
      //   console.log(res)
      //   let { rows = [], total = 0, pageSize = 10, pageNo = 1 } = res.data
      //   vm.tableData = rows.map(item => {
      //     //回显
      //     if (
      //       vm.selectData &&
      //       vm.selectData.find(el => el.provinceId == item.provinceId)
      //     ) {
      //       vm.$refs['table'].toggleRowSelection(item)
      //     }
      //     return item
      //   })
      //   vm.total = total
      //   vm.pageSize = pageSize
      //   vm.pageNo = pageNo
      // })
    },
    resetForm() {
      this.tableData = []
    },
    $clone(val) {
      return JSON.parse(JSON.stringify(val))
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
