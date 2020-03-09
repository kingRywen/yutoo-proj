<template lang="html">
    <section class="uploading">
        <!-- <div style="padding:10px">
            <el-form :inline="true" :model="uploadingForm" class="demo-form-inline uploadingForm" size="medium">
                <el-form-item label="名称：">
                      <el-input v-model.trim='uploadingForm.name'/>
                </el-form-item>
                <el-form-item label="站点：">
                    <el-select v-model="uploadingForm.site">
                        <el-option v-for='item in siteLists' :label="item.siteNameZh" :value="item.siteId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类目：">
                        <el-select v-model="uploadingForm.category">
                          <el-option label="区域一" value="shanghai"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item>
                      <el-upload class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :file-list="fileList"
                          list-type="picture">
                          <el-button size="medium" type="primary">上传模板</el-button>
                        </el-upload>
                </el-form-item>
            </el-form>
        </div> -->

            <el-tabs type="border-card" v-model="activeAttribute" @tab-click="changeAttribute" class="tabs">
                <el-tab-pane :name="item.nameCn" v-for="item in attributeList" :key="item.nameCn">

                    <el-tooltip slot="label" effect="dark" :content="item.descCn" placement="top-start">
                        <span>{{item.nameCn}}</span>
                    </el-tooltip>
                        <fieldsTable
                            v-if="item.nameCn==activeAttribute"
                            :isLook="operate"
                            :fieldsData="fieldsData"
                            @setfields="setfields"
                            @changeDifference="isChangeDifference"/>

                </el-tab-pane>
            </el-tabs>

        <el-dialog :title="dialogTitle" :visible.sync="fieldsDialog" center width="500px">
            <div class="demo-input-suffix">
                选择字段来源：
                <el-select v-model="selectFields" @change="fieldsChange">
                    <el-option v-for="(value,key) in fieldsInfo" :label="key"  :value="value"/>
                </el-select>
            </div>
            <!--  -->
            <template v-for="(item,index) in selectFields">
                <div class="sourceTable">
                    <h1 class="sourceTitle">
                        <span>{{item.categoryPath}}</span>
                        <!-- sourceInput -->
                        <span style="line-height:32px;">
                            <el-input
                                style="width:120px;"
                                size="mini"
                                prefix-icon="el-icon-search"
                                v-model.trim="item.searchName"
                                @input="sourceChange(item,index)">
                            </el-input>
                        </span>
                    </h1>
                    <el-table
                        height="350"
                        ref="sourceTable"
                        :data="item.searchName?item.arr:item.entities"
                        highlight-current-row
                        @current-change="handleCurrentChange"
                        border style="width: 100%">
                        <el-table-column  type="index"  label="序号" align="center" width="80"></el-table-column>
                        <el-table-column  prop="propertyName" label="字段名称" align="center"></el-table-column>
                        <el-table-column  align="center" width="80" label="操作">
                            <template slot-scope="scope">
                                <input type="radio" :value="scope.$index" v-model="item.radio"></input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <!--  -->
            <span slot="footer">
                <el-button type="primary" @click="submitFields">确 认 关 联</el-button>
            </span>
        </el-dialog>


    </section>
</template>

<script>
import {getData} from "@/common/http.js";
import FieldsTable from "./fieldsTable.vue"
export default {
    data() {
        return {
            fileList:[],
            // sourceInput:null,
            // sourceList:[],
            uploadingForm:{
                name:"",
                site:"",
                category:""
            },
            attributeList:[],
            activeAttribute:"基本",
            fieldsData:[],
            fieldsDialog:false,

            dialogTitle:"",
            fieldsInfo:{},
            selectFields:null,
            radio:"",
            currentRow:null,
            tempPropRelId:null,
            relMap:[],
            operate:this.$route.params.operate,
            code:0,
        }
    },
    mounted(){
        this.getTemplateAttribute({
            catePltTemplateId:this.$route.params.catePltTemplateId
        })
    },
    methods: {
        sourceChange(item,index){
            item.arr = item.entities.filter(i=>{
                return i.propertyName.indexOf(item.searchName) != -1;
            })
        },
        //改变店铺差异和变体差异
        changeDifference(type,salePfTempPropRelId,flag){
            let params = {
                "templateId":this.$route.params.catePltTemplateId,
                "salePfTempPropRelId":salePfTempPropRelId,
                "propDiversity":type,
                "flag" :flag?0:1
            }
            getData("CatePltTempPropSet/setTempPropDiversity",params).then(res=>{
                if(res.data.code==0){
                    this.$message({
                      message: res.data.msg,
                      type: 'success'
                    });
                    this.getTemplateAttribute({catePltTemplateId:this.$route.params.catePltTemplateId})
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //是否改变店铺差异和变体差异
        isChangeDifference(type,item){
            // console.log(type,item)
            let str  = type?"变体差异":'店铺差异'
            this.$confirm(`确定改变${str}吗, 是否继续?`,'提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
                if(type){
                    //2为变体差异
                    this.changeDifference(2,item.catePltTempPropId,item.variantsDisparityFlag)
                }else{
                    //1为店铺差异
                    this.changeDifference(1,item.catePltTempPropId,item.storeDisparityFlag)
                }
            }).catch(()=>{

            })
        },
        //字段来源改变时
        fieldsChange(val){
            console.log("字段来源改变时",val)

            val.forEach((item,index)=>{
                let curindex = item.entities.findIndex(curitem =>curitem.select==true)
                item.radio = curindex;
                // this.currentRow = val[curindex];
            })
        },
        //确认关联字段
        submitFields(){
            if(this.selectFields){
                if(this.relMap.length){
                    let params = {
                        "templateId":this.$route.params.catePltTemplateId,
                        "salePfTempPropRelId":this.tempPropRelId,
                        "relMap":this.relMap
                    }
                    console.log(params)
                    getData("CatePltTempPropSet/setRelationProperty",params).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                              message: res.data.msg,
                              type: 'success'
                            });
                            this.fieldsDialog = false;
                            this.getTemplateAttribute({catePltTemplateId:this.$route.params.catePltTemplateId})
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                }else{
                    this.$message.error("请选择需要关联的字段名称")
                }
            }else{
                this.$message.error("请选择字段来源")
            }
        },
        //设置关联字段
        setfields(templateId,tempPropRelId,name){
            this.dialogTitle = `设置关联字段-${name}`
            this.tempPropRelId = tempPropRelId;
            this.selectFields = null
            this.relMap = []
            let params = {
                templateId,
                tempPropRelId,
                browseNode:this.$route.params.banner
            }
            this.fieldsDialog = true
            getData('BaseProductProp/listForIdAndName',params).then(res=>{
                if(res.data.code==0){
                    let obj = Object.assign({},res.data.list)
                    for(let key in obj){
                        if(obj[key] instanceof Array && obj[key].length){
                            obj[key].forEach(item=>{
                                item['searchName'] = ""
                                item['arr'] = []
                                item['radio'] = ""
                            })
                        }
                    }
                    console.log(obj)
                    this.fieldsInfo = obj
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleCurrentChange(val) {
            console.log("当前项",val)
            console.log(this.selectFields)
            this.selectFields.forEach((item,index)=>{
                item.entities.forEach((curitem,curIndex)=>{
                    if(val.propertyId == curitem.propertyId){
                        this.relMap = []
                        this.relMap.push({
                            propertyCategory:item.categoryId,
                            propertyId:curitem.propertyId,
                            propertyType:curitem.relationProductPropType
                        })
                        item.radio = curIndex
                    }
                })
            })
            // this.currentRow = val;
        },
        //切换属性标签
        changeAttribute(tab){
            this.attributeList.forEach((item,index)=>{
                if(tab.name == item.nameCn){
                    this.code = index
                    this.fieldsData = item.objects
                }
            })
        },
        //获取模板属性列表
        getTemplateAttribute(catePltTemplateId){
            getData('CatePltTempPropSet/getTemplatePropertys',catePltTemplateId).then(res=>{
                if(res.data.code==0){
                    this.attributeList = res.data.propertyList;
                    this.fieldsData = this.attributeList[this.code].objects;
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },


    },
    components:{
        FieldsTable
    }
}
</script>

<style lang="scss">
.uploadingForm {
    padding: 10px;
    border-radius: 5px;
    background-color: #f2f2f2;
    .el-form-item{
        margin: 0;
    }
    .upload-demo {
        position: relative;
        .el-upload__input {
            display: none;
        }
        .el-upload-list {
            position: absolute;
            left: 120px;
            top: -15px;
            z-index: 10;
            display: flex;
            li {
                height: 50px;
                width: 110px;
                padding: 10px;
                img {
                    height: 34px;
                    width: 34px;
                    margin-left: 0;
                }
                a {
                    width: 48px;
                    height: 16px;
                    line-height: 16px!important;
                }
            }
        }
    }
}
.sourceTable {
    margin-top: 15px;
    // height: 380px;
    // overflow-y: auto;
    .sourceTitle {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        background: rgba(242, 242, 242, 1);
        height: 35px;
        line-height: 34px;
        padding: 0 10px;
        color: #333;
    }
}
.el-table__body tr.current-row>td{
    background: #108ee9;
    color: #333;
}
.tabs{
    box-shadow: 0 0 0 0;
}
</style>
