<template>
  <div>
    <!-- <Navigation>
            <div slot="breadcrumb" class="breadcrumb"><span class="link" @click="routerGo(-1)">广告数据分析</span> / 广告数据详情</div>
            <div slot="back" class="back"><i class="el-icon-back" @click="backPage">返回</i></div>
    </Navigation>-->
    <y-template>
      <!-- <div slot="ScreenBack" class="screen-back">
                <div>筛选条件</div>
                <div class="back" @click="backPage"><i class="el-icon-back"></i>返回</div>
      </div>-->

      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <el-form-item label="关键词" prop="keywordText">
          <el-input v-model="listQuery.keywordText" placeholder="请输入" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            :icon="item === '搜索' ? 'el-icon-search' : ''"
            :plain="item !== '搜索'"
            v-for="item in ['搜索','重置搜索']"
            :loading="listLoading"
            @click="distribute(item)"
          >{{item}}</el-button>
        </el-form-item>
      </el-form>
      <!-- @selection-change="handleSelectionChange" -->
      <el-table
        slot="table"
        :data="list"
        v-loading="listLoading"
        :key="tableKey"
        style="width: 100%"
        border
        stripe
        @sort-change="handleSortChange"
        tooltip-effect="light"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="imageUrl" label="主图" width="80">
          <template slot-scope="scope">
            <el-popover :key="scope.row.imageUrl" placement="right" trigger="hover">
              <img :src="scope.row.imageUrl" style="width: 300px;height: 150px;object-fit: contain;overflow: hidden;">
              <div class="__img_wrapper __img_wrapper1" slot="reference">
                <img
                  class="loadingImg"
                  v-if="scope.row.imageUrl"
                  :key="scope.row.imageUrl"
                  v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'"
                >
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="keywordText" label="关键词" min-width="120" show-overflow-tooltip></el-table-column>

        <!--
                    :render-header="renderAdRank"
        -->
        <el-table-column prop="adRank" label="排名" min-width="80" :sortable="'custom'">
          <template slot-scope="scope">
            <div v-if="scope.row.adRank==null">-</div>
            <div v-else>{{scope.row.adRank}}</div>
          </template>
        </el-table-column>
        <!-- :formatter="formatterStarLevel" -->
        <el-table-column prop="advertCpc" label="CPC" min-width="80" :sortable="'custom'"></el-table-column>
        <el-table-column prop="advertExposure" label="曝光量" min-width="80" :sortable="'custom'"></el-table-column>
        <el-table-column
          prop="advertConversionRates"
          label="转化率"
          min-width="80"
          :sortable="'custom'"
          :formatter="formatterAdvertConversionRates"
        ></el-table-column>
        <el-table-column prop="advertHits" label="点击量" min-width="80" :sortable="'custom'"></el-table-column>
        <el-table-column prop="advertOrders" label="订单量" min-width="80" :sortable="'custom'"></el-table-column>
        <el-table-column
          prop="advertClickRates"
          label="点击率"
          min-width="80"
          :sortable="'custom'"
          :formatter="formatterAdvertClickRates"
        ></el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <!-- <el-tooltip effect="light" content="查看详情" placement="top-start"> -->
            <el-button
              v-if="!(scope.row.taskId===null||scope.row.keywordText===null)"
              type="text"
              size="mini"
              icon="el-icon-search"
              @click="viewDetails(scope.row)"
            ></el-button>
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        slot="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </y-template>

    <yt-dialog :options="options" :events="events" class="chart-dialog">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm">
        <el-form-item prop="abscissaType">
          <el-select v-model="ruleForm.abscissaType" placeholder="横坐标" size="mini" @change="changeAbscissaType">
            <el-option label="按时间" value="0"></el-option>
            <el-option label="按点击率" value="1"></el-option>
            <el-option label="按转化率" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="columns">
          <el-select
            v-model="ruleForm.columns"
            placeholder="右侧纵坐标"
            size="mini"
            multiple
            collapse-tags
            @change="changeColumns"
          >
            <el-option
              v-for="item in columnOptions"
              :label="item.label"
              :value="item.value"
              :key="item.value+'_column'"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          prop="daterange"
          style="margin-top: 2px;"
          :rules="[
                    { required: true, message: '请设置日期', trigger: ['blur'] }
                ]"
        >
          <el-date-picker
            v-model="ruleForm.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" plain size="mini" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
      <div v-loading="chartLoading" :key="chartKey" style="height:400px" class="chart-body" ref="chart">
        
      </div>
    </yt-dialog>
  </div>
</template>
<script>
const _ = require('lodash')
const dayjs = require('dayjs')
import echarts from 'echarts'
// import {checkWords} from "../KeyLexicon/utils";
import YTemplate from '../Common/y-template/index'
import Navigation from '../Common/y-template/navigation'
const columnTimeOptions = [
  { label: '广告曝光量', value: 'advertExposure' },
  { label: '广告点击量', value: 'advertHits' },
  { label: '广告订单量', value: 'advertOrders' },
  { label: '广告点击率', value: 'advertClickRates' },
  { label: '广告转化率', value: 'advertConversionRates' },
  { label: '广告花费', value: 'advertCost' },
  { label: '广告销售总额', value: 'advertSales' },
  { label: '广告CPC', value: 'advertCpc' },
  { label: '广告ACOS', value: 'advertAcos' },
  { label: '广告排名', value: 'adRank' }
]
const columnOptions = [
  { label: '广告曝光量', value: 'advertExposure' },
  { label: '广告CPC', value: 'advertCpc' }
]
const columns = [
  'advertExposure',
  'advertHits',
  'advertOrders',
  'advertClickRates',
  'advertConversionRates',
  'advertCost',
  'advertSales',
  'advertCpc',
  'advertAcos',
  'adRank'
]
export default {
  components: {
    YTemplate,
    Navigation
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      gradeOptions: [
        { label: '优', value: '1' },
        { label: '中', value: '2' },
        { label: '差', value: '3' },
        { label: '极差', value: '4' }
      ],
      sortProp: null,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        taskId: null,
        keywordText: null
      },
      options: {
        visible: false,
        width: '1000px',
        title: '数据展示',
				showFooter:false,
        okBtnText: '关闭',
        showCancel: false
      },
      events: {
        handleOkClick: () => {
          this.options.visible = false
        }
      },
      columnOptions: columnTimeOptions,
      chartKey: 0,
      chartLoading: false,
      ruleForm: {
        daterange: [],
        columns,
        taskId: null,
        keywordText: null,
        abscissaType: '0',
        startTime: null,
        endTime: null
      },
      chart: null,
      legendData: [],
      xAxisData: [],
      series: [],
      splitNumber: null,
      seriesDataArr: []
    }
  },
  created() {
    let query = this.$route.query

    this.listQuery.taskId = parseInt(query.taskId)

    // this.listQuery.startTime = query.startTime
    // this.listQuery.endTime = query.endTime

    this.getList()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    distribute(btn) {
      switch (btn) {
        case '搜索':
          this.getList()
          break
        case '重置搜索':
            this.resetListQueryForm()
        // break;
      }
    },
    changeAbscissaType(val) {
      this.searchData()
      if (val == 0) {
        this.columnOptions = columnTimeOptions
        this.ruleForm.columns = columns
      } else {
        this.columnOptions = columnOptions
        this.ruleForm.columns = ['advertExposure', 'advertCpc']
      }
    },
    changeColumns(val) {
      this.restOption()
    },
    formatterAdvertConversionRates(row, column) {
      let val = row.advertConversionRates
      if (val === null) {
        return '-'
      }
      return this.toPercent(val)
    },
    formatterAdvertClickRates(row, column) {
      let val = row.advertClickRates
      if (val === null) {
        return '-'
      }
      return this.toPercent(val)
    },
    toPercent(point) {
      if (isNaN(point) || point == 0) {
        return '0%'
      }

      let str = Number(point * 100).toFixed(2) //保留两位小数
      str += '%'
      return str
    },
    renderAdRank(h, { column, $index }) {
      // return column.label <i class="header-icon el-icon-info"></i>
      // return (
      //     <div>
      //         {column.label}
      //         <el-popover
      //             placement="top-start"
      //             title="提示"
      //             width="200"
      //             trigger="hover"
      //             >
      //                 <div>sdfsdf</div>
      //             <i class="header-icon el-icon-info" slot="reference"></i>
      //         </el-popover>
      //     </div>
      // )
      return (
        <el-tooltip
          content="- 正在抓取中，0 在前10页不能被搜索"
          placement="bottom"
          effect="light"
        >
          <div>
            {column.label}
            <i class="header-icon el-icon-info" />
          </div>
        </el-tooltip>
      )
    },
    formatterLevel(val) {
      switch (val) {
        case 1:
          return '优'
          break
        case 2:
          return '中'
          break
        case 3:
          return '差'
          break
        case 4:
          return '极差'
          break
        default:
          return '-'
      }
    },
    getList() {
      if (this.sortProp) {
        let sortPropArr = this.sortProp.split(' ')
        if (sortPropArr.length === 2) {
          let field = sortPropArr[0]

          this.listQuery.field = field
          if (sortPropArr[1] === 'desc') {
            this.listQuery.sort = 0
          } else {
            this.listQuery.sort = 1
          }
        } else {
          this.listQuery.field = null
          this.listQuery.sort = 0
        }
      } else {
        this.listQuery.field = null
        this.listQuery.sort = 0
      }
      this.listLoading = true
      this.$api['keywordAdRtList'](this.listQuery)
        .then(res => {
          let { rows, total } = res
          this.list = rows
          this.total = total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val
      this.getList()
    },
    handleSortChange({ column, prop, order }) {
      if (!prop) {
        this.sortProp = null
        this.handleFilter()
        return
      }
      console.log(column, prop, order)
      const sortOrder = `${prop.replace(/[A-Z]{1}/g, function(str) {
        return '_' + str.toLowerCase()
      })} ${order === 'ascending' ? 'asc' : 'desc'}`
      this.sortProp = sortOrder
      this.handleFilter()
    },
    resetListQueryForm() {
      this.listQuery.keywordText = null
      this.daterange = []
      this.$refs.listQueryForm.resetFields()
      this.getList()
    },

    backPage() {
      this.$router.push({
        path: '/ADManagement/DataAnalysis'
      })
    },
    viewDetails(row) {
      if (row.taskId === null || row.keywordText === null) {
        this.$message.warning('taskId为空或者关键词为空')
        return
      }
      this.options.visible = true
      // if(this.$refs['ruleForm']!==undefined){
      //     this.$refs['ruleForm'].resetFields();
      // }
      this.ruleForm.taskId = row.taskId
      this.ruleForm.keywordText = row.keywordText
      this.columnOptions = columnTimeOptions
      this.ruleForm.abscissaType = '0'
      this.ruleForm.columns = columns
      const nowDate = dayjs().format('YYYY-MM-DD') // 今天
      this.ruleForm.daterange = [nowDate, nowDate]
      this.searchData()
    },
    getChart() {
      if (this.chart === null) {
        this.$nextTick(function() {
          this.chart = echarts.init(this.$refs.chart)
          this.loadChart()
        })
      } else {
        this.loadChart()
      }
    },
    loadChart() {
      if (this.series.length === 0) {
        this.chart.clear()
        this.chart.setOption({
          title: {
            left: 'center', // 水平居中
            top: 'center', // 垂直居中
            text: '暂无数据',
            backgroundColor: '#EEEFF4',
            textStyle: {
              color: '#909399',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 14
            }
          }
        })
      } else {
        this.chart.clear()
        let self = this
        let option = {
          tooltip: this.getTooltip(),
          legend: {
            data: this.legendData
          },
          grid: {
            left: '10%',
            right: '13%',
            bottom: '10%',
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
            type: 'category',
            boundaryGap: false,
            data: this.xAxisData,
            triggerEvent: true,
            axisLabel: {
              formatter: function(value, index) {
                let abscissaType = self.ruleForm.abscissaType
                if (abscissaType === '0') {
                  return value
                } else {
                  return self.toPercent(value)
                }
              },
              rotate: 25
            }
          },
          yAxis: {
            splitNumber: this.splitNumber,
            type: 'value'
          },
          series: this.series
        }

        if (this.xAxisData.length > 15) {
          option.dataZoom = [
            {
              type: 'inside',
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
                'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }
          ]
        }
        this.chart.setOption(option)
        this.chart.on('legendselectchanged', function(obj) {
          let columnLabel = []
          Object.keys(obj.selected).forEach(function(key) {
            if (obj.selected[key]) {
              columnLabel.push(key)
            }
          })
          let columns = []
          columnLabel.forEach(element => {
            let tmp = columnTimeOptions.find(el => {
              return el.label === element
            })
            columns.push(tmp.value)
          })
          self.ruleForm.columns = columns
        })
      }
    },
    searchData() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.getChartData()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.getChartData()
      }
    },
    getChartData() {
      this.chartLoading = true
      let daterange = this.ruleForm.daterange
      if (daterange !== null && daterange.length === 2) {
        this.ruleForm.startTime = daterange[0]
        this.ruleForm.endTime = daterange[1]
      } else {
        this.ruleForm.startTime = null
        this.ruleForm.endTime = null
      }
      let ruleForm = _.cloneDeep(this.ruleForm)
      ruleForm.abscissaType = parseInt(this.ruleForm.abscissaType)
      delete ruleForm.daterange
      delete ruleForm.columns
      this.$api['keywordAdRtItemList'](ruleForm)
        .then(res => {
          let { code, data } = res
          if (code === 0) {
            let xAxisData = []

            let advertExposure = []
            let advertHits = []
            let advertOrders = []
            let advertClickRates = []
            let advertConversionRates = []
            let advertCost = []
            let advertSales = []
            let advertCpc = []
            let advertAcos = []
            let adRank = []

            let abscissaType = this.ruleForm.abscissaType
            data.forEach(element => {
              if (abscissaType === '0') {
                xAxisData.push(element.sendTime)

                advertExposure.push(element.advertExposure)
                advertHits.push(element.advertHits)
                advertOrders.push(element.advertOrders)
                advertClickRates.push(element.advertClickRates)
                advertConversionRates.push(element.advertConversionRates)
                advertCost.push(element.advertCost)
                advertSales.push(element.advertSales)
                advertCpc.push(element.advertCpc)
                advertAcos.push(element.advertAcos)
                adRank.push(element.adRank)
              } else if (abscissaType === '1') {
                xAxisData.push(element.advertClickRates)
                advertExposure.push(element.advertExposure)
                advertCpc.push(element.advertCpc)
              } else if (abscissaType === '2') {
                xAxisData.push(element.advertConversionRates)
                advertExposure.push(element.advertExposure)
                advertCpc.push(element.advertCpc)
              }
            })
            this.xAxisData = xAxisData

            let seriesDataArr = []
            if (abscissaType === '0') {
              seriesDataArr = [
                advertExposure,
                advertHits,
                advertOrders,
                advertClickRates,
                advertConversionRates,
                advertCost,
                advertSales,
                advertCpc,
                advertAcos,
                adRank
              ]
            } else if (abscissaType === '1' || abscissaType === '2') {
              seriesDataArr = [advertExposure, advertCpc]
            }
            let seriesDataArrTmp = []
            seriesDataArr.forEach(elementArr => {
              elementArr.forEach(element => {
                seriesDataArrTmp.push(element)
              })
            })
            let arrTmp = _.uniq(seriesDataArrTmp) // [0] [0,null]

            if (_.compact(arrTmp).length === 0) {
              // 去假后的数组
              this.splitNumber = 1
            } else {
              this.splitNumber = null
            }

            this.seriesDataArr = seriesDataArr
            this.restOption()
          }
          setTimeout(() => {
            this.chartLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.chartLoading = false
        })
    },
    restOption() {
      let legendData = []
      let seriesArr = []
      this.columnOptions.forEach((element, index) => {
        let columns = this.ruleForm.columns
        if (columns.indexOf(element.value) !== -1) {
          legendData.push(element.label)
          seriesArr.push({
            name: element.label,
            // key:element.value,
            type: 'line',
            data: this.seriesDataArr[index]
          })
        }
      })

      this.legendData = legendData
      this.series = seriesArr
      this.getChart()
    },
    getTooltip() {
      let abscissaType = this.ruleForm.abscissaType
      if (abscissaType === '0') {
        return { trigger: 'axis' }
      }
      let tooltip = {
        trigger: 'axis'
      }
      let abscissaTypeName = '点击率'
      if (abscissaType === '2') {
        abscissaTypeName = '转化率'
      }
      let self = this
      tooltip.formatter = function(param) {
        if (param.length === 1) {
          return `${abscissaTypeName}<br/>
                        ${param[0].marker}${param[0].seriesName}:&nbsp;${
            param[0].value
          }`
        } else if (param.length === 2) {
          return `${abscissaTypeName}<br/>
                        ${param[0].marker}${param[0].seriesName}:&nbsp;${
            param[0].value
          }<br/>
                        ${param[1].marker}${param[1].seriesName}:&nbsp;${
            param[1].value
          }`
        }
      }
      return tooltip
    },
    routerGo(num) {
      this.$router.go(num)
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .template-box {
    .screen-info {
      .el-form-item__content {
        .el-input {
          width: 150px;
        }
      }
    }
  }
  .chart-dialog {
    /deep/.el-dialog__body {
      padding-top: 5px;
      padding-bottom: 0;
    }
    .el-range-editor {
      width: 240px;
      /deep/.el-range-separator {
        width: 20px;
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