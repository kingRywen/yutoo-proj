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
            baseData: {},
            baseConfig: [
                { label: '申请人', value: 'applicantName' },
                { label: '金额', value: 'expenseAmount' },
                { label: '申请时间', value: 'alreadyTime' },
                { label: '当前状态', value: 'expenseStateName' },
                {
                    label: '申请人报销凭证',
                    value: 'applicantVoucherList',
                    type: 'image'
                },
                { label: '财务审核人', value: 'examineName' },
                { label: '报销操作人', value: 'operationName' },
                {
                    label: '财务人员报销凭证',
                    value: 'fileList',
                    type: 'image'
                },
                { label: '报销备注', value: 'remark' },
                { label: '报销时间', value: 'expenseTime' }
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
            this.$api['finance/financeExpenseInfo']({
                expenseId: row.expenseId
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
