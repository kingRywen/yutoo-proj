<!-- 评价数表格 -->
<template>
  <div class="chartRank ___common ts" style="margin-top:15px;">
    <header style="position:relative">
      <!-- <div class="title">
        销量报表
      </div> -->
      <div style="position:absolute;right:0px;top:-3px;">
        <el-date-picker :picker-options="cfuns.pacPickerOptions" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" @change="changeTime" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" size="mini">
        </el-date-picker>
      </div>
      <div style="position:absolute;left:10px;top:-4px;">
        <el-button size="mini" type="primary" @click="showDialog(0)" plain>统计区间设置</el-button>
      </div>
    </header>
    <!-- 重复购买 -->
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;" v-loading="dialogLoading1">
      <none-page v-if="!chartData.chartShow1" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow1">
        <echart auto-resize :options="echartData1" id="Chart1" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;position: relative;" v-loading="dialogLoading1">
	  <el-button  v-show="chartData.chartShow1" class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:0px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel(0)"></el-button>
      <none-page v-if="!chartData.chartShow1" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow1">
        <echart auto-resize :options="echartData2" id="Chart2" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <!-- 平均客单价 -->
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;" v-loading="dialogLoading2">
      <none-page v-if="!chartData.chartShow2" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow2">
        <echart auto-resize :options="echartData3" id="Chart3" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;position: relative;" v-loading="dialogLoading2">
	  <el-button  v-show="chartData.chartShow2" class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:0px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel(1)"></el-button>
      <none-page v-if="!chartData.chartShow2" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow2">
        <echart auto-resize :options="echartData4" id="Chart4" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <!-- 平均客单价 -->
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;" v-loading="dialogLoading3">
      <none-page v-if="!chartData.chartShow3" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow3">
        <echart auto-resize :options="echartData5" id="Chart5" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;position: relative;" v-loading="dialogLoading3">
	  <el-button  v-show="chartData.chartShow3" class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:0px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel(2)"></el-button>
      <none-page v-if="!chartData.chartShow3" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow3">
        <echart auto-resize :options="echartData6" id="Chart6" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <!--设置区间 -->
    <yt-dialog :close-on-click-modal="false" title="区间设置" :visible.sync="addCommodityk" :options='addCommoditykOpt' style="padding-right:100px;" width="600px" @close="choseDialog" :events='addCommoditykOptEvents'>
      <div slot="title">
        <span class="el-dialog__title">区间设置</span>
      </div>
      <el-tabs type="card" v-model="formActiveName">
        <el-tab-pane label="购买次数" name="1">
          <el-button :loading="opts.btnLoading1" size="mini" type="primary" @click="showDialog(1)">恢复系统默认区间</el-button>
          <div class="__box_wrapper__local_page">
            <el-form :model="form" :rules="rules" ref="ruleForm1">
              <div v-for="(item,index) in form.count" :key="index">
                <el-form-item :label="'区间'+(index+1)" :prop="'count.'+index+'.minBuyQty'" :rules="getRule(item,index,1)" label-width="80px" style="width:37%;">
                  <el-input type="text" v-model="item.minBuyQty" style="width:150px;" placeholder="请输入≥2的正整数" size="mini" />
                </el-form-item>
                <el-form-item label-width="62px">
                  ~
                </el-form-item>
                <el-form-item :prop="'count.'+index+'.maxBuyQty'" :rules="getRule(item,index,2)" label-width="20px" style="width:37%;">
                  <el-input type="text" v-model="item.maxBuyQty" style="width:150px;" placeholder="请输入≥2的正整数" size="mini" />
                </el-form-item>
                <el-form-item label-width="0px" style="width:58px;position:relative;top:1px;">
                  <i class="el-icon-remove-outline common_font_color __pointer" v-if="form.count.length>1?true:false" @click="spliceItem(index,1)"></i>
                  <i class="el-icon-circle-plus-outline common_font_color __pointer" style="padding:0px 5px" v-if="index===0&&form.count.length===1||index===form.count.length-1&&form.count.length>1?true:false" @click="addItem(1)"></i>
                </el-form-item>
              </div>
              <!-- 确认按钮 -->
              <!-- {{form}} -->
              <!-- <span>温馨提示:最低购买次数须≥2，区间之间的数据不能冲突</span> -->
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="客户平均客单价" name="2">
          <el-button :loading="opts.btnLoading2" size="mini" type="primary" @click="showDialog(2)">恢复系统默认区间</el-button>
          <div class="__box_wrapper__local_page">
            <el-form :model="form" :rules="rules" ref="ruleForm2">
              <div v-for="(item,index) in form.priceAvg" :key="index">
                <el-form-item :label="'区间'+(index+1)" :prop="'priceAvg.'+index+'.minPrice'" :rules="getRule2(item,index,1)" label-width="80px" style="width:37%;">
                  <el-input type="text" v-model="item.minPrice" style="width:150px;" placeholder="请输入价格" size="mini" />
                </el-form-item>
                <el-form-item label-width="62px">
                  ~
                </el-form-item>
                <el-form-item :prop="'priceAvg.'+index+'.maxPrice'" :rules="getRule2(item,index,2)" label-width="20px" style="width:37%;">
                  <el-input type="text" v-model="item.maxPrice" style="width:150px;" placeholder="请输入价格" size="mini" />
                </el-form-item>
                <el-form-item label-width="0px" style="width:58px;position:relative;top:1px;">
                  <i class="el-icon-remove-outline common_font_color __pointer" v-if="form.priceAvg.length>1?true:false" @click="spliceItem(index,2)"></i>
                  <i class="el-icon-circle-plus-outline common_font_color __pointer" style="padding:0px 5px" v-if="index===0&&form.priceAvg.length===1||index===form.priceAvg.length-1&&form.priceAvg.length>1?true:false" @click="addItem(2)"></i>
                </el-form-item>
              </div>
              <!-- 确认按钮 -->
              <!-- {{form}} -->
              <!-- <span>温馨提示:最低购买次数须≥2，区间之间的数据不能冲突</span> -->
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="重复购买间隔时间" name="3">
          <el-button :loading="opts.btnLoading3" size="mini" type="primary" @click="showDialog(3)">恢复系统默认区间</el-button>
          <div class="__box_wrapper__local_page">
            <el-form :model="form" :rules="rules" ref="ruleForm3">
              <div v-for="(item,index) in form.intervalTime" :key="index">
                <el-form-item :label="'区间'+(index+1)" :prop="'intervalTime.'+index+'.minDays'" :rules="getRule3(item,index,1 )" label-width="80px" style="width:37%;">
                  <el-input type="text" v-model="item.minDays" style="width:150px;" placeholder="请输入天数" size="mini" />
                </el-form-item>
                <el-form-item label-width="62px">
                  ~
                </el-form-item>
                <el-form-item :prop="'intervalTime.'+index+'.maxDays'" :rules="getRule3(item,index,2 )" label-width="20px" style="width:37%;">
                  <el-input type="text" v-model="item.maxDays" style="width:150px;" placeholder="请输入天数" size="mini" />
                </el-form-item>
                <el-form-item label-width="0px" style="width:58px;position:relative;top:1px;">
                  <i class="el-icon-remove-outline common_font_color __pointer" v-if="form.intervalTime.length>1?true:false" @click="spliceItem(index,3)"></i>
                  <i class="el-icon-circle-plus-outline common_font_color __pointer" style="padding:0px 5px" v-if="index===0&&form.intervalTime.length===1||index===form.intervalTime.length-1&&form.intervalTime.length>1?true:false" @click="addItem(3)"></i>
                </el-form-item>
              </div>
              <!-- 确认按钮 -->
              <!-- {{form}} -->
              <!-- <span>温馨提示:最低购买次数须≥2，区间之间的数据不能冲突</span> -->
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-button :loading="buttonLoading" type="primary" style="width:50%;margin:15px auto;margin-left:128px" @click="setup" size="mini">确 定</el-button> -->
    </yt-dialog>
    <!-- 老客户详情 -->
    <!-- <el-dialog :close-on-click-modal="false" :visible.sync="cumData.show" style="padding-right:100px;" width="1000px">
      <div slot="title">
        <span class="common_font_title">{{cumData.title}}</span>
				<el-button style="margin-left: 5px;" size="mini" type="primary" @click="exportMethod" plain>导出</el-button>
      </div>
      <el-table-pagination :table="cumData.table" :selection="false" :pageNumber.sync="cumData.table.pageNumber" :pageSize.sync="cumData.table.pageSize" :total="cumData.table.total" v-loading="cumData.table.loading" :userSelect.sync="cumData.userSelect" style="padding-bottom:15px;"></el-table-pagination>
    </el-dialog> -->
  </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
import dayjs from 'dayjs';
let echarts = require("echarts/lib/echarts");
class newItem1 {
  constructor() {
    // 用于skus新增一项
    (this.minBuyQty = ""), (this.maxBuyQty = "");
  }
}
class newItem2 {
  constructor() {
    // 用于skus新增一项
    (this.minPrice = ""), (this.maxPrice = "");
  }
}
class newItem3 {
  constructor() {
    // 用于skus新增一项
    (this.minDays = ""), (this.maxDays = "");
  }
}
export default {
  name: "chartRank",
  inject: {
    getData: {
      default: null
    }
  },
  provide() {
    return {
      getList: this.getDetails2
    };
  },
  data() {
    // 多项验证
    var vali = (item, index, type) => {
      let validator = (rule, value, callback) => {
        let arr_ = JSON.parse(JSON.stringify(this.form.count));
        // arr_.splice(index, 1);
        // console.log(arr_);
        // console.log(arr_);
        if ( (isNaN(value) || !value) && index!==arr_.length-1) {
          if (value === undefined) {
            value = "";
          } else {
            return callback(new Error("请输入数字"));
          }
        }
        // console.log(item, "item");
        value = this.cfuns.Trim(value + "", "g");
        let item1 = +item.minBuyQty;
        let item2 = +item.maxBuyQty;
        // console.log(item1, "item1");
        // console.log(item2, "item2");
        //console.log(arr_)
        if (+value) {
          arr_.forEach((el, j) => {
            if (j !== index) {
              if ( (+value === +el.minBuyQty || +value === +el.maxBuyQty) && (value!==0) ){
               return  callback(new Error("区间" + (j + 1) + "已包含"));
              }
            }
          });
        }
        if (!/^[0-9]*$/.test(value)) {
          return callback(new Error("请输入正整数"));
        } else if (value && value < 1) {
         return  callback(new Error("请输入≥1的正整数"));
        } else if (value && item1 && item2 && item1 > item2) {
          // console.log("左右");
          return callback(new Error("左边须小于或等于右边"));
        } else if( index!==0 && index!==arr_.length-1){
            if(+value<=arr_[index-1].maxBuyQty ){
              return callback(new Error("需大于上一区间"));
            };
        };

        callback();
          // this.$refs.ruleForm1.validate(vali => {
          //   if (vali) {
          //     callback();
          //   }
          // });
        

      };
      return [
        {
          required: true,
          validator: validator,
          trigger: ["change"]
        }
      ];
    };
    var vali2 = (item, index, type) => {
      let validator = (rule, value, callback) => {
        let arr_ = JSON.parse(JSON.stringify(this.form.priceAvg));
        if (isNaN(value)) {
          if (value === undefined) {
            value = "";
          } else {
            return  callback(new Error("请输入数字"));
          }
        }
        // console.log(arr_);
        value = this.cfuns.Trim(value + "", "g");
        let item1 = +item.minPrice;
        let item2 = +item.maxPrice;
        // arr_.splice(index, 1);
        
        //console.log(2);

        if (+value) {
          arr_.forEach((el, j) => {
            if (j !== index) {
              if (+value >= +el.minPrice && +value <= +el.maxPrice) {
               return  callback(new Error("区间" + (j + 1) + "已包含"));
              }
            }
          });
        };

        if (value && value <= 0) {
          return callback(new Error("价格输入应大于0"));
        } else if (item1 && item2 && item1 >= item2) {
          return callback(new Error("左边须小于右边"));
        };

        return callback();
        
      };
      return [
        {
          required: true,
          validator: validator,
          trigger: ["change", "blur"]
        }
      ];
    };
    var vali3 = (item, index, type ) => {
      let validator = (rule, value, callback) => {
        let arr_ = JSON.parse(JSON.stringify(this.form.intervalTime));
        if (isNaN(value)) {
          if (value === undefined) {
            value = "";
          } else {
            return callback(new Error("请输入数字"));
          }
        };
        // console.log(arr_);

        //console.log(index)
        
        let ruleName=rule.field.split('.')[2];
        //console.log(ruleName);

        value = this.cfuns.Trim(value + "", "g");
        let item1 = +item.minDays;
        let item2 = +item.maxDays;
        // arr_.splice(index, 1);
        if (+value) {

          if(index!==0 && index!==arr_ .length-1){
            let upLittle=arr_[index-1].minDays;
            let upBig=arr_[index-1].maxDays;
            let belowLittle=arr_[index+1].minDays || -1;
            let belowBig=arr_[index+1].maxDays || -1;

            arr_.forEach((el, j) => {
              if (j !== index) {
                if ( ruleName==='maxDays' && (+value === +el.minDays || +value === +el.maxDays) && (value!==0)  &&  +value !== +upBig  && +value !== +belowLittle) {
                  // console.log(+upBig);
                  // console.log(+belowBig);
                  // console.log(+value );

                  return callback(new Error("区间" + (j + 1) + "已包含"));
                }
                else if( ruleName==='minDays' && (  +value < +upBig) && (value!==0) ){
                  return callback(new Error("区间" + (j + 1) + "已包含"));
                }
              }
            });
          }
        };

        if (/^[0-9]*$/.test(value) === false ) {
          return callback(new Error("请输入正整数"));

        } else if ( String(item1) && String(item2) && item1 >= item2  &&  index!==arr_ .length-1 ) {
          return callback(new Error("左边须小于右边"));

        };

        callback();
      };
      return [
        {
          required: true,
          validator: validator,
          trigger: ["change"]
        }
      ];
    };
    return {
      opts: {
        buttonLoading1: false,
        buttonLoading2: false,
        buttonLoading3: false
      },
      getRule(item, index, type) {
        return vali(item, index, type);
      },
      getRule2(item, index, type) {
        return vali2(item, index, type);
      },
      getRule3(item, index, type ) {
        return vali3(item, index, type );
      },
      formActiveName: "1",
      form: {
        count: [
          new newItem1()
          // {
          //   sku: "",
          //   priceStandard: "",
          //   priceMin: ""
          // }
        ],
        priceAvg: [
          new newItem2()
          // {
          //   sku: "",
          //   priceStandard: "",
          //   priceMin: ""
          // }
        ],
        intervalTime: [
          new newItem3()
          // {
          //   sku: "",
          //   priceStandard: "",
          //   priceMin: ""
          // }
        ]
      },
      rules: {},
      buttonLoading: false,
      addCommodityk: false,
      addCommoditykOpt:{
        title:"区间设置",
        visible:false,
        width:'600px'
      },
      addCommoditykOptEvents:{
        handleOkClick:()=>{
          return this.setup()
        }
      },
      dialogLoading1: false,
      dialogLoading2: false,
      dialogLoading3: false,
      chartData: {
        chartShow1: false,
        chartShow2: false,
        chartShow3: false
      },
      echartData1: {},
      echartData2: {},
      echartData3: {},
      echartData4: {},
      echartData5: {},
      echartData6: {},
      value: "1",
      URL: null,
      DateMsg: {
        DateValue: [
          this.cfuns.getDay(365).computedDay,
          dayjs().subtract(15,'hour').format('YYYY-MM-DD')
        ],
        // DateValue: [this.chartData.date[0], this.chartData.date[1]],
        width: "240px",
        type: "daterange"
      },
      Loading: false, //
      list: null,

      cumData: {
        show: false,
        title: "",
        table: {
          loading: false,
          rows: [],
          pageNumber: 1,
          pageSize: 10,
          total: 0,
          show: {
            buyerEmail: true,
            buyerIndex: true,
            buyerName: true,
            count_: true,
            intervalTime: true,
            priceAvg: true
          }
        },
        userSelect: []
      },
      list1: null,
      list2: null,
      list3: null,
      exportName:null,
      exportPath:null,
    };
  },
  created() {
	  // console.log(this.$route)
	  // console.log(this.$store.state.pubilcTime.customerAnalysisTime)
  },
  mounted() {},
  methods: {
	  downloadExel(type){
	  	let params = {
	  		sellerId:this.sellerId,
	  		siteId:this.siteId,
	  		startTime:this.DateMsg.DateValue[0],
	  		endTime:this.DateMsg.DateValue[1],
	  		parentSkus: this.$store.state.common.select_parentSkuMain && this.$store.state.common.select_parentSkuMain.length ? this.$store.state.common.select_parentSkuMain : this.$store.state.common.parentSkusAll,
	  		skus : this.$store.state.common.select_childSku && this.$store.state.common.select_childSku.length ? this.$store.state.common.select_childSku : this.$store.state.common.childSkusAll
	  	}
		let PAr = this.$store.state.common.select_parentSkuMain
		let CHi = this.$store.state.common.select_childSku
		if( (PAr && PAr.length) || (CHi && CHi.length) ){
		  if(CHi && CHi.length) params.parentSkus = null
		  if( (PAr && PAr.length) && !(CHi && CHi.length) ) params.skus = null
		}
	  	this.$api[`${type==1?'salesShopDayAnalysisOldCustPriceExport':type==2?'salesShopDayAnalysisOldCustTimeExport':'salesShopDayAnalysisOldCustCountExport'}`](params)
	  	  .then(data => {
	  	    downloadFile(data, `${type==1?'客户平均单价':type==2?'重复购买间隔时间':'购买次数'}`)
	  	  })
	  	  .catch(() => {})
	  },
    getChartsData(startTime, endTime) {
      this.showChartChild_1(1, startTime, endTime);
      this.showChartChild_1(2, startTime, endTime);
      this.showChartChild_1(3, startTime, endTime);
    },
    // 获取chartRank表格数据
    showChartChild_1(type, startTime, endTime) {
      let opts = {
        startTime: startTime || this.DateMsg.DateValue[0],
        endTime: endTime || this.DateMsg.DateValue[1],
        sellerId: this.sellerId,
        siteId: this.siteId,
        parentSkus: this.$store.state.common.select_parentSkuMain && this.$store.state.common.select_parentSkuMain.length ? this.$store.state.common.select_parentSkuMain : this.$store.state.common.parentSkusAll,
        skus : this.$store.state.common.select_childSku && this.$store.state.common.select_childSku.length ? this.$store.state.common.select_childSku : this.$store.state.common.childSkusAll
      };
			// if(!opts.parentSkus.length) {
			//   this.chartData.chartShow1 = false;
			//   this.chartData.chartShow2 = false;
			//   this.chartData.chartShow3 = false;
			//   return;
			// }
			let PAr = this.$store.state.common.select_parentSkuMain
			let CHi = this.$store.state.common.select_childSku
			if( (PAr && PAr.length) || (CHi && CHi.length) ){
			  if(CHi && CHi.length) opts.parentSkus = null
			  if( (PAr && PAr.length) && !(CHi && CHi.length) ) opts.skus = null
			}
      
      let URL;
      if (type == 1) {
        this.dialogLoading1 = true;
        URL = "SalesShopDayAnalysisOldCustCount";
      } else if (type == 2) {
        this.dialogLoading2 = true;
        URL = "SalesShopDayAnalysisOldCustPrice";
      } else if (type == 3) {
        this.dialogLoading3 = true;
        URL = "SalesShopDayAnalysisOldCustTime";
      }
      this.$api[URL](opts)
        .then(data => {
          // console.log("历史排名返回", res);
          let code = data.code;
          if (code == 0) {
            let list = data.data;
            if (data.data == "") {
              this.list = null;
              if (type == 1) {
                this.chartData.chartShow1 = false;
              } else if (type == 2) {
                this.chartData.chartShow2 = false;
              } else if (type == 3) {
                this.chartData.chartShow3 = false;
              }
              this.dialogLoading1 = false;
              this.dialogLoading2 = false;
              this.dialogLoading3 = false;
            }
            this.$nextTick(() => {
              this.chartData.chartShow = true;
              this.list = data.data;
              let list_ = [];
              list.forEach((el, index) => {
                if (type == 1) {
                  if (el.maxBuyQty == null) {
                    el.maxBuyQty = "";
                  }
                  // 加单位区别开不同的图
                  if(el.minBuyQty===el.maxBuyQty){
                    list_.push({
                      y: el.customerCnt,
                      x: el.minBuyQty + "次"
                    });
                  }else{
                    list_.push({
                      y: el.customerCnt,
                      x: el.minBuyQty + "~" + el.maxBuyQty + "次"
                    });
                  }
                 
                } else if (type == 2) {
                  if (el.maxPrice == null) {
                    el.maxPrice = "";
                  }
                  list_.push({
                    y: el.customerCnt,
                    x: "$" + el.minPrice + "~" + el.maxPrice
                  });
                } else if (type == 3) {
                  if (el.maxDays == null) {
                    el.maxDays = "";
                  }
                  list_.push({
                    y: el.customerCnt,
                    x: el.minDays + "~" + el.maxDays + "周"
                  });
                }
              });
              // 1
              if (type == 1) {
                this.list1 = list;
              } else if (type == 2) {
                this.list2 = list;
                // console.log(this.list2, "list2");
              } else if (type === 3) {
                this.list3 = list;
                // console.log(this.list3, "list3");
              }
              // 柱状图
              let dom1 = document.getElementById("Chart1");
              let dom3 = document.getElementById("Chart3");
              let dom5 = document.getElementById("Chart5");
              this.drawEchart1(dom1, list_, type);
              this.drawEchart1(dom3, list_, type);
              this.drawEchart1(dom5, list_, type);
              // 饼状图
              let dom2 = document.getElementById("Chart2");
              let dom4 = document.getElementById("Chart4");
              let dom6 = document.getElementById("Chart6");
              this.drawEchart2(dom2, list_, type);
              this.drawEchart2(dom4, list_, type);
              this.drawEchart2(dom6, list_, type);
            });
          } else if (code == 500) {
            if (type == 1) {
              this.chartData.chartShow1 = false;
            } else if (type == 2) {
              this.chartData.chartShow2 = false;
            } else if (type == 3) {
              this.chartData.chartShow3 = false;
            }
          }
          this.dialogLoading1 = false;
          this.dialogLoading2 = false;
          this.dialogLoading3 = false;
        })
        .catch(err => {
          if (type == 1) {
            this.chartData.chartShow1 = false;
          } else if (type == 2) {
            this.chartData.chartShow2 = false;
          } else if (type == 3) {
            this.chartData.chartShow3 = false;
          }
          this.dialogLoading1 = false;
          this.dialogLoading2 = false;
          this.dialogLoading3 = false;
        });
    },
    async getDetails1(param) {
      // console.log(this.list1, "list1");
      // console.log(this.list2, "list2");
      // console.log(this.list3, "list3");
     // console.log(param);
      
			
      // console.log(param, "重要的参数都在这里！"); //重要的参数都在这里！
      let name = param.name;
			this.exportName = param.name;
      // let data = param.data.value ? param.data.value : param.data;
      // 2
      let result1 = this.list1.find(el => {
       
          // el.minBuyQty + "~" + el.maxBuyQty === name && el.customerCnt === data
          if(el.minBuyQty===el.maxBuyQty){
              return   el.minBuyQty+'次'===name;
          }else{
              return   el.minBuyQty + "~" + el.maxBuyQty + "次" === name
          }
      });
      let result2 = this.list2.find(el => {
        return (
          // el.minPrice + "~" + el.maxPrice === name && el.customerCnt === data
          "$" + el.minPrice + "~" + el.maxPrice === name
        );
      });
      let result3 = this.list3.find(el => {
        return (
          // el.minDays + "~" + el.maxDays === name && el.customerCnt === data
          el.minDays + "~" + el.maxDays + "周" === name
        );
      });
      // console.log(result1);
      // console.log(result2);
      // console.log(result3);
      // console.log(name);
      if (result1) {
        this.URL = "SalesShopDayAnalysisOldCustCountDetail";
        this.exportPath='salesShopDayOldCustCountExport';
        this.cumData.minBuyQty = result1.minBuyQty;
        this.cumData.maxBuyQty = result1.maxBuyQty;
        this.cumData.maxPrice = "";
        this.cumData.minPrice = "";
        this.cumData.minDays = "";
        this.cumData.maxDays = "";
        this.cumData.title =
          result1.minBuyQty===result1.maxBuyQty ?
          "购买次数区间" +
          result1.minBuyQty +
          "次的客户"
          :
          "购买次数区间" +
          result1.minBuyQty +
          "~" +
          result1.maxBuyQty +
          "的客户"
          ;
      } else if (result2) {
        this.URL = "SalesShopDayAnalysisOldCustPriceDetail";
        this.exportPath='salesShopDayOldCustPriceExport';
        this.cumData.minBuyQty = "";
        this.cumData.maxBuyQty = "";
        this.cumData.minPrice = result2.minPrice;
        this.cumData.maxPrice = result2.maxPrice;
        this.cumData.minDays = "";
        this.cumData.maxDays = "";
        this.cumData.title =
          "平均客单价区间" +
          result2.minPrice +
          "~" +
          result2.maxPrice +
          "的客户";
      } else if (result3) {
        this.URL = "SalesShopDayAnalysisOldCustTimeDetail";
        this.exportPath='salesShopDayOldCustTimeExport';
        this.cumData.minBuyQty = "";
        this.cumData.maxBuyQty = "";
        this.cumData.maxPrice = "";
        this.cumData.minPrice = "";
        this.cumData.minDays = result3.minDays;
        this.cumData.maxDays = result3.maxDays;
        this.cumData.title =
          "重复购买间隔时间区间" +
          result3.minDays +
          "~" +
          result3.maxDays +
          "周的客户";
      } else {
        // return;
      }
      this.cumData.table.rows = [];
      this.cumData.show = true;
      let arg = {
        pageSize: 10,
        pageNumber: 1,
        title: this.cumData.title
      };
      this.getDetails2(arg);
    },
    getDetails2(arg) {
      let params = {
            sellerId: this.sellerId,
            siteId: this.siteId,
            startTime: this.DateMsg.DateValue[0],
            endTime: this.DateMsg.DateValue[1],
            parentSkus: this.$store.state.common.select_parentSkuMain && this.$store.state.common.select_parentSkuMain.length ? this.$store.state.common.select_parentSkuMain : this.$store.state.common.parentSkusAll,
            pageSize: this.cumData.table.pageSize,
            pageNumber: this.cumData.table.pageNumber,
            minBuyQty: this.cumData.minBuyQty,
            maxBuyQty: this.cumData.maxBuyQty,
            minPrice: this.cumData.minPrice,
            maxPrice: this.cumData.maxPrice,
            minDays: this.cumData.minDays,
            maxDays: this.cumData.maxDays,
            ...arg
            // sortField: ,
            // sort: 0,
        };
        // if (!params.parentSkus.length) {
        //     this.cumData.table.rows = [];
        //     this.cumData.table.pageNumber = 1;
        //     this.cumData.table.pageSize = 10;
        //     this.cumData.table.total = 0;
        //     return false;
        // }
        params = this.$.dealObjectValue(params);
        let setParams={...params};
		this.$store.commit("pubilcTime/customerAnalysisTime",[params.startTime,params.endTime]);
        this.$router.push(
          {name:"TSdatails",query:{name:setParams.title,Listpath:this.URL,exportName:this.exportName,exportPath:this.exportPath,type:1, ...setParams},
          params:{rows:setParams}})
    },
    showDialog(type) {
      let params = {
        siteId: this.siteId,
        sellerId: this.sellerId
      };
      if (type === 1) {
        params.resetFlag = 1;
      } else if (type === 2) {
        params.resetFlag = 2;
      } else if (type === 3) {
        params.resetFlag = 3;
      }
      this.$api["SalesConfigInfo"](params)
        .then(data => {
          this.addCommoditykOpt.visible = true;
          if (!type) {
            if (data.data.count) {
              data.data.count.forEach(el => {
                if (el.minBuyQty === null) {
                  el.minBuyQty = "";
                }
                if (el.maxBuyQty === null) {
                  el.maxBuyQty = "";
                }
              });
              this.form.count = data.data.count;
            }
            if (data.data.priceAvg) {
              data.data.priceAvg.forEach(el => {
                if (el.minPrice === null) {
                  el.minPrice = "";
                }
                if (el.maxPrice === null) {
                  el.maxPrice = "";
                }
              });
              this.form.priceAvg = data.data.priceAvg;
            }
            if (data.data.intervalTime) {
              data.data.intervalTime.forEach(el => {
                if (el.minDays === null) {
                  el.minDays = "";
                }
                if (el.maxDays === null) {
                  el.maxDays = "";
                }
              });
              this.form.intervalTime = data.data.intervalTime;
            }
            this.$nextTick(() => {
              if (this.formActiveName == 1) {
                this.$refs["ruleForm1"].validate(valid => {});
              }
              if (this.formActiveName == 2) {
                this.$refs["ruleForm2"].validate(valid => {});
              }
              if (this.formActiveName == 3) {
                this.$refs["ruleForm3"].validate(valid => {});
              }
            });
          } else if (type === 1) {
            if (data.data.count) {
              data.data.count.forEach(el => {
                if (el.minBuyQty === null) {
                  el.minBuyQty = "";
                }
                if (el.maxBuyQty === null) {
                  el.maxBuyQty = "";
                }
              });
              this.form.count = data.data.count;
            }
            this.$nextTick(() => {
              if (this.formActiveName == 1) {
                this.$refs["ruleForm1"].validate(valid => {});
              }
            });
          } else if (type === 2) {
            if (data.data.priceAvg) {
              data.data.priceAvg.forEach(el => {
                if (el.minPrice === null) {
                  el.minPrice = "";
                }
                if (el.maxPrice === null) {
                  el.maxPrice = "";
                }
              });
              this.form.priceAvg = data.data.priceAvg;
            }
            this.$nextTick(() => {
              if (this.formActiveName == 2) {
                this.$refs["ruleForm2"].validate(valid => {});
              }
            });
          } else if (type === 3) {
            if (data.data.intervalTime) {
              data.data.intervalTime.forEach(el => {
                if (el.minDays === null) {
                  el.minDays = "";
                }
                if (el.maxDays === null) {
                  el.maxDays = "";
                }
              });
              this.form.intervalTime = data.data.intervalTime;
            }
            this.$nextTick(() => {
              if (this.formActiveName == 3) {
                this.$refs["ruleForm3"].validate(valid => {});
              }
            });
          }
        })
        .catch(err => {
          this.$message.error("获取区间设置失败,请刷新页面重试");
        });
    },
    choseDialog() {
      this.formActiveName = "1";
      this.form.count = [new newItem1()];
      this.form.priceAvg = [new newItem2()];
      this.form.intervalTime = [new newItem3()];
    },
    // 添加任务增加一项
    addItem(type) {
      if (type == 1) {
        let item = new newItem1();
        this.form.count.push(item);
      } else if (type == 2) {
        let item = new newItem2();
        this.form.priceAvg.push(item);
      } else if (type == 3) {
        let item = new newItem3();
        this.form.intervalTime.push(item);
      }
    },
    spliceItem(index, type) {
      if (type == 1) {
        this.form.count.splice(index, 1);
      } else if (type == 2) {
        this.form.priceAvg.splice(index, 1);
      } else if (type == 3) {
        this.form.intervalTime.splice(index, 1);
      }
      // todo
      this.$nextTick(() => {
        if (this.formActiveName == 1) {
          this.$refs["ruleForm1"].validate(valid => {});
        }
        if (this.formActiveName == 2) {
          this.$refs["ruleForm2"].validate(valid => {});
        }
        if (this.formActiveName == 3) {
          this.$refs["ruleForm3"].validate(valid => {});
        }
      });
    },
    setup() {
      let params = {
        siteId: this.siteId,
        sellerId: this.sellerId,
        count: this.form.count,
        priceAvg: this.form.priceAvg,
        intervalTime: this.form.intervalTime
      };
      params = this.$.dealObjectValue(params);
      // console.log(params); todo
      try {
        this.$refs["ruleForm1"].validate(valid => {
          if (!valid) {
            this.formActiveName = "1";
            return;
          } else {
            this.$refs["ruleForm2"].validate(valid => {
              if (!valid) {
                this.formActiveName = "2";
                return;
              } else {
                this.$refs["ruleForm3"].validate(valid => {
                  if (!valid) {
                    this.formActiveName = "3";
                    return;
                  } else {
                    this.buttonLoading = true;
                    this.$api["SalesConfigSave"](params)
                      .then(data => {
                        if (data.code === 0) {
                          this.buttonLoading = false;
                          this.addCommoditykOpt.visible = false;
                          // todo
                          this.getChartsData();
                        }
                      })
                      .catch(err => {
                        this.buttonLoading = false;
                      });
                  }
                });
              }
            });
          }
        });
      } catch (err) {
        console.log(err, "err");
      }
    },
    changeTime(val) {
      if (!val) {
        this.getChartsData();
        return;
      }
      // 有日期则往下走
      let startTime = this.DateMsg.DateValue[0],
        endTime = this.DateMsg.DateValue[1];
      this.getChartsData(startTime, endTime);
    },
    //获取子组件传来按日按周按月
    getDayFromChild(childMsg) {
      this.value = childMsg;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },
    drawEchart1(dom, list, type) {
      let et = echarts.init(dom);
      // et.clear();
      if (!list) {
        if (type == 1) {
          this.chartData.chartShow1 = false;
        } else if (type == 2) {
          this.chartData.chartShow2 = false;
        } else if (type == 3) {
          this.chartData.chartShow3 = false;
        }
        return;
      } else {
        if (type == 1) {
          this.chartData.chartShow1 = true;
        } else if (type == 2) {
          this.chartData.chartShow2 = true;
        } else if (type == 3) {
          this.chartData.chartShow3 = true;
        }
      }
      // 横坐标
      let dataAxis = [];
      // 纵坐标
      let data = [];
      // 1柱子阴影
      let dataShadow = [];
      // 存放数值便于找最大值
      list.forEach((item, index) => {
        dataAxis.push(item.x);
        data.push(item.y);
      });
      // 2
      let max = Math.max(...data);
      list.forEach((item, index) => {
        dataShadow.push(max);
      });
      // console.log(dataAxis, "dataAxis");
      // console.log(data, "data");
      // console.log(dataShadow, "dataShadow");
      // 设置一下表格首次能看到几个数是
      let length = dataAxis.length;
      let start, end;
      if (length <= 15) {
        start = 0;
        end = 100;
      }
      if (length > 15 && length <= 30) {
        start = 0;
        end = 50;
      }
      if (length > 30 && length <= 50) {
        start = 0;
        end = 40;
      }
      if (length > 50) {
        start = 0;
        end = 30;
      }
      if (length > 100) {
        start = 0;
        end = 10;
      }
      let rotate;
      if (dataAxis.length < 5) {
        rotate = 0;
      }
      if (dataAxis.length >= 5) {
        rotate = 45;
      }
      let option = {
        title: {
          // text: "评分/评价数（提示：鼠标滑轮缩放,可左右拖拽）"
          // subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
        },
        xAxis: {
          nameTextStyle: {
            fontSize: "13px",
            color: "#909399"
          },
          data: dataAxis,
          position: "bottom",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#999"
            },
            interval: 0, //,    // {number}
            rotate: rotate
          },
          z: 10
        },
        toolbox: {
          feature: {}
        },
		toolbox:{
          top: '-50px',
          feature: {
            dataZoom:{
              yAxisIndex:"none"   //不启用y轴的选中
            }
          }
        },
        grid: {
          left: "3%",
          right: "15%",
          bottom: "12%",
          containLabel: true
        },
        yAxis: {
          name: "客户数量",
          nameTextStyle: {
            fontSize: "13px",
            color: "#909399"
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: end,
            minValueSpan: 0,
            maxValueSpan: 10,
            zoomOnMouseWheel: false,
          },
          {
            start: 0,
            end: 100,
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
        ],
        series: [
          {
            // For shadow
            type: "bar",
            barWidth: 20, //柱图宽度,
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0.05)"
              }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            // 3
            data: dataShadow,
            animation: false
          },
          {
            type: "bar",
            barWidth: 20, //柱图宽度,
            itemStyle: {
              normal: {
                color: "#32CDD5",
                label: { show: true, position: "inside" }
              }
            },
            data: data
          }
        ]
      };
      let title = "";
      if (type == 1) {
        title = "购买次数区间统计";
      } else if (type == 2) {
        title = "客户平均客单价分布";
      } else if (type == 3) {
        title = "重复购买间隔时间区间分布";
      }
      option.title = {
        text: title,
        textStyle: {
          fontSize: "14px",
          color: "#909399"
        }
      };
      let xName = "";
      // if (type == 1) {
      //   xName = "单位(次)";
      // } else if (type == 2) {
      //   xName = "单位($)";
      // } else if (type == 3) {
      //   xName = "单位(天)";
      // }
      // option.xAxis.name = xName;
      // console.log(list, "排名数据");
      // legend 不可点击
      option.grid.top = "16%";
      // if (length < 7) {
      //   delete option.dataZoom;
      // }
      if (option.series == "") {
        if (type == 1) {
          this.chartData.chartShow1 = false;
        } else if (type == 2) {
          this.chartData.chartShow2 = false;
        } else if (type == 3) {
          this.chartData.chartShow3 = false;
        }
      } else {
        if (type == 1) {
          this.chartData.chartShow1 = true;
        } else if (type == 2) {
          this.chartData.chartShow2 = true;
        } else if (type == 3) {
          this.chartData.chartShow3 = true;
        }
      }
      if (type == 1) {
        this.echartData1 = option;
      } else if (type == 2) {
        this.echartData3 = option;
      } else if (type == 3) {
        this.echartData5 = option;
      }
	  setTimeout(() => {
          et.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'dataZoomSelect',
            // 启动或关闭
            dataZoomSelectActive: true
          });
      });
      et.on("click", this.getDetails1);
      // console.log(option);
    },
    // 饼状图
    drawEchart2(dom, list, type) {
      let et = echarts.init(dom);
      // et.clear();
      let option = {
        title: {
          // text: "此处不展示占比接近0%的数据)",
          textStyle: {
            fontSize: "14px",
            color: "#909399"
          }
        },
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
          // 1
          formatter: function(val) {
            // console.log(val);
            let percent = val.percent.toFixed(2) + "%";
            return `${val.seriesName}</br>${val.name}: ${
              val.data.value
            }(${percent})`;
          }
        },
        // color: [],
        toolbox: {
          // feature: {
          // dataZoom: {
          // yAxisIndex: 'none'
          // },
          // restore: {},
          // saveAsImage: { title: "保存" }
          // }
        },
        legend: {
          type: "scroll",
          // orient: "vertical",
          orient: "horizontal",
          // x: "left",
          formatter: function(name) {
            // console.log(name);
            return name;
            // return name.length > 8 ? name.slice(0, 8) + "..." : name;
          },
          //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
          data: []
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "1%",
          containLabel: true
        },
        series: []
      };
      option.tooltip.formatter = function(val) {
        // console.log(val);
        let percent = val.percent.toFixed(2) + "%";
        return `${val.seriesName}</br>${val.name}: ${
          val.data.value
        }(${percent})`;
      };
      // console.log(list, "排名数据");
      //legend
      option.legend.data = [];
      option.legend.right = "0%";
      option.legend.top = "20";
      option.legend.bottom = "20";
      option.legend.orient = "vertical";
      option.grid.top = "10%";
      if (!list) {
        if (type == 1) {
          this.chartData.chartShow1 = false;
        } else if (type == 2) {
          this.chartData.chartShow2 = false;
        } else if (type == 3) {
          this.chartData.chartShow3 = false;
        }
        return;
      } else {
        if (type == 1) {
          this.chartData.chartShow1 = true;
        } else if (type == 2) {
          this.chartData.chartShow2 = true;
        } else if (type == 3) {
          this.chartData.chartShow3 = true;
        }
      }
      // console.log(list);
      option.series = [
        {
          name: "占比",
          type: "pie",
          radius: ["0%", "60%"],
          center: ["40%", "60%"],
          avoidLabelOverlap: true,
          labelLine: {
            normal: {
              lineStyle: {},
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {},
          data: []
        }
      ];
      list.forEach((item, index) => {
        if (index == 0) {
          item.color = "#FB6D6B";
        }
        if (index == 1) {
          item.color = "#47C2E1";
        }
        if (index == 2) {
          item.color = "#FDC74E";
        }
        if (index == 3) {
          item.color = "#D48265";
        }
        if (index == 4) {
          item.color = "#28C432";
        }
        if (index == 5) {
          item.color = "#00c0de";
        }
        if (index == 6) {
          item.color = "#272b2c";
        }
      });
      list.forEach((item, index) => {
        let x = item.x;
        option.legend.data.push(x); // legend
        // option.color.push(item.color); // legend
        option.series[0].data.push({
          // 使用直接push改变原来的数组对象
          value: item.y,
          name: x
        }); // series 中的data
      });
      if (option.series == "") {
        if (type == 1) {
          this.chartData.chartShow1 = false;
        } else if (type == 2) {
          this.chartData.chartShow2 = false;
        } else if (type == 3) {
          this.chartData.chartShow3 = false;
        }
      } else {
        if (type == 1) {
          this.chartData.chartShow1 = true;
        } else if (type == 2) {
          this.chartData.chartShow2 = true;
        } else if (type == 3) {
          this.chartData.chartShow3 = true;
        }
      }
      if (type == 1) {
        this.echartData2 = option;
      } else if (type == 2) {
        this.echartData4 = option;
      } else if (type == 3) {
        this.echartData6 = option;
      }
      et.on("click", this.getDetails1);
    }
  },
  computed: {},
  watch: {
    form: {
      handler(newName, oldName) {
        try {
          if (this.formActiveName == 1) {
            this.$refs["ruleForm1"].validate(valid => {});
          }
          if (this.formActiveName == 2) {
            this.$refs["ruleForm2"].validate(valid => {});
          }
          if (this.formActiveName == 3) {
            this.$refs["ruleForm3"].validate(valid => {});
          }
        } catch {}
      },
      // immediate: true,
      deep: true
    },
    formActiveName: {
      handler(newName, oldName) {
        try {
          if (this.formActiveName == 1) {
            this.$refs["ruleForm1"].validate(valid => {});
          }
          if (this.formActiveName == 2) {
            this.$refs["ruleForm2"].validate(valid => {});
          }
          if (this.formActiveName == 3) {
            this.$refs["ruleForm3"].validate(valid => {});
          }
        } catch {}
      },
      // immediate: true,
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.__box_wrapper__local_page {
  display: flex;
  margin: 12px 10px -25px;
  padding-bottom: 20px;
  .el-form-item {
    display: inline-block !important;
  }
}
.chartRank {
  border: 1px solid transparent;
  box-sizing: border-box;
  width: 100%;
  header {
    height: 31px;
    line-height: 40px;
    width: 100%;
    background: #f5f7fa;
    .title {
      font-size: 12px;
      color: #909399;
      margin-left: 15px;
      line-height: 33px;
    }
  }
}
// 选择新平，新品新增评价
.choose {
  margin-top: 8px;
  font-size: 14px;
  .button {
    display: inline-block;
    padding: 5px 14px;
    border: 1px solid #00c0de;
    text-align: center;
    color: #00c0de;
    border-radius: 5px;
    margin-left: 3px;
    cursor: pointer;
  }
  .active {
    background: #00c0de !important;
    color: #fafafa !important;
  }
}
.el-dialog__title {
  font-size: 14px;
}
</style>
