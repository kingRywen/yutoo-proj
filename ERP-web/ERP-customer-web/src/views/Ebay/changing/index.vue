<template>
  <div class="changing">
    <twp-page
      url="email/ebayReturnList"
      reserveSelection="returnId"
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
            <el-tooltip effect="dark" v-if="scope.row.solveStatus != 1" content="处理" placement="top" :open-delay="500">
              <i @click="handleDeal(scope.$index, scope.row)" class="iconfont1">&#xe638;</i>
            </el-tooltip>
            <el-tooltip effect="dark" content="备注" placement="top" :open-delay="500">
              <i @click="handleRemark(scope.$index, scope.row)" class="iconfont1">&#xe63b;</i>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </twp-page>
  </div>
</template>

<script>
import mixins from '../mixins.js'
import { mapActions, mapState } from 'vuex'
export default {
  mixins: [mixins],
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      logParams: {
        url: '',
        info: {},
        visible: true
      },
      selectData: [],
      btnConfig: [
        {
          name: '手动同步数据',
          fn: () => {
            // vm.synchronous('ebayReturnSync')
            vm.$refs.page.$dialog({
              title: '手动同步数据',
              width: '580px',
              visible: true,
              component: () => import('../common/syncTime')
            })
          }
        },
        {
          name: '当前条件导出',
          fn: () => {
            vm.exportData('ebayReturnExport', 'returnId')
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
          value: 'returnStatus',
          type: 'select',
          placeholder: '退货状态',
          children: []
        },
        {
          value: 'returnReason',
          type: 'select',
          placeholder: '退货原因',
          children: []
        },
        {
          value: 'searchOrigin',
          type: 'select',
          placeholder: '搜索源',
          children: [
            {
              label: '退货ID',
              value: 'dealCancelId'
            },
            {
              label: '客户ID',
              value: 'memberId'
            },
            {
              label: '客户邮箱',
              value: 'memberEmail'
            },
            {
              label: '系统订单号',
              value: 'systemNumber'
            },
            {
              label: '平台订单号',
              value: 'orderNumber'
            }
          ]
        },
        {
          value: 'originValue',
          type: 'input',
          placeholder: ''
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
              label: '退货时间',
              value: 2
            },
            {
              label: '期望处理时间',
              value: 3
            }
          ]
        },
        {
          value: 'time',
          type: 'time'
        },
        {
          value: 'solveStatus',
          type: 'select',
          placeholder: '是否处理',
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
        }
      ],
      tableConfig: [
        {
          label: '退货ID',
          value: 'returnId'
        },
        {
          label: '退货产品数',
          value: 'quantity',
          width: '130px',
          render(h, scope) {
            return (
              <div
                onClick={() => {
                  vm.handleProductImg(scope.row)
                }}
                style="color:#108ee9"
              >
                {scope.row.quantity}
              </div>
            )
          }
        },
        {
          label: '退货总金额',
          value: 'returnAmount',
          width: '130px'
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
          label: '退货时间',
          value: 'returnTime',
          width: '130px'
        },
        {
          label: '状态',
          value: 'returnStatusName'
        },
        {
          label: '期望处理时间',
          value: 'expectTime',
          width: '130px'
        },
        {
          label: '退货原因',
          value: 'returnReasonName',
          width: '130px'
        },
        {
          label: '同步时间',
          value: 'createTime',
          width: '130px'
        },
        {
          label: '客服人员',
          value: 'serviceName',
          width: '130px'
        },
        {
          label: '备注',
          value: 'remark',
          width: '130px'
        }
      ]
    }
  },
  created() {
    this.getEbayReturnStateList()
    this.getEbayReturnReasonList()
  },
  watch: {
    ebayReturnStateList(val) {
      this.searchConfig[1].children = val
    },
    ebayReturnReasonList(val) {
      this.searchConfig[2].children = val
    }
  },
  computed: {
    ...mapState('email', ['ebayReturnStateList', 'ebayReturnReasonList'])
  },
  methods: {
    ...mapActions('email', [
      'getEbayReturnStateList',
      'getEbayReturnReasonList'
    ]),
    handleDeal(index, row) {
      this.$refs.page.$dialog({
        title: '处理',
        visible: true,
        width: '1000px',
        component: () => import('./deal.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              returnId: row.returnId
            }
          }
        ]
      })
    },
    handleRemark(index, row) {
      this.$refs.page.$dialog({
        title: '添加备注',
        visible: true,
        width: '400px',
        component: () => import('./remark.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              returnId: row.returnId
            }
          }
        ]
      })
    },
    async submitForm(data, title) {
      let vm = this
      switch (title) {
        case '处理':
          vm.$api[`email/ebayReturnHandle`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case '添加备注':
          vm.$api[`email/ebayReturnSaveRemark`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case '退货产品':
          vm.$refs.page.resetForm()
          break
        case '手动同步数据':
          vm.$api[`email/ebayReturnSync`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        default:
          break
      }
    },
    handleProductImg(row) {
      this.$refs.page.$dialog({
        title: '退货产品',
        width: '640px',
        visible: true,
        component: () => import('./productsImg.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              returnId: row.returnId
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss'>
.changing {
  background: #fff;
}
</style>