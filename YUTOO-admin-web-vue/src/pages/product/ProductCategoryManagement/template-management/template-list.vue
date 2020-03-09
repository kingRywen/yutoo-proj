<template lang="html">
    <section class="templateManagement">
        <!--  -->
        <div class="selectbox">
            <el-form :inline="true" class="demo-form-inline" size="medium">
                <el-form-item label="站点：">
                    <el-select v-model="selectForm.siteKey" @change="siteChange" clearable>
                        <el-option v-for='item in siteList' :label="item.siteNameZh" :value="item.siteNameEn"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="类目：">
                     <SyncCascader
                        v-model="selectForm.browseNode"
                        :props = "categoryProps"
                        :load = "loadTree"
                        size="medium"
                        @change="treeChange"
                        style="width:217px;"/>
                </el-form-item>
                <el-form-item label="模板名称：">
                    <el-input v-model.trim='selectForm.name' clearable/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSelectSubmit()">搜 索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--  -->
        <p class="ml0">
            <el-button type="primary" size="medium" @click="fn">导入模板</el-button>
            <el-button type="primary" size="medium" @click="fn">批量导入模板</el-button>
        </p>
        <!--  -->
        <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            class="tampTable" :data="tempList"   style="width: 100%" border>
            <el-table-column  prop="templateName"  label="模板名称"  width="224" align="center"/>
            <el-table-column  label="站点"  width="150" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.siteImg" alt="" width="67" height="37">
                    <p>{{scope.row.siteName}}</p>
                </template>
            </el-table-column>
            <el-table-column  prop="platformCategoryName" label="类别" align="center"></el-table-column>
            <el-table-column  prop="creatorName" label="创建人" width="130" align="center"></el-table-column>
            <el-table-column  prop="createTime" label="增加时间" width="160" align="center"></el-table-column>
            <el-table-column  prop="editorName" label="更新人" width="160" align="center"></el-table-column>
            <el-table-column  label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text">
                        <router-link :to="{ name: 'uploading', params: {operate:false,catePltTemplateId:scope.row.catePltTemplateId,banner:scope.row.banner} }" tag='span'>查看</router-link>
                    </el-button>
                    <!-- <el-button type="text" @click="delTemplate(scope.row.catePltTemplateId)">删除</el-button> -->
                    <el-button type="text">
                        <router-link :to="{ name: 'uploading', params: {operate:true,catePltTemplateId:scope.row.catePltTemplateId,banner:scope.row.banner} }" tag='span'>修改</router-link>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
import SyncCascader from "@/components/base/SyncCascader.vue";
import {getData} from "common/http";
export default {
    name: 'templateManagement',
    props:{
        siteList:{
            type:Array,
            default:()=>[]
        },
        categoryList:{
            type:Array,
            default:()=>[]
        },
        tempList:{
            type:Array,
            default:()=>[]
        },
        loading:{
            type:Boolean,
            default:true
        }
    },
    data() {
        let vm = this
        return {
            loadTree(id){
                id = id ? id[id.length-1] : -1
                return getData("CategoryPlatform/listChild", {
                   cateId: id,
                   siteId: vm.siteId
                }).then(res => {
                   if (res.data.code == 0) {
                       return res.data.cates.map(el => ({
                           ...el,
                           childs: el.childCount > 0 ? [] : null
                       }))
                    } else {
                       vm.$message.error(res.data.msg);
                    }
               });

            },
            selectForm:{
                siteKey:'',
                browseNode:[],
                name:''
            },
            categoryProps:{
                value: "platformCategoryId",
                label: "categoryName",
                children: "childs",
                enabled: 'haveTemplate'
            },
            browseNode:"",
            siteId:1
        }
    },
    methods: {
        //待开发
        fn(){
            this.$message('该功能正在努力开发中...');
        },
        treeChange(item){
            if(item !=undefined || null){
                this.browseNode = item.browseNode
            }else{
                this.browseNode = ""
            }
        },
        //站点改变
        siteChange(val){
            let siteId;
            this.siteList.map(item=>{
                if(item.siteNameEn == val){
                    siteId = item.siteId
                }
            })

            this.siteId = siteId
        },
        //模板删除
        delTemplate(catePltTemplateId) {
            this.$confirm('此操作将删除该模板, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$message({
                //   type: 'success',
                //   message: '删除成功!'
                // });
            })
        },
        //搜索
        onSelectSubmit() {
            let params = {
                browseNode:this.browseNode,
                siteKey:this.selectForm.siteKey,
                name:this.selectForm.name
            }
            this.$emit('select',params)
        },
    },
    components:{
        SyncCascader,
    }
}
</script>

<style lang="scss" scoped>
.templateManagement {
    .title {
        height: 38px;
        line-height: 38px;
        background: #62739a;
        text-indent: 5px;
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        color: rgb(255, 255, 255);
        .back {
            color: #3e9dff;
            cursor: pointer;
            margin-right: 10px;
            transition: all 0.3s ease;
            &:hover {
                color: #eee;
            }
        }
    }
    .selectbox {
        padding: 10px 15px;
        border-radius: 4px;
        background-color: #f2f2f2;
        .el-form-item {
            margin-bottom: 0;
        }
    }
    .ml0 {
        margin: 15px 0;
    }


}
</style>
