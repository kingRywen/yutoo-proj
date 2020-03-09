<template>
    <div>
        <!-- 订单退款管理 -->
        <universal-layout :pageNo="pageNo" :pageSize="pageSize" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList">
            <template slot="search">
                <search :searchList="searchList" @search="search" :updatedModel="updatedModel"></search>
            </template>
            <template slot="table">
                <yt-table
                    v-loading="loading"
                    element-loading-text="加载中..."
                    element-loading-spinner="el-icon-loading"
                    reserveSelection="orderRefundId"
                    ref="table"
                    :data="tableList"
                    :columns="columns"
                    :border="true"
                    @handleSelectionChange="handleSelectionChange"
                >
                    <el-table-column label="操作" width="130" align="center" slot="left">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip class="item" effect="dark" content="查看" placement="bottom">
                                    <el-button type="text" icon="el-icon-search" class="ibtn" @click="lookOver(scope.row.orderId,scope.row.orderRefundId)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="审核" placement="bottom">
                                    <el-button type="text" icon="el-icon-zoom-in" class="ibtn" v-if="scope.row.refundStatus==1" @click="toExamine(scope.row.orderRefundId)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                                    <!-- 退款审核不通过才能编辑 
                  退款状态 1-待审核 2-未通过 3-退款中 4-退款成功 5-退款失败 	6作废
                                    -->
                                    <el-button type="text" icon="el-icon-edit" class="ibtn" v-if="scope.row.refundStatus==2" @click="edit(scope.row.orderId,scope.row.orderRefundId)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="查看理由" placement="bottom">
                                    <el-button type="text" icon="el-icon-document" class="ibtn" @click="reason(scope.row)" v-if="scope.row.refundStatus==2"></el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
        </universal-layout>
        <!--  -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width">
            <div style="max-height: 580px;overflow-y: auto;padding-right: 10px;">
                <component :is="dialog.component" ref="component" :disabled="disabled"></component>
            </div>
            <span slot="footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm(dialog.title)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import {
    myMixin,
    auditType,
    refundTypeList,
    refundStateList
} from '../mixins.js';
import { mapActions } from 'vuex';
import refundForm from './refundForm';
import check from '../orderReplacement/check';
import toExamine from './toExamine';

export default {
    mixins: [myMixin],
    data() {
        let _this = this;
        return {
            disabled: false,
            columns: [
                { label: '下单日期', value: 'orderTime', width: '150px' },
                { label: '退款日期', value: 'refundTime', width: '150px' },
                { label: '店铺', value: 'storeName' },
                { label: '状态', value: 'refundStatusName' },
                { label: '退款状态', value: 'refundFlagName' },
                {
                    label: '订单号',
                    value: 'orderNumPlatform',
                    width: '150px',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.goOrderInfo.bind(
                                    this,
                                    scope.row.orderId,
                                    scope.row.platformId,
                                    scope.row.orderType
                                )}
                            >
                                {scope.row.orderNumPlatform || '-'}
                            </el-button>
                        );
                    }
                },
                { label: 'FBA订单', value: 'fulfillmentChannelName' },
                { label: '订单金额', value: 'orderPrice' },
                {
                    label: '产品中文名',
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">
                                {scope.row.products[0].productName || '-'}
                            </p>
                        );
                    }
                },
                {
                    label: '产品SKU',
                    width: '100px',
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">
                                {scope.row.products[0].productSku || '-'}
                            </p>
                        );
                    }
                },
                { label: '客户交易ID', value: 'buyerIdPlatform' },
                { label: '退款金额', value: 'refundMoney' },
                { label: '退款类型', value: 'refundTypeName' },
                { label: '货物处理', value: 'cargoHandlerName' },
                { label: '退款操作人', value: 'operatorName' }
            ],
            btnList: [
                {
                    name: '添加退款记录',
                    fn: () => {
                        this.disabled = false;
                        this.openDialog({
                            title: '添加退款记录',
                            visible: true,
                            component: 'refundForm',
                            width: '1000px'
                        });
                        this.$nextTick(() => {
                            this.$refs.component.list = [];
                            this.$refs.component.$refs.form.resetFields();
                            this.$refs.component.isAdd = true;
                        });
                    }
                },
                {
                    name: '退款批量审核',
                    fn: () => {
                        let len = this.isSelect();
                        if (len) {
                            this.openDialog({
                                title: '退款批量审核',
                                visible: true,
                                component: 'check',
                                width: '480px'
                            });
                        }
                    }
                },
                {
                    name: '批量设置已退款',
                    fn: () => {
                        let len = this.isSelect();
                        if (len) {
                            this.$api['email/refundSetRefundState']({
                                state: 1,
                                orderRefundIds: this.orderRefundIds
                            }).then(res => {
                                this.$message.success(res.msg);
                                this.getList();
                            });
                        }
                    }
                },
                {
                    name: '批量设置未退款',
                    fn: () => {
                        let len = this.isSelect();
                        if (len) {
                            this.$api['email/refundSetRefundState']({
                                state: 0,
                                orderRefundIds: this.orderRefundIds
                            }).then(res => {
                                this.$message.success(res.msg);
                                this.getList();
                            });
                        }
                    }
                },
                {
                    name: '作废',
                    fn: () => {
                        let len = this.isSelect();
                        if (len) {
                            this.$confirm(
                                '确定作废选中的订单吗, 是否继续?',
                                '提示',
                                {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }
                            )
                                .then(() => {
                                    this.$api['email/serviceRefundCancel']({
                                        orderRefundIds: this.orderRefundIds,
                                        state: 0
                                    })
                                        .then(res => {
                                            this.$message.success(res.msg);
                                            this.getList();
                                        })
                                        .catch(err => {
                                            this.$message.error(err.msg);
                                        });
                                })
                                .catch(() => {
                                    return false;
                                });
                        }
                    }
                },
                {
                    name: '取消作废',
                    fn: () => {
                        let len = this.isSelect();
                        if (len) {
                            this.$api['email/serviceRefundCancel']({
                                orderRefundIds: this.orderRefundIds,
                                state: 1
                            })
                                .then(res => {
                                    this.$message.success(res.msg);
                                    this.getList();
                                })
                                .catch(err => {
                                    this.$message.error(err.msg);
                                });
                        }
                    }
                },
                {
                    name: '当前搜索条件导出',
                    fn: () => {
                        let obj = _this.searchInfo;
                        let np = {};
                        for (let k in obj) {
                            if (
                                k == 'time' &&
                                obj[k] != null &&
                                obj[k].length
                            ) {
                                np['refundStartTime'] = obj[k][0];
                                np['refundEndTime'] = obj[k][1];
                                continue;
                            }
                            if (k == 'refundReason' && obj[k].length) {
                                if (obj[k].length == 1) {
                                    np['refundReasonFirstIds'] = obj[k][0];
                                    np['refundReasonSecondIds'] = '';
                                }
                                if (obj[k].length == 2) {
                                    np['refundReasonFirstIds'] = obj[k][0];
                                    np['refundReasonSecondIds'] = obj[k][1];
                                }
                                continue;
                            }
                            if (k == 'storeIds' && obj[k].length) {
                                np[k] = obj[k];
                                continue;
                            }
                            if (
                                (obj[k] !== '' || obj[k] != null) &&
                                k !== 'storeIds' &&
                                k !== 'time' &&
                                k !== 'refundReason' &&
                                obj[k] !== ''
                            ) {
                                np[k] = obj[k];
                                continue;
                            }
                        }

                        this.$api['email/serviceRefundExport'](np).then(res => {
                            window.location.href = res.path;
                        });
                    }
                }
            ],
            searchList: [
                {
                    placeholder: '订单来源店铺（多选）',
                    type: 'multiple',
                    value: 'storeIds',
                    children: [],
                    style: {
                        width: '190px'
                    }
                },
                {
                    placeholder: '退款原因',
                    type: 'cascader',
                    value: 'refundReason',
                    changeOnSelect: true,
                    style: {
                        width: '190px'
                    },
                    options: [],
                    props: {
                        label: 'name',
                        value: 'refundReasonId',
                        children: 'child'
                    }
                },
                {
                    placeholder: '产品SKU',
                    type: 'input',
                    value: 'productSku',
                    style: {
                        width: '150px'
                    }
                },
                {
                    placeholder: 'ASIN',
                    type: 'input',
                    value: 'asin',
                    style: {
                        width: '150px'
                    }
                },
                {
                    placeholder: '退款状态',
                    type: 'select',
                    value: 'refundStatus',
                    children: refundStateList
                },
                {
                    placeholder: '退款操作人',
                    type: 'select',
                    value: 'operatorId',
                    children: []
                },
                {
                    placeholder: '退款类型',
                    type: 'select',
                    value: 'refundType',
                    children: refundTypeList
                },
                {
                    placeholder: '是否API退款',
                    type: 'select',
                    value: 'isApiFlag',
                    children: [
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                    ]
                },
                {
                    placeholder: '订单号',
                    type: 'input',
                    value: 'orderNumber',
                    style: {
                        width: '190px'
                    }
                },
                {
                    placeholder: '客户ID',
                    type: 'input',
                    value: 'cneeMemberId',
                    style: {
                        width: '190px'
                    }
                },
                {
                    label: '退款时间',
                    type: 'time',
                    value: 'time'
                }
            ],
            orderRefundIds: [],
            orderRefundId: '',
            orderIds: []
        };
    },
    methods: {
        updatedModel(val) {
            this.searchInfo = val;
        },
        reason(row) {
            const h = this.$createElement;
            this.$msgbox({
                title: '消息',
                message: h('div', null, [
                    h('p', null, `审核备注：${row.examineRemark || '无'}`)
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {});
        },
        toExamine(orderRefundId) {
            this.orderRefundId = orderRefundId;
            this.openDialog({
                title: '订单退款审核',
                visible: true,
                component: 'toExamine',
                width: '1000px'
            });
            this.$nextTick(() => {
                this.$refs.component.getInfo(orderRefundId);
            });
        },
        isSelect() {
            let len = this.orderRefundIds.length;
            if (!len) {
                this.$message.warning('请选择需要操作的数据');
                return false;
            }
            return true;
        },
        handleSelectionChange(val) {
            this.orderRefundIds = val.map(item => item.orderRefundId);
            this.orderIds = val.map(item => item.orderId);
        },
        lookOver(orderId, orderRefundId) {
            this.edit(orderId, orderRefundId, '查看退款记录');
        },
        edit(orderId, orderRefundId, title = '编辑退款记录') {
            title == '查看退款记录'
                ? (this.disabled = true)
                : (this.disabled = false);

            this.orderRefundId = orderRefundId;
            this.openDialog({
                title,
                visible: true,
                component: 'refundForm',
                width: '1000px'
            });
            this.$nextTick(() => {
                this.$refs.component.edit(orderId, orderRefundId);
            });
        },
        submitForm(title) {
            switch (title) {
                case '添加退款记录':
                    this.$refs.component.submitForm(() => {
                        this.openDialog({
                            visible: false,
                            width: '1000px'
                        });
                        this.getList();
                    });
                    break;
                case '编辑退款记录':
                    this.$refs.component.submitForm(() => {
                        this.openDialog({
                            visible: false,
                            width: '1000px'
                        });
                        this.getList();
                    }, this.orderRefundId);
                    break;
                case '订单退款审核':
                    this.$refs.component.submitForm(this.orderRefundId, () => {
                        this.openDialog({
                            visible: false,
                            width: '1000px'
                        });
                        this.getList();
                    });
                    break;
                case '退款批量审核':
                    this.$refs.component.submitForm(
                        'refundExamine',
                        this.orderRefundIds,
                        () => {
                            this.openDialog({
                                visible: false,
                                width: '1000px'
                            });
                            this.getList();
                        }
                    );
                    break;
                case '查看退款记录':
                    this.openDialog({
                        visible: false,
                        width: '1000px'
                    });

                    break;
                default:
                    break;
            }
        },
        getList(val) {
            let params = {
                pageSize: this.pageSize,
                pageNumber: this.pageNo,
                sortOrder: 'asc'
            };
            if (val === 'search') {
                let obj = this.searchInfo;
                let np = {};
                for (let k in obj) {
                    if (k == 'time' && obj[k] != null && obj[k].length) {
                        np['refundStartTime'] = obj[k][0];
                        np['refundEndTime'] = obj[k][1];
                        continue;
                    }
                    if (k == 'refundReason' && obj[k].length) {
                        if (obj[k].length == 1) {
                            np['refundReasonFirstIds'] = obj[k][0];
                            np['refundReasonSecondIds'] = '';
                        }
                        if (obj[k].length == 2) {
                            np['refundReasonFirstIds'] = obj[k][0];
                            np['refundReasonSecondIds'] = obj[k][1];
                        }
                        continue;
                    }
                    if (k == 'storeIds' && obj[k].length) {
                        np[k] = obj[k];
                        continue;
                    }
                    if (
                        (obj[k] !== '' || obj[k] != null) &&
                        k !== 'storeIds' &&
                        k !== 'time' &&
                        k !== 'refundReason' &&
                        obj[k] !== ''
                    ) {
                        np[k] = obj[k];
                        continue;
                    }
                }
                params = Object.assign({}, params, np);
            }
            this.http('email/refundList', params, 'list');
        },
        getReasonList() {
            this.$api['order/refundReasonGetReasonList']()
                .then(res => {
                    console.log(res.rows);
                    this.searchList[1].options = res.rows;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        ...mapActions(['getPlatformAndStore', 'getHandleUser']),
        ...mapActions('product', ['getStoreId'])
    },
    mounted() {
        this.getList();
        this.getStoreId().then(() => {
            this.searchList[0].children = this.$store.state.product.storeIdList;
        });
        this.getReasonList();
        this.getHandleUser().then(() => {
            this.searchList[5].children = this.$store.state.common.handleUser.operator;
        });
    },
    components: {
        refundForm,
        check,
        toExamine
    }
};
</script>
<style lang="scss">
@import '@/assets/css/common.scss';
</style>