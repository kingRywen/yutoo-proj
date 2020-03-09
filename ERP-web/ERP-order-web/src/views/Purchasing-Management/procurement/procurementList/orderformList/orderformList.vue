<template>
    <!-- 采购订单管理 -->
    <div class>
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="searchList" @search="search">
                    <!-- <el-button type="info" size="small" slot="right">自定义筛选条件</el-button> -->
                </search>
            </template>
            <template slot="btnRight">
                <userDefined slot="right" :data="columns" :defaultData="defaultData" :selectCheck="selectCheck">自定义列表展示</userDefined>
            </template>
            <template slot="table">
                <yt-table :data="tableList" ref="table" :columns="defaultData" reserveSelection="purchaseOrderManageId" :border="true" @handleSelectionChange="handleSelectionChange">
                    <el-table-column label="操作" width="200" align="center" slot="left">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="查看订单详情" placement="bottom">
                                <i class="el-icon-search iconBtn" @click="queryOrderFormInfo(scope.row.lowerSingleNumber,scope.row.purchaseNumber)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="打印合同" placement="bottom">
                                <i class="el-icon-printer iconBtn" @click="printCompact(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看理由" placement="bottom">
                                <i class="el-icon-bell iconBtn" style="color: #f56c6c;" @click="reason(scope.row)" v-if="scope.row.repulseReason || scope.row.examineRemark || scope.row.lowerSingleRemark"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                                <i class="el-icon-edit iconBtn" @click="edit(scope.row)" v-if="scope.row.examineState==3"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
            <router-view />
        </universal-layout>
        <!--  -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.isShow" :width="dialog.width" center>
            <component :is="dialog.component" ref="component" :type="dialog.type" />
            <span slot="footer" class="dialog-footer" v-if="dialog.isBtnShow">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="submitForm" :loading="dialog.loading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="printOpts.title" :visible.sync="printOpts.visible" :width="printOpts.width" center>
            <el-form :model="printOpts" size="mini" label-width="100px" ref="form">
                <el-form-item label="选择合同模板" prop="template" :rules="[{required: true, message: '请选择合同模板'}]">
                    <el-select style="width:100%" v-model="printOpts.template">
                        <el-option v-for="item in printCompactList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="text-align:center">
                <el-button type="primary" size="small" @click="handlePrint">打印</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import check from './components/check';
import batchImport from './components/batchImport';
import queryOrderForm from './components/queryOrderForm';
import userDefined from '@/components/userDefined/userDefined.vue';
import eliminateForm from './components/eliminateForm.vue';
import { mapActions, mapGetters } from 'vuex';
import { loginRedirect } from '@/config/index.js';
export default {
    data() {
        return {
            btnList: [
                {
                    name: '审核',
                    fn: () => {
                        if (this.purchaseOrderManageIds.length) {
                            this.dialog.title = '审核';
                            this.dialog.isShow = true;
                            this.dialog.component = 'check';
                            this.dialog.isBtnShow = true;
                        } else {
                            this.$message.warning('请选择需要审核的数据');
                        }
                    }
                },
                {
                    name: '作废采购订单',
                    fn: () => {
                        if (this.purchaseOrderManageIds.length) {
                            this.$confirm(
                                '此操作将会使订单作废, 是否继续?',
                                '提示',
                                {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }
                            )
                                .then(() => {
                                    this.$api['procurement/lowerSingleCancel']({
                                        purchaseOrderManageIds: this
                                            .purchaseOrderManageIds
                                    })
                                        .then(res => {
                                            this.$message.success(res.msg);
                                        })
                                        .catch(err => {
                                            this.$message.error(err.msg);
                                        });
                                })
                                .catch(() => {
                                    return false;
                                });
                        } else {
                            this.$message.warning('请选择需要作废的数据');
                        }
                    }
                },
                {
                    name: '批量导入支付宝交易号',
                    fn: () => {
                        this.dialog.title = '批量导入支付宝交易号';
                        this.dialog.isShow = true;
                        this.dialog.component = 'batchImport';
                        this.dialog.isBtnShow = false;
                        this.dialog.width = '500px';
                        this.dialog.type = 1;
                        this.$nextTick(() => {
                            this.$refs.component.clearFiles();
                        });
                    }
                },
                {
                    name: '批量导入追踪号',
                    fn: () => {
                        this.dialog.title = '批量导入追踪号';
                        this.dialog.isShow = true;
                        this.dialog.component = 'batchImport';
                        this.dialog.isBtnShow = false;
                        this.dialog.width = '500px';
                        this.dialog.type = 2;
                        this.$nextTick(() => {
                            this.$refs.component.clearFiles();
                        });
                    }
                }
            ],
            tableList: [],
            defaultData: [],
            columns: [
                {
                    value: 'lowerSingleNumber',
                    label: '采购订单号',
                    width: 150,
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.queryOrderFormInfo.bind(
                                    this,
                                    scope.row.lowerSingleNumber,
                                    scope.row.purchaseNumber
                                )}
                            >
                                {scope.row.lowerSingleNumber}
                            </el-button>
                        );
                    }
                },
                {
                    value: 'productImg',
                    label: '订单产品',
                    width: 100,
                    img: true,
                    style: {
                        width: 50,
                        height: 50
                    },
                    bulkyHeight: 180
                },
                {
                    value: 'warehouseName',
                    label: '入库仓库'
                },
                {
                    value: 'supplierName',
                    label: '供应商'
                },
                {
                    value: 'purchaseTypeName',
                    label: '采购类型'
                },
                {
                    value: 'orderAmount',
                    label: '采购订单总金额',
                    width: 120
                },
                {
                    value: 'productAmount',
                    label: '产品金额'
                },
                {
                    value: 'requirement',
                    label: '总需求数'
                },
                {
                    value: 'singleQuantity',
                    label: '采购订单数',
                    width: 120
                },
                {
                    value: 'purchaseStateName',
                    label: '订单状态'
                },
                // {
                //     value: 'examineStateName',
                //     label: '审核状态',
                //     width:140,
                // },
                {
                    value: 'paymentStateName',
                    label: '付款状态',
                    width: 120
                },
                {
                    value: 'freightAmount',
                    label: '运费金额'
                },
                {
                    value: 'paymentMethod',
                    label: '付款方式'
                },
                {
                    value: 'purchasersName',
                    label: '采购人员'
                },
                {
                    value: 'createTime',
                    label: '采购订单时间',
                    width: 150
                },
                {
                    value: 'endTime',
                    label: '完结时间'
                },
                {
                    value: 'pinQuantity',
                    label: '已销单产品数'
                },
                {
                    value: 'qualityInspection',
                    label: '总质检数'
                },
                {
                    value: 'warehousesQuantity',
                    label: '已入库'
                },
                {
                    value: 'lowerSingleRemark',
                    label: '采购订单备注'
                },
                {
                    value: 'examineRemark',
                    label: '审核备注',
                    showTooltip: true,
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">
                                {scope.row.examineRemark}
                            </p>
                        );
                    }
                },
                {
                    value: 'pinOrderNumber',
                    label: '销单号',
                    width: 160,
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.eliminateForm.bind(
                                    this,
                                    scope.row
                                )}
                            >
                                {scope.row.pinOrderNumber}
                            </el-button>
                        );
                    }
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            purchaseOrderManageIds: [],
            dialog: {
                title: '',
                isShow: false,
                component: '',
                loading: false,
                width: '500px',
                isBtnShow: true,
                type: null
            },
            printOpts: {
                title: '选择合同',
                width: '400px',
                visible: false
            },
            accountPeriodList: [],
            printCompactList: []
        };
    },
    watch: {
        $route(to) {
            this.getList();
        }
    },
    mounted() {
        this.getList(1);
        let defaultData = localStorage.getItem('procurementList3');
        if (defaultData) {
            let arr = JSON.parse(defaultData);
            this.columns.forEach((item, index) => {
                arr.forEach(i => {
                    if (item.label == i) {
                        this.defaultData.push(item);
                    }
                });
            });
        } else {
            this.defaultData = [...this.columns];
            let arr = this.columns.map(i => i.label);
            localStorage.setItem('procurementList3', JSON.stringify(arr));
        }

        this.getPurchaseList();
        this.getSupplierList();
        this.getWarehouseList();
        this.getHandleUser();
        this.getAccountPeriod();
        //采购合同模板
        this.$api['finance/financeGetComboBox']({
            modelType: 1
        }).then(res => {
            this.printCompactList = res.rows.map(i => {
                return {
                    label: i.name,
                    value: i.id
                };
            });
        });
    },
    methods: {
        printCompact(row) {
            this.printOpts.purchaseOrderManageId = row.purchaseOrderManageId;
            this.printOpts.visible = true;
        },
        handlePrint(row) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let { purchaseOrderManageId, template } = this.printOpts;
                    // window.open(
                    //     `#/print?title=打印合同&purchaseIds=${purchaseOrderManageId}&type=${template}`
                    // );

                    window.open(
                        `${loginRedirect}erp-finance/#/finance/associatedSettings/contractPrint?title=打印合同&contractModelId=${template}&purchaseIds=${purchaseOrderManageId}`
                    );
                }
            });
        },
        eliminateForm(row) {
            this.dialog.title = `销单详情 - ${row.pinOrderNumber}`;
            this.dialog.isShow = true;
            this.dialog.width = '1200px';
            this.dialog.isBtnShow = false;
            this.dialog.component = 'eliminateForm';
            this.$nextTick(() => {
                this.$refs.component.getListData(row.pinOrderNumber);
            });
        },
        selectCheck(val) {
            let arr = this.columns.filter(
                (item, index) => val.indexOf(item.label) >= 0
            );
            this.defaultData = [...arr];
            let storage = this.defaultData.map(i => i.label);
            localStorage.setItem('procurementList3', JSON.stringify(storage));
        },
        async edit(item) {
            let { rows } = await this.$api['procurement/lowerSingleRecord']({
                lowerSingleNumber: item.lowerSingleNumber
            });
            this.$router.push({
                name: 'placeAnOrder',
                params: {
                    purchaseId: item.purchaseId,
                    type: 'update',
                    purchaseOrderManageId: item.purchaseOrderManageId,
                    productList: rows.list1
                }
            });
        },
        reason(row) {
            const h = this.$createElement;
            this.$msgbox({
                title: '消息',
                message: h('div', null, [
                    h('p', null, `打回原因：${row.repulseReason || '无'}`),
                    h('p', null, `下单备注：${row.lowerSingleRemark || '无'}`),
                    h('p', null, `审核备注：${row.examineRemark || '无'}`)
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(action => {});
        },
        //查询订单详情
        queryOrderFormInfo(lowerSingleNumber, purchaseNumber) {
            this.dialog.title = `订单详情-${lowerSingleNumber}`;
            this.dialog.isShow = true;
            this.dialog.component = 'queryOrderForm';
            this.dialog.isBtnShow = false;
            this.dialog.width = '1200px';
            this.$nextTick(() => {
                this.$refs.component.getListData(lowerSingleNumber);
            });
        },
        //审核确定
        check() {
            this.$refs.component.submitForm(data => {
                this.$api['procurement/lowerSingleExamine']({
                    purchaseOrderManageIds: this.purchaseOrderManageIds,
                    examineResult: data.examineResult,
                    remark: data.remark
                })
                    .then(res => {
                        this.$message.success(res.msg);
                        this.dialog.isShow = false;
                        this.getList();
                    })
                    .catch(err => {
                        this.$message.error(err.msg);
                    });
            });
        },
        //弹框确定
        submitForm() {
            if (this.dialog.component == 'check') {
                this.check();
            }
        },
        resetForm(formName) {
            this.$refs.component.resetForm();
            this.dialog.isShow = false;
        },
        handleSelectionChange(val) {
            this.purchaseOrderManageIds = val.map(
                item => item.purchaseOrderManageId
            );
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList('search');
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getList('search');
        },
        //搜索
        search(val) {
            this.$refs.table.clearSelection();
            this.searchInfo = val;
            this.pageNo = 1;
            this.getList('search');
        },
        //获取列表数据
        getList(val) {
            let self = this;
            val === 1 ? (self.pageNo = 1) : self.pageNo;
            let params = {
                sortOrder: 'asc',
                pageSize: self.pageSize,
                pageNumber: self.pageNo
            };
            if (val == 'search') {
                let data = { ...this.searchInfo };
                let obj = {};
                for (let key in data) {
                    if (
                        key == 'time' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['startTime'] = data[key][0];
                        obj['endTime'] = data[key][1];
                        continue;
                    }
                    if (
                        data[key] !== '' &&
                        data[key] !== null &&
                        data[key] !== 'time'
                    )
                        obj[key] = data[key];
                }
                params = Object.assign({}, params, obj);
            }
            self.$api['procurement/lowerSingleList'](params).then(res => {
                console.log(res.rows);
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },

        //获取账期类型
        getAccountPeriod() {
            this.$api['procurement/periodPeriodList']().then(res => {
                this.accountPeriodList = res.rows;
            });
        },
        ...mapActions('common', [
            'getWarehouseList',
            'getPurchaseList',
            'getHandleUser',
            'getSupplierList'
        ])
    },
    computed: {
        ...mapGetters('common', [
            'purchaseList',
            'supplierList',
            'warehouseList',
            'allHandleUser'
        ]),
        searchList() {
            return [
                {
                    label: '采购订单号',
                    value: 'lowerSingleNumber',
                    type: 'input',
                    style: {
                        width: '120px'
                    }
                },
                {
                    label: '订单状态',
                    value: 'purchaseState',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        { label: '待审核', value: 1 },
                        { label: '采购中', value: 2 },
                        { label: '退回采购', value: 3 },
                        { label: '已完成', value: 4 },
                        { label: '已作废', value: 5 }
                    ]
                },
                {
                    label: '采购点',
                    value: 'purchaseAddId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.$store.state.common.purchaseList,
                    props: {
                        label: 'addressName',
                        value: 'addressId'
                    }
                },
                {
                    label: '付款方式',
                    value: 'paymentMethod',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        { label: '现金付款', value: 1 },
                        { label: '网络在线付款', value: 2 },
                        { label: '转账付款', value: 3 },
                        { label: '阿里账期付款', value: 4 }
                    ]
                },
                {
                    label: '产品条形码：',
                    value: 'productBarCode',
                    type: 'input',
                    style: {
                        width: '150px'
                    }
                },
                {
                    label: '是否加急',
                    value: 'urgentFlag',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                    ]
                },
                {
                    label: '选择供应商',
                    value: 'supplierId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.$store.state.common.supplierList,
                    props: {
                        label: 'supplierName',
                        value: 'supplierId'
                    }
                },
                {
                    label: '采购仓库',
                    value: 'warehouseId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.$store.state.common.warehouseList,
                    props: {
                        label: 'warehouseName',
                        value: 'warehouseId'
                    }
                },
                {
                    label: '是否退税',
                    value: 'refundRate',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                    ]
                },
                {
                    label: '采购人员',
                    value: 'purchasersId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.allHandleUser.procurement,
                    props: {
                        label: 'nickName',
                        value: 'userId'
                    }
                },
                {
                    label: '付款状态',
                    value: 'paymentState',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        { label: '全部付款', value: 1 },
                        { label: '部分付款', value: 2 },
                        { label: '未申请支付', value: 3 }
                    ]
                },
                {
                    label: '下单日期',
                    value: 'time',
                    type: 'time'
                },
                {
                    label: '选择账期类型',
                    value: 'accountPeriodId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.accountPeriodList,
                    props: {
                        label: 'periodName',
                        value: 'periodId'
                    }
                },
                {
                    label: '审核备注原因',
                    value: 'remark',
                    type: 'input',
                    style: {
                        width: '200px'
                    }
                }
            ];
        }
    },
    components: {
        check,
        batchImport,
        queryOrderForm,
        userDefined,
        eliminateForm
    }
};
</script>

<style lang="scss">
.iconBtn {
    font-size: 24px;
    cursor: pointer;
    padding: 0 10px;
}
.textOverflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
