<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收款单据列表" name="first">
            <yt-table :data="listA" :columns="columnsA" :border="true" :selection="false"></yt-table>
        </el-tab-pane>
        <el-tab-pane label="退款单据列表" name="second">
            <yt-table :data="listB" :columns="columnsB" :border="true" :selection="false">
                <el-table-column label="操作" width="100" align="center" slot="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="review(scope.row.orderRefundId)">查看</el-button>
                        <el-button type="text" @click="cancelPay(scope.row.orderRefundId)">取消退款</el-button>
                    </template>
                </el-table-column>
            </yt-table>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
/* eslint-disable */
export default {
    data() {
        return {
            activeName: 'first',
            listA: [],
            listB: [],
            columnsA: [
                { value: 'orderReceiptId', label: '单据ID', width: 100 },
                { value: 'createTime', label: '单据日期', width: 200 },
                { value: 'money', label: '支付金额' },
                { value: 'payBankAccount', label: '账号' },
                { value: 'receiptBank', label: '银行' },
                { value: 'paymentTypeName', label: '付款类型' },
                { value: 'remark', label: '备注' },
                { value: 'stateName', label: '状态' }
            ],
            columnsB: [
                { value: 'orderRefundId', label: '单据ID' },
                { value: 'createTime', label: '单据日期' },
                { value: 'refundTypeName', label: '退款方式' },
                { value: 'refundMoney', label: '退款金额' },
                { value: 'payee', label: '收款人' },
                { value: 'remark', label: '退款原因 备注' },
                { value: 'stateName', label: '状态' }
            ]
        };
    },
    methods: {
        review(orderRefundId) {
            this.$parent.$parent.$parent.refund(orderRefundId);
        },
        cancelPay(orderRefundId) {
            this.$confirm('是否取消退款', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$api[`order/refundCancel`]({ orderRefundId })
                        .then(data => {
                            this.getList('refundRecord');
                        })
                        .catch(err => {});
                })
                .catch(() => {});
        },
        handleClick(tab, event) {
            if (tab.name == 'second') {
                this.getList('refundRecord');
            }
        },
        getList(url = 'receiptRecord') {
            this.$api['order/' + url]({
                orderId: this.$route.query.orderServiceId
            })
                .then(res => {
                    let list = res.rows;
                    if (url == 'receiptRecord') {
                        this.listA = list;
                    } else {
                        this.listB = list;
                    }
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        }
    },
    computed: {
        loading() {
            return this.$store.state.loading;
        }
    }
};
</script>

<style lang="css">
</style>
