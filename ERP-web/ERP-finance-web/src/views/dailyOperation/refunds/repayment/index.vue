<template>
    <!-- 还款管理 -->
    <div>
        <yt-page
            url="finance/financeRepaymentList"
            reserveSelection="repaymentId"
            :tableConfig="tableConfig"
            :searchConfig="searchConfig"
            :btnConfig="btnConfig"
            :searchData="searchData"
            @submitForm="submitForm"
            @selectChange="selectChange"
            ref="page"
            :leftCustom="false"
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

                        <el-tooltip effect="dark" content="还款" placement="top">
                            <i class="iconBtn el-icon-tickets" @click="repayment(scope.row)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="查看理由" placement="top">
                            <i class="iconBtn el-icon-view" @click="reason(scope.row)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="编辑" placement="top">
                            <i class="iconBtn el-icon-edit" @click="edit(scope.row)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="审核" placement="top">
                            <i class="iconBtn el-icon-zoom-in" @click="singleToExamine(scope.row)"></i>
                        </el-tooltip>-->
                    </template>
                </el-table-column>
            </template>
        </yt-page>
    </div>
</template>
<script>
/* eslint-disable */
import { mixins } from 'Views/dailyOperation/common/mixins';
export default {
    mixins: [mixins],
    data() {
        const _this = this;
        return {
            tableConfig: [
                {
                    value: '',
                    label: '还款单号',
                    width: '130px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this.look.bind(_this, scope.row)}
                            >
                                {scope.row.repaymentNumber}
                            </el-button>
                        );
                    }
                },
                {
                    value: '',
                    label: '关联借款单号',
                    width: '130px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this.loanInfo.bind(_this, scope.row)}
                            >
                                {scope.row.loanNumber}
                            </el-button>
                        );
                    }
                },
                { value: 'repaymentAmount', label: '还款金额' },
                { value: 'applicantName', label: '申请人' },

                { value: 'operationName', label: '还款操作人' },
                { value: 'applyTime', label: '申请时间' },
                { value: 'stateName', label: '状态' },
                {
                    value: 'applicantRemark',
                    label: '备注',
                    showTooltip: true,
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">
                                {scope.row.applicantRemark}
                            </p>
                        );
                    }
                }
            ],
            searchConfig: [
                {
                    placeholder: '关联借款单号',
                    value: 'loadNumber',
                    type: 'input'
                },
                {
                    label: '申请时间：',
                    value: 'time',
                    type: 'time'
                },
                {
                    placeholder: '还款申请人',
                    value: 'applicantId',
                    type: 'select',
                    style: {
                        width: '140px'
                    },
                    children: this.$store.state.finance.rApplyOperator
                },
                {
                    placeholder: '还款操作人',
                    value: 'operationId',
                    type: 'select',
                    style: {
                        width: '140px'
                    },
                    children: this.$store.state.finance.rtHandleOperator
                },
                {
                    placeholder: '还款状态',
                    value: 'state',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: this.$store.state.finance.repaymentStateList
                },
                {
                    placeholder: '还款单号',
                    value: 'repaymentNumber',
                    type: 'input'
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
                        return this.repaymentIds.length ? false : true;
                    },
                    fn: () => {
                        this._openToExamine('批量审核');
                    }
                },
                {
                    name: '删除',
                    type: 'danger',
                    disabled: () => {
                        return this.repaymentIds.length ? false : true;
                    },
                    fn: () => {
                        this._remove('finance/financeRepaymentRemove', {
                            repaymentIds: this.repaymentIds
                        });
                    }
                },
                {
                    name: '导出',
                    fn: () => {
                        this._export('finance/financeRepaymentExport', {
                            repaymentIds: this.repaymentIds
                        });
                    }
                }
            ],
            repaymentId: null,
            repaymentIds: []
        };
    },
    methods: {
        tableBtn(key, row) {
            switch (key) {
                case 1:
                    this.look(row);
                    break;
                case 2:
                    this.singleToExamine(row);
                    break;
                case 3:
                    this.repayment(row);
                    break;
                case 4:
                    this.edit(row);
                    break;
                case 5:
                    this.reason(row);
                    break;
                default:
                    break;
            }
        },
        //单个审核
        singleToExamine(row) {
            this.repaymentId = row.repaymentId;
            this._openToExamine('审核');
        },
        //查看理由
        reason(row) {
            this.$alert(row.reason, '审核不通过理由', {
                confirmButtonText: '确定'
            });
        },

        //編 輯
        edit(row) {
            this.repaymentId = row.repaymentId;
            this.$refs.page.$dialog({
                title: '编辑申请',
                visible: true,
                width: '980px',
                component: () => import('./addOrEdit'),
                fnName: 'edit',
                params: row
            });
        },

        //还款
        repayment(row) {
            this.repaymentId = row.repaymentId;
            this.$refs.page.$dialog({
                title: '还款',
                visible: true,
                width: '500px',
                component: () => import('Views/dailyOperation/common/handle'),
                fnName: 'initData',
                params: 2
            });
        },

        //还款单详情
        look(row) {
            this.$refs.page.$dialog({
                title: '还款单详情 - [' + row.repaymentNumber + ']',
                visible: true,
                width: '980px',
                component: () => import('./look'),
                fnName: 'initData',
                params: row,
                display: false
            });
        },
        //借款單詳情
        loanInfo(row) {
            this.$refs.page.$dialog({
                title: '借款单详情',
                visible: true,
                width: '980px',
                component: () => import('../loan/look'),
                fnName: 'initData',
                params: row,
                display: false
            });
        },

        searchData(val) {
            let p = {};
            for (let k in val) {
                if (k == 'time' && Array.isArray(val[k])) {
                    p['startTime'] = val[k][0];
                    p['endTime'] = val[k][1];
                    continue;
                }
                p[k] = val[k];
            }
            return p;
        },
        submitForm(params, title) {
            switch (title) {
                case '批量审核':
                    this._toExamine('finance/financeRepaymentExamine', {
                        ...params,
                        repaymentIds: this.repaymentIds
                    });
                    break;
                case '审核':
                    this._toExamine('finance/financeRepaymentExamine', {
                        ...params,
                        repaymentIds: Array.of(this.repaymentId)
                    });
                    break;
                case '添加申请':
                    this.$api['finance/financeRepaymentSave']({
                        repaymentAmount: params.repaymentAmount,
                        applicantRemark: params.applicantRemark,
                        loanList: params.purchaseList
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                case '编辑申请':
                    this.$api['finance/financeRepaymentUpdate']({
                        repaymentAmount: params.repaymentAmount,
                        applicantRemark: params.applicantRemark,
                        loanList: params.purchaseList,
                        repaymentId: this.repaymentId
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                case '还款':
                    const { accountId, fileList, mode, remark } = params;
                    this.$api['finance/financeRepaymentRepayment']({
                        repaymentMode: mode,
                        accountId,
                        fileList,
                        repaymentRemark: remark,
                        repaymentId: this.repaymentId
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                default:
                    break;
            }
        },
        selectChange(val) {
            this.repaymentIds = val.map(i => i.repaymentId);
        }
    },
    created() {}
};
</script>
<style>
.textOverflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>


