<template lang="html">
    <el-form :model="form" :rules="rules" ref="form" label-width="110px" size="medium">
        <el-form-item label="邮箱：" prop="email">
            <el-input v-model='form.email'/>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
            <el-input v-model='form.address'/>
        </el-form-item>
        <el-form-item label="IP：">
            <el-input v-model='form.ip'/>
        </el-form-item>
        <el-form-item label="买家ID：" prop="memberId">
            <el-input v-model='form.memberId'/>
        </el-form-item>
        <el-form-item label="电话：">
            <el-input v-model='form.phone'/>
        </el-form-item>
        <el-form-item label="卡号：">
            <el-input v-model='form.cardNumber'/>
        </el-form-item>
        <el-form-item label="来源订单号：">
            <el-input v-model='form.orderNumber'/>
        </el-form-item>        
        <el-form-item :label="type==1?'理由：':'拉黑理由：'" prop="reason"
            :rules="[
              { required: type==1?false:true, message: '请输入拉黑理由',trigger: 'change'}
            ]">
            <el-input type="textarea" class="textarea" v-model='form.reason'/>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: {
        type: [String, Number],
        info: Object
    },
    data() {
        return {
            form: {
                email: null,
                address: null,
                ip: null,
                phone: null,
                cardNumber: null,
                memberId: null,
                orderNumber: null,
                reason: null
            },
            rules: {
                email: [
                    {
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'change'
                    },
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: 'change'
                    }
                ],
                address: [
                    { required: true, message: '请输入地址', trigger: 'change' }
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入电话号码',
                        trigger: 'change'
                    }
                ],
                cardNumber: [
                    { required: true, message: '请输入卡号', trigger: 'change' }
                ],
                memberId: [
                    {
                        required: true,
                        message: '请输入买家ID',
                        trigger: 'change'
                    }
                ],
                orderNumber: [
                    {
                        required: true,
                        message: '请输入订单号',
                        trigger: 'change'
                    }
                ]
            }
        }
    },
    watch: {
        info: {
            immediate: true,
            handler(val) {
                if (Object.keys(val).length) {
                    for (let k in this.form) {
                        for (let j in val) {
                            if (k == j) {
                                this.form[k] = val[j]
                            }
                        }
                    }
                }
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$emit('save', this.form)
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.form = {
                email: null,
                address: null,
                ip: null,
                phone: null,
                cardNumber: null,
                memberId: null,
                orderNumber: null,
                reason: null
            }
            this.$refs.form.resetFields()
        }
    }
}
</script>

<style lang="scss">
.textarea {
    textarea {
        height: 120px;
        resize: none;
    }
}
</style>
