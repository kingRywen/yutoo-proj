<template>
  <div class="add-payment">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="130px">
      <ElFormItem label="模板名称:" prop="templateName">
        <ElInput v-model="form.templateName" class="normal-input"></ElInput>
      </ElFormItem>
      <ElFormItem label="站点:" prop="siteId">
        <ElSelect v-model="form.siteId" placeholder class="normal-input">
          <ElOption v-for="(item,index) in siteList" :label="item.label" :value="item.value" :key="index"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="来源店铺:" prop="storeId">
        <el-cascader :options="ebayStoreList" v-model="form.storeId" class="normal-input"></el-cascader>
      </ElFormItem>
      <ElFormItem label="付款方式:" prop="paymentType">
        <ElSelect v-model="form.paymentType" placeholder class="normal-input">
          <ElOption label="PayPal" :value="1"></ElOption>
          <ElOption label="Visa/masterCard" :value="2"></ElOption>
          <ElOption label="Discover" :value="3"></ElOption>
          <ElOption label="American Express" :value="4"></ElOption>
          <ElOption label="Receive payment upon pickup" :value="5"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="PayPal账号:" prop="paypalId">
        <ElSelect v-model="form.paypalId" placeholder class="normal-input">
          <ElOption v-for="item in ebayPaypalAccountGetCombobox" :label="item.label" :value="item.value" :key="item.id"></ElOption>
          <!-- <ElOption v-for="" :key=""></ElOption> -->
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="启用次选PayPal账号:" prop="value">
        <el-checkbox style="margin-right: 0" :true-label="1" :false-label="0" v-model="form.startupStandbyFlag">当价格</el-checkbox>
        <span style="padding: 0 4px;"></span>
        <ElSelect v-model="form.priceType" style="width: 120px">
          <ElOption :value="1" label="大于等于"></ElOption>
          <ElOption :value="2" label="小于等于"></ElOption>
        </ElSelect>
        <span style="padding: 0 4px;"></span>
        <el-input-number v-model="form.price" controls-position="right" :min="0" style="width: 120px" :controls="false"></el-input-number>RMB将使用次选PayPal账号
      </ElFormItem>
      <ElFormItem label="是否立即付款:" prop="autopayFlag">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.autopayFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem label="是否默认模板:" prop="defaultFlag">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.defaultFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem label="详细描述:" prop="remark">
        <ElInput v-model="form.remark" type="textarea" class="normal-input"></ElInput>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
import { edit } from './mixin.js'
import { mapActions, mapState } from 'vuex'
export default {
  mixins: [edit],
  data() {
    let vm = this
    return {
      form: {
        defaultFlag: 0,
        autopayFlag: 0
      },
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
          label: '付款方式',
          value: 'paymentType'
        },
        {
          label: 'PayPal账号',
          value: 'paypalId'
        },
        {
          label: '详细描述',
          value: 'remark'
        }
      ])
    }
  },
  created() {
    this.getSiteList(2)
    this.getEbayPaypalAccountGetCombobox()
  },
  computed: {
    ...mapState('common', ['siteList', 'ebayPaypalAccountGetCombobox'])
  },
  methods: {
    ...mapActions('common', ['getSiteList', 'getEbayPaypalAccountGetCombobox'])
  }
}
</script>

<style lang='scss'>
.add-payment {
  background: #fff;
  .normal-input {
    width: 350px !important;
  }
}
</style>