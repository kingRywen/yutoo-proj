<template>
    <div>
        <div v-if='$route.name==="rankingChangeProductNum"'>
            <CollapseWrapper :backBtn="true">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" :rules="rules">
                    <el-form-item label="页码" prop='minPages'>
                        <el-input
                            v-model="formInline.minPages" placeholder="请输入小值" size='mini'
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='maxPages'>
                        <el-input
                            v-model="formInline.maxPages" size='mini'
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="排名" prop='minRank'>
                        <el-input
                            v-model="formInline.minRank" placeholder="请输入小值"  size='mini'
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='maxRank'>
                        <el-input
                            v-model="formInline.maxRank" placeholder="请输入小值" size='mini'
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="抓取倍率" prop='multipleFrequency'>
                        <el-input v-model="formInline.multipleFrequency" placeholder="请输入" size='mini'></el-input>
                    </el-form-item>
                    <el-form-item label="时间" prop='time'>
                        <el-date-picker
                            v-model="formInline.time"
                            type="daterange"
                            size='mini'
                            value-format='yyyy-MM-dd'
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="展示方式" prop='displayType'>
                        <el-select v-model="formInline.displayType" placeholder="请选择" size='mini' style='width:220px;' @change='selectChange'>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                            <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="tableLoading">确认搜索</el-button>
                            
                            <el-button size="small" type="primary" plain @click="resetSearch" :loading="tableLoading">重置搜索</el-button>
                    </el-form-item>
                </el-form>
            </CollapseWrapper> 
            <div v-loading="echartsLoading" >
                <div v-if='isData'>
                    <div  class="chart-body" ref="chart"> </div>
                </div>
                <NonePage :noBack='true' v-else></NonePage>
            </div>
        </div>
        <router-view v-else></router-view>

    </div>
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs';
export default {
    data() {
        let vm=this;
        //表单验证规则
        let validatePass=(rule, value, callback) => {
            let field=rule.field;
            // console.log(field);
            // console.log(value);
            if (!value && field==='multipleFrequency') {
                return callback(new Error('抓取倍率不能为空'));
            }
            if( (value && isNaN(Number(value))) || (value && Number(value)<=0) || ( value &&  !/^[1-9]\d*$/.test(value*1)) ){
                return callback(new Error('请输入大于0的整数'));
            }
            if( field==='minPages' || field==='maxPages' ){
                    // if( vm.formInline.maxPages &&  !vm.formInline.minPages && field==='minPages'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  vm.formInline.minPages &&  !vm.formInline.maxPages && field==='maxPages'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.minPages && vm.formInline.maxPages) {
                            if(  Number(vm.formInline.minPages) >= Number(vm.formInline.maxPages) ){
                                 return callback(new Error('大值需大于小值'));
                            }
                    };
            }
            
            if( field==='minRank' || field==='maxRank' ){
                    // if( vm.formInline.minRank &&  !vm.formInline.maxRank && field==='maxRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  !vm.formInline.minRank &&  vm.formInline.maxRank && field==='minRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.minRank && vm.formInline.maxRank) {
                            if(  Number(vm.formInline.minRank) >= Number(vm.formInline.maxRank) ){
                                 return callback(new Error('大值需大于小值'));
                            }
                    };
            }
            callback()
        };
        return {
            rules:{
                minPages:[
                    { validator: validatePass, trigger: ['blur','change']  }
                ],
                maxPages:[
                    { validator: validatePass, trigger: ['blur','change']  }
                ],
                minRank:[
                    { validator: validatePass, trigger: ['blur','change']  }
                ],
                maxRank:[
                    { validator: validatePass, trigger: ['blur','change']  }
                ],
                multipleFrequency:[
                    { required: true, validator: validatePass,trigger: ['blur','change'] },
                ],
            },
            pickerOptions: {
                disabledDate(time) {
                    //console.log(vm.$route.query.resultTime);
                    return   (time.getTime() < new Date(vm.$route.query.createTime).getTime() || time.getTime() > Date.now());
                }
            },
            options:[
                { value: 0,label: '按抓取频率展示'},
                { value: 1,label: '按周一到周日，每天的0-24点'},
            ],
            //搜素ode表单
            formInline:{
                minPages:null,
                maxPages:null,
                minRank:null,
                maxRank:null,
                time:[],
                multipleFrequency:1,
                displayType:0
            },

            tableLoading:false, // 按钮的loading
            chart:null,
            echartsLoading:true, // echarts的loading
            isData:true, //是否有数据

            echartsData:"",//图表数据
            xAxisData:"",//横坐标
        };
    },
    methods: {
        //确认搜索
        handleSearch(){
            this.tableLoading=true;
            this.getData()
        },
        //重置搜索
        resetSearch(){
            this.tableLoading=true;
            this.formInline.minPages=null;
            this.formInline.maxPages=null;
            this.formInline.minRank=null;
            this.formInline.maxRank=null;
            this.formInline.multipleFrequency=1;
            let time=dayjs().format('YYYY-MM-DD');
            this.formInline.time=[time,time];
            this.getData()
        },
        //展示方式选择改变
        selectChange(){
            this.getData();
        },
        //初始化echarts
        initChart() {
            if( this.chart ){
                this.chart.dispose();
                 this.chart = null;   
            }
            this.chart = echarts.init(this.$refs.chart);
            let type = this.formInline.displayType; //展示类型
            if(type){  //按周一到周日，每天的0-24点
                let legendData=['周一','周二','周三','周四','周五','周六','周日'];
                let seriesData = [];
                let xAxisData = ['0点','1点','2点','3点','4点','5点','6点','7点','8点','9点','10点','11点','12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点'];
                this.xAxisData=xAxisData;
                xAxisData.sort((a,b)=>{
                    return new Date(a).getTime() - new Date(b).getTime()
                });
                // console.log(data);
                // console.log(Xdata);
                // console.log(datas);
                // console.log(legendData);
                this.echartsData.forEach(element => {
                  //seriesData.push(element.productCnt);
                  let data=[];
                  switch ( element.week){
                      case 0:
                      element.data.forEach(i=>{
                        data.push(i.productCnt)                       
                        //console.log(i.productCnt);
                      });
                      seriesData.push(
                          {
                              name:'周日',
                              type:'line',
                              //stack: '总量',
                              data:data
                          },
                      );
                      break;

                      case 1:
                      element.data.forEach(i=>{
                        data.push(i.productCnt)                       
                        //console.log(i.productCnt);
                      });
                      seriesData.push(
                          {
                              name:'周一',
                              type:'line',
                              //stack: '总量',
                              data:data
                          },
                      );
                      break;

                      case 2:
                      element.data.forEach(i=>{
                        data.push(i.productCnt)                       
                        //console.log(i.productCnt);
                      });
                      seriesData.push(
                          {
                              name:'周二',
                              type:'line',
                              //stack: '总量',
                              data:data
                          },
                      );
                      break;

                      case 3:
                      element.data.forEach(i=>{
                        data.push(i.productCnt)                       
                        //console.log(i.productCnt);
                      });
                      seriesData.push(
                          {
                              name:'周三',
                              type:'line',
                              //stack: '总量',
                              data:data
                          },
                      );
                      break;

                      case 4:
                      element.data.forEach(i=>{
                        data.push(i.productCnt)                       
                        //console.log(i.productCnt);
                      });
                      seriesData.push(
                          {
                              name:'周四',
                              type:'line',
                              //stack: '总量',
                              data:data
                          },
                      );
                      break;

                      case 5:
                      element.data.forEach(i=>{
                        data.push(i.productCnt)                       
                        //console.log(i.productCnt);
                      });
                      seriesData.push(
                          {
                              name:'周五',
                              type:'line',
                              //stack: '总量',
                              data:data
                          },
                      );
                      break;

                      case 6:
                      element.data.forEach(i=>{
                        data.push(i.productCnt)                       
                        //console.log(i.productCnt);
                      });
                      seriesData.push(
                          {
                              name:'周六',
                              type:'line',
                              //stack: '总量',
                              data:data
                          },
                      );
                      break;

                      default:
                      break;
                  }
                });
                let vm = this
                this.chart.setOption({
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    legend: {
                        data:legendData,
                        type:'scroll'
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
                        formatter(params) {
                            return vm.$.getChartTooltip(params, param => `$${param.data}`)
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: seriesData
                });
            }else{
                let Xdata=[];//横坐标
                let datas=[];//数据
                this.xAxisData=Xdata;
                this.echartsData.forEach(i=>{
                    Xdata.push(i.sendTime);
                    datas.push(i.productCnt)
                });
                Xdata.sort((a,b)=>{
                    return new Date(a).getTime() - new Date(b).getTime()
                });
                // console.log(Xdata);
                // console.log(datas);
                let vm = this
                this.chart.setOption({
                    xAxis: {
                        type: 'category',
                        data: Xdata,
                        axisLabel: {
                            rotate: 45,
                        }
                    },
                    legend: {
                        data:['排名有变化的产品数']
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
                            //bottom:'-10%',
                            //showDetail:false
                                handleIcon:
                    "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                        },

                    ],
                    tooltip: {
                        trigger: 'axis',
                        formatter(params) {
                            return vm.$.getChartTooltip(params, param => `$${param.data}`)
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: datas,
                        name:"排名有变化的产品数",
                        type: 'line'
                    }]
                });
            }

            //点击图标进行跳转
            let self = this;
            this.chart.off('click');
            this.chart.on("click", function(params) {
                // 防止点时间
                if(params.data===undefined){
                    return
                }
                console.log(params);
                //return
                let flag = params.data;
                if (flag <= 0) {
                    return;
                }

                let startTime = null;
                let endTime = null;
                startTime = startTime =self.$route.query.createTime+' 00:00'
                endTime = params.name;
                

                let week;
                let hour;
                if(self.formInline.displayType===1){
                    startTime=self.formInline.time[0] +' 00:00';
                    endTime=self.formInline.time[1] + ' 23:59';

                    //console.log(params);
                    week=params.seriesName;
                    if(week==='周日'){
                        week=0;
                    }else if (week==='周一'){
                        week=1;
                    }else if (week==='周二'){
                        week=2;
                    }
                    else if (week==='周三'){
                        week=3;
                    }
                    else if (week==='周四'){
                        week=4;
                    }
                    else if (week==='周五'){
                        week=5;
                    }
                    else if (week==='周六'){
                        week=6;
                    }

                    hour=params.name.split('点')[0]*1;
                }
                console.log(week);
                console.log(hour);
                console.log(startTime);
                console.log(endTime);
                 //return
                let path='';
                if(self.formInline.taskFlag){  //自然
                    path='/ebayTheRankingAnalysis/ebayNaturalRanking/rankingChangeProductNum/lookDatails'
                }else{
                     path='/ebayTheRankingAnalysis/ebayAdPlacement/rankingChangeProductNum/lookDatails'
                }
                self.$router.push({
                    path: path,
                    query: {
                        taskId: self.formInline.taskId,
                        taskFlag: self.formInline.taskFlag,
                        minRank: self.formInline.minRank,
                        maxRank: self.formInline.maxRank,
                        minPages: self.formInline.minPages,
                        maxPages: self.formInline.maxPages,
                        startTime,
                        endTime,
                        week,
                        hour,
                        name:self.$route.query.name,
                        createTime:self.$route.query.createTime
                    }
                });
            });
           
        },
        getData(){
            console.log(this.$route.query);
            this.echartsLoading=true;
            let type=this.formInline.displayType;
            let path='';
            if(type){ //按周一到周日，每天的0-24点
                path='ebTaskKrFqListForProductStat';
            }else{
                path='ebTaskKrFqListForProduct';
            }
            let {minPages,maxPages,minRank,maxRank,multipleFrequency,taskId,taskFlag}=this.formInline;
            let startTime=this.formInline.time[0];
            let endTime=this.formInline.time[1];

            let datas={multipleFrequency,startTime,endTime,taskId,taskFlag};

            if(minPages){
                datas.minPages=minPages*1;
            }
            if(maxPages){
                datas.maxPages=maxPages*1;
            }
            if(minRank){
                datas.minRank=minRank*1;
            }
            if(maxRank){
                datas.maxRank=maxRank*1;
            }
            this.$api[path](datas)
            .then(data => {
                this.echartsData=data.data;
                //console.log(this.echartsData);
                this.echartsLoading=false;
                this.tableLoading=false;
                this.isData=true;
                this.$nextTick(function(){
                    this.initChart();
                });
             })
            .catch(() => {
                this.echartsLoading=false;
                this.isData=false;
                this.tableLoading=false;
            })
        }
    },
    created() {
        console.log(this.$route.query.taskFlag);
        this.formInline.taskId=this.$route.query.taskId*1;
        this.formInline.taskFlag=this.$route.query.taskFlag*1; //0-广告搜索，1-自然搜索
        let startTime=dayjs(this.$route.query.createTime).format('YYYY-MM-DD')
        let endTime=dayjs().format('YYYY-MM-DD');
        this.formInline.time=[startTime,endTime];
        this.getData();
        //console.log(this.formInline);
        //console.log(new Date(this.$route.query.resultTime).getTime());
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    watch:{
        $route(to,from){
            // console.log(to);
            // console.log(from);
            if(from.name==='rankingChangeProductNumlookDatails'){
                this.getData();
            }
        }
    }
};
</script>

<style scoped lang="scss">
.chart-body{
    height: 400px;
    width: 100%;
    display:inline-block;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 40px;

  }
</style>
