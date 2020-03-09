<template>
  <div class="evaluate">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="20px">
      <ElFormItem prop="evaluateContent">
        <el-input
          :autosize="{ minRows: 6, maxRows: 6}"
          v-model="form.evaluateContent"
          type="textarea"
          placeholder
          class="normal-input"
        ></el-input>
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
          label: '差评原因备注',
          value: 'evaluateContent'
        }
      ]),
      evaluateId: null,
      remark: false
    }
  },
  methods: {
    getEvaluateId(params) {
      this.evaluateId = params.evaluateId
      this.remark = true
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      if (vm.remark) {
        _data = {
          remark: _data.evaluateContent,
          evaluateId: vm.evaluateId
        }
      }
      vm.$refs['form'].validate(valid => {
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
.evaluate {
  background: #fff;
  .normal-input {
    width: 300px;
  }
}
</style>