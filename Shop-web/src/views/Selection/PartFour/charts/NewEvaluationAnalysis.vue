<template>
  <TabChart
    :limitTime="false"
    name="新增评价数分析"
    ref="chart"
    class="mt20"
    @timeChange="handleTimeChange"
    :data="data"
    chartHeight="600"
  >
    <div slot="right">
      文字长度:
      <ElInputNumber
        size="mini"
        controls-position="right"
        :min="0"
        :precision="0"
        style="width:100px"
        v-model="strLenStart"
      ></ElInputNumber>&nbsp;~
      <ElInputNumber
        size="mini"
        :min="strLenStart || 0"
        controls-position="right"
        :precision="0"
        style="width:100px;margin-right:10px"
        v-model="strLenEnd"
      ></ElInputNumber>
      <ElButton size="mini" style="margin-right:10px" type="primary" @click="handleStrOk" plain>确认</ElButton>
    </div>
    <template slot="middle">
      <div class="btns">
        <span class="label">评价类型:</span>
        <el-checkbox v-model="evaluate1" label="选中所有" class="ml10 mr10" border></el-checkbox>
        <el-checkbox-group v-model="evaluate" size="default">
          <el-checkbox-button
            :class="{inputButton: item.value === 5}"
            v-for="item in allEvaluate"
            :label="item.value"
            :key="item.label"
          >
            <span v-if="item.value !== 5">{{item.label}}</span>
            <div v-else>
              TOP
              <ElSelect @click.stop @change="handleTopChange" style="width:90px" size="small" v-model="reviewerRanking">
                <ElOption
                  @click.stop
                  v-for="item in reviewerRankingList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></ElOption>
              </ElSelect>REVIEWER数
            </div>
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="btns">
        <span class="label">评分区间:</span>
        <el-checkbox label="选中所有" v-model="grading1" class="ml10 mr10" border></el-checkbox>
        <el-checkbox-group v-model="grading" size="default">
          <el-checkbox-button v-for="item in gradingRange" :label="item.value" :key="item.label">{{item.label}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="btns">
        <span class="label">曲线坐标:</span>
        <el-checkbox label="选中所有" v-model="curvilinear1" class="ml10 mr10" border></el-checkbox>
        <el-checkbox-group v-model="curvilinear" size="default">
          <el-checkbox-button
            v-for="item in curvilinearCoordinates"
            :label="item.value"
            :key="item.label"
          >{{item.label}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </template>
  </TabChart>
</template>

<script>
import _chunk from 'lodash/chunk'
export default {
  data() {
    return {
      data: {
        color: this.$const['CHART/COLOR'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          // backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          // position: function(pos, params, el, elRect, size) {
          //   var obj = { top: 30 }
          //   obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
          //   return obj
          // },
          confine: false,
          textStyle: {
            fontSize: 10
          },
          formatter(params) {
            // console.log(params);

            //
            if (!params) {
              return
            }

            params.sort((a, b) => b.data - a.data)
            params = params.filter(
              el => !(el.data == 0 || el.data === '' || el.data == null)
            )
            if (!params.length) {
              return
            }
            if (params.every(el => el.data == null)) {
              return
            }

            let paramsC = _chunk(params, 42)
            let html = ''
            paramsC.forEach(arr => {
              html +=
                '<div class="mr10">' +
                arr.reduce((total, cur) => {
                  if (cur.data == null) {
                    return total
                  }
                  return (
                    total +
                    `<div>${cur.marker} ${cur.seriesName}：${
                      cur.data == null ? '' : cur.data
                    }</div>`
                  )
                }, '') +
                '</div>'
            })
            html = `<div style="font-weight:bold">${params[0].axisValue}</div><br><div class="flex">${html}</div>`
            // let div = document.createElement('div')
            // div.innerHTML = html
            // document.body.appendChild(div)
            //
            return html
          }
        },
        legend: {
          type: 'scroll',
          left: '3%',
          right: '4%',
          top: '3%',
          data: []
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          max: function(value) {
            return Math.ceil(1.4 * value.max)
          }
        },
        series: []
      },
      strLenStart: undefined,
      strLenEnd: undefined,
      reviewerRanking: 50,
      reviewerRankingList: [
        {
          label: '50',
          value: 50
        },
        {
          label: '100',
          value: 100
        },
        {
          label: '500',
          value: 500
        },
        {
          label: '1000',
          value: 1000
        },
        {
          label: '10000',
          value: 10000
        }
      ],
      allEvaluate: [
        {
          label: '所有评价',
          value: 0
        },
        {
          label: 'VP',
          value: 1
        },
        {
          label: '直评',
          value: 2
        },
        {
          label: '被删除评价',
          value: 3
        },
        {
          label: 'VINE VOICE数',
          value: 4
        },
        {
          label: 'TOP REVIEWER数',
          value: 5
        },
        {
          label: 'HALL OF FAME数',
          value: 6
        }
      ],
      gradingRange: [
        // 0:所有,1:1星,2:2星,3:3星,4:4星,5:5星
        {
          label: '所有',
          value: 0
        },
        {
          label: '1星',
          value: 1
        },
        {
          label: '2星',
          value: 2
        },
        {
          label: '3星',
          value: 3
        },
        {
          label: '4星',
          value: 4
        },
        {
          label: '5星',
          value: 5
        }
      ],
      curvilinearCoordinates: [
        // 0:总数,1:带图片,2:带视频,3:仅文字
        {
          label: '总数',
          value: 0
        },
        {
          label: '带图片',
          value: 1
        },
        {
          label: '带视频',
          value: 2
        },
        {
          label: '仅文字',
          value: 3
        }
      ],
      evaluate: [0],
      grading: [0],
      curvilinear: [0]
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    allSelect() {
      return [this.evaluate, this.grading, this.curvilinear]
    },
    evaluate1: {
      get() {
        if (this.evaluate.length === this.allEvaluate.length) {
          return ['选中所有']
        } else {
          return []
        }
        // return this.evaluate
      },
      set(val) {
        if (val[0] === '选中所有') {
          this.evaluate = [0, 1, 2, 3, 4, 6, 5]
        } else {
          this.evaluate = []
        }
      }
    },
    grading1: {
      get() {
        if (this.grading.length === this.gradingRange.length) {
          return ['选中所有']
        } else {
          return []
        }
        // return this.evaluate
      },
      set(val) {
        if (val[0] === '选中所有') {
          this.grading = [0, 1, 2, 3, 4, 5]
        } else {
          this.grading = []
        }
      }
    },
    curvilinear1: {
      get() {
        if (this.curvilinear.length === this.curvilinearCoordinates.length) {
          return ['选中所有']
        } else {
          return []
        }
        // return this.evaluate
      },
      set(val) {
        if (val[0] === '选中所有') {
          this.curvilinear = [0, 1, 2, 3]
        } else {
          this.curvilinear = []
        }
      }
    }
    // grading1
    // curvilinear1
  },
  watch: {
    evaluate(val, oldVal) {
      this.watchHandler(val, oldVal, 'evaluate', 'allEvaluate')
    },
    grading(val, oldVal) {
      this.watchHandler(val, oldVal, 'grading', 'gradingRange')
    },
    curvilinear(val, oldVal) {
      this.watchHandler(val, oldVal, 'curvilinear', 'curvilinearCoordinates')
    }
  },
  methods: {
    // 获取数据
    fetchData(params) {
      const { today, computedDay } = this.cfuns.getDay(29)
      params = params || {}
      Object.assign(params, {
        taskId: this.$route.query.taskId,
        reviewerRanking: this.reviewerRanking,
        startTime: params.startTime || computedDay,
        endTime: params.endTime || today
      })
      this.loading = true
      this.$api[`bigProductReviewDetailCurveList`](params)
        .then(data => {
          this.loading = false

          this.allData = data.data
          // if (!data.data.length) {
          //   return
          // }
          this.handleDrawData()
        })
        .catch(() => {})
    },
    // 处理渲染数据
    handleDrawData() {
      let timeRange = this.$refs.chart.date,
        timeArr = [],
        currentTime = timeRange[0]
      let data = this.allData
      let legend = [],
        xAxis = [],
        series = []
      while (new Date(currentTime) <= new Date(timeRange[1])) {
        timeArr.push(this.$.formatDate(currentTime, '{y}-{m}-{d}'))
        currentTime = new Date(currentTime).getTime() + 24 * 3600 * 1000
      }
      // console.log(timeArr, '-------------------------')

      if (!data.length) {
        this.setOptions(legend, xAxis, series)
      }
      // debugger
      let select = this.doExchange(this.allSelect)
      // console.log(select)

      xAxis = timeArr
      select.forEach(name => {
        // console.log(data, name);
        let currentData = data.find(el => el.dataType.join('-') === name)
        // if (!currentData) {
        //   return
        // }
        let curLegend = name
          .split('-')
          .map((el, index) => {
            let obj =
              index === 0
                ? this.allEvaluate
                : index === 1
                ? this.gradingRange
                : this.curvilinearCoordinates
            if (index === 1 && el == 0) {
              return ''
            }
            return obj[el].label
          })
          .filter(el => el !== '')
          .join(' ')
        legend.push(curLegend)

        series.push({
          name: curLegend,
          type: 'line',
          ...this.$const['CHART/ITEM_STYLE'],
          data: timeArr.map(el => {
            let e =
              currentData && currentData.data.find(_el => _el.reviewTime === el)
            if (e) {
              return e.newReviewCnt
            } else {
              return 0
            }
          })
        })
      })
      this.setOptions(legend, xAxis, series)
    },
    setOptions(legend, xAxis, series) {
      this.$refs.chart.clear()
      this.data.legend.data = legend
      this.data.xAxis.data = xAxis
      this.data.series = series
    },
    doExchange(array) {
      let len = array.length
      let results = []
      let indexs = {}
      function _sort(start) {
        start++
        if (start > len - 1) {
          return
        }
        if (!indexs[start]) {
          indexs[start] = 0
        }
        if (!(array[start] instanceof Array)) {
          array[start] = [array[start]]
        }
        for (
          indexs[start] = 0;
          indexs[start] < array[start].length;
          indexs[start]++
        ) {
          _sort(start)
          if (start == len - 1) {
            let temp = []
            for (let i = len - 1; i >= 0; i--) {
              if (!(array[start - i] instanceof Array)) {
                array[start - i] = [array[start - i]]
              }
              temp.push(array[start - i][indexs[start - i]])
            }
            results.push(temp.join('-'))
          }
        }
      }
      _sort(-1)
      return results
    },
    handleTimeChange(val) {
      let [startTime, endTime] = val || []
      this.fetchData({ startTime, endTime })
    },
    handleStrOk() {
      this.fetchData({
        minTextLength: this.strLenStart,
        maxTextLength: this.strLenEnd
      })
    },
    handleTopChange(val) {
      this.fetchData({ reviewerRanking: val })
    },
    getData() {
      this.handleDrawData()
    },
    watchHandler(val, oldVal, key) {
      if (val.length === 0 && oldVal.length === 1) {
        this[key] = [0]
      } else if (val.length === 0) {
        this[key] = [0]
      } else {
        this.getData(key, val)
      }
      return
      //
      // let all = this[arr].map(el => el.value)
      // let normal = all.slice(1)
      // if (val.indexOf(0) > -1 && oldVal.indexOf(0) === -1) {
      //   // 勾选所有
      //   this[key] = all
      // } else if (val.indexOf(0) === -1 && oldVal.indexOf(0) > -1) {
      //   // 取消所有全选
      //   this[key] = []
      // } else if (
      //   all.every(el => oldVal.indexOf(el) > -1) &&
      //   all.some(el => val.indexOf(el) === -1) &&
      //   val.indexOf(0) > -1
      // ) {
      //   // 全选后取消一项选择时，同时取消全选状态
      //   this[key].shift()
      // } else if (
      //   normal.every(el => val.indexOf(el) > -1) &&
      //   normal.length === val.length
      // ) {
      //   // 只剩一个未选再勾选时，把全部也勾选
      //   this[key] = all
      // } else {
      //   this.getData(key, val)
      // }
    }
  }
}
</script>

<style lang='scss'>
.inputButton {
  .el-checkbox-button__inner {
    padding: 2px 15px;
    .el-input--small .el-input__inner {
      height: 24px !important;

      margin: 4px 0;
    }
  }
}
</style>
