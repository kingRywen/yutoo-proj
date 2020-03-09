<template>
  <div>
    <div class="custom_box_form">
      <h2 class="title">
        基本信息
        <el-button type="text" icon="el-icon-back" @click="cancel">返回</el-button>
      </h2>
      <div class="box_form">
        <!-- 基本信息 -->
        <SimpleForm :fields="baseInfoFields" :form-data.sync="baseInfoForm" label-width="110px" ref="baseInfoForm"/>
      </div>
    </div>
    <!-- eslint-disable -->
    <template v-for="(rule, index) in allRules">
      <div class="custom_box_form">
        <h2 class="title">规则配置</h2>
        <div class="box_form">
          <!-- 基本信息 -->
          <h3>产品侵权物流属性</h3>
          <SimpleForm :fields="transFields" :form-data.sync="rule" label-width="110px" ref="transForm"/>
          <h3>
            条件配置
            <el-button icon="el-icon-plus" @click="handleConditionAdd(rule)" class="add_condition"></el-button>
          </h3>
          <div
            class="box"
            :class="{'box-is-error': errorIndex.indexOf(''+index+conIndex) > -1}"
            v-for="(condition, conIndex) in rule.conditions"
          >
            <conditions-form
              :form-data="condition"
              :is-error="errorIndex.indexOf(''+index+conIndex) > -1"
              @update="val => rule.conditions.splice(conIndex, 1, val)"
              ref="conditionsForm"
            />
            <span v-if="conIndex !== 0" class="delete" @click="handleConditionMinus(rule.conditions, conIndex)"></span>
          </div>
        </div>

        <span v-if="index !== 0" class="outerDelete" @click="handleMinus(index)"></span>
      </div>
      <el-button v-if="index === allRules.length-1" icon="el-icon-plus" @click="handleAdd(index)" class="mb20"></el-button>
    </template>

    <div class="mb20">
      <el-checkbox label="是否激活" v-model="state" :true-label="1" :false-label="0"></el-checkbox>
      <!-- <el-c v-model="state">是否激活</el-c> -->
    </div>

    <div class="mb20">
      <el-button type="primary" size="small" @click="save" :loading="loading">保存</el-button>
      <el-button type="default" size="small" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions } from 'vuex'
import ConditionsForm from './components/ConditionsForm'
import storage from 'Utils/saver'
import _isEqual from 'lodash/isEqual'

export default {
  name: 'orderFormStrategy-add',
  components: {
    ConditionsForm
  },
  data() {
    return {
      flag: true,
      allStores: [],
      errorIndex: [],
      loading: false,
      state: 0,
      baseInfoForm: {},
      transForm: {},
      allRules: [
        {
          riskType: undefined,
          logisticType: undefined,
          conditions: [
            {
              orderState: undefined,
              expand: {}
            }
          ]
        }
      ]
    }
  },
  created() {
    let id = this.$route.query.orderStrategyDeliveryId
    this.initData()
    if (id != null) {
      this.getEditData(id)
    }
  },
  methods: {
    ...mapActions('common', [
      'initCountryList',
      'initTransportTypeList',
      'getWarehouseList',
      'getAllShopList',
      'getEnumList'
    ]),
    handleAdd() {
      this.allRules.push({
        riskType: undefined,
        logisticType: undefined,
        conditions: [
          {
            orderState: undefined,
            expand: {}
          }
        ]
      })
    },
    handleMinus(index) {
      this.allRules.splice(index, 1)
    },
    handleConditionAdd(rule) {
      rule.conditions.push({
        orderState: undefined,
        expand: {}
      })
    },
    handleConditionMinus(conditions, index) {
      conditions.splice(index, 1)
    },
    initData() {
      this.getAllShopList()
      this.getWarehouseList()
      this.initCountryList()
      this.initCountryList()
      this.getEnumList(2)
      this.getEnumList(8)
    },
    // 获取编辑数据
    getEditData(orderStrategyDeliveryId) {
      let vm = this
      this.flag = false
      vm.$api['order/strategyDeliveryInfo']({ orderStrategyDeliveryId })
        .then(data => {
          // 处理数据
          let {
            startTime,
            endTime,
            createOrderReason,
            orderStrategyDeliveryId,
            priority,
            remark,
            sourceCountry,
            sourcePlatform,
            sourceStore,
            sourceWarehouse,
            state,
            strategyName,
            rules
          } = data.rows
          vm.state = +state
          // 基本信息
          vm.baseInfoForm = {
            time: [startTime, endTime],
            orderStrategyDeliveryId,
            strategyName,
            createOrderReason: createOrderReason || [],
            priority,
            remark,
            sourcePlatform: sourcePlatform.split(',').map(el => +el),
            sourceCountry: sourceCountry.split(',').map(el => +el),
            sourceWarehouse: sourceWarehouse.split(',').map(el => +el),
            sourceStore: sourceStore.split(',').map(el => +el)
          }
          // 规则
          rules.forEach(rule => {
            for (const key in rule) {
              let arr = ['riskType', 'logisticType']
              if (rule.hasOwnProperty(key)) {
                const _rule = rule[key]
                if (arr.indexOf(key) > -1 && _rule) {
                  rule[key] = _rule.split(',')
                } else {
                  if (!_rule.length) {
                    rule[key] = [
                      {
                        orderState: undefined,
                        expand: {}
                      }
                    ]
                  } else {
                    // 处理conditions
                    let arr = ['productPlugSpec', 'createOrderReason']
                    let arrString = [
                      'logisticTypeNonContain',
                      'riskTypeNonContain',
                      'riskTypeContain',
                      'logisticTypeContain'
                    ]
                    _rule.forEach(condition => {
                      for (const key in condition) {
                        if (condition.hasOwnProperty(key)) {
                          const element = condition[key]
                          if (key === 'expand') {
                            for (const k in element) {
                              if (element.hasOwnProperty(k)) {
                                const _expand = element[k]

                                if (_expand) {
                                  if (arr.indexOf(k) > -1) {
                                    element[k] = _expand
                                      .split(',')
                                      .map(el => +el)
                                  }
                                  if (arrString.indexOf(k) > -1) {
                                    element[k] = _expand.split(',')
                                  }
                                }
                                // 把区间值拼起来
                                // if (key.indexOf('start') > -1) {
                                //   let str = key.replace('start', '')
                                //   let endStr = 'end' + str
                                //   let _start = _expand
                                //   let _end = element[endStr]
                                //   let priceTypeStr = this.$.firstLower(str) + 'CurrencyType'

                                //   if (_expand != null) {
                                //     element[this.$.firstLower(str)] = [_start, _end]
                                //   }

                                //   if (element[priceTypeStr]) {

                                //   }

                                //   delete element[key]
                                //   delete element[endStr]
                                // }
                              }
                            }
                          }
                        }
                      }
                    })
                  }
                }
              }
            }
          })
          this.allRules = rules
          this.$nextTick(() => {
            this.oldData = {
              baseInfoForm: JSON.parse(JSON.stringify(this.baseInfoForm)),
              allRules: JSON.parse(JSON.stringify(this.allRules))
            }
            this.flag = true
          })
        })
        .catch(err => {})
    },
    cancel() {
      storage.set('session', 'strategyTabName', 'fifth')
      this.$router.push('/salesManagement/orderCenter/orderFormStrategy')
    },
    setErrorPosition() {
      let firstErrorDom = document.querySelectorAll(
        '.box-is-error, .is-error'
      )[0]
      let appMainDom = document.querySelectorAll('.appMain')[0]
      let bound = firstErrorDom.getBoundingClientRect()
      let appMainDomBound = appMainDom.getBoundingClientRect()
      appMainDom.scrollTop =
        appMainDom.scrollTop + bound.top - bound.height - 200
    },
    // 保存数据
    save() {
      // 验证复制时是否有修改数据，如果没有修改数据禁止提交服务器
      if (
        this.$route.query.copy &&
        _isEqual(this.oldData, {
          allRules: this.allRules,
          baseInfoForm: this.baseInfoForm
        })
      ) {
        this.$message.warning('您复制的策略没有修改参数，请修改后再尝试提交')
        return
      }
      // 验证是否有重复的数据
      if (this.errorIndex.length) {
        this.$message.warning('条件重复，请修改后再提交')
        this.setErrorPosition()
        return
      }

      // 验证必填
      let form = this.$refs.conditionsForm
      Promise.all(form.map(el => el.validate()))
        .then(res => {
          let { baseInfoForm, state, allRules } = this,
            { copy, orderStrategyDeliveryId } = this.$route.query,
            data = {
              state
            },
            rules = [],
            api =
              orderStrategyDeliveryId == null || copy
                ? 'strategyDeliverySave'
                : 'strategyDeliveryUpdate'

          allRules = JSON.parse(JSON.stringify(allRules))

          for (const key in baseInfoForm) {
            if (baseInfoForm.hasOwnProperty(key)) {
              const element = baseInfoForm[key]
              if (Array.isArray(element)) {
                if (key !== 'time') {
                  data[key] = element.join(',')
                } else {
                  data.startTime = element[0]
                  data.endTime = element[1]
                }
              } else {
                data[key] = element
              }
            }
          }

          allRules.forEach(el => {
            let _el = {
              conditions: []
            }
            for (const key in el) {
              if (el.hasOwnProperty(key)) {
                let arrs = ['riskType', 'logisticType']
                const element = el[key]
                if (arrs.indexOf(key) > -1) {
                  _el[key] = element.join(',')
                } else {
                  // conditions:
                  let conditions = []
                  element.forEach(_el => {
                    let __el = {}
                    for (const key in _el) {
                      if (_el.hasOwnProperty(key)) {
                        const _elment = _el[key]
                        if (key !== 'expand') {
                          __el[key] = _elment
                        } else {
                          let expand = {}
                          for (const key in _elment) {
                            if (_elment.hasOwnProperty(key)) {
                              const __elment = _elment[key]
                              expand[key] = Array.isArray(__elment)
                                ? __elment.join(',')
                                : __elment
                            }
                          }
                          __el.expand = expand
                        }
                      }
                    }
                    conditions.push(__el)
                  })
                  _el.conditions = conditions
                }
              }
            }
            rules.push(_el)
          })

          data.rules = rules
          data.orderStrategyDeliveryId = orderStrategyDeliveryId
          this.loading = true
          this.$api[`order/${api}`](data)
            .then(data => {
              this.loading = false
              storage.set('session', 'strategyTabName', 'fifth')
              this.$router.push({
                path: '/salesManagement/orderCenter/orderFormStrategy'
              })
            })
            .catch(err => {
              this.loading = false
            })
        })
        .catch(err => {
          this.$nextTick(() => {
            this.setErrorPosition()
          })
        })
    }
  },
  watch: {
    platformList(val) {
      let stores = []
      this.baseInfoForm.sourcePlatform.forEach(el => {
        let plat = val.find(_el => _el.platformId === el)
        if (plat) {
          stores.push(...plat.stores)
        }
      })
      this.allStores = stores
    },
    'baseInfoForm.sourcePlatform'(val) {
      let list = this.platformList
      let stores = [],
        vm = this
      if (!list) {
        return
      }
      if (!val) {
        return
      }
      if (!val.length) {
        return
      }
      val.forEach(el => {
        let plat = list.find(_el => _el.platformId === el)
        if (plat) {
          stores.push(...plat.stores)
        }
      })

      if (vm.flag) {
        let source = []
        vm.baseInfoForm.sourceStore.forEach(el => {
          if (stores.find(_el => _el.platformId === el)) {
            source.push(el)
          }
        })
        vm.baseInfoForm.sourceStore = source
      }

      this.allStores = stores
    },
    allRules: {
      deep: true,
      handler(allRules) {
        let ret = []
        allRules.forEach((el, index) => {
          let conditions = el.conditions
          conditions.forEach((con, cindex) => {
            let curCon = {}
            for (const key in con) {
              if (con.hasOwnProperty(key)) {
                const element = con[key]
                if (
                  (element != null && this.$.dataType(element) !== 'Array') ||
                  (this.$.dataType(element) === 'Array' && element.length)
                ) {
                  curCon[key] = element
                }
              }
            }

            let compareEl = conditions.find(_con => {
              let _cur = {}
              for (const key in _con) {
                if (_con.hasOwnProperty(key)) {
                  const element = _con[key]
                  if (
                    (element != null && this.$.dataType(element) !== 'Array') ||
                    (this.$.dataType(element) === 'Array' && element.length)
                  ) {
                    _cur[key] = element
                  }
                }
              }

              return con !== _con && _isEqual(_cur, curCon)
            })

            if (compareEl) {
              ret.push('' + index + cindex)
            }
          })
        })

        this.errorIndex = ret
      }
    }
  },
  computed: {
    ...mapState('common', [
      // 'reasonsForNewOrders',
      // 'currencyType',

      'warehouseList', // 所有仓库
      // 'paymentMethod',
      // 'transportTypeList',
      'countryList', // 国家
      'allShopList', //所有店铺
      'platformList', // 所有平台
      'riskTypeList', // 侵权
      'logisticTypeList', // 物流
      'deadweightTransportTypeList', //重货
      'throwTransportTypeList' //抛货
    ]),
    baseInfoFields() {
      let vm = this
      return [
        {
          label: '策略名称',
          name: 'strategyName',
          required: true,
          span: 6
        },
        {
          label: '有效期',
          name: 'time',
          type: 'datetimerange',
          required: true,
          // format: 'yyyy-MM-dd',
          span: 7
        },
        {
          label: '优先级',
          name: 'priority',
          type: 'select',
          required: true,
          span: 5,
          options: [
            { label: 1, value: 1 },
            { label: 2, value: 2 },
            { label: 3, value: 3 },
            { label: 4, value: 4 },
            { label: 5, value: 5 },
            { label: 6, value: 6 },
            { label: 7, value: 7 },
            { label: 8, value: 8 },
            { label: 9, value: 9 },
            { label: 10, value: 10 }
          ]
        },
        {
          label: '备注',
          name: 'remark',
          span: 6
        },
        {
          label: '订单来源平台',
          name: 'sourcePlatform',
          required: true,
          type: 'select',
          multi: true,
          options: vm.platformList,
          bind: {
            label: 'name',
            value: 'platformId'
          },
          span: 6
        },
        {
          label: '订单国家',
          name: 'sourceCountry',
          type: 'select',
          multi: true,
          options: vm.countryList,
          required: true,
          span: 7
        },
        {
          label: '发货仓库',
          name: 'sourceWarehouse',
          type: 'select',
          multi: true,
          bind: {
            label: 'warehouseName',
            value: 'warehouseId'
          },
          options: vm.warehouseList,
          required: true,
          span: 5
        },
        {
          label: '订单来源店铺',
          name: 'sourceStore',
          bind: {
            label: 'name',
            value: 'storeId'
          },
          type: 'select',
          multi: true,
          options: vm.allStores,
          span: 6
        }
      ]
    },
    transFields() {
      let vm = this
      return [
        {
          label: '产品侵权风险',
          name: 'riskType',
          required: true,
          multi: true,
          type: 'select',
          options: vm.riskTypeList.map(el => ({
            label: el.label,
            value: el.value
          })),
          span: 12
        },
        {
          label: '产品物流属性',
          name: 'logisticType',
          required: true,
          multi: true,
          type: 'select',
          options: vm.logisticTypeList.map(el => ({
            label: el.label,
            value: el.value
          })),
          span: 12
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.custom_box_form {
  position: relative;
  .box {
    position: relative;
    border-radius: 5px;
    transition: all 0.25s ease;
    margin-bottom: 18px;
    overflow: hidden;
    .delete {
      position: absolute;
      width: 16px;
      height: 16px;
      right: 0;
      top: 0;
      cursor: pointer;
      background: url('./delete.png');
      background-size: cover;
    }
  }
  .outerDelete {
    position: absolute;
    width: 24px;
    height: 24px;
    right: 0;
    top: 0;
    cursor: pointer;
    background: url('./delete.png');
    background-size: cover;
  }
}
</style>
<style lang="scss">
.add_condition.el-button {
  padding: 4px;
  border-radius: 0;
  border: 1px solid #0e80d2;
  color: #0e80d2;
  font-weight: bolder;
}
</style>