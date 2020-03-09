<template>
  <div class="edit-rate">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <t-form-item :value.sync="form.currencyRate" prop="currencyRate" label="兑人名币汇率:"></t-form-item>
    </ElForm>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      form: {},
      rules: vm.$formValidate([
        {
          label: '兑人名币汇率',
          value: 'currencyRate',
          type: ['number', 4]
        }
      ])
    }
  },
  methods: {
    edit(params) {
      this.form.currencyRateIds = params.currencyRateIds
    },
    submit() {
      let vm = this
      return {
        url: 'finance/financeCurrencyRateUpdateRate',
        params: vm.utils.clone(vm.form)
      }
    }
  }
}
</script>

<style lang='scss'>
.edit-rate {
  background: #fff;
}
</style>