<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" size="small">
        <el-form-item :label="_type+'方式：'" prop="mode" v-if="type!==3">
            <el-select v-model="ruleForm.mode" placeholder="请选择" @change="changeMode">
                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in modeList"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="账号：" prop="accountId" v-if="type!==3">
            <el-select v-model="ruleForm.accountId" placeholder="请选择">
                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in accountNumberList"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="'上传'+_type+'凭证：'" prop="fileList">
            <el-upload action="/" accept=".jpg, .png" :limit="5" :before-upload="handleBeforeUpload" :on-exceed="handleExceed" :on-change="handleChange" :file-list="ruleForm.fileList" :on-remove="handleRemove" :auto-upload="false">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark" :rows="6"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
/* eslint-disable */

import { oss } from '@yutoo/yutoo/utils/utils.umd.min';
import storage from 'Utils/saver';
import { CONST_PORT_CONFIG } from 'Config';

export default {
    data() {
        const _this = this;
        return {
            type: 1,
            modeList: [],
            accountNumberList: [],
            ruleForm: {
                mode: null,
                accountId: null,
                remark: null,
                fileList: []
            },
            rules: {
                mode: [
                    {
                        required: true,
                        message: '请选择方式',
                        trigger: 'change'
                    }
                ],
                accountId: [
                    {
                        required: true,
                        message: '请选择账号',
                        trigger: 'change'
                    }
                ],
                fileList: [
                    {
                        required: true,
                        message: '请上传凭证',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    computed: {
        _type() {
            switch (this.type) {
                case 0:
                    return '借款';
                    this.modeList = this.$store.state.finance.loadTypeList;
                case 1:
                    this.modeList = this.$store.state.finance.paymentModeList;
                    return '付款';
                case 2:
                    return '还款';
                case 3:
                    return '退款';
                default:
                    break;
            }
        }
    },
    methods: {
        handleBeforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 2MB!',
                    type: 'warning'
                });
            }
            return isLt2M ? true : false;
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 5 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        handleRemove(file, fileList) {
            this.ruleForm.fileList = fileList;
        },
        handleChange(file, fileList) {
            this.ruleForm.fileList = fileList;
        },
        submitForm(cb) {
            this.$refs.ruleForm.validate(async valid => {
                if (valid) {
                    try {
                        let { path } = await this.getPath();
                        let url = await oss.batchUpload(
                            this.ruleForm.fileList.map(el => el.raw),
                            path,
                            CONST_PORT_CONFIG.PRODUCT_URL +
                                '/img/get/oss/signature',
                            null,
                            storage.get('local', 'token')
                        );
                        let obj = { ...this.ruleForm };
                        obj.fileList = url;
                        if (this.type == 3) {
                            cb &&
                                cb({
                                    fileList: url,
                                    remark: this.ruleForm.remark
                                });
                        } else {
                            cb && cb(obj);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
        },

        initData(type) {
            // type 0借款 1付款  2还款 3退款
            this.type = type;
        },
        changeMode(val) {
            this.getAccountNumber(val);
            this.ruleForm.accountId = null;
        },
        //获取账号
        getAccountNumber(paymentMode) {
            this.$api['finance/financePaymentAccountNumber']({
                paymentMode
            }).then(res => {
                this.accountNumberList = res.rows.map(i => {
                    return {
                        label: i.name,
                        value: i.id
                    };
                });
            });
        },
        getPath() {
            return this.$api['finance/financeGlobalFilePath']().then(res => {
                return res;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>

