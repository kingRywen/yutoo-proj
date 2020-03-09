<template>
    <!-- 采购单，借款单 -->
    <div>
        <div class="purchase-order">
            <yt-table :data="list" :columns="columns" border selection ref="table" @selectChange="selectChange"></yt-table>
        </div>
        <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNumber"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
        <!--  -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="width" append-to-body top="10vh">
            <component :is="component" ref="purchaseLoanOrder" :getType="getType"></component>
        </el-dialog>

        <!--  -->
    </div>
</template>

<script>
/* eslint-disable */
import queryOrderForm from './queryOrderForm';
import { mixins } from './mixins';
export default {
    mixins: [mixins],
    props: {
        title: {
            type: String,
            default: ''
        },
        getType: Number
    },
    components: {
        queryOrderForm,
        refundsloadinfo: () =>
            import('Views/dailyOperation/refunds/loan/look.vue')
    },
    data() {
        return {
            list: [],
            pageSize: 10,
            pageNumber: 1,
            total: 0,
            dialogVisible: false,
            dialogTitle: '',
            component: '',
            width: '1180px',
            url: '',
            purchaseIds: [],
            loanList: []
        };
    },
    computed: {
        columns() {
            const _this = this;
            let purchase = [
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
                    value: 'next',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this.nuxtNumber.bind(
                                    _this,
                                    scope.row
                                )}
                            >
                                {scope.row.lowerSingleNumber}
                            </el-button>
                        );
                    }
                },
                {
                    label: '关联借款单号',
                    value: 'loadNumber',
                    render(h, scope) {
                        return scope.row.loanNumber ? (
                            <el-button
                                type="text"
                                onClick={_this.loanNumber.bind(
                                    _this,
                                    scope.row
                                )}
                            >
                                {scope.row.loanNumber}
                            </el-button>
                        ) : (
                            <span> - </span>
                        );
                    }
                },
                { label: '借款类型', value: 'loanTypeName' },
                { label: '供应商', value: 'supplierName' },
                { label: '借款金额', value: 'loanAmount' },
                { label: '已还金额', value: 'paidAmount' },
                { label: '未还金额', value: 'unpaidAmount' }
            ];
            let loan = [
                {
                    label: '借款单号',
                    value: '',
                    render(h, scope) {
                        return (
                            <el-button
                                type="text"
                                onClick={_this.loanNumber.bind(
                                    _this,
                                    scope.row
                                )}
                            >
                                {scope.row.loanNumber}
                            </el-button>
                        );
                    }
                },
                { label: '借款金额', value: 'loanAmount' },
                { label: '已还金额', value: 'repaymentAmount' },
                { label: '未还金额', value: 'unpaidAmount' }
            ];
            return this.isShowPurchase() == true ? purchase : loan;
        }
    },
    methods: {
        selectChange(val) {
            if (this.isShowPurchase()) {
                this.purchaseIds = val.map(i => i.purchaseId);
            } else {
                this.loanList = val.map(i => i.loanId);
            }
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getOrderList();
        },
        handleCurrentChange(val) {
            this.pageNumber = val;
            this.getOrderList();
        },
        nuxtNumber(row) {
            console.log(row);
            this.dialogVisible = true;
            this.dialogTitle = '下单详情';
            this.width = '1180px';
            this.component = 'queryOrderForm';
            this.$nextTick(() => {
                this.$refs.purchaseLoanOrder.getListData(
                    row.lowerSingleNumber 
                );
            });
        },
        //借款单号
        loanNumber(row) {
            this.dialogVisible = true;
            this.dialogTitle = '借款单详情';
            this.width = '980px';
            this.component = 'refundsloadinfo';
            const _this = this;
            setTimeout(() => {
                _this.$nextTick(() => {
                    _this.$refs.purchaseLoanOrder.initData(row);
                });
            });
            // // this.$nextTick(() => {
            // //     console.log('3721', this.$refs.purchaseLoanOrder);
            // //     //
            // // });
        },

        //获取采购单,借款单
        getOrderList() {
            let params = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                getType: this.getType
            };
            this.$api[this.url](params).then(res => {
                console.log('res', res);
                let { pageNo, pageSize, total, rows } = res;
                this.pageSize = pageSize;
                this.pageNumber = pageNo;
                this.total = total;
                this.list = rows;
            });
        },
        isShowPurchase() {
            return this.title === '关联采购单' ? true : false;
        }
    },
    mounted() {
        if (this.isShowPurchase()) {
            this.url = 'finance/financePurchaseList';
        } else {
            this.url = 'finance/financeRepaymentLoanList';
        }
        this.getOrderList();
    }
};
</script>
<style lang="scss" scoped>
.purchase-order {
    padding: 0 10px;
    min-height: 520px;
    max-height: 520px;
    overflow-y: auto;
}
.pagination {
    text-align: right;
    margin-top: 15px;
}
</style>