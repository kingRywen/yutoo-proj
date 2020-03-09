<template>
  <div class="cancel-deel">
    <twp-page
      url="email/ebayDealCancelList"
      reserveSelection="dealCancelId"
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
            <el-tooltip
              effect="dark"
              v-if="scope.row.handleStatus == null"
              content="拒绝取消订单"
              placement="top"
              :open-delay="500"
            >
              <i @click="handleRefuseCancel(scope.$index, scope.row)" class="iconfont1">&#xe638;</i>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              v-if="scope.row.handleStatus == null"
              content="同意取消"
              placement="top"
              :open-delay="500"
            >
              <i @click="handleAgreeCancel(scope.$index, scope.row)" class="iconfont1">&#xe63b;</i>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </twp-page>
  </div>
</template>

<script>
import mixins from '../mixins.js'
import { mapState, mapActions } from 'vuex'
export default {
  mixins: [mixins],
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      selectData: [],
      btnConfig: [
        {
          name: '手动同步数据',
          fn: () => {
            // vm.synchronous('ebayDealCancelSync')
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
            vm.exportData('ebayDealCancelExport', 'dealCancelId')
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
          value: 'cancelStatus',
          type: 'select',
          placeholder: '取消交易状态',
          children: [
            {
              label: '已取消',
              value: 1
            },
            {
              label: '未取消',
              value: 0
            }
          ]
        },
        {
          value: 'cancelReason',
          type: 'select',
          placeholder: '取消交易原因',
          children: []
        },
        {
          value: 'searchOrigin',
          type: 'select',
          placeholder: '搜索源',
          children: [
            {
              label: '退货ID',
              value: 'sss'
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
              label: '关闭时间',
              value: 2
            }
          ]
        },
        {
          value: 'time',
          type: 'time'
        }
      ],
      tableConfig: [
        {
          label: '取消交易ID',
          value: 'dealCancelId',
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
          label: '交易价格',
          value: 'amount'
        },
        {
          label: '关闭时间',
          value: 'closeTime',
          width: '130px'
        },
        {
          label: '同步时间',
          value: 'createTime',
          width: '130px'
        },
        {
          label: '取消交易原因',
          value: 'cancelReasonName',
          width: '130px'
        },
        {
          label: '取消交易状态',
          value: 'cancelStatusName',
          width: '130px'
        },
        {
          label: '销售人员',
          value: 'sellerName'
        },
        {
          label: '客服人员',
          value: 'serviceName'
        }
      ],
      handleStatus: 0
    }
  },
  created() {
    this.getEbayDealCancelReasonList()
  },
  watch: {
    ebayDealCancelReasonList(val) {
      this.searchConfig[2].children = val
    }
  },
  computed: {
    ...mapState('email', ['ebayDealCancelReasonList'])
  },
  methods: {
    ...mapActions('email', ['getEbayDealCancelReasonList']),
    handleRefuseCancel(index, row) {
      console.log(row)
      this.$refs.page.$dialog({
        title: '拒绝取消',
        width: '500px',
        visible: true,
        component: () => import('./refuseOrder.vue'),
        childFn: [
          {
            name: 'getDealCancelId',
            params: {
              dealCancelId: row.dealCancelId,
              handleStatus: row.handleStatus
            }
          }
        ]
      })
    },
    handleAgreeCancel(index, row) {
      let vm = this
      vm.$confirm('是否同意取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api[`email/ebayDealCancelHandle`]({
            dealCancelId: row.dealCancelId,
            handleStatus: 1
          }).then(() => {
            vm.$refs.page.closeForm()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取同意取消'
          })
        })
    },
    async submitForm(data, title) {
      let vm = this
      switch (title) {
        case '拒绝取消':
          vm.$api[`email/ebayDealCancelHandle`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case '手动同步数据':
          vm.$api[`email/ebayDealCancelSync`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang='scss'>
.cancel-deel {
  background: #fff;
}
</style>