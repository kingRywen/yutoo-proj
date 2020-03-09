<template>
    <look-info :baseData="baseData" :baseConfig="baseConfig" :orderData="orderData" :orderConfig="orderConfig" ref="look"></look-info>
</template>

<script>
import LookInfo from '../common/look-info';
import { mixins } from '../common/mixins';
export default {
    mixins: [mixins],
    data() {
        const _this = this;
        return {
            baseData: {
                name: 'hello',
                image: 'https://img.mukewang.com/5ce253030001ec0716000540.jpg'
            },
            baseConfig: [
                { label: '申请人', value: 'applicantName' },
                { label: '付款金额', value: 'paymentAmount' },
                { label: '付款类型', value: 'paymentTypeName' },
                { label: '申请时间', value: 'alreadyTime' },
                { label: '当前状态', value: 'stateName' },
                { label: '财务审核人', value: 'examineName' },
                { label: '付款操作人', value: 'operationName' },
                { label: '付款凭证', value: 'fileList', type: 'image' },
                {
                    label: '付款备注',
                    value: 'reason',
                    showTooltip: true,
                    render: (h, scope) => {
                        return <p class="textOverflow">{scope.row.reason}</p>;
                    }
                }
            ],
            orderData: [],
            orderConfig: [
                {
                    label: '采购单号',
                    value: '',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this._purchasingOrderDetails.bind(
                                    _this,
                                    scope.row
                                )}
                            >
                                {scope.row.purchaseNumber}
                            </el-button>
                        );
                    }
                },
                {
                    label: '下单号',
                    value: '',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this._purchasingOrderInfo.bind(
                                    _this,
                                    scope.row,
                                    'look'
                                )}
                            >
                                {scope.row.lowerSingleNumber}
                            </el-button>
                        );
                    }
                },
                {
                    label: '交易号',
                    value: '',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this._tradingNumber.bind(
                                    _this,
                                    scope.row
                                )}
                            >
                                {scope.row.transactionNumber}
                            </el-button>
                        );
                    }
                },
                { label: '采购金额', value: 'purchaseAmount' },
                { label: '下单备注', value: 'remark' }
            ]
        };
    },
    components: { LookInfo },
    methods: {
        initData(row) {
            this.$api['finance/financeNetworkInfo']({
                networkPaymentId: row.networkPaymentId
            }).then(res => {
                this.baseData = res.rows;
                this.orderData = res.rows.purchaseList;
            });
        }
    }
};
</script>
<style>
.textOverflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
