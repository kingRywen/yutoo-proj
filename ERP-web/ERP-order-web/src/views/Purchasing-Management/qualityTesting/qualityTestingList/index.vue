<template>
    <!-- 质检管理列表 -->
    <div class>
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="searchList" @search="search"></search>
            </template>
            <template slot="table">
                <yt-table :data="tableList" :columns="columns" :border="true" @handleSelectionChange="handleSelectionChange" reserveSelection="purchaseQcId" ref="table">
                    <el-table-column label="操作" width="100" align="center" slot="right" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="lookover(scope.row.purchaseQcId)">查看</el-button>
                            <el-button type="text" @click="back(scope.row)">不良品退回</el-button>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
            <router-view/>
        </universal-layout>
        <!-- 不良品退回 -->
        <el-dialog title="不良品退回" :visible.sync="backDialogVisible" width="530px" center>
            <backForm :info="backFormInfo" ref="backForm"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm()">取 消</el-button>
                <el-button type="primary" @click="submitForm()" :loading="backFormLoading">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="lookoverDialogVisible" width="830px" center>
            <div class>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="采购单号：">{{lookoverInfo.purchaseNumber}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品SKU：">{{lookoverInfo.productSku}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="本次质检操作数量：">{{lookoverInfo.inspectQuantity}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="不良品退还供应商数量：">{{lookoverInfo.rejectsReturnQuantity}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="质检操作人姓名：">{{lookoverInfo.inspectName}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否作废：">{{lookoverInfo.cancelFlagName}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="添加时间：">{{lookoverInfo.createTime}}</el-form-item>
                        </el-col>
                    </el-row>
                    <yt-table :border="true" :selection="false" :data="lookoverList" :columns="lookoverColumns"></yt-table>
                </el-form>
            </div>
        </el-dialog>
        <!--  -->
        <el-dialog title="导出质检入库Excel" :visible.sync="ExcelDialogVisible" width="30%" center>
            <el-form :model="ExcelForm" :rules="ExcelFormRules" ref="ExcelForm">
                <el-form-item label="导出时间" prop="time">
                    <el-date-picker v-model="ExcelForm.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel('ExcelForm')">取 消</el-button>
                <el-button type="primary" @click="submitExport('ExcelForm')" :loading="ExcelFormLoading">导 出</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import backForm from '../rejects/backForm';
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        return {
            searchList: [
                {
                    label: '采购单号',
                    value: 'purchaseNumber',
                    type: 'input'
                },
                {
                    label: '操作时间',
                    value: 'time',
                    type: 'time'
                },
                {
                    label: '系统sku',
                    value: 'productSku',
                    type: 'input'
                },
                {
                    label: '供应商',
                    value: 'supplierId',
                    type: 'select',
                    children: [],
                    props: {
                        value: 'supplierId',
                        label: 'supplierName'
                    }
                }
            ],
            btnList: [
                {
                    name: '质检操作',
                    fn: () => {
                        this.$router.push({
                            name: 'qualityTestingHandle'
                        });
                    }
                },
                {
                    name: '作废',
                    type: 'danger',
                    fn: name => {
                        if (this.purchaseQcIds.length) {
                            this.$confirm(
                                '此操作将导致该订单号作废, 是否继续?',
                                '提示',
                                {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }
                            )
                                .then(() => {
                                    this.cancellation();
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
                    name: '不良品退回操作',
                    fn: () => {
                        this.$router.push({
                            name: 'rejectsBack'
                        });
                    }
                },
                {
                    name: '导出质检入库Excel',
                    fn: () => {
                        this.ExcelDialogVisible = true;
                    }
                }
            ],
            tableList: [],
            columns: [
                {
                    value: 'purchaseNumber',
                    label: '采购清单号'
                },
                {
                    value: 'customSku',
                    label: '自定义SKU'
                },
                {
                    value: 'supplierName',
                    label: '供应商'
                },
                {
                    value: 'productSku',
                    label: '产品sku'
                },
                {
                    value: 'productNameZh',
                    label: '产品中文名'
                },
                {
                    value: 'productBarCode',
                    label: '产品条形码'
                },
                {
                    value: 'pinQuantity',
                    label: '销单数量'
                },
                {
                    value: 'goodProductQuantity',
                    label: '良品数量'
                },
                {
                    value: 'rejectsQuantity',
                    label: '不良品数量'
                },
                {
                    value: 'rejectsReturnQuantity',
                    label: '不良品退还供应商数量'
                },
                {
                    value: 'inspectQuantity',
                    label: '抽检/全检数量'
                },
                {
                    value: 'inspectTypeName',
                    label: '质检类型'
                },
                {
                    value: 'purchasersName',
                    label: '采购人员'
                },
                {
                    value: 'inspectName',
                    label: '质检操作人员'
                },
                {
                    value: 'cancelFlagName',
                    label: '是否作废'
                },
                {
                    value: 'inspectBatchNumber',
                    label: '质检批次号'
                },
                {
                    value: 'createTime',
                    label: '添加时间'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            backFormLoading: false,
            backDialogVisible: false,
            backFormInfo: {},
            lookoverDialogVisible: false,
            lookoverList: [],
            lookoverColumns: [
                { value: 'requirement', label: '需求总数' },
                { value: 'pinQuantity', label: '采购单销单数量' },
                { value: 'totalInspectQuantity', label: '质检总数量' },
                { value: 'rejectsQuantity', label: '不良品数量' }
            ],
            lookoverInfo: {},
            purchaseQcIds: [],
            ExcelDialogVisible: false,
            ExcelForm: {
                time: []
            },
            ExcelFormRules: {
                time: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ]
            },
            ExcelFormLoading: false,
            searchInfo: {},
            purchaseQcId: null
        };
    },
    components: {
        backForm
    },
    methods: {
        //
        handleSelectionChange(val) {
            this.purchaseQcIds = val.map(item => item.purchaseQcId);
        },
        //导出质检入库Excel取消
        cancel(formName) {
            this.$refs[formName].resetFields();
            this.ExcelDialogVisible = false;
        },
        //导出质检入库Excel确定
        submitExport(formName) {
            let self = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    self.ExcelFormLoading = true;
                    self.$api['procurement/QCExport']({
                        startTime: self.ExcelForm.time[0],
                        endTime: self.ExcelForm.time[1]
                    })
                        .then(res => {
                            self.ExcelFormLoading = false;
                            window.location.href = res.path;
                            self.ExcelDialogVisible = false;
                        })
                        .catch(err => {
                            self.ExcelFormLoading = false;
                        });
                } else {
                    return false;
                }
            });
        },
        //作废
        cancellation() {
            let self = this;
            self.$api['procurement/QCCancenHistortQC']({
                purchaseQcIds: self.purchaseQcIds
            })
                .then(res => {
                    this.$message.success(res.msg);
                    this.getList();
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        //查看
        lookover(purchaseQcId) {
            this.lookoverDialogVisible = true;
            let self = this;
            self.$api['procurement/QCDetail']({
                purchaseQcId
            }).then(res => {
                let infoObj = Object.assign({}, res.rows);
                self.lookoverInfo = infoObj;
                self.lookoverList = infoObj.list;
            });
        },
        //不良品取消
        resetForm() {
            this.$refs.backForm.resetForm();
            this.backDialogVisible = false;
        },
        //不良品退回确定
        submitForm() {
            let self = this;
            this.$refs.backForm.submitForm(val => {
                this.backFormLoading = true;

                self.$api['procurement/QCRejectsRetuen']({
                    purchaseProductBarCode: val.purchaseProductBarCode,
                    returnAmount: val.returnAmount,
                    returnFreight: val.returnFreight,
                    purchaseQcId: self.purchaseQcId,
                    returnDetail: [
                        {
                            returnSupplierId: self.backFormInfo.supplierId,
                            returnQuantity: val.returnQuantity
                        }
                    ]
                })
                    .then(res => {
                        self.backFormLoading = false;
                        this.$msg(res.msg);
                        this.$refs.backForm.resetForm();
                        this.getList();
                        this.backDialogVisible = false;
                    })
                    .catch(err => {
                        self.backFormLoading = false;
                    });
            });
        },
        //不良品退回
        back(item) {
            this.backDialogVisible = true;
            this.purchaseQcId = item.purchaseQcId;
            this.backFormInfo = {
                purchaseNumber: item.purchaseNumber,
                productSku: item.productSku,
                number: item.rejectsQuantity - item.rejectsReturnQuantity,
                productBarCode: item.productBarCode,
                purchaseProductBarCode: item.purchaseProductBarCode,
                supplierId: item.supplierId
            };
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
            this.searchInfo = val;
            this.$refs.table.clearSelection();
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
                let obj = { ...this.searchInfo };
                let newObj = {};
                for (let key in obj) {
                    if (
                        key == 'time' &&
                        obj[key] != null &&
                        Array.isArray(obj[key]) &&
                        obj[key].length
                    ) {
                        newObj['qcStartTime'] = obj[key][0];
                        newObj['qcEndTime'] = obj[key][1];
                        continue;
                    }
                    if (obj[key]) newObj[key] = obj[key];
                }
                params = Object.assign({}, params, newObj);
            }
            self.$api['procurement/purchaseQCList'](params).then(res => {
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },
        ...mapActions('common', ['getSupplierList'])
    },
    mounted() {
        this.getList();
        if (this.$store.state.common.supplierList.length) {
            this.searchList[3].children = this.supplierList;
        } else {
            this.getSupplierList().then(_ => {
                this.searchList[3].children = this.supplierList;
            });
        }
    },
    computed: {
        ...mapGetters('common', ['supplierList'])
    }
};
</script>

<style lang="scss">
</style>
