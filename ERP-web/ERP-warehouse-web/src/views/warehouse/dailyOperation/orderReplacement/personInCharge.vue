<template>
    <!-- 负责人员 -->
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" size="medium">
            <el-form-item label="选择人员" prop="principalId">
                <el-select v-model="ruleForm.principalId">
                    <el-option :label="i.label" :value="i.value" v-for="(i,j) in list" :key="j"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            ruleForm: {
                principalId: ''
            },
            rules: {
                principalId: [
                    {
                        required: true,
                        message: '请选择负责人员',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    methods: {
        getprincipalList() {
            this.$api['warehouse/returnListPrincipal']().then(res => {
                this.list = res.rows.map(i => {
                    return {
                        label: i.principalName,
                        value: i.principalId
                    };
                });
            });
        },
        submitForm(cb) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    cb && cb(this.ruleForm);
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
        }
    }
};
</script>
