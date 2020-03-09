<template>
  <div class="remark">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="20px">
      <ElFormItem prop="remark">
        <el-input
          :autosize="{ minRows: 6, maxRows: 6}"
          v-model="form.remark"
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
          label: '备注',
          value: 'remark'
        }
      ]),
      returnId: null
    }
  },
  methods: {
    edit(params) {
      this.returnId = params.returnId
      return Promise.resolve()
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      _data.returnId = vm.returnId
      this.$refs.form.validate(valid => {
        if (valid) {
          cb && cb(_data)
        } else {
          console.log('error')
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.remark {
  background: #fff;
  .normal-input {
    width: 100%;
  }
}
</style>