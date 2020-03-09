<template lang="html">
    <div class="chart">
        <!--  -->
        <el-form :inline="true" :model="form" size="medium">
            <el-form-item label="展开方式：">
                <el-select>
                    <el-option label="按日" value="1"></el-option>
                    <el-option label="按周" value="2"></el-option>
                    <el-option label="按月" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择时间：">
                <el-date-picker
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
           </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜 索</el-button>
          </el-form-item>
        </el-form>
        <!--  -->
        <div class="chartwarp">
            <chart :options="option" auto-size style="width:100%"/>
            <p>总订单数(单):<span> 17 </span> 总毛利润(美元):<span> -178.51</span> 总销售额(美元):<span> 830.28 </span>退款总额(美元):<span> -25.99</span> </p>
        </div>
        <!--  -->
        <el-table   :data="list" border show-summary style="width: 100%" height="275">
            <el-table-column  prop="id"  label="日期"  width="180" align="center"></el-table-column>
             <el-table-column  prop="amount1" sortable  label="订单量" align="center"></el-table-column>
            <el-table-column  prop="amount1" sortable  label="订单产品数" align="center"></el-table-column>
            <el-table-column  prop="amount2"  sortable  label="销售额" align="center"></el-table-column>
            <el-table-column  prop="amount3"  sortable  label="毛利润" align="center"></el-table-column>
            <el-table-column  prop="amount3"  sortable  label="退款总额" align="center"></el-table-column>
        </el-table>
        <!--  -->

    </div>
</template>

<script>
/* eslint-disable */
import echarts from 'echarts'
export default {
  data() {
    return {
      list: [
        {
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        },
        {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        },
        {
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }
      ],
      form: {},
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['line', 'bar']
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        legend: {
          left: '100',
          data: ['订单量', '销售额', '毛利润']
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '订单量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} 单'
            }
          },
          {
            type: 'value',
            name: '毛利润',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 美元'
            }
          }
        ],
        series: [
          {
            name: '订单量',
            type: 'bar',
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ]
          },
          {
            name: '销售额',
            type: 'bar',
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3
            ]
          },
          {
            name: '毛利润',
            type: 'line',
            yAxisIndex: 1,
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
          }
        ]
      }
    }
  },
  methods: {
    search() {}
  }
}
</script>

<style lang="scss">
.chart {
  padding-left: 50px;
  padding-right: 50px;
  .chartwarp {
    position: relative;
    p {
      position: absolute;
      top: 10px;
      right: 160px;
      font-size: 14px;
      span {
        color: #2a94ed;
        font-weight: 700;
      }
    }
  }
}
</style>
