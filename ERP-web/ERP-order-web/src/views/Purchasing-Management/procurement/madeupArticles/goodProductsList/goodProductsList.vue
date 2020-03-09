<template>
    <!-- 成品加工订单列表 -->
    <div>
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
                <yt-table :data="tableList" :columns="columns" ref="table" :border="true" @handleSelectionChange="handleSelectionChange" reserveSelection="purchaseId">
                    <!-- <el-table-column label="操作" width="100" align="center" slot="right">
                    <template slot-scope="scope">
                        <el-button type="text">查看订单详情</el-button>
                        <el-button type="text">打印合同</el-button>
                        <el-button type="text">查看理由</el-button>
                    </template>
                    </el-table-column>-->
                </yt-table>
            </template>
            <router-view></router-view>
        </universal-layout>
        <!--  -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" center>
            <component :is="dialog.component" ref="component" :data="productsList"></component>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex';
import queryOrderForm from '../../procurementList/orderformList/components/queryOrderForm';
import productsImg from '../../procurementList/detailedList/productsImg.vue';
export default {
    data() {
        return {
            searchList: [
                {
                    label: '是否生成',
                    value: 'intimidateFlag',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        },
                        {
                            label: '否',
                            value: '0'
                        }
                    ]
                },
                {
                    label: '采购单完结状态',
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
                    label: '加工情况',
                    value: 'worksheetState',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '已加工',
                            value: '2'
                        },
                        {
                            label: '加工中',
                            value: '1'
                        },
                        {
                            label: '未加工',
                            value: '0'
                        }
                    ]
                },
                {
                    label: '所有供应商',
                    value: 'supplierId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [],
                    props: {
                        value: 'supplierId',
                        label: 'supplierName'
                    }
                },
                {
                    label: '时间',
                    value: 'time',
                    type: 'time',
                    style: {
                        width: '150px'
                    }
                }
            ],
            btnList: [
                {
                    name: '打回加工单',
                    fn: () => {
                        if (this.purchaseFinishedWorksheetIds.length) {
                            let self = this;
                            this.$prompt('请输入打回原因', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                inputPattern: /\S/,
                                inputErrorMessage: '打回原因不能为空'
                            })
                                .then(({ value }) => {
                                    self.$api[
                                        'procurement/finishedFinishedRepluse'
                                    ]({
                                        purchaseFinishedWorksheetIds:
                                            self.purchaseFinishedWorksheetIds,
                                        repulseReason: value
                                    })
                                        .then(res => {
                                            self.$message.success(res.msg);
                                            self.getList();
                                        })
                                        .catch(err => {
                                            self.$message.error(err.msg);
                                        });
                                })
                                .catch(() => {
                                    return false;
                                });
                        } else {
                            this.$message.warning('请选择需要打回加工单的数据');
                        }
                    }
                },
                {
                    name: '生成成品加工单',
                    fn: () => {
                        if (this.purchaseFinishedWorksheetIds.length) {
                            let self = this;
                            this.$confirm(
                                '确定生成加工单吗, 是否继续?',
                                '提示',
                                {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }
                            )
                                .then(() => {
                                    self.$api['procurement/finishedGenerate']({
                                        purchaseFinishedWorksheetIds:
                                            self.purchaseFinishedWorksheetIds
                                    })
                                        .then(res => {
                                            self.$message.success(res.msg);
                                            self.getList();
                                        })
                                        .catch(err => {
                                            self.$message.error(err.msg);
                                        });
                                })
                                .catch(() => {
                                    return false;
                                });
                        } else {
                            this.$message.warning(
                                '请选择需要生成的成品加工单的数据'
                            );
                        }
                    }
                },
                {
                    name: '导出Excel',
                    fn: () => {
                        if (this.purchaseFinishedWorksheetIds.length) {
                            this.$api['procurement/finishedExport']({
                                purchaseFinishedWorksheetIds: this
                                    .purchaseFinishedWorksheetIds
                            })
                                .then(res => {
                                    window.location.href = res.path;
                                })
                                .catch(err => {
                                    this.$message.error(err.msg);
                                });
                        } else {
                            this.$message.warning('请选择需要导出的数据');
                        }
                    }
                },
                {
                    name: '导出未生成情况',
                    fn: () => {
                        this.$api['procurement/exportNotGenerated']()
                            .then(res => {
                                window.location.href = res.path;
                            })
                            .catch(err => {
                                this.$message.error(err.msg);
                            });
                    }
                }
            ],
            tableList: [],
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
                    value: 'completeStateName',
                    label: '状态'
                },
                {
                    value: 'purchaseNumber',
                    label: '采购清单号',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.details.bind(
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
                    value: 'productImg',
                    label: '图片',
                    img: true,
                    style: {
                        width: 60,
                        height: 60
                    },
                    bulkyHeight: 180
                },
                {
                    value: 'skuCount',
                    label: 'sku总数',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                size="mini"
                                onClick={this.looksku.bind(this, scope.row)}
                                style={{
                                    color: '#30CC7B',
                                    fontSize: '12px',
                                    fontWeight: 700
                                }}
                            >
                                {scope.row.skuCount}
                            </el-button>
                        );
                    }
                },
                {
                    value: 'requirementQuantity',
                    label: '需求总数'
                },
                {
                    value: 'machiningQuantity',
                    label: '已加工总数'
                },
                {
                    value: 'generateFlagName',
                    label: '是否生成'
                },
                {
                    value: 'machiningTime',
                    label: '加工完成时间'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            purchaseFinishedWorksheetIds: [],
            searchInfo: {},
            dialog: {
                title: '',
                width: '',
                visible: false,
                component: ''
            },
            productsList: []
        };
    },
    computed: {
        ...mapGetters('common', ['supplierList'])
    },
    methods: {
        details(purchaseId, purchaseNumber) {
            console.log(purchaseId, purchaseNumber);
            this.$router.push({
                name: 'madeupArticlespurchaseDetailed',
                query: {
                    purchaseId,
                    purchaseNumber
                }
            });
        },
        looksku(row) {
            console.log(row.products);
            this.dialog.title = 'SKU图片';
            this.dialog.visible = true;
            this.dialog.component = 'productsImg';
            this.dialog.width = '600px';
            this.productsList = row.products;
        },
        queryOrderFormInfo(lowerSingleNumber, purchaseNumber) {
            this.dialog.visible = true;
            this.dialog.title = `订单详情 - ${lowerSingleNumber}`;
            this.dialog.width = '1200px';
            this.dialog.component = 'queryOrderForm';
            this.$nextTick(() => {
                this.$refs.component.getListData(lowerSingleNumber);
            });
        },
        handleSelectionChange(val) {
            this.purchaseFinishedWorksheetIds = val.map(
                item => item.purchaseFinishedWorksheetId
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
                let obj = { ...this.searchInfo };
                let data = {};
                for (let key in obj) {
                    if (
                        key == 'time' &&
                        obj[key] instanceof Array &&
                        obj[key].length
                    ) {
                        data['startTime'] = obj[key][0];
                        data['endTime'] = obj[key][1];
                        continue;
                    }
                    if (obj[key]) data[key] = obj[key];
                }
                params = Object.assign({}, params, data);
            }
            self.$api['procurement/finishedList'](params).then(res => {
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },
        ...mapActions('common', ['getSupplierList'])
    },
    mounted() {
        //获取供应商数据
        if (this.$store.state.common.supplierList.length) {
            this.searchList[3].children = this.supplierList;
        } else {
            this.getSupplierList().then(_ => {
                this.searchList[3].children = this.supplierList;
            });
        }
    },
    components: {
        queryOrderForm,
        productsImg
    }
};
</script>

<style lang="scss">
</style>
