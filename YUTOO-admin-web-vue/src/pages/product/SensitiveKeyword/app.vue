<template>
    <div class="Sensitivekeyword">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item>敏感关键字管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="padding:10px;">
            <div class="select">
                <div class=" select_item">
                    <span class="text">关键字:</span>
                    <el-input placeholder="请输入内容" v-model.trim="selectInfo.keyword" clearable size="medium" />
                </div>
                <div class="select_item">
                    <span class="text">添加时间:</span>
                    <el-date-picker v-model="selectInfo.timeArr" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" align="right" size="medium">
                    </el-date-picker>
                </div>
                <div class="select_item">
                    <el-select v-model="selectInfo.type" clearable placeholder="类别选择" size="medium">
                        <el-option v-for="item in typeList" :label="item.name" :value="item.sensitiveKeywordLibraryId" />
                    </el-select>
                </div>
                <div class="select_item">
                    <el-button type="primary" @click="select()" size="medium">搜 索</el-button>
                </div>
            </div>
            <div class="operation_btn">
                <el-button type="primary" @click="addAndDmend(true)" size="medium">添加</el-button>
                <el-button type="primary" @click="deletePortion" size="medium">批量删除</el-button>
            </div>

            <div class="keyword_list">
                <el-table ref="multipleTable"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    :data="keywordLists" tooltip-effect="dark" style="width: 100%" height="550px" border @selection-change="checkboxArr">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="关键词">
                        <template slot-scope="scope">
                            <!-- {{ scope.row.keyword}} -->
                            <span v-text="scope.row.keyword"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" width="160">
                        <template slot-scope="scope">
                            <span v-text="scope.row.remark"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sensitiveKeywordLibraryDesc" label="类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="creator" label="添加人" width="100"></el-table-column>
                    <el-table-column prop="createTime" label="添加时间" show-overflow-tooltip></el-table-column>

                    <el-table-column fixed="right" label="操作" width="160">
                        <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addAndDmend(false,scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteRow(scope.row.sensitiveKeywordId)">删除</el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="paginationBox">
                <el-pagination :current-page="currentPage" :page-sizes="[10, 8,5]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
            <!-- 添加关键字 -->
            <el-dialog :title="title" :visible.sync="pushKeywordDialog" width="600px">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="关键词：" prop="keyword">
                        <el-input type="textarea" v-model="ruleForm.keyword" class="minauto" />
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input type="textarea" v-model="ruleForm.remark" class="minauto" />
                    </el-form-item>
                    <el-form-item label="类别" prop="type">
                        <div style="display: flex;">
                            <el-select v-model="ruleForm.type" clearable style="margin-right:15px;">
                                <el-option v-for="item in typeList" :label="item.name" :value="item.sensitiveKeywordLibraryId" />
                            </el-select>
                            <el-button type="primary" @click="classDialog=true">类别管理</el-button>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                </div>
            </el-dialog>
            <!-- 类别管理 -->
            <el-dialog title="类别管理" :visible.sync="classDialog" width="600px">
                <div class="select-class">
                    <span>类别名称：</span>
                    <span><el-input size="small" v-model.trim="selectTypeinput"/></span>
                    <el-button type="primary" size="small" @click="selectType">搜 索</el-button>
                </div>
                <el-button type="primary" size="small" @click="classType('添加类别')">添 加</el-button>
                <el-table :data="typeList" border style="width: 100%;margin-top:10px;" height="335px">
                    <el-table-column prop="name" label="类别名称" align="center" />
                    <el-table-column prop="creatorName" label="添加人员" align="center" width="80" />
                    <el-table-column prop="createTime" label="添加时间" align="center" />
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="classType('编辑类别',scope.row.sensitiveKeywordLibraryId)">编 辑</el-button>
                            <el-button type="text" size="small" @click="" v-if="scope.row.defaultFlag?false:true" @click="delType(scope.row.sensitiveKeywordLibraryId)">删 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <!--  -->
            <el-dialog :title="classTypeTitle" :visible.sync="classTypeDialog" width="420px">
                <el-form :model="typeform" ref="typeform" label-width="100px" class="demo-dynamic">
                    <el-form-item prop="typename" label="类别名称：" :rules="[
                      { required: true, message: '请输入类别名称', trigger: 'blur' }]">
                        <el-input size="small" v-model="typeform.typename" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="submitTypeform('typeform')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {getData} from 'common/http'
export default {
    data() {
        return {
            loading:true,
            title:"",
            selectTypeinput:"",
            sensitiveKeywordLibraryId: '',
            typeform: {
                typename: ""
            },
            classTypeTitle: null,
            classTypeDialog: false,
            classDialog: false,
            checkedArr: [],
            pushKeywordDialog: false,

            total: null,
            pageSize: null,
            currentPage: null,

            selectInfo: { //搜索信息
                keyword: '',
                timeArr: [],
                type: ''
            },

            typeList: [], //类别列表
            keywordLists: [],
            ruleForm: {
                keyword: "",
                remark: "",
                type: null
            },
            rules: {
                keyword: [{
                        required: true,
                        message: '关键词不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 500,
                        message: '长度在 1 到 500 个字符',
                        trigger: 'blur'
                    }
                ],
                type: [{
                    required: true,
                    message: '请选择类别',
                    trigger: 'blur'
                }, ]
            },
            type: null,
            sensitiveKeywordId: null

        }
    },
    filters: {

    },
    mounted() {
        this.getKeywordList()
        this.getTypeList()
    },
    methods: {
        selectType(){
            let params =  {}
            if(this.selectTypeinput){
                params['name'] = this.selectTypeinput
            }
            this.getTypeList(params)
        },
        delType(sensitiveKeywordLibraryId) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.handleType("sensitive/keyword/library/remove",{sensitiveKeywordLibraryId:Array.of(sensitiveKeywordLibraryId)})
            })
        },
        handleType(url, params) {
            getData(url, params).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.classTypeDialog = false;
                    this.getTypeList()
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        submitTypeform(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let name = this.typeform.typename;
                    if (this.classTypeTitle == "添加类别") {
                        this.handleType("sensitive/keyword/library/save", {
                            name
                        })
                    } else {
                        this.handleType("sensitive/keyword/library/update", {
                            name,
                            sensitiveKeywordLibraryId: this.sensitiveKeywordLibraryId
                        })
                    }
                } else {
                    return false;
                }
            });
        },
        classType(title, sensitiveKeywordLibraryId) {
            this.classTypeTitle = title
            this.classTypeDialog = true
            this.sensitiveKeywordLibraryId = sensitiveKeywordLibraryId
            if (title == "添加类别") {
                this.typeform.typename = ""
            } else {
                getData('sensitive/keyword/library/info', {
                    sensitiveKeywordLibraryId
                }).then(res => {
                    if (res.data.code == 0) {
                        this.typeform.typename = res.data.rows.name;
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        addAndDmend(type, item) {
            this.pushKeywordDialog = true;
            this.type = type
            type?this.title="添加":this.title = "编辑";
            //添加
            if (type) {
                this.sensitiveKeywordId = null
                this.$nextTick(() => {
                    this.$refs['ruleForm'].resetFields();
                    this.ruleForm.remark = '';
                })
                //编辑
            } else {
                this.sensitiveKeywordId = item.sensitiveKeywordId
                getData('sensitive/keyword/info', {
                    "id": item.sensitiveKeywordId
                }).then(res => {
                    if (res.data.code == 0) {
                        let obj = res.data.rows
                        // for (let k in obj) {
                        //     for (let j in this.ruleForm) {
                        //         if (k == j) {
                        //             this.ruleForm[j] = obj[k]
                        //         }
                        //     }
                        // }
                        this.ruleForm.keyword = obj.keyword
                        this.ruleForm.remark = obj.remark
                        this.ruleForm.type = obj.sensitiveKeywordLibraryId

                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.type) {
                        this.saveKeyword('sensitive/keyword/save')
                    } else {
                        this.saveKeyword('sensitive/keyword/update', this.sensitiveKeywordId)
                    }
                }
            });

        },
        saveKeyword(url, sensitiveKeywordId) {
            let params = {
                "keyword": this.ruleForm.keyword,
                "sensitiveKeywordLibraryId": this.ruleForm.type
            }
            if (this.ruleForm.remark) {
                params = Object.assign({}, params, {
                    "remark": this.ruleForm.remark
                })
            }
            if (sensitiveKeywordId) {
                params = Object.assign({}, params, {
                    sensitiveKeywordId
                })
            }
            getData(url, params).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getKeywordList();
                    this.pushKeywordDialog = false;
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        //获取类型列表
        getTypeList(params={}) {
            getData('sensitive/keyword/library/list', params).then(res => {
                if (res.data.code == 0) {
                    this.typeList = res.data.rows
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        //获取table列表
        getKeywordList(params = {
            "pageNumber": 1,
            "pageSize": 10,
        }) {
            getData('sensitive/keyword/list', params).then(res => {
                this.loading = false;
                if (res.data.code == 0) {
                    this.keywordLists = res.data.rows.rows

                    this.total = res.data.rows.total
                    this.pageSize = res.data.rows.pageSize
                    this.currentPage = res.data.rows.pageNo
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        delKeywrd(id) {
            getData('sensitive/keyword/remove', {
                id
            }).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });

                    this.getKeywordList()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        //单个删除
        deleteRow(id) {
            this.$confirm('此操作将永久删除, 是否继续?', '确定删除吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.delKeywrd(id)
            })
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.loading = true;
            let params = {
                "pageNumber": this.currentPage,
                "pageSize": val,
            }
            if(this.selectInfo.keyword){
                params = {...params,keyword:this.selectInfo.keyword}
            }
            if(this.selectInfo.type){
                params = {...params,type:this.selectInfo.type}
            }
            if(this.selectInfo.timeArr != null && this.selectInfo.timeArr.length){
                params = {...params,"startTime":this.selectInfo.timeArr[0],"endTime":this.selectInfo.timeArr[1]}
            }

            this.getKeywordList(params)
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.loading = true;
            let params = {
                "pageNumber": val,
                "pageSize": this.pageSize,
            }
             if(this.selectInfo.keyword){
                 params = {...params,keyword:this.selectInfo.keyword}
             }
             if(this.selectInfo.type){
                 params = {...params,type:this.selectInfo.type}
             }
             if(this.selectInfo.timeArr != null && this.selectInfo.timeArr.length){
                 params = {...params,"startTime":this.selectInfo.timeArr[0],"endTime":this.selectInfo.timeArr[1]}
             }
            this.getKeywordList(params)
        },
        //搜索
        select() {
            let params = {
                "pageNumber": 1,
                "pageSize": 10
            }
            if (this.selectInfo.timeArr !== null && this.selectInfo.timeArr.length) {
                params = Object.assign({}, params, {
                    startTime: this.selectInfo.timeArr[0],
                    endTime: this.selectInfo.timeArr[1],
                })
            }
            if (this.selectInfo.keyword) {
                params = Object.assign({}, params, {
                    keyword: this.selectInfo.keyword,
                })
            }
            if (this.selectInfo.type) {
                params = Object.assign({}, params, {
                    type: this.selectInfo.type
                })
            }
            this.loading = true;
            this.getKeywordList(params)
        },
        //勾选
        checkboxArr(val) {
            this.checkedArr = val.map(item => item.sensitiveKeywordId);
        },
        //批量删除
        deletePortion() {
            if (this.checkedArr.length) {
                let id = this.checkedArr.join(',')
                console.log(id)
                this.delKeywrd(id)
            } else {
                this.$message({
                    message: '请先选择需要删除的',
                    type: 'warning'
                });
            }
        },


    }
}
</script>

<style lang="scss">
@import '../../../assets/style/style-scss/layout.scss';
.el-select {
    width: 100%;
}
.el-textarea__inner {
    min-height: 120px!important;
}
.minauto {
    min-height: 120px;
}
.select {
    @include flex(row);
    width: 100%;
    padding: 10px 0;
    border-radius: 5px;
    background-color: #f2f2f2;
    .text {
        margin-right: 10px;
    }
    .select_item {
        margin-right: 20px;
        &:first-child {
            display: flex;
            flex-direction: row;
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
    background: #fff;
}
.keyword_list {
    margin-top: 15px;
    .cell {
        text-align: center;
    }
    .el-table th {
        background: #f3f3f3;
    }
}
.paginationBox {
    position: fixed;
    right: 20px;
    bottom: 8px;
}
.dialog-footer {
    text-align: center;
    .el-button {
        width: 200px;
    }
}
.select-class {
    display: flex;
    margin-bottom: 10px;
    & > span {
        line-height: 32px;
    }
    span {
        margin-right: 10px;
    }

}
</style>
