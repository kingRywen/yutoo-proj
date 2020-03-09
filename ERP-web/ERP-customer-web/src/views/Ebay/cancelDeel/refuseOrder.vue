<template>
  <div class="refuse-order">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="80px">
      <ElFormItem prop="reasonStatus">
        <el-radio-group v-model="form.reasonStatus">
          <el-radio :label="1">已经发货</el-radio>
          <el-radio :label="2">其他原因</el-radio>
        </el-radio-group>
      </ElFormItem>
      <ElRow v-if="form.reasonStatus==1">
        <ElCol :span="12">
          <ElFormItem label="发货时间" prop="deliverTime">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.deliverTime"
              type="date"
              style="width: 160px"
              placeholder="选择日期"
            ></el-date-picker>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="追踪号" prop="traceNum">
            <ElInput v-model="form.traceNum" placeholder clearable></ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElFormItem label="详细原因" prop="detailReason">
        <ElInput :autosize="{minRows: 4, maxRows: 4}" v-model="form.detailReason" type="textarea" placeholder></ElInput>
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
          value: 'reasonStatus'
        },
        {
          label: '发货时间',
          value: 'deliverTime'
        },
        {
          label: '追踪号',
          value: 'traceNum'
        },
        {
          label: '详细原因',
          value: 'detailReason'
        }
      ]),
      dealCancelId: null,
      handleStatus: null
    }
  },
  watch: {},
  methods: {
    getDealCancelId(params) {
      this.dealCancelId = params.dealCancelId
      this.handleStatus = params.handleStatus || 0
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      _data.dealCancelId = vm.dealCancelId
      _data.handleStatus = vm.handleStatus
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
.refuse-order {
  background: #fff;
  .normal-input {
    width: 300px;
  }
}
</style>