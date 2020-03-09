<template>
    <look-info
        :baseData="baseData"
        :baseConfig="baseConfig"
        :orderData="orderData"
        :orderConfig="orderConfig"
        isBtnShow
        selection
        isHandleShow
        ref="info"
        id-name="purchaseId"
        :getType="1"
        title="关联采购单"
        @setQuota="setQuota"
        @setloanAmount="setloanAmount"
    ></look-info>
</template>

<script>
import LookInfo from 'Views/dailyOperation/common/look-info';
export default {
    data() {
        return {
            baseData: {
                totalAmount: '',
                loanAmount: null
            },
            orderData: [],
            orderConfig: [
                { label: '采购单号', value: 'purchaseNumber' },
                { label: '下单号', value: 'lowerSingleNumber' },
                { label: '采购金额', value: 'orderAmount' },
                { label: '下单备注', value: 'lowerSingleRemark' }
            ]
        };
    },
    computed: {
        baseConfig() {
            return [
                {
                    label: '可用额度（￥）',
                    value: 'totalAmount'
                },
                {
                    label: '借款总金额（￥）',
                    // type: 'inputNumber',
                    value: 'loanAmount'
                },
                {
                    label: '借款类型',
                    type: 'select',
                    value: 'loanType',
                    list: this.$store.state.finance.loadTypeList,
                    required: true
                },
                {
                    label: '备 注',
                    type: 'textarea',
                    value: 'remark'
                }
            ];
        }
    },
    components: { LookInfo },
    methods: {
        //設置可用额度
        setQuota(totalAmount) {
            this.baseData.totalAmount = totalAmount;
        },
        setloanAmount(loanAmount) {
            this.baseData.loanAmount = Number(loanAmount).toFixed(2);
        },
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
            this.$api['finance/financeLoanInfo']({
                loanId: row.loanId
            }).then(res => {
                // console.log(res.rows);
                let {
                    purchaseList,
                    loanAmount,
                    loanType,
                    remark,
                    totalAmount
                } = res.rows;

                this.$refs.info.teableForm.purchaseList = purchaseList.map(
                    item => {
                        return {
                            purchaseId: item.purchaseId,
                            purchaseAmount: item.purchaseAmount
                        };
                    }
                );
                this.orderData = purchaseList;
                this.baseData = {
                    totalAmount: totalAmount,
                    loanAmount
                };
                this.$refs.info.editLoad(loanType, remark);
            });
        }
    }
};
</script>
