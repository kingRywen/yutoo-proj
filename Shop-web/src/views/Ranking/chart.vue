<template>
  <div class="box">
    <div class="box-info">
      <span style="display: flex;align-items:center;line-height: 28px;">筛选条件</span>
      <!-- <span>
        <el-button type="text" icon="el-icon-back" @click="backPage" size="mini">返回</el-button>
      </span> -->
    </div>
    <div class="box-query">
      <el-form :inline="true" :model="listQuery" ref="listQueryForm" :rules="rules">
        <el-form-item label="页码" prop="minPages" class="section-input">
          <el-input v-model.number="listQuery.minPages" placeholder="始页码数" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="~" prop="maxPages" class="section-input">
          <el-input v-model.number="listQuery.maxPages" placeholder="末页码数" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="排名" prop="minRank" class="section-input">
          <el-input v-model.number="listQuery.minRank" placeholder="始排名值" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="~" prop="maxRank" class="section-input">
          <el-input v-model.number="listQuery.maxRank" placeholder="末排名值" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="daterange">
          <el-date-picker v-model="listQuery.daterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" :picker-options="pickerOptions" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="展示方式" prop="displayMode ">
            <el-select v-model="listQuery.displayMode" placeholder="请选择" size='mini' style='width:200px;' @change='selectChange'>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="multipleFrequency">
          <el-input v-model.number="listQuery.multipleFrequency" placeholder="请输入" size="mini" clearable></el-input>
          <span>倍抓取频率</span>
        </el-form-item>
        <el-form-item>
          <!-- <el-button size="mini" type="primary" plain v-for="item in ['确认搜索','重置搜索']" @click="distribute(item)">{{item}}</el-button> -->
          <el-button size="small" type="primary" @click="distribute('确认搜索')" icon="el-icon-search" :loading="$store.state.isloading || $store.state.loading">搜索</el-button>
          <el-button size="small" type="primary" plain @click="distribute('重置搜索')" :disabled='$store.state.isloading || $store.state.loading'>重置搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="listLoading" :key='tableKey' class="chart-body" ref="chart"> </div>

  </div>
</template>
<script>
const _ = require("lodash");
const dayjs =require('dayjs');
import echarts from "echarts";
// import {checkWords} from "../KeyLexicon/utils";
export default {
  data() {
    let numReg = /^[1-9]\d*$/
      let checkFrequency = (rule, value, callback) => {
          if (!value) {
          return callback(new Error('请输入倍抓取频率'));
          }else{
              if(!numReg.test(value)){
                  return callback(new Error('请输入正整数'));
              }
              // if(value<10||value>14440){
              //     return callback(new Error('请输入10至14440'));
              // }
              callback();
          }
      };
      let checkMinPages = (rule, value, callback) => {
          if (value) {
              if(!numReg.test(value)){
                  return callback(new Error('请输入正整数'));
              }
              callback();
          }else{
              callback();
          }
      };
      let checkMaxPages = (rule, value, callback) => {
          if (value) {
            let minPages =this.listQuery.minPages
              // if(!minPages){
              //   return callback(new Error('请输入起始页码'));
              // }
              if(!numReg.test(value)){
                  return callback(new Error('请输入正整数'));
              }
              if(minPages){
                if(value<minPages){
                  return callback(new Error('结束数大于起始数'));
                }
              }
              
              callback();
          }else{
              callback();
          }
      };
      let checkMinRank = (rule, value, callback) => {
          if (value) {
              if(!numReg.test(value)){
                  return callback(new Error('请输入正整数'));
              }
              callback();
          }else{
              callback();
          }
      };
      let checkMaxRank = (rule, value, callback) => {
          if (value) {
            let minRank =this.listQuery.minRank
              // if(!minRank){
              //   return callback(new Error('请输入起排名'));
              // }
              if(!numReg.test(value)){
                  return callback(new Error('请输入正整数'));
              }
              if(minRank){
                if(value<minRank){
                  return callback(new Error('结束数大于起始数'));
                }
              }
              callback();
          }else{
              callback();
          }
      };
      let checkDaterange = (rule, value, callback) => {
          // alert(value)
          if (!value) {
            return callback(new Error('请输入创建时间'));
          }else{
             let createTime= new Date(Date.parse(this.$route.query.createTime))
              let startTime = new Date(Date.parse(value[0]))
              if(startTime<createTime){
                return callback(new Error('开始时间不能小于创建时间'));
              }
              callback();
          }
      };
    return {
      options:[
        {
          value: 0,
          label: '按抓取频率展示'
        },
        {
          value: 1,
          label: '按周一到周日,每天的0-24点'
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate:(time)=> {
          // return time.getTime() > Date.now() - 8.64e7
          let Oldtime= new Date(this.$route.query.createTime).getTime()-24*60*60*1000
          return ( time.getTime() > Date.now() ||  time.getTime() < Oldtime)
        }
      },

      tableKey: 0,
      listLoading: false,
      listQuery: {
        daterange: [],
        pageSize: 10,
        pageNumber: 1,
        taskId: null,
        minRank: null,
        maxRank: null,
        minPages: null,
        maxPages: null,
        multipleFrequency: 1,
        startTime: null,
        endTime: null,
        taskFlag: null,
        displayMode:0,//展示方式
      },
     
      rules: {
                minPages:[
                    {validator: checkMinPages, trigger: 'blur' }
                ],
                maxPages:[
                    {validator: checkMaxPages, trigger: 'blur' }
                ],
                minRank:[
                    {validator: checkMinRank, trigger: 'blur' }
                ],
                maxRank:[
                    {validator: checkMaxRank, trigger: 'blur' }
                ],
                daterange:[
                    {required: true,validator: checkDaterange, trigger: ['blur', 'change'] }
                ],
                multipleFrequency:[
                    {required: true,validator: checkFrequency, trigger: 'blur' }
                ]
            },
      chart: null,
      splitNumber: null,
      legendData: ["排名有变化的产品数"],
      xAxisData: [],
      series: []
    };
  },
  created() {
    //console.log('66666');
    
    this.listQuery.taskFlag = parseInt(this.$route.query.taskFlag);
    this.listQuery.taskId = parseInt(this.$route.query.taskId);
    this.listQuery.startTime = this.$route.query.createTime;
    // this.listQuery.endTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    this.listQuery.endTime = dayjs().format('YYYY-MM-DD');
    this.listQuery.daterange = [
      this.listQuery.startTime,
      this.listQuery.endTime
    ];
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  mounted() {
    this.getList();
  },
  methods: {
    
    initChart() {
      this.chart = echarts.init(this.$refs.chart);

      if (this.series.length === 0) {
        this.chart.clear();
        this.chart.setOption({
          title: {
            left: "center", // 水平居中
            top: "center", // 垂直居中
            text: "暂无数据",
            backgroundColor: "#EEEFF4",
            textStyle: {
              color: "#909399",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: 14
            }
          }
        });
      } else {
        let vm = this
        this.chart.clear();

        let option ={
          tooltip: {
            trigger: "axis",
            formatter(params) {
            return vm.$.getChartTooltip(params, param => `$${param.data}`)
          }
          },
          legend: {
            type: "scroll",
            data: this.legendData
          },
          title: {
              text: '排名有变化的产品数',
              textStyle:{
                fontSize:14,
              },
              left:20
          },
          // 布局
          grid: {
            left: "6%",
            right: "8%",
            bottom: "11%", // 防止 dataZoom 重叠
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: false
              }
            }
          },
          xAxis:
            {
              type: "category",
              boundaryGap: false,
              data: this.xAxisData,
              triggerEvent: true,
              axisLabel: {
                rotate: 45,
              }
            },
          yAxis: {
            min: -1,
            splitNumber: this.splitNumber, // 可能要设置
            type: "value",
            axisLabel:{
              formatter: function (value) {
                if(value<0&&value>-1){
                  return null
                }
                return value;
              }
            }
          },
          series: this.series,
          
        }
        if(this.xAxisData.length>7){
          option.dataZoom= [
              {
                type: "inside",
                start: 0,
                end: 100,
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
        
        this.chart.setOption(option);
      }
      let self = this;
      this.chart.off('click');
      this.chart.on("click", function(params) {
        // 防止点时间
        if(params.data===undefined){
          return
        }
        //console.log(params);
        //return
        let flag = params.data;
        if (flag <= 0) {
          return;
        }
        let startTime = null;
        let endTime = null;

        if (params.dataIndex == 0) {
          startTime =self.$route.query.createTime+' 00:00'
          // startTime = dayjs().format('YYYY-MM-DD');
          // endTime = params.name.substring(0, 10);
          endTime = params.name
        } else {
          startTime = self.xAxisData[params.dataIndex - 1];
          endTime = params.name;
        }

        let week;
        let hour;
        if(self.listQuery.displayMode===1){
            startTime=self.listQuery.daterange[0] +' 00:00';
            endTime=self.listQuery.daterange[1] + ' 23:59';

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
        // console.log(week);
        // console.log(hour);
        // return
        self.$router.push({
          path: "/ranking/chartDetails",
          query: {
            taskId: self.listQuery.taskId,
            taskFlag: self.listQuery.taskFlag,
            minRank: self.listQuery.minRank,
            maxRank: self.listQuery.maxRank,
            minPages: self.listQuery.minPages,
            maxPages: self.listQuery.maxPages,
            startTime,
            endTime,
            week,
            hour,
          }
        });
      });
    },
    distribute(btn) {
      switch (btn) {
        case "确认搜索":
          let daterange =this.listQuery.daterange
          if(daterange!==null&&daterange.length===2){
              this.listQuery.startTime =daterange[0]
              this.listQuery.endTime =daterange[1]
          }else{
              this.listQuery.startTime =null
              this.listQuery.endTime =null
          }
          //console.log(this.displayMode);
          if(this.listQuery.displayMode===1){
              this.getList('keywordRankFqRtListForProductStat') 
          }else{
              this.getList();
          }

          break;
        case "重置搜索":
          this.resetListQueryForm();
          break;
      }
    },

    // this.series = [
    //         {
    //             name:'Step Start',
    //             type:'line',
    //             step: 'start',
    //             data:[120, 132, 101, 134, 90, 230, 210]
    //         }

    //     ]
    selectChange(v){
      // if(v===1){
      //     this.getList('keywordRankFqRtListForProductStat') 
      // }else{
      //     this.getList();
      // } 
    },
    getList(url) {
      this.$refs.listQueryForm.validate((valid) => {
        if (valid) {
          this.listLoading = true;
          if(this.listQuery.maxPages===""){
            this.listQuery.maxPages =null
          }
          if(this.listQuery.minPages===""){
            this.listQuery.minPages =null
          }

          if(this.listQuery.maxRank===""){
            this.listQuery.maxRank =null
          }
          if(this.listQuery.minRank===""){
            this.listQuery.minRank =null
          }
      // this.listQuery.maxPages =parseInt(this.listQuery.maxPages)
      // this.listQuery.maxRank =parseInt(this.listQuery.maxRank)
      // this.listQuery.minPages =parseInt(this.listQuery.minPages)
      // this.listQuery.minRank =parseInt(this.listQuery.minRank)
      // this.listQuery.taskFlag =parseInt(this.listQuery.taskFlag)
       
      let listQuery =_.cloneDeep(this.listQuery)
      delete listQuery.daterange;

      let URL='';

      if(url){   //按周一到周日,每天的0-24点
          URL=url;
      }else{
          URL='keywordRankFqRtListForProduct';
      }
      this.$api[URL](listQuery)
        .then(res => {
            let { code, data } = res;
            if (code === 0) {

              //按周一到周日,0 到 24点
              if(url){
                this.legendData=['周一','周二','周三','周四','周五','周六','周日'];
                let seriesData = [];
                let xAxisData = ['0点','1点','2点','3点','4点','5点','6点','7点','8点','9点','10点','11点','12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点'];

                data.forEach(element => {
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

                // console.log(xAxisData);
                // console.log(seriesData);

                let productCntArr = _.uniq(seriesData);
                if (productCntArr.length === 1) {
                  this.splitNumber = 1;
                } else if(productCntArr.length === 2){
                  if(productCntArr.indexOf(-1)!==-1&&productCntArr.indexOf(0)!==-1){
                    this.splitNumber = 1;
                  }
                }else {
                  this.splitNumber = null;
                }

                this.series = seriesData;
                this.xAxisData = xAxisData;
                this.initChart();


              }else{   //按抓取频率展示

                this.legendData=["排名有变化的产品数"];
                let seriesData = [];
                let xAxisData = [];
                data.forEach(element => {
                  seriesData.push(element.productCnt);
                  xAxisData.push(element.sendTime);
                });
                let productCntArr = _.uniq(seriesData);
                if (productCntArr.length === 1) {
                  this.splitNumber = 1;
                } else if(productCntArr.length === 2){
                  if(productCntArr.indexOf(-1)!==-1&&productCntArr.indexOf(0)!==-1){
                    this.splitNumber = 1;
                  }
                }else {
                  this.splitNumber = null;
                }
                this.series = [
                  {
                    name: "排名有变化的产品数",
                    type: "line",
                    step: "start",
                    data: seriesData
                  }
                ];
                this.xAxisData = xAxisData;
                this.initChart();
              }
            };

            this.listLoading = false;

         
         
        }).catch(() => {
          this.listLoading = false;
        });
        }else{
          console.log('error submit!!')
          return false
        }
      })
     
    },
    resetListQueryForm() {
      this.listQuery.daterange = [];
      this.listQuery.multipleFrequency = 1;
      this.$refs.listQueryForm.resetFields();
      //console.log(this.listQuery);
      this.listQuery.displayMode=0
      this.getList();
      
    },

    backPage() {
      let path = "/ranking/ad";
      if (this.listQuery.taskFlag == 1) {
           path = "/ranking/normal";
      }
      this.$router.push({ path });
    }
  }
};
</script>

<style lang="less" scoped>
// @import "~@/assets/style/base/variables.less";
.box {
  // border: 1px solid @borderColor;
  // padding: 10px;
  .box-info {
    font-size: 14px;
    background-color: @boxQueryBGColor;
    //    padding: 15px;
    padding: 6px 15px 6px 15px;
    border: 1px solid @borderColor;
    display: flex;
    justify-content: space-between;
    //    span {
    //     &:first-of-type {
    //         margin-right: 20px;
    //     }
    //     &:last-of-type {
    //         color: @titleColor
    //     }
    //  }
  }
  .box-query {
    //    min-width: 680px;
    padding: 15px 15px 0 15px;
    border-left: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
    border-bottom: 1px solid @borderColor;
    //    display: flex;
    // //    justify-content: center;
    //    align-items: center;
    // //    align-self: center;
    // .el-form--inline{
    //     height: 40px;
    // }
    .el-form-item{
      margin-bottom:14px;
    }
    .el-form-item__content {
      .el-input {
        width: 150px;
      }

      //联调时修改
      .select-monitor-flag {
        width: 100px;
      }
      .data-type {
        width: 70px;
      }
      .el-range-editor {
        width: 240px;
        /deep/.el-range-separator {
          width: 20px;
        }
      }
    }
    .section-input {
      .el-input {
        width: 100px;
      }
    }
  }
  .chart-body {
    width: 100%;
    height: 400px;
    border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-top: 10px;
  }

  //    /deep/.el-dialog__body{
  //        padding-bottom: 0;
  //    }
}
</style>


