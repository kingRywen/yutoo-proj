<template>
    <div>
        <CollapseWrapper :backBtn="true">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" ref='formInline' :rules='rules'>
                <el-form-item label="产品">
                    <el-select v-model="formInline.parentAsins" filterable placeholder="请选择" clearable multiple size='mini' collapse-tags @change='Selectchange'>
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        size='mini'
                        :clearable ='false'
                        unlink-panels
                        value-format='yyyy-MM-dd'
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="统计方式">
                    <el-select v-model="type"  placeholder="请选择"  size='mini' @change='selectTypeChange'>
                        <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="统计周期" prop='frequency'>
                    <el-input v-model="formInline.frequency" placeholder="请输入数字" size='mini'></el-input>
                </el-form-item>
                <el-form-item label="分钟">
                </el-form-item> -->
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="tableLoading">确认搜索</el-button>
                    <el-button size="small" type="primary" plain @click="resetSearch" :loading="tableLoading">重置搜索</el-button>
                </el-form-item>
            </el-form>
        </CollapseWrapper> 
        <!--销量报表-->
        <div style='border:1px solid #dcdcdc;margin-top:16px;'>
            <div style='line-height:40px;background-color:#f9f9f9;border-bottom:1px solid #dcdcdc;'>
                <span style='margin-left:10px;'>销量报表</span> 
            </div>
            <div v-loading="echartsLoading">
                <div>
                    <div v-if='isData'>
                        <div  class="chart-body" ref="lineEchart"> </div>
                    </div>
                    <NonePage :noBack='true' v-else></NonePage>
                </div>
                <yt-table
                    :data="tableDatas"
                    border
                    :columns="columns"
                    :selection='false'
                    v-if='tableShow'
                    ref="table"
                    >
                </yt-table>
            </div>
        </div>
        <!--销量占比-->
        <div style='border:1px solid #dcdcdc;margin-top:16px;' >
            <div style='line-height:40px;background-color:#f9f9f9;border-bottom:1px solid #dcdcdc;'>
                <span style='margin-left:10px;'>销量占比</span> 
            </div>
            <div v-loading="echartsLoading2" style='display:flex;justify-content:space-between;'>
                <div style='width:40%;'>
                    <div v-if='isData2'>
                        <div  class="chart-body" ref="lineEchart2"> </div>
                    </div>
                    <NonePage :noBack='true' v-else></NonePage>
                </div>
                <div style='width:50%;'>
                    <div v-if='isData3'>
                        <div  class="chart-body" ref="lineEchart3"> </div>
                    </div>
                    <NonePage :noBack='true' v-else></NonePage>
                </div>
            </div>
        </div>
        <!-- 底部表格 -->
        <div style='margin-top:16px;' v-loading="echartsLoading">
            <yt-table
                :data="listBuyer"
                border
                :columns="listBuyerColumns"
                :selection='false'
                ref="table"
                >
            </yt-table>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import echarts from "echarts";
import _ from 'lodash';
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            console.log(value);
            if (isNaN(Number(value))) {
               return  callback(new Error('请输入数字'));
            } 
            callback();
            
        };
        return {
            tableLoading:false, //搜索按钮的loading
            options:[],  
            typeOptions:[
                {label:"周一到周日",value:0},
                {label:"周一到周日(0~24点)",value:1},
                {label:"0~24点",value:2},
            ],
            formInline:{
                parentAsins:[],//产品
            },
            oldSeclect:[],
            type:0,//统计方式
            timeRange:[],//时间
            pickerOptions: {
                shortcuts: [{
                    text: '近7天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近15天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近1个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '近1年',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                    picker.$emit('pick', [start, end]);
                    }
                }
                ]
            },
            rules:{
                frequency: [{validator: validatePass, trigger: ['blur','change']}] 
            },

        
            bigTableList:[],//保存所有列表的数据
            //销量报表
            echartsLoading:false,
            columns:[],//表格列表
            tableList:[],//带处理的公共的数据
            tableDatas:[],//表格数据
            isData:true,//是否有数据
            lineEchart:null,
            tableShow:true,//table是否显示

            //销量占比
            echartsLoading2:false,
            isData2:true,
            isData3:true,
            lineEchart2:null,//饼图
            lineEchart3:null,//柱状图

            listBuyer:[],//底部表格数据
            listBuyerColumns:[
                {
                    label: "买家星级区间",
                    value: "buyerScore",
                    minWidth: 150,
                },
                {
                    label: "数量",
                    value: "orderCnt",
                    minWidth: 150,
                    sortable:true
                },
                {
                    label: "占比",
                    value: "proportion",
                    minWidth: 150,
                    sortable:true,
                    render(h,scope){
                        return(
                            <span>{scope.row.proportion===null ? '-': Math.ceil(scope.row.proportion*10000)/100+'%'}</span>
                        )
                    }
                },
            ]
        };
    },
    methods: {
        //确认搜索
        handleSearch(){
            this.getData(this.type)
        },
        //重置搜素
        resetSearch(){
            this.formInline.parentAsins=[];
            this.options.forEach(i=>{
                this.formInline.parentAsins.push(i.value);
            }); 
            this.oldSeclect=this.formInline.parentAsins;
            let time=dayjs().format('YYYY-MM-DD');
            this.timeRange=[time,time];
             this.getData(0)
        },
        //选择产品改变
        Selectchange(v){
            // console.log('vvvvvvvvvvvvvvv');
            //  console.log(v);
             if(this.oldSeclect.includes(0) && !v.includes(0)){ //原来有全部,现在没有 , 把选择数据的情清空
                this.formInline.parentAsins=[];
                this.oldSeclect= this.formInline.parentAsins;
             }else if( !this.oldSeclect.includes(0) && v.includes(0)){ //原来没有全部 , 现在有 , 全部选择
                this.formInline.parentAsins=[];
                this.options.forEach(item=>{
                    this.formInline.parentAsins.push(item.value);
                });
                this.oldSeclect= this.formInline.parentAsins;  //将选择的保存起来

             }else if( v.length<this.options.length && v.includes(0)){ //现在有全部,但是没全选 , 全部选择
                this.formInline.parentAsins=[];
                v.forEach(item=>{
                     if(item!==0){
                        this.formInline.parentAsins.push(item);
                     }
                });
                this.oldSeclect= this.formInline.parentAsins;
             }else if((v.length===this.options.length-1) && !v.includes(0)){  //刚好全部选完 ,并且没选全部 ,全部选择
                this.formInline.parentAsins=[];
                this.options.forEach(item=>{
                    this.formInline.parentAsins.push(item.value);
                });
                this.oldSeclect= this.formInline.parentAsins;
             }
        },
        //统计方式选择改变
        selectTypeChange(v){
            if (this.lineEchart) {
                this.lineEchart.dispose();
                this.lineEchart = null;
            }
            this.isData=true;
            this.lineEchart=echarts.init(this.$refs.lineEchart);
            this.tableShow=false;
            setTimeout(()=>{
                 this.tableShow=true;
                 switch(v){ 
                    case 0:   //按周一到周日
                        this.getWeek()
                    break;

                    case 1:  //周一到周日（0~24点)
                        this.getWeekHour();
                        this.getweekHourTable();
                    break;

                    case 2:  //0~24点
                        this.getHour();
                    break;

                    default:
                    break;
                }
            });
            console.log(this.bigTableList);
            //console.log(this.tableList);
        },
        //销量报表按周一到周日echarts图表和表格的处理
        getWeek(){
            let vm = this
            this.tableList=this.bigTableList.listTotal1;
            this.tableDatas=this.bigTableList.listTotal1;
            if(!this.tableList.length){
                this.isData=false;
                return;
            }
            //图表的
            let weekOptions={
                xAxis: {
                    type: 'category',
                    data: null,
                    // axisLabel: {
                    //     rotate: 45,
                    // }
                },
                legend: {
                    data:['订单数']
                },
                // 布局
                grid: {
                    left: "6%",
                    right: "8%",
                    bottom: "11%", // 防止 dataZoom 重叠
                    containLabel: true
                },
                // dataZoom: [
                //     {
                //         type: 'slider',
                //         show: true,
                //         //bottom:'-10%',
                //         //showDetail:false
                //             handleIcon:
                // "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                //     },

                // ],
                tooltip: {
                    trigger: 'axis',
                    formatter(params) {
                        return vm.$.getChartTooltip(params)
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: null,
                    name:"订单数",
                    type: 'line'
                }]
            };
            let Xdata=[];//横坐标
            let datas=[];//数据
            this.tableList.forEach(i=>{
                Xdata.push(i.statTime);
                datas.push(i.orderCnt)
            });
            Xdata.sort((a,b)=>{
                return new Date(a).getTime() - new Date(b).getTime()
            });
            // console.log(Xdata);
            // console.log(datas);
            weekOptions.xAxis.data=Xdata;
            weekOptions.series[0].data=datas;
            this.lineEchart.setOption(weekOptions);

            //表格的
            this.columns=[
                {
                    label: "中国时间",
                    value: "statTime",
                    minWidth: 150,
                },
                {
                    label: "订单数",
                    value: "orderCnt",
                    minWidth: 150,
                    sortable:true,
                },
                {
                    label: "占比",
                    value: "proportion",
                    minWidth: 150,
                    sortable:true,
                    render(h,scope){
                        return(
                            <span>{scope.row.proportion===null ? '-': Math.ceil(scope.row.proportion*10000)/100+'%'}</span>
                        )
                    }
                },
            ]
        },
        //销量报表按周一到周日的(0~24点)的echarts的图表的处理
        getWeekHour(){
            this.tableList=this.bigTableList.listTotal2;
            if(!this.tableList.length){
                this.isData=false;
                return;
            }
            let legendData=['周一','周二','周三','周四','周五','周六','周日'];
            let seriesData = [];
            let xAxisData = ['0点','1点','2点','3点','4点','5点','6点','7点','8点','9点','10点','11点','12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点'];
            this.tableList.sort((a,b)=>{
                return a.statTime.split('-')[1]*1 -  b.statTime.split('-')[1]*1
            });
            //数据处理 .从周一到周天的数据
            let datas={
                week1:[],
                week2:[],
                week3:[],
                week4:[],
                week5:[],
                week6:[],
                week7:[],
            };
            this.tableList.forEach(i=>{
                i.list.forEach(j=>{
                    if(j.statTime==="周一"){
                        datas.week1.push(j);
                    }
                    if(j.statTime==="周二"){
                        datas.week2.push(j);
                    } 
                    if(j.statTime==="周三"){
                        datas.week3.push(j);
                    }
                    if(j.statTime==="周四"){
                        datas.week4.push(j);
                    }
                    if(j.statTime==="周五"){
                        datas.week5.push(j);
                    }
                    if(j.statTime==="周六"){
                        datas.week6.push(j);
                    }
                    if(j.statTime==="周天"){
                        datas.week7.push(j);
                    }
                })
            });
            for (let k in datas){
                let arr=[];
                switch(k){
                    case 'week1':
                        datas[k].forEach(h=>{
                            arr.push(h.orderCnt)
                        });
                        seriesData.push({
                            name:'周一',
                            type:'line',
                            //stack: '总量',
                            data:arr
                        });
                    break;
                    case 'week2':
                        datas[k].forEach(h=>{
                            arr.push(h.orderCnt)
                        });
                        seriesData.push({
                            name:'周二',
                            type:'line',
                            //stack: '总量',
                            data:arr
                        });
                    break;
                    case 'week3':
                        datas[k].forEach(h=>{
                            arr.push(h.orderCnt)
                        });
                        seriesData.push({
                            name:'周三',
                            type:'line',
                            //stack: '总量',
                            data:arr
                        });
                    break;
                    case 'week4':
                        datas[k].forEach(h=>{
                            arr.push(h.orderCnt)
                        });
                        seriesData.push({
                            name:'周四',
                            type:'line',
                            //stack: '总量',
                            data:arr
                        });
                    break;
                    case 'week5':
                        datas[k].forEach(h=>{
                            arr.push(h.orderCnt)
                        });
                        seriesData.push({
                            name:'周五',
                            type:'line',
                            //stack: '总量',
                            data:arr
                        });
                    break;
                    case 'week6':
                        datas[k].forEach(h=>{
                            arr.push(h.orderCnt)
                        });
                        seriesData.push({
                            name:'周六',
                            type:'line',
                            //stack: '总量',
                            data:arr
                        });
                    break;
                    case 'week7':
                        datas[k].forEach(h=>{
                            arr.push(h.orderCnt)
                        });
                        seriesData.push({
                            name:'周日',
                            type:'line',
                            //stack: '总量',
                            data:arr
                        });
                    break;
                }
            }
            let vm = this
            //console.log(seriesData);
            this.lineEchart.setOption({
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
                // dataZoom: [
                //     {
                //         type: 'slider',
                //         show: true,
                //         //showDetail:false
                //             handleIcon:
                // "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                //     },

                // ],
                tooltip: {
                    trigger: 'axis',
                    formatter(params) {
                        return vm.$.getChartTooltip(params)
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: seriesData
            });
        },
        //销量报表按周一到周日的(0~24点)的表格的处理
        getweekHourTable(){
            let datas=[];
            this.tableList.forEach(i=>{
                let arr={};
                arr['statTime']=i.statTime+'点';
                i.list.forEach(j=>{
                    switch (j.statTime){
                        case '周一' :
                            arr['week1Num']=j.orderCnt;
                            arr['week1Proportion']= (j.proportion || j.proportion===0 )? Math.ceil(j.proportion*10000)/100+'%':'-';
                        break;
                        case '周二' :
                            arr['week2Num']=j.orderCnt;
                            arr['week2Proportion']=(j.proportion || j.proportion===0 ) ? Math.ceil(j.proportion*10000)/100+'%':'-';
                        break;
                        case '周三' :
                            arr['week3Num']=j.orderCnt;
                            arr['week3Proportion']=(j.proportion || j.proportion===0 )? Math.ceil(j.proportion*10000)/100+'%':'-';
                        break;
                        case '周四' :
                            arr['week4Num']=j.orderCnt;
                            arr['week4Proportion']=(j.proportion || j.proportion===0 )? Math.ceil(j.proportion*10000)/100+'%':'-';
                        break;
                        case '周五' :
                            arr['week5Num']=j.orderCnt;
                            arr['week5Proportion']=(j.proportion || j.proportion===0 )? Math.ceil(j.proportion*10000)/100+'%':'-';
                        break;
                        case '周六' :
                            arr['week6Num']=j.orderCnt;
                            arr['week6Proportion']=(j.proportion || j.proportion===0 ) ? Math.ceil(j.proportion*10000)/100+'%':'-';
                        break;
                        case "周日" :
                            arr['week7Num']=j.orderCnt;
                            arr['week7Proportion']=(j.proportion || j.proportion===0 ) ? Math.ceil(j.proportion*10000)/100+'%':'-';
                        break;

                        default:
                        break;
                    }
                });
                datas.push(arr)
            });
            //console.log(datas);
            this.tableDatas=datas;
            this.columns=[
                {
                    label: "中国时间",
                    value: "statTime",
                    minWidth: 150,
                },
                {
                    label: "周一",
                    minWidth: 150,
                    merge:[
                        {
                            label: "订单数",
                            value: "week1Num",
                            minWidth: 150,
                            sortable:true,
                        },
                        {
                            label: "占比",
                            value: "week1Proportion",
                            minWidth: 150,
                            sortable:true,
                        }
                    ]
                },
                  {
                    label: "周二",
                    minWidth: 150,
                    merge:[
                        {
                            label: "订单数",
                            value: "week2Num",
                            minWidth: 150,
                            sortable:true,
                        },
                        {
                            label: "占比",
                            value: "week2Proportion",
                            minWidth: 150,
                        }
                    ]
                },
                  {
                    label: "周三",
                    minWidth: 150,
                    merge:[
                        {
                            label: "订单数",
                            value: "week3Num",
                            minWidth: 150,
                            sortable:true,
                        },
                        {
                            label: "占比",
                            value: "week3Proportion",
                            minWidth: 150,
                            sortable:true,
                        }
                    ]
                },
                  {
                    label: "周四",
                    minWidth: 150,
                    merge:[
                        {
                            label: "订单数",
                            value: "week4Num",
                            minWidth: 150,
                            sortable:true,
                        },
                        {
                            label: "占比",
                            value: "week4Proportion",
                            minWidth: 150,
                            sortable:true,
                        }
                    ]
                },
                  {
                    label: "周五",
                    minWidth: 150,
                    merge:[
                        {
                            label: "订单数",
                            value: "week5Num",
                            minWidth: 150,
                            sortable:true,
                        },
                        {
                            label: "占比",
                            value: "week5Proportion",
                            minWidth: 150,
                            sortable:true,
                        }
                    ]
                },
                  {
                    label: "周六",
                    minWidth: 150,
                    merge:[
                        {
                            label: "订单数",
                            value: "week6Num",
                            minWidth: 150,
                            sortable:true,
                        },
                        {
                            label: "占比",
                            value: "week6Proportion",
                            minWidth: 150,
                            sortable:true,
                        }
                    ]
                },
                  {
                    label: "周日",
                    minWidth: 150,
                    merge:[
                        {
                            label: "订单数",
                            value: "week7Num",
                            minWidth: 150,
                            sortable:true,
                        },
                        {
                            label: "占比",
                            value: "week7Proportion",
                            minWidth: 150,
                            sortable:true,
                        }
                    ]
                },
            ]
        },
        //销量报表按0~24点echarts图表和表格的处理
        getHour(){
            let vm = this
            this.tableList=this.bigTableList.listTotal3;
            this.tableDatas=this.bigTableList.listTotal3;
            if(!this.tableList.length){
                this.isData=false;
                return;
            }
            //图表的
            let weekOptions={
                xAxis: {
                    type: 'category',
                    data: null,
                    // axisLabel: {
                    //     rotate: 45,
                    // }
                },
                legend: {
                    data:['订单数']
                },
                // 布局
                grid: {
                    left: "6%",
                    right: "8%",
                    bottom: "11%", // 防止 dataZoom 重叠
                    containLabel: true
                },
                // dataZoom: [
                //     {
                //         type: 'slider',
                //         show: true,
                //         //bottom:'-10%',
                //         //showDetail:false
                //             handleIcon:
                // "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                //     },

                // ],
                tooltip: {
                    trigger: 'axis',
                    formatter(params) {
                        return vm.$.getChartTooltip(params)
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: null,
                    name:"订单数",
                    type: 'line'
                }]
            };
            let Xdata=[];//横坐标
            let datas=[];//数据
            this.tableList.forEach(i=>{
                Xdata.push(i.statTime.split('-')[0]+'点');
                datas.push(i.orderCnt)
            });
            Xdata.sort((a,b)=>{
                return new Date(a).getTime() - new Date(b).getTime()
            });
            // console.log(Xdata);
            // console.log(datas);
            weekOptions.xAxis.data=Xdata;
            weekOptions.series[0].data=datas;
            this.lineEchart.setOption(weekOptions);

            //表格的
            this.columns=[
                {
                    label: "中国时间",
                    value: "statTime",
                    minWidth: 150,
                    render(h,scope){
                        return(
                            <span>{scope.row.statTime+'点'}</span>
                        )
                    }
                },
                {
                    label: "订单数",
                    value: "orderCnt",
                    minWidth: 150,
                    sortable:true,
                },
                {
                    label: "占比",
                    value: "proportion",
                    minWidth: 150,
                    sortable:true,
                    render(h,scope){
                        return(
                            <span>{scope.row.proportion===null ? '-': Math.ceil(scope.row.proportion*10000)/100+'%'}</span>
                        )
                    }
                },
            ]
        },
        //销量占比的初始化柱状图和饼图
        initEcharts(){
            if( !this.bigTableList.listParentAsin.length){
                this.isData2=false;
                this.isData3=false;
                return
            }
            this.lineEchart2=echarts.init(this.$refs.lineEchart2);
            this.lineEchart3=echarts.init(this.$refs.lineEchart3);
            //console.log(this.bigTableList.listParentAsin);

            let pieData=[];
            let pieLegend=[];
            let barXdata=[];
            let barSData=[];
            this.bigTableList.listParentAsin.forEach(i=>{
                pieData.push( {value:i.orderCnt, name:i.parentAsin} );
                pieLegend.push(i.parentAsin);
                barXdata.push(i.parentAsin);
                barSData.push(i.orderCnt);
            });
            this.lineEchart2.setOption(pieSetOption(pieData));
            this.lineEchart3.setOption(barSetOption(barXdata,barSData));
            //饼图设置optins
            function pieSetOption(data){
                return{
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:pieLegend
                    },
                    series : [
                        {
                            name: '订单数',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:data,
                            // data:[
                            //     {value:335, name:'直接访问'},
                            //     {value:310, name:'邮件营销'},
                            //     {value:234, name:'联盟广告'},
                            //     {value:135, name:'视频广告'},
                            //     {value:1548, name:'搜索引擎'}
                            // ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            //每一格的标题
                            label:{
                                show:true,
                                formatter: '{b} : {c} ({d}%)'
                            }
                        }
                    ]
                }
            }
            //柱状图设置options
            function barSetOption(barXdata,barSData){
                return{
                    title: {
                        text: '订单数',
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        
                    },
                    color:['skyblue'],
                    // 布局
                    grid: {
                        left: "6%",
                        right: "8%",
                        bottom: "11%", // 防止 dataZoom 重叠
                        containLabel: true
                    },
                    xAxis: {
                        type : 'category',
                        splitLine: {show:false},
                        //data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        data : barXdata,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            rotate: 45,
                        }
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            showDetail:false,
                                handleIcon:
                    "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                        },

                    ],
                    yAxis: {
                        type : 'value'
                    },
                    series: [
                        {
                            type: 'bar',
                            barWidth: '30%',
                            data: barSData
                            //data:[10, 52, 200, 334, 390, 330, 220]
                        },
                        
            
                    ]
                }
            }

        },
        //获取产品列表的option
        getParentAsinsList(){
            this.options=[];
            this.oldSeclect=[];
            this.formInline.parentAsins=[];
            this.$api['ebTaskSalesStatListParentAsin']({
                sellerId:this.formInline.sellerId,
                siteId:this.formInline.siteId,
                taskId:this.formInline.taskId
            })
            .then(data => {
                this.options.push({ label:"全部",value:0})
                this.formInline.parentAsins.push(0)
                data.data.forEach(i=>{
                   this.options.push({label:i,value:i}) 
                   this.formInline.parentAsins.push(i)
                });
                this.oldSeclect=this.formInline.parentAsins;
            }).catch(() => {})
        },
        //获取数据
        getData(v){
            this.echartsLoading=true;
            this.echartsLoading2=true;
            let datas={};
            datas.sellerId=this.formInline.sellerId;
            datas.siteId=this.formInline.siteId;
            datas.taskId=this.formInline.taskId;
            datas.startTime=this.timeRange[0];
            datas.endTime=this.timeRange[1];

            let parentAsins=_.cloneDeep(this.formInline.parentAsins);
            if(parentAsins.includes(0)){
                parentAsins.splice(parentAsins.indexOf(0),1);
            }
            datas.parentAsins=parentAsins;
            //console.log(parentAsins);
            this.$api['ebTaskSalesStatListTaskDetail'](
                datas
            )
            .then(data => {
                this.echartsLoading=false;  //销量报表的loading
                this.echartsLoading2=false; //销量占比的loading
                this.bigTableList=data.data;
                this.listBuyer=data.data.listBuyer; //底部表格的数据
                this.$nextTick(function(){
                    let index=v || 0;
                    this.selectTypeChange(index); //手动选择展示的类型
                    this.initEcharts(); //初始化销量占比的图表
                });
            }).catch(() => {
                 this.echartsLoading=false;
                 this.echartsLoading2=false;
            });

        }
    },
   created() {
        let time=dayjs().format('YYYY-MM-DD');
        this.timeRange=[time,time];
		//console.log(1);
        this.formInline.taskId=this.$route.query.taskId;
		if (this.sellerId && this.siteId) {
			this.formInline.siteId=this.siteId;
            this.formInline.sellerId=this.sellerId;
            this.getParentAsinsList();
            this.getData();
		}
	},
	watch:{
		sellerData() {
			if (this.sellerId && this.siteId) {
				this.formInline.siteId=this.siteId;
                this.formInline.sellerId=this.sellerId;
                this.getParentAsinsList();
                this.getData();
			}
		}
    },  
    beforeDestroy() {
        if (this.lineEchart) {
            this.lineEchart.dispose();
            this.lineEchart = null;
        }
       
    },
};
</script>

<style scoped lang="less">
.chart-body{
    height: 400px;
    width: 100%;
    display:inline-block;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 40px;

  }
</style>
