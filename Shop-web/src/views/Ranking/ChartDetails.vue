<template>
  <div class="box">
    <div class="box-info">
      <span style="display: flex;align-items:center;">筛选条件</span>
      <span>
        <el-button type="text" icon="el-icon-back" @click="backPage" size="mini">返回</el-button>
      </span>
    </div>
    <div class="box-query">
      <el-form :inline="true" :model="listQuery" ref="listQueryForm">
        <el-form-item label="页码:" prop="minCurrentPages" class="section-input">
          <el-input v-model.trim="listQuery.minCurrentPages" placeholder="始页码数" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="~" prop="maxCurrentPages" class="section-input">
          <el-input v-model.trim="listQuery.maxCurrentPages" placeholder="末页码数" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="排名:" prop="minCurrentRank" class="section-input">
          <el-input v-model.trim="listQuery.minCurrentRank" placeholder="始排名值" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="~" prop="maxCurrentRank" class="section-input">
          <el-input v-model.trim="listQuery.maxCurrentRank" placeholder="末排名值" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button size="mini" type="primary" plain v-for="item in ['确认搜索','重置搜索']" @click="distribute(item)">{{item}}</el-button> -->
          <el-button size="small" type="primary" @click="distribute('确认搜索')" icon="el-icon-search" :loading="$store.state.isloading || $store.state.loading">搜索</el-button>
          <el-button size="small" type="primary" plain @click="distribute('重置搜索')" :disabled='$store.state.isloading || $store.state.loading'>重置搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="box-update-btn">
      <el-button type="primary" plain size="mini" v-for="item in ['导出']" @click="distribute(item)" :disabled="$store.state.isloading || $store.state.loading">{{item}}</el-button>
      <a v-show="false" ref="exportExcel"></a>
    </div>
    <div class="box-data">
      <el-table :data="list" v-loading="listLoading" :key='tableKey' style="width: 100%" border stripe @selection-change="handleSelectionChange" @sort-change="handleSortChange" tooltip-effect="light">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="imageUrl" label="图片" width="80">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <img :src="scope.row.imageUrl" style="width: 300px;height: 150px;object-fit: contain;overflow: hidden;" />
              <div class="__img_wrapper" slot="reference">
                <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="parentAsin" label="父ASIN" width="120">
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <a @click="openWebsite(scope.row.productUrl)" class="a-title">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="webRankPages" :sortable="'custom'" label="页码" min-width="80">
        </el-table-column>
        <el-table-column prop="webPagesRank" :sortable="'custom'" label="排名" min-width="80">
        </el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="查看详情" placement="top-start">
              <el-button type="text" size="mini" icon="el-icon-search" @click="viewDetails(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <yt-dialog :options="options" :events="events" class="chart-dialog">
      <el-form :inline="true" :model="ruleForm" ref='formInline'>
        <el-form-item label="监控周期:" prop="daterange"  :rules="{ required: true, message: '请选择时间', trigger: 'change' }" >
          <el-date-picker v-model="ruleForm.daterange" type="daterange" 
           range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
           size="mini" 
           :picker-options="pickerOptions" 
           value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="multipleFrequency" class="form-item-multipleFrequency" :rules="{ required: true, message: '请输入', trigger: 'change' }">
          <el-input v-model.trim="ruleForm.multipleFrequency" placeholder="请输入正整数" size="mini"></el-input><span>倍频率展示</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain size="mini" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
      <div v-loading="chartLoading" :key='chartKey' class="chart-body" ref="chart"> </div>
    </yt-dialog>

    <!-- {{new Date($route.query.startTime).getTime()}} -->
  </div>
</template>
<script>
const _ = require("lodash");
import echarts from "echarts";
// import {checkWords} from "../KeyLexicon/utils";
import { CONST_PORT_CONFIG } from "Config";
const dayjs = require("dayjs");
const { BASE_URL } = CONST_PORT_CONFIG;
export default {
  data() {
    return {
      pickerOptions: {
        // disabledDate(time) {
        //     return new Date(this.$route.query.startTime).getTime() < time.getTime() <new Date(this.$route.query.endTime).getTime()
        // }
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      sortProp: null,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        taskId: null,
        taskFlag: null,
        minRank: null,
        maxRank: null,
        minPages: null,
        maxPages: null,
        minCurrentRank: null,
        maxCurrentRank: null,
        minCurrentPages: null,
        maxCurrentPages: null,
        startTime: null,
        endTime: null
      },
      options: {
        visible: false,
        width: "1050px",
        title: "数据展示",
        okBtnText: "关闭"
      },
      events: {
        handleOkClick: () => {
          this.options.visible = false;
        }
      },
      chartKey: 0,
      chartLoading: false,
      ruleForm: {
        daterange: [],
        taskId: null,
        parentAsin: null,
        startTime: null,
        endTime: null,
        multipleFrequency: 1, //X倍频率，默认1
        taskFlag: null
      },
      chart: null,
      splitNumber: null,
      legendData: ["排名"],
      xAxisData: [],
      series: [],
      tooltipMap: new Map(),
      multipleSelection: []
    };
  },
  created() {
    let query = this.$route.query;
    this.listQuery.taskFlag = parseInt(query.taskFlag);
    this.listQuery.taskId = parseInt(query.taskId);

    this.listQuery.minRank = query.minRank;
    this.listQuery.maxRank = query.maxRank;
    this.listQuery.minPages = query.minPages;
    this.listQuery.maxPages = query.maxPages;
    this.listQuery.startTime = query.startTime;
    this.listQuery.endTime = query.endTime;
    this.listQuery.week = query.week;
    this.listQuery.hour = query.hour;

    this.getList();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    handleSortChange({ column, prop, order }) {
      if (!prop) {
        this.sortProp = null;
        this.handleFilter();
        return;
      }
      console.log(column, prop, order);
      const sortOrder = `${prop.replace(/[A-Z]{1}/g, function(str) {
        return "_" + str.toLowerCase();
      })} ${order === "ascending" ? "asc" : "desc"}`;
      this.sortProp = sortOrder;
      this.handleFilter();
    },
    distribute(btn) {
      switch (btn) {
        case "确认搜索":
          this.getList();
          break;
        case "重置搜索":
          this.resetListQueryForm();
          break;
        case "导出":
          this.downloadExcel();
          break;
      }
    },
    getList() {
      let listQuery = _.cloneDeep(this.listQuery);
      if (this.sortProp) {
        let sortPropArr = this.sortProp.split(" ");
        if (sortPropArr.length === 2) {
          let sortField = sortPropArr[0];

          listQuery.field = sortField;
          if (sortPropArr[1] === "desc") {
            listQuery.sort = 0;
          } else {
            listQuery.sort = 1;
          }
        } else {
          listQuery.field = null;
          listQuery.sort = 0;
        }
      } else {
        listQuery.field = null;
        listQuery.sort = 0;
      }
      this.listLoading = true;
      this.$api["keywordRankFqRtProductList"](listQuery)
        .then(res => {
          let { rows, total } = res;
          this.list = rows;
          this.total = total;

            this.listLoading = false;
       
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.pageNumber = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getList();
    },
    resetListQueryForm() {
      this.daterange = [];
      this.$refs.listQueryForm.resetFields();
        this.getList();
    },

    backPage() {
      let startTime = this.listQuery.startTime;
      let createTime = null;
      if (startTime !== null) {
        createTime = startTime.substring(0, 10);
      } else {
        createTime = dayjs().format("YYYY-MM-DD");
      }
      let path = "";
      if (this.listQuery.taskFlag == 1) {
        path = "/ranking/normal/chart";
      } else {
        path = "/ranking/ad/chart";
      }
      this.$router.push({
        path: path,
        query: {
          taskId: this.listQuery.taskId,
          taskFlag: this.listQuery.taskFlag,
          createTime
        }
      });
    },

    openWebsite(url) {
      window.open(url);
    },
    viewDetails(row) {
   
      this.options.visible = true;
      this.ruleForm.taskId = row.taskId;
      this.ruleForm.parentAsin = row.parentAsin;
      this.ruleForm.taskFlag = this.listQuery.taskFlag;
      let nowTime = dayjs().format("YYYY-MM-DD");
      this.ruleForm.daterange = [nowTime, nowTime];
      let startTime=this.$route.query.startTime.split(' ')[0];
   
      this.pickerOptions = {
          disabledDate(time){
            return (
             time.getTime() < (new Date(startTime).getTime()-24*60*60*1000)
              ||
              time.getTime() > new Date().getTime()
            )
          }
      };
      //   let startTime=this.listQuery.startTime
      //   let endTime =this.listQuery.endTime
      //   if(startTime!==null&&endTime!==null){
      //       this.ruleForm.daterange =[startTime,endTime]
      //   }
      this.searchData();
    },
    getChart() {
      if (this.chart === null) {
        this.$nextTick(function() {
          this.chart = echarts.init(this.$refs.chart);
          this.loadChart();
        });
      } else {
        this.loadChart();
      }
    },
    loadChart() {
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
        this.chart.clear();
        let option = {
          tooltip: this.getTooltip(),
          legend: {
            data: this.legendData
          },
          grid: {
            left: "9%",
            right: "12%",
            bottom: "11%",
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
            type: "category",
            boundaryGap: false,
            data: this.xAxisData,
            triggerEvent: true,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            min: -1,
            splitNumber: this.splitNumber, // 可能要设置
            type: "value",
            axisLabel: {
              formatter: function(value) {
                // y轴 过滤 0到-1 之间的过滤掉
                if (value < 0 && value > -1) {
                  return null;
                }
                return value;
              }
            }
          },
          series: this.series
        };

        if (this.xAxisData.length > 7) {
          option.dataZoom = [
            {
              type: "inside",
              start: 0,
              end: 10
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
          ];
        }

        this.chart.setOption(option);
      }
    },
    searchData() {
      this.$nextTick(function(){
        let istrue=true;
        console.log(this.$refs.formInline);
        this.$refs.formInline.validate((valid) => {
          if (valid) {
            istrue=true;
            console.log(istrue);
          } else {
            istrue=false;
            console.log(istrue);
          }
        });
        
        if(!istrue){
          return
        };
        let daterange = this.ruleForm.daterange;
        if (daterange !== null && daterange.length === 2) {
          this.ruleForm.startTime = daterange[0];
          this.ruleForm.endTime = daterange[1];
        } else {
          this.ruleForm.startTime = null;
          this.ruleForm.endTime = null;
        }
        let ruleForm = _.cloneDeep(this.ruleForm);
        delete ruleForm.daterange;
        this.chartLoading = true;
        this.$api["keywordRankFqRtRecList"](ruleForm)
          .then(res => {
            let { code, data } = res;
            // console.log('6666666666666666666666666666666666666;l');
            // console.log(res);
            if (code === 0) {
              let seriesData = [];
              let xAxisData = [];
              this.tooltipMap.clear();
              data.forEach(element => {
                seriesData.push(element.webRank);
                xAxisData.push(element.sendTime);
                this.tooltipMap.set(
                  element.sendTime,
                  `&nbsp;第${element.webRankPages}页第${element.webPagesRank}名`
                );
              });
              let webRankArr = _.uniq(seriesData);
              if (webRankArr.length === 1) {
                this.splitNumber = 1;
              } else {
                this.splitNumber = null;
              }
              this.series = [
                {
                  name: "排名",
                  type: "line",
                  step: "start",
                  data: seriesData
                }
              ];
              this.xAxisData = xAxisData;
              this.getChart();
            }
            setTimeout(() => {
              this.chartLoading = false;
            }, 500);
          })
          .catch(() => {
            this.chartLoading = false;
          });
        })
    },
    getTooltip() {
      let tooltip = {
        trigger: "axis"
      };
      let self = this;
      tooltip.formatter = function(param) {
        console.log(param);
        let tooltipStr = self.tooltipMap.get(param[0].name);
        // return (
        // param[0].marker +param[0].seriesName +
        // ":&nbsp;" +
        // param[0].value
        // "<br/>" +
        // tooltipStr
        // );
        return (
          param[0].marker + `&nbsp;${param[0].axisValue}<br/>` + tooltipStr
        );
      };
      return tooltip;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadExcel() {
      let parentAsins = [];
      this.multipleSelection.forEach(element => {
        parentAsins.push(element.parentAsin);
      });
      let params = {
        taskId: this.listQuery.taskId,
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime,
        taskFlag: this.listQuery.taskFlag,

        minRank: this.listQuery.minRank,
        maxRank: this.listQuery.maxRank,
        minPages: this.listQuery.minPages,
        maxPages: this.listQuery.maxPages,
        minCurrentRank: this.listQuery.minCurrentRank,
        maxCurrentRank: this.listQuery.maxCurrentRank,
        minCurrentPages: this.listQuery.minCurrentPages,
        maxCurrentPages: this.listQuery.maxCurrentPages,
        field: null,
        sort: 0,
        parentAsins
      };

      let query = this.$route.query;
      if(query){
          params.week=query.week;
          params.hour=query.hour;
      }

      if (params.parentAsins.length === 0) {
        params.parentAsins = null;
      }

      if (params.minRank === null) {
        delete params.minRank;
      }
      if (params.maxRank === null) {
        delete params.maxRank;
      }

      if (params.minPages === null) {
        delete params.minPages;
      }
      if (params.maxPages === null) {
        delete params.maxPages;
      }

      this.$ajax({
        method: "post",
        url: BASE_URL + "keywordRankFqRt/exportData",
        responseType: "blob",
        data: params
      })
        .then(data => {
          let { type } = data;
          if (type === "application/json") {
            this.$message.error("导出失败");
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let a = this.$refs.exportExcel;
          a.href = url;
          a.setAttribute("download", "排名有变化的产品.xlsx");
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
// @import "~@/assets/style/base/variables.less";
.box {
  border: 1px solid @borderColor;
  padding: 10px;
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
  .box-update-btn {
    margin-top: 10px;
  }
  .box-data {
    .el-pagination {
      margin-top: 5px;
      padding-left: 0;
      /deep/.el-pagination__sizes {
        .el-input {
          margin-left: 0 !important;
        }
      }
    }
    .el-table__row {
      .a-title {
        color: #2f00cc;
        text-decoration: underline;
      }
    }
  }

  .chart-dialog {
    /deep/.el-dialog__body {
      padding-bottom: 0;
    }
    .el-range-editor {
      width: 240px;
      /deep/.el-range-separator {
        width: 20px;
      }
    }
    .form-item-multipleFrequency {
      /deep/.el-input {
        width: 205px;
        margin-right: 5px;
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
  }
}
</style>


