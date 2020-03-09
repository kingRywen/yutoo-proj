<template>
    <!-- 报销管理 -->
    <div>
        <yt-page
            url="finance/financeExpenseList"
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

                        <!-- <el-tooltip effect="dark" content="編 輯" placement="top">
                            <i class="iconBtn el-icon-edit" @click="edit(scope.row)"></i>
                        </el-tooltip>-->

                        <!-- <el-tooltip effect="dark" content="审核" placement="top">
                            <i class="iconBtn el-icon-zoom-in" @click="singleToExamine(scope.row)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="查看理由" placement="top">
                            <i class="iconBtn el-icon-view"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="查看" placement="top">
                            <i class="iconBtn el-icon-search" @click="look(scope.row)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="报销" placement="top">
                            <i class="iconBtn el-icon-tickets" @click="reimbursement(scope.row)"></i>
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
export default {
    mixins: [mixins],
    data() {
        const _this = this;
        return {
            tableConfig: [
                {
                    value: '',
                    label: '报销单号',
                    width: '130px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this.look.bind(_this, scope.row)}
                            >
                                {scope.row.expenseNumber}
                            </el-button>
                        );
                    }
                },
                { value: 'expenseStateName', label: '状态' },
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

                { value: 'expenseAmount', label: '报销金额' },
                { value: 'applicantName', label: '申请人' },
                { value: 'operationName', label: '报销操作人' },
                { value: 'alreadyTime', label: '申请时间', width: '140px' },

                { value: 'expenseTime', label: '报销时间', width: '140px' },
                {
                    value: 'remark',
                    label: '申请备注',
                    showOverflowTooltip: true,
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">
                                {scope.row.alreadyRemark}
                            </p>
                        );
                    }
                }
            ],
            btnConfig: [
                {
                    name: '添加申请',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '添加申请',
                            visible: true,
                            width: '980px',
                            component: () => import('./addOrEdit')
                        });
                    }
                },
                {
                    name: '批量审核',
                    disabled: () => {
                        return this.expenseIds.length ? false : true;
                    },
                    fn: () => {
                        this._openToExamine('批量审核');
                    }
                },
                {
                    name: '删除',
                    type: 'danger',
                    disabled: () => {
                        return this.expenseIds.length ? false : true;
                    },
                    fn: () => {
                        this._remove('finance/financeExpenseRemove', {
                            expenseIds: this.expenseIds
                        });
                    }
                },
                {
                    name: '导出',
                    fn: () => {
                        this._export('finance/financeExpenseExport', {
                            expenseIds: this.expenseIds
                        });
                    }
                }
            ],
            expenseIds: [],
            expenseId: null
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
                    placeholder: '申请时间',
                    value: 'time',
                    type: 'time'
                },
                {
                    placeholder: '报销申请人',
                    value: 'applicantId',
                    type: 'select',
                    children: this.$store.state.finance.rApplyOperator
                },
                {
                    placeholder: '报销操作人',
                    value: 'operationId',
                    type: 'select',
                    children: this.$store.state.finance.rtHandleOperator
                },
                {
                    placeholder: '报销状态',
                    value: 'state',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: this.$store.state.finance.expenseStateList
                },
                {
                    placeholder: '备 注',
                    value: 'remark',
                    type: 'input'
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
                    this.reimbursement(row);
                    break;
                case 4:
                    //查看理由
                    this.reason(row);
                    break;
                case 5:
                    //查看理由
                    this.edit(row);
                    break;
                default:
                    break;
            }
        },
        edit(row) {
            this.expenseId = row.expenseId;
            this.$refs.page.$dialog({
                title: '编辑申请',
                visible: true,
                width: '980px',
                component: () => import('./addOrEdit'),
                fnName: 'edit',
                params: row
            });
        },
        //查看理由
        reason(row) {
            this.$alert(row.reason, '审核不通过理由', {
                confirmButtonText: '确定'
            });
        },
        //报销
        reimbursement(row) {
            this.expenseId = row.expenseId;
            this.$refs.page.$dialog({
                title: '报销',
                visible: true,
                width: '500px',
                component: () => import('Views/dailyOperation/common/handle'),
                fnName: 'initData',
                params: 1
            });
        },

        //报销单详情
        look(row) {
            this.$refs.page.$dialog({
                title: '报销单详情 - [' + row.expenseNumber + ']',
                visible: true,
                width: '980px',
                component: () => import('./look'),
                fnName: 'initData',
                params: row,
                display: false
            });
        },

        //查看理由

        //单个审核
        singleToExamine(row) {
            this.expenseId = row.expenseId;
            this._openToExamine('审核');
        },
        searchData(val) {
            let p = {};
            for (let k in val) {
                if (k == 'time' && Array.isArray(val[k])) {
                    p['applicationStartTime'] = val[k][0];
                    p['applicationEndTime'] = val[k][1];
                    continue;
                }
                p[k] = val[k];
            }
            return p;
        },
        submitForm(params, title) {
            switch (title) {
                case '批量审核':
                    this._toExamine('finance/financeExpenseExamine', {
                        ...params,
                        expenseIds: this.expenseIds
                    });
                    break;
                case '审核':
                    this._toExamine('finance/financeExpenseExamine', {
                        ...params,
                        expenseIds: Array.of(this.expenseId)
                    });
                    break;
                case '添加申请':
                    this.$api['finance/financeExpenseSave']({
                        expenseAmount: params.expenseAmount,
                        alreadyRemark: params.remark,
                        applicantVoucherList: params.fileList,
                        purchaseIds: params.purchaseList
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                case '编辑申请':
                    this.$api['finance/financeExpenseUpdate']({
                        expenseAmount: params.expenseAmount,
                        alreadyRemark: params.remark,
                        applicantVoucherList: params.fileList,
                        purchaseIds: params.purchaseList,
                        expenseId: this.expenseId
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                case '报销':
                    const { accountId, fileList, mode, remark } = params;
                    this.$api['finance/financeExpenseExpense']({
                        repaymentMode: mode,
                        accountId,
                        fileList,
                        remark,
                        expenseId: this.expenseId
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                default:
                    break;
            }
        },
        selectChange(val) {
            this.expenseIds = val.map(i => i.expenseId);
            console.log(this.expenseIds);
        }
    },
    created() {
        this.getGlobalSelect();
        this.getOperator();
    }
};
</script>
<style >
.textOverflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>


