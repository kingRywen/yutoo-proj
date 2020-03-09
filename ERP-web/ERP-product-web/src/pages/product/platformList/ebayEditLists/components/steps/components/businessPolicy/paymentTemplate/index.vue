<template>
  <div class="payment-template">
    <el-form :disabled="review" ref="form" :model="data" :rules="rules" size="small" label-width="130px">
      <ElFormItem label="选择模板:">
        <ElSelect v-model="data.templateId" placeholder class="normal-input" @change="tempChange">
          <!-- <ElOption v-for="item in tempList" :key=""></ElOption> -->
          <ElOption v-for="item in tempList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="付款方式:" prop="paymentType">
        <ElSelect v-model="data.paymentType" placeholder multiple class="normal-input">
          <ElOption v-for="item in paymentTypeList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
          <!-- <ElOption label="PayPal" value="PayPal"></ElOption>
          <ElOption label="Visa/masterCard" value="Visa/masterCard"></ElOption>
          <ElOption label="Discover" value="Discover"></ElOption>
          <ElOption label="American Express" value="American Express"></ElOption>
          <ElOption label="Receive payment upon pickup" value="Receive payment upon pickup"></ElOption>-->
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="PayPal账号:" prop="paypalId">
        <ElSelect v-model="data.paypalId" placeholder class="normal-input">
          <ElOption v-for="item in paypalList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="是否立即付款:" prop="value">
        <el-checkbox :true-label="1" :false-label="0" v-model="data.autopayFlag"></el-checkbox>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode, showToast } from 'common/common'
import mixins from '../../../mixins'
import tempMixin from '../mixin'
export default {
  mixins: [mixins, tempMixin],
  data() {
    return {
      // form: {
      //   autopayFlag: 0
      // },
      rules: {
        templateId: [{ required: true, message: '请选择模板' }],
        paymentType: [{ required: true, message: '请选择付款方式' }],
        paypalId: [{ required: true, message: '请选择PayPal账号' }]
      },
      // 模板名称选项
      tempList: [],
      // 付款方式选项
      paymentTypeList: [],
      // paypal选项
      paypalList: [],
      groupCode: 4,
      tempName: 'ebayPaymentTemplateId',
      tempApi: 'ebayPaymentTemplateInfo'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    validate() {
      return this.$refs.form.validate().then(() => {
        let dataMap = {
          ...this.data,
          paymentType: this.data.paymentType.join('@,,#@')
        }
        this.saveData({ dataMap })
      })
    },
    initData() {
      Promise.all([
        this.getData('ebayPaymentTemplateGetCombobox'),
        fetchData({
          ...apis.saleEbayProItemSaleEbayProItem,
          data: { propertyName: 'paymentType' }
        }),
        this.getData('ebayPaypalAccountGetCombobox')
      ])
        .then(res => {
          this.tempList = res[0]
          this.paymentTypeList = res[1].data.data.map(el => ({
            label: el.name,
            value: el.id
          }))
          this.paypalList = res[2]
        })
        .catch(() => {
          showToast('error', '初始化数据失败，请刷新重试')
        })
    },
    getData(name, params = {}) {
      return fetchData({
        ...apis[name],
        data: params
      }).then(res =>
        res.data.rows.map(el => ({ label: el.name, value: el.id }))
      )
    }
  }
}
</script>

<style lang='scss'>
.payment-template {
  background: #fff;
  .normal-input {
    width: 350px;
  }
}
</style>