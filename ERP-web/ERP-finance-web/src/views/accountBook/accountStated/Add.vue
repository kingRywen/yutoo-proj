<template>
  <div class="add">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="86px">
      <t-form-item :value.sync="form.paymentTime" type="datetime" prop="paymentTime" label="时间:"></t-form-item>
      <t-form-item :value.sync="form.itemType" width :list="accountItems" type="select" prop="itemType" label="账目类型:"></t-form-item>
      <t-form-item :value.sync="form.digest" width prop="digest" type="textarea" label="摘要:"></t-form-item>
      <t-form-item :value.sync="form.paymentAccount" width prop="paymentAccount" label="付款方:"></t-form-item>
      <t-form-item :value.sync="form.receiveAccount" width prop="receiveAccount" label="收款方:"></t-form-item>
      <t-form-item :value.sync="form.surplus" width prop="surplus" label="金额（￥）:"></t-form-item>
      <t-form-item
        :value.sync="form.invalidFlag"
        width
        type="radio"
        prop="invalidFlag"
        label="状态:"
        :list="[{label: '作废', value: 1},{label: '正常', value: 0}]"
      ></t-form-item>
    </ElForm>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    /* eslint-disable */
    let vm = this
    return {
      form: {
        annexPathList: [],
        companyLogoList: []
      },
      // rules: {},
      rules: vm.$formValidate([
        {
          label: '时间',
          value: 'paymentTime'
        },
        {
          label: '账目类型',
          value: 'itemType'
        },
        {
          label: '摘要',
          value: 'digest'
        },
        {
          label: '付款方',
          value: 'paymentAccount'
        },
        {
          label: '收款方',
          value: 'receiveAccount'
        },
        {
          label: '金额',
          value: 'surplus',
          type: 'number'
        },
        {
          label: '状态',
          value: 'invalidFlag',
          type: 'radio'
        }
      ]),
      companyLogoList: [],
      annexPathList: []
    }
  },
  computed: {
    ...mapState('finance', ['accountItems'])
  },
  methods: {
    edit(params) {
      // let vm = this
      // if (params) {
      //   return vm.$api[`finance/financeContractModelInfo`]({
      //     contractModelId: params.contractModelId
      //   }).then(({ rows }) => {
      //     if (vm.utils.isArrLength(rows.companyLogoList)) {
      //       rows.companyLogoList = rows.companyLogoList.map(item =>
      //         JSON.parse(item)
      //       )
      //     }
      //     if (vm.utils.isArrLength(rows.annexPathList)) {
      //       rows.companyLogoList = rows.annexPathList.map(item =>
      //         JSON.parse(item)
      //       )
      //     }
      //     rows.companyLogoList || (rows.companyLogoList = [])
      //     rows.annexPathList || (rows.annexPathList = [])
      //     vm.form = rows
      //     if (params.copy) {
      //       delete vm.form.contractModelId
      //     }
      //     return Promise.resolve()
      //   })
      // }
    },
    formatForm(form) {
      return { ...form, surplus: +form.surplus }
    },
    submit() {
      return {
        url: 'finance/financeBooksAccountDetailSave',
        params: this.formatForm(this.form)
      }
    }
  }
}
</script>

<style lang='scss'>
.add {
  background: #fff;
}
</style>