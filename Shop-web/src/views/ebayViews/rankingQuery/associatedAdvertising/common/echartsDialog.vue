<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="时间范围:">
                 <el-date-picker
                    v-model="formInline.rangeTime"
                    type="daterange"
                    size='mini'
                    :clearable='false'
                     @change='dateChange'
                    value-format='yyyy-MM-dd'
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="位置:">
                <el-select v-model="formInline.period" placeholder="请选择" size='mini' @change='Selectchange' style='width:300px;' multiple collapse-tags>
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
            <div v-loading="echartsLoading"  class="chart-body" ref="chart"> </div>
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
               
            ],
            formInline:{
                rangeTime:null,
                period:[],
                taskId:null,
                sellerId:null,
                startTime:null,
                endTime:null,
                parentAsin:null,
            },
            pickerOptions:{
                disabledDate:(time)=> {
                    return ( 
                        time.getTime() > Date.now() ||   time.getTime() < (new Date(this.params.resultTime).getTime()-24*60*60*1000)
                    )
                },
            },
            echartsData:null,
            isData:true,

            oldSeclect:null,
        };
    },
    methods: {
        //选择时间范围改变
        dateChange(v){
            this.formInline.startTime=v[0];
            this.formInline.endTime=v[1];
            this.getData();
        },
        //选择位置改变
        Selectchange(v){
            // console.log('vvvvvvvvvvvvvvv');
            //  console.log(v);
             if(this.oldSeclect.includes(0) && !v.includes(0)){ //原来有全部,现在没有 , 把选择数据的情清空
                this.formInline.period=[];
                this.oldSeclect= this.formInline.period;
             }else if( !this.oldSeclect.includes(0) && v.includes(0)){ //原来没有全部 , 现在有 , 全部选择
                this.formInline.period=[];
                this.options.forEach(item=>{
                    this.formInline.period.push(item.value);
                });
                this.oldSeclect= this.formInline.period;  //将选择的保存起来

             }else if( v.length<this.options.length && v.includes(0)){ //现在有全部,但是没全选 , 全部选择
                this.formInline.period=[];
                v.forEach(item=>{
                     if(item!==0){
                        this.formInline.period.push(item);
                     }
                });
                this.oldSeclect= this.formInline.period;
             }else if((v.length===this.options.length-1) && !v.includes(0)){  //刚好全部选完 ,并且没选全部 ,全部选择
                this.formInline.period=[];
                this.options.forEach(item=>{
                    this.formInline.period.push(item.value);
                });
                this.oldSeclect= this.formInline.period;
             }
            //  console.log('objectobjectobjectobjectobjectobjectobject');
            //  console.log(this.formInline.period);

            let datas=[]; //要展示的数据
            //console.log(v);
            this.formInline.period.forEach(i=>{
                this.echartsData.forEach(j=>{
                    if(i===j.position){
                       datas.push(j) 
                    }
                })
            });
             this.initChart(datas);

        },  
        //初始化echarts
        initChart(data) {
            if(this.chart){
                this.chart.dispose();
                this.chart = null;
            }
            if( !data.length){
                return
            }
            this.chart = echarts.init(this.$refs.chart);
            let Xdata=[];//横坐标
            let datas=[];//数据
            let legendData=[];//标题数组
            data[0].list.forEach(i=>{
                Xdata.push(i.sendTime);
            });
            data.forEach(i=>{
                legendData.push(i.position);
                i.list.sort((a,b)=>{
                    return a.webRank -b.webRank
                });
                let list=i.list.map(j=>{
                    return j.webRank
                })
                datas.push(
                    {
                        name:i.position,
                        type:'line',
                        stack: '总量',
                        data:list,
                    },
                )
            });
            // Xdata.sort((a,b)=>{
            //     return new Date(a).getTime() - new Date(b).getTime()
            // });
            // console.log(data);
            // console.log(Xdata);
            // console.log(datas);
            // console.log(legendData);

            this.chart.setOption({
                xAxis: {
                    type: 'category',
                    data: Xdata
                },
                legend: {
                    data:legendData,
                    type:'scroll'
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
                tooltip: {
                    trigger: 'axis',
                    formatter:(params, ticket, callback) =>{
                        params = params.filter(
                            el =>
                                !(
                                el.data == 0 ||
                                el.data === '' ||
                                el.data == null ||
                                isNaN(el.data)
                                )
                            )
                            if (!params.length) {
                            return
                            }
                        //console.log(params);
                        let str=''
                        params.forEach(i=>{
                            let seriesIndex=i.seriesIndex; //第几条数据
                            let dataIndex=i.dataIndex;//数据里面的第几条
                            str+=i.seriesName+" : "+'第'+data[seriesIndex].list[dataIndex].webRankPages+"页 第"+data[seriesIndex].list[dataIndex].webPagesRank+'名'+'<br />'
                        })
                       //params
                        return str;
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: datas
            });
           
        },
        getData(){
            //console.log('object');
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

                    this.options.push({ label:"全部",value:0})
                    this.formInline.period.push(0)
                    this.echartsData.forEach((i,index)=>{
                        this.options.push({
                            label:i.position,value:i.position
                        });
                        this.formInline.period.push(i.position)
                    });
                    this.oldSeclect= this.formInline.period;

                    this.initChart(this.echartsData);

                    if(this.echartsData.length===0){
                        this.isData=false;
                    }
                   
                }
            })
        }
    },
    created() {
        let time=dayjs().format('YYYY-MM-DD');//获取当前时间
        this.formInline.startTime=time; 
        this.formInline.endTime=time;
        this.formInline.rangeTime=[time,time];
        this.formInline.taskId=this.params.taskId;///任务id
        // this.formInline.sellerId=this.params.sellerId;//卖家id
        // this.formInline.parentAsin=this.params.parentAsin;//产品趋势分析需要的父ASIN
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
