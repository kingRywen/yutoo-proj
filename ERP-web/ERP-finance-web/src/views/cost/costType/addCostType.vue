<template>
  <div class="add-cost-type">
    <ElForm :model="form" ref="form" size="small" label-width="116px">
      <t-form-item :value.sync="form.costTypeCusName" :rules="typeNameRules" prop="costTypeCusName" label="类型名称:"></t-form-item>
      <t-form-item
        :value.sync="form.platformIds"
        prop="platformIds"
        type="multiple"
        :list="platformActiveList"
        label="应用平台:"
        :disabled="disabled"
        :collapseTags="false"
        :rules="plateformRules"
      ></t-form-item>
      <t-form-item :value.sync="form.remark" prop="remark" type="textarea" label="备注:"></t-form-item>
      <t-form-item :value.sync="form.displayFlag" prop="displayFlag" type="check" label="是否展示:"></t-form-item>
      <t-form-item :value.sync="form.calculateFlag" prop="calculateFlag" type="check" label="是否纳入利润计算:"></t-form-item>
    </ElForm>
  </div>
</template>


<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      disabled: false,
      form: {
        displayFlag: 0,
        calculateFlag: 0
      },
      isEdit: false,
      plateformRules: [
        { required: true, message: '请选择应用平台', trigger: 'blur' }
      ],
      typeNameRules: [
        { required: true, message: '请输入类型名称', trigger: 'blur' }
      ]
    }
  },
  mounted() {},
  computed: {
    ...mapState('common', ['platformActiveList'])
  },
  methods: {
    edit(params) {
      let vm = this
      if (params == undefined) {
        return
      }
      vm.isEdit = true
      if (params.flag == 1) {
        vm.disabled = true
        vm.typeNameRules = [{ required: false }]
        vm.plateformRules = [{ required: false }]
      }
      return vm.$api[`finance/financeCostTypeGet`](params).then(
        ({ rows = {} }) => {
          vm.form = rows
          return Promise.resolve()
        }
      )
    },
    submit() {
      let url = ''
      let vm = this
      if (vm.isEdit) {
        url = 'finance/financeCostTypeUpdate'
      } else {
        url = 'finance/financeCostTypeAdd'
      }
      return {
        url: url,
        params: vm.form
      }
    }
  }
}
</script>

<style lang='scss'>
.add-cost-type {
  background: #fff;
}
</style>