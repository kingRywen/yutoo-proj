<template>
  <div class="add-paypal-account">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <ElFormItem label="自定义账户名:" prop="customAccount">
        <el-input v-model="form.customAccount" placeholder class="normal-input"></el-input>
      </ElFormItem>
      <ElFormItem label="API用户名:" prop="apiName">
        <el-input v-model="form.apiName" placeholder class="normal-input"></el-input>
      </ElFormItem>
      <ElFormItem label="API密码:" prop="apiPassword">
        <el-input type="password" v-model="form.apiPassword" placeholder class="normal-input"></el-input>
      </ElFormItem>
      <ElFormItem label="API签名:" prop="apiSign">
        <el-input v-model="form.apiSign" placeholder class="normal-input"></el-input>
      </ElFormItem>
      <ElFormItem label="API运行环境:" prop="apiRunAmbient">
        <ElSelect v-model="form.apiRunAmbient" placeholder class="normal-input">
          <ElOption label="测试" :value="1"></ElOption>
          <ElOption label="正式" :value="2"></ElOption>
        </ElSelect>
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
          label: '自定义账户名',
          value: 'customAccount',
          type: 'email'
        },
        {
          label: 'API用户名',
          value: 'apiName'
        },
        {
          label: 'API密码',
          value: 'apiPassword',
          type: 'password'
        },
        {
          label: 'API签名',
          value: 'apiSign'
        },
        {
          label: 'API运行环境',
          value: 'apiRunAmbient'
        }
      ])
    }
  },
  methods: {
    edit(params) {
      let vm = this
      return vm.$api[`order/paypalAccountInfo`](params).then(({ rows }) => {
        vm.form = rows
        return Promise.resolve()
      })
    },
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
.add-paypal-account {
  background: #fff;
  .normal-input {
    width: 300px;
  }
}
</style>