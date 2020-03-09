<template>
  <!-- 打包人员 -->
  <el-form ref="form" :model="form" label-width="80px" size="medium" style="height:200px;">
    <el-form-item label="选择人员" prop="packagerId" :rules="[
            { required: true, message: '请选择人员', trigger: 'change' }      
            ]">
      <el-select v-model="form.packagerId" style="width:100%;">
        <el-option :label="item.label" :value="item.value" :key="item.label" v-for="item in $store.state.daily.personnel.packingList"/>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
    data() {
        return {
            form: {
                packagerId: ''
            }
        }
    },
    methods: {
        submitForm(cb) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    cb && cb(this.form.packagerId)
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
