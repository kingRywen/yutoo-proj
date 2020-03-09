<template>
  <div class="unpaid-case">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="80px">
      <ElFormItem label="选择店铺:" prop="storeIds">
        <ElSelect v-model="form.storeIds" multiple collapse-tags clearable placeholder="请选择">
          <ElOption v-for="item in storeEbayList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="选择店铺:" prop="customAccount">
        <el-radio-group v-model="form.disputeType">
          <el-radio :label="1" class="mt10">我想结束与买家的沟通</el-radio>
          <el-radio :label="2" class="mt10" style="margin-left: 0">者买家和我已经完成这个交易成功</el-radio>
        </el-radio-group>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script>
import mixins from '../mixins.js'
export default {
  mixins: [mixins],
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  methods: {
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
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
.unpaid-case {
  background: #fff;
  .mt10 {
    margin-top: 10px;
  }
  .normal-input {
    width: 260px;
  }
}
</style>