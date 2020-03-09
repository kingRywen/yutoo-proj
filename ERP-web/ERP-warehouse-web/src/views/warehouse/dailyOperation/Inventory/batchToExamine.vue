<template>
    <!-- 批量审核 -->
    <el-form :model="ruleForm" ref="ruleForm" :label-width="labelWidth">
        <el-form-item label="审核：" prop="passFlag">
            <el-radio-group v-model="ruleForm.passFlag" @change="change" :disabled="disabled">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="0">不通过</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="原因：" prop="reason" :rules="[
        { required:ruleForm.passFlag==1?false:true, message: '请输入原因', trigger: 'blur' },        
      ]">
            <el-input type="textarea" v-model="ruleForm.reason" class="textarea" :disabled="disabled"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    name: 'toExamine',
    props: {
        labelWidth: {
            type: String,
            default: '100px'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => {
                return {
                    passFlag: 1,
                    reason: ''
                };
            }
        }
    },
    data() {
        return {
            ruleForm: {
                passFlag: 1,
                reason: ''
            }
        };
    },
    watch: {
        params: {
            handler(val) {
                if (Object.keys(val).length) {
                    this.ruleForm.passFlag = this.disabled ? val.passFlag : 1;
                    this.ruleForm.reason = this.disabled ? val.reason : '';
                }
            },
            immediate: true
        }
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

<style lang="scss">
.textarea {
    textarea {
        height: 150px;
        resize: none;
    }
}
</style>