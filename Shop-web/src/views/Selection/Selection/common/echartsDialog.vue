<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="时间范围:">
                 <el-date-picker
                    v-model="formInline.rangeTime"
                    type="daterange"
                    size='mini'
                     @change='dateChange'
                    value-format='yyyy-MM-dd'
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="统计周期:">
                <el-select v-model="formInline.period" placeholder="请选择" size='mini' @change='Selectchange'>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div v-if='isData'>
            <div v-loading="echartsLoading"  class="chart-body" ref="chart" :style='{height:maxHeight}'> </div>
        </div>
        <div v-else style='line-height:400px;text-align:center;'> 暂无数据</div>
         <!-- {{params}} -->
    </div>
   
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs';
export default {
    props:['params'],
    data() {
        return {
            echartsLoading:false,
            options:[
                {value:1,label:"日"},
                {value:7,label:"周"},
                {value:30,label:"月"},
            ],
            formInline:{
                rangeTime:null,
                period:1,
                taskId:null,
                sellerId:null,
                startTime:null,
                endTime:null,
                parentAsin:null,
            },
            pickerOptions:{
                // disabledDate:(time)=> {
                //     return ( 
                //         time.getTime() > Date.now() ||   time.getTime() < (new Date(this.params.resultTime).getTime()-24*60*60*1000)
                //     )
                // },
            },
            echartsData:null,
            isData:true,
            chart:null,

             maxHeight:'400px',
        };
    },
    methods: {
        //选择时间范围改变
        dateChange(v){
            this.formInline.startTime=v[0];
            this.formInline.endTime=v[1];
            this.getData();
        },
        //选择日月周改变
        Selectchange(v){
            this.formInline.period=v;
            this.getData();
        },  
        echratsResize(){
            //console.log(1);
            if(this.maxHeight==='400px'){
                this.maxHeight='700px'
            }else{
                this.maxHeight='400px'
            }
            this.$nextTick(function(){
                this.chart && this.chart.resize();
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
            setTimeout(() => {
                this.chart.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    // 启动或关闭
                    dataZoomSelectActive: true
                });
            });
            let vm = this
            this.chart.setOption({
                xAxis: {
                    type: 'category',
                    data: Xdata,
                    axisLabel: {
                        rotate: 45,
                    }
                },
                toolbox:{
                    top: '-50px',
                    feature: {
                        dataZoom:{
                        yAxisIndex:"none"   //不启用y轴的选中
                        }
                    }
                },
                legend: {
                    data:['评价数']
                },
                tooltip: {
                    trigger: 'axis',
                    formatter(params) {
                        return vm.$.getChartTooltip(params, param => `${param.data}`)
                    }
                },
                // 布局
                grid: {
                    left: "6%",
                    right: "8%",
                    bottom: "11%", // 防止 dataZoom 重叠
                    containLabel: true
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        //showDetail:false
                            handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                    },

                ],
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: datas,
                    name:"评价数",
                    type: 'line'
                }]
            })
        },
        getData(){
            this.echartsLoading=true;
            this.isData=true;
            if(this.chart){
                this.chart.dispose();
            }
            this.$api[this.params.url](this.formInline)
            .then(data => {
                if(data.code===0){
                    this.echartsLoading=false;
                    this.echartsData=data.data;
                    this.initChart();
                    if(this.echartsData.length===0){
                        this.isData=false;
                    }
                    //console.log(this.echartsData);
                }
            }).catch(() => {
                   this.echartsLoading=false;
                    this.isData=false;
            })
        }
    },
    created() {
        let time=dayjs().format('YYYY-MM-DD');//获取当前时间
        this.formInline.startTime=dayjs(Date.now()-180*24*60*60*1000).format('YYYY-MM-DD'); 
        this.formInline.endTime=time;
        this.formInline.rangeTime=[this.formInline.startTime,time];
        this.formInline.taskId=this.params.taskId;///任务id
        this.formInline.sellerId=this.params.sellerId;//卖家id
        this.formInline.parentAsin=this.params.parentAsin;//产品趋势分析需要的父ASIN
        this.getData();
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
};
</script>

<style scoped lang="scss">
.chart-body {
    height: 400px;
    width: 100%;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>
