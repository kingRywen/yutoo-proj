<template>
  <div class="add-account">
    <ElForm :model="form" ref="form" size="small" :rules="rules" :disabled="disabled" label-width="86px">
      <t-form-item
        :value.sync="form.paymentMode"
        type="select"
        :list="paymentModeList"
        prop="paymentMode"
        label="支付方式:"
      ></t-form-item>
      <t-form-item :value.sync="form.account" prop="account" :label="accountName"></t-form-item>
      <t-form-item :value.sync="form.password" prop="password" type="password" label="支付密码:"></t-form-item>
      <t-form-item :value.sync="form.cardName" v-if="form.paymentMode == 3" prop="cardName" label="持卡人姓名:"></t-form-item>
      <t-form-item
        :list="bankLists"
        v-if="form.paymentMode == 3"
        type="select"
        :value.sync="form.cardBank"
        prop="cardBank"
        label="银行:"
      ></t-form-item>
      <t-form-item type="textarea" :minRows="4" :maxRows="4" :value.sync="form.remark" prop="remark" label="备注:"></t-form-item>
      <t-form-item type="check" :value.sync="form.activatedFlag" prop="activatedFlag" label="是否激活:"></t-form-item>
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
        activatedFlag: 0,
        paymentMode: null
      },
      rules: vm.$formValidate([
        {
          label: '支付方式',
          value: 'paymentMode'
        },
        {
          label: '账号',
          value: 'account'
        },
        {
          label: '支付密码',
          value: 'password'
        },
        {
          label: '持卡人姓名',
          value: 'cardName'
        },
        {
          label: '银行',
          value: 'cardBank'
        }
      ]),
      bankLists: [],
      disabled: false,
      isEdit: false
    }
  },
  created() {
    this.getBankList()
  },
  computed: {
    ...mapState('common', ['bankList']),
    ...mapState('finance', ['paymentModeList']),
    accountName: {
      get() {
        if (this.form.paymentMode == 3) {
          return '银行卡账号:'
        } else {
          return '账号:'
        }
      },
      set() {}
    }
  },
  watch: {
    bankList(val) {
      if (val) {
        this.bankLists = val.map(item => {
          return {
            label: item.bankName,
            value: item.bankId
          }
        })
      }
    }
  },
  methods: {
    ...mapActions('common', ['getBankList']),
    edit(params) {
      let vm = this
      if (vm.utils.isEmpty(params)) {
        return
      }
      if (params) {
        if (params.view) {
          vm.disabled = true
        } else {
          vm.isEdit = true
        }
        vm.$api[`finance/financePaymentAccountInfo`]({
          paymentAccountId: params.paymentAccountId
        }).then(({ rows = {} }) => {
          vm.form = rows
          if (vm.form.cardBank) {
            vm.form.cardBank = +vm.form.cardBank
          }
          return Promise.resolve()
        })
      }
    },
    submit() {
      let url = ''
      let params = this.utils.clone(this.form)
      if (this.isEdit) {
        url = 'finance/financePaymentAccountUpdate'
      } else {
        url = 'finance/financePaymentAccountSave'
      }
      return {
        url,
        params
      }
    }
  }
}
</script>

<style lang='scss'>
.add-account {
  background: #fff;
}
</style>