<template lang="html">
    <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="采购单号：">
            {{info.purchaseNumber}}
        </el-form-item>
        <el-form-item label="产品SKU：">
            {{info.productSku}}
        </el-form-item>
        <el-form-item label="条码：">
            {{info.productBarCode }}
        </el-form-item>
        <el-form-item label="当前可退还最大数：">
            {{info.number}}
        </el-form-item>
        <el-form-item label="退回数量:" prop="returnQuantity">
            <el-input v-model.number="form.returnQuantity" type="number"></el-input>
        </el-form-item>
        <el-form-item label="退回运费:" prop="returnFreight">
            <el-input v-model.number="form.returnFreight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="退回金额:" prop="returnAmount">
            <el-input v-model.number="form.returnAmount" type="number"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        var validateNumber = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('数量不能为空'));
            }
            setTimeout(() => {
                var reg = /^[+]{0,1}(\d+)$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入数字值，必须为正整数'));
                } else {
                    callback();
                }
            }, 500);
        };
        return {
            form: {
                returnQuantity: '',
                returnFreight: '',
                returnAmount: ''
            },
            rules: {
                returnQuantity: [{ validator: validateNumber, trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm(callback) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    callback &&
                        callback(
                            Object.assign({}, this.form, {
                                purchaseProductBarCode: this.info
                                    .purchaseProductBarCode
                            })
                        );
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

<style lang="css">
</style>
