<template>
  <el-row :gutter="20" type="flex" class="per100">
    <el-col :span="12">
      <SimpleForm labelWidth="120px" :fields="payFields" :default-data="defaultPayData" ref="form"></SimpleForm>
    </el-col>
    <el-col :span="12" class="txc">
      <div class="txc mt20">
        <el-radio :label="0" v-model="selectPayStyle">支付宝</el-radio>
        <el-radio :label="1" v-model="selectPayStyle">微信</el-radio>
      </div>
      <img class="mt10" v-if="selectPayStyle === 0" src="../../components/alipay.gif">
      <img class="mt10" v-else src="../../components/weipay.png">
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['loginData'],
  data() {
    let vm = this
    return {
      selectPayStyle: 0,
      defaultPayData: {},
      payFields: [
        {
          label: '有效时长（月）',
          type: 'select',
          clearable: false,
          onChange(item, val, data) {
            vm.getFee(val)
          },
          options: [
            {
              label: '1个月',
              value: 1
            },
            {
              label: '3个月',
              value: 3
            },
            {
              label: '6个月',
              value: 6
            },
            {
              label: '12个月',
              value: 12
            },
            {
              label: '24个月',
              value: 24
            },
            {
              label: '36个月',
              value: 36
            }
          ],
          name: 'effectiveTime'
        },
        {
          label: '应付金额',
          name: 'needPay',
          disabled: true
        },
        {
          label: '支付姓名',
          name: 'payName',
          required: true
        },
        {
          label: '支付账号',
          name: 'payAccount',
          required: true
        },
        {
          label: '留言',
          name: 'remark',
          type: 'textarea',
          rows: 5
        }
      ]
    }
  },
  methods: {
    submit() {
      let params = this.$refs.form.formData
      if (this.loginData) {
        params = { ...params, ...this.loginData }
      } else {
        let { username, merchantId } = this.$store.state.userInfo
        params = { ...params, username, merchantId }
      }
      return this.$refs.form.validate().then(() => {
        return this.$api[`main/merchantOrderPayMemberfeePay`]({
          ...params,
          payType: this.selectPayStyle
        })
      })
    },
    init() {
      this.getFee(1)
    },
    getFee(month) {
      this.$api[`main/systemSettingPriceAnnualfee`]({ month })
        .then(data => {
          // this.defaultPayData.needPay = data.needPay
          data.effectiveTime = month
          this.$refs.form.setData(data)
        })
        .catch(err => {})
    }
  },
  watch: {}
}
</script>

<style>
</style>
