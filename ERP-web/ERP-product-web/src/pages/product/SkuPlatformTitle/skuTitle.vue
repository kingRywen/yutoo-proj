<template>
    <div class="skuTitle">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item>SKU平台标题管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="padding:10px;">
            <div class="select">
                <div class="select_item">
                    <el-input placeholder="产品标题" v-model.trim="searchInfo.name" clearable size="small"/>
                </div>
                <div class="select_item">
                    <el-select v-model="searchInfo.platformId" placeholder="选择生成平台" clearable size="small">
                        <el-option v-for="item in platformList" :label="item.name" :value="item.platformId"/>
                    </el-select>
                </div>
                <div class="select_item">
                    <el-select v-model="searchInfo.storeId" placeholder="关联店铺" clearable size="small">
                        <el-option v-for="item in AllShopList" :label="item.storeRealName" :value="item.storeId"/>
                    </el-select>
                </div>
                <div class="select_item">
                    <el-select v-model="searchInfo.defaultFlag" placeholder="是否默认" clearable size="small" class="select-width">
                        <el-option v-for="item in whetherArr" :label="item.label" :value="item.value"/>
                    </el-select>
                </div>
                <div class="select_item">
                    <el-select v-model="searchInfo.activateFlag" placeholder="是否激活" clearable size="small" class="select-width">
                        <el-option v-for="item in whetherArr" :label="item.label" :value="item.value"/>
                    </el-select>
                </div>
                <div class="select_item">
                    <el-button type="primary" @click="search" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="operation_btn">
                <el-button type="danger" @click="delChecked" :disabled="!checkedTableArr.length" size="small" icon="el-icon-delete">批量删除</el-button>
                <el-button type="primary" @click="found" size="small" icon="el-icon-push">添 加</el-button>
                <router-link :to="{ name: 'title-management', params: {} }" style="margin-left:15px;">
                    <el-button type="primary" size="small" icon="el-icon-s-tools">标题库管理</el-button>
                </router-link>
            </div>

            <div class="keyword_list">
                <el-table ref="multipleTable" height="620px" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="skuList" tooltip-effect="dark" style="width: 100%" border @selection-change="checkboxArr">
                    <el-table-column type="selection" width="55"/>
                    <el-table-column label="序号" width="80">
                        <template slot-scope="scope">{{ scope.$index }}</template>
                    </el-table-column>
                    <el-table-column prop="name" label="标题名称"/>
                    <el-table-column label="标题语言">
                        <template slot-scope="scope">
                            <span v-for="item in scope.row.titleGroupEntities" style="margin-right:5px;">{{item.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="platformName" label="适用平台" width="100"/>
                    <el-table-column label="状态" width="100" prop="activateDesc"></el-table-column>
                    <el-table-column label="是否默认" width="100" prop="defaultDesc"></el-table-column>
                    <el-table-column label="适用店铺">
                        <template slot-scope="scope">
                            <p v-for="item in scope.row.storeEntities">{{item.name}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="220">
                        <template slot-scope="scope">
                            <el-button type="text" @click="redact(scope.row.titleRuleId)">编 辑</el-button>
                            <el-button type="text" @click="del(scope.row.titleRuleId)">删 除</el-button>
                            <el-button v-if="scope.row.relFlag" type="text" @click="relevance(scope.row.titleRuleId)">关联店铺</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="paginationBox">
                <el-pagination :current-page="currentPage" :page-sizes="[10, 8,5]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
            </div>

            <!--创建 -->
            <el-dialog :title="dialogTitle" :visible.sync="establish" width="820px">
                <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="rule_content">
                    <el-form-item label="标题名称：" class="form_item" prop="name">
                        <el-input v-model="form.name" placeholder="请输入标题名称"/>
                    </el-form-item>

                    <el-form-item label="平台类型：" class="form_item" prop="platformId">
                        <el-select v-model="form.platformId" placeholder="请选择平台">
                            <el-option :label="item.name" :value="item.platformId" v-for="item in platformList"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="form_item" label="标题语言：" prop="formalList">
                        <div class="lebelBox">
                            <div class="lebel">
                                <el-checkbox-group v-model="form.formalList" size="mini">
                                    <el-checkbox :label="item" border v-for="item in titleLanguageList" class="checkbox">
                                        {{item.name}}
                                        <i v-if="item.removeFlag" class="el-icon-delete delicon" @click.stop="deltitle(item.titleGroupId)"/>
                                    </el-checkbox>
                                    <el-button size="mini" @click="opentitleGroupDialog()">
                                        <i class="el-icon-circle-plus" style="font-size:20px;"/>
                                    </el-button>
                                </el-checkbox-group>
                            </div>
                            <!--  -->
                            <div class="lebel" ref="container">
                                <template v-for="(item,index) in formalList">
                                    <el-tag class="tag" closable @close="delselect(index,item.groupId)">
                                        {{item.name}}
                                        <el-input size="mini" v-show="item.editFlag" style="width:50px;"/>
                                        <!-- <span v-show="item.editFlag">位数</span> -->
                                        <!-- <span v-show="item.editFlag && item.rules" class="hint">固定字符不能为空</span> -->
                                    </el-tag>
                                </template>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item class="form_item" label="规则描述：">
                        <div class="textarea">
                            <el-input v-model="form.description" type="textarea" :rows="2"/>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item class="form_item" label="预览：">
                        <div class="preview_inputBox">
                            <span v-model="preview">{{preview}}</span>
                        </div>
                    </el-form-item>-->
                    <el-form-item class="form_item">
                        <el-checkbox v-model="form.activateFlag">是否激活</el-checkbox>
                        <el-checkbox v-model="form.defaultFlag">是否默认</el-checkbox>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="pushTitle('ruleForm')">保 存</el-button>
                </div>
            </el-dialog>
            <!-- 关联店铺 -->
            <el-dialog title="选择店铺" :visible.sync="shopListDialog" center width="342px">
                <el-input size="medium" v-model.trim="relevanceNameInput">
                    <el-button slot="append" icon="el-icon-search" @click="selectShopName"></el-button>
                </el-input>
                <el-checkbox-group v-model="checkShopArr" class="check_warp">
                    <el-checkbox v-for="item in shopList" :label="item.storeId" :key="item.storeId">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <div slot="footer">
                    <el-button type="primary" size="medium" @click="relevanceConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 添加标题组 -->
            <el-dialog title="添加标题组" :visible.sync="titleGroupDialog" center width="507px">
                <el-form :model="titleGroupForm" :rules="titleGroupRules" ref="titleGroupForm" label-width="135px">
                    <el-form-item label="添加标题组名称：" prop="text">
                        <el-input v-model="titleGroupForm.text"/>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" size="medium" @click="submitTitleGroupForm('titleGroupForm')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { getData } from 'common/http';
export default {
    data() {
        return {
            openDialog: false,
            titleGroupForm: {
                text: ''
            },
            titleGroupDialog: false,
            titleGroupRules: {
                text: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }
                ]
            },
            checkShopArr: [],
            shopList: [],
            loading: true,
            shopListDialog: false,
            currentPage: null, //显示当前第几页
            total: null,
            pageSize: null,

            searchInfo: {
                //搜索信息
                name: '', //产品标题
                platformId: '', //平台类型
                activateFlag: '', //是否激活
                defaultFlag: '',
                storeId: ''
            },
            AllShopList: [],
            establish: false, //创建弹框状态
            checkedArr: [], // 勾选中的
            checkedTableArr: [],
            skuList: [], //SKU列表
            dialogTitle: '',
            titleLanguageList: [],
            platformList: [],
            preview: '',
            checkedList: [],
            formalList: [],
            whetherArr: [
                {
                    value: 1,
                    label: '是'
                },
                {
                    value: 0,
                    label: '否'
                }
            ],
            skuRuleId: '',
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入规则名称',
                        trigger: 'blur'
                    }
                ],
                platformId: [
                    {
                        required: true,
                        message: '请选择平台',
                        trigger: 'change'
                    }
                ],
                formalList: [
                    {
                        required: true,
                        message: '请选择标题语言',
                        trigger: 'blur'
                    }
                ]
            },
            form: {
                name: '',
                platformId: '',
                formalList: [],
                description: '',
                activateFlag: 0,
                defaultFlag: 0
            },
            titleRuleId: null,
            relevanceNameInput: ''
        };
    },
    mounted() {
        this.getPlatformSku();
        this.getTitleLanguage();
        this.getPlatformList();
        this.getAllShopList();
    },
    watch: {
        'form.formalList'(arr) {
            arr.forEach((item, index) => {
                if (this.formalList.find(j => j.groupId == item.titleGroupId))
                    return;
                this.$set(this.formalList, index, {
                    name: item.name,
                    groupId: item.titleGroupId,
                    sort: index
                });
            });
            this.formalList.forEach((item, index) => {
                if (arr.find(curitem => curitem.titleGroupId == item.groupId))
                    return;
                this.formalList.splice(index, 1);
            });
        }
        // titleLanguageList(val) {
        //     console.log(val)
        //
        //     val.forEach((item,index)=>{
        //         if(this.formalList.find(j=>j.groupId==item.titleGroupId)){
        //             this.form.formalList.push(item)
        //         }
        //     })
        //
        // }
    },
    methods: {
        pushFn() {
            this.openDialog = true;
        },
        fn(arr) {
            // console.log(arr)
            arr.forEach((item, index) => {
                if (this.columns.find(j => j.text == item)) {
                }
            });
        },

        //删除标题语言
        deltitle(titleGroupId) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                getData('title/group/remove', {
                    titleGroupIds: Array.of(titleGroupId)
                }).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: `成功${res.data.rows.success}条，失败${
                                res.data.rows.fail
                            }`
                        });
                        this.getTitleLanguage();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            });
        },
        //打开添加标题语言弹框
        opentitleGroupDialog() {
            this.titleGroupForm.text = '';
            this.titleGroupDialog = true;
        },
        //关联店铺搜索
        selectShopName() {
            this.getShopList({
                name: this.relevanceNameInput,
                titleRuleId: this.titleRuleId
            });
        },
        //关联店铺确定
        relevanceConfirm() {
            // if(this.checkShopArr.length){
            let params = {
                storeIds: this.checkShopArr,
                titleRuleId: this.titleRuleId
            };
            getData('title/rule/store/rel', params).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getPlatformSku();
                    this.shopListDialog = false;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
            // }else{
            //      this.$message({
            //         message: '请先选择需要关联的店铺',
            //         type: 'warning'
            //     });
            // }
        },
        //关联店铺
        relevance(titleRuleId) {
            this.shopListDialog = true;
            this.titleRuleId = titleRuleId;
            this.relevanceNameInput = '';
            this.getShopList({ titleRuleId });
        },
        //添加标题组
        submitTitleGroupForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    getData('title/group/save', {
                        name: this.titleGroupForm.text
                    }).then(res => {
                        if (res.data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: res.data.msg
                            });
                            this.getTitleLanguage();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                    this.titleGroupDialog = false;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //获取店铺列表
        getShopList(titleRuleId) {
            getData('title/rule/list/store', titleRuleId).then(res => {
                if (res.data.code == 0) {
                    this.checkShopArr = [];
                    this.shopList = res.data.rows;
                    this.shopList.forEach(item => {
                        if (item.selected) {
                            this.checkShopArr.push(item.storeId);
                        }
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //取消选择的标题组
        delselect(index, groupId) {
            this.formalList.splice(index, 1);
            let formIndex = this.form.formalList.findIndex(
                item => item.titleGroupId == groupId
            );
            this.form.formalList.splice(formIndex, 1);
        },
        //删除
        delsend(titleRuleIds) {
            getData('title/rule/remove', {
                titleRuleIds
            }).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: `成功${res.data.rows.success}条，失败${
                            res.data.rows.fail
                        }条`
                    });
                    this.getPlatformSku();
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        del(titleRuleIds) {
            this.$confirm('此操作将删除选中的, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delsend(Array.of(titleRuleIds));
            });
        },
        //批量删除
        delChecked() {
            if (this.checkedTableArr.length) {
                this.$confirm('此操作将删除选中的, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delsend(this.checkedTableArr);
                });
            } else {
                this.$message({
                    message: '选择要删除的',
                    type: 'warning'
                });
            }
        },
        //编辑
        redact(titleRuleId) {
            this.dialogTitle = '编辑SKU平台标题规则';
            this.establish = true;
            this.titleRuleId = titleRuleId;
            this.formalList = [];
            this.form.formalList = [];
            getData('title/rule/info', { titleRuleId }).then(res => {
                if (res.data.code == 0) {
                    let ruleInfo = res.data.rows;
                    this.form.name = ruleInfo.name;
                    this.form.platformId = ruleInfo.platformId;
                    this.form.description = ruleInfo.description;
                    this.form.activateFlag = ruleInfo.activateFlag
                        ? true
                        : false;
                    this.form.defaultFlag = ruleInfo.defaultFlag ? true : false;

                    this.titleLanguageList.forEach(i => {
                        if (ruleInfo.titleGroupEntities.length) {
                            ruleInfo.titleGroupEntities.forEach(j => {
                                if (i.titleGroupId == j.titleGroupId) {
                                    this.form.formalList.push(i);
                                }
                            });
                        }
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //创建
        found() {
            this.dialogTitle = '添加SKU平台标题规则';
            this.formalList = [];
            for (let key in this.form) {
                if (key == 'formalList') {
                    this.form[key] = [];
                    continue;
                }
                if (key == 'activateFlag') {
                    this.form[key] = 0;
                    continue;
                }
                if (key == 'type') {
                    this.form[key] = 2;
                    continue;
                }
                this.form[key] = '';
            }
            this.establish = true;
        },
        send(url, params) {
            getData(url, params).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.establish = false;
                    this.getPlatformSku();
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //创建编辑保存
        pushTitle(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let arr = this.formalList.map(item => {
                        return {
                            groupId: item.groupId,
                            sort: item.sort
                        };
                    });
                    let params = {
                        name: this.form.name,
                        platformId: this.form.platformId,
                        formula: JSON.stringify(arr),
                        description: this.form.description,
                        defaultFlag: this.form.defaultFlag ? 1 : 0,
                        activateFlag: this.form.activateFlag ? 1 : 0
                    };
                    //添加
                    if (this.dialogTitle == '添加SKU平台标题规则') {
                        this.send('title/rule/save', params);
                        //编辑
                    } else {
                        this.send('title/rule/update', {
                            ...params,
                            titleRuleId: this.titleRuleId
                        });
                    }
                } else {
                    return false;
                }
            });
        },

        //获取平台列表
        getPlatformList() {
            getData('platform/list').then(res => {
                if (res.data.length) {
                    this.platformList = res.data;
                }
            });
        },
        //获取标题语言
        getTitleLanguage() {
            getData('title/group/list', {}).then(res => {
                if (res.data.code == 0) {
                    this.titleLanguageList = [];
                    this.form.formalList = [];
                    this.titleLanguageList = res.data.rows;
                    this.titleLanguageList.forEach(item => {
                        if (
                            this.formalList.find(
                                curitem => item.titleGroupId == curitem.groupId
                            )
                        ) {
                            this.form.formalList.push(item);
                        }
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //获取平台sku列表
        getPlatformSku(
            params = {
                sortOrder: 'asc',
                pageSize: 10,
                pageNumber: 1
                // platformId: 1,
                // type: 2
            }
        ) {
            getData('title/rule/list', params).then(res => {
                this.loading = false;
                if (res.data.code == 0) {
                    this.skuList = res.data.rows.rows;

                    this.currentPage = res.data.rows.pageNo;
                    this.total = res.data.rows.total;
                    this.pageSize = res.data.rows.pageSize;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        handleClick(row) {},
        handleSizeChange(val) {
            this.loading = true;
            // console.log(`每页 ${val} 条`);
            let params = {
                pageSize: val,
                pageNumber: this.currentPage
            };
            for (let key in this.searchInfo) {
                if (this.searchInfo[key] !== '') {
                    params = { ...params, [key]: this.searchInfo[key] };
                }
            }
            this.getPlatformSku(params);
        },
        handleCurrentChange(val) {
            this.loading = true;
            // console.log(`当前页: ${val}`);
            let params = {
                pageSize: this.pageSize,
                pageNumber: val
            };
            for (let key in this.searchInfo) {
                if (this.searchInfo[key] !== '') {
                    params = { ...params, [key]: this.searchInfo[key] };
                }
            }

            this.getPlatformSku(params);
        },
        //搜索
        search() {
            this.loading = true;
            this.getPlatformSku({
                ...this.searchInfo,
                pageSize: 10,
                pageNumber: 1
            });
        },
        //获取所有店铺
        getAllShopList() {
            getData('store/list', { pageNumber: 1, pageSize: 100 }).then(
                res => {
                    if (res.data.code == 0) {
                        this.AllShopList = res.data.rows.rows;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                }
            );
        },
        //勾选时触发
        checkboxArr(arr) {
            this.checkedTableArr = arr.map(item => {
                return item.titleRuleId;
            });
        }
    }
};
</script>

<style lang="scss">
@import '../../../assets/style/style-scss/layout.scss';
.check_warp {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    .el-checkbox {
        margin: 0 0 10px;
        padding: 10px 0 10px 15px;
        background: #f2f2f2;
        border-radius: 3px;
        .el-checkbox__label {
            padding-left: 20px;
        }
    }
}
.skuTitle {
    height: 100%;
    background: #fff;
    .select {
        @include flex(row);
        padding: 15px;
        background: rgb(242, 242, 242);
        border-radius: 5px;
        .text {
            margin-right: 10px;
        }
        .select_item {
            margin-right: 20px;
            &:first-child {
                @include flex(row);
                span {
                    display: block;
                    height: 40px;
                    line-height: 40px;
                    width: 100px;
                    text-align: right;
                }
            }
        }
    }
    .operation_btn {
        margin-top: 10px;
    }
    .keyword_list {
        margin-top: 15px;
        .cell {
            text-align: center;
        }
        .el-table th {
            background-color: #f3f3f3;
        }
    }
    .paginationBox {
        text-align: right;
        margin-top: 15px;
    }

    .rule_content {
        .form_item {
            .el-select {
                width: 100%;
            }
            .lebelBox {
                display: flex;
                flex-direction: row;
                .lebel {
                    min-height: 200px;
                    height: auto;
                    min-width: 317px;
                    padding: 10px;
                    border: 1px solid #dcdfe6;
                    border-radius: 5px;
                    margin-right: 10px;
                    .checkbox {
                        margin: 0 10px 0 0;
                        position: relative;
                        .delicon {
                            color: #f56c6c;
                            position: absolute;
                            right: -12px;
                            font-size: 14px;
                            top: -11px;
                            padding: 5px;
                            cursor: pointer;
                            &:hover {
                                font-weight: 600;
                                font-size: 16px;
                            }
                        }
                    }

                    .el-button {
                        margin: 0 10px 10px 0;
                    }
                    &:last-child {
                        flex: 1;
                        margin-right: 0;
                        // display: flex;
                        // flex-wrap:wrap;
                        // justify-content: center;
                        .tag {
                            margin: 0 10px 15px 0;
                            position: relative;
                            .hint {
                                position: absolute;
                                left: 10px;
                                bottom: -24px;
                                color: #f56c6c;
                            }
                        }
                        .el-input__inner {
                            padding: 0;
                            text-align: center;
                        }
                    }
                }
            }
            .preview_inputBox {
                .el-input {
                    width: 160px;
                    input {
                        text-align: center;
                    }
                }
                span {
                    line-height: 40px;
                    margin-left: 10px;
                }
            }
            &:last-child {
                div {
                    margin-left: 80px;
                }
            }
            .textarea {
                .el-textarea__inner {
                    // height: 83px;
                }
            }
        }
    }
    .btn {
        width: 200px;
        position: relative;
        left: 50%;
        margin-left: -100px;
    }
    .dialog-footer {
        text-align: center;
        .el-button {
            width: 200px;
        }
    }
    .select-width {
        width: 100px;
    }
}
</style>
