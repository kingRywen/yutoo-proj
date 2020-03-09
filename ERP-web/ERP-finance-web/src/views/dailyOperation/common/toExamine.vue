<template>
    <!-- 审核 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
        <el-form-item label="审核：" prop="status">
            <el-radio-group v-model="ruleForm.state" @change="change">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="0">不通过</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="原因：" prop="reason" :rules="[
            { required:ruleForm.state==1?false:true, message: '请输入原因', trigger: 'blur' },        
        ]">
            <el-input type="textarea" v-model="ruleForm.reason" :rows="6"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    name: 'toExamine',
    data() {
        return {
            ruleForm: {
                state: 1,
                reason: ''
            }
        };
    },
    methods: {
        change() {
            this.$refs.ruleForm.validate();
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
        },
        submitForm(cb) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    cb && cb(this.ruleForm);
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
