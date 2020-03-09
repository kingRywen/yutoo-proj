<template>
  <div style="padding:16px" class="purchase-contract">
    <component :productId="+$route.query.productId" :is="componentId"></component>
  </div>
</template>

<script>
/* eslint-disable */
import AsinSaleinfo from './SkuComponents/AsinSaleinfo'
import StorageCharge from './SkuComponents/StorageCharge'
import RefundInfo from './SkuComponents/RefundInfo'
import PurchaseInfo from './SkuComponents/PurchaseInfo'
import RemoveInfo from './SkuComponents/RemoveInfo'
import CommonInfo from './SkuComponents/CommonInfo'
import CompensateInfo from './SkuComponents/CompensateInfo'
import AdCharge from './SkuComponents/AdCharge'
export default {
  components: {
    AsinSaleinfo,
    StorageCharge,
    RefundInfo,
    PurchaseInfo,
    CompensateInfo,
    AdCharge,
    CommonInfo,
    RemoveInfo
  },
  data() {
    return {
      componentId: 'AsinSaleinfo'
    }
  },
  created() {
    this.setComponent()
  },
  methods: {
    setComponent() {
      let data = [
        { name: '销售总额', id: 'b1', URL: 'totalSalesList' },
        { name: '赔偿', id: 'b2', URL: 'reimbursementList' },
        { name: '正常FBA配送费', id: 'c1', URL: 'fulfillmentFeeList' },
        { name: '正常订单佣金', id: 'c2', URL: 'commissionList' },
        { name: '仓储费', id: 'c3', URL: 'storageFeeList' },
        { name: '退款金额', id: 'c4', URL: 'refundAmountList' },
        { name: '退款损失', id: 'c5', URL: 'refundLossList' },
        { name: '销毁费用', id: 'c7', URL: 'disposalFeeList' },
        { name: '移除费用', id: 'c6', URL: 'removeFeeList' },
        { name: '广告费用', id: 'c8', URL: 'adChargeList' },
        { name: '店铺费用', id: 'c9', URL: 'subscriptionList' },
        { name: '运输成本', id: 'c10', URL: 'transportationList' },
        { name: '采购成本', id: 'c11', URL: 'purchaseList' },
        { name: '贴标成本', id: 'c12', URL: 'labelingList' },
        { name: '包装成本', id: 'c13', URL: 'packagingList' },
        { name: '称重成本', id: 'c14', URL: 'weighList' }
      ]
      switch (this.$route.query.title) {
        case '正常FBA配送费':
        case '正常订单佣金':
        case '销售总额':
          this.componentId = 'AsinSaleinfo'
          break
        case '赔偿':
          this.componentId = 'CompensateInfo'
          break
        case '仓储费':
          this.componentId = 'StorageCharge'
          break
        case '退款金额':
        case '退款损失':
          this.componentId = 'RefundInfo'
          break
        case '移除费用':
        case '销毁费用':
          this.componentId = 'RemoveInfo'
          break
        case '采购成本':
          this.componentId = 'PurchaseInfo'
          break
        case '广告费用':
          this.componentId = 'AdCharge'
          break

        default:
          // 通用成本
          this.componentId = 'CommonInfo'
          break
      }
    }
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
}
.appMain > div {
  padding: 0 !important;
}
</style>