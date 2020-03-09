<template>
  <div class="upaid-dispute">
    <twp-page
      url="email/ebayUnpaidDisputeList"
      reserveSelection="unpaidDisputeId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="val => selectData=val"
      ref="page"
    >
      <template slot="table">
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope" v-if="scope.row.caseState != 1">
            <el-tooltip effect="dark" content="处理" placement="top" :open-delay="500">
              <i @click="handleDeal(scope.$index, scope.row)" class="iconfont1">&#xe638;</i>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </twp-page>
  </div>
</template>

<script>
import mixins from '../mixins.js'
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
            // vm.synchronous('ebayUnpaidDisputeSync')
            vm.$refs.page.$dialog({
              title: '手动同步数据',
              width: '580px',
              visible: true,
              component: () => import('../common/syncTime')
            })
          }
        },
        {
          name: '批量开为付款case状态',
          fn: () => {
            vm.handleDeal()
          }
        },
        {
          name: '当前条件导出',
          fn: () => {
            vm.exportData('ebayUnpaidDisputeExport', 'unpaidDisputeId')
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
          value: 'searchOrigin',
          type: 'select',
          placeholder: '搜索源',
          children: [
            {
              label: '客户ID',
              value: 'memberId'
            },
            {
              label: '物品ID',
              value: 'itemId'
            },
            {
              label: '产品SKU',
              value: 'productSku'
            },
            {
              label: '平台订单号',
              value: 'orderNumber'
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
              label: '交易时间',
              value: 2
            }
          ]
        },
        {
          value: 'time',
          type: 'time'
        },
        {
          value: 'caseState',
          type: 'select',
          placeholder: '是否开启未付款个案',
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
          label: '交易ID',
          value: 'unpaidDisputeId',
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
          label: '买家ID',
          value: 'memberId',
          width: '130px'
        },
        {
          label: '买家名称',
          value: 'memberName',
          width: '130px'
        },
        {
          label: '产品数量',
          width: '130px',
          render(h, scope) {
            return (
              <div
                onClick={() => {
                  vm.handleProductImg(scope.row)
                }}
                style="color:#108ee9"
              >
                {scope.row.productCount}
              </div>
            )
          }
        },
        {
          label: '金额',
          value: 'productPrice',
          width: '130px'
        },
        {
          label: '平台订单号',
          value: 'orderNumber',
          width: '130px',
          render: vm.orderJump()
        },
        {
          label: '交易时间',
          value: 'tradeTime',
          width: '130px'
        },
        {
          label: '同步时间',
          value: 'createTime',
          width: '130px'
        },
        {
          label: '未付款CASE状态',
          value: 'caseStateName'
        },
        {
          label: '客服人员',
          value: 'serviceName',
          width: '130px'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    handleDeal(index, row) {
      let unpaidDisputeIds = []
      if (row) {
        unpaidDisputeIds = [row.unpaidDisputeId]
      } else {
        if (this.$editMsg(this.selectData, false)) {
          return
        }
        unpaidDisputeIds = this.selectData.map(item => item.unpaidDisputeId)
      }
      this.$refs.page.$dialog({
        title: '处理',
        width: '500px',
        visible: true,
        component: () => import('./deal.vue'),
        childFn: [
          {
            name: 'getUnpaidDisputeIds',
            params: {
              unpaidDisputeIds
            }
          }
        ]
      })
    },
    async submitForm(data, title) {
      let vm = this
      switch (title) {
        case '处理':
          await vm.$api[`email/ebayUnpaidDisputeHandle`](data)
          vm.$refs.page.clearSelection()
          vm.$refs.page.closeForm()
          break
        case 'sku图片':
          vm.$refs.page.resetForm()
          break
        case '手动同步数据':
          vm.$api[`email/ebayUnpaidDisputeSync`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        default:
          break
      }
    },
    handleProductImg(row) {
      this.$refs.page.$dialog({
        title: 'sku图片',
        width: '640px',
        visible: true,
        component: () => import('./productsImg.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              orderNumber: row.orderNumber
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss'>
.upaid-dispute {
  background: #fff;
}
</style>