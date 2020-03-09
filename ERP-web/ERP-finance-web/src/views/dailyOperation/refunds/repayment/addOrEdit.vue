<template>
    <look-info :baseData="baseData" :baseConfig="baseConfig" :orderData="orderData" :orderConfig="orderConfig" isBtnShow selection isHandleShow ref="info" id-name="loanId" title="关联借款单"></look-info>
</template>

<script>
import LookInfo from 'Views/dailyOperation/common/look-info';
export default {
    data() {
        return {
            baseData: {},
            baseConfig: [
                {
                    label: '还款金额',
                    type: 'inputNumber',
                    value: 'repaymentAmount',
                    required: true
                },
                {
                    label: '备 注',
                    type: 'textarea',
                    value: 'applicantRemark'
                }
            ],
            orderData: [],
            orderConfig: [
                { label: '借款单号', value: 'loanNumber' },
                { label: '借款金额', value: 'loanAmount' },
                { label: '需还款金额', value: 'unpaidAmount' },
                { label: '已还款金额', value: 'repaymentAmount' }
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
            this.$api['finance/financeRepaymentInfo']({
                repaymentId: row.repaymentId
            }).then(res => {
                this.$refs.info.editRepayment(
                    res.rows.repaymentAmount,
                    res.rows.applicantRemark
                );
                this.orderData = res.rows.loans;
            });
        }
    }
};
</script>
