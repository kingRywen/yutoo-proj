<template>
    <!-- 订单退款申请 -->
    <div class="application">
        <yt-page
            url="finance/financeRefundList"
            reserveSelection="refundId"
            :tableConfig="tableConfig"
            :searchConfig="searchConfig"
            :btnConfig="btnConfig"
            :searchData="searchData"
            @submitForm="submitForm"
            @selectChange="selectChange"
            ref="page"
            @updatedSearch="updatedSearch"
        >
            <template slot="tableLeft">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top" v-for="(item,j) in scope.row.buttonList" :key="j">
                            <template slot="content">
                                <template v-if="item.key==4">
                                    <p style="text-align: center;">API退款失败是否重新发起退款</p>
                                    <div style="text-align: center; margin: 0">
                                        <el-button size="mini" @click.stop="relaunch(scope.row)">重新发起</el-button>
                                        <el-button type="primary" size="mini" @click="refund(scope.row)">录入退款凭证</el-button>
                                    </div>
                                </template>
                                <template v-else>{{item.value}}</template>
                            </template>
                            <el-button type="text" icon="el-icon-warning" class="hint" v-if="item.key==4"></el-button>
                            <i class="iconBtn" :class="item.data" v-else @click.stop="tableBtn(item.key,scope.row)"></i>
                        </el-tooltip>

                        <!-- <el-tooltip effect="dark" content="查看" placement="top">
                            <i class="iconBtn el-icon-search" @click="look(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="审核" placement="top">
                            <i class="iconBtn el-icon-zoom-in" @click="singleToExamine(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="退款" placement="top">
                            <i class="iconBtn el-icon-goods" @click="refund(scope.row)"></i>
                        </el-tooltip>-->

                        <!-- <el-tooltip placement="top">
                            <template slot="content">
                                <p style="text-align: center;">API退款失败是否重新发起退款</p>
                                <div style="text-align: center; margin: 0">
                                    <el-button size="mini" @click.stop="relaunch(scope.row)">重新发起</el-button>
                                    <el-button type="primary" size="mini" @click="refund(scope.row)">录入退款凭证</el-button>
                                </div>
                            </template>
                            <el-button type="text" icon="el-icon-warning" class="hint"></el-button>
                        </el-tooltip>-->
                    </template>
                </el-table-column>
            </template>
        </yt-page>
    </div>
</template>
<script>
/* eslint-disable */
import { mixins } from '../common/mixins';
import { mapActions } from 'vuex';
const ORNOT = [{ label: '是', value: 1 }, { label: '否', value: 0 }];
export default {
    mixins: [mixins],
    data() {
        const _this = this;
        return {
            tableConfig: [
                { value: 'createTime', label: '下单日期', width: '140px' },
                { value: 'refundTime', label: '退款日期', width: '140px' },
                { value: 'storeName', label: '店铺' },
                { value: 'examineStateName', label: '状态', width: '100px' },
                {
                    value: '',
                    label: '订单号',
                    width: '130px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this._orderInfo.bind(
                                    _this,
                                    scope.row
                                )}
                            >
                                {scope.row.orderNumber}
                            </el-button>
                        );
                    }
                },
                { value: 'isFBA', label: 'FBA订单' },
                { value: 'orderAmount', label: '订单金额' },
                { value: 'productZh', label: '产品中文名', width: '200px' },

                { value: 'productSku', label: '产品SKU', width: '200px' },
                { value: 'customerName', label: '客户名称' },
                { value: 'refundStateName', label: '退款状态' },
                { value: 'refundMoney', label: '退款金额' },

                { value: 'refundTypeName', label: '退款类型', width: '100px' },
                { value: 'cargoHandlerName', label: '货物处理' },
                { value: 'operationName', label: '退款操作人', width: '100px' },
                {
                    value: 'apiRefundFlagName',
                    label: '是否API退款',
                    width: '120px'
                }
            ],
            btnConfig: [
                {
                    name: '退款批量审核',
                    disabled: () => {
                        return this.refundIds.length ? false : true;
                    },
                    fn: () => {
                        this._openToExamine('批量审核');
                    }
                },
                {
                    name: '当前条件导出数据',
                    fn: () => {
                        let p = {};
                        for (let k in this.exportParams) {
                            if (
                                k == 'time' &&
                                Array.isArray(this.exportParams[k]) &&
                                this.exportParams[k].length
                            ) {
                                p['refundStartTime'] = this.exportParams[k][0];
                                p['refundEndTime'] = this.exportParams[k][1];
                                continue;
                            }
                            if (
                                Array.isArray(this.exportParams[k]) &&
                                !this.exportParams[k].length
                            ) {
                                continue;
                            }
                            if (this.exportParams[k] === null) {
                                continue;
                            }
                            if (this.exportParams[k] === '') {
                                continue;
                            }
                            p[k] = this.exportParams[k];
                        }
                        if (!Object.keys(p).length && !this.refundIds.length) {
                            return this.$message.warning(
                                '请勾选需要导出的数据，或需要导出数据的某个时间段'
                            );
                        }
                        if (this.refundIds.length) {
                            return this._export('finance/financeRefundExport', {
                                ...p,
                                refundIds: this.refundIds
                            });
                        }
                        if (Object.keys(p).length) {
                            if (p.hasOwnProperty('refundStartTime')) {
                                return this._export(
                                    'finance/financeRefundExport',
                                    {
                                        ...p,
                                        refundIds: this.refundIds
                                    }
                                );
                            } else {
                                return this.$message.warning(
                                    '请勾选需要导出的数据，或需要导出数据的某个时间段'
                                );
                            }
                        }
                    }
                }
            ],
            visible: false,
            refundIds: [],
            refundId: null,
            storeList: [],
            refundReasonList: [],
            exportParams: {}
        };
    },
    computed: {
        searchConfig() {
            return [
                {
                    placeholder: '订单来源店铺（多选）',
                    value: 'storeIds',
                    type: 'multiple',
                    children: this.storeList
                },
                // {
                //     placeholder: '退款原因（多选）',
                //     value: 'refundReasons',
                //     type: 'multiple',
                //     children: []
                // },
                {
                    placeholder: '退款原因（多选）',
                    type: 'cascader',
                    value: 'refundReasons',
                    changeOnSelect: true,
                    style: {
                        width: '190px'
                    },
                    children: this.refundReasonList,
                    props: {
                        label: 'name',
                        value: 'refundReasonId',
                        children: 'child',
                        multiple: true
                    }
                },
                {
                    placeholder: '产品SKU',
                    value: 'productSku',
                    type: 'input'
                },
                {
                    placeholder: '订单号',
                    value: 'orderNumber',
                    type: 'input',
                    style: {
                        width: '255px'
                    }
                },
                {
                    placeholder: 'ASIN',
                    value: 'asin',
                    type: 'input'
                },
                {
                    placeholder: '客戶ID',
                    value: 'customerId',
                    type: 'input',
                    style: {
                        width: '100px'
                    }
                },
                {
                    placeholder: '退款操作人',
                    value: 'operationId',
                    type: 'select',
                    style: {
                        width: '140px'
                    },
                    children: this.$store.state.finance.rtHandleOperator
                },
                {
                    placeholder: '是否API退款',
                    value: 'apiRefundFlag',
                    type: 'select',
                    children: ORNOT,
                    style: {
                        width: '130px'
                    }
                },
                {
                    label: '退款时间',
                    value: 'time',
                    type: 'time'
                },
                {
                    label: '下单日期',
                    value: 'time1',
                    type: 'time'
                },

                {
                    placeholder: '退款类型',
                    value: 'refundType',
                    type: 'select',
                    children: this.$store.state.finance.refundTypeList
                },

                {
                    placeholder: '退款状态',
                    value: 'refundState',
                    type: 'select',
                    style: {
                        width: '150px'
                    },
                    children: ORNOT
                }
            ];
        }
    },
    methods: {
        ...mapActions('finance', ['getGlobalSelect', 'getOperator']),
        updatedSearch(val) {
            this.exportParams = { ...val };
        },
        tableBtn(key, row) {
            switch (key) {
                case 1:
                    this.look(row);
                    break;
                case 2:
                    this.singleToExamine(row);
                    break;
                case 3:
                    this.refund(row);
                    break;
                case 4:
                    this.relaunch(row); //重新发起
                    break;
                case 5:
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
            this.refundId = row.refundId;
            this._openToExamine('审核');
        },
        //退款
        refund(row) {
            this.refundId = row.refundId;
            this.$refs.page.$dialog({
                title: '退款',
                visible: true,
                width: '500px',
                component: () => import('../common/handle'),
                fnName: 'initData',
                params: 3
            });
        },
        //重新发起
        relaunch(row) {
            this.$api['finance/financeRefundRelaunch']({
                refundId: row.refundId
            }).then(res => {
                this._notice(res.msg);
            });
        },
        //查看
        look(row) {
            this.$refs.page.$dialog({
                title: '查看',
                visible: true,
                component: () => import('./look'),
                display: false,
                fnName: 'initData',
                params: row
            });
        },

        searchData(val) {
            let p = {};
            for (let k in val) {
                if (k == 'time' && Array.isArray(val[k])) {
                    p['refundStartTime'] = val[k][0];
                    p['refundEndTime'] = val[k][1];
                    continue;
                }
                if (k == 'time1' && Array.isArray(val[k])) {
                    p['startTime'] = val[k][0];
                    p['endTime'] = val[k][1];
                    continue;
                }
                p[k] = val[k];
            }
            return p;
        },
        submitForm(params, title) {
            console.log(params, title);
            switch (title) {
                case '批量审核':
                    this._toExamine('finance/financeRefundExamine', {
                        ...params,
                        refundIds: this.refundIds
                    });
                    break;
                case '审核':
                    this._toExamine('finance/financeRefundExamine', {
                        ...params,
                        refundIds: Array.of(this.refundId)
                    });
                    break;
                case '退款':
                    this.$api['finance/financeRefundRefund']({
                        ...params,
                        refundId: this.refundId
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                default:
                    break;
            }
        },
        selectChange(val) {
            this.refundIds = val.map(i => i.refundId);
        }
    },
    created() {
        this.getGlobalSelect();
        this.getOperator();
        this.$api['order/refundReasonGetReasonList']().then(res => {
            this.refundReasonList = res.rows;
        });
        this.$api['product/store_list_all']().then(res => {
            let list = [];
            res.rows.forEach(i => {
                list = list.concat(i.stores.map(j => j));
            });
            let result = list.map(i => {
                return {
                    label: i.name,
                    value: i.storeId
                };
            });
            this.storeList = result;
        });
    }
};
</script>
<style lang="scss">
.application {
    .hint {
        overflow: hidden;
        i {
            font-size: 16px;
            padding: 4px 4px;
            cursor: pointer;
            color: #f56c6c;
            animation: hint 2s;
        }
    }
}
@keyframes hint {
    0% {
        transform: none;
    }

    15% {
        transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
    }

    30% {
        transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
    }

    45% {
        transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
    }

    60% {
        transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
    }

    75% {
        transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
    }

    100% {
        transform: none;
    }
}
</style>


