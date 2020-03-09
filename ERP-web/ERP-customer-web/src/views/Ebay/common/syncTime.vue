<template>
  <div class="add">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <ElFormItem label="同步时间" prop="time">
        <twp-time :value.sync="form.time"></twp-time>
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
          label: '同步时间',
          value: 'time'
        }
      ])
    }
  },
  methods: {
    edit(params) {
      console.log(params)
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)

      vm.$refs['form'].validate(valid => {
        if (valid) {
          _data.modTimeFrom = _data.time[0]
          _data.modTimeTo = _data.time[1]
          delete _data.time
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
.add {
  background: #fff;
  .normal-input {
    width: 300px;
  }
}
</style>