<template>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="margin-bottom: 50px;">
        <el-form-item label="类型：">
            <el-switch v-model="form.type" active-text="A4" inactive-text="条码" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="数量：" prop="amount">
            <el-input v-model.number="form.amount" type="amount"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data() {
        const validateAmount = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('数量不能为空'));
            }
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值，须为正整数'));
            } else {
                if (value < 0) {
                    callback(new Error('必须大于0'));
                } else {
                    callback();
                }
            }
        };
        return {
            form: {
                amount: '',
                type: '1'
            },
            rules: {
                amount: [{ validator: validateAmount, trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const { href } = this.$router.resolve({
                        name: 'codePrint',
                        query: {
                            amount: this.form.amount,
                            type: this.form.type
                        }
                    });
                    window.open(href, '_blank');
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.form.resetFields();
        }
    }
};
</script>
