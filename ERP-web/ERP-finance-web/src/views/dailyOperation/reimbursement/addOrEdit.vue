<template>
    <look-info :baseData="baseData" :baseConfig="baseConfig" :orderData="orderData" :orderConfig="orderConfig" isBtnShow selection isHandleShow ref="info" id-name="purchaseId" :getType="2" title="关联采购单"></look-info>
</template>

<script>
import LookInfo from '../common/look-info';
export default {
    data() {
        return {
            baseData: {},
            baseConfig: [
                {
                    label: '报销金额（￥）',
                    type: 'inputNumber',
                    value: 'expenseAmount',
                    required: true,
                    validator: (rule, value, callback) => {
                        if (!value) {
                            return callback(new Error('报销金额不能为空'));
                        }
                        callback();
                    }
                },
                {
                    label: '备注',
                    type: 'textarea',
                    value: 'remark'
                },
                {
                    label: '凭证',
                    type: 'upload',
                    value: 'fileList',
                    required: true,
                    props: {
                        listType: 'picture-card'
                    },
                    event: {}
                }
            ],
            orderData: [],
            orderConfig: [
                { label: '采购单号', value: 'purchaseNumber' },
                { label: '下单号', value: 'lowerSingleNumber' },
                { label: '采购金额', value: 'orderAmount' },
                { label: '下单备注', value: 'lowerSingleRemark' }
            ]
        };
    },
    components: { LookInfo },
    methods: {
        submitForm(cb) {
            this.$refs.info.submitForm(val => {
                console.log(val);
                cb && cb(val);
            });
        },
        resetForm() {
            this.$refs.info.resetForm();
        },
        edit(row) {
            this.$api['finance/financeExpenseInfo']({
                expenseId: row.expenseId
            }).then(res => {
                const {
                    expenseAmount,
                    alreadyRemark,
                    applicantVoucherList,
                    purchaseList
                } = res.rows;
                this.$refs.info.editReimbursement(
                    expenseAmount,
                    alreadyRemark,
                    applicantVoucherList,
                    purchaseList
                );
            });
        }
    }
};
</script>
