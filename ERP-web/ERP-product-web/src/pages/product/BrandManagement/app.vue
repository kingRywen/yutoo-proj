<template lang="html">
    <div class="toSellStrategy">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item>品牌管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--  -->
        <div class="toSellStrategy-content">
            <!--  -->
            <el-form :inline="true" size="small">
                <div class="search">
                    <el-form-item>
                      <el-input v-model.trim="name" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="getList('search')" icon="el-icon-search">搜 索</el-button>
                    </el-form-item>
                </div>
                <div class="mar10">
                    <el-form-item>
                      <el-button type="primary" icon="el-icon-plus" @click="add('添加品牌')">添 加</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="danger"  icon="el-icon-delete" :disabled="!selectProductBrandIds.length" @click="alldel">批 量 删 除</el-button>
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
                :data="list" border height="620">
                <el-table-column  type="selection"  width="55" align="center"></el-table-column>
                <template v-for="(item,index) in columns">
                    <el-table-column :label="item.label"  :width="item.width" :key="index" align="center">
                        <template slot-scope="scope">
                            <el-tooltip placement="right" effect="light" v-if="item.img">
                                <div slot="content">
                                    <img :src="scope.row[item.value]" width="auto" height="180"/>   
                                </div>
                                <img  v-if="item.img" :src="scope.row[item.value]" width="auto" height="40"/>                                
                            </el-tooltip>    

                            <span v-else>{{ scope.row[item.value]}}</span>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
    <el-button type="text" @click="edit('编辑品牌',scope.row.productBrandId)">编辑</el-button>
    <el-button type="text" @click="del(scope.row.productBrandId)">删除</el-button>
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
               <brand ref="brand" :info="info"/> 
            <!--  -->
            <span slot="footer">
                <el-button
                    type="primary"
                    @click="save('dialogForm')"
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
import Brand from '../components/addBrand.vue';
export default {
    data() {
        return {
            name: '',
            list: [],
            loading: true,
            selectProductBrandIds: [],
            productBrandId: null,
            columns: [
                { label: '排序', width: '80', value: 'ranking' },
                { label: '品牌名称', width: '200', value: 'brandNameEn' },
                { label: '品牌中文名称', width: '200', value: 'brandNameZh' },
                {
                    label: '品牌LOGO',
                    width: '200',
                    value: 'brandLogo',
                    img: true
                },
                { label: '品牌类型', width: '150', value: 'brandTypeName' },
                { label: '品牌链接', value: 'categoryLinkAddress' },
                { label: '是否激活', width: '100', value: 'activationFlagName' }
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
        Brand
    },
    methods: {
        //添加
        add(title) {
            this.dialog.visible = true;
            this.dialog.title = title;
            this.info = {};
            this.$nextTick(() => {
                this.$refs.brand.clearForm();
            });
        },
        getInfo(productBrandId) {
            this.http('/product/brand/info', { productBrandId }, res => {
                this.info = Object.assign({}, res.data.rows);
            });
        },
        //编辑
        edit(title, productBrandId) {
            this.dialog.visible = true;
            this.dialog.title = title;
            this.productBrandId = productBrandId;
            this.$nextTick(() => {
                this.$refs.brand.clearForm();
                this.getInfo(productBrandId);
            });
        },
        //保存
        save(formName) {
            let productBrandId = null;
            if (this.dialog.title == '添加品牌') {
                productBrandId = null;
            } else {
                productBrandId = this.productBrandId;
            }
            this.$refs.brand.ok(productBrandId, res => {
                if (res) {
                    this.dialog.visible = false;
                    this.getList();
                }
            });
        },
        //删除
        isDel(params) {
            this.http('/product/brand/remove', params, res => {
                this.$message.success(res.data.msg);
                this.getList();
            });
        },
        //批量删除
        alldel() {
            if (this.selectProductBrandIds.length) {
                this.isDel({ productBrandIds: this.selectProductBrandIds });
            } else {
                this.$message.warning('请选择要批量删除的品牌');
            }
        },
        //单个删除
        del(productBrandId) {
            this.$confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.isDel({ productBrandIds: Array.of(productBrandId) });
                })
                .catch(() => {
                    return false;
                });
        },
        //勾选
        handleSelectionChange(val) {
            this.selectProductBrandIds = val.map(item => item.productBrandId);
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
                    name: this.name
                });
            }

            this.http('/product/brand/list', params, res => {
                this.list = res.data.rows;
                this.currentPage = res.data.pageNo;
                this.pageSize = res.data.pageSize;
                this.total = res.data.total;
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList('search');
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList('search');
        },
        http(url, params, callback) {
            return getData(url, params).then(res => {
                this.loading = false;
                this.dialog.loading = false;
                if (res.data.code == 0) {
                    callback && callback(res);
                } else {
                    this.$message.error(res.data.msg);
                }
            });
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
