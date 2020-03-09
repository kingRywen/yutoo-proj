<template>
  <div class="business-common">
    <yt-page
      :url="pageUrl"
      :reserveSelection="reserveSelection"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="selectChange"
      ref="page"
    >
      <template slot="table">
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit iconBtn" @click="handleEditOrder(scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="操作日志" placement="top" :open-delay="500">
              <i class="el-icon-document iconBtn" @click="handleOperatorLog(scope.row)"/>
            </el-tooltip>
            <template v-if="type == 2 || type == 3 || type == 4 || type == 5">
              <el-tooltip effect="dark" content="查看" placement="top" :open-delay="500">
                <i class="el-icon-search iconBtn" @click="handleEditOrder(scope.row,'check')"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="复制添加" placement="top" :open-delay="500">
                <i class="iconfont" @click="handleEditOrder(scope.row,'copy')">&#xe7bc;</i>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </template>
    </yt-page>
    <log-info :params="logParams"></log-info>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// 付款模板
// eslint-disable-next-line
let payMentTabList = [
  {
    label: '站点',
    value: 'siteName',
    width: '180px'
  },
  {
    label: '来源店铺',
    value: 'storeName'
  },
  {
    label: '模板名称',
    value: 'templateName'
  },
  {
    label: 'PayPal账号',
    value: 'paypalId'
  },
  {
    label: 'Autopay',
    value: 'startupStandbyFlag'
  },
  {
    label: '是否默认模板',
    render(h, scope) {
      let defaultFlag = ''
      if (scope.row.defaultFlag == 1) {
        defaultFlag = '是'
      } else {
        defaultFlag = '否'
      }
      return <div>{defaultFlag}</div>
    }
  },
  {
    label: '添加人',
    value: 'creatorName'
  },
  {
    label: '增加日期',
    value: 'createTime',
    width: '150px'
  }
]

// 退货政策
// eslint-disable-next-line
let returnTabList = [
  {
    label: '站点',
    value: 'siteName',
    width: '180px'
  },
  {
    label: '来源店铺',
    value: 'storeName'
  },
  {
    label: '模板名称',
    value: 'templateName'
  },
  {
    label: '模板标签',
    value: 'templateLabelName'
  },
  {
    label: '添加人',
    value: 'creatorName'
  },
  {
    label: '添加日期',
    value: 'createTime',
    width: '150px'
  },
  {
    label: '是否默认模板',
    render(h, scope) {
      let defaultFlag = ''
      if (scope.row.defaultFlag == 1) {
        defaultFlag = '是'
      } else {
        defaultFlag = '否'
      }
      return <div>{defaultFlag}</div>
    }
  }
]

//买家条件，运输方式，刊登偏好
// eslint-disable-next-line
let commonTabList = [
  {
    label: '站点',
    value: 'siteName',
    width: '180px'
  },
  {
    label: '来源店铺',
    value: 'storeName'
  },
  {
    label: '模板名称',
    value: 'templateName'
  },
  {
    label: '添加人',
    value: 'creatorName'
  },
  {
    label: '添加日期',
    value: 'createTime',
    width: '150px'
  },
  {
    label: '是否默认模板',
    render(h, scope) {
      let defaultFlag = ''
      if (scope.row.defaultFlag == 1) {
        defaultFlag = '是'
      } else {
        defaultFlag = '否'
      }
      return <div>{defaultFlag}</div>
    }
  }
]

export default {
  props: {
    type: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    let vm = this
    return {
      reserveSelection: '',
      logParams: {
        url: '',
        info: {},
        visible: true
      },
      searchData(val) {
        if ((val.storeId || val.storeId == 0) && val.storeId.length) {
          val.storeId = val.storeId[1]
        }
        return val
      },
      btnConfig: [
        {
          name: '添加',
          fn: () => {
            let params = {}
            if (vm.type == 1) {
              params = {
                title: '添加付款模板',
                visible: true,
                width: '540px',
                component: () => import('./addPayment.vue')
              }
            } else if (vm.type == 2) {
              params = {
                title: '添加退货政策',
                visible: true,
                width: '540px',
                component: () => import('./addReturn.vue')
              }
            } else if (vm.type == 3) {
              params = {
                title: '添加买家条件',
                visible: true,
                width: '640px',
                component: () => import('./addCondition.vue')
              }
            } else if (vm.type == 4) {
              params = {
                title: '添加运输方式',
                visible: true,
                width: '640px',
                component: () => import('./addTransport/index.vue')
              }
            } else {
              params = {
                title: '添加刊登偏好',
                visible: true,
                width: '540px',
                component: () => import('./addPublish.vue')
              }
            }
            vm.$refs.page.$dialog(params)
          }
        },
        {
          name: '删除',
          fn: () => {
            let url = ''
            let type = vm.type
            let params = {}
            if (vm.$editMsg(vm.selectData, false)) {
              return
            }
            if (type == 1) {
              url = 'paymentTemplateRemove'
              let ebayPaymentTemplateIds = vm.selectData.map(
                item => item.ebayPaymentTemplateId
              )
              params = { ...params, ebayPaymentTemplateIds }
            } else if (type == 2) {
              url = 'returnPolicyRemove'
              let ebayReturnPolicyIds = vm.selectData.map(
                item => item.ebayReturnPolicyId
              )
              params = { ...params, ebayReturnPolicyIds }
            } else if (type == 3) {
              url = 'buyersConditionsRemove'
              let ebayBuyersConditionsIds = vm.selectData.map(
                item => item.ebayBuyersConditionsId
              )
              params = { ...params, ebayBuyersConditionsIds }
            } else if (type == 4) {
              url = 'transportTypeRemove'
              let ebayTransportTypeInfoIds = vm.selectData.map(
                item => item.ebayTransportTypeInfoId
              )

              params = { ...params, ebayTransportTypeInfoIds }
            } else {
              url = 'publishPreferenceGetRemove'
              let ebayPublishPreferenceIds = vm.selectData.map(
                item => item.ebayPublishPreferenceId
              )
              params = { ...params, ebayPublishPreferenceIds }
            }
            vm.$api[`order/${url}`](params).then(() => {
              vm.$refs['page'].getList('search')
              this.$refs.page.clearSelection()
            })
          }
        }
      ],
      searchConfig: [
        {
          label: '站点:',
          value: 'siteId',
          placeholder: '',
          type: 'select',
          children: []
        },
        {
          label: '订单来源店铺:',
          value: 'storeId',
          placeholder: '',
          type: 'cascader',
          children: []
        },
        {
          label: '',
          value: 'defaultFlag',
          placeholder: '是否默认模板',
          type: 'select',
          children: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        },
        {
          label: '模板名称',
          value: 'templateName',
          placeholder: '',
          type: 'input'
        }
      ],
      tableConfig: [],
      selectData: [],
      pageUrl: ''
    }
  },
  created() {
    let vm = this
    vm.getAllShopList()
    vm.getSiteList(2)
    if (this.type == 1) {
      vm.tableConfig = payMentTabList
      vm.reserveSelection = 'ebayPaymentTemplateId'
      vm.pageUrl = 'order/paymentTemplateList'
    } else if (vm.type == 2) {
      vm.reserveSelection = 'ebayReturnPolicyId'
      vm.tableConfig = returnTabList
      vm.pageUrl = 'order/returnPolicyList'
    } else if (vm.type == 3) {
      vm.reserveSelection = 'ebayBuyersConditionsId'
      vm.tableConfig = commonTabList
      vm.pageUrl = 'order/buyersConditionsList'
    } else if (vm.type == 4) {
      vm.reserveSelection = 'ebayTransportTypeInfoId'
      vm.pageUrl = 'order/transportTypeList'
      vm.tableConfig = commonTabList
    } else if (vm.type == 5) {
      vm.reserveSelection = 'ebayPublishPreferenceId'
      vm.pageUrl = 'order/publishPreferenceGetList'
      vm.tableConfig = commonTabList
    }
  },
  mounted() {},
  watch: {
    siteList(val) {
      this.searchConfig[0].children = val
    },
    ebayStoreList(val) {
      this.searchConfig[1].children = val
    }
  },
  computed: {
    ...mapState('common', ['siteList', 'ebayStoreList'])
  },
  methods: {
    ...mapActions('common', ['getAllShopList', 'getSiteList']),
    handleOperatorLog(row) {
      let vm = this
      let type = vm.type
      if (type == 1) {
        vm.logParams = {
          url: 'order/paymentTemplateGetOperatorLog',
          visible: true,
          info: {
            ebayPaymentTemplateId: row.ebayPaymentTemplateId
          }
        }
      } else if (type == 2) {
        vm.logParams = {
          url: 'order/returnPolicyGetOperatorLog',
          visible: true,
          info: {
            ebayReturnPolicyId: row.ebayReturnPolicyId
          }
        }
      } else if (type == 3) {
        vm.logParams = {
          url: 'order/buyersConditionsGetOperatorLog',
          visible: true,
          info: {
            ebayBuyersConditionsId: row.ebayBuyersConditionsId
          }
        }
      } else if (type == 4) {
        vm.logParams = {
          url: 'order/transportTypeGetOperatorLog',
          visible: true,
          info: {
            ebayTransportTypeInfoId: row.ebayTransportTypeInfoId
          }
        }
      } else if (type == 5) {
        vm.logParams = {
          url: 'order/publishPreferenceGetOperatorLog',
          visible: true,
          info: {
            ebayPublishPreferenceId: row.ebayPublishPreferenceId
          }
        }
      }
    },
    handleEditOrder(row, checkType) {
      let vm = this
      let type = vm.type
      if (type == 1) {
        vm.$refs.page.$dialog({
          title: '编辑付款模板',
          visible: true,
          width: '540px',
          component: () => import('./addPayment.vue'),
          childFn: [
            {
              name: 'edit',
              params: {
                ebayPaymentTemplateId: row.ebayPaymentTemplateId,
                url: 'paymentTemplateInfo',
                id: 'ebayPaymentTemplateId'
              }
            }
          ]
        })
      } else if (type == 2) {
        let title = '编辑退货政策'
        let params = {
          ebayReturnPolicyId: row.ebayReturnPolicyId,
          url: 'returnPolicyInfo',
          id: 'ebayReturnPolicyId'
        }
        if (checkType == 'check') {
          title = '查看退货政策'
          params.check = true
        } else if (checkType == 'copy') {
          title = '复制退货政策'
          params.copy = true
        }
        vm.$refs.page.$dialog({
          title,
          visible: true,
          width: '540px',
          component: () => import('./addReturn.vue'),
          childFn: [
            {
              name: 'edit',
              params
            }
          ]
        })
      } else if (type == 3) {
        let title = '编辑买家条件'
        let params = {
          ebayBuyersConditionsId: row.ebayBuyersConditionsId,
          url: 'buyersConditionsInfo',
          id: 'ebayBuyersConditionsId'
        }
        if (checkType == 'check') {
          title = '查看买家条件'
          params.check = true
        } else if (checkType == 'copy') {
          title = '复制买家条件'
          params.copy = true
        }
        vm.$refs.page.$dialog({
          title,
          visible: true,
          width: '640px',
          component: () => import('./addCondition.vue'),
          childFn: [
            {
              name: 'edit',
              params
            }
          ]
        })
      } else if (type == 4) {
        let title = '编辑运输方式'
        let params = {
          ebayTransportTypeInfoId: row.ebayTransportTypeInfoId,
          url: 'transportTypeInfo',
          id: 'ebayTransportTypeInfoId'
        }
        if (checkType == 'check') {
          title = '查看运输方式'
          params.check = true
        } else if (checkType == 'copy') {
          title = '复制运输方式'
          params.copy = true
        }
        vm.$refs.page.$dialog({
          title,
          visible: true,
          width: '640px',
          component: () => import('./addTransport/index.vue'),
          childFn: [
            {
              name: 'edit',
              params
            }
          ]
        })
      } else {
        let title = '编辑刊登偏好'
        let params = {
          ebayPublishPreferenceId: row.ebayPublishPreferenceId,
          url: 'publishPreferenceGetInfo',
          id: 'ebayPublishPreferenceId'
        }
        if (checkType == 'check') {
          title = '查看刊登偏好'
          params.check = true
        } else if (checkType == 'copy') {
          title = '复制刊登偏好'
          params.copy = true
        }
        vm.$refs.page.$dialog({
          title,
          visible: true,
          width: '540px',
          component: () => import('./addPublish.vue'),
          childFn: [
            {
              name: 'edit',
              params
            }
          ]
        })
      }
    },
    submitForm(data = {}, title) {
      let vm = this
      let url = ''
      console.log(data)
      if (data) {
        switch (title) {
          case '添加付款模板':
            url = 'paymentTemplateSave'
            break
          case '编辑付款模板':
            url = 'paymentTemplateUpdate'
            break
          case '添加退货政策':
            url = 'returnPolicySave'
            break
          case '复制退货政策':
            url = 'returnPolicySave'
            break
          case '编辑退货政策':
            url = 'returnPolicyUpdate'
            break
          case '添加买家条件':
            url = 'buyersConditionsSave'
            break
          case '复制买家条件':
            url = 'buyersConditionsSave'
            break
          case '编辑买家条件':
            url = 'buyersConditionsUpdate'
            break
          case '添加运输方式':
            url = 'transportTypeSave'
            break
          case '复制运输方式':
            url = 'transportTypeSave'
            break
          case '编辑运输方式':
            url = 'transportTypeUpdate'
            break
          case '添加刊登偏好':
            url = 'publishPreferenceGetSave'
            break
          case '复制刊登偏好':
            url = 'publishPreferenceGetSave'
            break
          case '编辑刊登偏好':
            url = 'publishPreferenceGetUpdate'
            break
          default:
            break
        }
        vm.$api[`order/${url}`](data).then(() => {
          vm.$refs.page.closeForm()
        })
      } else {
        vm.$refs.page.resetForm()
      }
    },
    selectChange(val) {
      this.selectData = val
    }
  }
}
</script>


<style lang='scss'>
.business-common {
  background: #fff;
}
</style>