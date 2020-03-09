<template>
  <!-- 运输方式 -->
  <el-form ref="form" :model="form" label-width="80px" size="medium" style="height:200px;">
    <el-form-item label="运输方式" prop="transportId" :rules="[
            { required: true, message: '请选择运输方式', trigger: 'change' }      
            ]">
      <el-select v-model="form.transportId" style="width:100%;">
        <el-option :label="item.label" :value="item.value" :key="item.label" v-for="item in $store.state.daily.logisticTlist"/>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
    data() {
        return {
            form: {
                transportId: ''
            }
        }
    },
    methods: {
        submitForm(cb) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    cb && cb(this.form.transportId)
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.$refs.form.resetFields()
        }
    }
}
</script>
