<template>
  <div class="add-account">
    <ElForm :model="form" ref="form" size="small" :rules="rules" :disabled="disabled" label-width="86px">
      <t-form-item :value.sync="form.alipayAccount" prop="alipayAccount" label="支付宝账号:"></t-form-item>
      <t-form-item :value.sync="form.alipayPassword" prop="alipayPassword" type="password" label="支付密码:"></t-form-item>
      <t-form-item :value.sync="form.remark" :minRows="4" type="textarea" prop="remark" label="备注:"></t-form-item>
      <t-form-item
        :value.sync="form.purchasersIds"
        type="multiple"
        :list="rtHandleOperator"
        placeholder="采购人选(多选)"
        prop="purchasersIds"
        label="采购人员:"
      ></t-form-item>
      <t-form-item :value.sync="form.activatedFlag" :minRows="4" type="check" prop="activatedFlag" label="是否激活:"></t-form-item>
    </ElForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      disabled: false,
      form: {
        activatedFlag: 0
      },
      rules: vm.$formValidate([
        {
          label: '支付宝账号',
          value: 'alipayAccount'
        },
        {
          label: '支付密码',
          value: 'alipayPassword'
        }
      ]),
      isEdit: false
    }
  },
  computed: {
    ...mapState('finance', ['rtHandleOperator'])
  },
  methods: {
    edit(params) {
      let vm = this
      if (params) {
        if (params.view) {
          vm.disabled = params.view
        } else {
          vm.isEdit = true
        }
        return vm.$api[`finance/financeAlipayAccountInfo`]({
          alipayAccountId: params.alipayAccountId
        }).then(({ rows = {} }) => {
          vm.form = rows
          return Promise.resolve()
        })
      }
    },
    submit() {
      let url = ''
      if (this.isEdit) {
        url = 'finance/financeAlipayAccountUpdate'
      } else {
        url = 'finance/financeAlipayAccountSave'
      }
      return {
        url,
        params: this.utils.clone(this.form)
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