<template>
<div class="Sensitivekeyword">
    <div class="select">
        <div class=" select_item">
            <span class="text">关键字:</span>
            <el-input placeholder="请输入内容" v-model="selectInfo.keyword" clearable size="medium"/>
        </div>
        <div class="select_item">
            <span class="text">添加时间:</span>
            <el-date-picker
              v-model="selectInfo.timeArr"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right" size="medium">
            </el-date-picker>
        </div>
        <div class="select_item">
            <el-select v-model="selectInfo.type" clearable placeholder="类别选择" size="medium">
                <el-option v-for="item in typeList" :key="item.value" :label="item.value" :value="item.key" />
            </el-select>
        </div>
        <div class="select_item">
            <el-button type="primary" @click="select()" size="medium">搜 索</el-button>
        </div>
    </div>
    <div class="operation_btn">
        <el-button type="primary" @click="addAndDmend(true)">添加</el-button>
        <el-button type="primary" @click="deletePortion">批量删除</el-button>
    </div>

    <div class="keyword_list">
        <el-table ref="multipleTable" :data="keywordLists" tooltip-effect="dark" style="width: 100%" height="550px" @selection-change="checkboxArr">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="关键词">
                <template slot-scope="scope" >
                    <!-- {{ scope.row.keyword}} -->
                    <span v-text="scope.row.keyword"></span>
                </template>
            </el-table-column>
            <el-table-column  label="备注" width="160">
                <template slot-scope="scope" >
                    <span v-text="scope.row.remark"></span>
                </template>
            </el-table-column>
            <el-table-column prop="typeStr" label="类型" show-overflow-tooltip></el-table-column>
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
    <el-dialog title="添加" :visible.sync="pushKeywordDialog" width="600px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="关键词：" prop="keyword">
              <el-input type="textarea" v-model="ruleForm.keyword" class="minauto"/>
            </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="ruleForm.remark" class="minauto"/>
          </el-form-item>
          <el-form-item label="类别" prop="type">
            <div style="display: flex;">
                <el-select v-model="ruleForm.type" clearable style="margin-right:15px;">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.value" :value="item.key" />
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
            <span><el-input size="small"/></span>
            <el-button type="primary" size="small">搜 索</el-button>
        </div>
        <el-button type="primary" size="small" @click="classType('添加类别')">添 加</el-button>
        <el-table :data="typeList" border style="width: 100%;margin-top:10px;" height="335px">
            <el-table-column  prop="value"  label="类别名称" align="center"/>
            <el-table-column  prop="date"  label="添加人员" align="center"/>
            <el-table-column  prop="date"  label="添加时间" align="center"/>
            <el-table-column  label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="classType('编辑类别')">编 辑</el-button>
                    <el-button type="text" size="small" @click="">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
    <!--  -->
    <el-dialog :title="classTypeTitle" :visible.sync="classTypeDialog" width="420px">
        <div style="display:  flex;">
            <span style="width: 100px;line-height: 32px;">类别名称：</span>
            <el-input size="small"/>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small">确 定</el-button>
        </div>
    </el-dialog>


</div>
</template>
<script>
import {
    BASE_URL
} from "common/config";
import {
    _storage
} from "common/common";
import axios from "axios"

function getData(requestURL, params) {
    return axios({
        method: 'post',
        url: BASE_URL + '/' + requestURL,
        data: params,
        headers: {
            token: _storage._get('local', 'token'),
            'Content-Type': 'application/json'
        },
    }).then(res => {
        return res;
    }).catch(err => {
        console.log(err)
    })
}

export default {
    data() {
        return {
            classTypeTitle:null,
            classTypeDialog:false,
            classDialog:false,
            checkedArr: [],
            pushKeywordDialog: false,

            total:null,
            pageSize:null,
            currentPage:null,

            selectInfo: { //搜索信息
                keyword: '',
                timeArr:[],
                type: ''
            },

            typeList: [], //类别列表
            keywordLists: [],
            ruleForm:{
                keyword:"",
                remark:"",
                type:null
            },
            rules: {
                keyword: [
                   { required: true, message: '关键词不能为空', trigger: 'blur' },
                   { min:1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ],
                type: [
                   { required: true, message: '请选择类别', trigger: 'blur' },
                ]
            },
            type:null,
            sensitiveKeywordId:null

        }
    },
    filters:{

    },
    mounted() {
        this.getKeywordList()
        this.getTypeList()
    },
    methods: {
        classType(title,){
            this.classTypeTitle = title
            this.classTypeDialog = true
        },
        addAndDmend(type,item) {
            this.pushKeywordDialog = true;
            this.type = type
            //添加
            if(type){
                this.sensitiveKeywordId = null
                this.$nextTick(()=>{
                    this.$refs['ruleForm'].resetFields();
                    this.ruleForm.remark = '';
                })
            //编辑
            }else{
                this.sensitiveKeywordId = item.sensitiveKeywordId
                getData('sensitive/keyword/info',{
                    "id":item.sensitiveKeywordId
                }).then(res=>{
                    if(res.data.code==0){
                        let obj = res.data.rows
                        for(let k in obj){
                            for(let j in this.ruleForm){
                                if(k==j){
                                    this.ruleForm[j] = obj[k]
                                }
                            }
                        }
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.type){
                        this.saveKeyword('sensitive/keyword/save')
                    }else{
                        this.saveKeyword('sensitive/keyword/update',this.sensitiveKeywordId)
                    }
                }
            });

        },
        saveKeyword(url,sensitiveKeywordId){
            let params = {
                "keyword":this.ruleForm.keyword,
                "type":this.ruleForm.type
            }
            if(this.ruleForm.remark){
                params = Object.assign({},params,{
                    "remark":this.ruleForm.remark
                })
            }
            if(sensitiveKeywordId){
                params = Object.assign({},params,{sensitiveKeywordId})
            }
            getData(url,params).then(res=>{
                if(res.data.code==0){
                    this.$message({
                      message: res.data.msg,
                      type: 'success'
                    });
                    this.getKeywordList();
                    this.pushKeywordDialog = false;
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //获取类型列表
        getTypeList() {
            getData('sensitive/keyword/list/type').then(res=>{
                if(res.data.code==0){
                    this.typeList = res.data.rows
                }else{
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
        delKeywrd(id){
            getData('sensitive/keyword/remove',{id}).then(res=>{
                if(res.data.code==0){
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.getKeywordList()
                }else{
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
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        //搜索
        select() {
            let params = {
                "pageNumber":1,
                "pageSize":10
            }
            if(this.selectInfo.timeArr !==null && this.selectInfo.timeArr.length){
                params = Object.assign({},params,{
                    startTime:this.selectInfo.timeArr[0],
                    endTime:this.selectInfo.timeArr[1],
                })
            }
            if(this.selectInfo.keyword){
                params = Object.assign({},params,{
                    keyword:this.selectInfo.keyword,
                })
            }
            if(this.selectInfo.type){
                params = Object.assign({},params,{
                    type:this.selectInfo.type
                })
            }
            this.getKeywordList(params)
        },
        //勾选
        checkboxArr(val) {
            this.checkedArr = val.map(item=>item.sensitiveKeywordId);
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
body {
    // background: green;
    padding: 10px;
}
.el-select{
    width: 100%;
}
.el-textarea__inner{
    min-height: 120px!important;
}
.minauto{
    min-height: 120px;
}
.select {
    @include flex(row);
    width: 100%;
    background: #fff;
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
        background: #cce3f8;
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
.select-class{
    display: flex;
    margin-bottom: 10px;
    &>span{
        line-height: 32px;
    }
    span{
        margin-right:10px;
    }

}

</style>
