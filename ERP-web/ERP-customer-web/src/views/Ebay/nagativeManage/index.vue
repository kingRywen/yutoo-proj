<template>
  <div class="nagative-manage">
    <twp-page
      url="email/ebayEvaluateList"
      reserveSelection="evaluateId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="val => selectData=val"
      ref="page"
      :leftCustom="true"
    >
      <template slot="table">
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="评价" placement="top" :open-delay="500">
              <i @click="addEvaluate(scope.$index, scope.row)" class="iconfont1">&#xe638;</i>
            </el-tooltip>
            <el-tooltip content="联系买家" offset="1" placement="bottom" effect="light">
              <i @click="handleConncat(scope.$index, scope.row)" class="iconfont1">&#xe7a0;</i>
            </el-tooltip>
            <el-tooltip content="添加差评原因备注" offset="1" placement="bottom" effect="light">
              <i @click="handleAddRemark(scope.$index, scope.row)" class="iconfont1">&#xe63b;</i>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </twp-page>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import mixins from '../mixins.js'
export default {
  mixins: [mixins],
  provide: {
    platformId: 2
  },
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      selectData: [],
      btnConfig: [
        {
          name: '同步评价',
          fn: () => {
            vm.synchronous('ebayEvaluateSync')
          }
        },
        {
          name: '批量追加评价',
          fn: () => {
            vm.addEvaluate()
          }
        },
        {
          name: '导出评价信息',
          fn: () => {
            vm.exportData('ebayEvaluateExport', 'evaluateId')
          }
        }
      ],
      searchConfig: [
        {
          value: 'storeIds',
          type: 'multiple',
          placeholder: '订单来源店铺(多选)',
          children: []
        },
        {
          value: 'salesmanIds',
          type: 'multiple',
          placeholder: '销售人员(多选)',
          children: []
        },
        {
          value: 'serviceIds',
          type: 'multiple',
          placeholder: '客服人员(多选)',
          children: []
        },
        {
          value: 'evaluateLevel',
          type: 'select',
          placeholder: '差评',
          children: [
            {
              label: '全部',
              value: 1
            },
            {
              label: '差评',
              value: 2
            },
            {
              label: '中评',
              value: 3
            }
          ]
        },
        {
          value: 'searchOrigin',
          type: 'select',
          placeholder: '搜索源',
          children: [
            {
              label: '买家名称',
              value: 'memberName'
            },
            {
              label: '物品ID',
              value: 'itemId'
            },
            {
              label: '产品名称',
              value: 'productName'
            },
            {
              label: '平台订单号',
              value: 'orderNumber'
            },
            {
              label: '买家ID',
              value: 'memberId'
            }
          ]
        },
        {
          value: 'originValue',
          type: 'input'
        },
        {
          value: 'timeLabel',
          type: 'select',
          placeholder: '时间范围',
          children: [
            {
              label: '同步时间',
              value: 1
            },
            {
              label: '评论时间',
              value: 2
            }
          ]
        },
        {
          value: 'time',
          type: 'time'
        },
        {
          value: 'evaluateState',
          type: 'select',
          placeholder: '评价状态',
          children: [
            {
              label: '已移除',
              value: 1
            },
            {
              label: '未移除',
              value: 2
            }
          ]
        },
        {
          value: 'matchingOrderFlag',
          type: 'select',
          placeholder: '是否关联订单',
          children: [
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ]
        }
      ],
      tableConfig: [
        {
          label: '买家ID',
          value: 'memberId',
          width: '100px'
        },
        {
          label: '产品图片',
          value: 'productImg',
          width: '130px',
          img: true,
          style: {
            width: 48,
            height: 48
          }
        },
        {
          label: '产品ID',
          value: 'productId',
          width: '130px'
        },
        {
          label: '产品名称',
          value: 'productSku',
          width: '150px',
          href: 'https://www.ebay.com/',
          render: vm.pageJump()
        },
        {
          label: '来源店铺',
          value: 'storeName',
          width: '130px',
          href: 'https://www.ebay.com/',
          render: vm.pageJump()
        },
        {
          label: '平台订单号',
          value: 'orderNumber',
          width: '130px',
          render: vm.orderJump()
        },
        {
          label: '评价时间',
          value: 'evaluateTime',
          width: '130px'
        },
        {
          label: '评价星级',
          showTooltip: false,
          render(h, scope) {
            let num = Number(scope.row.evaluateLevel)
            return <el-rate value={num} disabled />
          },
          width: '140px'
        },
        {
          label: '评价内容',
          value: 'evaluateContent',
          width: '120px'
        },
        {
          label: '销售人员',
          value: 'salesmanName'
        },
        {
          label: '客服人员',
          value: 'serviceName'
        },
        {
          label: '评价状态',
          value: 'evaluateStateName'
        },
        {
          label: '同步时间',
          value: 'createTime',
          width: '130px'
        },
        {
          label: '买家名称',
          value: 'memberName',
          width: '130px'
        },
        {
          label: '差评原因备注',
          value: 'remark',
          width: '130px'
        },
        
      ],
      evaluateIds: []
    }
  },
  created() {
    this.getSalemanList()
    this.getservice()
  },
  watch: {
    salemanList(val) {
      if (val) {
        this.searchConfig[1].children = val
      }
    },
    serviceList(val) {
      if (val) {
        this.searchConfig[2].children = val
      }
    }
  },
  computed: {
    ...mapState('email', ['serviceList']),
    ...mapState('order', ['salemanList'])
  },
  methods: {
    ...mapActions('order', ['getSalemanList']),
    ...mapActions('email', ['getservice']),
    addEvaluate(index, row) {
      let vm = this
      let title = ''
      if (!row) {
        if (vm.$editMsg(vm.selectData, false)) {
          return
        }
        title = '批量追加评价'
        vm.evaluateIds = vm.selectData.map(item => item.evaluateId)
      } else {
        vm.evaluateIds = [row.evaluateId]
        title = '评价'
      }
      vm.$refs.page.$dialog({
        title,
        visible: true,
        width: '380px',
        component: () => import('./evaluate.vue')
      })
    },
    async submitForm(data, title) {
      let vm = this
      console.log(title)
      switch (title) {
        case '批量追加评价':
          vm.handleEvaluate(data)
          break
        case '评价':
          vm.handleEvaluate(data)
          break
        case '联系买家':
          vm.connectBuyer(data)
          break
        case '添加差评原因备注':
          vm.$api[`email/ebayEvaluateSaveRemark`](data)
            .then(() => {
              vm.$refs.page.closeForm()
            })
            .catch(() => {
              vm.$refs.page.resetForm()
            })
          break
        default:
          break
      }
    },
    connectBuyer(data) {
      let vm = this
      return vm.$api['email/baseDraftCommit'](data)
        .then(() => {
          vm.$refs.page.closeForm()
        })
        .catch(() => {
          vm.$refs.page.resetForm()
        })
    },
    handleEvaluate(params) {
      let vm = this
      params.evaluateIds = this.evaluateIds
      this.$api[`email/ebayEvaluateAppend`](params).then(() => {
        vm.evaluateIds = []
        vm.$refs.page.closeForm()
      })
    },
    handleConncat(index, row) {
      this.$refs.page.$dialog({
        title: '联系买家',
        visible: true,
        width: '1330px',
        component: () => import('./connect.vue'),
        childFn: [
          {
            name: 'edit',
            params: row
          }
        ]
      })
    },
    handleAddRemark(index, row) {
      this.$refs.page.$dialog({
        title: '添加差评原因备注',
        visible: true,
        width: '380px',
        component: () => import('./evaluate.vue'),
        childFn: [
          {
            name: 'getEvaluateId',
            params: {
              evaluateId: row.evaluateId
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss'>
.nagative-manage {
  background: #fff;
  .el-rate__icon {
    font-size: 16px;
    margin-top: 17px;
  }
}
.el-tooltip__popper {
  z-index: 1000 !important;
}
</style>