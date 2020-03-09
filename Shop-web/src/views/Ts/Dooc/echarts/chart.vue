<!-- 评价数表格 -->
<template>
  <div class="chartRank ___common ts" style="margin-top:15px;">
    <header style="position:relative">
      <div style="position:absolute;right:0px;top:-3px;">
        <el-date-picker :picker-options="cfuns.pacPickerOptions" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" @change="changeTime" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" size="mini">
        </el-date-picker>
      </div>
    </header>
    <!-- 国家分布 -->
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;" v-loading="dialogLoading1">
      <none-page v-if="!chartData.chartShow1" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow1" style='width:100%;'>
        <echart auto-resize :options="echartData1" id="eChart1" style="width:100%; height:300px;" ref='echartData1'></echart>
      </div>
    </main>
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;position: relative;" v-loading="dialogLoading1">
		<el-button  v-show="chartData.chartShow1" class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:0px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel(0)"></el-button>
      <none-page v-if="!chartData.chartShow1" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow1">
        <echart auto-resize :options="echartData2" id="eChart2" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <!-- 州分布 -->
    <div style='margin-left:20px;'>
        <el-select :popper-append-to-body="false" @change="selectValue7" filterable v-model="value7" placeholder="选择国家,可多选" style='min-width:250px' :multiple="true" collapse-tags size="mini">
          <el-option v-for="item in options" :key="item.value" :label="item.country" :value="item.country">
          </el-option>
        </el-select>
    </div>
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;position: relative;" v-loading="dialogLoading2">
		
      <none-page v-if="!chartData.chartShow2" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow2">
        <echart auto-resize :options="echartData3" id="eChart3" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <main style="padding:10px 20px;box-size:border-box;display:inline-block;width:50%;position: relative;" v-loading="dialogLoading2">
		<el-button  v-show="chartData.chartShow2" class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:0px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel(1)"></el-button>
      <none-page v-if="!chartData.chartShow2" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow2">
        <echart auto-resize :options="echartData4" id="eChart4" style="width:100%; height:300px;overflow:visible"></echart>
      </div>
    </main>
    <!-- 城市分布 -->
    <main style="padding:10px 20px 30px;box-size:border-box;display:inline-block;width:100%;position: relative;min-height: 400px;" v-loading="dialogLoading2">
		<el-button class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:0px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel(2)"></el-button>
      <span style="font-size:12px;color:#909399;">城市分布</span>
      <section class="scoped_right" style="margin-top:10px;margin-bottom:10px;">
        <!-- {{select_country}} -->
        <!-- <span class="title">数据源 ：</span> -->
        <el-select :popper-append-to-body="false" @change="selectAll" filterable v-model="value5" placeholder="选择国家,可多选" style='min-width:250px' :multiple="true" collapse-tags size="mini">
          <el-option v-for="item in options" :key="item.value" :label="item.country" :value="item.value">
          </el-option>
        </el-select>
        <el-select :popper-append-to-body="false" @change="selectAll2" filterable v-model="value6" placeholder="选择州,可多选" style='min-width:250px;margin-left: 20px;' :multiple="true" collapse-tags size="mini">
          <el-option v-for="item in options6" :key="item.value" :label="item.state" :value="item.value">
          </el-option>
        </el-select>
      </section>
      <section>
        <el-table-pagination :table="table" :selection="false" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
      </section>
    </main>
    <!-- 老客户详情 -->
    <!-- <el-dialog :close-on-click-modal="false" :visible.sync="cumData.show" style="padding-right:100px;" width="1000px" :before-close='beforeClose'>
      <div slot="title">
        <span class="common_font_title">{{cumData.title}}</span>
				<el-button style="margin-left: 5px;" size="mini" type="primary" @click="exportMethod" plain>导出</el-button>
      </div>
      <el-table-pagination :table="cumData.table" :selection="false" :pageNumber.sync="cumData.table.pageNumber" :pageSize.sync="cumData.table.pageSize" :total="cumData.table.total" v-loading="cumData.table.loading" :userSelect.sync="cumData.userSelect" style="padding-bottom:15px;" ref='eltablepagination'></el-table-pagination>
    </el-dialog> -->
  </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
import dayjs from 'dayjs';
let echarts = require("echarts/lib/echarts");

export default {
  name: "chartRank",
  provide() {
    return {
      getList: this.getCountryTable,
      showCity__: this.getDetails1
    };
  },
  data() {
    return {
      buttonLoading: false,
      addCommodityk: false,
      dialogLoading1: false,
      dialogLoading2: false,
      chartData: {
        chartShow1: false,
        chartShow2: false
      },
      echartData1: {},
      echartData2: {},
      echartData3: {},
      echartData4: {},
      value: "1",
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
      table: {
        loading: false,
        rows: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          city: true,
          countryCode: true,
          customerCnt: true,
          proportion: true,
          state: true
        },
        rowStyle: {
          cursor: "pointer"
        }
      },
      userSelect: [],
      value5: ['US'],
      oldOptions: ['US'],
      options: [],
      select_country: [],

      // value6: ['CA'],
	  value6: [],
      oldOptions6: [],
      options6: [],
      select_stateList: [],

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
            buyerId: true,
            buyerName: true,
            count_: true,
            intervalTime: true,
            priceAvg: true
          },
          reset:true
        },
        userSelect: [],
				exportName:null
      },

      value7:['US'],
      oldValue7:['US'],

      URL:"",
      exportPath:"",

    };
  },
  created() {
     
  },
  mounted() {
	  
  },
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
		if(type == 1) params.countryList = this.select_country
		if(type == 2){params.countryList = this.select_country ; params.stateList = this.select_stateList} 
		this.$api[`${type==1?'salesShopDayDistOldCustStateExport':type==2?'salesShopDayDistOldCustCityExport':'salesShopDayDistOldCustCountryExport'}`](params)
		  .then(data => {
		    downloadFile(data, `${type==1?'州/地区':type==2?'城市':'国家'}`)
		  })
		  .catch(() => {})
	},
    //弹框关闭前
    beforeClose(close){
      //清楚table的排序
      this.$refs.eltablepagination.clearSortable();
      close();
    },
		exportMethod(){
			let name = this.exportName;
			let result1 = this.list1.find(el => {
			  // 2加个空格在后面区别不同的图
			  return el.countryCode + " " === name;
			  //  && el.customerCnt === data;
			});
			let result2 = this.list2.find(el => {
			  return el.state === name;
			  //  && el.customerCnt === data;
			});
			let params = {
				sellerId: this.sellerId,
				siteId: this.siteId,
				startTime: this.DateMsg.DateValue[0],
				endTime: this.DateMsg.DateValue[1],
				parentSkus: this.$store.state.common.select_parentSku,
				pageNumber:1,
				pageSize:10
			}
			if (result1) {
				console.log('country')
				let param = {
					countryCode: this.cumData.countryCode,
					...params
				}
				this.$api['salesShopDayOldCustCountryExport'](param).then(data => {
					downloadFile(data, '成交统计' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
				})
			}else if(result2 && name){
				console.log('state')
				let param = {
					countryCode: this.cumData.countryCode,
					state: this.cumData.state,
					...params
				}
				this.$api['salesShopDayOldCustStateExport'](param).then(data => {
					downloadFile(data, '成交统计' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
				})
			}else if(name == null){
				console.log('city')
				let param = {
					countryCode: this.cumData.countryCode,
					state: this.cumData.state,
					city: this.cumData.city,
					...params
				}
				this.$api['salesShopDayOldCustCityExport'](param).then(data => {
					downloadFile(data, '成交统计' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
				})
			}
		},
    async getChartsData(startTime, endTime) {
      this.showChartChild_1(1, startTime, endTime);
      this.showChartChild_1(2, startTime, endTime);
      
      let result = await this.getCountries();
      if (result) {
        this.getStates();
		
      }
	  setTimeout(()=>{
		  this.getCountryTable(startTime, endTime );
	  },500)
	  
    },
    // 获取chartRank表格数据
    showChartChild_1(type, startTime, endTime , value) {
      let opts = {
        startTime: startTime || this.DateMsg.DateValue[0],
        endTime: endTime || this.DateMsg.DateValue[1],
        sellerId: this.sellerId,
        siteId: this.siteId,
        parentSkus: this.$store.state.common.select_parentSkuMain && this.$store.state.common.select_parentSkuMain.length ? this.$store.state.common.select_parentSkuMain : this.$store.state.common.parentSkusAll,
        skus : this.$store.state.common.select_childSku && this.$store.state.common.select_childSku.length ? this.$store.state.common.select_childSku : this.$store.state.common.childSkusAll
      };
			// if (!opts.parentSkus.length) {
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
        URL = "SalesShopDayDistOldCustCountry";
        
      } else if (type == 2) {
        this.dialogLoading2 = true;
        URL = "SalesShopDayDistOldCustState";
        opts.countryList=value || ["US"];
        if( !value ){
           this.value7=['US'];
           this.oldValue7=['US'];
        };
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
              }
              this.dialogLoading1 = false;
              this.dialogLoading2 = false;
              return;
            }
            this.$nextTick(() => {
              this.chartData.chartShow = true;
              this.list = data.data;
              if (type == 1) {
                this.list1 = data.data;
              } else if (type == 2) {
                this.list2 = data.data;
              }
              // 饼状图
              let list_ = [];
              // todo
              list.forEach((el, index) => {
                if (type == 1) {
                  list_.push({
                    y: el.customerCnt,
                    x: el.countryCode + " "
                  });
                } else if (type == 2) {
                  list_.push({
                    y: el.customerCnt,
                    x: el.state,
                    c: el.proportion
                  });
                }
              });
              // 柱状图
              let dom1 = document.getElementById("eChart1");
              let dom3 = document.getElementById("eChart3");
              this.drawEchart1(dom1, list_, type);
              this.drawEchart1(dom3, list_, type);
              // 饼状图
              let dom2 = document.getElementById("eChart2");
              let dom4 = document.getElementById("eChart4");
              this.drawEchart2(dom2, list_, type);
              this.drawEchart2(dom4, list_, type);
            });
          } else if (code == 500) {
            if (type == 1) {
              this.chartData.chartShow1 = false;
            } else if (type == 2) {
              this.chartData.chartShow2 = false;
            }
          }
          this.dialogLoading1 = false;
          this.dialogLoading2 = false;
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
        });
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
        }
        return;
      } else {
        if (type == 1) {
          this.chartData.chartShow1 = true;
        } else if (type == 2) {
          this.chartData.chartShow2 = true;
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
      // 设置一下表格首次能看到几个数是
      let length = dataAxis.length;
      let start, end;
      if (length <= 10) {
        start = 0;
        end = 100;
      }
      if (length > 10 && length <= 30) {
        start = 0;
        end = 40;
      }
      if (length > 30 && length <= 50) {
        start = 0;
        end = 30;
      }
      if (length > 50) {
        start = 0;
        end = 20;
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
        rotate = 30;
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
          left: "8%",
          right: "8%",
          bottom: 100,
          // containLabel: true
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
          },
          position :"left"
        },
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 0,
            zoomOnMouseWheel: false,
            end: 12,
            // maxValueSpan: 26
          },
          {
            start: 0,
            end: end,
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
        title = "国家分布";
      } else if (type == 2) {
        title = "州分布";
      }
      option.title = {
        text: title,
        textStyle: {
          fontSize: "14px",
          color: "#909399"
        }
      };
      let xName = "";
      if (type == 1) {
        xName = "国家";
      } else if (type == 2) {
        xName = "州";
      }
      option.xAxis.name = xName;
      // console.log(list, "排名数据");
      // legend 不可点击
      option.grid.top = "16%";
      if (length < 5) {
        delete option.dataZoom;
      }
      if (option.series == "") {
        if (type == 1) {
          this.chartData.chartShow1 = false;
        } else if (type == 2) {
          this.chartData.chartShow2 = false;
        }
      } else {
        if (type == 1) {
          this.chartData.chartShow1 = true;
        } else if (type == 2) {
          this.chartData.chartShow2 = true;
        }
      }
      if (type == 1) {
        this.echartData1 = option;
      } else if (type == 2) {
        this.echartData3 = option;
      }
      // console.log(et, "et");
      // todo
	  setTimeout(() => {
          et.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'dataZoomSelect',
            // 启动或关闭
            dataZoomSelectActive: true
          });
      });
      et.on("click", this.getDetails1);
    },
    async getDetails1(param) {
			this.exportName = param.name;
      console.log(param, "重要的参数都在这里！"); //重要的参数都在这里！
      if (!param.city) {
        let name = param.name;
				// let data = param.data.value ? param.data.value : param.data;
        let result1 = this.list1.find(el => {
          // 2加个空格在后面区别不同的图
          return el.countryCode + " " === name;
          //  && el.customerCnt === data;
        });
        let result2 = this.list2.find(el => {
          return el.state === name;
          //  && el.customerCnt === data;
        });
        // console.log(result1, "result1");
        // console.log(result2, "result2");
        if (result1) {
          this.URL = "SalesShopDayDistOldCustCountryDetail";
          this.exportPath='salesShopDayOldCustCountryExport';
          this.cumData.countryCode = param.name;
          this.cumData.state = "";
          this.cumData.city = "";
        } else if (result2) {
          let countryCode = result2.countryCode;
          this.cumData.countryCode = countryCode;
          this.cumData.state = param.name;
          this.cumData.city = "";
          this.URL = "SalesShopDayDistOldCustStateDetail";
          this.exportPath='salesShopDayOldCustStateExport';
        }
        this.cumData.title = param.name + "的客户";
      } else if (param.city) {
        // console.log(param, "row");
        this.cumData.countryCode = param.countryCode;
        this.cumData.state = param.state;
        this.cumData.city = param.city;
        this.URL = "SalesShopDayDistOldCustCityDetail";
        this.exportPath='salesShopDayOldCustCityExport';
        this.cumData.title = param.city + "的客户";
      }
      this.cumData.table.rows = [];
      this.cumData.show = true;
      let arg = {
        pageSize: 10,
        pageNumber: 1
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
        countryCode: this.cumData.countryCode,
        state: this.cumData.state,
        city: this.cumData.city,
        ...arg
        // sortField: ,
        // sort: 0,
      };
      // if (!params.parentSkus.length) {
      //   this.cumData.table.rows = [];
      //   this.cumData.table.pageNumber = 1;
      //   this.cumData.table.pageSize = 10;
      //   this.cumData.table.total = 0;
      //   return false;
      // }
      params = this.$.dealObjectValue(params);
      let setParams={...params};
      console.log(this.exportName);
      //return
	  this.$store.commit("pubilcTime/customerDistributionTime",[params.startTime,params.endTime]);
      this.$router.push(
        {name:"TSdatails",query:{name:this.cumData.title,Listpath:this.URL,exportName:this.exportName,exportPath:this.exportPath,type:2, ...setParams},
        params:{rows:setParams}})
        
    },
    // 饼状图
    drawEchart2(dom, list, type) {
      let et = echarts.init(dom);
      // et.clear();
      let option = {
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
          // 1 加个空格在后面区别不同的图 下面还有第二部 // 2
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
        series: [
          {
            name: "占比",
            type: "pie",
            radius: ["0%", "75%"],
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
        ]
      };
      option.title = {
        textStyle: {
          fontSize: "14px",
          color: "#909399"
        }
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
        }
        return;
      } else {
        if (type == 1) {
          this.chartData.chartShow1 = true;
        } else if (type == 2) {
          this.chartData.chartShow2 = true;
        }
      }
      // console.log(list);
      option.series = [
        {
          name: "占比",
          type: "pie",
          radius: ["0", "60%"],
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
        if ((item.c >= 0.01 && type == 2) || type == 1) {
		// if (type == 2 || type == 1) {
          option.legend.data.push(x); // legend
          // option.color.push(item.color); // legend
          option.series[0].data.push({
            // 使用直接push改变原来的数组对象
            value: item.y,
            name: x
          }); // series 中的data
        }
      });
      if (option.series[0].data == "") {
        if (type == 1) {
          this.chartData.chartShow1 = false;
        } else if (type == 2) {
          this.chartData.chartShow2 = false;
        }
      } else {
        if (type == 1) {
          this.chartData.chartShow1 = true;
        } else if (type == 2) {
          this.chartData.chartShow2 = true;
        }
      }
      if (type == 1) {
        option.title.text = "";
        this.echartData2 = option;
      } else if (type == 2) {
		option.title.text = "";
        // option.title.text = "(此处不展示占比约为0%的数据)";
        this.echartData4 = option;
      }
      et.on("click", this.getDetails1);
    },
    getCountryTable(arg) {
      if (this.cumData.show === true) {
        this.getDetails2(arg);
      } else {
        // if(this.value5===['US']){
        //      this.select_country=['US'];
        // };
        // if(this.value6===['CA']){
        //     this.select_stateList=['CA'];
        // };
        // console.log(this.value5);
        // console.log(this.value6);
        // console.log(this.select_country);
        // console.log(this.select_stateList);
        //console.log(arg);
        if( arg ) {
            if( !arg.select){
              let num = this.options.find(el=>el.country==='US')
              this.value5 = [num.value];
			  let val5 = ['US']
              this.select_country = val5

              // this.value6= ['CA'];
              this.select_stateList = this.value6;
              //console.log('object');
            };
        };
        if( !arg){
              
			  let num = this.options.find(el=>el.country==='US')
			  this.value5 = [num.value];
			  let val5 = ['US']
			  this.select_country = val5
              // this.select_country = this.value5;

              // this.value6= ['CA'];
              this.select_stateList = this.value6;
              // console.log('666')
        };
        let params = {
          sellerId: this.sellerId,
          siteId: this.siteId,
          startTime: this.DateMsg.DateValue[0],
          endTime: this.DateMsg.DateValue[1],
		  parentSkus: this.$store.state.common.select_parentSkuMain && this.$store.state.common.select_parentSkuMain.length ? this.$store.state.common.select_parentSkuMain : this.$store.state.common.parentSkusAll,
		  skus : this.$store.state.common.select_childSku && this.$store.state.common.select_childSku.length ? this.$store.state.common.select_childSku : this.$store.state.common.childSkusAll,
          countryList: this.select_country,
          stateList: this.select_stateList,
          pageSize: this.table.pageSize,
          pageNumber: this.table.pageNumber,
          ...arg
        };
		let PAr = this.$store.state.common.select_parentSkuMain
		let CHi = this.$store.state.common.select_childSku
		if( (PAr && PAr.length) || (CHi && CHi.length) ){
		  if(CHi && CHi.length) params.parentSkus = null
		  if( (PAr && PAr.length) && !(CHi && CHi.length) ) params.skus = null
		}
		
		if(params.stateList && params.stateList.includes('all')) params.stateList = null
        
        params = this.$.dealObjectValue(params);
		
        this.table.loading = true;
        this.$api["SalesShopDayDistOldCustCity"](params)
          .then(data => {
            this.table.loading = false;
            this.table.rows = data.rows;
            this.table.pageNumber = data.pageNo;
            this.table.pageSize = data.pageSize;
            this.table.total = data.total;
            if( ! data.rows .length){
                this.table.total = 0;
                this.table.pageNumber = 1;
                this.table.pageSize = 10;
            };
          })
          .catch(err => {
            this.table.rows = [];
            this.table.pageNumber = 1;
            this.table.pageSize = 10;
            this.table.total = 0;
            this.table.loading = false;
          });
      }
    },
    // 获取国家列
    getCountries() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        flag: 0
      };
      return this.$api["AddressList"](params)
        .then(data => {
          // console.log(data, "data");
          let arr = data.data;
          this.select_country = [];
          this.value5 = [];
          this.oldOptions = [];
          // if (!arr) {
          //   this.$msgbox({
          //     title: "提示",
          //     message: "获取父sku列表失败，请刷新页面",
          //     showCancelButton: true,
          //     confirmButtonText: "刷新",
          //     cancelButtonText: "取消"
          //   })
          //     .then(action => {
          //       location.reload();
          //     })
          //     .catch(err => {});
          //   return;
          // }
          this.options = [
            {
              value: "all",
              country: "全部"
            }
          ];
          arr.forEach((item, index) => {
            this.options.push({
              value: index,
              country: item.countryCode
            });
            //this.select_country.push(item.countryCode);
          });
          // console.log(this.options, "options");
          this.options.forEach((item, index) => {
            if(item.country === 'US'){  

                //默认 US
                this.value5.push(item.value);
                // 用于组成country数据
                this.oldOptions.push(item.value);
                  this.select_country.push(item.country);
            };
         
            // this.$store.commit(
            //   "common/select_parentSku",
            //   this.select_parentSku
            // );
          });
          return data;
        })
        .catch(err => {
          //   console.log(err, "err");
          return false;
        });
    },
    selectCountryFun() {
      let arr_ = JSON.parse(JSON.stringify(this.value5));
      if (arr_.includes("all")) {
        arr_.splice(0, 1);
      }
	  console.log(arr_)
      // 用于组成parent数据
      this.select_country = [];
      arr_.forEach(item => {
        let result = this.options.find(el => el.value === item);
        if (result) {
          // 用于复制数据
          this.select_country.push(result.country);
        }
      });
    },
    selectValue7(val){
       // console.log(val);
       if (this.oldValue7.includes("全部") && !val.includes("全部")) {
        this.value7 = ['US'];
        // 每次都要把选中的值保存
        this.oldValue7 = this.value7;
      }
      // 2反选
      else if (!this.oldValue7.includes("全部") && val.includes("全部")) {
        this.value7 = [];
        this.options.forEach(item => {
          this.value7.push(item.country);
        });
        // 每次都要把选中的值保存
        this.oldValue7 = this.value7;
      }
      // 3其他选项未全部选中
      else if (this.oldValue7.includes("全部") && val.includes("全部")) {
        const index = val.indexOf("全部");
        val.splice(index, 1);
        this.value7 = val;
        // 每次都要把选中的值保存
        this.oldValue7 = this.value7;
      }
      // 4其他选项已经全部选中
      else if (!this.oldValue7.includes("全部") && !val.includes("全部")) {
        if (val.length === this.options.length - 1) {
          this.value7 = ["全部"].concat(val);
          // 每次都要把选中的值保存
          this.oldValue7 = this.value7;
        }
      };
      //console.log(this.value7);
      let  startTime=this.DateMsg.DateValue[0] ;
      let  endTime=this.DateMsg.DateValue[1];
      let arr=[];
      this.value7.forEach(i=>{
          this.options.forEach(j=>{
            //console.log(j);
            if(j.country===i && j.country!=='全部'){
              arr.push(j.country)
            };
        });
      });
      // console.log(arr);
      // return
      // if( !arr.length ){
      //     arr=['US'];
      //     //this.value7=['US'];
      // };
      this.showChartChild_1(2, startTime, endTime,arr);
    },
    // 选择国家
    async selectAll(val) {
        // console.log(this.oldOptions, "this.oldOptions");
        // console.log(val, "val");
        this.table.pageNumber=1;
      // 1正选
      if (this.oldOptions.includes("all") && !val.includes("all")) {
        let num = this.options.find(el=>el.country==='US')
        this.value5 = [num.value];
        // 每次都要把选中的值保存
        this.oldOptions = this.value5;
        this.selectCountryFun();
        let result = await this.getStates();
        if (result) {
          this.getCountryTable( {select:true} );
        } else {
          this.table.rows = [];
          this.table.pageNumber = 1;
          this.table.pageSize = 10;
          this.table.total = 0;

        }
        return;
      }
      // 2反选
      if (!this.oldOptions.includes("all") && val.includes("all")) {
        
        this.value5 = [];
        this.options.forEach(item => {
          this.value5.push(item.value);
        });
        //console.log(this.value5);
        this.oldOptions = [];
        // 每次都要把选中的值保存
        this.oldOptions = this.value5;
        this.selectCountryFun();
        let result = await this.getStates();
   
        if (result) {
          this.getCountryTable( {select:true} );
        } else {
          this.table.rows = [];
          this.table.pageNumber = 1;
          this.table.pageSize = 10;
          this.table.total = 0;
        };
             
        return;
      }
      // 3其他选项未全部选中
      if (this.oldOptions.includes("all") && val.includes("all")) {
        const index = val.indexOf("all");
        val.splice(index, 1);
        this.value5 = val;
        // 每次都要把选中的值保存
        this.oldOptions = this.value5;
        this.selectCountryFun();
        let result = await this.getStates();
        if (result) {
          this.getCountryTable( {select:true} );
        } else {
          this.table.rows = [];
          this.table.pageNumber = 1;
          this.table.pageSize = 10;
          this.table.total = 0;
        }
        return;
      }
      // 4其他选项已经全部选中
      if (!this.oldOptions.includes("all") && !val.includes("all")) {
        if (val.length === this.options.length - 1) {
          this.value5 = ["all"].concat(val);
          // 每次都要把选中的值保存
          this.oldOptions = this.value5;
        }
        this.selectCountryFun();
        let result = await this.getStates();
        if (result) {
          this.getCountryTable( {select:true});
        } else {
          this.table.rows = [];
          this.table.pageNumber = 1;
          this.table.pageSize = 10;
          this.table.total = 0;
        }
        return;
      }
    },
    // 获取州数据
    getStates() {
      // console.log(this.value5);
      // return
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        flag: 1,
        countryList: this.select_country
      };
      params = this.$.dealObjectValue(params);
      if (!params.countryList) {
        this.select_stateList = [];
        this.oldOptions6 = [];
        this.value6 = [];
        this.options6 = [];
        // return false;
      }
      return this.$api["AddressList"](params)
        .then(data => {
          // console.log(data, "data2");
          this.select_stateList = [];
          this.oldOptions6 = [];
          this.value6 = [];
          let arr = data.data;
          if (!arr) {
            this.options6 = [];
            return;
          }
          this.options6 = [
            {
              value: "all",
              state: "全部"
            }
          ];
          arr.forEach((item, index) => {
            if (item.state) {
              this.options6.push({
                value: index,
                state: item.state
              });
            }
            // if (item.state) {
            //   this.select_stateList.push(item.state);
            // }
          });
          //console.log(this.options6, "options6");
          this.options6.forEach((item, index) => {
            // if(item.state==='CA'){
            //     this.value6.push(item.value);
            //     // 用于组成country数据
            //     this.oldOptions6.push(item.value);
            //     this.select_stateList.push(item.state);
            // };
            // if(this.value5.includes('all')){
                this.value6.push(item.value);
                this.oldOptions6.push(item.value);
                this.select_stateList.push(item.state);
            // };
          });
          return data;
        })
        .catch(err => {
          this.table.rows = [];
          this.table.pageNumber = 1;
          this.table.pageSize = 10;
          this.table.total = 0;
          console.log(err, "err");
          return false;
        });
    },
    selectCountryFun2() {
      let arr_ = JSON.parse(JSON.stringify(this.value6));
      if (arr_.includes("all")) {
        arr_.splice(0, 1);
      }
      // 用于组成parent数据
      this.select_stateList = [];
      arr_.forEach(item => {
        let result = this.options6.find(el => el.value === item);
        if (result) {
          // 用于复制数据
          this.select_stateList.push(result.state);
        }
      });
    },
    // 选择州
    async selectAll2(val) {
      // console.log(this.oldOptions6, "this.oldOptions");
      // console.log(val, "val");
      // 1正选
      this.table.pageNumber=1;
      if (this.oldOptions6.includes("all") && !val.includes("all")) {
        this.value6 = [];
        // 每次都要把选中的值保存
        this.oldOptions6 = this.value6;
        this.selectCountryFun2();
        // console.log(this.select_stateList);
        if (this.select_country && this.select_country.length) {
          this.getCountryTable( {select:true} );
        }
        // let result = await this.getStates();
        // if (result) {
        //   this.getCountryTable();
        // } else {
        //   this.table.rows = [];
        // }
        return;
      }
      // 2反选
      if (!this.oldOptions6.includes("all") && val.includes("all")) {
		
        this.value6 = [];
        this.options6.forEach(item => {
          this.value6.push(item.value);
        });
        this.oldOptions6 = [];
        // 每次都要把选中的值保存
        this.oldOptions6 = this.value6;
        this.selectCountryFun2();
        if (this.select_country && this.select_country.length) {
          this.getCountryTable( {select:true} );
        }
        // let result = await this.getStates();
        // if (result) {
        //   this.getCountryTable();
        // } else {
        //   this.table.rows = [];
        // }
        return;
      }
      // 3其他选项未全部选中
      if (this.oldOptions6.includes("all") && val.includes("all")) {
        const index = val.indexOf("all");
        val.splice(index, 1);
        this.value6 = val;
        // 每次都要把选中的值保存
        this.oldOptions6 = this.value6;
        this.selectCountryFun2();
        if (this.select_country && this.select_country.length) {
          this.getCountryTable( {select:true} );
        }
        // let result = await this.getStates();
        // if (result) {
        //   this.getCountryTable();
        // } else {
        //   this.table.rows = [];
        // }
        return;
      }
      // 4其他选项已经全部选中
      if (!this.oldOptions6.includes("all") && !val.includes("all")) {
        if (val.length === this.options6.length - 1) {
          this.value6 = ["all"].concat(val);
          // 每次都要把选中的值保存
          this.oldOptions6 = this.value6;
        }
        this.selectCountryFun2();
        if (this.select_country && this.select_country.length) {
          this.getCountryTable( {select:true} );
        }
        // let result = await this.getStates();
        // if (result) {
        //   this.getCountryTable();
        // } else {
        //   this.table.rows = [];
        // }
        return;
      }
    }
  },
  computed: {},
  watch: {},
};
</script>

<style lang='scss' scoped>
.__box_wrapper__local_page {
  display: flex;
  margin: 12px 10px -25px;
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
