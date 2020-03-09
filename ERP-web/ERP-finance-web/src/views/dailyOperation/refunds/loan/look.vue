<template>
    <look-info :baseData="baseData" :baseConfig="baseConfig" :orderData="orderData" :orderConfig="orderConfig" ref="look"></look-info>
</template>

<script>
import LookInfo from 'Views/dailyOperation/common/look-info';
import { mixins } from 'Views/dailyOperation/common/mixins';
export default {
    mixins: [mixins],
    name: 'rloadinfo',
    data() {
        const _this = this;
        return {
            baseData: {},
            baseConfig: [
                { label: '申请人', value: 'applicantName' },
                { label: '借款金额', value: 'loanAmount' },
                { label: '借款类型', value: 'loanTypeName' },
                { label: '申请时间', value: 'applyTime' },
                { label: '当前状态', value: 'stateName' },
                { label: '财务审核人', value: 'examineName' },
                { label: '借款操作人', value: 'operationName' },
                { label: '借款凭证', value: 'fileList', type: 'image' },
                { label: '借款备注', value: 'remark' },
                { label: '借款时间', value: 'loanTime' }
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
                { label: '采购金额', value: 'purchaseAmount' },
                {
                    label: '下单备注',
                    value: 'remark',
                    showTooltip: true,
                    render: (h, scope) => {
                        return <p class="textOverflow">{scope.row.remark}</p>;
                    }
                }
            ]
        };
    },
    components: { LookInfo },
    methods: {
        initData(row) {
            this.$api['finance/financeLoanInfo']({
                loanId: row.loanId
            }).then(res => {
                this.baseData = res.rows;
                this.orderData = res.rows.purchaseList;
            });
        }
    }
};
</script>
