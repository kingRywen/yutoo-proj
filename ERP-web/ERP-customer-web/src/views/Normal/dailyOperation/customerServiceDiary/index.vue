<template>
    <div>
        <!-- 客服售后记录 -->
        <universal-layout :pageNo="pageNo" :pageSize="pageSize" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList">
            <template slot="search">
                <search :searchList="searchList" @search="search" :updatedModel="(val)=>searchInfo = val"></search>
            </template>
            <template slot="table">
                <yt-table
                    v-loading="loading"
                    element-loading-text="加载中..."
                    element-loading-spinner="el-icon-loading"
                    :data="tableList"
                    reserveSelection="orderServiceId"
                    :columns="columns"
                    :border="true"
                    ref="table"
                    @handleSelectionChange="handleSelectionChange"
                >
                    <el-table-column label="操作" width="130" align="center" slot="left">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip class="item" effect="dark" content="查看" placement="bottom">
                                    <el-button type="text" icon="el-icon-search" class="ibtn" @click="edit(scope.row.orderServiceId,true)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" placement="right">
                                    <div slot="content">备注：{{scope.row.remark || '暂无'}}</div>
                                    <el-button type="text" icon="el-icon-document" class="ibtn" @click="remarks(scope.row.orderServiceId,scope.row.remark)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                                    <el-button type="text" icon="el-icon-edit" class="ibtn" @click="edit(scope.row.orderServiceId,false)"></el-button>
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
                <component :is="dialog.component" ref="component" :customerList="customerList" :disabled="disabled"></component>
            </div>
            <span slot="footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm(dialog.title)">确 定</el-button>
            </span>
        </el-dialog>
        <!--  -->
        <el-dialog title="添加备注" :visible.sync="remarksVisible" width="480px" center>
            <el-form :model="remarksForm" ref="remarksForm" label-width="70px">
                <el-form-item label="备注：" prop="remark" :rules="[
            { required: true, message: '请输入备注信息', trigger: 'blur' }           
            ]">
                    <el-input type="textarea" v-model="remarksForm.remark" class="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="remarksVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRemarksForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// eslint-disable-next-line
import { myMixin, auditType } from '../mixins.js';
import addEditForm from './addEditForm';
import isItComplete from './isItComplete';
import { mapActions } from 'vuex';

export default {
    mixins: [myMixin],
    data() {
        let _this = this;
        return {
            remarksForm: {
                remark: ''
            },
            orderServiceId: '',
            remarksVisible: false,
            columns: [
                { label: '订单来源店铺', value: 'storeName' },
                {
                    label: '平台订单号',
                    width: '130px',
                    value: 'orderNumPlatform',
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
                                {scope.row.orderNumPlatform}
                            </el-button>
                        );
                    }
                },
                {
                    label: '系统订单号',
                    value: 'orderNumSystem',
                    width: '130px',
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
                                {scope.row.orderNumSystem}
                            </el-button>
                        );
                    }
                },
                { label: '客户ID', value: 'cneeMemberId', width: '80px' },
                { label: '客户名称', value: 'cneeMemberName' },
                { label: '邮箱', value: 'cneeEmail', width: '140px' },
                { label: '记录时间', value: 'createTime', width: '140px' },
                { label: '订单金额', value: 'orderPrice' },
                {
                    label: '产品SKU',
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">
                                {scope.row.products[0].productSku}
                            </p>
                        );
                    }
                },
                {
                    label: '产品中文名',
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">
                                {scope.row.products[0].productName}
                            </p>
                        );
                    }
                },
                {
                    label: '客户问题',
                    value: 'customerIssueName',
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">
                                {scope.row.customerIssueName}
                            </p>
                        );
                    }
                },
                { label: '处理方案', value: 'solutionName' },
                { label: '完成状态', value: 'performanceName' },
                { label: '添加人', value: 'creatorName' }
            ],
            btnList: [
                {
                    name: '添加',
                    fn: () => {
                        this.disabled = false;
                        this.openDialog({
                            title: '添加客服日志',
                            visible: true,
                            component: 'addEditForm',
                            width: '880px'
                        });
                        this.$nextTick(() => {
                            this.$refs.component.resetForm();
                        });
                    }
                },
                {
                    name: '批量修改完成情况',
                    fn: () => {
                        let len = this.orderServiceIds.length;
                        if (!len) {
                            this.$message.warning('请选择需要操作的批量数据');
                            return;
                        }
                        this.openDialog({
                            title: '批量修改完成情况',
                            visible: true,
                            component: 'isItComplete',
                            width: '480px'
                        });
                    }
                },
                {
                    name: '当前搜索条件导出',
                    fn: () => {
                        // eslint-disable-next-line
                        let len = Object.keys(_this.searchInfo).length;
                        let obj = _this.searchInfo;
                        let np = {};
                        for (let k in obj) {
                            if (
                                k == 'time' &&
                                obj[k] !== null &&
                                obj[k].length
                            ) {
                                np['startTime'] = obj[k][0];
                                np['endTime'] = obj[k][1];
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
                                obj[k] !== ''
                            ) {
                                np[k] = obj[k];
                                continue;
                            }
                        }
                        this.$api['email/logExport'](np).then(res => {
                            window.location.href = res.path;
                        });
                        // if (Object.keys(np).length) {

                        // } else {
                        //     this.$message.warning(
                        //         '至少需要一个搜索条件才能导出'
                        //     )
                        // }
                    }
                },
                {
                    name: '批量删除',
                    fn: () => {
                        let orderServiceIds = this.orderServiceIds;
                        if (!orderServiceIds.length) {
                            this.$message.warning('请选择需要操作的批量数据');
                            return;
                        }
                        this.$api['order/serviceRemove']({
                            orderServiceIds
                        }).then(res => {
                            this.$message.success(res.msg);
                            this.getList();
                        });
                    }
                }
            ],
            searchList: [
                {
                    placeholder: '客服负责人员',
                    type: 'select',
                    value: 'creatorId',
                    style: {
                        width: '140px'
                    },
                    children: []
                },
                {
                    placeholder: '完成情况',
                    type: 'select',
                    value: 'performance',
                    style: {
                        width: '140px'
                    },
                    children: [
                        { value: 1, label: '已完成' },
                        { value: 0, label: '未完成' }
                    ]
                },
                {
                    placeholder: '客户问题',
                    type: 'select',
                    value: 'customerIssueId',
                    children: [],
                    style: {
                        width: '120px'
                    }
                },
                {
                    label: '记录时间',
                    type: 'time',
                    value: 'time'
                },
                {
                    placeholder: '系统订单号',
                    type: 'input',
                    value: 'systemNumber',
                    style: {
                        width: '200px'
                    }
                },
                {
                    placeholder: '来源店铺（多选)',
                    type: 'multiple',
                    value: 'storeIds',
                    children: [],
                    style: {
                        width: '220px'
                    }
                }
            ],
            orderServiceIds: [],
            customerList: [],
            disabled: false
        };
    },
    methods: {
        getCustomerList() {
            let params = {
                sortOrder: 'asc',
                pageSize: 50,
                pageNumber: 1
            };
            this.$api['order/issueList'](params).then(res => {
                let { rows } = res;
                this.customerList = rows;
                let arr = rows.map(i => {
                    return {
                        label: i.name,
                        value: i.customerIssueId
                    };
                });
                this.searchList[2].children = arr;
            });
        },
        handleSelectionChange(val) {
            this.orderServiceIds = val.map(item => item.orderServiceId);
        },
        edit(orderServiceId, disabled) {
            this.disabled = disabled;
            this.openDialog({
                title: disabled ? '查看客服日志' : '编辑客服日志',
                visible: true,
                component: 'addEditForm',
                width: '880px'
            });
            this.$nextTick(() => {
                this.$refs.component.getEditInfo(orderServiceId);
            });
        },
        submitRemarksForm() {
            this.$refs.remarksForm.validate(valid => {
                if (valid) {
                    this.$api['email/logSetRemark']({
                        orderServiceId: this.orderServiceId,
                        remark: this.remarksForm.remark
                    })
                        .then(res => {
                            this.$message.success(res.msg);
                            this.remarksVisible = false;
                            this.getList();
                        })
                        .catch(err => {
                            this.$message.error(err.msg);
                        });
                } else {
                    return false;
                }
            });
        },
        remarks(orderServiceId, remark) {
            this.remarksForm.remark = remark;
            this.orderServiceId = orderServiceId;
            this.remarksVisible = true;
        },
        submitForm(title) {
            switch (title) {
                case '添加客服日志':
                    this.$refs.component.submitForm(() => {
                        this.openDialog({
                            visible: false,
                            width: '880px'
                        });
                        this.getList();
                    });
                    break;
                case '编辑客服日志':
                    this.$refs.component.submitForm(() => {
                        this.openDialog({
                            visible: false,
                            width: '880px'
                        });
                        this.getList();
                    });
                    break;
                case '查看客服日志':
                    this.$refs.component.submitForm(() => {
                        this.openDialog({
                            visible: false,
                            width: '880px'
                        });
                    });
                    break;
                case '批量修改完成情况':
                    this.$refs.component.submitForm(
                        this.orderServiceIds,
                        () => {
                            this.openDialog({
                                visible: false,
                                width: '480px'
                            });
                            this.getList();
                        }
                    );
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
                    if (k == 'time' && obj[k] !== null && obj[k].length) {
                        np['startTime'] = obj[k][0];
                        np['endTime'] = obj[k][1];
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
                        obj[k] !== ''
                    ) {
                        np[k] = obj[k];
                        continue;
                    }
                }
                params = Object.assign({}, params, np);
            }
            this.http('email/logList', params, 'list');
        },
        ...mapActions('product', ['getStoreId'])
    },
    mounted() {
        this.getList();
        this.getCustomerList();
        // eslint-disable-next-line
        this.getStoreId().then(_ => {
            let el = this.searchList[5];
            el.children = this.$store.state.product.storeIdList;
            this.searchList.splice(5, 1, el);
        });
        this._getservice().then(data => {
            this.searchList[0].children = data;
        });
    },
    components: {
        addEditForm,
        isItComplete
    }
};
</script>
<style lang="scss">
@import '@/assets/css/common.scss';
</style>