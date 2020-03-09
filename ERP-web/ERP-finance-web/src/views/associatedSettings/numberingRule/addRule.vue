<template>
  <div class="add-rule">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <t-form-item :value.sync="form.ruleName" prop="ruleName" label="编号规则名称:"></t-form-item>
      <t-form-item :value.sync="form.ruleRemark" prop="ruleRemark" type="textarea" label="备注:"></t-form-item>
      <numRule ref="numRule" :vals.sync="form.ruleInfoList"></numRule>
    </ElForm>
  </div>
</template>

<script>
import numRule from './numRule'
export default {
  components: {
    numRule
  },
  data() {
    return {
      form: {
        ruleInfoList: []
      },
      rules: {
        ruleInfoList: []
      },
      isEdit: false
    }
  },
  methods: {
    edit(params) {
      let vm = this
      if (params && vm.utils.isObject(params)) {
        vm.isEdit = true
        return vm.$api[`finance/financeContractRuleInfo`](params).then(data => {
          vm.form = data.rows
          return Promise.resolve()
        })
      }
    },
    submit() {
      let vm = this
      let params = vm.utils.clone(this.form)
      if (vm.utils.isEmpty(params.ruleInfoList)) {
        vm.$message.error('流水号必须填写')
        return
      }
      let url = ''
      if (vm.isEdit) {
        url = 'finance/financeContractRuleUpdate'
      } else {
        url = 'finance/financeContractRuleSave'
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
.add-rule {
  background: #fff;
}
</style>