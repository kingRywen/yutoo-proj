import storage from 'Utils/saver.js'
import { loginRedirect } from 'Config'

export const mixin = {
  methods: {
    async handleView(data) {
      let vm = this
      if (!vm.utils.isEmpty(data.contractNumberRuleId)) {
        data.contractNumberRuleName = vm.financeContractRuleGetComboBox.find(
          item => item.value == data.contractNumberRuleId
        ).label
      }
      await vm.$api[`finance/financeContractRuleInfo`]({
        contractNumberRuleId: data.contractNumberRuleId
      }).then(({ rows = {} }) => {
        data.ruleInfo = rows.ruleInfo
      })
      storage.set('local', 'contract-template-print', data)
      window.open(`${loginRedirect}erp-finance/#/contract/template/print`)
    }
  }
}
