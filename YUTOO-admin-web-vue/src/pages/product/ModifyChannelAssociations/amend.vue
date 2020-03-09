<template lang="html">
    <div class="correlation">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item>批量修改渠道关联</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="correlation_select">
            <el-form label-position="right" label-width="120px" :model="form" :rules="rules" ref="form" class="form">
                <el-form-item label="选择更新内容：" prop="type">
                    <el-select size="small" v-model="form.type" @change="contentChange">
                        <el-option :label="item.label" :value="item.value" v-for="item in updateList" :key="item.value"/>
                    </el-select>
                </el-form-item>
                <div class="rows">
                    <el-form-item label="选择平台：" v-show="isSource" prop="platformId">
                        <el-select size="small" v-model.number="form.platformId" @change="platformChange">
                            <el-option :label="item.platformName" :value="item.platformId" v-for="item in platformList"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择站点：" v-show="isSource" prop="siteId">
                        <el-select size="small" v-model.number="form.siteId" @change="siteChange">
                            <el-option :label="item.siteNameZh" :value="item.siteId" v-for="item in siteList"/>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="rows">
                     <el-form-item label="选择店铺来源：" v-show="isSource" prop="storeId">
                         <el-select size="small" v-model.number="form.storeId" >
                             <el-option :label="item.name" :value="item.storeId" v-for="item in storeList"/>
                         </el-select>
                     </el-form-item>
                     <el-form-item label="选择类目来源：" v-show="isSource" prop="categoryId">
                         <el-cascader
                            :options="categoryList"
                            :props="props"
                            :show-all-levels="false"
                            v-model="form.categoryId"
                            @active-item-change="handleItemChange"
                            size="small"/>
                     </el-form-item>
                </div>
                <el-form-item label="选择模板：" v-show="isPlatform" prop="templateId" >
                     <el-select size="small" v-model="form.templateId">
                         <el-option :label="item.templateNameCh" :value="item.salePfTemplateId" v-for="item in templateList"/>
                     </el-select>
                </el-form-item>
            </el-form>
            <el-button type="primary" size="small" style="height: 30px;" @click="look">查看导入日志</el-button>
        </div>
        <p class="download ">
            <el-button type="primary" size="small" @click="isDownload('form')">下载模板</el-button><br/>
        </p>
        <el-upload
          class="upload"
          ref="upload"
          :action="uploadUrl"
          :headers = "headers"
          :data = "uploadData"

          :on-success="uploadSuccess"
          :with-credentials="true"

          :on-change = "uploadChange"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
          <el-button style="margin-left: 40px;" size="small" type="success" @click="isSubmitUpload">确认上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>
import {BASE_URL} from "common/config";
import { getData } from "common/http"
import {_storage} from 'common/common';


export default {
    components:{

    },
    data() {
      return {
        siteId:null,
        templateList:[],
        isPlatform:false,
        storeList:[],
        categoryList:[],
        platformList:[],
        siteList:[],
        props: {
            value: "platformCategoryId",
            label: "categoryName",
            children: "childs",
        },
        updateList:[
            {label:"更新产品关联关系",value:1},
            {label:"更新仓库产品信息",value:2},
            {label:"更新平台产品信息",value:3},
            {label:"更新店铺产品信息",value:4},
        ],
        fileList: [],
        rules:{
            type:[
                { required: true, message: '请选择更新内容', trigger: 'change' },
            ],
            platformId:[
               { required: false, message: '请选择平台', trigger: 'change' }
            ],
            templateId:[
                { required: false, message: '请选择模板', trigger: 'change' }
            ],
            storeId:[
                { required: false, message: '请选择店铺来源', trigger: 'change' }
            ],
            categoryId:[
                { required: false, message: '请选择类目来源', trigger: 'change' }
            ],
            siteId:[
                { required: false, message: '请选择站点', trigger: 'change' }
            ]

        },
        isSource:false,
        form:{
            type:null,
            storeId:null,
            categoryId:[],
            templateId:null,
            platformId:null,
            siteId:null,
        },

        uploadUrl:"",
        headers:{
            token:  _storage._get('local', 'token'),
            // 'Content-Type': 'multipart/form-data'
        },
        uploadData:{

        },
        file:null,
      };
    },
    methods:{
        //查看导入日志
        look(){
            this.$router.push({
                path: "/record",
                query:{
                    type:this.form.type
                }
            })
        },
        //获取模板
        getTemplate(siteCategoryId){
            getData("product/plt/detail/module",{siteCategoryId}).then(res=>{
                if(res.data.code==0){
                    this.templateList = res.data.categoryList
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //更新内容改变触发
        contentChange(val){
            switch(val){
                case 3:
                    this.isSource = true
                    this.isPlatform = true
                    if(!this.platformList.length)this.getPlatform();
                    this.rules.platformId[0].required = true
                    this.rules.templateId[0].required = true
                    this.rules.storeId[0].required = true
                    this.rules.categoryId[0].required = true
                    this.rules.siteId[0].required = true
                break;
                case 4:
                    this.isSource = true
                    this.isPlatform = false
                    if(!this.platformList.length)this.getPlatform();
                    this.rules.platformId[0].required = true
                    this.rules.storeId[0].required = true
                    this.rules.categoryId[0].required = true
                    this.rules.siteId[0].required = true
                    this.rules.templateId[0].required = false
                break;
                default:
                    this.isSource = false;
                    this.isPlatform = false;
                    this.rules.platformId[0].required = false
                    this.rules.templateId[0].required = false
                    this.rules.storeId[0].required = false
                    this.rules.categoryId[0].required = false
                    this.rules.siteId[0].required = false
            }
        },
        //下载模板
        downloadTemplate(url,params){
            getData(url,params).then(res=>{
                if(res.data.code==0){
                    try{
                        window.location.href = res.data.rows.path;
                    }catch(err){
                        console.log(err)
                        window.location.href = res.data.path
                    }

                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        isDownload(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let val = this.form.type;
                    let params = {}
                    let url = ""
                    switch(val){
                        case 1:
                            url = "template/store/product/rel/download"
                            this.downloadTemplate(url,params)
                        break;
                        case 2:
                            url = "product/batch/update/download"
                            this.downloadTemplate(url,params)
                        break;
                        case 3:
                            params = {
                                templateId:this.form.templateId
                            }
                            url = "product/plt/detail/update/module/download"
                            this.downloadTemplate(url,params)
                        break;
                        case 4:
                            params = {
                                storeId:this.form.storeId,
                                categoryId:this.form.categoryId[this.form.categoryId.length - 1 ]
                            }
                            url = "template/store/product/download";
                            this.downloadTemplate(url,params)
                        break;
                    }
                } else {
                    return false;
                }
            });
        },
        //平台改变切换站点
        platformChange(val){
            this.form.siteId = null;
            this.platformList.forEach(item=>{
                if(item.platformId == val){
                    this.siteList = item.siteList
                }
            })
        },
        //获取平台
        getPlatform(){
            this.$bus._platform_list().then(res=>{
                if(res.data.code==0){
                    this.platformList = res.data.rows;
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //站点切换获取店铺 和 类目
        siteChange(val){
            if(val){
                this.form.categoryId = []
                this.form.storeId = null
                this.form.templateId = null
                this.siteId = val
                //获取店铺
                this.$bus._site_store({siteIds:Array.of(val)}).then(res=>{
                    console.log(res)
                    if(res.data.code==0){
                        this.storeList = res.data.rows;
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
                //获取类目
                this.getCategoryList({siteId:val,cateId:-1},data=>{
                    this.categoryList = data;
                    this.categoryList.forEach(item => {
                       if (item.itemType == "") {
                         item["childs"] = [];
                       }
                    });
                })
            }
        },

        //获取类目
        getCategoryList(params,callback){
            getData("CategoryPlatform/listChild",params).then(res=>{
                if(res.data.code==0){
                    callback && callback(res.data.cates)
                }else{
                   this.$message.error(res.data.msg)
                }
            })
        },
        //根据当前类目获取下一级
        handleItemChange(val){
            let cateId = val[val.length - 1];
            this.getCategoryList({cateId,siteId:this.siteId},data=>{
                let nextCategory = data;
                nextCategory.map(item => {
                    if (item.itemType == "" && nextCategory.length) {
                        item["childs"] = [];
                    }
                    if(item.itemType){
                        if(item.hasOwnProperty("haveTemplate") && item.haveTemplate==null){
                            item['disabled'] = true;
                        }
                    }
                });
                this.categoryList.map((item,index)=>{
                    this.$set(
                        this.categoryList,
                        index,
                        Object.assign({}, this.categoryList[index], {"childs": nextCategory}))
                })
            })
        },



        // //根据站点获取=>类目来源
        // getCategoryArr(){
        //     getData('CategoryM/list',{keyword:""}).then(res=>{
        //         if(res.data.code==0){
        //             console.log(res)
        //             let data = res.data.category.childs;
        //             function delEvental(data){
        //                 if(data instanceof Array){
        //                     data.forEach(item=>{
        //                         if(item.childs.length){
        //                             delEvental(item.childs)
        //                         }else{
        //                             delete item.childs
        //                         }
        //                     })
        //                     return data
        //                 }else{
        //                     return data
        //                 }
        //             }
        //             this.categoryArr = delEvental(data)
        //         }else{
        //             this.$message.error(res.data.msg)
        //         }
        //     })
        // },
        //上传模板
        isSubmitUpload(e) {
            let vm = this
            vm.$refs.form.validate((valid) => {
                if(valid){
                    if(vm.form.type == 4){
                       vm.$set(vm.uploadData,'storeId',vm.form.storeId)
                       vm.$set(vm.uploadData,'categoryId',vm.form.categoryId[vm.form.categoryId.length - 1 ])
                    }                    
                    vm.$refs.upload.submit();
                }else{
                    return false
                }
            })
        },
        //上传成功
        uploadSuccess(response, file, fileList){
            if(response.code==0){
              this.$message({
                  type:"success",
                  message:response.msg
              })
            }else{
                this.$message.error(response.msg)
            }
        },
        //
        uploadChange(file, fileList){
            console.log(file);
        },
        //删除上传的文件触发
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        //点击上传的文件触发
        handlePreview(file) {
            console.log(file);
        },
    },
    created(){

    },
    beforeDestory(){

    },
    watch:{
        "form.type" (val){
            if(val==1)this.uploadUrl = BASE_URL+"/template/store/product/rel/upload";
            if(val==2)this.uploadUrl = BASE_URL+"/product/batch/update/upload";
            if(val==3)this.uploadUrl = BASE_URL+"/product/plt/detail/batch/update/upload";
            if(val==4)this.uploadUrl = BASE_URL+"/template/store/product/upload";
        },
        'form.categoryId'(val){
            if(val.length && this.form.type==3){
                this.form.templateId = null
                var siteCategoryId = val[val.length-1]
                this.getTemplate(siteCategoryId)
            }
        }
    },

}
</script>

<style lang="scss">
    @import "../../../assets/style/style-scss/layout.scss";
    .correlation_select{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width:100%;
        padding: 20px 50px 0 20px;
        .form{
            width: 100%;
            .rows{
                display: flex;
                flex-direction: row;
            }
        }
    }
    .download{
        padding-left: 30px;
    }
    .upload{
        margin-top: 30px;
        padding-left: 30px;
    }
    .el-upload__input{
        display: none!important;
    }
    input[type="file"] {
        display: none!important;
    }
    .el-upload-list{
        border: 1px solid #ccc;
        padding: 10px;
        margin-right: 50px;
        margin-top: 15px;
        min-height: 330px;
        border-radius: 5px;
    }



</style>
