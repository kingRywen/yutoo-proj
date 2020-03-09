<template>
    <!-- 销单入库核对 -->
    <div class>
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="searchList" @search="search"></search>
            </template>
            <template slot="table">
                <yt-table :data="tableList" :columns="columns" :border="true" reserveSelection="purchaseId" ref="table"></yt-table>
            </template>
            <router-view></router-view>
        </universal-layout>

        <el-dialog title="选择导出时间" :visible.sync="selectTimeDialogVisible" width="30%" center>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="导出时间" prop="time">
                    <el-date-picker v-model="form.time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="submitForm" :loading="selectFormLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        return {
            btnList: [
                {
                    name: '导出下单记录',
                    fn: () => {
                        this.handleCommon(1);
                    }
                },
                {
                    name: '导出销单记录',
                    fn: () => {
                        this.handleCommon(2);
                    }
                },
                {
                    name: '导出入库异常记录',
                    fn: () => {
                        this.handleCommon(3);
                    }
                },
                {
                    name: '导出销单入库记录',
                    fn: () => {
                        this.handleCommon(4);
                    }
                }
            ],
            tableList: [],
            columns: [
                {
                    value: 'purchaseNumber',
                    label: '采购清单号',
                    width: 140,
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.purchaseInfo.bind(
                                    this,
                                    scope.row.purchaseId,
                                    scope.row.purchaseNumber
                                )}
                            >
                                {scope.row.purchaseNumber}
                            </el-button>
                        );
                    }
                },
                {
                    value: 'skuQuantity',
                    label: 'SKU数量'
                },
                {
                    value: 'productQuantity',
                    label: '产品数量'
                },
                {
                    value: 'purchasersName',
                    label: '采购人员'
                },
                {
                    value: 'printFlagName',
                    label: '采购清单状态',
                    width: 130
                },
                {
                    value: 'exceptionFlagName',
                    label: '异常状态'
                },
                {
                    value: 'endFlagName',
                    label: '完结状态'
                },
                {
                    value: 'requirement',
                    label: '需求数量'
                },
                {
                    value: 'lowerSingleQuantity',
                    label: '下单数量'
                },
                {
                    value: 'pinOrderPrice',
                    label: '销单价'
                },
                {
                    value: 'pinQuantity',
                    label: '实际采购数量',
                    width: 130
                },
                {
                    value: 'qualityInspection',
                    label: '质检ok数量'
                },
                {
                    value: 'rejectsQuantity',
                    label: '不良品数量'
                },
                {
                    value: 'totalQualityInspection',
                    label: '质检数量'
                },
                {
                    value: 'warehousesQuantity',
                    label: '入库数量'
                },
                {
                    value: 'warehousesAmount',
                    label: '入库金额'
                },
                {
                    value: 'generateTime',
                    label: '采购下单时间',
                    width: 140
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            selectTimeDialogVisible: false,
            title: '',
            form: {
                time: []
            },
            rules: {
                time: [
                    {
                        required: true,
                        message: '请选择导出时间',
                        trigger: 'change'
                    }
                ]
            },
            type: null,
            selectFormLoading: false,
            searchInfo: {}
        };
    },
    computed: {
        ...mapGetters('common', [
            'supplierList',
            'allHandleUser',
            'warehouseList'
        ]),
        searchList() {
            return [
                {
                    label: '采购清单号',
                    value: 'purchaseNumber',
                    type: 'input',
                    style: {
                        width: '180px'
                    }
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
                    label: '异常情况',
                    value: 'exceptionFlag',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '正常',
                            value: '0'
                        },
                        {
                            label: '异常',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '完结状态',
                    value: 'endFlag',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '已完结',
                            value: '1'
                        },
                        {
                            label: '未完结',
                            value: '0'
                        }
                    ]
                },
                {
                    label: '产品条形码',
                    value: 'productBarCode',
                    type: 'input'
                },
                {
                    label: '仓库名称',
                    value: 'warehouseId',
                    type: 'select',
                    children: this.$store.state.common.warehouseList,
                    props: {
                        label: 'warehouseName',
                        value: 'warehouseId'
                    },
                    style: {
                        width: '180px'
                    }
                },
                {
                    label: '供应商',
                    value: 'supplierId',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: this.$store.state.common.supplierList,
                    props: {
                        label: 'supplierName',
                        value: 'supplierId'
                    }
                },
                {
                    label: '采购时间',
                    value: 'time1',
                    type: 'time'
                },
                {
                    label: '销单时间',
                    value: 'time2',
                    type: 'time'
                },
                {
                    label: '时间段',
                    value: 'time3',
                    type: 'time'
                }
            ];
        }
    },
    methods: {
        purchaseInfo(purchaseId, purchaseNumber) {
            console.log(purchaseId, purchaseNumber);
            this.$router.push({
                name: 'inventoryCheckpurchaseDetailed',
                query: {
                    purchaseId,
                    purchaseNumber
                }
            });
        },
        resetForm() {
            this.$refs.form.resetFields();
            this.selectTimeDialogVisible = false;
        },
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let self = this;
                    let url = null;
                    switch (self.type) {
                        case 1:
                            url = 'procurement/dataCheckingExportLowerSingle';
                            break;
                        case 2:
                            url = 'procurement/dataCheckingExportPinOrder';
                            break;
                        case 3:
                            url =
                                'procurement/dataCheckingExportStorageException';
                            break;
                        case 4:
                            url =
                                'procurement/dataCheckingExportPinOrderStorage';
                            break;
                    }
                    self.selectFormLoading = true;
                    self.$api[url]({
                        startTime: self.form.time[0],
                        endTime: self.form.time[1]
                    })
                        .then(res => {
                            self.selectFormLoading = false;
                            this.selectTimeDialogVisible = false;
                            window.location.href = res.path;
                        })
                        .catch(err => {
                            self.$message.error(err.msg);
                            self.selectFormLoading = false;
                        });
                } else {
                    return false;
                }
            });
        },
        handleCommon(num) {
            this.type = num;
            this.selectTimeDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
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
            let params = {
                sortOrder: 'asc',
                pageSize: self.pageSize,
                pageNumber: self.pageNo
            };
            if (val == 'search') {
                let data = { ...self.searchInfo };
                let obj = {};
                for (let key in data) {
                    if (
                        key == 'time1' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['purchaseStartTime'] = data[key][0];
                        obj['purchaseEndTime'] = data[key][1];
                        continue;
                    }
                    if (
                        key == 'time2' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['pinStartTime'] = data[key][0];
                        obj['pinEndTime'] = data[key][1];
                        continue;
                    }
                    if (
                        key == 'time3' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['storageStartTime'] = data[key][0];
                        obj['storageEndTime'] = data[key][1];
                        continue;
                    }
                    if (data[key]) obj[key] = data[key];
                }
                params = Object.assign({}, params, obj);
            }
            self.$api['procurement/dataCheckingList'](params).then(res => {
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },

        ...mapActions('common', [
            'getSupplierList',
            'getHandleUser',
            'getWarehouseList'
        ])
    },
    mounted() {
        this.getList();
        this.getSupplierList();
        this.getHandleUser();
        this.getWarehouseList();
    }
};
</script>

<style lang="scss">
</style>
