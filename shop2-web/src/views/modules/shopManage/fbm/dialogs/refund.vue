<template>
  <div class="w1200">
    <h5 style="font-size:14px">
      订单总金额:
      <span class="danger">{{totalAmount}}</span>
    </h5>
    <h5 style="font-size:14px">
      已退款金额:
      <span class="danger">{{refundAmount}}</span>
    </h5>
    <!-- <new-form class="de" ref="form" label-width="0px" :form-schema="formSchema" :value="value"></new-form> -->
    <new-form ref="form" class="de" label-width="0px" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  props: ['data'],
  computed: {
    totalAmount() {
      return `${this.data.currencyCode} ${this.data.amount}`
    },
    refundAmount() {
      if (!this.data.adjAmouts) {
        return '-'
      }
      return `${this.data.currencyCode} ${this.data.adjAmouts}`
    }
  },
  data() {
    const currency = this.data.currencyCode
    return {
      formSchema: {
        table: {
          // rowKey: 'sku',
          type: 'table',
          label: 'table',
          batch: false,
          width: 'auto',
          head: {
            amazonOrderId: {
              widget: 'text',
              label: '订单号',
              noLabel: true
            },
            amount: {
              widget: 'text',
              label: `订单金额（${currency}）`,
              noLabel: true,
              max: this.data.amount
            },
            itemPriceAdj: {
              widget: 'currency',
              label: `商品金额（${currency}）`,
              required: true,
              noLabel: true,
              max: this.data.amount
            },
            itemTaxAdj: {
              widget: 'currency',
              label: `商品税金额（${currency}）`,
              // required: true,
              noLabel: true,
              max: this.data.amount
            },
            shippingPriceAdj: {
              widget: 'currency',
              label: `运费金额（${currency}）`,
              // required: true,
              noLabel: true,
              max: this.data.amount
            }
          }
        },
        table1: {
          // rowKey: 'sku',
          type: 'table',
          label: 'table',
          batch: false,
          width: 'auto',
          head: {
            shippingTaxAdj: {
              widget: 'currency',
              label: `运费税金额（${currency}）`,
              // required: true,
              noLabel: true,
              max: this.data.amount
            },
            giftWrapPriceAdj: {
              widget: 'currency',
              label: `礼物包装金额（${currency}）`,
              // required: true,
              noLabel: true,
              max: this.data.amount
            },
            giftWrapTaxAdj: {
              widget: 'currency',
              label: `礼物包装税金额（${currency}）`,
              // required: true,
              noLabel: true,
              max: this.data.amount
            },
            actionType: {
              widget: 'select',
              label: '动作类型',
              // required: true,
              options: [
                {
                  label: 'Refund',
                  value: 'Refund'
                },
                {
                  label: 'Cancel',
                  value: 'Cancel'
                }
              ],
              noLabel: true
            },
            adjustmentReasonCode: {
              widget: 'select',
              label: '理由',
              // required: true,
              options: [
                { label: 'NoInventory', value: 'NoInventory' },
                { label: 'CustomerReturn', value: 'CustomerReturn' },
                { label: 'GeneralAdjustment', value: 'GeneralAdjustment' },
                { label: 'CouldNotShip', value: 'CouldNotShip' },
                { label: 'DifferentItem', value: 'DifferentItem' },
                { label: 'Abandoned', value: 'Abandoned' },
                { label: 'CustomerCancel', value: 'CustomerCancel' },
                { label: 'PriceError', value: 'PriceError' },
                { label: 'ProductOutofStock', value: 'ProductOutofStock' },
                {
                  label: 'CustomerAddressIncorrect',
                  value: 'CustomerAddressIncorrect'
                },
                { label: 'Exchange', value: 'Exchange' },
                { label: 'Other', value: 'Other' },
                {
                  label: 'CarrierCreditDecision',
                  value: 'CarrierCreditDecision'
                },
                {
                  label: 'RiskAssessmentInformationNotValid',
                  value: 'RiskAssessmentInformationNotValid'
                },
                {
                  label: 'CarrierCoverageFailure',
                  value: 'CarrierCoverageFailure'
                },
                { label: 'TransactionRecord', value: 'TransactionRecord' },
                { label: 'Undeliverable', value: 'Undeliverable' },
                { label: 'RefusedDelivery', value: 'RefusedDelivery' }
              ],
              noLabel: true
            }
          }
        }
      },
      value: {
        table: [],
        table1: []
      }
    }
  },
  async created() {
    let data = await this.getOrderItem(this.data.amazonOrderId)
    this.value.table = data.map(el => ({
      amazonOrderId: this.data.amazonOrderId,

      orderItemId: el.orderItemId,
      currency: this.data.currencyCode,
      itemPriceAdj: el.itemPrice,
      shippingPriceAdj: el.shippingPrice,
      amount: this.data.amount
    }))
    this.value.table1 = data.map(el => ({
      shippingTaxAdj: el.shippingTaxAdj,
      giftWrapPriceAdj: el.giftWrapPriceAdj,
      giftWrapTaxAdj: el.giftWrapTaxAdj,
      actionType: 'Refund',
      adjustmentReasonCode: el.adjustmentReasonCode
    }))
  },
  methods: {
    getOrderItem(amazonOrderId) {
      const params = { amazonOrderId }
      return this.$api[`fbm/fbm-orderOrderItems`](params).then(data => {
        return data.items
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let table = [{ ...this.value.table[0], ...this.value.table1[0] }]
        let params = {
          storeId: this.data.storeId,
          orders: table.map(e => ({
            ...e,
            shippingPriceAdj: e.shippingPriceAdj && e.shippingPriceAdj + '',
            itemPriceAdj: e.itemPriceAdj && e.itemPriceAdj + '',
            itemTaxAdj: e.itemTaxAdj && e.itemTaxAdj + '',
            shippingTaxAdj: e.shippingTaxAdj && e.shippingTaxAdj + '',
            giftWrapPriceAdj: e.giftWrapPriceAdj && e.giftWrapPriceAdj + '',
            giftWrapTaxAdj: e.giftWrapTaxAdj && e.giftWrapTaxAdj + ''
          }))
        }
        return this.$api[`fbm/fbm-orderOrderAdjustment`](params)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.de {
  /deep/ .el-col > .el-form-item--small.el-form-item {
    margin-bottom: -1px;
  }
}
</style>