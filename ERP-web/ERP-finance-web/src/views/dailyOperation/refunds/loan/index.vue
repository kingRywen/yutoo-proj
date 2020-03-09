<template>
    <!-- 借款管理 -->
    <div>
        <yt-page
            url="finance/financeLoanList"
            reserveSelection="loanId"
            :tableConfig="tableConfig"
            :searchConfig="searchConfig"
            :btnConfig="btnConfig"
            :searchData="searchData"
            @submitForm="submitForm"
            @selectChange="selectChange"
            :leftCustom="false"
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

                        <el-tooltip effect="dark" content="借款" placement="top">
                            <i class="iconBtn el-icon-tickets" @click="loan(scope.row)"></i>
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
import { mapActions } from 'vuex';
export default {
    mixins: [mixins],
    data() {
        const _this = this;
        return {
            tableConfig: [
                {
                    value: '',
                    label: '借款单号',
                    width: '130px',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this.look.bind(_this, scope.row)}
                            >
                                {scope.row.loanNumber}
                            </el-button>
                        );
                    }
                },
                { value: 'loanTypeName', label: '借款类型' },
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
                { value: 'accountPeriodName', label: '账期' },
                { value: 'loanAmount', label: '借款金额' },
                { value: 'applicantName', label: '申请人' },

                { value: 'operationName', label: '借款操作人', width: '100px' },
                { value: 'createTime', label: '申请时间', width: '140px' },
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
                        return this.loanIds.length ? false : true;
                    },
                    fn: () => {
                        this._openToExamine('批量审核');
                    }
                },
                {
                    name: '删除',
                    type: 'danger',
                    disabled: () => {
                        return this.loanIds.length ? false : true;
                    },
                    fn: () => {
                        this._remove('finance/financeLoanRemove', {
                            loanIds: this.loanIds
                        });
                    }
                },
                {
                    name: '导出',
                    fn: () => {
                        this._export('finance/financeLoanExport', {
                            loanIds: this.loanIds
                        });
                    }
                }
            ],
            loanIds: [],
            loanId: null
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
                    placeholder: '借款类型',
                    value: 'loanType',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: this.$store.state.finance.loadTypeList
                },
                {
                    label: '申请时间：',
                    value: 'time',
                    type: 'time'
                },
                {
                    placeholder: '借款申请人',
                    value: 'applicantId',
                    type: 'select',
                    style: {
                        width: '140px'
                    },
                    children: this.$store.state.finance.rApplyOperator
                },
                {
                    placeholder: '借款操作人',
                    value: 'operationId',
                    type: 'select',
                    style: {
                        width: '140px'
                    },
                    children: this.$store.state.finance.rtHandleOperator
                },
                {
                    placeholder: '借款状态',
                    value: 'state',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: this.$store.state.finance.loadStateList
                }
            ];
        }
    },
    methods: {
        ...mapActions('finance', ['getOperator', 'getGlobalSelect']),
        tableBtn(key, row) {
            switch (key) {
                case 1:
                    this.look(row);
                    break;
                case 2:
                    this.singleToExamine(row);
                    break;
                case 3:
                    this.loan(row);
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
            this.loanId = row.loanId;
            this._openToExamine('审核');
        },
        //編 輯
        edit(row) {
            this.loanId = row.loanId;
            this.$refs.page.$dialog({
                title: '编辑',
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
        //借款
        loan(row) {
            this.loanId = row.loanId;
            this.$refs.page.$dialog({
                title: '借款',
                visible: true,
                width: '500px',
                component: () => import('Views/dailyOperation/common/handle'),
                fnName: 'initData',
                params: 0
            });
        },

        //借款单详情
        look(row) {
            this.$refs.page.$dialog({
                title: '借款单详情 - [' + row.loanNumber + ']',
                visible: true,
                width: '980px',
                component: () => import('./look'),
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
                    this._toExamine('finance/financeLoanExamine', {
                        ...params,
                        loanIds: this.loanIds
                    });
                    break;
                case '审核':
                    this._toExamine('finance/financeLoanExamine', {
                        ...params,
                        loanIds: Array.of(this.loanId)
                    });
                    break;
                case '借款':
                    const { mode, accountId, fileList, remark } = params;
                    this.$api['finance/financeLoanLoan']({
                        loanMode: mode,
                        accountId,
                        fileList,
                        remark,
                        loanId: this.loanId
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                case '添加申请':
                    params.purchaseList.forEach(i => {
                        i['loanAmount'] = i.purchaseAmount;
                    });
                    this.$api['finance/financeLoanSave'](params).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                case '编辑':
                    params.purchaseList.forEach(i => {
                        i['loanAmount'] = i.purchaseAmount;
                    });
                    this.$api['finance/financeLoanUpdate']({
                        ...params,
                        loanId: this.loanId
                    }).then(res => {
                        this._notice(res.msg);
                    });
                    break;
                default:
                    break;
            }
        },
        selectChange(val) {
            this.loanIds = val.map(i => i.loanId);
        }
    },
    created() {
        this.getOperator();
        this.getGlobalSelect();
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


