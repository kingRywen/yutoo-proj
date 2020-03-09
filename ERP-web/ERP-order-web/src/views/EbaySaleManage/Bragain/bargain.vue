<template>
  <div class="bargain">
    <ElForm :model="form" ref="form" :rules="rules" label-width="120px">
      <ElFormItem label="Seller Response:" prop="message">
        <el-input v-model="form.message" type="textarea" placeholder></el-input>
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
          label: 'Seller Response',
          value: 'message'
        }
      ])
    }
  },
  methods: {
    submitForm(cb) {
      let vm = this
      vm.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(vm.$clone(vm.form))
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
.bargain {
  background: #fff;
}
</style>