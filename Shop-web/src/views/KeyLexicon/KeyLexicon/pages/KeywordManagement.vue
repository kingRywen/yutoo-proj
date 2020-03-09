<template>
    <div class="box">
        <el-tabs type="card" v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="未筛选关键词" name="second" :lazy='true'>
                <y-template :scrollName='"condition11"'>
                    <!-- <div slot="ScreenTip">
                        <span>筛选条件</span>
                        <span></span>
                    </div> -->
                    <el-form :inline="true" :model="listQuery2" ref="listQueryForm" slot="ScreenInfo">
                        
                            <el-form-item label="包含"  prop="include">
                                <el-input
                                    style='width:270px'
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入,一行一个"
                                    v-model="listQuery2.include">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="不包含"  prop="exclude">
                                <el-input
                                    style='width:270px'
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入,一行一个"
                                    v-model="listQuery2.exclude">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="排除"  prop="barring">
                                <el-input
                                    style='width:270px'
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入,一行一个"
                                    v-model="listQuery2.barring">
                                </el-input>
                            </el-form-item>

                            <el-form-item prop="keywordTexts" label="等于">
                                 <el-input
                                    style='width:260px'
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入,一行一个"
                                    v-model="listQuery2.keywordTexts">
                                </el-input>
                                <!-- <el-input v-model.trim="listQuery2.keywordText" placeholder="请输入关键词名称" size="mini" clearable></el-input> -->
                            </el-form-item>

                            <el-form-item>
                                <el-button  size="small" type="primary" icon="el-icon-search" v-for="item in [['搜索',2]]" @click="distribute(item)" :loading="btnLoading['btn'+item[1]]">{{item[0]}}</el-button>
                                 <el-button size="small" type="primary" plain @click="clear2" :disabled='btnLoading.btn2'>重置搜索</el-button>
                            </el-form-item>
                    </el-form>
                    <div slot="HandleBtn">
                        <el-button type="primary" plain size="mini" @click="setStatus(2,'VALID_UNION')" :loading="btnLoading.btn5">设为有效</el-button>
                        <el-button type="primary" plain size="mini" @click="setStatus(2,'INVALID_EXACT')" :loading="btnLoading.btn6">设为无效</el-button>
                        <el-button type="primary" plain size="mini" @click='copyKeyword2'>复制关键词</el-button>
                        <el-button type="primary" plain size="mini" @click='deletekeyword2'>删除</el-button>
                        <!-- <el-dropdown @command="handleCommand2" style="margin-left: 10px;">
                            <el-button type="primary" plain size="mini">
                                设为无效<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="INVALID_EXACT">精准否定</el-dropdown-item>
                            <el-dropdown-item command="INVALID">词组否定</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                    </div>
                    <el-table
                            slot="table"
                            :data="list2"
                            v-loading="listLoading2"
                            :key='tableKey2'
                            style="width: 100%"
                            border
                            stripe
                            tooltip-effect="light"
                            @selection-change="handleSelectionChange2">
                                <el-table-column
                                type="selection"
                                width="55">
                                </el-table-column>
                                <el-table-column
                                    prop="keywordText"
                                    label="关键词"
                                    min-width="120">
                                </el-table-column>
                            </el-table>
                        <el-pagination slot="pagination" background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="listQuery2.pageNumber" :page-sizes="[10,20,30, 50,1000]" :page-size="listQuery2.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total2">
                        </el-pagination>
                </y-template>

            </el-tab-pane>
            <el-tab-pane label="已筛选关键词" name="first" :lazy='true'>
                <y-template :scrollName='"condition11"'>
                    <!-- <div slot="ScreenTip">
                        <span>筛选条件</span>
                        <span></span>
                    </div> -->
                    <el-form size="small" :inline="true" :model="listQuery1" ref="listQueryForm" slot="ScreenInfo">
                            
                            <el-form-item label="包含"  prop="include">
                                <el-input
                                    style='width:270px'
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入,一行一个"
                                    v-model="listQuery1.include">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="不包含"  prop="exclude">
                                <el-input
                                    style='width:270px'
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入,一行一个"
                                    v-model="listQuery1.exclude">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="排除"  prop="barring">
                                <el-input
                                    style='width:270px'
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入,一行一个"
                                    v-model="listQuery1.barring">
                                </el-input>
                            </el-form-item>

                            <el-form-item prop="keywordTexts" label='等于'>
                                 <el-input
                                    style='width:270px'
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入,一行一个"
                                    v-model="listQuery1.keywordTexts">
                                </el-input>
                                <!-- <el-input v-model.trim="listQuery1.keywordText" placeholder="请输入关键词名称" size="mini" clearable></el-input> -->
                            </el-form-item>
                            <el-form-item prop="keywordStatus" label='关键词类型'>
                                <el-select
                                    v-model="listQuery1.keywordStatus"
                                    placeholder="关键词类型"
                                    size="mini"
                                    clearable>
                                    <el-option :label="item[0]" :value="item[1]" v-for="item in [['无效','0'],['有效','1']]"></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- <el-form-item prop="classify" label='关键词分类'>
                                <el-select
                                    v-model="listQuery1.classify"
                                    placeholder="关键词分类"
                                    size="mini"
                                    clearable>
                                    <el-option :label="item[0]" :value="item[1]" v-for="item in classifyOptions"></el-option>
                                </el-select>
                            </el-form-item> -->


                            <el-form-item>
                                <el-button  size="small" type="primary" icon="el-icon-search" v-for="item in [['搜索',1]]" @click="distribute(item)" :loading="btnLoading['btn'+item[1]]">{{item[0]}}</el-button>
                                <el-button size="small" type="primary" plain @click="clear1" :disabled='btnLoading.btn1'>重置搜索</el-button>
                            </el-form-item>
                        
                        
                    </el-form>
                    <div slot="HandleBtn">
                        <el-button type="primary" plain size="mini" @click="setStatus(1,'VALID_UNION')" :loading="btnLoading.btn3">设为有效</el-button>
                        <el-button type="primary" plain size="mini" @click="setStatus(1,'INVALID_EXACT')" :loading="btnLoading.btn4">设为无效</el-button>
                        <el-button type="primary" plain size="mini" @click='copyKeyword1'>复制关键词</el-button>
                        <el-button type="primary" plain size="mini" @click='deletekeyword1'>删除</el-button>
                        <!-- <el-dropdown @command="handleCommand1" style="margin-left: 10px;">
                            <el-button type="primary" plain size="mini">
                                设为无效<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="INVALID_EXACT">精准否定</el-dropdown-item>
                            <el-dropdown-item command="INVALID">词组否定</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                    </div>
                    <el-table
                            slot="table"
                            :data="list1"
                            v-loading="listLoading1"
                            :key='tableKey1'
                            style="width: 100%"
                            border
                            stripe
                            tooltip-effect="light"
                            @selection-change="handleSelectionChange1">
                                <el-table-column
                                type="selection"
                                width="55">
                                </el-table-column>
                                <el-table-column
                                    prop="keywordText"
                                    label="关键词"
                                    min-width="150">
                                </el-table-column>
                                <el-table-column
                                    prop="keyword"
                                    label="关键词类型"
                                    min-width="100">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.keywordStatus==0">无效</div>
                                        <div v-else-if="scope.row.keywordStatus==1">有效</div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column
                                    label="关键词分类"
                                    min-width="90">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.classify==1">核心词</div>
                                        <div v-else-if="scope.row.classify==2">长尾词</div>
                                        <div v-else-if="scope.row.classify==3">其他词</div>
                                        <div v-else-if="scope.row.classify==4">未分类</div>
                                        <div v-else-if="scope.row.classify==5">词组否定</div>
                                        <div v-else-if="scope.row.classify==6">精确否定</div>
                                        <div v-else-if="scope.row.classify==7">成交词</div>
                                        <div v-else-if="scope.row.classify==8">非成交词</div>
                                        <div v-else-if="scope.row.classify==9">仅广告</div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column> -->
                                
                            </el-table>
                        <el-pagination slot="pagination" background @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="listQuery1.pageNumber" :page-sizes="[10,20,30, 50,1000]" :page-size="listQuery1.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total1">
                        </el-pagination>
                </y-template>
            </el-tab-pane>
            
            <el-tab-pane label="待筛选否定词" name="three" v-if='listQuery1.productId && listQuery2.productId' :lazy='true'>
                <NegativeWordsScreened  :productId='listQuery1.productId' :cusCateId='listQuery1.cusCateId' />
            </el-tab-pane>   
            <el-tab-pane label="忽略否定词" name="four"  v-if='listQuery1.productId && listQuery2.productId' :lazy='true'>
                <IgnoreNegativeWords  :productId='listQuery1.productId' :cusCateId='listQuery1.cusCateId'  />
            </el-tab-pane> 
        </el-tabs>
    </div>
</template>
<script>
import YTemplate from '../../../Common/y-template/index'
import NegativeWordsScreened from './NegativeWordsScreened'
import IgnoreNegativeWords from './IgnoreNegativeWords'
const _ =require('lodash')
const onlineClassifyOptions =[
    ['核心词','1'],
    ['长尾词','2'],
    ['其他词','3'],
    // ['未分类','4'],
    ['词组否定','5'],
    ['精确否定','6'],
    ['仅广告','9'],
    // ['非成交词','8']
]
const adClassifyOptions =[
    // ['核心词','1'],
    // ['长尾词','2'],
    // ['其他词','3'],
    // ['未分类','4'],
    ['词组否定','5'],
    ['精确否定','6'],
    ['成交词','7'],
    ['非成交词','8']
]
export default {
    components:{
        YTemplate,
        NegativeWordsScreened,
        IgnoreNegativeWords
    },
    props: ['pParams'],
    data(){
        return{
             activeName: 'second',
           
            tableKey1: 0,
            list1: null,
            total1: null,
            listLoading1: false,
            listQuery1:{
                pageSize: 10,
                pageNumber: 1,
                siteId:null,
                cusCateId:null,
                productId:null,
                keywordType:null,
                flag:1,
                // classify:null,
                keywordStatus:null,
                keywordTexts:null,
            },

            tableKey2: 1,
            list2: null,
            total2: null,
            listLoading2: false,
            listQuery2:{
                pageSize: 10,
                pageNumber: 1,
                siteId:null,
                cusCateId:null,
                productId:null,
                keywordType:null,
                flag:0,
                // classify:null,
                keywordStatus:null,
                keywordTexts:null,
            },
            multipleSelection1:[],
            multipleSelection2:[],
            btnLoading:{
                btn1:false,
                btn2:false,
                btn3:false,
                btn4:false,
                btn5:false,
                btn6:false,
            },
            classifyOptions:[]
        }
    },
    watch: {
        "pParams.type"(newP, oldP) {

            // this.listQuery.cusCateId = this.pParams.cusCateId;
            if (newP === "category") {
                this.listQuery1.productId = null;
                this.listQuery2.productId = null;
            } else {
                this.listQuery1.productId = this.pParams.productId;
                this.listQuery2.productId = this.pParams.productId;
            }

            if(this.activeName=='first'){
                this.getList1()
            }else{
                this.getList2()
            }

        },
        "pParams.cusCateId"(newP, oldP) {
            // let type = this.pParams.type;
           
            // if (type === "category") {
            //     this.listQuery.productId = null;
            // } else {
            //     this.listQuery.productId = this.pParams.productId;
            // }
            if(this.activeName=='first'){
                 this.listQuery1.cusCateId = newP;
                this.getList1()
            }else{
                 this.listQuery2.cusCateId = newP;
                this.getList2()
                
            }
        },
        "pParams.treeId"(newP, oldP) {
            // this.listQuery.cusCateId = this.pParams.cusCateId;
            let type = this.pParams.type;
            
            if (newP == 50&&type === "category") {
                //上架
                this.listQuery1.keywordType = "PUBLISH";
                this.listQuery2.keywordType = "PUBLISH";
                
            }else if(newP == 42&&type === "product"){
                this.listQuery1.keywordType = "PUBLISH";
                this.listQuery2.keywordType = "PUBLISH";

            } else if (newP == 51&&type === "category"||newP == 43&&type === "product") {
                //广告
                // let type = this.pParams.type;
                if (type === "category") {
                    this.listQuery1.keywordType = "ADVERT";
                    this.listQuery1.keywordType = "ADVERT";
                } else {
                    this.listQuery2.keywordType = "PRODUCT";
                    this.listQuery2.keywordType = "ADVERT";
                }
                
            }
            // this.getList(1);
        },
        
        "pParams.productId"(newP, oldP) {
            let type = this.pParams.type;
            // this.listQuery.cusCateId = this.pParams.cusCateId;
            if (type === "category") {
                this.listQuery1.productId = null;
                this.listQuery2.productId = null;
            } else {
                this.listQuery1.productId = newP;
                this.listQuery2.productId = newP;
            }
            if(this.activeName=='first'){
                this.getList1()
            }else{
                this.getList2()
            }
        },
        sellerData() {
            this.getInitParams()
        }
    },
    
    created(){
       this.getInitParams()

        let p =this.pParams
        if((p.type==='category'&&p.treeId===50)||(p.type==='product'&&p.treeId===42)){
            // 上架
            this.classifyOptions =onlineClassifyOptions
        }else if((p.type==='category'&&p.treeId===51)||(p.type==='product'&&p.treeId===43)){
            // 广告
            this.classifyOptions =adClassifyOptions
        }
    },
    methods:{
        deletekeyword2(){
            if(!this.multipleSelection2.length){
                this.$message.warning('请至少选择一项')
                return
            };
            //console.log(this.multipleSelection2);
            let ids = this.multipleSelection2.map(i=>{
                    return i.keywordId
            });
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api['categoryKeywordRemove']({
                    ids 
                }).then(()=>{
                    this.getList2()
                })
            }).catch(() => {
                  
            });
        },
        deletekeyword1(){
            if(!this.multipleSelection1.length){
                this.$message.warning('请至少选择一项')
                return
            };
            //console.log(this.multipleSelection2);
            let ids = this.multipleSelection1.map(i=>{
                    return i.keywordId
            });
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api['categoryKeywordRemove']({
                    ids 
                }).then(()=>{
                    this.getList1()
                })
            }).catch(() => {
                  
            });
        },
        copyKeyword2(){
            //console.log(this.multipleSelection2);
            if(!this.multipleSelection2.length){
                this.$message.warning('请至少选择一项')
                return
            };
            let keywordTextArr = this.multipleSelection2.map(el => el.keywordText);
            var oInput = document.createElement('textarea');
            oInput.value = keywordTextArr.join('\n');
            //console.log(oInput.value);
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            //oInput.style.display='none';
            document.body.removeChild(oInput);
            this.$message.success('复制成功')
        },
        copyKeyword1(){
            if(! this.multipleSelection1.length){
                this.$message.warning('请至少选择一项')
                return
            };
            let keywordTextArr = this.multipleSelection1.map(el => el.keywordText);
            var oInput = document.createElement('textarea');
            oInput.value = keywordTextArr.join('\n');
            //console.log(oInput.value);
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            //oInput.style.display='none';
            document.body.removeChild(oInput);
            this.$message.success('复制成功')
        },
        getInitParams(){
            if (this.sellerId && this.siteId) {
                // this.listQuery.sellerId =this.sellerId
                this.listQuery1.siteId =  this.siteId
                this.listQuery1.cusCateId =  this.pParams.cusCateId
                this.listQuery1.productId =  this.pParams.productId

                this.listQuery2.siteId =  this.siteId
                this.listQuery2.cusCateId =  this.pParams.cusCateId
                this.listQuery2.productId =  this.pParams.productId


                 let type = this.pParams.type;
                 let treeId = this.pParams.treeId
                 if (treeId == 50&&type === "category") {
                    //上架
                    this.listQuery1.keywordType = "PUBLISH";
                    this.listQuery2.keywordType = "PUBLISH";
                    
                }else if(treeId == 42&&type === "product"){
                    this.listQuery1.keywordType = "PUBLISH";
                    this.listQuery2.keywordType = "PUBLISH";

                } else if (treeId == 51&&type === "category"||treeId == 43&&type === "product") {
                    //广告
                    // let type = this.pParams.type;
                    if (type === "category") {
                        this.listQuery1.keywordType = "ADVERT";
                        this.listQuery2.keywordType = "ADVERT";
                    } else {
                        this.listQuery1.keywordType = "PRODUCT";
                        this.listQuery2.keywordType = "PRODUCT";
                    }
                }   
                
                if (type === "category") {
                    this.listQuery1.productId = null;
                    this.listQuery2.productId = null;
                } else {
                    this.listQuery1.productId = this.pParams.productId;
                    this.listQuery2.productId = this.pParams.productId;
                }
                this.getList2()
                // this.getList2()
            }
        },
        distribute(btn){
            switch(btn[0]){
                case '搜索':
                    if(btn[1]==1){
                        this.handleFilter1()
                    }else{
                        this.handleFilter2()
                    }
                    
                break;
                case '添加任务':
                    this.showTaskDialog()
                break;
            }
        },
        handleTabClick(tab, event){
            if(tab.name==='first'){
                this.getList1()
            }else if(tab.name==='second'){
                this.getList2()
            }
            
        },
        checkRows(type){
          if(this[type].length===0){
                this.$message.warning('至少选一项');
                return false
            }
            return true
        },
        clear1(){
            this.listQuery1.pageNumber = 1
            this.listQuery1.keywordTexts = null
            this.listQuery1.classify = null
            this.listQuery1.keywordStatus = null
            this.listQuery1.include = null
            this.listQuery1.exclude = null
            this.listQuery1.barring = null
            this.getList1()
        },
        getList1() {
            this.listLoading1 = true
            this.btnLoading.btn1 =true
            let listQuery =_.cloneDeep(this.listQuery1)
            // if(listQuery.classify){
            //     listQuery.classify =parseInt(listQuery.classify)
            // }else{
            //     listQuery.classify =null
            // }
            if(listQuery.keywordStatus){
                listQuery.keywordStatus =parseInt(listQuery.keywordStatus)
            }else{
                listQuery.keywordStatus =null
            }

            let { include,exclude,barring ,keywordTexts} = JSON.parse(JSON.stringify(this.listQuery1));
            listQuery.keywordTexts = keywordTexts ?
                         keywordTexts.split(/[\n|\r\n|\,|\，]/)
                        .map(el => el.trim())
                        .filter(el => el !== '') : null;
            listQuery.include = include ?
                        include.split(/[\n|\r\n|\,|\，]/)
                        .map(el => el.trim())
                        .filter(el => el !== '') : [];
            listQuery.exclude = exclude ?
                            exclude.split(/[\n|\r\n|\,|\，]/)
                            .map(el => el.trim())
                            .filter(el => el !== '') : [];
            listQuery.barring = barring ?
                            barring.split(/[\n|\r\n|\,|\，]/)
                            .map(el => el.trim())
                            .filter(el => el !== '') : [];

            this.$api["categoryKeywordListScreen"](listQuery).then(res => {
                let { rows, total } = res;
                this.list1 =rows
                this.total1 = total;
                setTimeout(() => {
                    this.listLoading1 = false
                    this.btnLoading.btn1 =false
                }, 500)
            }).catch(() => {
                this.listLoading1 = false
                this.btnLoading.btn1 =false
            })
        },
        handleFilter1(){
            this.listQuery1.pageNumber = 1
            this.getList1()
        },
        handleSizeChange1(val) {
            this.listQuery1.pageSize = val
            this.getList1()
        },
        handleCurrentChange1(val) {
            this.listQuery1.pageNumber = val
            this.getList1()
        },
        handleSelectionChange1(val){
            this.multipleSelection1 = val;
        },
        // handleCommand1(command){
        //     let flag =this.checkRows('multipleSelection1')
        //     let ids =[]
        //     if(flag){
        //         this.multipleSelection1.forEach(element => {
        //             ids.push(element.keywordId)
        //         });
        //         this.categoryKeywordBatchUpdateStatus(1,{ids,keywordStatus:command})
        //     }
        // },
        clear2(){
            this.listQuery2.pageNumber = 1
            this.listQuery2.keywordTexts = null
            this.listQuery2.include = null
            this.listQuery2.exclude = null
            this.listQuery2.barring = null
            this.getList2()
        },
        getList2() {
            this.listLoading2 = true
            this.btnLoading.btn2 =true
            let listQuery =_.cloneDeep(this.listQuery2)
            let { include,exclude,barring ,keywordTexts} = JSON.parse(JSON.stringify(this.listQuery2));
            listQuery.keywordTexts = keywordTexts ?
                        keywordTexts.split(/[\n|\r\n|\,|\，]/)
                        .map(el => el.trim())
                        .filter(el => el !== '') : null;
            listQuery.include = include ?
                        include.split(/[\n|\r\n|\,|\，]/)
                        .map(el => el.trim())
                        .filter(el => el !== '') : [];
            listQuery.exclude = exclude ?
                            exclude.split(/[\n|\r\n|\,|\，]/)
                            .map(el => el.trim())
                            .filter(el => el !== '') : [];
            listQuery.barring = barring ?
                            barring.split(/[\n|\r\n|\,|\，]/)
                            .map(el => el.trim())
                            .filter(el => el !== '') : [];

            this.$api["categoryKeywordListScreen"](listQuery).then(res => {
                let { rows, total } = res;
                this.list2 =rows
                this.total2 = total;
                setTimeout(() => {
                    this.listLoading2 = false
                    this.btnLoading.btn2 =false
                }, 500)
            }).catch(() => {
                this.listLoading2 = false
                this.btnLoading.btn2 =false
            })
        },
        handleFilter2(){
            this.listQuery2.pageNumber = 1
            this.getList2()
        },
        handleSizeChange2(val) {
            this.listQuery2.pageSize = val
            this.getList2()
        },
        handleCurrentChange2(val) {
            this.listQuery2.pageNumber = val
            this.getList2()
        },
        handleSelectionChange2(val){
            this.multipleSelection2 = val;
        },
        // handleCommand2(command){
        //     let flag =this.checkRows('multipleSelection2')
        //     let ids =[]
        //     if(flag){
        //         this.multipleSelection2.forEach(element => {
        //             ids.push(element.keywordId)
        //         });
        //         this.categoryKeywordBatchUpdateStatus(2,{ids,keywordStatus:command})
        //     }
            
        // },
        setStatus(type,status){
            if(type==1){

                let flag =this.checkRows('multipleSelection1')
                let ids =[]
                if(flag){
                    this.multipleSelection1.forEach(element => {
                        ids.push(element.keywordId)
                    });
                    if(status==='VALID_UNION'){
                        this.btnLoading.btn3 =true
                    }else if(status==='INVALID_EXACT'){
                        this.btnLoading.btn4 =true
                    }
                    this.categoryKeywordBatchUpdateStatus(type,{ids,keywordStatus:status})
                }
            }else if(type==2){
                let flag =this.checkRows('multipleSelection2')
                let ids =[]
                if(flag){
                    this.multipleSelection2.forEach(element => {
                        ids.push(element.keywordId)
                    });
                    if(status==='VALID_UNION'){
                        this.btnLoading.btn5 =true
                    }else if(status==='INVALID_EXACT'){
                        this.btnLoading.btn6 =true
                    }
                    this.categoryKeywordBatchUpdateStatus(type,{ids,keywordStatus:status})
                }
            }
        },
        categoryKeywordBatchUpdateStatus(type,params){
            
            this.$api["categoryKeywordBatchUpdateStatus"](params).then(res => {
                if(res.code===0){
                    if(type==1){
                        this.getList1()
                        if(params.keywordStatus==='VALID_UNION'){
                            this.btnLoading.btn3 =false
                        }else if(params.keywordStatus==='INVALID_EXACT'){
                            this.btnLoading.btn4 =false
                        }
                    }else if(type==2){
                        this.getList2()
                        if(params.keywordStatus==='VALID_UNION'){
                            this.btnLoading.btn5 =false
                        }else if(params.keywordStatus==='INVALID_EXACT'){
                            this.btnLoading.btn6 =false
                        }
                    }
                }
            })
        }

        ///categoryKeywordBatchUpdateStatus
    }    
}
</script>
<style lang="less" scoped>
.box{
    // margin-left: 10px;
    .el-tabs {
      -webkit-box-shadow: 0 0 0 0;
      box-shadow: 0 0 0 0;
      /deep/.el-tabs__content {
        padding-left: 0;
        padding-right: 0;
      }

      .template-box{
        border:none;
        padding: 0;
        /deep/.screen-info,
        /deep/.el-table{
            border-left:none;
            border-right:none;
        }
        /deep/.box-update-btn{
            padding-left: 10px;
        }
        .el-pagination{
            margin-left: 10px;
        }
        .screen-info{
            .blank-rank{
                .el-checkbox{
                    margin-top: 12px;
                }
                /deep/.el-form-item__content{
                    display: flex;
                }
                .el-form-item__content{
                    .el-input{
                        width: 120px;
                        margin-left: 5px;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
    }
}
</style>
