<template lang="html">
    <el-form :model="form"  ref="form" label-width="100px">
        <el-form-item label="是否通过：">
            <el-radio-group v-model="form.state">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="0">不通过</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="原因：" prop="examineRemark"
            :rules="[
                 { required: form.state?false:true, message: '请填写原因', trigger: 'blur' }
            ]">
            <el-input type="textarea" v-model.trim="form.examineRemark" class="textarea"/>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            form: {
                state: 1,
                examineRemark: ''
            }
        }
    },
    methods: {
        submitForm(url, orderReturnIds, callback) {
            let params = {}
            if (url == 'refundExamine') {
                params = Object.assign({}, params, this.form, {
                    orderRefundIds: orderReturnIds
                })
            } else {
                params = Object.assign({}, params, this.form, {
                    orderReturnIds
                })
            }

            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$api['email/' + url](params).then(res => {
                        this.$message.success(res.msg)
                        callback && callback()
                    })
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.$refs.form.resetFields()
            this.form.examineResult = 1
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
