<template>
    <!-- 冲账和查看 -->
    <look-info :baseData="baseData" :baseConfig="_baseConfig" :orderData="orderData" :orderConfig="orderConfig" ref="info"></look-info>
</template>

<script>
import LookInfo from 'Views/dailyOperation/common/look-info';
import { mixins } from 'Views/dailyOperation/common/mixins';
export default {
    mixins: [mixins],
    data() {
        const _this = this;
        return {
            baseData: {},
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
                                    'info'
                                )}
                            >
                                {scope.row.lowerSingleNumber}
                            </el-button>
                        );
                    }
                },
                { label: '采购金额', value: 'purchaseAmount' },
                { label: '销单金额', value: 'pinAmount' }
                //
            ],
            type: null
        };
    },
    computed: {
        _baseConfig() {
            let base = [
                { label: '应冲账总额', value: 'shouldAmount' },
                { label: '已冲账总额', value: 'alreadyAmount' },
                { label: '未冲账总额', value: 'canAmount' },
                { label: '可冲账总额', value: 'canAmount' },
                { label: '当前状态', value: 'rushStateName' }
            ];
            if (this.type) {
                base = [
                    ...base,
                    {
                        label: '冲账金额',
                        type: 'inputNumber',
                        value: 'rushAmount',
                        required: true
                    },
                    {
                        label: '冲账凭证',
                        type: 'upload',
                        value: 'fileList',
                        required: true,
                        props: {
                            listType: 'picture-card'
                        }
                    }
                ];
            } else {
                base = [
                    ...base,
                    // { label: '冲账金额', value: 'rushAmount' },
                    { label: '冲账凭证', value: 'fileList', type: 'image' }
                ];
            }
            return base;
        }
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
        initData(row) {
            let { type } = row;
            this.type = type;
            //type true冲账  false查看
            this.$api['finance/financeRushInfo']({ rushId: row.rushId }).then(
                res => {
                    let {
                        purchaseNumber,
                        purchaseId,
                        lowerSingleNumber,
                        pinAmount,
                        purchaseAmount
                    } = res.rows;
                    this.orderData = [
                        {
                            purchaseNumber,
                            purchaseId,
                            lowerSingleNumber,
                            purchaseAmount,
                            pinAmount
                        }
                    ];
                    this.baseData = res.rows;
                }
            );
        }
    }
};
</script>
