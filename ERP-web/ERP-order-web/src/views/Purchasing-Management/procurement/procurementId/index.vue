<template>
    <!-- 采购财务账号管理 -->
    <div class>
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnList" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="searchList" @search="search"></search>
            </template>
            <template slot="table">
                <yt-table :data="tableList" :columns="columns" :border="true" reserveSelection="purchaseFinancialAccountId" ref="table">
                    <el-table-column label="操作" width="100" align="center" slot="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="edit(scope.row.purchaseFinancialAccountId)">编 辑</el-button>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
        </universal-layout>

        <el-dialog :title="title" :visible.sync="appEditDialogVisible" width="600px" center>
            <addEditForm ref="addEditForm" :info="editFormInfo"/>

            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="submitForm" :loading="addeditLoading">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import addEditForm from './addEditForm';
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        return {
            btnList: [
                {
                    name: '添 加',
                    fn: () => {
                        this.appEditDialogVisible = true;
                        this.title = '添加采购财务账号';
                        this.editFormInfo = {};
                        this.$nextTick(() => {
                            this.$refs.addEditForm.resetForm();
                        });
                    }
                }
            ],
            tableList: [],
            columns: [
                {
                    value: 'financialName',
                    label: '姓名'
                },
                {
                    value: 'alipayAccount',
                    label: '借款账号'
                },
                {
                    value: 'loanAmount',
                    label: '现金借款额度'
                },
                {
                    value: 'availableCash',
                    label: '可用现金额度'
                },
                {
                    value: 'paymentToPurchase',
                    label: '付款给采购'
                },
                {
                    value: 'networkAutomaticBorrowing',
                    label: '网络自动借款'
                },
                {
                    value: 'paymentToSupplier',
                    label: '付款给供应商'
                },
                {
                    value: 'paymentOfAli',
                    label: '阿里账期付款'
                },
                {
                    value: 'createTime',
                    label: '创建时间',
                    width: 140
                },
                {
                    value: 'updateTime',
                    label: '最后更新时间',
                    width: 140
                },
                {
                    value: 'stateName',
                    label: '状态'
                },
                {
                    value: 'remark',
                    label: '备注'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            appEditDialogVisible: false,
            title: '',
            purchaseFinancialAccountId: null,
            addeditLoading: false,
            editFormInfo: {},
            searchInfo: {}
        };
    },
    methods: {
        //编辑
        edit(purchaseFinancialAccountId) {
            let self = this;
            this.appEditDialogVisible = true;
            this.title = '编辑采购财务账号';
            this.purchaseFinancialAccountId = purchaseFinancialAccountId;
            this.$api['procurement/financeDetail']({
                purchaseFinancialAccountId
            })
                .then(res => {
                    self.editFormInfo = res.rows;
                })
                .catch(err => {
                    self.$message.error(err.msg);
                });
        },
        //添加编辑保存
        submitForm() {
            let self = this;
            this.$refs.addEditForm.submitForm(val => {
                let params = val;
                if (self.title == '编辑采购财务账号') {
                    params = Object.assign({}, val, {
                        purchaseFinancialAccountId:
                            self.purchaseFinancialAccountId
                    });
                }
                self.addeditLoading = true;
                self.$api['procurement/financeSave'](params)
                    .then(res => {
                        self.$message.success(res.msg);
                        self.addeditLoading = false;
                        this.appEditDialogVisible = false;
                        self.getList();
                    })
                    .catch(err => {
                        self.$message.error(res.msg);
                        self.addeditLoading = false;
                    });
            });
        },
        //添加编辑取消
        resetForm() {
            this.$refs.addEditForm.resetForm();
            this.appEditDialogVisible = false;
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
        getList(val = 'table') {
            let self = this;
            let params = {
                sortOrder: 'asc',
                pageSize: self.pageSize,
                pageNumber: self.pageNo
            };
            if (val == 'search') {
                let data = {};
                let obj = { ...this.searchInfo };
                for (let key in obj) {
                    if (obj[key]) data[key] = obj[key];
                }
                params = Object.assign({}, params, data);
            }
            self.$api['procurement/financeList'](params).then(res => {
                self.tableList = res.rows;
                self.pageNo = res.pageNo;
                self.pageSize = res.pageSize;
                self.total = res.total;
            });
        },
        ...mapActions('common', ['getHandleUser'])
    },

    created() {
        this.getList();
        this.getHandleUser();
    },
    computed: {
        ...mapGetters('common', ['allHandleUser']),
        searchList() {
            return [
                {
                    label: '采购人员',
                    value: 'financialId',
                    type: 'select',
                    children: this.allHandleUser.procurement,
                    props: {
                        label: 'nickName',
                        value: 'userId'
                    }
                },
                {
                    label: '状态',
                    value: 'state',
                    type: 'select',
                    children: [
                        {
                            label: '激活',
                            value: '1'
                        },
                        {
                            label: '未激活',
                            value: '0'
                        }
                    ]
                }
            ];
        }
    },
    components: {
        addEditForm
    }
};
</script>

<style lang="scss" scoped>
</style>
