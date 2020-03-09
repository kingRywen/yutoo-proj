<template>
    <div class="box">
            <y-template>
                <!-- <div slot="ScreenBack" class="screen-back">
                    <div>筛选条件</div>
                    <div class="back" @click="backPage"><i class="el-icon-back"></i>返回</div>
                </div> -->
                <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
                    <el-form-item label="产品ASIN" prop="parentAsin">
                        <el-input v-model.trim="listQuery.parentAsin" placeholder="请输入产品ASIN" size="small" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!-- <el-button  size="small" type="primary" plain v-for="item in ['确认搜索']" @click="distribute(item)">{{item}}</el-button> -->
                         <el-button
                        size="small"
                        type="primary"
                        @click="distribute('确认搜索')"
                        icon="el-icon-search"
                        :loading="$store.state.isloading || $store.state.loading"
                        >搜索</el-button>
                        <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="distribute('重置搜索')"
                        :disabled="$store.state.isloading || $store.state.loading"
                        >重置搜索</el-button>
                    </el-form-item>
                </el-form>
                <div slot="HandleBtn">
                    <!-- ,'移动产品分类','添加产品分类' -->
                    <el-button type="primary" plain size="small" v-for="item in ['移入产品分类']" @click="distribute(item)">{{item}}</el-button>
                </div>
                <el-table
                    slot="table"
                    :data="list"
                    v-loading="listLoading"
                    :key='tableKey'
                    style="width: 100%"
                    border
                    stripe
                    @sort-change="handleSortChange"
                    @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                            label="主图"
                            width="80">
                            <template slot-scope="scope">
                                <el-popover :key="scope.row.imageUrl" placement="right" trigger="hover">
                                    <img :src="scope.row.imageUrl" style="width: 300px;height: 150px;object-fit: contain;overflow: hidden;"/>
                                    <div class="__img_wrapper" slot="reference">
                                        <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="parentAsin"
                            label="ASIN"
                            min-width="100">
							<template slot-scope="scope">				
							  <a
							    :href="scope.row.productUrl"
								:style = "!scope.row.childList ? 'color: #108ee9;': 'color: #108ee9;'"
							    target="_blink"
							  >{{scope.row.parentAsin}}</a>
							</template>
                        </el-table-column>
                        <el-table-column
                            prop="reviewCnt"
                            :sortable="'custom'"
                            label="评价数"
                            min-width="100">
                            <template slot-scope="scope">
                                <div v-if="scope.row.reviewCnt!==null">
                                    {{scope.row.reviewCnt}}
                                </div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="评分"
                            prop="starCnt"
                            :sortable="'custom'"
                            min-width="100">
                            <template slot-scope="scope">
                                <div v-if="scope.row.starCnt!==null">{{scope.row.starCnt}}</div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="BSR"
                            prop="rank"
                            :sortable="'custom'"
                            min-width="160">
                            <template slot-scope="scope">
                                <div v-if="scope.row.rank!==null">{{scope.row.rank}}</div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        
                        <el-table-column
                            label="AQ数"
                            prop="aqCnt"
                            :sortable="'custom'"
                            min-width="135">
                            <template slot-scope="scope">
                                <div v-if="scope.row.aqCnt>=0&&scope.row.aqCnt<1000">{{scope.row.aqCnt}}</div>
                                <div v-else-if="scope.row.aqCnt>=1000">{{scope.row.aqCnt}}+</div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="类目数"
                            :sortable="'custom'"
                            prop='bsrCategoryCnt'
                            min-width="135">
                            <template slot-scope="scope">
                                <div v-if="scope.row.bsrCategoryCnt != null">
                                    <el-button type="text" @click="showBsrCategoryCntDialog(scope.row.parentAsin)">{{scope.row.bsrCategoryCnt}}</el-button>
                                </div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="classifyName"
                            label="产品分类"
                            min-width="135">
                        </el-table-column>
                    </el-table>
                <el-pagination slot="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </y-template>
        

            <yt-dialog  :options="bsrOptions" :events="bsrEvents">
                <el-table
                    :data="bsrList"
                    v-loading="bsrListLoading"
                    :key='bsrTableKey'
                    style="width: 100%"
                    border
                    tooltip-effect="light"
                    stripe>
                    <el-table-column
                        prop="bsrCategory"
                        label="类目"
                        min-width="120"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="rank"
                        label="BSR"
                        width="100">
                    </el-table-column>
                </el-table>
            </yt-dialog>

            <yt-dialog  :options="options" :events="events">
                <el-form :inline="true" :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="115px" class="options-form">
                    <el-form-item label="上级分类" prop="classifyId" 
                    :rules="[
                            { required: true, message: '请选择分类', trigger: ['blur', 'change'] },
                        ]">
                        <el-cascader
                        clearable
                        :options="pParams.taskClassify1List"
                        v-model="ruleForm.classifyId"
                        change-on-select
                        size="small"
                        :props="props">
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </yt-dialog>
    </div>
    
</template>
<script>
import YTemplate from '../Common/y-template/index'
const _ =require('lodash')
export default {
    components:{
      YTemplate
    },
    props: ["pParams"],
    data(){
        return{
            tableKey: 2,
            list: null,
            total: null,
            listLoading: false,
            sortProp: null,
            listQuery:{
                pageSize: 10,
                pageNumber: 1,
                taskId:null,
                parentAsin:null,
            },
            bsrTableKey: 3,
            bsrList:null,
            bsrListLoading: false,
            defaultProps: {
                children: 'childList',
                label: 'classifyName'
            },
            bsrOptions: {
                visible: false,
                width:'500px',
                title: '类目列表',
                okBtnText: '关闭',
                showOk:false,
            },
            bsrEvents: {
                handleOkClick: () =>{
                    this.bsrOptions.visible=false
                }
            },
            parentClassifyIdOptions:[],
            props: {
                label:'classifyName',
                value: 'classifyId',
                children: 'childList'
            },
            options: {
                visible: false,
                width:'500px',
                title: '移入产品分类',
                okBtnText: '确认'
            },
            events: {
                handleOkClick: () =>{
                    this.submitForm()
                }
            },
            
            outerVisible: false,
            innerVisible: false,
            
            ruleForm:{
                taskId:null,
                parentAsins:null,
                classifyId:null,
                platformId:null,
                siteId:null,
                sellerId:null,
            },
            multipleSelection:[]
        }
    },
    created(){
        this.ruleForm.platformId=this.platformId;
        if(this.pParams.taskId!==null){
            this.listQuery.taskId =parseInt(this.pParams.taskId)
            
        }
        if (this.sellerId && this.siteId) {
                this.ruleForm.taskId=this.listQuery.taskId
                this.ruleForm.siteId =  this.siteId
                this.ruleForm.sellerId =this.sellerId
            }
        this.getList()
    },
    methods: {
        
        distribute(btn){
            switch(btn){
                case '确认搜索':
                    this.handleFilter()
                break;
                case '重置搜索':
                    this.handleFilter('resert')
                break;
                case '移入产品分类':
                    this.showDialog()
                break;
            }
        },
        getList() {
            this.listLoading = true
            let listQuery =_.cloneDeep(this.listQuery)
            if (this.sortProp) {
                let sortPropArr = this.sortProp.split(' ')
                if (sortPropArr.length === 2) {
                    listQuery.field = sortPropArr[0]
                    if (sortPropArr[1] === 'desc') {
                        listQuery.sort = 0
                    } else {
                        listQuery.sort = 1
                    }
                } else {
                    listQuery.field = null
                    listQuery.sort = 0
                }
            } else {
                listQuery.field = null
                listQuery.sort = 0
            }
            this.$api["taskReviewContentDetails"](listQuery).then(res => {
                let { rows, total } = res;
                this.list =rows
                this.total = total;
                setTimeout(() => {
                    this.listLoading = false
                }, 500)
            }).catch(() => {
                this.listLoading = false
            })
        },
      
        handleFilter(v){
            console.log('object');
            if(v){
                this.listQuery.parentAsin = null
            }   
            this.listQuery.pageNumber = 1
            this.getList()
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.listQuery.pageNumber = val
            this.getList()
        },
        handleSortChange({ column, prop, order }) {
            if (!prop) {
                this.sortProp = null
                this.handleFilter()
                return
            }
            console.log(column, prop, order)
            const sortOrder = `${prop.replace(/[A-Z]{1}/g, function(str) {
                return '_' + str.toLowerCase()
            })} ${order === 'ascending' ? 'asc' : 'desc'}`
            this.sortProp = sortOrder
            this.handleFilter()
        },
        showBsrCategoryCntDialog(parentAsin){
            this.bsrOptions.visible=true
            this.bsrListLoading =true
            
            let params ={
                taskId:this.listQuery.taskId,
                parentAsin
            }
            this.bsrList=null
            this.$api["taskReviewContentListBsrCategory"](params).then(res => {
                let { code, data } = res;
                if(code==0){
                    this.bsrList =data
                }
                
                setTimeout(() => {
                    this.bsrListLoading = false
                }, 500)
            }).catch(() => {
                this.bsrListLoading = false
            })
            
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        showDialog(){
            if(this.multipleSelection.length===0){
                this.$message.warning('至少选一项');
                return
            }
            if(this.$refs['ruleForm']!==undefined){
                this.$refs['ruleForm'].resetFields();
            }
           
            this.options.visible =true;
        },
        showCategoryDialog(){
            this.options.visible =true;
        },
        showTaskDialog(){
            this.outerVisible=true
        },
        // backPage(){
        //     this.$emit('backPage',true);
        // },
        submitForm(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let ruleForm =_.cloneDeep(this.ruleForm)
                    let parentAsins =[]
                    this.multipleSelection.forEach(element => {
                        parentAsins.push(element.parentAsin)
                    });
                    ruleForm.parentAsins =parentAsins
                    ruleForm.classifyId =_.last(ruleForm.classifyId)
                    this.$api["taskReviewContentProductSave"](ruleForm).then(res => {

                    })
                    this.options.visible =false;
                    this.getList()
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
        }
    
    },
}
</script>
<style lang="less" scoped>
.box-center{
    display: flex;
    justify-content: center;
}
.box{
    .box-body{
       .el-form-item__content{
            .el-input{
                width: 150px;
            }
            .el-select{
                width: 120px;
            }
            .el-range-editor{
                width: 220px;
                /deep/.el-range-separator{
                    width: 20px;
                }
            }
        }    
    }
    .options-form{
        .el-form-item__content{
            .el-input,
            .el-cascader{
                width: 260px;
            }
        }
    }
    .outer-visible-dialog{
        /deep/.el-dialog__title{
            color: #2c3e50;
            font-size: 16px;
        }
        .el-form-item__content{
            .el-input,
            .el-textarea{
                width: 280px;
            }
            .el-cascader{
                width: 219px;
                margin-right: 5px;
            }
        }
    
        .dialog-footer{
            display: flex;
            justify-content: center;
        }
    }
    
}
.inner-visible-dialog{
        /deep/.el-dialog__title{
            color: #2c3e50;
            font-size: 16px;
        }
        .el-form-item__content{
            .el-input,
            .el-cascader{
                width: 260px;
            }
        }
        .dialog-footer{
            display: flex;
            justify-content: center;
        }
    }
</style>
