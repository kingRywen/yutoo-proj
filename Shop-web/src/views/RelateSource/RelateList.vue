<template>
    <div class="box">
        <div class="analysis-box">
            <div class="analysis-title" style='font-size:18px;'>关联分析</div>
            <div class="analysis-form" style='margin-top:6px;'>
                <el-form :inline="true" :model="listQuery" ref="analysisForm">
                    <el-form-item prop="parentAsin"
                        :rules="[
                        { required: true, message: '请输入ASIN即刻查询对商品的历史关联产品', trigger: 'blur' },
                    ]">
                        <!-- <el-input v-model="listQuery.parentAsin" placeholder="输入ASIN即刻查询对商品的历史关联产品" size="small" clearable style='line-height:32px;'></el-input> -->
                        <el-autocomplete
                          v-model.trim="listQuery.parentAsin"
                          :fetch-suggestions="querySearchAsync"
                          placeholder="请输入ASIN"
                          size="small"
                          clearable
                          @input="handleInput"
                          style="line-height:32px;width:240px;"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" plain @click="analysis">分析</el-button></el-form-item>
                </el-form>
            </div>
        </div>
        <div class="data-box" v-if="showAnalysisBox">
            <!-- <div class="asin" v-if="listQuery.parentAsin">{{listQuery.parentAsin}}关联产品</div> -->
            <!-- <div style="font-size: 14px;margin-bottom: 3px;" v-else>&nbsp;</div> -->
            <y-template :scrollName='"condition"'>
            <!-- <div slot="ScreenTip">
                <span>筛选条件</span>
                <span></span>
            </div> -->
                <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo" :rules="secrahRules">
                  
                    <div class="input-section">
                        <el-form-item label="价格:" prop="minPrice" class="item-title">
                            <el-input v-model.trim="listQuery.minPrice" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="~" prop="maxPrice" class="input-section">
                            <el-input v-model.trim="listQuery.maxPrice" size="small" clearable></el-input>
                        </el-form-item>
                    </div>
                    <div class="input-section">
                        <el-form-item label="评分:" prop="minStarCnt" class="item-title" >
                            <el-input-number :min="1" :max="5" :precision="1" :controls="false" v-model.trim="listQuery.minStarCnt" size="small" clearable></el-input-number>
                        </el-form-item>
                        <el-form-item label="~" prop="maxStarCnt" class="input-section">
                            <el-input-number :min="1" :max="5" :precision="1" :controls="false" v-model.trim="listQuery.maxStarCnt" size="small" clearable></el-input-number>
                        </el-form-item>
                    </div>

                    <div class="input-section">
                        <el-form-item label="大类BSR:" prop="minRank" class="item-title">
                            <el-input v-model.trim="listQuery.minRank" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="~" prop="maxRank" class="input-section">
                            <el-input v-model.trim="listQuery.maxRank" size="small" clearable></el-input>
                        </el-form-item>
                    </div>
                    
                     <div class="input-section">
                        <el-form-item label="自然排名:" prop="minWebRank" class="item-title">
                            <el-input v-model.trim="listQuery.minWebRank" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="~" prop="maxWebRank" class="input-section">
                            <el-input v-model.trim="listQuery.maxWebRank" size="small" clearable></el-input>
                        </el-form-item>
                    </div>

                    <div class="input-section">
                        <el-form-item label="评价数:" prop="minReviewCnt" class="item-title">
                            <el-input v-model.trim="listQuery.minReviewCnt" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="~" prop="maxReviewCnt" class="input-section">
                            <el-input v-model.trim="listQuery.maxReviewCnt" size="small" clearable></el-input>
                        </el-form-item>
                    </div>

                    <el-form-item label="位置:" prop="position" class="item-title" label-width="40px">
                        <el-select v-model="listQuery.position" placeholder="请选择" size="small" clearable>
                            <el-option
                            v-for="item in positionOptions"
                            :key="item.taskId"
                            :label="item.position"
                            :value="item.position">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <div class="input-section">
                        <el-form-item label="上架时间:" prop="daterange">
                            <el-date-picker
                                v-model="listQuery.daterange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change='handleFilter'
                                size="small"
                                style='width:264px;'
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <!-- <el-input v-model="listQuery.minReleaseDate" size="small" clearable></el-input> -->
                        </el-form-item>
                        <!-- <el-form-item label="~" prop="maxReleaseDate" class="input-section">
                            <el-input v-model="listQuery.maxReleaseDate" size="small" clearable></el-input>
                        </el-form-item> -->
                    </div>

                    <el-form-item label="类目:" prop="category" class="item-title">
                        <el-select v-model="listQuery.category" placeholder="请选择" size="small" clearable style='width:264px;'>
                            <el-option
                            v-for="item in categoryOptions"
                            :key="item.category"
                            :label="item.category"
                            :value="item.category">
                            </el-option>
                        </el-select>
                        <!-- <el-cate :Cate.sync="listQuery.category" width="100%" :HaveChildform.sync="category.haveChildren" :CategoryId.sync="category.categoryId" platformId="1"></el-cate> -->
                    <!-- <el-cate :Cate.sync="listQuery.category" width="100%" :HaveChildform.sync="category.haveChildren" :CategoryId.sync="category.categoryId" platformId="1"></el-cate> -->

                    </el-form-item>
                
                    <el-form-item>
                        <!-- ,'重置搜索' -->
                        <!-- <el-button  size="small" type="primary" :loading="listLoading" plain v-for="item in ['确认搜索','重置搜索']" @click="distribute(item)">{{item}}</el-button> -->
                        <el-button size="small" type="primary" @click="distribute('确认搜索')" icon="el-icon-search" :loading="$store.state.isloading || $store.state.loading">搜索</el-button>
                        <el-button size="small" type="primary" plain @click="distribute('重置搜索')" :disabled='$store.state.isloading || $store.state.loading'>重置搜索</el-button>
                    </el-form-item>
                </el-form>
                <div slot='HandleBtn'><ElButton size="small" type="primary" style='width:70px;' :loading="exportLoading" @click='exportBtn'>导出</ElButton></div>
                <el-table
                    slot="table"
                    :data="list"
                    v-loading="listLoading"
                    :key='tableKey'
                    style="width: 100%"
                    border
                    stripe
                    tooltip-effect="light"
                    @sort-change="handleSortChange"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                        prop="relateAsin"
                        label="产品ASIN"
                        min-width="120">
                        <template slot-scope="scope">
                            <i v-if="scope.row.sublevels&&!scope.row.childShow" class="el-icon-caret-right common_font_color __pointer" 
                                @click="list_listShowChildCate(scope)"
                                style='position:absolute;left:0;top:18px;'
                            ></i>
                            <i v-if="scope.row.sublevels&&scope.row.childShow" class="el-icon-caret-bottom common_font_color __pointer" 
                                @click="list_listHiddenChildCate(scope)"
                                style='position:absolute;left:0;top:18px;'
                            ></i>
                            <a :href="scope.row.productUrl" target="_blink" style='color:rgb(16, 142, 233);margin-left:8px;'>{{scope.row.relateAsin}}</a>
                        </template>   
                    </el-table-column>
					<el-table-column
					    prop="asin"
					    label="关联ASIN"
					    min-width="120">
						<template slot-scope="scope">
						    <a :href="scope.row.relateProductUrl" target="_blink" style='color:rgb(16, 142, 233);'>{{scope.row.asin}}</a>
						</template>
					</el-table-column>
                    <el-table-column
                        label="主图"
                        width="80">
                        <template slot-scope="scope">
                            <el-popover placement="right" trigger="hover">
                                <div  slot="reference">
                                    <img  style='display:blockl;width:30px;object-fit: contain;' v-lazy="scope.row.imageUrl">
                                </div>
                                <img  v-lazy="scope.row.imageUrl" style="display:block;width:200px;object-fit: contain;"/>
                            </el-popover>
                        </template>
                    </el-table-column>
                   
                    <!-- show-overflow-tooltip -->
                    <el-table-column
                        prop="bestPosition"
                        label="位置"
                        width="200"
                        >
                        <template slot-scope="scope">
                            <el-tooltip placement="top" effect="light" style="width:100%" v-if="scope.row.positions">
                                <div slot="content">
                                    {{scope.row.bestPosition}}
                                    </div>
                                <div style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;">
                                    <div v-if="scope.row.positions.length>0&&scope.row.bestPosition">
                                        <el-button type="text" @click="showPositionsDialog(scope.row)">({{scope.row.positions.length}})</el-button>
                                        {{textMethod(scope.row.bestPosition)}}
                                    </div>
                                    <div v-else-if="scope.row.positions.length<=0&&scope.row.bestPosition">
                                        {{textMethod(scope.row.bestPosition)}}
                                    </div>
                                </div>
                            </el-tooltip>
                            <div v-else>--</div>
                        </template>
                        <!-- <template slot-scope="scope">
                            <div v-if="scope.row.positions.length>0&&scope.row.bestPosition">
                                <el-button type="text" @click="showPositionsDialog(scope.row)">({{scope.row.positions.length}})</el-button>
                                {{scope.row.bestPosition}}
                            </div>
                            <div v-else-if="scope.row.positions.length<=0&&scope.row.bestPosition">
                                {{scope.row.bestPosition}}
                            </div>
                            <div v-else>-</div>
                        </template> -->
                    </el-table-column>
                    <el-table-column
                        prop="bestWebRank"
                        label="位置自然排名"
                        :sortable="'custom'"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        label="页码排名"
                        :sortable="'custom'"
                        prop="bestWebPagesRank"
                        min-width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.row.bestWebRankPages&&!scope.row.bestWebPagesRank">
                                第{{scope.row.bestWebRankPages}}页
                            </div>
                            <div v-if="!scope.row.bestWebRankPages&&scope.row.bestWebPagesRank">
                                第{{scope.row.bestWebPagesRank}}名
                            </div>
                            <div v-if="scope.row.bestWebRankPages&&scope.row.bestWebPagesRank">
                                第{{scope.row.bestWebRankPages}}页第{{scope.row.bestWebPagesRank}}名
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="大类BSR排名"
                        :sortable="'custom'"
                        prop="rank"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="releaseDate"
                        label="上架时间"
                        :sortable="'custom'"
                        width="135">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="价格"
                        :sortable="'custom'"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="starCnt"
                        label="评分"
                        :sortable="'custom'"
                        min-width="110">
                        <template slot-scope="scope">
                            <span v-if='scope.row.starCnt!==null'>{{ scope.row.starCnt%1===0 ? scope.row.starCnt+'.0':scope.row.starCnt }}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="reviewCnt"
                        label="评价数"
                        :sortable="'custom'"
                        min-width="90">
                    </el-table-column>
                    <el-table-column
                        prop="category" 
                        label="所属类目"
                        show-overflow-tooltip
                        width="300">
						<template slot-scope="scope">

                            <div class="fix__row_1" v-if="scope.row.category === '' || scope.row.category == null">{{scope.row.category
                                ||'-'}}</div>
                            <el-tooltip v-if="scope.row.categoryUrl" placement="top" :content="scope.row.category" effect="light">
                                <!-- todo -->
                                <a class="fix__row_1 common_color" v-if="scope.row.categoryUrl&&scope.row.categoryUrl!==null&&scope.row.categoryUrl!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.categoryUrl&&scope.row.categoryUrl!==null&&scope.row.categoryUrl!==''?scope.row.categoryUrl:false" style="text-decoration:none;">
                                <span style='color:#409eff'>{{formatCateDepth(scope.row.category)}}</span>
                                </a>
                                <div v-else class="fix__row_1" style='color:#409eff'>
                                {{formatCateDepth(scope.row.category)}}
                                </div>
                            </el-tooltip>
                            <el-tooltip v-if="!scope.row.categoryUrl" placement="top" :content="scope.row.category" effect="light">
                                <div class="fix__row_1" style='color:#409eff'>
                                {{formatCateDepth(scope.row.category)}}
                                </div>
                            </el-tooltip>
                            <a v-if="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?scope.row.url:false" style="text-decoration:none;">
                                <i v-if="table.show.Handle.link" class="iconfont icon-Group-"></i>
                            </a>
                           
						</template>
                    </el-table-column>
                </el-table>
                <el-pagination  slot="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </y-template>
        
        
        </div>
        <yt-dialog  :options="positionsOptions" :events="positionsEvents">
             <el-table
                    :data="positionsList"
                    style="width: 100%"
                    border
                    stripe>
                    <el-table-column
                        prop="position"
                        label="位置"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="webRank"
                        label="位置自然排名"
                        min-width="95">
                    </el-table-column>
                    <el-table-column
                        label="页码排名"
                        min-width="75">
                        <template slot-scope="scope">
                            <div v-if="scope.row.webRankPages&&scope.row.webPagesRank">
                                第{{scope.row.webRankPages}}页第{{scope.row.webPagesRank}}名
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
             </el-table>
        </yt-dialog>
        <!-- <div class="no-data" v-show="!showAnalysisBox" v-loading="noDataListLoading" :key='noDataTableKey'>{{noData}}</div> -->
    </div>
</template>
<script>
const _ =require('lodash');
import YTemplate from '../Common/y-template/index';
import Navigation from '../Common/y-template/navigation';
import {downloadFile} from '../../utils/tools'
export default {
    components:{
      YTemplate,
      Navigation
    },
    data(){
        var minStarCntRlues = (rule, value, cb) => {
            let type=rule.field;
            if(value >= this.listQuery.maxStarCnt) {
               return  cb(new Error('大于最大值'))
            }
            cb()
            
        };
        let maxStarCntRlues = (rule, value, cb) => {
            if(value <= this.listQuery.minStarCnt) {
               return cb(new Error('小于最小值'))
            }
            cb()
        }
        return{
            exportLoading: false,
            analysisQuery:{
                parentAsin:null
            },
            positionOptions:[],
            categoryOptions:[],
            tableKey: 0,
            list: null,
            total: null,
            listLoading: false,
            sortProp:null,
            listQuery:{
                pageSize: 10,
                pageNumber: 1,
                parentAsin:null,
                taskId:null,
                field:null,
                sort:0,

                position:null,
                minWebRank:null,
                maxWebRank:null,
                minRank:null,
                maxRank:null,
                daterange:[],

                minReleaseDate:null,
                maxReleaseDate:null,
                minPrice:null,
                maxPrice:null,
                minReviewCnt:null,
                maxReviewCnt:null,
                minStarCnt:undefined,
                maxStarCnt:undefined,
                
                category:null,
                haveChildren:null, // 无用
                categoryId:null, // 无用

            },
            // noData:null,
            // noDataTableKey: 1,
            // noDataListLoading: false,
            showAnalysisBox:false,
            positionsList:null,
            
            positionsOptions: {
                visible: false,
                width:'600px',
                title: '位置排名',
                okBtnText: '关 闭',
				showFooter:false
            },
            positionsEvents: {
                handleOkClick: () =>{
                    this.positionsOptions.visible =false
                }
            },
            btnLoading1:false,


            secrahRules:{  //搜索表单验证规则
                minStarCnt: [
                    { validator: minStarCntRlues, trigger: 'change' }
                ],
                maxStarCnt: [
                    { validator: maxStarCntRlues, trigger: ['blur','change'] }
                ],
            }
        }
    },
    created() {
        let query =this.$route.query
        
        this.listQuery.taskId = parseInt(query.taskId)
        this.listQuery.category = query.category

        // this.listQuery.startTime = query.startTime
        // this.listQuery.endTime = query.endTime
        // this.getList()
        this.getSelectList()

    },

    methods: {
      handleInput(val) {
          const lastB = Array.from(document.querySelectorAll('.el-breadcrumb__inner.is-link')).pop()
          if (val == null || val === '') {
            lastB.innerHTML = `分析关联`
          } else {
            lastB.innerHTML = `分析关联 - ${val}关联产品`
          }
      },
      querySearchAsync(queryString, cb) {
        if (queryString == null) {
          queryString = ''
        }
        queryString = queryString.trim()
        // if (queryString == null) {
        //   cb([])
        //   return
        // }
        if (queryString === '') {
          cb([])
          return
        }
        if (queryString.length < 2) {
          cb([])
          return
        }
        let params = {
          taskId: this.$route.query.taskId,
          asin: queryString,
          category: this.$route.query.category
        }
        this.$api[`taskRelateSourceListRelateSourceToAsin`](params)
        .then(data => {
          cb(data.data.map(el => ({value: el})))
        }).catch(() => {})
      },
        //导出
            exportBtn(){
               //this.downloadFile('taskRelateSourceListRelateSourceByAsinExport')
                //console.log(this.multipleSelection);
                if(!this.multipleSelection) this.multipleSelection=[];

                let asins=this.multipleSelection.map(i=>{
                    return i.asin
                });
                let params=this.listQuery;
                if(asins.length){
                    params.relateAsins=asins;
                }
                this.exportLoading = true
                this.$api['taskRelateSourceListRelateSourceByAsinExport'](params)
                .then(data => {
                  this.exportLoading = false
                    downloadFile(data,'关联产品详情');
                }).catch(() => {})
            },
        // 显示表格子类目
        list_listShowChildCate(scope) {
            //console.log('scope.row.productKeywordVerifyVOList');
            let index = scope.$index;
            let child = scope.row.sublevels;
            //console.log(child);
            let item = this.list[index];
            item.childShow = true;
            //this.list.splice(index, 1, item);
            if (child) {
                // console.log(index);
                // console.log(child);
                this.list.splice(index +1, 0, ...child);
            }
        },
        //收起列表
        list_listHiddenChildCate(scope){
            let index = scope.$index;
            let item = this.list[index];
            item.childShow = false;
            //this.list.splice(index, 1, item);
            let count=scope.row.sublevels.length;
            if (count && count>=1) {
                this.list.splice(index +1, count);
            }
        },
        distribute(btn){
            switch(btn){
                case '确认搜索':
                    // console.log(this.listQuery);
                    this.handleFilter()
                break;
                case '重置搜索':
                    this.resetListQueryForm()
                break;
            }
        },
        getSelectList(){
            let params ={
                taskId:this.listQuery.taskId,
                // parentAsin:'非必须 父ASIN(待定)'
            }
            this.$api["taskRelateSourceListRelateSourcePosition"](params).then(res => {
                let {code,data} =res
                if(code==0){
                    this.positionOptions =data
                }
            }).catch(err => {
                console.log(err)
                this.positionOptions =[]
            })

            this.$api["taskRelateSourceListCategoryByTask"](params).then(res => {
                let {code,data} =res
                if(code==0){
                    let categoryOptions =data
                    if(categoryOptions.length>0){
                        categoryOptions.unshift({category:"全部",taskId:0})
                    }
                    this.categoryOptions =categoryOptions
                }
            }).catch(err => {
                console.log(err)
                this.categoryOptions =[]
            })
        },
        getList() {

            this.listLoading = true
            this.showAnalysisBox =true
            if (this.sortProp) {
                let sortPropArr = this.sortProp.split(' ')
                if (sortPropArr.length === 2) {
                    this.listQuery.field = sortPropArr[0]
                    if (sortPropArr[1] === 'desc') {
                        this.listQuery.sort = 0
                    } else {
                        this.listQuery.sort = 1
                    }
                } else {
                    this.listQuery.field = null
                    this.listQuery.sort = 0
                }
            } else {
                this.listQuery.field = null
                this.listQuery.sort = 0
            }

            let daterange =this.listQuery.daterange;
            // this.listQuery.minReleaseDate=this.listQuery.daterange[0];
            // this.listQuery.maxReleaseDate=this.listQuery.daterange[1];
            if(daterange!==null&&daterange.length===2){
                this.listQuery.minReleaseDate =daterange[0]
                this.listQuery.maxReleaseDate =daterange[1]
                // console.log(this.listQuery.minReleaseDate);
                // console.log(this.listQuery.maxReleaseDate);
            }else{
                this.listQuery.minReleaseDate =null
                this.listQuery.maxReleaseDate =null
            }
        
            let listQuery =_.cloneDeep(this.listQuery)
            if(listQuery.category=='全部'||listQuery.category==''){
                listQuery.category =null
            }
            if(listQuery.position==''){
                listQuery.position =null
            }
         

            Object.keys(listQuery).forEach(element => {
                if(listQuery[element]==''){
                    listQuery[element]=null
                }
                let query =listQuery[element]
                if(query!==null){
                    let str =element.substring(0,3);
                    if(str==='min'||str==='max'){
                        if(element!=='maxReleaseDate'&&element!=='minReleaseDate'){
                              listQuery[element]=Number(listQuery[element])
                        }
                    }
                }
            });

            if( !this.listQuery.parentAsin ){
                 this.listLoading = false
                return
            }
            this.$api["taskRelateSourceListRelateSourceByAsin"](listQuery).then(res => {
                    let { rows, total } = res;
                    console.log('----------------------------------');
                    console.log(res);
                    this.list =rows
                    this.total = total;
                    // if(flag){
                    //     if(rows.length>0){
                            
                    //         this.noData =null
                    //     }else{
                    //         this.showAnalysisBox =true
                    //         // this.showAnalysisBox =false
                    //         // this.noDataListLoading =true
                    //         // setTimeout(() => {
                    //         //     this.noDataListLoading = false
                    //         // }, 500)
                    //         // this.noData ='暂无数据'
                            
                    //     }
                    // }
                    this.btnLoading1 =false
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
            }).catch(() => {
                this.listLoading = false
                this.btnLoading1 =false
            })
        },
        analysis(){
            this.$refs['analysisForm'].validate((valid) => {
            if (valid) {
                this.btnLoading1 =true
                this.listQuery.pageNumber = 1
                this.getList()
            } else {
                console.log('error submit!!');
                // this.showAnalysisBox =false
                // this.noData =null
                // return false;
            }
            });
        },
        handleFilter(){
            this.listQuery.pageNumber = 1;
			if (this.listQuery.parentAsin) {
				this.$refs.listQueryForm.validate((valid) => {
				   
				    if (valid) {
				        this.getList();
				    } 
				});
			}else{
				this.$message.warning('请先输入ASIN')
			}
            
          
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.listQuery.pageNumber = val
            this.getList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
        resetListQueryForm() {
            this.listQuery.daterange =[]
            this.$refs.listQueryForm.resetFields();
            this.listQuery.pageNumber = 1;
			if (this.listQuery.parentAsin) {
				this.$refs.listQueryForm.validate((valid) => {
				   
				    if (valid) {
				        this.getList();
				    } 
				});
			}else{
				this.$message.warning('请先输入ASIN')
			}
            //this.getList()
        },
        showPositionsDialog(row){
            this.positionsList =row.positions
            this.positionsOptions.visible =true
        },
        viewDetails(row){
            if(row.taskId===null){
                this.$message.warning('taskId为空');
                return
            }
            this.$router.push({
                    path: '/taskRelateSource/RelateList',
                    query: {
                        taskId:row.taskId,
                    }
            })
        },
        routerGo(num){
            this.$router.go(num)
        },
		formatCateDepth(data){
			let category  = data
			if(category.length>50){
				let newArr = category.split(':')
				var newStr = ''
				return newStr = `${newArr[0]}...${newArr.pop()}`
			}else{
				return category
			}
		},
		textMethod(e){
			return e.length>24?e.substring(0,24)+'...':e
		}
    }
}
</script>
<style lang="less" scoped>
.box{
    .analysis-box{
        .analysis-title,
        .analysis-form{
            display: flex;
            justify-content: center;
        }
        .analysis-title{
            font-size: 14px;
        }
        .analysis-form{
            .el-input{
                width: 300px;
            }
        }
    }
    .data-box{
        .asin{
            font-size: 14px;
            padding-left: 5px;
            border-left:3px solid #30cc7b; 
            margin-bottom: 3px;
        }
        .template-box{
            .screen-info{
                .el-form{
                    display: flex;
                    flex-flow:row wrap;
                    .input-section{
                        .el-input{
                            width: 80px;
                        }
                    }
                    .item-title{
                        /deep/.el-form-item__label{
                            //width: 80px;
                        }
                    }
                    .el-select{
                        width: 190px;
                        
                    }
                }
            }
        }
    }
    .no-data{
        font-size:14px;
        color:#909399;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;
    }
}
</style>
