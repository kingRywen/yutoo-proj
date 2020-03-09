<template>
    <!-- 不良品管理 -->
    <div>
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="searchList" @search="search"></search>
            </template>
            <template slot="table">
                <yt-table :data="tableList" ref="table" :columns="columns" :border="true" @handleSelectionChange="handleSelectionChange" reserveSelection="purchaseQcId">
                    <el-table-column label="操作" width="100" align="center" slot="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="back(scope.row)" v-if="(scope.row.rejectsQuantity - scope.row.rejectsReturnQuantity)?true:false">退回</el-button>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
        </universal-layout>
        <!--  -->
        <el-dialog title="不良品退回" :visible.sync="backDialogVisible" width="530px" center>
            <backForm :info="backFormInfo" ref="backForm"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm()">取 消</el-button>
                <el-button type="primary" @click="submitForm()" :loading="backFormLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import backForm from './backForm';
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            btnList: [
                {
                    name: '导出',
                    value: '点击的是添加',
                    size: 'small',
                    type: 'success',
                    icon: 'el-icon-download',
                    fn: () => {
                        let purchaseQcIds;
                        let params = {
                            purchaseQcIds: this.purchaseQcIds
                        };

                        this.$api['procurement/rejectsExport'](params)
                            .then(res => {
                                window.location.href = res.path;
                            })
                            .catch(err => {
                                this.$message.error(err.msg);
                            });
                    }
                }
            ],
            columns: [
                {
                    value: 'productImg',
                    label: '图片',
                    width: '100',
                    img: true,
                    style: {
                        width: 60,
                        height: 60
                    },
                    bulkyHeight: 180
                },
                {
                    value: 'productName',
                    label: '名称'
                },
                {
                    value: 'purchasersName',
                    label: '采购人员'
                },
                {
                    value: 'customSku',
                    label: 'sku/自定义sku'
                },
                {
                    value: 'supplierName',
                    label: '供应商'
                },
                {
                    value: 'purchaseNumber',
                    label: '采购单号'
                },
                {
                    value: 'rejectsQuantity',
                    label: '不良品数量'
                },
                {
                    value: 'returnFlagName',
                    label: '是否退回'
                },
                {
                    value: 'rejectsReturnQuantity',
                    label: '退还供应商数量'
                },
                {
                    value: 'supplierReturnQuantity',
                    label: '供应商返还数量'
                },
                {
                    value: 'remark',
                    label: '不良备注'
                }
            ],
            tableList: [],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            backDialogVisible: false,
            backFormInfo: {},
            backFormLoading: false,
            purchaseQcIds: [],
            searchInfo: {},
            purchaseQcId: null,
            supplierId: null
        };
    },
    computed: {
        ...mapGetters('common', ['supplierList', 'allHandleUser']),
        searchList() {
            return [
                {
                    label: '产品sku',
                    value: 'productSku',
                    type: 'input'
                },
                {
                    label: '自定义sku',
                    value: 'customSku',
                    type: 'input'
                },
                {
                    label: '采购清单号',
                    value: 'purchaseNumber',
                    type: 'input'
                },
                {
                    label: '产品名称',
                    value: 'productName',
                    type: 'input'
                },
                {
                    label: '是否退回',
                    value: 'returnFlag',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        { label: '未退回', value: '0' },
                        { label: '部分退回', value: '1' },
                        { label: '已退回', value: '2' }
                    ]
                },
                {
                    label: '供应商',
                    value: 'supplierId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.$store.state.common.supplierList,
                    props: {
                        value: 'supplierId',
                        label: 'supplierName'
                    }
                },
                {
                    label: '操作人员',
                    value: 'inspectId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.allHandleUser.operator,
                    props: {
                        label: 'nickName',
                        value: 'userId'
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
                    label: '质检时间',
                    value: 'time',
                    type: 'time'
                },
                {
                    label: '不良品退回时间',
                    value: 'time1',
                    type: 'time'
                }
            ];
        }
    },
    methods: {
        //是否选择
        handleSelectionChange(val) {
            this.purchaseQcIds = val.map(item => item.purchaseQcId);
        },
        //取消
        resetForm() {
            this.$refs.backForm.resetForm();
            this.backDialogVisible = false;
        },
        //确定
        submitForm() {
            let self = this;
            this.$refs.backForm.submitForm(val => {
                self.backFormLoading = true;
                self.$api['procurement/QCRejectsRetuen']({
                    purchaseProductBarCode: val.purchaseProductBarCode,
                    returnAmount: val.returnAmount,
                    returnFreight: val.returnFreight,
                    purchaseQcId: self.purchaseQcId,
                    returnDetail: [
                        {
                            returnSupplierId: self.supplierId,
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
        //退回
        back(item) {
            this.backDialogVisible = true;
            this.purchaseQcId = item.purchaseQcId;
            this.supplierId = item.supplierId;
            this.backFormInfo = {
                purchaseNumber: item.purchaseNumber,
                productSku: item.productSku,
                number: item.rejectsQuantity - item.rejectsReturnQuantity,
                productBarCode: item.productBarCode,
                purchaseProductBarCode: item.purchaseProductBarCode
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
                let data = { ...this.searchInfo };
                let obj = {};
                for (let key in data) {
                    if (
                        key == 'time' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['qcStartTime'] = data[key][0];
                        obj['qcEndTime'] = data[key][1];
                        continue;
                    }
                    if (
                        key == 'time1' &&
                        data[key] != null &&
                        data[key] instanceof Array &&
                        data[key].length
                    ) {
                        obj['returnStartTime'] = data[key][0];
                        obj['returnEndTime'] = data[key][1];
                        continue;
                    }
                    if (data[key]) obj[key] = data[key];
                }
                params = Object.assign({}, params, obj);
            }
            self.$api['procurement/purchaseRejectsList'](params).then(res => {
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },
        ...mapActions('common', ['getSupplierList', 'getHandleUser'])
    },
    created() {
        this.getList();
        //获取供应商数据
        this.getSupplierList();

        //获取操作人员
        this.getHandleUser();
    },
    components: {
        backForm
    }
};
</script>

<style lang="scss">
</style>
