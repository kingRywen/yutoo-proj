<template lang="html">
    <div class="title-management">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/skuTitle'}">sku标题管理</el-breadcrumb-item>
            <el-breadcrumb-item>标题库管理</el-breadcrumb-item>
        </el-breadcrumb>

        <div>
            <div class="left">
                <div class="input_select">
                    <el-input size="medium" v-model.trim="filterText" placeholder="关键搜索"  suffix-icon="el-icon-search">
                        <!-- <el-button slot="append" icon="el-icon-search" @click="selectLeft"></el-button> -->
                    </el-input>
                </div>
                <div class="tree">
                    <el-tree
                      :data="CategoryTree"
                      node-key="categoryId"
                      :default-expanded-keys="[2,3]"

                      ref="tree"
                      @node-click="treeClick"
                      :filter-node-method="filterNode"
                      :props="defaultProps">
                    </el-tree>
                </div>
            </div>
            <!--  -->
            <div class="right">
                <el-tabs type="border-card" class="tabs" @tab-click="changeLanguage" v-model="activeLanguage">
                    <template v-for="item in languageList">
                        <el-tab-pane :label="item.languageName" :name="item.languageId+''" :key="item.languageId">

                            <content-table
                                :titleContentList="titleContentList"
                                @select="select"
                                @add="add"
                                :isClose="isClose"
                                @open="open"
                                :title="title"
                                :name="name"
                                @changeisClone="val=>isClose = val"
                                @del="del"
                                :paginationInfo="paginationInfo"
                                @handleSizeChange="handleSizeChange"
                                @handleCurrentChange="handleCurrentChange"
                                @selectMsgChange="selectMsgChange"/>


                        </el-tab-pane>
                    </template>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import ContentTable from './content-table';
import {
    BASE_URL
} from "common/config";
import {
    _storage
} from "common/common";
import axios from "axios";

function getData(requestURL, params) {
    return axios({
            method: "post",
            url: BASE_URL + "/" + requestURL,
            data: params,
            headers: {
                token: _storage._get('local', 'token'),
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        .then(res => {
            return res;
        })
        .catch(err => {
            console.log(err);
        });
}
export default {
    data() {
        return {
            filterText: "",
            CategoryTree: [],
            defaultProps: {
                children: 'child',
                label: 'name'
            },
            languageList:[],
            titleContentList:[],
            activeLanguage:"1",

            titleGroupId:69,
            categoryId:3,

            isClose:false,
            title:"",

            name:"",
            redactParams:{
                titleGroupContentId:"",
                merchantId:"",
                status:'',
                creatorId:''
            },
            paginationInfo:{
                currentPage:null,
                pageSize:null,
                total:null,
            },
            selectMsg:null
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        //标题内容input值变化触发
        selectMsgChange(val){
           this.selectMsg = val
        },
        //分页
        handleSizeChange(val){
            let params = {
                "pageSize":val,
                "pageNumber":this.paginationInfo.currentPage,
                "languageId":this.activeLanguage,
                titleGroupId:this.titleGroupId,
                categoryId:this.categoryId
            }
            if(this.selectMsg !="" || null ||undefined ){
               params = Object.assign({},params,{name:this.selectMsg})
            }
            this.getTitleContentList(params)
        },
        handleCurrentChange(val){
            let params = {
                "pageSize":this.paginationInfo.pageSize,
                "pageNumber":val,
                "languageId":this.activeLanguage,
                titleGroupId:this.titleGroupId,
                categoryId:this.categoryId
            }
            if(this.selectMsg !="" || null ||undefined ){
                params = Object.assign({},params,{name:this.selectMsg})
            }
            this.getTitleContentList(params)
        },
        //刪除 => 批量删除
        del(titleGroupContentId){
            getData('title/group/content/remove',{titleGroupContentId}).then(res=>{
                if(res.data.code==0){
                    this.$message({
                      message:`成功${res.data.rows.success}，失败 ${res.data.rows.fail}`,
                      type: 'success'
                    });
                    let params = {
                        "pageSize":10,
                        "pageNumber":1,
                        "languageId":this.activeLanguage,
                        titleGroupId:this.titleGroupId,
                        categoryId:this.categoryId
                    }
                    this.getTitleContentList(params)
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //打开编辑添加弹框
        open(title,titleGroupContentId){
            this.title = title
            this.isClose = true
            this.name = ''

            // //编辑
            if(titleGroupContentId){
                getData("title/group/content/info",{titleGroupContentId}).then(res=>{
                    if(res.data.code==0){
                        this.name = res.data.rows.name

                        this.redactParams.titleGroupContentId = res.data.rows.titleGroupContentId
                        this.redactParams.merchantId = res.data.rows.merchantId
                        this.redactParams.status = res.data.rows.status
                        this.redactParams.creatorId = res.data.rows.creatorId
                    }else{
                        this.$message.error(res.dataa.msg)
                    }
                })
            }
        },
        //添加保存 =>编辑保存
        add(val){
            console.log(val)
            let keyworld = {
                "categoryId":this.categoryId,
                "languageId":Number(this.activeLanguage),
                "titleGroupId":this.titleGroupId
            }
            let params = {...keyworld,"name":val}
            let url = null;
            if(this.title=="添加"){
                url = 'title/group/content/save'
            }else{
                url = 'title/group/content/update'
                params = {...params,...this.redactParams}
            }

            getData(url,params).then(res=>{
                console.log(res)
                if(res.data.code==0){
                    this.$message({
                      message:this.title=="添加"?`${res.data.rows.success} \n ${res.data.rows.fail}`:res.data.msg,
                      type: 'success'
                    });
                    this.getTitleContentList({...keyworld,pageSize:10,pageNumber:1})
                    this.getCategoryTree()
                    this.isClose = false
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //搜索
        select(val){
            let params = {
                name:val,
                "pageSize":10,
                "pageNumber":1,
                "languageId":this.activeLanguage,
                titleGroupId:this.titleGroupId,
                categoryId:this.categoryId
            }
            this.getTitleContentList(params)
        },
        //切换语种
        changeLanguage(tab, event){
            let params = {
                "pageSize":10,
                "pageNumber":1,
                "languageId":this.activeLanguage,
                titleGroupId:this.titleGroupId,
                categoryId:this.categoryId
            }
            this.getTitleContentList(params)
        },
        //类目节点点击
        treeClick(item,node,el){
            // console.log(item,node,el)
            console.log(el.$el)
            // el.$el.className = "is-current"
            if(item.titleGroupId){
                // el.$el.className += " isTreeSelect";
                this.titleGroupId = item.titleGroupId
                this.categoryId = item.categoryId - item.titleGroupId
                let params = {
                   "pageSize":10,
                   "pageNumber":1,
                   "languageId":this.activeLanguage,
                   titleGroupId:this.titleGroupId,
                   categoryId:this.categoryId
                }
                this.getTitleContentList(params)
            }
        },
        //类目搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        //获取类目树
        getCategoryTree(categoryName = "") {
            getData("title/group/category/tree", {
                categoryName
            }).then(res => {
                if (res.data.code == 0) {
                    let data = res.data.rows.child
                    function changeData(data){
                        if(data instanceof Array && data.length){
                            data.forEach(item=>{
                                if(item.childFlag){
                                    changeData(item.child)
                                }else{
                                    if(item.groups.length){
                                        item.groups.forEach(i=>{
                                            i.name = `${i.name}（${i.count}）`
                                            i.categoryId = item.categoryId+i.titleGroupId
                                        })
                                        item.child = [...item.groups]
                                    }
                                }
                            })
                        }
                        return data
                    }
                    this.CategoryTree = changeData(data)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        //获取所有的语种列表
        getLanguageList(){
            getData("language/list",{}).then(res=>{
                if(res.data.code==0){
                    this.languageList = res.data.rows
                    this.activeLanguage = this.languageList[0].languageId +''
                    this.getTitleContentList({
                        "pageSize":10,
                        "pageNumber":1,
                        "languageId":this.activeLanguage,
                        "titleGroupId":3,
                        "categoryId":69
                    })
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //获取标题组内容列表
        getTitleContentList(params) {
            getData("title/group/content/list",params).then(res=>{
                if(res.data.code==0){
                    this.titleContentList = res.data.rows.rows

                    this.paginationInfo.currentPage = res.data.rows.pageNo
                    this.paginationInfo.pageSize = res.data.rows.pageSize
                    this.paginationInfo.total = res.data.rows.total

                }else{
                    this.$message.error(res.data.msg)
                }
            })
        }
    },
    mounted() {
        this.getCategoryTree();
        this.getLanguageList();
    },
    components: {
        ContentTable
    }
}
</script>
<style lang="scss">
.left {
    width: 271px;
    height: 100%;
    // background: #f5f7fa;
    position: fixed;
    left: 0;
    top: 34px;
    .el-tree-node:focus-within>.el-tree-node__content{
        background-color: #f2f2f2;
        color:#66b1ff;
        font-weight: 700;
    }


    .input_select,
    .tree {
        margin: 15px;

    }
    .tree {
        height: 100%;
        overflow-y: auto;
        padding-bottom: 130px;
    }
    .el-tree {
        background: none;
        .el-tree-node__content {
            height: 40px;
        }
    }
}
.right {
    position: fixed;
    height: 100%;
    top: 34px;
    right: 0;
    left: 271px;
    .el-tabs--border-card {
        box-shadow: none;
    }
    .tabs {
        height: 100%;
        .el-tabs__content {
            overflow-y: auto!important;
            height: 100%!important;
            padding-bottom: 50px;
        }
    }

}
.is-current{

    color:red;
}
</style>
