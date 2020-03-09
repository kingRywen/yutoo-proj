<template>
  <div class="add-transport">
    <el-tabs v-model="activeName" type="card" :before-leave="beforeLeave" @tab-click="handleClick" class="tabs">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name="basicInfomation">
        <div class="mb20"></div>
        <el-form ref="form" :disabled="disabled" :model="form" :rules="rules" size="small" label-width="100px">
          <ElFormItem label="模板名称:" prop="templateName">
            <ElInput v-model="form.templateName" class="normal-input"></ElInput>
          </ElFormItem>
          <ElFormItem label="站点:" prop="siteId">
            <ElSelect v-model="form.siteId" placeholder class="normal-input">
              <ElOption v-for="(item,index) in siteList" :label="item.label" :value="item.value" :key="index"></ElOption>
              <!-- <ElOption v-for="" :key=""></ElOption> -->
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="来源店铺:" prop="storeId">
            <el-cascader :options="ebayStoreList" v-model="form.storeId" class="normal-input"></el-cascader>
          </ElFormItem>
          <ElFormItem label="运输类型:" prop="transportType">
            <el-radio v-model="form.transportType" :label="1">普通</el-radio>
            <el-radio v-model="form.transportType" :label="2">免运费</el-radio>（选中的话，所有的运费会设置为0）
          </ElFormItem>
          <ElFormItem label="处理时间:" prop="handleTime">
            <ElSelect v-model="form.handleTime" placeholder class="normal-input">
              <!-- <ElOption v-for="(item,index) in dataList" :label="item.label" :value="item.value" :key="index"></ElOption> -->
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
            <ElSelect v-model="form.goodsHostCountryId" placeholder class="normal-input">
              <ElOption
                v-for="(item,index) in logisticCountrySearchList"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></ElOption>
              <!-- <ElOption v-for="" :key=""></ElOption> -->
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="物品所在地:" prop="goodsLocationId">
            <ElSelect v-model="form.goodsLocationId" placeholder="请先选择所在国家" class="normal-input">
              <ElOption
                v-for="(item,index) in logisticProvinceSearchList"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></ElOption>
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="仓库:" prop="warehouseId">
            <ElSelect v-model="form.warehouseId" placeholder class="normal-input">
              <!-- <ElOption v-for="" :key=""></ElOption> -->
              <ElOption v-for="(item,index) in warehouseList" :label="item.label" :value="item.value" :key="index"></ElOption>
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="邮编:" prop="postcode">
            <ElInput v-model="form.postcode" class="normal-input"></ElInput>
          </ElFormItem>
          <ElFormItem label="付款说明:" prop="remark">
            <ElInput type="textarea" v-model="form.remark" class="normal-input"></ElInput>
          </ElFormItem>
          <ElFormItem prop="value">
            <el-checkbox :true-label="1" :false-label="0" v-model="form.expressActivationFlag">快递寄货</el-checkbox>
            <el-checkbox :true-label="1" :false-label="0" v-model="form.defaultFlag">默认模板</el-checkbox>
            <el-checkbox :true-label="1" :false-label="0" v-model="form.remarkLoadListing">加载运输描述到listing描述中</el-checkbox>
          </ElFormItem>
        </el-form>
      </el-tab-pane>
      <!-- 国内运输方式 -->
      <el-tab-pane label="国内运输方式" :disabled="tabDisabled" name="inlandTransport">
        <ElRow>
          <ElCol :span="24" class="martop" v-if="!disabled">
            <ElButton type="primary" size="small" @click="handlAdd(1)">添加</ElButton>
            <ElButton type="primary" size="small" @click="handleDelete(null,null,1)">删除</ElButton>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <yt-table
              :columns="inlandColumns"
              :data="form.domesticTransportTypes"
              @selectChange="val => selectData = val"
              ref="table1"
            >
              <template v-if="!disabled" slot="right">
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
      </el-tab-pane>
      <!-- 国际运输方式 -->
      <el-tab-pane label="国际运输方式" :disabled="tabDisabled" name="internationalTransport">
        <ElRow>
          <ElCol :span="24" v-if="!disabled" class="martop">
            <ElButton type="primary" size="small" @click="handlAdd(2)">添加</ElButton>
            <ElButton type="primary" size="small" @click="handleDelete(null,null,2)">删除</ElButton>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <yt-table
              :columns="internationalColumns"
              :data="form.internationalTransportTypes"
              @selectChange="val => selectData = val"
              ref="table2"
            >
              <template v-if="!disabled" slot="right">
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
      </el-tab-pane>
      <!-- 不运输的地区 -->
      <el-tab-pane label="不运输的地区" :disabled="tabDisabled" name="noTransport">
        <ElRow>
          <ElCol :span="24" v-if="!disabled" class="martop">
            <ElButton type="primary" size="small" @click="handlAdd(3)">添加</ElButton>
            <ElButton type="primary" size="small" @click="handleDelete(null,null,3)">删除</ElButton>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24" class="martop">
            <yt-table
              :columns="noColumns"
              :data="form.noTransportRegions"
              @selectChange="val => selectData = val"
              ref="table3"
            >
              <template v-if="!disabled" slot="right">
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
      </el-tab-pane>
    </el-tabs>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { edit } from '../mixin.js'
export default {
  mixins: [edit],
  data() {
    let vm = this
    return {
      rules: vm.$formValidate([
        {
          label: '模板名称',
          value: 'templateName'
        },
        {
          label: '站点',
          value: 'siteId'
        },
        {
          label: '来源店铺',
          value: 'storeId'
        },
        {
          label: '运输类型',
          value: 'transportType'
        },
        {
          label: '处理时间',
          value: 'handleTime'
        },
        {
          label: '物品所在国家',
          value: 'goodsHostCountryId'
        },
        {
          label: '物品所在地',
          value: 'goodsLocationId'
        },
        {
          label: '仓库',
          value: 'warehouseId'
        },
        {
          label: '仓库',
          value: 'warehouseId'
        }
      ]),
      form: {
        remarkLoadListing: 0,
        expressActivationFlag: 0,
        defaultFlag: 0,
        domesticTransportTypes: [],
        internationalTransportTypes: [],
        noTransportRegions: []
      },
      tabDisabled: false,

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
          label: '运输方式',
          value: 'transportTypeName'
        },
        {
          label: '运费',
          value: 'freight'
        },
        {
          label: '国家',
          width: 140,
          render(h, scope) {
            console.log(scope)
            if (Array.isArray(scope.row.countryName)) {
              return <div>{scope.row.countryName.join(',') || '-'}</div>
            } else {
              return <div>-</div>
            }
          }
        },
        {
          label: '附加费用',
          value: 'additionalCost'
        }
      ],
      noColumns: [
        {
          label: '国家',
          value: 'countryName'
        },
        {
          label: '省',
          render(h, scope) {
            let str = ''
            if (Array.isArray(scope.row.provinceEntities)) {
              str = scope.row.provinceEntities
                .map(item => item.provinceName)
                .join(',')
            } else {
              str = '-'
            }
            return <div>{str}</div>
          }
        }
      ],
      selectData: [],
      logisticProvinceSearchList: [],
      beforeLeave() {
        vm.selectData = []
        if (vm.baseInfoId != null) {
          return Promise.resolve()
        }
        let _data = vm.$clone(vm.form)
        if (
          _data.storeId &&
          Array.isArray(_data.storeId) &&
          _data.storeId.length == 2
        ) {
          _data.storeId = vm.getIdTree(_data.storeId)
        }
        return vm.$api[`order/transportTypeSave`](_data).then(data => {
          vm.baseInfoId = data.id
          return Promise.resolve()
        })
      },
      baseInfoId: null,
      tabChangeFlag: false
    }
  },
  created() {
    this.getLogisticCountrySearchList()
    this.getWarehouseList()
  },
  watch: {
    async 'form.goodsHostCountryId'(val) {
      let vm = this
      if (val || val == 0) {
        await vm.$api[`warehouse/logisticProvinceSearchList`]({
          countryId: val
        }).then(({ rows = [] }) => {
          vm.logisticProvinceSearchList = rows.map(item => {
            return {
              label: item.provinceName,
              value: item.provinceId
            }
          })
        })
      }
    }
  },
  computed: {
    ...mapState('common', [
      'siteList',
      'logisticCountrySearchList',
      'warehouseList'
    ]),
    dataList: {
      get() {
        let arr = []
        for (let index = 0; index < 41; index++) {
          arr[index] = {
            label: `${index} Days`,
            value: index
          }
        }
        arr[0].label = '0 Day'
        arr[1].label = '1 Day'
        return arr
      },
      set() {}
    }
  },

  mounted() {},
  methods: {
    ...mapActions('common', [
      'getLogisticCountrySearchList',
      'getWarehouseList'
    ]),
    handleClick() {
      let vm = this
      vm.selectData = []
    },
    handlAdd(type) {
      let vm = this
      let title = ''
      if (type == 3) {
        title = '添加不运输地区'
        vm.$refs.dialog.$dialog({
          title,
          visible: true,
          width: '800px',
          component: () => import('./addNoTransportWay/add.vue'),
          submitForm(data) {
            data.ebayTransportTypeInfoId = vm.baseInfoId
            vm.$api[`order/ebayNoTransportRegionSave`](data).then(() => {
              vm.getList(3)
            })
          },
          childFn: [
            {
              name: 'getList',
              params: {
                ebayTransportTypeInfoId: vm.baseInfoId
              }
            }
          ]
        })
      } else {
        if (type == 1) {
          title = '添加国内运输方式'
        } else {
          title = '添加国际运输方式'
        }
        vm.$refs.dialog.$dialog({
          title,
          visible: true,
          width: '400px',
          component: () => import('./addTransWay.vue'),
          submitForm(data) {
            data.ebayTransportTypeInfoId = vm.baseInfoId
            if (type == 1) {
              data.type = 0
            } else {
              data.type = 1
            }
            vm.$api[`order/ebayTransportTypeTypeSave`](data).then(() => {
              if (type == 1) {
                vm.getList(1)
              } else {
                vm.getList(2)
              }
            })
          }
        })
      }
    },
    handleEdit(index, row, type) {
      let vm = this
      let title = ''
      if (type == 3) {
        let countryId = row.countryId
        let logisticProvinceEntityList = row.provinceEntities
        title = '编辑不运输地区'
        vm.$refs.dialog.$dialog({
          title,
          visible: true,
          width: '630px',
          component: () => import('./addNoTransportWay/edit.vue'),
          submitForm(data) {
            data.ebayTransportTypeInfoId = vm.baseInfoId
            data.ebayNoTransportRegionId = row.ebayNoTransportRegionId
            vm.$api[`order/ebayNoTransportRegionUpdate`](data).then(() => {
              vm.getList(3)
            })
          },
          childFn: [
            {
              name: 'getList',
              params: {
                countryId,
                logisticProvinceEntityList
              }
            }
          ]
        })
      } else {
        if (type == 1) {
          title = '编辑国内运输方式'
        } else if (type == 2) {
          title = '编辑国际运输方式'
        }
        vm.$refs.dialog.$dialog({
          title,
          visible: true,
          width: '400px',
          component: () => import('./addTransWay.vue'),
          submitForm(data) {
            let url = ''
            if (type == 1) {
              url = 'ebayTransportTypeTypeUpdate'
            } else if (type == 2) {
              url = 'ebayTransportTypeTypeUpdate'
            } else if (type == 3) {
              url = 'ebayNoTransportRegionUpdate'
            }
            vm.$api[`order/${url}`](data).then(() => {
              if (type == 1) {
                vm.getList(1)
              } else if (type == 2) {
                vm.getList(2)
              } else if (type == 3) {
                vm.getList(3)
              }
            })
          },
          childFn: [
            {
              name: 'edit',
              params: {
                ebayTransportTypeTypeId: row.ebayTransportTypeTypeId
              }
            }
          ]
        })
      }
    },
    handleDelete(index, row, type) {
      let vm = this
      let params = {}
      let url = ''
      if (!row) {
        if (vm.$editMsg(vm.selectData, false)) {
          return
        }
      }
      if (type == 3) {
        url = 'ebayNoTransportRegionRemove'
        let ebayNoTransportRegionIds = []
        if (!row) {
          ebayNoTransportRegionIds = vm.selectData.map(
            item => item.ebayNoTransportRegionId
          )
        } else {
          ebayNoTransportRegionIds = [row.ebayNoTransportRegionId]
        }
        params = {
          ebayNoTransportRegionIds
        }
      } else {
        url = 'ebayTransportTypeTypeRemove'
        let ebayTransportTypeTypeIds = []
        if (type == 1) {
          if (!row) {
            ebayTransportTypeTypeIds = vm.selectData.map(
              item => item.ebayTransportTypeTypeId
            )
          } else {
            ebayTransportTypeTypeIds = [row.ebayTransportTypeTypeId]
          }
        } else if (type == 2) {
          if (!row) {
            ebayTransportTypeTypeIds = vm.selectData.map(
              item => item.ebayTransportTypeTypeId
            )
          } else {
            ebayTransportTypeTypeIds = [row.ebayTransportTypeTypeId]
          }
        }
        params = {
          ebayTransportTypeTypeIds
        }
      }
      vm.$api[`order/${url}`](params).then(() => {
        if (type == 1) {
          vm.getList(1)
          vm.$refs.table1.clearSelection()
        } else if (type == 2) {
          vm.getList(2)
          vm.$refs.table2.clearSelection()
        } else if (type == 3) {
          vm.getList(3)
          vm.$refs.table3.clearSelection()
        }
      })
    },
    getList(type) {
      let vm = this
      let url = ''
      let params = {
        ebayTransportTypeInfoId: vm.baseInfoId
      }
      if (type == 1) {
        url = 'ebayTransportTypeTypeList'
        params.type = 0
      } else if (type == 2) {
        url = 'ebayTransportTypeTypeList'
        params.type = 1
      } else if (type == 3) {
        url = 'ebayNoTransportRegionList'
      }

      vm.$api[`order/${url}`](params).then(data => {
        if (type == 1) {
          vm.form.domesticTransportTypes = data.rows
        } else if (type == 2) {
          vm.form.internationalTransportTypes = data.rows
        } else if (type == 3) {
          vm.form.noTransportRegions = data.rows
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.add-transport {
  background: #fff;
  .normal-input {
    width: 450px !important;
  }
}
</style>