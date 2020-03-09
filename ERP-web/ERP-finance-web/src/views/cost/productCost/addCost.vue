<template>
  <div class="add-cost">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <t-form-item :value.sync="form.startTime" prop="startTime" type="singleTime" label="开始时间:"></t-form-item>
      <t-form-item
        v-for="item in fieldsList"
        :key="item.id"
        :value.sync="form[item.value]"
        :prop="item.value"
        :label="item.label"
        type="number"
      ></t-form-item>
    </ElForm>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      rules: {},
      fieldsList: [],
      isEdit: false
    }
  },
  async created() {
    let vm = this
    await vm.$api[`finance/financeProductCostTypeField`]({}).then(
      ({ rows = [] }) => {
        vm.fieldsList = rows.map(item => {
          return {
            label: item.name,
            value: item.fieldName
          }
        })
      }
    )
  },
  methods: {
    edit({ productIds = [], productId, dataId, copy }) {
      let vm = this
      if (!copy) {
        console.log(productIds)
        if (vm.utils.isEmpty(productId)) {
          vm.form.productIds = productIds
          console.log(vm.form)
          return
        }
      }
      if ((!vm.utils.isEmpty(productId) || copy) && !vm.utils.isEmpty(dataId)) {
        vm.$api[`finance/financeProductCostTypeGet`]({
          dataId
        }).then(({ rows = {} }) => {
          vm.form = rows

          if (copy) {
            vm.form.productIds = [vm.form.productId]
            delete vm.form.productId
            delete vm.form.dataId
          } else {
            vm.isEdit = true
          }
        })
      }
    },
    submit() {
      let vm = this
      let url = ''
      if (vm.isEdit) {
        url = 'finance/financeProductCostTypeEdit'
      } else {
        url = 'finance/financeProductCostTypeBatchAdd'
      }
      return {
        url,
        params: vm.utils.clone(vm.form)
      }
    }
  }
}
</script>

<style lang='scss'>
.add-cost {
  background: #fff;
}
</style>