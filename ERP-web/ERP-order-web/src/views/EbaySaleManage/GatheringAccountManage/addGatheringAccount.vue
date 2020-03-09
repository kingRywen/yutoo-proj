<template>
  <div class="add-paypal-account">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="120px">
      <ElFormItem label="eBay账号选择:" prop="ebayAccount">
        <ElSelect v-model="form.ebayAccount" placeholder class="normal-input">
          <ElOption v-for="item in storeEbayList" :label="item.label" :value="item.value" :key="item.id"></ElOption>
          <!-- <ElOption label="测试" :value="1"></ElOption> -->
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="关联Paypal账户:" prop="paypalId">
        <ElSelect v-model="form.paypalId" placeholder class="normal-input">
          <ElOption v-for="item in ebayPaypalAccountGetCombobox" :label="item.label" :value="item.value" :key="item.id"></ElOption>
        </ElSelect>
      </ElFormItem>
      <!-- <ElFormItem label="关联授权API账号:" prop="apiName">
        <ElSelect v-model="form.apiName" placeholder class="normal-input">
        </ElSelect>
      </ElFormItem>-->
      <ElFormItem label="eBay收款邮箱:" prop="ebayReceiptEmail">
        <el-input v-model="form.ebayReceiptEmail" placeholder class="normal-input"></el-input>
      </ElFormItem>
      <!-- <ElFormItem label="是否激活:" prop="activationFlag">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.activationFlag"></el-checkbox>
      </ElFormItem>-->
    </ElForm>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      form: {
        activationFlag: 0
      },
      rules: vm.$formValidate([
        {
          label: 'eBay账号选择',
          value: 'paypalId'
        },
        {
          label: '关联Paypal账户',
          value: 'paypalId'
        },
        {
          label: 'eBay收款邮箱',
          value: 'ebayReceiptEmail',
          type: 'email'
        }
      ])
    }
  },
  created() {
    this.getEbayPaypalAccountGetCombobox()
    this.getStoreEbayList()
  },
  computed: {
    ...mapState('common', ['ebayPaypalAccountGetCombobox', 'storeEbayList'])
  },
  methods: {
    ...mapActions('common', [
      'getEbayPaypalAccountGetCombobox',
      'getStoreEbayList'
    ]),
    edit(params) {
      let vm = this
      return vm.$api[`order/ebayReceiptAccountInfo`](params).then(
        ({ rows }) => {
          vm.form = rows
          return Promise.resolve()
        }
      )
    },
    submitForm(cb) {
      let vm = this
      vm.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(vm.$clone(vm.form))
        } else {
          console.log('error')
        }
      })
    },
    resetForm() {}
  }
}
</script>

<style lang='scss'>
.add-paypal-account {
  background: #fff;
  .normal-input {
    width: 300px;
  }
}
</style>