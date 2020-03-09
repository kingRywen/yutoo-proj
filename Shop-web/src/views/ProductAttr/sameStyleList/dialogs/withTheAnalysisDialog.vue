<template>
<!-- 同款分析 -->
    <div>
        <!--  -->
        <yt-table 
            :treeTable="treeTable" 
            :stripe="!treeTable" 
            :treeTableOtions="treeTableOtions" 
            v-loading="tableLoading" 
            border 
            :selection='selection'
            :data="tableList" 
            :columns="columns">
        </yt-table>
        <!-- 爆款新增评价数 -->
        <div class='rating-number'>
            <div class='top'>
                <div>爆款新增评价数</div>
                <div>
                    <span style='margin-right:6px;'>时间范围:</span>
                    <el-date-picker
                        style='margin-right:12px;'
                        v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        size='mini'
                        :unlink-panels='true'
                        @change='dateChange'
                        value-format='yyyy-MM-dd'
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    <span style='margin-right:6px;'>统计周期:</span>
                     <el-select v-model="period" placeholder="请选择统计周期" size='mini' @change='periodChange'>
                        <el-option
                        v-for="item in periodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class='echart-box' v-if='isData'>
                <div v-loading="echartsLoading"  class="chart-body" ref="chart" :style='{height:maxHeight}'> </div>
            </div>
            <div v-else style='line-height:400px;text-align:center;'>暂无数据</div>
        </div>

        <div class='bsr'>
           <el-row :gutter="24">
               <el-col :span="12">
                   <!-- 爆款BSR区间 -->
                   <div style='background-color: #f6f6f6;line-height:40px;padding-left:20px;'>爆款BSR区间</div>
                    <yt-table 
                        :treeTable="treeTable" 
                        :stripe="!treeTable" 
                        :treeTableOtions="treeTableOtions" 
                        v-loading="bsrtableLoading" 
                        border 
                        :selection='selection'
                        :data="hotBsrTableList" 
                        :columns="hotBsrColumns">
                    </yt-table>
               </el-col>
               <el-col :span="12">  
                    <!--  衰款BSR区间 -->
                    <div style='background-color: #f6f6f6;line-height:40px;padding-left:20px;'>衰款BSR区间 </div>
                    <yt-table 
                        :treeTable="treeTable" 
                        :stripe="!treeTable" 
                        :treeTableOtions="treeTableOtions" 
                        v-loading="bsrtableLoading" 
                        border 
                        :selection='selection'
                        :data="declineBsrTableList" 
                        :columns="declineBsrColumns">
                    </yt-table>
               </el-col>
            </el-row>
        </div>
      
    </div>
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs';
export default {
    props:['params'],
    data() {
        return {
            period:1,//统计周期
            periodOptions:[
                {label:'日',value:1},
                {label:'周',value:7},
                {label:'月',value:30},
            ],
            //表格
            selection:false,//是否展示勾选
            treeTable:false,
            treeTableOtions:{},
            tableLoading:false,
            tableList:[],
            columns:[
                {
                    label: "款式",
                    value: "popularFlag",
                    minWidth: 150,
                    render(h,scope){
                        return(
                            <span>{scope.row.popularFlag===0?"衰款 ":"爆款"}</span>
                        )
                    }
                },
                {
                    label: "数量",
                    value: "quantity",
                    minWidth: 150
                },
                {
                    label: "占比",
                    value: "proportion",
                    minWidth: 150,
                    render(h,scope){
                        return(
                            <span>{scope.row.proportion*1000/10+"%"}</span>
                        )
                    }
                },
            ],

            //echarts
            dateRange:[],//选择日期范围
            echartsLoading:false,
            echartsData:"",//echarts数据
            isData:true,

            //爆款bsr
            hotBsrTableList:[],
            hotBsrColumns:[
                {
                    label: "区间",
                    value: "interval",
                    minWidth: 150
                },
                {
                    label: "数量",
                    value: "quantity",
                    minWidth: 150
                },
                {
                    label: "平均上架天数",
                    value: "avgReleaseDays",
                    minWidth: 150
                },
            ],
            //衰款bsr
            declineBsrTableList:[],
            declineBsrColumns:[
                {
                    label: "区间",
                    value: "interval",
                    minWidth: 150
                },
                {
                    label: "数量",
                    value: "quantity",
                    minWidth: 150
                },
                {
                    label: "平均上架天数",
                    value: "avgReleaseDays",
                    minWidth: 150
                },
            ],
            bsrtableLoading:false,

             maxHeight:'400px',

        };
    },
    methods: {
        //获取爆款衰款数量占比
            getQuantityRatio(){
                this.tableLoading=true;
                this.$api['taskSelAttrListsameProductAttr'](this.params)
                .then(data => {
                    //console.log(data);
                    if(data.code===0){
                        this.tableList=data.data;
                        this.tableLoading=false;
                    }
                }).catch(() => {
                    this.tableLoading=false;
                })
            },
        //日期选择改变
            dateChange(v){
                
                if(!v){
                    this.dateRange=[dayjs(Date.now()-180*24*3600*1000).format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')];
                };
                this.getEvaluationData();
            },
        //统计周期选择改变
            periodChange(v){
                if(!v){
                    this.$message.warning('请选择统计周期');
                    return;
                };
                this.getEvaluationData();
            },
        echratsResize(){
            //console.log(1);
            if(this.maxHeight==='400px'){
                this.maxHeight='700px'
            }else{
                this.maxHeight='400px'
            };
            this.$nextTick(function(){
                this.chart && this.chart.resize();
            })
        },
        //获取爆款新增评价数
            getEvaluationData(){

                this.echartsLoading=true;
                this.isData=true;

                if(this.chart){
                    this.chart.dispose();
                };
                let datas=this.params;
                datas.startTime=this.dateRange[0] 
                datas.endTime=this.dateRange[1] 
                datas.period=this.period;
                this.$api['taskSelAttrListReviewPopular'](datas)
                .then(data => {
                    if(data.code===0){
                        this.echartsData=data.data;
                        //console.log(this.echartsData);
                        this.echartsLoading=false;
                        this.isData=true;

                        this.initChart();
                    }
                }).catch(err=>{
                    this.echartsLoading=false;
                    this.isData=false;
                })
            },
        //初始化echarts
            initChart() {
                this.chart = echarts.init(this.$refs.chart);
                let Xdata=[];//横坐标
                let datas=[];//数据
                this.echartsData.forEach(i=>{
                    Xdata.push(i.statTime);
                    datas.push(i.cnt)
                });
                Xdata.sort((a,b)=>{
                    return new Date(a).getTime() - new Date(b).getTime()
                });
                this.chart.setOption({
                    xAxis: {
                        type: 'category',
                        data: Xdata
                    },
                    legend: {
                        data:['爆款']
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: datas,
                        name:"爆款",
                        type: 'line'
                    }]
                })
            },

        //获取爆款BSR区间
            getBsr(){
                this.bsrtableLoading=true;
                this.$api['taskSelAttrlistBsrInterval'](this.params)
                .then(data => {
                    console.log(data);
                    if(data.code===0){
                        this.hotBsrTableList=data.data.popularInterval;
                        this.declineBsrTableList=data.data.unpopularInterval;
                        // console.log(this.hotBsrTableList);
                        // console.log(this.declineBsrTableList);
                        this.bsrtableLoading=false;
                    }
                }).catch(err=>{
                    this.bsrtableLoading=false;
                })
            }

    },
    created() {

        this.dateRange=[dayjs(Date.now()-180*24*3600*1000).format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')];

        this.getQuantityRatio();
        this.getEvaluationData();
        this.getBsr();
    },
    beforeDestroy(){
        if(this.chart){
            this.chart.dispose();
            this.chart=null;
        };
    }
};
</script>

<style scoped lang="less">

.bsr{
    /deep/.el-table__empty-block{
    min-height:40px;
}
}
.rating-number{
    margin-top: 30px;
    .top{
        background-color: #f6f6f6;
        overflow: hidden;
        line-height: 40px;
        &>div{
            &:first-child{
                float: left;
                margin-left: 20px;
                font-size: 16px;
            }
            &:last-child{
                float: right;
                margin-right: 20px;
            }
        }
    }
}
.echart-box{
    padding-top: 30px;
}
.chart-body {
    height: 400px;
    width: 100%;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 10px;
}
.bsr {
    margin-top: 30px;
    padding-bottom: 30px;
    &/deep/.el-table--mini {
      margin-top: 0px !important;
  }
}
</style>
