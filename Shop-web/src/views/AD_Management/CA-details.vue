<template>
    <div class="box">
        <y-template>
            <!-- <div slot="ScreenBack" class="screen-back">
                <div>筛选条件</div>
                <div class="back" @click="backPage"><i class="el-icon-back"></i>返回</div>
            </div> -->

            <el-form :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo" class='searchD'>
                <el-form-item label="ASIN:" prop="parentAsin">
                    <el-input v-model="listQuery.parentAsin" placeholder="请输入" size="mini" clearable></el-input>
                </el-form-item>
                <el-form-item label="评分等级:" prop="starLevel">
                    <el-select
                        v-model="listQuery.starLevel"
                        placeholder="请选择"
                        size="mini"
                        class="select-grade"
                        clearable>
                        <el-option :label="item.label" :value="item.value" v-for="item in gradeOptions"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="评价数等级:" prop="reviewCntLevel">
                    <el-select
                        v-model="listQuery.reviewCntLevel"
                        placeholder="请选择"
                        size="mini"
                        class="select-grade"
                        clearable>
                        <el-option :label="item.label" :value="item.value" v-for="item in gradeOptions"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格等级:" prop="priceLevel">
                    <el-select
                        v-model="listQuery.priceLevel"
                        placeholder="请选择"
                        size="mini"
                        class="select-grade"
                        clearable>
                        <el-option :label="item.label" :value="item.value" v-for="item in gradeOptions"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="修改时间:">
                    <el-date-picker
                        v-model="listQuery.daterange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="mini"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button  size="small" type="primary"  @click="distribute('确认搜索')" icon='el-icon-search' :loading='$store.state.isloading || $store.state.loading'>搜索</el-button>
                    <el-button  size="small" type="primary" plain @click="distribute('重置搜索')" :disabled="$store.state.isloading || $store.state.loading">重置搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table
                @sort-change='sortChange'
                slot="table"
                :data="list"
                v-loading="listLoading"
                :key='tableKey'
                style="width: 100%"
                border
                stripe
                @selection-change="handleSelectionChange"
                tooltip-effect="light">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                    prop="imageUrl"
                    label="主图"
                    width="80">
                    <template slot-scope="scope">
                        <el-popover placement="right" trigger="hover">
                            <img :src="scope.row.imageUrl" style="width: 300px;height: 150px;object-fit: contain;overflow: hidden;"/>
                            <div class="__img_wrapper" slot="reference">
                                <img class="loadingImg"  :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl">
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="parentAsin"
                    label="ASIN"
                    min-width="120">
                </el-table-column>
                
                <el-table-column
                    sortable="custom" 
                    prop="competingProductCnt"
                    label="竞争产品数"
                    min-width="90">
                    <template slot-scope="scope">
                        <div v-if="scope.row.competingProductCnt!==null">
                            {{scope.row.competingProductCnt}}
                        </div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="starLevel"
                    label="评分等级"
                    min-width="80"
                    :formatter="formatterStarLevel">
                </el-table-column>
                <el-table-column
                    prop="reviewCntLevel"
                    label="评价数等级"
                    min-width="90"
                    :formatter="formatterReviewCntLevel">
                </el-table-column>
                <el-table-column
                    prop="priceLevel"
                    label="价格等级"
                    min-width="80"
                    :formatter="formatterPriceLevel">
                </el-table-column>
                <el-table-column
                label="操作"
                width="55">
                    <template slot-scope="scope">
                        <!-- <el-tooltip effect="light" content="查看详情" placement="top-start"> -->
                            <el-button v-if="scope.row.taskId!==null" type="text" size="mini" icon="el-icon-search" @click="viewDetails(scope.row)"></el-button>
                        <!-- </el-tooltip> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination  slot="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </y-template>

        <yt-dialog  :options="options" :events="events" class="chart-dialog" @fullscreen='fullscreen'>
             <el-form :inline="true" :model="ruleForm" ref="ruleForm">
                <el-form-item prop="daterange" style="margin-top: 1px;"
                :rules="[
                    { required: true, message: '请设置日期', trigger: ['blur'] }
                ]">
                    <el-date-picker
                        v-model="ruleForm.daterange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="mini"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" plain size="mini" @click="searchData">查询</el-button>
                </el-form-item>
              </el-form>

              <div v-loading="chartPriceLoading" :key='chartPriceKey' class="chart-body" ref="chartPrice"  :style='{height:maxHeight}'> </div>  
              <div v-loading="chartStarLoading" :key='chartStarKey' class="chart-body" ref="chartStar"  :style='{height:maxHeight}'> </div>
              <div v-loading="chartReviewLoading" :key='chartReviewKey' class="chart-body" ref="chartReview" :style='{height:maxHeight}'> </div>  
         </yt-dialog>
        

    </div>
</template>
<script>
const _ =require('lodash')
const dayjs =require('dayjs')
import echarts from 'echarts'
// import {checkWords} from "../KeyLexicon/utils";
import YTemplate from '../Common/y-template/index'
import Navigation from '../Common/y-template/navigation'
export default {
    components:{
      YTemplate,
      Navigation
    },
    data(){
        return{
            tableKey: 0,
            list: null,
            total: null,
            listLoading: false,
            gradeOptions:[
                {label:'优',value:'1'},
                {label:'中',value:'2'},
                {label:'差',value:'3'},
                {label:'极差',value:'4'},
            ],
            listQuery:{
                pageSize: 10,
                pageNumber: 1,
                taskId:null,
                parentAsin:null,
                starLevel:null,
                reviewCntLevel:null,
                priceLevel:null,
                daterange:[],
                startTime:null,
                endTime:null
            },
            options: {
                visible: false,
                width:'1000px',
                title: '数据展示',
                okBtnText: '关闭',
                showFooter:false,
                showMaxBtn:true
            },
            events: {
                handleOkClick: () =>{
                    this.options.visible = false
                }
            },
            chartStarKey: 1,
            chartStarLoading :false,
            chartReviewKey:2,
            chartReviewLoading:false,
            chartPriceKey:3,
            chartPriceLoading:false,
            ruleForm:{
                daterange:[],
                taskId:null,
                parentAsin:null,
                startTime:null,
                endTime:null
            },

            xAxisData:[],

            chartStar:null,
            legendDataStar:[],//'评分'
            seriesStar:[],
            splitNumberStar:null,

            chartReview:null,
            legendDataReview:[],//'评价数'
            seriesReview:[],
            splitNumberReview:null,

            chartPrice:null,
            legendDataPrice:[],//'价格'
            seriesPrice:[],
            splitNumberPrice:null,
            // tooltipMap:new Map()

            maxHeight:'400px',
        }
    },
    created() {
        let query =this.$route.query
        
        this.listQuery.taskId = parseInt(query.taskId)

        // this.listQuery.startTime = query.startTime
        // this.listQuery.endTime = query.endTime
        this.getList()
    },
    beforeDestroy() {
        if (!this.chartStar) {
            return
        }
        this.chartStar.dispose()
        this.chartStar = null
    },
    methods: {
        fullscreen(){
            console.log(1);
            if(this.maxHeight==='400px'){
                this.maxHeight='700px'
                //this.options.height='800px'
            }else{
                this.maxHeight='400px'
                // this.options.height='620px'
            }
            this.$nextTick(function(){
                this.chartPrice && this.chartPrice.resize();
                this.chartStar && this.chartStar.resize();
                this.chartReview && this.chartReview.resize();
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
        distribute(btn){
            switch(btn){
                case '确认搜索':
                    this.getList()
                break;
                case '重置搜索':
                    this.resetListQueryForm()
                break;
            }
        },
        formatterStarLevel(row, column) {
            return this.formatterLevel(row.starLevel)
        },
        formatterReviewCntLevel(row, column){
            return this.formatterLevel(row.reviewCntLevel)
        },
        formatterPriceLevel(row, column){
            return this.formatterLevel(row.priceLevel)
        },
        formatterLevel(val){
            switch(val){
                case 1:
                    return '优'
                break;
                case 2:
                    return '中'
                break;
                case 3:
                    return '差'
                break;
                case 4:
                    return '极差'
                break;
                default:
                    return '-'
            }
        },
      getList() {
        
        let daterange=this.listQuery.daterange
        if(daterange!==null&&daterange.length===2){
            this.listQuery.startTime =daterange[0]
            this.listQuery.endTime =daterange[1]
        }else{
            this.listQuery.startTime =null
            this.listQuery.endTime =null
        }
        let listQuery =_.cloneDeep(this.listQuery)
        delete listQuery.daterange
        this.listLoading = true
         this.$api["adCompetitionRtList"](listQuery).then(res => {
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
      resetListQueryForm() {
        this.listQuery.daterange =[]
        this.$refs.listQueryForm.resetFields();
        this.listQuery.pageNumber=1;
        this.getList()
      },
      
      backPage(){
        this.$router.push({
            path: '/ADManagement/CompetitiveAnalysis',
        })
      },
      viewDetails(row){
          this.options.visible = true
        //   if(this.$refs['ruleForm']!==undefined){
        //      this.$refs['ruleForm'].resetFields();
        //     }
          this.ruleForm.taskId =row.taskId
          this.ruleForm.parentAsin =row.parentAsin
          const nowDate = dayjs().format('YYYY-MM-DD');// 今天
          this.ruleForm.daterange=[nowDate, nowDate]
          this.searchData()
      },
        getChart(){
            if(this.chartStar===null){
                this.$nextTick(function () {
                    this.chartStar = echarts.init(this.$refs.chartStar)
                    this.chartReview = echarts.init(this.$refs.chartReview)
                    this.chartPrice = echarts.init(this.$refs.chartPrice)
                    this.loadChart()
                })
            }else{
                 this.loadChart()
            }
        },
        loadChart(){

            if(this.seriesStar.length===0){
                this.chartStar.clear()
                let option =this.setChartNoData()
                this.chartStar.setOption(option)
            }else{
                this.chartStar.clear()
                let option =this.setChartData('评分等级',this.legendDataStar,this.xAxisData,this.seriesStar,this.splitNumberStar)
                this.chartStar.setOption(option)
            }

            if(this.seriesReview.length===0){
                this.chartReview.clear()
                let option =this.setChartNoData()
                this.chartReview.setOption(option)
            }else{
                this.chartReview.clear()
                let option =this.setChartData('评价数等级',this.legendDataReview,this.xAxisData,this.seriesReview,this.splitNumberReview)
                this.chartReview.setOption(option)
            }

            if(this.seriesPrice.length===0){
                this.chartPrice.clear()
                let option =this.setChartNoData()
                this.chartPrice.setOption(option)
            }else{
                this.chartPrice.clear()
                let option =this.setChartData('价格等级',this.legendDataPrice,this.xAxisData,this.seriesPrice,this.splitNumberPrice)
                this.chartPrice.setOption(option)
            }
           
        },
        setChartNoData(){
            return {
                    title: {
                        left: "center", // 水平居中
                        top:"center",  // 垂直居中
                        text: "暂无数据",
                        backgroundColor:"#EEEFF4",
                        textStyle:{
                            color:'#909399',
                            fontStyle:'normal',
                            fontWeight:"normal",
                            fontSize:14
                        }
                    }
                }
        },
        setChartData(title,legendData,xAxisData,series,splitNumber){
            let option ={
                    title: {
                        text: title,
                        textStyle:{
                            fontSize:12
                        }
                    },
                    tooltip: this.getTooltip(),
                    legend: {
                        data: legendData
                    },
                    grid: {
                        left: '11%',
                        right: '15%',
                        bottom: '10%',
                        containLabel: true
                    },
                    toolbox: {
                    feature: {
                        saveAsImage: {
                            show: false
                        }
                    }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData,
                        triggerEvent:true,
                        axisLabel: {
                            rotate: 25,
                        }
                    },
                    yAxis: {
                        max:4,
                        min:1,
                        splitNumber:4, // 可能要设置
                        type: "value",
                        inverse:true,// 反向从大到小
                        axisLabel:{
                            formatter: function (value) {
                                if(value==1){
                                    return '优'
                                }else if(value==2){
                                    return '中'
                                }else if(value==3){
                                    return '差'
                                }else if(value==4){
                                    return '极差'
                                }
                                return value
                            }
                        }
                    },
                    series
                }
                if(xAxisData.length>7){
                    option.dataZoom= [
                        {
                            type: "inside",
                            start: 0,
                            end: 30,
                            // minValueSpan: 0,
                            // maxValueSpan: 10
                        },
                        {
                            start: 0,
                            end: 30,
                            minValueSpan: 0,
                            maxValueSpan: 10,
                            handleIcon:
                            "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                            handleSize: "80%",
                            handleStyle: {
                            color: "#fff",
                            shadowBlur: 3,
                            shadowColor: "rgba(0, 0, 0, 0.6)",
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                            }
                        }
                    ]

                }
            return option
        },
        getTooltip(){
            // return {trigger: 'axis'} <br/>
            let tooltip ={
                trigger: 'axis'
            }
            tooltip.formatter = function(param) {
                let levelName ='优'
                let lavelVal= param[0].value
                if(lavelVal==2){
                    levelName ='中'
                }else if(lavelVal==3){
                    levelName ='差'
                }else if(lavelVal==4){
                    levelName ='极差'
                }
                if (!lavelVal) {
                    return
                }
                return (
                    `${param[0].name}<br/>${param[0].marker}${param[0].seriesName}:&nbsp;${levelName}`
                );
            };
            return tooltip
        },
        searchData(){
            if(this.$refs.ruleForm){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.getChartData()
                    }else{
                        console.log('error submit!!')
                        return false
                    }
                })
            }else{
                this.getChartData()
            }
        },
        getChartData(){
            this.chartStarLoading = true
            this.chartReviewLoading = true
            this.chartPriceLoading = true
            let daterange =this.ruleForm.daterange
            if(daterange!==null&&daterange.length===2){
                this.ruleForm.startTime =daterange[0]
                this.ruleForm.endTime =daterange[1]
            }else{
                this.ruleForm.startTime =null
                this.ruleForm.endTime =null
            }
            let ruleForm =_.cloneDeep(this.ruleForm)
            delete ruleForm.daterange
            this.$api["adCompetitionRtItemList"](ruleForm).then(res => {
                let {code,data} = res;
                 if(code===0){
                    let xAxisData =[]
                    
                    let seriesStar =[]
                    let seriesReview =[]
                    let seriesPrice =[]
                    
                    data.forEach(element => {
                        seriesStar.push(element.starLevel)
                        seriesReview.push(element.reviewCntLevel)
                        seriesPrice.push(element.priceLevel)
                        
                        xAxisData.push(element.sendTime)
                    });
                    let levelArr= _.uniq(seriesStar)
                    if(levelArr.length===1){
                        this.splitNumberStar =1
                    }else{
                        this.splitNumberStar =null
                    }
                    this.seriesStar =[
                        {
                            name:'评分',
                            type:'line',
                            smooth: true,
                            data:seriesStar
                        }
                    ]

                    levelArr= _.uniq(seriesReview)
                    if(levelArr.length===1){
                        this.splitNumberReview =1
                    }else{
                        this.splitNumberReview =null
                    }
                    this.seriesReview =[
                        {
                            name:'评价数',
                            type:'line',
                            smooth: true,
                            data:seriesReview
                        }
                    ]

                    levelArr= _.uniq(seriesPrice)
                    if(levelArr.length===1){
                        this.splitNumberPrice =1
                    }else{
                        this.splitNumberPrice =null
                    }
                    this.seriesPrice =[
                        {
                            name:'价格',
                            type:'line',
                            smooth: true,
                            data:seriesPrice
                        }
                    ]
                    this.xAxisData =xAxisData   
                    this.getChart()
                 }
                setTimeout(() => {
                    this.chartStarLoading = false
                    this.chartReviewLoading = false
                    this.chartPriceLoading = false
                }, 500)
            }).catch(() => {
                this.chartStarLoading = false
                this.chartReviewLoading = false
                this.chartPriceLoading = false
            })
        },
        routerGo(num){
            this.$router.go(num)
        }
        
        
    }
    
}
</script>

<style lang="less" scoped>
    .searchD .el-form-item{
        margin-bottom:10px;
    }
    .box{
       .template-box{
                
            .screen-info{
                .el-form-item__content{
                    .el-input{
                        width: 150px;
                    }
                    .select-grade{
                        width: 150px;
                    }
                    .el-range-editor{
                        width: 240px;
                        /deep/.el-range-separator{
                            width: 20px;
                        }
                    }
                }
                
            }
        }





       .chart-dialog{
           /deep/.el-dialog__body{
               padding-top: 5px;
                padding-bottom: 0;
            }
            .el-range-editor{
                width: 240px;
                /deep/.el-range-separator{
                    width: 20px;
                }
            }
           .chart-body{
                width: 100%;
                height: 400px;
                border:1px solid @borderColor;
                padding-top: 10px;
                padding-bottom: 10px;
                margin-top: 10px;
            }
       }
    }
</style>
<style lang="less" scoped>
//     img.loadingImg {
//         opacity: 0;
//         transition: all 0.2s ease-in-out;
//         background: #e8e8e8;
//     }
  
//   img.loadingImg[lazy=loading] {
//     /*your style here*/
//     opacity: 1;
//     background-color: #e8e8e8;
//     display: block;
//     background-image: url('~@/assets/images/loading.svg');
//     background-size: 30%;
//     background-repeat: no-repeat;
//     background-position: 50% 50%;
//     animation: rotate 2s infinite; // transition: all 0.2s ease-in-out
//   }
  
//   img.loadingImg[lazy=error] {
//     opacity: 1;
//     /*your style here*/
//     background-color: #e8e8e8;
//     display: block;
//     background-image: url('~@/assets/images/error.svg');
//     background-size: 40%;
//     background-repeat: no-repeat;
//     background-position: 50% 50%; // transition: all 0.2s ease-in-out
//   }
  
//   img[lazy=loaded] {
//     opacity: 1;
//     transition: all 0.3s ease-in-out
//   }
  
//   .__img_wrapper {
//     width: 30px;
//     height: 30px;
//     overflow: hidden;
//     margin: 0 auto;
//     background-color: #e8e8e8;
  
//     img {
//       margin: 0;
//       padding: 0;
//       width: 100%;
//       height: 100%;
//       object-fit: contain;
//     }
  
//     img[lazy=loaded] {
//       background: #fff;
//     }
//   }
</style>


