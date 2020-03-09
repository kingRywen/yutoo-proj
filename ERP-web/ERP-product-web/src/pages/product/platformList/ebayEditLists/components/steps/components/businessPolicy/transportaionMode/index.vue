<template>
  <div class="transportaion-mode">
    <div class="mb20"></div>
    <el-form :disabled="review" ref="form" :model="data" :rules="rules" size="small" label-width="100px">
      <section>
        <ElFormItem label="选择模板:">
          <ElSelect v-model="data.ebayTransportTypeInfoId" placeholder class="normal-input" @change="tempChange">
            <!-- <ElOption v-for="" :key=""></ElOption> -->
            <ElOption v-for="item in tempList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="运输类型:" prop="transportType">
          <ElRadioGroup v-model="data.transportType">
            <ElRadio :label="1">普通</ElRadio>
            <ElRadio :label="2">免运费（选中的话，所有的运费会设置为0）</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="处理时间:" prop="handleTime">
          <ElSelect v-model="data.handleTime" placeholder class="normal-input">
            <!-- <ElOption v-for="" :key=""></ElOption> -->
            <ElOption label="1 business day" :value="1"></ElOption>
            <ElOption label="2 business days" :value="2"></ElOption>
            <ElOption label="3 business days" :value="3"></ElOption>
            <ElOption label="4 business days" :value="4"></ElOption>
            <ElOption label="5 business days" :value="5"></ElOption>
            <ElOption label="10 business days" :value="10"></ElOption>
            <ElOption label="15 business days" :value="15"></ElOption>
            <ElOption label="20 business days" :value="20"></ElOption>
            <ElOption label="30 business days" :value="30"></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="物品所在国家:" prop="goodsHostCountryId">
          <ElSelect v-model="data.goodsHostCountryId" @change="clearData" placeholder class="normal-input">
            <!-- <ElOption v-for="" :key="" countries></ElOption> -->
            <ElOption v-for="item in countries" :key="item.value" :label="item.label" :value="item.value"></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="物品所在地:" v-if="data.goodsHostCountryId">
          <ElSelect v-model="data.goodsLocationId" placeholder class="normal-input">
            <!-- <ElOption v-for="" :key=""></ElOption> -->
            <ElOption v-for="item in cities" :key="item.provinceId" :label="item.provinceName" :value="item.provinceId"></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="仓库:" prop="warehouseId">
          <ElSelect v-model="data.warehouseId" placeholder class="normal-input">
            <!-- <ElOption v-for="" :key=""></ElOption> -->
            <ElOption v-for="item in warehouses" :key="item.value" :label="item.label" :value="item.value"></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="邮编:">
          <ElInput v-model="data.postcode" class="normal-input"></ElInput>
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="data.expressActivationFlag">快递寄货</el-checkbox>
        </ElFormItem>
      </section>
      <!-- 国内运输方式 -->
      <section>
        <ElRow>
          <ElCol :span="24">
            <h3 style="margin: 20px 0">国内运输方式</h3>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <ElButton :disabled="review" type="primary" size="small" @click="handlAdd(1)">添加</ElButton>
            <ElButton :disabled="review" type="primary" size="small" @click="handleDelete(null,null,1)">删除</ElButton>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <yt-table
              border
              :columns="inlandColumns"
              :data="data.domesticPermitTransportAreaList"
              @selectChange="val => selectData1 = val"
            >
              <template slot="right" v-if="!review">
                <el-table-column label="操作" align="center" width="100px">
                  <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
                      <i @click="handleEdit(scope.$index,scope.row,1)" class="el-icon-edit iconBtn"/>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top" :open-delay="500">
                      <i @click="handleDelete(scope.$index,scope.row,1)" class="el-icon-delete iconBtn"/>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </template>
            </yt-table>
          </ElCol>
        </ElRow>
      </section>
      <!-- 国际运输方式 -->
      <section>
        <ElRow>
          <ElCol :span="24"><h3 style="margin: 20px 0">国际运输方式</h3></ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <ElButton :disabled="review" type="primary" size="small" @click="handlAdd(2)">添加</ElButton>
            <ElButton :disabled="review" type="primary" size="small" @click="handleDelete(null,null,2)">删除</ElButton>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <yt-table
              border
              :columns="internationalColumns"
              :data="data.foreignPermitTransportAreaList"
              @selectChange="val => selectData2 = val"
            >
              <template slot="right" v-if="!review">
                <el-table-column label="操作" align="center" width="100px">
                  <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
                      <i @click="handleEdit(scope.$index,scope.row,2)" class="el-icon-edit iconBtn"/>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top" :open-delay="500">
                      <i @click="handleDelete(scope.$index,scope.row,2)" class="el-icon-delete iconBtn"/>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </template>
            </yt-table>
          </ElCol>
        </ElRow>
      </section>
      <!-- 不运输的地区 -->
      <section>
        <ElRow>
          <ElCol :span="24"><h3 style="margin: 20px 0">不运输的地区</h3></ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <ElButton :disabled="review" type="primary" size="small" @click="handlAdd(3)">添加</ElButton>
            <ElButton :disabled="review" type="primary" size="small" @click="handleDelete(null,null,3)">删除</ElButton>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <yt-table border :columns="noColumns" :data="noTransportAreaList" @selectChange="val => selectData3 = val">
              <template slot="right" v-if="!review">
                <el-table-column label="操作" align="center" width="100px">
                  <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
                      <i @click="handleEdit(scope.$index,scope.row,3)" class="el-icon-edit iconBtn"/>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top" :open-delay="500">
                      <i @click="handleDelete(scope.$index,scope.row,3)" class="el-icon-delete iconBtn"/>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </template>
            </yt-table>
          </ElCol>
        </ElRow>
      </section>
    </el-form>
    <dialog-component :platformId="platformId" :countries="countries" :type='selectType' :selectedList="selectedList" ref="dialog"></dialog-component>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode, showToast } from 'common/common'
import dialogComponent from '../../dialogComponent'
import YtTable from '../../table'
import search from '../../search'
import mixins from '../../../mixins'
import tempMixin from '../mixin';
export default {
  mixins: [mixins, tempMixin],
  data() {
    return {
      selectType: null,
      form: {
        remarkLoadListing: 0,
        expressActivationFlag: 0,
        defaultFlag: 0,
        transportTypes: [],
        noTransportRegions: []
      },
      selectedList: [],
      groupCode: 7,
      rules: {
        ebayTransportTypeInfoId: [{ required: true, message: '请选择模板' }],
        transportType: [{ required: true, message: '请选择运输类型' }],
        handleTime: [{ required: true, message: '请选择处理时间' }],
        goodsHostCountryId: [{ required: true, message: '请选择物品所在国家' }],
        goodsLocationId: [{ required: true, message: '请选择物品所在地' }],
        warehouseId: [{ required: true, message: '请选择仓库' }],
        postcode: [{ required: true, message: '请填写邮编' }],
      },
      activeName: 'basicInfomation',
      inlandColumns: [
        {
          label: '运输方式',
          value: 'transportTypeName'
        },
        {
          label: '运费',
          value: 'freight'
        },
        {
          label: '附加费用',
          value: 'additionalCost'
        }
      ],
      internationalColumns: [
        {
          label: '运输国家',
          value: 'allCountryArray'
        },
        {
          label: '运输方式',
          value: 'transportTypeName'
        },
        {
          label: '运费',
          value: 'freight'
        },
        {
          label: '附加费用',
          value: 'additionalCost'
        }
      ],
      noColumns: [
        {
          label: '区域',
          value: 'name'
        },
        {
          label: '国家',
          // render(h, scope) {
          //   let str = ''
          //   if (Array.isArray(scope.row.provinceEntities)) {
          //     str = scope.row.provinceEntities
          //       .map(item => item.provinceName)
          //       .join(',')
          //   } else {
          //     str = '-'
          //   }
          //   return <div>{str}</div>
          // }
          render(h, scope) {
            return <div>{scope.row.country.map(el => el.areaName).join(', ')}</div>
          }
        }
      ],
      inlandData: [],
      foreignPermitTransportAreaList: [],
      noTransportAreaList: [],
      selectData1: [],
      selectData2: [],
      selectData3: [],
      tempList: [],
      countries: [],
      cities: [],
      warehouses: [],
      specialId: 0,
      tempName: 'ebayTransportTypeInfoId',
      tempApi: 'ebayTransportTypeInfo'
    }
  },
  created() {
    this.initData()
    let vm = this
    if (
      vm.data.domesticPermitTransportAreaList &&
      Array.isArray(vm.data.domesticPermitTransportAreaList)
    ) {
      vm.data.domesticPermitTransportAreaList.forEach(element => {
        element.specialId = vm.specialId++
      })
    }
    if (
      vm.data.foreignPermitTransportAreaList &&
      Array.isArray(vm.data.foreignPermitTransportAreaList)
    ) {
      vm.data.foreignPermitTransportAreaList.forEach(element => {
        element.specialId = vm.specialId++
      })
    }
    if (
      vm.data.noTransportAreaList &&
      Array.isArray(vm.data.noTransportAreaList)
    ) {
      vm.data.noTransportAreaList.forEach(element => {
        element.specialId = vm.specialId++
      })
    }

    let unwatch = this.$watch('data.noTransportAreaList', (val) => {
      this.noTransportAreaList = val
      unwatch()
    }, {immediate: true})
    
  },
  watch: {
    'data.ebayTransportTypeInfoId'(val) {
      this.getList()
    },
    'data.goodsHostCountryId'(val) {
      if (val) {
        this.getCities(val)
      }
    },
    // 'data.goodsLocationId'(val) {
    //   if (val) {
    //     this.clearData()
    //     this.getCities(val)
    //   }
    // }
    // 'data.noTransportAreaList'(val) {
    //   this.noTransportAreaList = this.formatData(val)
    // }
  },
  methods: {
    clearData() {
      this.data.goodsLocationId = null
      // this.data.warehouseId = null
      // this.data.postcode = null
    },
    validate() {
      return this.$refs.form.validate().then(() => {
        let noTransportAreaList = []
        this.data.noTransportAreaList.map(el => {
          if (!el.country.length) {
            noTransportAreaList.push({
              regionId: el.supperId
            })
          } else {
            el.country.forEach(element => {
              noTransportAreaList.push({
              regionId: el.supperId,
              countryId: element.areaId
            })
            });
          }
          
        })
        let dataMap = {...this.data}
        dataMap.noTransportAreaList = noTransportAreaList
        this.saveData({ dataMap })
      })
    },
    getCities(countryId) {
      let data = {
        countryId
      }
      fetchData({
        ...apis.logisticProvinceSearchList,
        data
      }).then(res => {
        handlerCode(
          res,
          () => {
            this.cities = res.data.rows
          },
          () => {
            showToast('error', res.data.msg)
          },
          true
        )
      })
    },
    initData() {
      Promise.all([
        this.getData('ebayTransportTypeGetCombobox'),
        this.getData('LOGISTIC_COUNTRY_SEARCH_LIST_EBAY', {}, res =>
          res.data.rows.map(el => ({
            label: el.countryName,
            value: el.countryId
          }))
        ),
        this.getData('warehouseList', { type: 0 }, res =>
          res.data.rows.map(el => ({
            label: el.wmName,
            value: el.wmWarehouseId
          }))
        )
      ])
        .then(res => {
          
          this.tempList = res[0]
          this.countries = res[1]
          this.warehouses = res[2]
          
        })
        .catch(() => {
          showToast('error', '初始化数据失败，请刷新重试')
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
    getList() {
      // let vm = this
      // let params = {
      //   ebayTransportTypeInfoId: vm.data.ebayTransportTypeInfoId
      // }
      // this.getData(
      //   'ebayNoTransportRegionList',
      //   params,
      //   res => (vm.data.noTransportAreaList = res.data.rows)
      // )
      // vm.$api[`order/${url}`](params).then(data => {
      //   if (type == 1) {
      //     vm.form.domesticTransportTypes = data.rows
      //   } else if (type == 2) {
      //     vm.form.internationalTransportTypes = data.rows
      //   } else if (type == 3) {
      //     vm.form.noTransportRegions = data.rows
      //   }
      // })
    },
    formatData(val = []) {
      let data = []
      val = JSON.parse(JSON.stringify(val))
      val.forEach(item => {
        let obj = {}
        if (!item.countryName) {
          console.log(`后端数据国家名为${item.countryName}`)
        }
        if (!data.length) {
          obj.provinceEntities = obj.provinceEntities || []
          obj.provinceList = obj.provinceList || []
          obj.provinceEntities.push(item.provinceName)
          obj.provinceList.push(item)
          obj.countryName = item.countryName
          obj.countryId = item.countryId
          data.push(obj)
        } else {
          if (!data.some(el => el.countryName == item.countryName)) {
            obj.provinceEntities = obj.provinceEntities || []
            obj.provinceEntities.push(item.provinceName)
            obj.countryName = item.countryName
            obj.countryId = item.countryId
            data.push(obj)
          } else {
            data.some(el => {
              if (el.countryName == item.countryName) {
                el.provinceEntities.push(item.provinceName)
              }
            })
          }
        }
      })

      return data.map(item => {
        item.provinceEntities = item.provinceEntities.join(',')
        return item
      })
    },
    dealDubble(data) {
      let obj = {}
      data = JSON.parse(JSON.stringify(data))
      data.forEach((item, index) => {
        item.proviceId = item.provinceId
        obj[item.provinceId] = item
      })
      return Object.values(obj)
    },
    handlAdd(type) {
      this.setList(type)
      let vm = this
      if (type == 3) {
        let ebayTransportTypeInfoId = vm.data.ebayTransportTypeInfoId
        if (!ebayTransportTypeInfoId && ebayTransportTypeInfoId != 0) {
          showToast('warning', '请先选择模板名称')
          return
        }
        vm.$refs.dialog.$dialog({
          title: '添加不运输地区',
          visible: true,
          width: '730px',
          component: () => import('./addNoTransportWay/add'),
          childFn: [
            {
              name: 'getList',
              params: {
                ebayTransportTypeInfoId
              }
            }
          ],
          submitForm(val) {
            // vm.data.noTransportAreaList = vm.dealDubble([
            //   ...vm.data.noTransportAreaList,
            //   ...val.provinces
            // ])
            vm.noTransportAreaList = vm.formatRigionData(vm.data.noTransportAreaList, val.provinces)
          }
        })
      } else if (type == 2) {
        let foreignPermitTransportAreaList = vm.data.foreignPermitTransportAreaList
        vm.$refs.dialog.$dialog({
          title: '添加国际运输方式',
          visible: true,
          width: '400px',
          childFn: [
            {
              name: 'setList',
              params: {
                foreignPermitTransportAreaList
              }
            }
          ],
          component: () => import('./addTransWay.vue'),
          submitForm(data) {
            data.specialId = vm.specialId++
            vm.data.foreignPermitTransportAreaList.push({ ...data })
          }
        })
      } else {
        vm.$refs.dialog.$dialog({
          title: '添加国内运输方式',
          visible: true,
          width: '400px',
          component: () => import('./addTransWay.vue'),
          submitForm(data) {
            data.specialId = vm.specialId++
            vm.data.domesticPermitTransportAreaList.push({ ...data })
          }
        })
      }
    },
    setList(type) {
      this.selectType = type
      if (type == 1) {
        
        this.selectedList = this.data.domesticPermitTransportAreaList
      }
      if (type == 2) {
        this.selectedList = this.data.foreignPermitTransportAreaList
      }
      if (type == 3) {
        this.selectedList = this.data.noTransportAreaList
      }
    },
    handleEdit(index, row, type) {
      this.setList(type)
      let vm = this
      if (type == 3) {
        let countryId = row.countryId
        let logisticProvinceEntityList = vm.data.noTransportAreaList
        vm.$refs.dialog.$dialog({
          title: '编辑不运输地区',
          visible: true,
          width: '730px',
          component: () => import('./addNoTransportWay/edit'),
          submitForm(val) {
            // vm.data.noTransportAreaList = vm.dealDubble([
            //   ...vm.data.noTransportAreaList,
            //   ...val.provinces
            // ])
            // vm.noTransportAreaList = vm.formatData(vm.data.noTransportAreaList)
            vm.noTransportAreaList = vm.formatRigionData(vm.data.noTransportAreaList, val.provinces)
          },
          childFn: [
            {
              name: 'getList',
              params: {
                row
              }
            }
          ]
        })
      } else {
        vm.$refs.dialog.$dialog({
          title: '添加运输方式',
          visible: true,
          width: '400px',
          component: () => import('./addTransWay.vue'),
          submitForm(data) {
            if (type == 1) {
              vm.data.domesticPermitTransportAreaList.splice(index, 1, data)
            } else {
              vm.data.foreignPermitTransportAreaList.splice(index, 1, data)
            }
          },
          childFn: [
            {
              name: 'edit',
              params: {
                row
              }
            }
          ]
        })
      }
    },

    formatRigionData(has, add) {
      
      add.forEach(el =>{
        let region
        if (el.chiledList != null) {
          region = has.find(_el => _el.supperId === el.supperId)
          if (region) {
            region.country = []
            // let index = has.findIndex(_el => _el.supperId === el.supperId)
            // has.splice(index, 1, el)
            return
          }
          has.push({
            name: el.supperName,
            country: [],
            supperId: el.supperId
          })
        } else {
          region = has.find(_el => _el.name === el.parentName)
          // 国家
          if (region) {
            if (!region.country.find(__el => __el.name === el.name)) {
              region.country.push(el)
            }
            
          } else {
            region = {
              name: el.parentName,
              supperId: el.parentId
            }
            region.country = [el]
            has.push(region)
          }
        }
      })

      return has
    },
    handleDelete(index, row, type) {
      let vm = this
      let ids = []
      let name = ''
      if (type == 1) {
        name = 'domesticPermitTransportAreaList'
      } else if (type == 2) {
        name = 'foreignPermitTransportAreaList'
      } else {
        name = 'noTransportAreaList'
      }
      if (!row) {
        if (!vm[`selectData${type}`].length) {
          showToast('warning', '请先选择一项')
          return
        }
        vm[`selectData${type}`].map(item => {
          if (type == 3) {
            vm.data[name] = vm.data[name].filter(
              el => el.regionId != item.regionId
            )
            // vm[name] = vm.data[name]
          } else {
            vm.data[name] = vm.data[name].filter(
              el => el.transportType != item.transportType
            )
            return
          }
        })
      } else {
        vm.data[name].splice(index, 1)
        // if (type == 3) {
        //   // vm.data[name] = vm.data[name].filter(
        //   //   el => el.countryName != row.countryName
        //   // )
        //   // vm[name] = vm.formatData(vm.data.noTransportAreaList)
        // } else {
        //   vm.data[name].splice(index, 1)
        // }
      }
    }
  },
  components: {
    dialogComponent,
    YtTable,
    search
  }
}
</script>

<style lang='scss'>
.transportaion-mode {
  background: #fff;
  .normal-input {
    width: 450px;
  }
}
</style>