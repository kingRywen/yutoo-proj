<template>
    <!-- 冲账管理 -->
    <div>
        <yt-page
            url="finance/financeRushList"
            reserveSelection="rushId"
            :tableConfig="tableConfig"
            :searchConfig="searchConfig"
            :btnConfig="btnConfig"
            :searchData="searchData"
            @submitForm="submitForm"
            @selectChange="selectChange"
            leftCustom
            customLocal="financerefundsRush"
            ref="page"
        >
            <template slot="tableLeft">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="item.value" placement="top" v-for="(item,j) in scope.row.buttonList" :key="j">
                            <i class="iconBtn" :class="item.data" @click="tableBtn(item.key,scope.row)"></i>
                        </el-tooltip>

                        <!-- <el-tooltip effect="dark" content="查看" placement="top">
                            <i class="iconBtn el-icon-search" @click="lookOrRush(scope.row,0)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="冲账" placement="top">
                            <i class="iconBtn el-icon-tickets" @click="lookOrRush(scope.row,1)"></i>
                        </el-tooltip>-->
                    </template>
                </el-table-column>
            </template>
        </yt-page>
    </div>
</template>
<script>
import { mixins } from 'Views/dailyOperation/common/mixins';
export default {
    mixins: [mixins],
    data() {
        const _this = this;
        return {
            tableConfig: [
                {
                    value: '',
                    label: '关联付/借款申请单号',
                    width: '150px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this.relation.bind(_this, scope.row)}
                            >
                                {scope.row.relationNumber}
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
                { value: 'endTime', label: '采购完结时间', width: '140px' },

                { value: 'lowerSingleAmount', label: '下单金额' },
                { value: 'pinAmount', label: '销单金额' },
                { value: 'loanAmount', label: '借款金额' },
                { value: 'alreadyAmount', label: '已冲金额' },

                { value: 'canAmount', label: '未冲金额' },
                { value: 'canAmount', label: '可冲金额' },
                { value: 'lowerSinglePersonName', label: '下单人' },
                {
                    value: 'lowerSingleTime',
                    label: '下单时间',
                    width: '140px',
                    showOverflowTooltip: false
                },
                {
                    value: 'pinTime',
                    label: '销单时间',
                    width: '140px',
                    showOverflowTooltip: false
                },
                { value: 'operationName', label: '冲账操作人', width: '130px' },
                { value: 'rushTime', label: '冲账时间' },
                { value: 'rushStateName', label: '状态' }
            ],
            btnConfig: [
                {
                    name: '导出',
                    fn: () => {
                        this._export('finance/financeRushExport', {
                            rushIds: this.rushIds
                        });
                    }
                }
            ],
            rushId: null,
            rushIds: []
        };
    },
    computed: {
        searchConfig() {
            return [
                {
                    placeholder: '下单号',
                    value: 'lowerSingleNumber',
                    type: 'input',
                    style: {
                        width: '140px'
                    }
                },
                {
                    placeholder: '付款类型',
                    value: 'paymentType',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: this.$store.state.finance.paymentTypeList
                },
                {
                    placeholder: '下单人',
                    value: 'lowerSinglePerson',
                    type: 'select',
                    style: {
                        width: '110px'
                    },
                    children: this.$store.state.finance.rtHandleOperator
                },
                {
                    placeholder: '采购单状态',
                    value: 'purchaseState',
                    type: 'select',
                    style: {
                        width: '140px'
                    },
                    children: this.$store.state.finance.purchaseStateList
                },
                {
                    placeholder: '状态',
                    value: 'state',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: this.$store.state.finance.rushStateList
                },
                {
                    label: '采购单完结时间：',
                    value: 'time1',
                    style: {
                        width: '200px'
                    },
                    type: 'time'
                },
                {
                    label: '冲账时间：',
                    value: 'time',
                    type: 'time',
                    style: {
                        width: '200px'
                    }
                }
            ];
        }
    },
    methods: {
        tableBtn(key, row) {
            switch (key) {
                case 1:
                    this.lookOrRush(row, 0);
                    break;
                case 2:
                    this.lookOrRush(row, 1);
                    break;
                default:
                    break;
            }
        },
        relation(row) {
            if (row.jumpType == 2) {
                this.networkInfo(row);
            } else {
                this.loadInfo(row);
            }
        },
        //付款单详情
        networkInfo(row) {
            this.$refs.page.$dialog({
                title: '付款单详情 - [' + row.relationNumber + ']',
                visible: true,
                width: '980px',
                component: () => import('../../networkPurchase/look'),
                fnName: 'initData',
                params: row,
                display: false
            });
        },

        //借款单详情
        loadInfo(row) {
            this.$refs.page.$dialog({
                title: '借款单详情 - [' + row.relationNumber + ']',
                visible: true,
                width: '980px',
                component: () => import('../loan/look'),
                fnName: 'initData',
                params: row,
                display: false
            });
        },

        //
        lookOrRush(row, type) {
            this.rushId = row.rushId;
            let base = {
                visible: true,
                width: '980px',
                component: () => import('./lookOrRush'),
                fnName: 'initData'
            };
            //冲账
            if (type) {
                base = {
                    ...base,
                    title: '冲账',
                    params: { ...row, type }
                };
                //查看
            } else {
                base = {
                    ...base,
                    title: '冲账单详情 - [' + row.relationNumber + ']',
                    params: { ...row, type },
                    display: false
                };
            }
            this.$refs.page.$dialog(base);
        },
        searchData(val) {
            let p = {};
            for (let k in val) {
                if (k == 'time' && Array.isArray(val[k])) {
                    p['rushStartTime'] = val[k][0];
                    p['rushEndTime'] = val[k][1];
                    continue;
                }
                if (k == 'time1' && Array.isArray(val[k])) {
                    p['endStartTime'] = val[k][0];
                    p['endEndTime'] = val[k][1];
                    continue;
                }
                p[k] = val[k];
            }
            return p;
        },
        submitForm(params, title) {
            switch (title) {
                // eslint-disable-next-line
                case '冲账':
                    const { fileList, rushAmount } = params;
                    this.$api['finance/financeRushRush']({
                        fileList,
                        rushAmount,
                        rushId: this.rushId
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                default:
                    break;
            }
        },
        selectChange(val) {
            this.rushIds = val.map(i => i.rushIds);
        }
    },
    created() {}
};
</script>


