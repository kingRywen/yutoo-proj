<template>
    <div class="products-box">
        <y-template>
                <!-- <div slot="ScreenTip">
                    <span>筛选条件</span>
                    <span></span>
                </div> -->
                <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
                    <el-form-item label="产品ASIN" prop="parentAsin">
                        <el-input v-model.trim="listQuery.parentAsin" placeholder="请输入" size="small" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!-- <el-button  size="small" type="primary" plain v-for="item in ['确认搜索','重置搜索']" @click="distribute(item)">{{item}}</el-button> -->
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
                    <el-button type="primary" plain size="small" v-for="(item,index) in editBtns" @click="distribute(item.name,index)" :loading="item.loading">{{item.name}}</el-button>
                </div>
                <el-table
                    slot="table"
                    :data="list"
                    v-loading="listLoading"
                    :key='tableKey'
                    style="width: 100%"
                    border
                    @sort-change='sortChange'
                    stripe
                    @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                            label="主图"
                            width="80">
                            <template slot-scope="scope">
                                <el-popover placement="right" trigger="hover">
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
                            label="评价数"
                            sortable="custom" 
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
                            prop='starCnt'
                            sortable="custom" 
                            min-width="100">
                            <template slot-scope="scope">
                                <div v-if="scope.row.starCnt!==null">{{scope.row.starCnt}}</div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="BSR"
                            prop='rank'
                            sortable="custom" 
                            min-width="160">
                            <template slot-scope="scope">
                                <div v-if="scope.row.rank!==null">{{scope.row.rank}}</div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        
                        <el-table-column
                            label="AQ数"
                            sortable="custom" 
                            prop='aqCnt'
                            min-width="135">
                            <template slot-scope="scope">
                                <div v-if="scope.row.aqCnt>=0&&scope.row.aqCnt<1000">{{scope.row.aqCnt}}</div>
                                <div v-else-if="scope.row.aqCnt>=1000">{{scope.row.aqCnt}}+</div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="类目数"
                            sortable="custom" 
                            prop='bsrCategoryCnt'
                            min-width="135">
                            <template slot-scope="scope">
                                <div v-if="scope.row.bsrCategoryCnt != null">
                                    <el-button type="text" @click="showBsrCategoryCntDialog({parentAsin:scope.row.parentAsin,rcpId:scope.row.rcpId})">{{scope.row.bsrCategoryCnt}}</el-button>
                                </div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                    </el-table>
                <el-pagination slot="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </y-template>

            <yt-dialog  :options="options" :events="events">
                <el-form :inline="true" :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="115px" class="options-form">
                    <el-form-item label="上级分类" prop="classifyId" 
                    :rules="[
                            { required: true, message: '请选择分类', trigger: ['blur', 'change'] },
                        ]">
                        <el-cascader
                        clearable
                        :options="pParams.taskClassify1List[0].childList"
                        v-model="ruleForm.classifyId"
                        change-on-select
                        size="small"
                        :props="props">
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </yt-dialog>
            <yt-dialog  :options="bsrOptions" :events="bsrEvents" >
                <el-table
                    :data="bsrList"
                    v-loading="bsrListLoading"
                    :key='bsrTableKey'
                    @sort-change='bsrCategorysortChange'
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
                        sortable="custom" 
                        label="BSR"
                        width="100">
                    </el-table-column>
                </el-table>
            </yt-dialog>

    </div>
</template>
<script>
import YTemplate from '../Common/y-template/index'
import {downloadFile} from 'Utils/tools';
const _ =require('lodash')
export default {
    components:{
      YTemplate
    },
    props: ["pParams"],
    data(){
        return{
            editBtns:[{name:'移动产品分类',loaging:false},{name:'删除',loading:false},{name:'导出',loading:false}],
            tableKey: 0,
            list: null,
            btnLoading: false,
            total: null,
            listLoading: false,
            listQuery:{
                pageSize: 10,
                pageNumber: 1,
                classifyId:null,
                platformId:'',
                siteId:null,
                sellerId:null,
                parentAsin:null,
                
            },
            bsrTableKey: 3,
            bsrList:null,
            bsrListLoading: false,
            defaultProps: {
                children: 'childList',
                label: 'classifyName'
            },
            options: {
                visible: false,
                width:'500px',
                title: '移动分类',
                okBtnText: '确认'
            },
            events: {
                handleOkClick: () =>{
                    this.submitForm()
                }
            },
            props: {
                label:'classifyName',
                value: 'classifyId',
                children: 'childList'
            },
            ruleForm:{
                classifyId:null,
            },
            multipleSelection:[],
            bsrOptions: {
                visible: false,
                width:'500px',
                title: '类目列表',
                showOk: false,
                showCancel:false
            },
            bsrEvents: {
                handleOkClick: () =>{
                    this.bsrOptions.visible=false
                }
            },

            showBsrCategoryCntparentAsin:"",
            showBsrCategoryCntrcpId:"",
        }
    },
    watch: {
        'pParams.classifyId'(val){
            if(val!==null){
                this.listQuery.classifyId =val
                this.listQuery.siteId =this.pParams.siteId
                this.listQuery.sellerId =this.pParams.sellerId
                this.getList()
            }else{
                this.listLoading = true
                this.list=null
                this.total=null
                 setTimeout(() => {
                    this.listLoading = false
                }, 500)
            }
        }
    },
    created(){
        this.listQuery.platformId=this.platformId;
    },
    methods:{
        exportFile(index) {
            this.editBtns[index].loading = true;
            const {classifyId,platformId,siteId,sellerId,parentAsin} = this.listQuery
            let rcpIds = this.multipleSelection.map(el => el.rcpId)
            let params = {classifyId,platformId,siteId,sellerId,parentAsin, rcpIds}
            this.btnLoading = true
             this.$api[`taskReviewContentProductProductExport`](params)
            .then(data => {
                this.btnLoading = false;
                this.editBtns[index].loading = false;
                downloadFile(data)
            }).catch(() => {
                this.btnLoading = false
                 this.editBtns[index].loading = false;
            })
        },
        //tabl表格排序改变
            sortChange(column, prop, order){
                let tit=column.prop; //排序的字段名
                let sort=column.order;//排序顺序
                // console.log(tit);
                // console.log(sort);
                let v=this.sortableFunc(column, tit, sort );
                this.listQuery.sortField=v.sortField;
                this.listQuery.sort=v.sort;
                this.listQuery.pageNumber=1;
                this.getList();
            },
        //table排序参数处理
            sortableFunc(column, pro, order ){
                let prop = pro.replace(/[A-Z]/g, function (match) {
                    return '_' + match.toLowerCase()
                })
                return {
                    sort: order === 'ascending' ? 1 : 0,
                    sortField: prop
                }
            },
        bsrCategorysortChange(column, prop, order){
            let tit=column.prop; //排序的字段名
            let sort=column.order;//排序顺序
            // console.log(tit);
            // console.log(sort);
            let v=this.sortableFunc(column, tit, sort );
         
            this.showBsrCategoryCntDialog({sortField:v.sortField,sort:v.sort,parentAsin:this.showBsrCategoryCntparentAsin,rcpId:this.showBsrCategoryCntrcpId})

        },
        parentHandleclick(parentAsin){
            this.listQuery.parentAsin =parentAsin
            this.handleFilter()
        },
        distribute(btn,index){
            switch(btn){
                case '确认搜索':
                    this.handleFilter()
                break;
				case '重置搜索':
					this.listQuery.parentAsin = null
				    this.handleFilter()
				break;
                case '导出':
                    this.exportFile(index)
                break;
                case '移动产品分类':
                   this.showDialog()
                break;
                case '删除':
                   this.deleteRows(null,index)
                break;
                
            }
        },
        
        getList() {
            this.listLoading = true
            this.$api["taskReviewContentProductList"](this.listQuery).then(res => {
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
        handleFilter(){
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        submitForm(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let ruleForm =_.cloneDeep(this.ruleForm)
                    let rcpIds =[]
                    this.multipleSelection.forEach(element => {
                        rcpIds.push(element.rcpId)
                    });
                    ruleForm.rcpIds =rcpIds
                    ruleForm.classifyId =_.last(ruleForm.classifyId)
                    this.$api["taskReviewContentProductUpdateClassifyId"](ruleForm).then(res => {
                        let {code} =res
                        if(code===0){
                            this.getList()
                        }
                    })
                    this.options.visible =false;
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        showBsrCategoryCntDialog({parentAsin,rcpId,sortField,sort}){

            this.showBsrCategoryCntparentAsin=parentAsin;
            this.showBsrCategoryCntrcpId=rcpId;

            this.bsrOptions.visible=true
            this.bsrListLoading =true
            
            let params ={
                rcpId,
                parentAsin,
                sortField,
                sort
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
        deleteRows(row,index){
            if(this.multipleSelection.length===0){
                this.$message.warning('至少选一项');
                return
            };
            this.editBtns[index].loading = true;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let rcpIds =[]
                this.multipleSelection.forEach(element => {
                    rcpIds.push(element.rcpId)
                });
                this.$api["taskReviewContentProductRemove"]({rcpIds}).then(res => {
                    let { code } = res;
                    if(code==0){
                        this.editBtns[index].loading = false;
                        this.handleFilter()
                    }
                }).catch(err=>{
                     this.editBtns[index].loading = false;
                })
            }).catch(() => {
                 this.editBtns[index].loading = false;
            });
            

        },
        restList(){
            this.listQuery.parentAsin =null
            this.handleFilter()
        }
        
    }
    
}
</script>
<style lang="less" scoped>
.products-box{
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
    }
    .options-form{
        .el-form-item__content{
            .el-input,
            .el-cascader{
                width: 260px;
            }
        }
    }
}
</style>
