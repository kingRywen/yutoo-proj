<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item>SKU生成规则</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="container_sku">
            <el-tabs type="border-card" @tab-click="handleTabClick" v-model="activeTabName">
                <el-tab-pane label="店铺SKU规则设置" name="店铺SKU规则">
                    <template v-if="activeTabName =='店铺SKU规则'">
                        <select-sku @select="onSelect"/>
                        <handle @addSkuRules="addSkuRules" @handleAllDel="onHandleAllDel"/>
                        <table-sku :data="skuLists" @compile="onCompile" @deleteRow="onDeleteRow" @userSelect="onUserSelect"/>
                        <el-pagination :current-page="currentPage" :page-sizes="[10, 8,5]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
                        <!--  -->
                        <changeSkuDialog  :ruleInfo="ruleInfo" @submit="submit" :shopList="shopList" :rulesList="rulesList" :title="title" :ruleDialog="shopRuleDialog" @ruleDialogChange="val => shopRuleDialog = val"/>
                    </template>
                </el-tab-pane>
                <!--  -->
                <el-tab-pane label="平台SKU规则设置" name="平台SKU规则">
                    <template v-if="activeTabName =='平台SKU规则'">
                         <select-sku @select="onSelect"/>
                         <handle @addSkuRules="addSkuRules" @handleAllDel="onHandleAllDel"/>
                         <table-sku :ruleType="false" :data="skuLists" @compile="onCompile" @deleteRow="onDeleteRow" @userSelect="onUserSelect"/>
                         <el-pagination :current-page="currentPage" :page-sizes="[10, 8,5]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
                         <!--  -->
                         <changeSkuDialog :ruleInfo="ruleInfo" @submit="submit" :platformList="platformList" :rulesList="rulesList" :title="title" :ruleDialog="shopRuleDialog" @ruleDialogChange="val => shopRuleDialog = val"/>
                    </template>
                </el-tab-pane>
                <!--  -->
                <el-tab-pane label="仓库SKU规则设置" name="仓库SKU规则">
                    <template v-if="activeTabName =='仓库SKU规则'">
                         <select-sku @select="onSelect"/>
                         <handle @addSkuRules="addSkuRules" @handleAllDel="onHandleAllDel"/>
                         <table-sku :ruleType="false" :data="skuLists" @compile="onCompile" @deleteRow="onDeleteRow" @userSelect="onUserSelect"/>
                         <el-pagination :current-page="currentPage" :page-sizes="[10, 8,5]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
                         <!--  -->
                         <changeSkuDialog :ruleInfo="ruleInfo" @submit="submit"  :rulesList="rulesList" :title="title" :ruleDialog="shopRuleDialog" @ruleDialogChange="val => shopRuleDialog = val"/>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import {getData} from 'common/http'
import SelectSku from './selectSku'
import Handle from './handle'
import TableSku from './tableSku'
import ChangeSkuDialog from './changeSku_dialog'

var myMixin = {
    data() {
        return {

        }
    },
    created: function () {
        // this.hello()
    },
    methods: {
        hello: function () {
            console.log('hello from mixin!1231111111111111111111111')
        }
    }
}

export default {
    mixins: [myMixin],
    data() {
        return {
            platformList:[],
            skuLists: [], //sku列表，
            shopList:[],  //列表
            rulesList:[], //列表
            title:"",
            shopRuleDialog:false,
            currentPage:null,
            pageSize:null,
            total:null,
            userSelectSku:[],
            activeTabName:'店铺SKU规则', //当前的标签页规则页
            ruleInfo:{},
            type:1,
            skuRuleId:"",
            selectInfo:{}
        }
    },
    created() {
        this.getSkuLists()

    },
    methods: {
        //点击标签页触发
        handleTabClick(tab, event){
            this.shopList = []
            this.skuLists = []
            this.rulesList = []
            var name = tab.name
            this.title = `添加${this.activeTabName}`
            switch(name){
                case "店铺SKU规则":
                    this.type = 1
                    this.getSkuLists()
                break;
                case "平台SKU规则":
                    this.type = 2
                    this.getSkuLists()
                break;
                case "仓库SKU规则":
                    this.type = 3
                    this.getSkuLists()
                break;
            }
        },
        //保存
        submit(params){
            if(this.title.indexOf("添加") != -1){
                this.send("sku/rule/save",params,msg =>{
                    this.$message({
                      message: msg,
                      type: 'success'
                    });
                    this.shopRuleDialog = false;
                    this.getSkuLists()
                })
                return
            }
            if(this.title.indexOf("编辑") != -1){
                 this.send("sku/rule/update",{...params,skuRuleId:this.skuRuleId,merchantId:this.ruleInfo.merchantId,createId:this.ruleInfo.createId},msg =>{
                     this.$message({
                       message: msg,
                       type: 'success'
                     });
                     this.shopRuleDialog = false;
                     this.getSkuLists()
                 })
            }
        },
        send(url,params,callback){
            getData(url,params).then(res=>{
                if(res.data.code==0){
                    callback && callback(res.data.msg)
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //搜索
        onSelect(val){
            this.selectInfo = val
            let params = {
                "sortOrder": "asc",
                "pageSize": 10,
                "pageNumber": 1,
                "type": this.type
            }
            if(val.activateFlag !=""){
                params = {...params,activateFlag:val.activateFlag}
            }
            if(val.ruleName !=""){
                params = {...params,ruleName:val.ruleName}
            }
            if(val.timeArr !==null && val.timeArr.length){
                params = {...params,startTime:val.timeArr[0],endTime:val.timeArr[1]}
            }
            this.getSkuLists(params)
        },
        //用户选中的
        onUserSelect(val){
           this.userSelectSku = val.map(item=>item.skuRuleId)
        },
        //批量删除
        onHandleAllDel() {
            if(this.userSelectSku.length){
                this.send("sku/rule/remove",{skuRuleId:this.userSelectSku},msg =>{
                    this.$message({
                        type: 'success',
                        message: msg,
                    });
                    this.getSkuLists()
                })
            }else{
                this.$message({
                    type: 'warning',
                    message: '请选择需要删除的店铺sku规则!',
                    center: true
                });
            }
        },
        //删除
        onDeleteRow(skuRuleId) {
            console.log(skuRuleId)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.send("sku/rule/remove",{skuRuleId:Array.of(skuRuleId)},msg =>{
                    this.$message({
                        type: 'success',
                        message: msg,
                    });
                    this.getSkuLists()
                })
            })

        },
        //编辑
        onCompile(skuRuleId){
            this.title = `编辑${this.activeTabName}`
            this.skuRuleId = skuRuleId
            //获取店铺
            if(!this.shopList.length && this.type==1){
                this.getShopList()
            }
            if(!this.rulesList.length){
                this.getRulesList()
            }
            //获取平台
            if(!this.platformList.length && this.type==2){
                this.getPlatformList()
            }

            getData("sku/rule/info",{skuRuleId}).then(res=>{
                if(res.data.code==0){
                    this.shopRuleDialog = true;
                    this.ruleInfo = res.data.rows;

                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //添加
        addSkuRules(val){
            this.shopRuleDialog = val
            this.title = `添加${this.activeTabName}`
             //获取店铺
            if(!this.shopList.length && this.type==1){
                this.getShopList()
            }
            if(!this.rulesList.length){
                this.getRulesList()
            }
            //获取平台
            if(!this.platformList.length && this.type==2){
                this.getPlatformList()
            }
        },
        //第几页pagesize
        handleCurrentChange(val){
            console.log(val)
            let params = {
                "sortOrder": "asc",
                "pageSize": this.pageSize,
                "pageNumber": val,
                "type": this.type
            }
            if(this.selectInfo['activateFlag'] !=""){
                params = {...params,activateFlag:this.selectInfo['activateFlag']}
            }
            if(this.selectInfo['ruleName'] !=""){
                params = {...params,ruleName:this.selectInfo['ruleName']}
            }
            if(this.selectInfo['timeArr'] !=null && this.selectInfo['timeArr'].length){
                params = {...params,startTime:this.selectInfo['timeArr'][0],endTime:this.selectInfo['timeArr'][1]}
            }
            this.getSkuLists(params)
        },
        //每页多少pagesize
        handleSizeChange(val){
           // console.log(val)
           let params = {
               "sortOrder": "asc",
               "pageSize": val,
               "pageNumber": this.currentPage,
               "type": this.type
           }
           if(this.selectInfo['activateFlag'] !=""){
               params = {...params,activateFlag:this.selectInfo['activateFlag']}
           }
           if(this.selectInfo['ruleName'] !=""){
               params = {...params,ruleName:this.selectInfo['ruleName']}
           }
           if(this.selectInfo['timeArr'] !=null && this.selectInfo['timeArr'].length){
               params = {...params,startTime:this.selectInfo['timeArr'][0],endTime:this.selectInfo['timeArr'][1]}
           }
           this.getSkuLists(params)
        },
        //获取店铺名称==>已授权的店铺
        getShopList() {
             return getData('store/list', {
                 pageNumber: 1,
                 pageSize: 100
             }).then(res => {
                 if (res.data.code == 0) {
                     this.shopList = res.data.rows.rows.filter(item => {
                         return item.apiFlag == 1;
                     });
                 }else{
                     this.$message.error(res.data.msg);
                 }
             })
        },
        //获取店铺sku=>table列表
        getSkuLists(params = {
             "sortOrder": "asc",
             "pageSize": 10,
             "pageNumber": 1,
             "type": this.type
         }) {
             getData('sku/rule/list', params).then(res => {
                 if (res.data.code == 0) {
                     this.skuLists = res.data.rows.rows;
                     this.currentPage =  res.data.rows.pageNo
                     this.total = res.data.rows.total
                     this.pageSize = res.data.rows.pageSize
                 } else {
                     this.$message.error(res.data.msg)
                 }
             })
        },
        //获取店铺sku=>规则列表
        getRulesList() {
            getData('sku/rule/list/enum', {
                type: this.type
            }).then(res => {
                if (res.data.code == 0) {
                    this.rulesList = res.data.rows;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        //获取平台列表
        getPlatformList(){
            getData('platform/list/platform/site').then(res=>{
                if(res.data.code==0){
                    this.platformList = res.data.rows;
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        }
    },
    components:{
        SelectSku,
        Handle,
        TableSku,

        ChangeSkuDialog
    }
}
</script>

<style lang="scss">
@import '../../../assets/style/style-scss/layout.scss';
.el-pagination{
    text-align: center;
    margin-top: 20px;
}

.el-dialog__footer {
    text-align: center;
    .el-button {
        width: 200px;
    }
}

.addinput {
    width: 100px;
    margin-right: 5px;
    .el-input-group__append,
    .el-input-group__prepend {
        padding: 0 10px;
    }
    .el-input__inner {
        min-width: 50px;
    }
}
.btn {
    width: 200px;
    poition: relative;
    left: 50%;
    margin-left: -100px;
}
.container_sku{
    position: fixed;
    left: 0;
    right: 0;
    top: 35px;
    bottom: 0;
    overflow-y: auto;
    .el-tabs{
        height: 100%;
    }
}
</style>
