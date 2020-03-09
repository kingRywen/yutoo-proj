<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" :rules='rules' ref='formInline'>
            <el-form-item label="时间范围:">
                 <el-date-picker
                    v-model="formInline.rangeTime"
                    type="daterange"
                    size='small'
                    :clearable='false'
                     @change='dateChange'
                    value-format='yyyy-MM-dd'
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="倍率展示:" 
                prop='multipleFrequency'
            >
                <el-input-number
                    style="width:100%"
                    v-model='formInline.multipleFrequency'
                    size='small'
                    placeholder="请输入"
                ></el-input-number>
            </el-form-item>
            <el-form-item label=" " label-width="30px">
                 <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="tableLoading">确认搜索</el-button>
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
        let vm=this;
          let validatePass=(rule, value, callback) => {
            let field=rule.field;
            // console.log(field);
            // console.log(value);
            if (!value && field==='multipleFrequency') {
                return callback(new Error('请输入大于0的整数'));
            };
            if( (value && isNaN(Number(value))) || (value && Number(value)<=0) || ( value &&  !/^[1-9]\d*$/.test(value*1)) ){
                return callback(new Error('请输入大于0的整数'));
            };
            callback();
        };
        return {
            echartsLoading:false,
            formInline:{
                rangeTime:null,
                taskId:null,
                startTime:null,
                endTime:null,
                parentAsin:null,
                multipleFrequency:1,
                taskFlag:null,
            },
            pickerOptions:{
                disabledDate:(time)=> {
                    //console.log(vm.params.resultTime);
                    return ( 
                        time.getTime() > Date.now() ||   time.getTime() < (new Date(vm.params.resultTime.split(' ')[0]).getTime()-24*60*60*1000)
                    )
                },
            },
            echartsData:null,
            isData:true,

            timer:'',
            tableLoading:false,

            rules:{
                multipleFrequency:[
                    { required: true, validator: validatePass,trigger: ['blur','change'] },
                ],
            }
        };
    },
    methods: {
        //选择时间范围改变
        dateChange(v){
            this.formInline.startTime=v[0];
            this.formInline.endTime=v[1];
        },
        //确认搜索
        handleSearch(){
            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    this.getData();
                }
            });
        },  
        //初始化echarts
        initChart(index) {
            this.chart = echarts.init(this.$refs.chart);
            let Xdata=[];//横坐标
            let datas=[];//数据
            let location=index || 0;
            this.echartsData.forEach(i=>{
                Xdata.push(i.sendTime);
                datas.push(i.webRank)
            });
            Xdata.sort((a,b)=>{
                return new Date(a).getTime() - new Date(b).getTime()
            });
            this.chart.setOption({
                xAxis: {
                    type: 'category',
                    data: Xdata,
                    axisLabel: {
                            rotate: 45,
                        }
                },
                legend: {
                    data:['排名']
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
                tooltip: {
                    trigger: 'axis',
                    formatter:(params, ticket, callback) =>{
                        let index=params[0].dataIndex;
                        //console.log(params);
                        let str='第'+this.echartsData[index].webRankPages+"页第"+this.echartsData[index].webPagesRank+"名";
                        return str;
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: datas,
                    name:"排名",
                    type: 'line'
                }]
            });
        },
        getData(){
            //console.log('object');
            this.echartsLoading=true;
            this.isData=true;
            this.tableLoading=true;
            if(this.chart){
                this.chart.dispose();
            };
            this.$api[this.params.url](this.formInline)
            .then(data => {
                if(data.code===0){
                    this.echartsLoading=false;
                    this.tableLoading=false;
                    this.echartsData=data.data;

                    this.initChart();
                    if(this.echartsData.length===0){
                        this.isData=false;
                    };
                    //console.log(this.echartsData);
                }
            }).catch(() => {
                   this.echartsLoading=false;
                   this.tableLoading=false;
            })
        }
    },
    created() {
        //console.log(this.params.resultTime);
        let time=dayjs().format('YYYY-MM-DD');//获取当前时间
        this.formInline.startTime=time; 
        this.formInline.endTime=time;
        this.formInline.rangeTime=[time,time];
        this.formInline.parentAsin=this.params.parentAsin;
        this.formInline.taskFlag=this.params.taskFlag;
        this.formInline.taskId=this.params.taskId;
       
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
