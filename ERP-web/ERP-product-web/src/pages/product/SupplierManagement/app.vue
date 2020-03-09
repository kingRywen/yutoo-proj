<template lang="html">
    <div class="toSellStrategy">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--  -->
        <div class="toSellStrategy-content">
            <!--  -->
            <el-form :inline="true" size="small">
                <div class="search">
                    <el-form-item>
                      <el-input v-model.trim="supplierName" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="getList('search')" icon="el-icon-search">搜 索</el-button>
                    </el-form-item>
                </div>
                <div class="mar10">
                    <el-form-item>
                      <el-button type="primary" icon="el-icon-plus" @click="add('添加供应商')">添 加</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="danger" icon="el-icon-delete" :disabled="!selectSupplierIds.length" @click="alldel">批 量 删 除</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <!--  -->
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                style="width:100%;"
                @selection-change="handleSelectionChange"
                :data="list" border height="620px">
                <el-table-column  type="selection"  width="55" align="center"></el-table-column>
                <template v-for="(item,index) in columns">
                    <el-table-column :label="item.label"  :width="item.width" :key="index" align="center">
                        <template slot-scope="scope">
                            <el-tooltip placement="right" effect="light" v-if="item.img">
                                <div slot="content">
                                    <img :src="scope.row[item.value]" width="auto" height="180"/>   
                                </div>
                                <img  v-if="item.img" :src="scope.row[item.value]" width="80" height="40"/>                                
                            </el-tooltip>    

                            <span v-else>{{ scope.row[item.value]}}</span>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
    <el-button type="text" @click="edit('编辑供应商',scope.row.supplierId)">编辑</el-button>
    <el-button type="text" @click="del(scope.row.supplierId)">删除</el-button>
</template>
                </el-table-column>
            </el-table>
            <!--   -->
            <el-pagination
                style="text-align: right;margin-top: 20px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        
        <!--  -->
        <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.visible"
            :top="'10Vh'"
            width="1000px">
            <!--  -->
               <addSupplier ref="addSupplier" :info="info"/> 
            <!--  -->
            <span slot="footer">
                <el-button
                    type="primary"
                    @click="save()"
                    :loading="dialog.loading"
                    class="save">保 存
                </el-button>
            </span>
        </el-dialog>
        <!--  -->
        

    </div>
</template>

<script>
import { getData } from 'common/http';
import { PROCUREMENT_URL } from 'common/config';
import addSupplier from './addSupplier.vue';
export default {
    data() {
        return {
            supplierName: '',
            list: [],
            loading: true,
            selectSupplierIds: [],
            supplierId: null,
            columns: [
                { label: '采购类型', value: 'purchaseTypeName' },
                { label: '付款方式', value: 'paymentMethodName' },
                { label: '供应商名称', value: 'supplierName' },
                {
                    label: '是否供应商备货',
                    width: '150',
                    value: 'supplierStockFlagName'
                },
                { label: '是否开票', value: 'invoiceFlagName' },
                { label: '是否黑名单', value: 'blacklistFlagName' },
                { label: '供应商地址', value: 'supplierAddress' },
                { label: '对应仓库', value: 'depotName' },
                { label: '联系人', value: 'contact' },

                { label: '供应商级别', value: 'supplierLevelName' },
                { label: '账期', value: 'accountPeriodName' },
                // { label: '开发人员', value: 'responsibleDeveloper' },
                // { label: '采购人员', value: 'purchaseIdName' },
                { label: '采购点', value: 'purchasePointName' },
                { label: '添加时间', value: 'createTime', width: '200' }
            ],
            dialog: {
                title: '',
                visible: false,
                loading: false
            },
            dialogForm: {},
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入规则名称',
                        trigger: 'blur'
                    }
                ]
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            info: {}
        };
    },
    mounted() {
        this.getList();
    },
    components: {
        addSupplier
    },
    methods: {
        //添加
        add(title) {
            this.dialog.visible = true;
            this.dialog.title = title;
            this.info = {};
            this.$nextTick(() => {
                this.$refs.addSupplier.resetForm();
            });
        },
        getInfo(supplierId) {
            getData('/supplier/info', { supplierId }, PROCUREMENT_URL).then(
                res => {
                    if (res.data.code == 0) {
                        this.$nextTick(() => {
                            this.info = Object.assign({}, res.data.rows);
                        });
                    } else {
                        this.$message.error(res.data.msg);
                    }
                }
            );
        },
        //编辑
        edit(title, supplierId) {
            this.dialog.visible = true;
            this.dialog.title = title;
            this.supplierId = supplierId;
            this.$nextTick(() => {
                this.$refs.addSupplier.resetForm();
                this.getInfo(supplierId);
            });
        },
        //保存
        save(formName) {
            this.$refs.addSupplier.submitForm(data => {
                let url;
                let params = Object.assign({}, data);
                if (this.dialog.title == '添加供应商') {
                    url = '/supplier/save';
                } else {
                    url = '/supplier/update';
                    params = Object.assign({}, params, {
                        supplierId: this.supplierId
                    });
                }
                getData(url, params, PROCUREMENT_URL).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success(res.data.msg);
                        this.dialog.visible = false;
                        this.getList();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            });
        },
        //删除
        isDel(params) {
            getData('/supplier/remove', params, PROCUREMENT_URL).then(res => {
                if (res.data.code == 0) {
                    this.$message.success(res.data.msg);
                    this.getList();
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //批量删除
        alldel() {
            if (this.selectSupplierIds.length) {
                this.isDel({ supplierIds: this.selectSupplierIds });
            } else {
                this.$message.warning('请选择要批量删除的供应商');
            }
        },
        //单个删除
        del(supplierId) {
            this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.isDel({ supplierIds: Array.of(supplierId) });
                })
                .catch(() => {
                    return false;
                });
        },
        //勾选
        handleSelectionChange(val) {
            this.selectSupplierIds = val.map(item => item.supplierId);
        },
        //获取列表数据
        getList(val) {
            this.loading = true;
            let params = {
                sortOrder: 'asc',
                pageSize: this.pageSize,
                pageNumber: this.currentPage
            };
            if (val == 'search') {
                params = Object.assign({}, params, {
                    supplierName: this.supplierName
                });
            }
            getData('supplier/list/all', params, PROCUREMENT_URL).then(res => {
                this.loading = false;
                this.dialog.loading = false;
                if (res.data.code == 0) {
                    this.list = res.data.rows;
                    this.currentPage = res.data.pageNo;
                    this.pageSize = res.data.pageSize;
                    this.total = res.data.total;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList('search');
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList('search');
        }
    }
};
</script>

<style lang="scss">
@import '../../../assets/style/style-scss/layout.scss';
.el-table th {
    background-color: #f3f3f3;
}
.pad10 {
    padding: 10px;
}
.mar10 {
    margin: 10px 0;
    .el-form-item {
        margin-bottom: 0;
    }
}
.toSellStrategy {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.toSellStrategy-content {
    @extend .pad10;
    flex: 1;
    background: #fff;
    .search {
        @extend .pad10;
        background: #f2f2f2;
        border-radius: 5px;
        .el-form-item {
            margin-bottom: 0;
        }
    }
}
.el-dialog__footer {
    text-align: center !important;
    .save {
        width: 200px;
    }
}
.textarea {
    textarea {
        min-height: 100px !important;
    }
}
.hintcolor {
    color: #f56c6c;
    font-size: 12px;
    margin-top: -7px;
}
</style>
