<template>
  <div class="add">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <t-form-item :value.sync="form.modelName" width prop="modelName" label="合同模板名称:"></t-form-item>
      <t-form-item
        :value.sync="form.modelType"
        width
        :list="modelTypeList"
        type="select"
        prop="modelType"
        label="模板类型:"
      ></t-form-item>
      <t-form-item :value.sync="form.companyName" width prop="companyName" label="公司名称:"></t-form-item>
      <t-form-item
        :value.sync="form.companyLogoList"
        :limit="1"
        width
        accept="image/*"
        type="upload"
        prop="companyLogoList"
        label="公司logo:"
        list-type="picture"
      ></t-form-item>
      <t-form-item :value.sync="form.companyAddress" width prop="companyAddress" label="公司地点:"></t-form-item>
      <t-form-item :value.sync="form.deliveryAddress" width prop="deliveryAddress" label="交货地点:"></t-form-item>
      <t-form-item :value.sync="form.phone" width prop="phone" label="电话:"></t-form-item>
      <t-form-item :value.sync="form.fax" width prop="fax" label="传真:"></t-form-item>
      <t-form-item :value.sync="form.qq" width prop="qq" label="QQ:"></t-form-item>
      <t-form-item
        :value.sync="form.contractNumberRuleId"
        width
        :list="financeContractRuleGetComboBox"
        type="select"
        prop="contractNumberRuleId"
        label="合同编号规则:"
      ></t-form-item>
      <t-form-item :value.sync="form.annexPathList" :limit="1" width type="upload" prop="annexPathList" label="合同附件:"></t-form-item>
      <t-form-item :value.sync="form.modelRemark" prop="modelRemark" minRows="4" type="textarea" label="模板备注:"></t-form-item>
      <t-form-item
        :value.sync="form.contractClause"
        type="editor"
        :editorConfig="{
          initialFrameHeight: 196,
          initialFrameWidth: 646
        }"
        width
        prop="contractClause"
        label="合同条款:"
        ref="editor"
      ></t-form-item>
    </ElForm>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mixin } from './mixins'
export default {
  mixins: [mixin],
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
          label: '合同模板名称',
          value: 'modelName'
        },
        {
          label: '模板类型',
          value: 'modelType'
        },
        {
          label: '公司名称',
          value: 'companyName'
        },
        {
          label: '公司logo',
          value: 'companyLogoList'
        },
        {
          label: '公司地点',
          value: 'companyAddress'
        },
        {
          label: '交货地点',
          value: 'deliveryAddress'
        },
        {
          label: '电话',
          value: 'phone',
          type: 'phone'
        },
        {
          label: '传真',
          value: 'fax',
          type: 'fax'
        },
        {
          label: 'QQ',
          value: 'qq',
          type: 'qq'
        },
        {
          label: '合同编号规则',
          value: 'contractNumberRuleId'
        }
      ]),
      companyLogoList: [],
      annexPathList: [],
      isEdit: false
    }
  },
  created() {
    this.getFinanceContractRuleGetComboBox()
  },
  computed: {
    ...mapState('finance', ['modelTypeList', 'financeContractRuleGetComboBox'])
  },
  methods: {
    ...mapActions('finance', ['getFinanceContractRuleGetComboBox']),
    edit(params) {
      let vm = this
      if (params) {
        return vm.$api[`finance/financeContractModelInfo`]({
          contractModelId: params.contractModelId
        }).then(({ rows }) => {
          if (vm.utils.isArrLength(rows.companyLogoList)) {
            rows.companyLogoList = rows.companyLogoList.map(item =>
              JSON.parse(item)
            )
          }
          if (vm.utils.isArrLength(rows.annexPathList)) {
            rows.companyLogoList = rows.annexPathList.map(item =>
              JSON.parse(item)
            )
          }
          rows.companyLogoList || (rows.companyLogoList = [])
          rows.annexPathList || (rows.annexPathList = [])
          vm.form = rows
          if (params.copy) {
            delete vm.form.contractModelId
          } else {
            vm.isEdit = true
          }
          return Promise.resolve()
        })
      }
    },
    submit() {
      let vm = this
      let url = ''
      let params = vm.utils.clone(this.form)
      if (vm.utils.isArrLength(params.companyLogoList)) {
        params.companyLogoList = params.companyLogoList.map(item =>
          JSON.stringify(item)
        )
      }
      if (vm.utils.isArrLength(params.annexPathList)) {
        params.annexPathList = params.annexPathList.map(item =>
          JSON.stringify(item)
        )
      }
      if (params.contractClause) {
        params.contractClause = vm.$refs.editor.getEditHtml(
          params.contractClause
        )
      }
      if (vm.isEdit) {
        url = 'finance/financeContractModelUpdate'
      } else {
        url = 'finance/financeContractModelSave'
      }
      return {
        url,
        params
      }
    },
    view(val) {
      let vm = this
      vm.handleView(vm.utils.clone(vm.form))
    }
  }
}
</script>

<style lang='scss'>
.add {
  background: #fff;
}
</style>