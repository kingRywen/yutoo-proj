<template>
    <look-info :baseData="baseData" :isOrderShow="false" :baseConfig="baseConfig" ref="look"></look-info>
</template>

<script>
import LookInfo from 'Views/dailyOperation/common/look-info';
export default {
    data() {
        const _this = this;
        return {
            baseData: {},
            baseConfig: [
                { label: '申请人', value: 'applicantName' },
                { label: '还款金额', value: 'repaymentAmount' },
                { label: '还款类型', value: 'repaymentType' },
                { label: '申请时间', value: 'applyTime' },
                { label: '当前状态', value: 'stateName' },
                { label: '申请备注', value: 'applicantRemark' },
                {
                    label: '关联借款单号',
                    value: 'loanNumber',
                    event: (val, row) => {
                        _this.$refs.look.$dialog({
                            title: '借款单详情',
                            visible: true,
                            width: '980px',
                            component: () => import('../loan/look'),
                            fnName: 'initData',
                            params: row,
                            display: false
                        });
                    }
                },
                { label: '财务审核人', value: 'examineName' },
                { label: '还款操作人', value: 'operationName' },
                { label: '还款凭证', value: 'fileList', type: 'image' },
                { label: '还款备注', value: 'repaymentRemark' },
                { label: '还款时间', value: 'repaymentTime' }
            ]
        };
    },
    components: { LookInfo },
    methods: {
        initData(row) {
            this.$api['finance/financeRepaymentInfo']({
                repaymentId: row.repaymentId
            }).then(res => {
                this.baseData = res.rows;
            });
        }
    }
};
</script>
