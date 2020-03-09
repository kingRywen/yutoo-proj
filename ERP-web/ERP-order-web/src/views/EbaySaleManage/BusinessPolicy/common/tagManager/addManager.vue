<template>
  <div class="add-manager">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <ElFormItem label="标签名称:" prop="labelName">
        <el-input v-model="form.labelName" placeholder class="normal-input"></el-input>
      </ElFormItem>
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
          label: '标签名称',
          value: 'labelName'
        }
      ])
    }
  },
  methods: {
    edit(params) {
      let vm = this
      vm.$api[`order/ebayLabelInfo`](params).then(({ rows = {} }) => {
        vm.form = rows
      })
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      vm.$refs.form.validate(valid => {
        if (valid) {
          cb && cb(_data)
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
.add-manager {
  background: #fff;
  .normal-input {
    width: 300px;
  }
}
</style>