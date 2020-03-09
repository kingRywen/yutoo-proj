<template lang="html">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="">
        <el-form-item label="姓名：" prop="financialId">            
            <el-select v-model="form.financialId" style="width:100%;">
                <el-option :label="item.nickName" :value="item.userId" v-for="item in allHandleUser.procurement"  :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="支付宝账户：" prop="alipayAccount">
            <!-- <el-input v-model="form.alipayAccount"/> -->
            <el-select v-model.number="form.alipayAccount" style="width:100%;">
                <el-option :label="item.label" :value="item.value" v-for="item in alipayList" ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="现金借款额度：" prop="loanAmount">
            <el-input v-model.number="form.loanAmount"/>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="form.remark" class="textarea"/>
        </el-form-item>
        <el-form-item label="状态：" prop="state">
            <el-select v-model="form.state" style="width:100%;">
              <el-option label="激活" value="1"></el-option>
              <el-option label="未激活" value="0"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        financialList: {
            type: Array,
            default: () => []
        },
        info: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            form: {
                financialId: '',
                alipayAccount: '',
                loanAmount: '',
                remark: '',
                state: ''
            },
            rules: {
                financialId: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                alipayAccount: [
                    {
                        required: true,
                        message: '支付宝账户不能为空',
                        trigger: 'blur'
                    }
                ],
                loanAmount: [
                    {
                        required: true,
                        message: '借款额度不能为空',
                        trigger: 'blur'
                    },
                    { type: 'number', message: '借款额度须为数字值' }
                ],
                state: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            },
            alipayList: []
        };
    },
    watch: {
        info(val) {
            let iskeylength = Object.keys(val).length;
            if (iskeylength) {
                this.form.financialId = val.financialId;
                this.form.alipayAccount = +val.alipayAccount;
                this.form.loanAmount = val.loanAmount;
                this.form.remark = val.remark;
                this.form.state = val.state + '';
            }
        }
    },
    computed: {
        ...mapGetters('common', ['allHandleUser'])
    },
    methods: {
        submitForm(callback) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    callback && callback(this.form);
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        getalipayList() {
            this.$api['finance/financeAccountGetComboBox']().then(res => {
                this.alipayList = res.rows.map(i => {
                    return { label: i.name, value: i.id };
                });
                console.log(res);
            });
        }
    },
    mounted() {
        this.getalipayList();
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
