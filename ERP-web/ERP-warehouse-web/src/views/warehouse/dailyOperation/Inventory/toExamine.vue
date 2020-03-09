<template>
  <!-- 审核 -->
  <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
    <el-form-item label="审核：" prop="passFlag">
      <el-radio-group v-model="ruleForm.passFlag" @change="change">
        <el-radio :label="1">通过</el-radio>
        <el-radio :label="0">不通过</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="原因："
      prop="reason"
      :rules="[
        { required:ruleForm.passFlag==1?false:true, message: '请输入原因', trigger: 'blur' },        
      ]"
    >
      <el-input type="textarea" v-model="ruleForm.reason" class="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
    name: 'toExamine',
    data() {
        return {
            ruleForm: {
                passFlag: 1,
                reason: ''
            }
        }
    },
    methods: {
        change() {
            this.$refs.ruleForm.validate()
        },
        resetForm() {
            this.$refs.ruleForm.resetFields()
        },
        submitForm(cb) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    cb && cb(this.ruleForm)
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss">
.textarea {
    textarea {
        height: 150px;
        resize: none;
    }
}
</style>