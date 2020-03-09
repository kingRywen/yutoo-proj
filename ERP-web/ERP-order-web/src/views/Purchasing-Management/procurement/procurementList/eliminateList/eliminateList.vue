<template>
    <!-- 销单管理 -->
    <div class>
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="searchList" @search="search">
                    <!-- <el-button type="info" size="small" slot="right">自定义筛选条件</el-button> -->
                </search>
            </template>
            <template slot="btnRight">
                <!-- <el-button type="info" size="small" slot="right">自定义列表</el-button> -->
            </template>
            <template slot="table">
                <yt-table :data="tableList" :columns="columns" ref="table" reserveSelection="purchaseId" :border="true" @handleSelectionChange="handleSelectionChange">
                    <el-table-column label="操作" width="100" align="center" slot="left">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="销单" placement="bottom">
                                <i class="iconfont icon-OA_gongzuoxiaohui iconBtn" v-if="!scope.row.pinFlag" @click="cancelOrder(scope.row.pinOrderNumber,scope.row.purchaseOrderPinId)"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
            <router-view></router-view>
        </universal-layout>
        <el-dialog title="批量提取未销单SKu信息" :visible.sync="extractDialogVisible" width="700px" center>
            <div style="height:530px;overflow-y: auto;">
                <yt-table :data="extractList" :columns="extractColumns" :border="true" :selection="false"></yt-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="extractDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="extractDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!--  -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" center>
            <component :is="dialog.component" ref="component"></component>

            <span slot="footer" class="dialog-footer" v-if="dialog.component=='cancelOrderForm'">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="submitCancelForm" :loading="loadingform">确 认 销 单</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import cancelOrderForm from './cancelOrderForm';
import { mapActions, mapGetters } from 'vuex';
import eliminateForm from '../orderformList/components/eliminateForm.vue';
import queryOrderForm from '../orderformList/components/queryOrderForm';

export default {
    data() {
        return {
            btnList: [
                {
                    name: '批量打印进货单',
                    fn: () => {
                        if (this.selectList.length) {
                            window.open(
                                `#/print?title=打印进货单&purchaseOrderPinIds=${this.selectList
                                    .map(el => el.purchaseOrderPinId)
                                    .join(',')}`
                            );
                        }
                        // if (this.isSelectList.length == 0) {
                        //   this.$api['procurement/pinOrderPrintPurchase']({
                        //     purchaseOrderPinIds: this.isSelectList
                        //   })
                        //     .then(res => {
                        //       const { href } = this.$router.resolve({
                        //         name: 'print',
                        //         query: {
                        //           purchaseOrderPinIds: this.isSelectList,
                        //           title: '批量打印进货单'
                        //         }
                        //       })
                        //       window.open(href, '_blank')
                        //     })
                        //     .catch(err => {
                        //       this.$message.error(err.msg)
                        //     })
                        // } else {
                        //   this.$message({
                        //     showClose: true,
                        //     message: '请选择需要打印的发货单数据',
                        //     type: 'warning'
                        //   })
                        // }
                    }
                },
                {
                    name: '批量提取未销单SKu信息',
                    fn: () => {
                        let self = this;
                        this.extractDialogVisible = true;
                        self.$api['procurement/pinOrderExtractUnsold']().then(
                            res => {
                                this.extractList = res.rows;
                            }
                        );
                    }
                }
            ],
            tableList: [],
            columns: [
                {
                    label: '采购订单号',
                    width: 135,
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.openDesignated.bind(
                                    this,
                                    scope.row,
                                    1
                                )}
                            >
                                {scope.row.lowerSingleNumber}
                            </el-button>
                        );
                    }
                },
                {
                    label: '采购清单号',
                    width: 135,
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.openDesignated.bind(
                                    this,
                                    scope.row,
                                    2
                                )}
                            >
                                {scope.row.purchaseNumber}
                            </el-button>
                        );
                    }
                },
                {
                    label: '销单号',
                    width: 135,
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.openDesignated.bind(
                                    this,
                                    scope.row,
                                    3
                                )}
                            >
                                {scope.row.pinOrderNumber}
                            </el-button>
                        );
                    }
                },
                {
                    value: 'productQuantity',
                    label: '订单产品数'
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
                    value: 'singleQuantity',
                    label: '下单数量'
                },
                {
                    value: 'pinQuantity',
                    label: '已销单数量'
                },
                {
                    value: 'warehousesQuantity',
                    label: '入库数量'
                },
                {
                    value: 'purchasersName',
                    label: '采购人员'
                },
                {
                    value: 'createTime',
                    label: '下单时间',
                    width: 140
                },
                {
                    value: 'paymentMethodName',
                    label: '付款方式'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            isSelectList: [],
            selectList: [],
            extractDialogVisible: false,
            extractList: [],
            extractColumns: [
                { value: 'productSku', label: '产品SKU' },
                { value: 'quantity', label: '数量' },
                { value: 'productName', label: '产品中文名' }
            ],

            purchaseOrderPinId: null,
            loadingform: false,
            searchInfo: {},
            dialog: {
                component: '',
                title: '',
                width: '1300px',
                visible: false
            }
        };
    },
    computed: {
        ...mapGetters('common', ['allHandleUser', 'warehouseList']),
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
                    label: '产品条形码',
                    value: 'productBarCode',
                    type: 'input',
                    style: {
                        width: '120px'
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
                        { label: '是', value: '1' },
                        { label: '否', value: '0' }
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
                    label: '销单状态',
                    value: 'pinFlag',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        { label: '已销单', value: '1' },
                        { label: '未销单', value: '0' }
                    ]
                },
                {
                    label: '下单日期',
                    value: 'time',
                    type: 'time'
                }
            ];
        }
    },
    methods: {
        openDesignated(row, type) {
            console.log(row, type);
            switch (type) {
                case 1:
                    this.changeDialogStatus(
                        `订单详情-${row.purchaseNumber}`,
                        'queryOrderForm'
                    );
                    this.$nextTick(() => {
                        this.$refs.component.getListData(row.lowerSingleNumber);
                    });
                    break;
                case 2:
                    this.$router.push({
                        name: 'purchaseDetailed',
                        query: {
                            purchaseId: row.purchaseId,
                            purchaseNumber: row.purchaseNumber
                        }
                    });

                    break;
                default:
                    this.changeDialogStatus(
                        `销单详情 - ${row.pinOrderNumber}`,
                        'eliminateForm'
                    );
                    this.$nextTick(() => {
                        this.$refs.component.getListData(row.pinOrderNumber);
                    });
                    break;
            }
        },
        changeDialogStatus(title, component, width = '1350px', visible = true) {
            this.dialog.title = title;
            this.dialog.width = width;
            this.dialog.visible = visible;
            this.dialog.component = component;
        },
        // 确 认 销 单
        submitCancelForm() {
            this.$refs.component.submitForm(products => {
                this.loadingform = true;
                this.$api['procurement/pinOrderPinOrder']({
                    purchaseOrderPinId: this.purchaseOrderPinId,
                    products
                })
                    .then(res => {
                        this.$message.success(res.msg);
                        this.dialog.visible = false;
                        this.loadingform = false;
                        this.getList();
                    })
                    .catch(err => {
                        this.$message.error(err.msg);
                        this.loadingform = false;
                    });
            });
        },
        //销单
        cancelOrder(pinOrderNumber, purchaseOrderPinId) {
            this.changeDialogStatus('采购销单', 'cancelOrderForm');
            this.purchaseOrderPinId = purchaseOrderPinId;
            this.$nextTick(() => {
                this.$refs.component.getListData(pinOrderNumber);
            });
        },
        //是否选择列表项
        handleSelectionChange(val) {
            this.selectList = val;
            this.isSelectList = val.map(item => item.paymentMethod);
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
                    if (data[key]) obj[key] = data[key];
                }
                params = Object.assign({}, params, obj);
            }
            self.$api['procurement/pinOrderList'](params).then(res => {
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },
        ...mapActions('common', ['getHandleUser', 'getWarehouseList'])
    },
    mounted() {
        this.getList(1);
        this.getHandleUser();
        this.getWarehouseList();
    },
    components: {
        cancelOrderForm,
        eliminateForm,
        queryOrderForm
    }
};
</script>

<style lang="scss">
</style>
