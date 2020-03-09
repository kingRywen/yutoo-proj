<template>
    <!-- 网络采购付款 -->
    <div>
        <yt-page
            url="finance/financeNetworkList"
            reserveSelection="wmInventoryPlanId"
            :tableConfig="tableConfig"
            :searchConfig="searchConfig"
            :btnConfig="btnConfig"
            :searchData="searchData"
            @submitForm="submitForm"
            @selectChange="selectChange"
            ref="page"
        >
            <template slot="tableLeft">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="item.value" placement="top" v-for="(item,j) in scope.row.buttonList" :key="j">
                            <i class="iconBtn" :class="item.data" @click="tableBtn(item.key,scope.row)"></i>
                        </el-tooltip>

                        <!-- <el-tooltip effect="dark" content="查看" placement="top">
                            <i class="iconBtn el-icon-search" @click="look(scope.row)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="审核" placement="top">
                            <i class="iconBtn el-icon-zoom-in" @click="singleToExamine(scope.row)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="付款" placement="top">
                            <i class="iconBtn el-icon-tickets" @click="payment(scope.row)"></i>
                        </el-tooltip>-->
                    </template>
                </el-table-column>
            </template>
        </yt-page>
    </div>
</template>
<script>
import { mixins } from '../common/mixins';
import { mapActions } from 'vuex';
export default {
    mixins: [mixins],
    data() {
        const _this = this;
        return {
            tableConfig: [
                {
                    value: '',
                    label: '付款申请单号',
                    width: '130px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this.look.bind(_this, scope.row)}
                            >
                                {scope.row.networkPaymentNumber}
                            </el-button>
                        );
                    }
                },
                { value: 'paymentTypeName', label: '付款类型' },
                { value: 'supplierName', label: '供应商' },
                {
                    value: '',
                    label: '关联采购单号',
                    width: '130px',
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
                    value: '',
                    label: '关联下单号',
                    width: '130px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this._purchasingOrderInfo.bind(
                                    _this,
                                    scope.row,
                                    'page'
                                )}
                            >
                                {scope.row.lowerSingleNumber}
                            </el-button>
                        );
                    }
                },
                {
                    value: '',
                    label: '交易号',
                    width: '130px',
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
                { value: 'accountPeriodName', label: '账期' },
                { value: 'paymentAmount', label: '付款金额' },

                { value: 'alipayAccountName', label: '支付宝账号' },
                { value: 'applicantName', label: '申请人' },
                { value: 'operationName', label: '付款操作人' },
                { value: 'examineName', label: '财务审核人' },

                { value: 'stateName', label: '状态' },
                {
                    value: 'remark',
                    label: '备注',
                    showOverflowTooltip: true,
                    render: (h, scope) => {
                        return <p class="textOverflow">{scope.row.remark}</p>;
                    }
                }
            ],
            btnConfig: [
                {
                    name: '批量审核',
                    disabled: () => {
                        return this.networkPaymentIds.length ? false : true;
                    },
                    fn: () => {
                        this._openToExamine('批量审核');
                    }
                },
                {
                    name: '批量删除',
                    type: 'danger',
                    disabled: () => {
                        return this.networkPaymentIds.length ? false : true;
                    },
                    fn: () => {
                        this._remove('finance/financeNetworkRemove', {
                            networkPaymentIds: this.networkPaymentIds
                        });
                    }
                },
                {
                    name: '导出',
                    fn: () => {
                        this._export('finance/financeNetworkExport', {
                            networkPaymentIds: this.networkPaymentIds
                        });
                    }
                }
            ],
            networkPaymentIds: [],
            networkPaymentId: null
        };
    },
    computed: {
        searchConfig() {
            return [
                {
                    placeholder: '下单号',
                    value: 'lowerSingleNumber',
                    type: 'input'
                },
                {
                    placeholder: '付款类型',
                    value: 'paymentType',
                    type: 'select',
                    style: {
                        width: '140px'
                    },
                    children: this.$store.state.finance.paymentTypeList
                },
                {
                    placeholder: '申请时间',
                    value: 'time',
                    type: 'time'
                },
                {
                    placeholder: '付款申请人',
                    value: 'applicantId',
                    type: 'select',
                    children: this.$store.state.finance.rApplyOperator
                },
                {
                    placeholder: '付款操作人',
                    value: 'operationId',
                    type: 'select',
                    children: this.$store.state.finance.rtHandleOperator
                },
                {
                    placeholder: '付款状态',
                    value: 'state',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: this.$store.state.finance.paymentStateList
                },
                {
                    placeholder: '是否有交易号',
                    value: 'transactionNumberFlag',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: [
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                    ]
                }
            ];
        }
    },
    methods: {
        ...mapActions('finance', ['getGlobalSelect', 'getOperator']),
        tableBtn(key, row) {
            switch (key) {
                case 1:
                    this.look(row);
                    break;
                case 2:
                    this.singleToExamine(row);
                    break;
                case 3:
                    this.payment(row);
                    break;
                case 4:
                    this.reason(row);
                    break;
                default:
                    break;
            }
        },
        reason(row) {
            this.$alert(row.reason, '审核不通过理由', {
                confirmButtonText: '确定'
            });
        },
        //单个审核
        singleToExamine(row) {
            this.networkPaymentId = row.networkPaymentId;
            this._openToExamine('审核');
        },
        //查看
        look(row) {
            this.$refs.page.$dialog({
                title: '付款单详情 - [' + row.networkPaymentNumber + ']',
                visible: true,
                width: '980px',
                component: () => import('./look'),
                fnName: 'initData',
                params: row,
                display: false
            });
        },
        //付款
        payment(row) {
            this.networkPaymentId = row.networkPaymentId;
            this.$refs.page.$dialog({
                title: '付款',
                visible: true,
                width: '500px',
                component: () => import('Views/dailyOperation/common/handle'),
                fnName: 'initData',
                params: 1
            });
        },
        searchData(val) {
            let p = {};
            for (let k in val) {
                if (k == 'time' && Array.isArray(val[k])) {
                    p['alreadyStartTime'] = val[k][0];
                    p['alreadyEndTime'] = val[k][1];
                    continue;
                }
                p[k] = val[k];
            }
            return p;
        },
        submitForm(params, title) {
            switch (title) {
                case '批量审核':
                    this._toExamine('finance/financeNetworkExamine', {
                        ...params,
                        networkPaymentIds: this.networkPaymentIds
                    });
                    break;
                case '审核':
                    this._toExamine('finance/financeNetworkExamine', {
                        ...params,
                        networkPaymentIds: Array.of(this.networkPaymentId)
                    });
                    break;
                // eslint-disable-next-line
                case '付款':
                    const { mode, accountId, remark, fileList } = params;
                    this.$api['finance/financeNetworkPayment']({
                        networkPaymentId: this.networkPaymentId,
                        repaymentMode: mode,
                        accountId,
                        fileList,
                        remark
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                default:
                    break;
            }
        },
        selectChange(val) {
            this.networkPaymentIds = val.map(i => i.networkPaymentId);
        }
    },
    created() {
        this.getGlobalSelect();
        this.getOperator();
    }
};
</script>
<style lang="scss">
.textOverflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>


