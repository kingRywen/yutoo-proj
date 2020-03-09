
<template>
    <!-- 采购异常管理 -->
    <div>
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="searchList" @search="search"></search>
            </template>
            <template slot="table">
                <yt-table :data="tableList" :columns="columns" ref="table" :border="true" @handleSelectionChange="handleSelectionChange" reserveSelection="purchaseExceptionId">
                    <!-- <el-table-column label="操作" width="100" align="center" slot="right">
                    <template slot-scope="scope">
                        <el-button type="text">审核</el-button>
                        <el-button type="text">取消</el-button>
                    </template>
                    </el-table-column>-->
                </yt-table>
            </template>
        </universal-layout>

        <!--  -->
        <el-dialog :title="title" :visible.sync="visible" width="1200px" center>
            <queryOrderForm ref="component"></queryOrderForm>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex';
import queryOrderForm from '../procurementList/orderformList/components/queryOrderForm';
export default {
    data() {
        return {
            title: '',
            visible: false,
            btnList: [
                {
                    name: '导出采购单问题',
                    fn: () => {
                        if (this.purchaseExceptionIds.length) {
                            this.$api['procurement/exceptionExport']({
                                purchaseExceptionIds: this.purchaseExceptionIds
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
                    name: '设置已处理',
                    fn: () => {
                        let self = this;
                        if (this.purchaseExceptionIds.length) {
                            this.$confirm(
                                '此操作将更改单号状态, 是否继续?',
                                '提示',
                                {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }
                            )
                                .then(() => {
                                    self.$api['procurement/exceptionSetHandle'](
                                        {
                                            purchaseExceptionIds:
                                                self.purchaseExceptionIds,
                                            state: 1
                                        }
                                    )
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
                            this.$message.warning('请选择需要设置状态的数据');
                        }
                    }
                },
                {
                    name: '设置未处理',
                    fn: () => {
                        if (this.purchaseExceptionIds.length) {
                            let self = this;
                            this.$confirm(
                                '此操作将更改单号状态, 是否继续?',
                                '提示',
                                {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }
                            )
                                .then(() => {
                                    self.$api['procurement/exceptionSetHandle'](
                                        {
                                            purchaseExceptionIds:
                                                self.purchaseExceptionIds,
                                            state: 0
                                        }
                                    )
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
                            this.$message.warning('请选择需要设置状态的数据');
                        }
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
                    value: 'productImg',
                    label: '图片',
                    width: '100',
                    img: true,
                    style: {
                        width: 50,
                        height: 50
                    },
                    bulkyHeight: 180
                },
                {
                    value: 'productName',
                    label: '产品名称'
                },
                {
                    value: 'problemTypeName',
                    label: '问题类型',
                    style: {
                        color: '#e6a23c'
                    }
                },
                {
                    value: 'stateName',
                    label: '状态'
                },
                {
                    value: 'purchasersName',
                    label: '采购人员'
                },
                {
                    value: 'developName',
                    label: '开发人员'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            purchaseExceptionIds: [],
            searchInfo: {}
        };
    },
    methods: {
        queryOrderFormInfo(lowerSingleNumber, purchaseNumber) {
            this.visible = true;
            this.title = `订单详情 - ${purchaseNumber}`;
            this.$nextTick(() => {
                this.$refs.component.getListData(lowerSingleNumber);
            });
        },
        //
        handleSelectionChange(val) {
            this.purchaseExceptionIds = val.map(
                item => item.purchaseExceptionId
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
                let data = {};
                let obj = { ...this.searchInfo };
                for (let key in obj) {
                    if (
                        key == 'time' &&
                        obj[key] instanceof Array &&
                        obj[key].length
                    ) {
                        data['purchaseStartTime'] = obj[key][0];
                        data['purchaseEndTime'] = obj[key][1];
                        continue;
                    }
                    if (obj[key]) data[key] = obj[key];
                }
                params = Object.assign({}, params, data);
            }
            self.$api['procurement/exceptionList'](params).then(res => {
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },
        ...mapActions('common', ['getHandleUser'])
    },
    computed: {
        ...mapGetters('common', ['allHandleUser']),
        searchList() {
            return [
                {
                    label: '问题类型',
                    value: 'problemType',
                    type: 'select',
                    style: {
                        width: '200px'
                    },
                    children: [
                        { label: '采购价格变低', value: '1' },
                        { label: '采购标志停产', value: '2' },
                        { label: '采购标志缺货', value: '3' },
                        { label: '采购销单数量比需求量高', value: '4' },
                        { label: '采购价比供货价高', value: '5' },
                        { label: '采购数量与入库数量不符', value: '6' }
                    ]
                },
                {
                    label: '产品状态',
                    value: 'productState',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        { label: '正常', value: '1' },
                        { label: '仅批量', value: '2' },
                        { label: '暂时缺货', value: '3' },
                        { label: '停产', value: '4' },
                        { label: '锁定', value: '5' },
                        { label: '清库', value: '6' }
                    ]
                },
                {
                    label: '处理人员',
                    value: 'handleId',
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
                    label: '开发人员',
                    value: 'developId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.allHandleUser.delevlop,
                    props: {
                        label: 'nickName',
                        value: 'userId'
                    }
                },
                {
                    label: '销单人员',
                    value: 'pinId',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: this.allHandleUser.saleman,
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
                    label: '关键词',
                    value: 'productName',
                    type: 'input'
                },
                {
                    label: '销单时间',
                    value: 'time',
                    type: 'time'
                }
            ];
        }
    },
    mounted() {
        this.getList();
        //获取操作人员
        this.getHandleUser();
    },
    components: {
        queryOrderForm
    }
};
</script>

<style lang="scss">
</style>
