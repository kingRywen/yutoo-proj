<template>
  <div class="___common">
    <!-- v-clickoutside="handleClose" -->
    <!-- {{const_ex}} -->
    <div class="dash">
      <!-- 3个主标签 -->
      <ElRow :gutter="20">
        <ElCol :span="8" v-for="(item, index) in mainTabs" :key="index">
          <div class="main-tags" :class="`main-tags-${index}`">
            <div class="left">
              <i class="iconfont1" :class="item.icon"></i>
            </div>
            <div class="right">
              <router-link class="tag-title" :to="item.to" tag="div">
                <h3>{{item.title}}</h3>
                <span class="count">
                  <countTo v-if="item.count !== '-'" :startVal="0" :endVal="item.count" :duration="2000"></countTo>
                  <span v-else>-</span>
                </span>
              </router-link>

              <router-link class="tag-subtitle" :to="item.subTo" tag="div">
                <h4>{{item.subTitle}}</h4>
                <span class="count">
                  <countTo v-if="item.subCount !== '-'" :startVal="0" :endVal="item.subCount" :duration="2000"></countTo>
                  <span v-else>-</span>
                </span>
              </router-link>
            </div>
          </div>
        </ElCol>
      </ElRow>
      <!-- 3个主标签 end -->

      <!-- 关注层 -->

      <ElRow :gutter="20">
        <draggable
          class="list-group"
          tag="div"
          v-model="tabs"
          v-bind="dragOptions"
          :move="onMove"
          @start="isDragging=true"
          @end="handleDragEnd"
        >
          <transition-group type="transition" :name="'flip-list'">
            <ElCol :span="8" v-for="(item, index) in tabs" :key="item.title">
              <div class="attention-box">
                <div class="attion-title">
                  <i class="el-icon-tickets"></i>
                  <span class="text">{{item.title}}</span>
                </div>
                <div class="attion-body">
                  <router-link
                    class="attion-item"
                    :to="a.to"
                    tag="div"
                    v-for="(a, i) in item.list"
                    :key="i"
                    :style="{width: a.span ? '100%' : '50%',visibility: a.hidden ? 'hidden' : 'initial' }"
                  >
                    <div class="item-text" @click.stop @drag.stop @dragstart.stop>
                      <router-link :to="a.to" tag="span">{{a.name}}</router-link>
                      <template v-if="a.input">
                        <span @click.stop v-if="a.showText">
                          {{inputData[a.input]}}%
                          <el-button
                            style="padding: 0"
                            icon="el-icon-edit"
                            @click.stop="a.showText = false, currentInput = a"
                            type="text"
                          ></el-button>
                        </span>
                        <ElInputNumber
                          class="custom-input"
                          @click.stop
                          @drag.stop
                          @dragstart.stop
                          :min="0.01"
                          
                          v-else
                          size="mini"
                          v-clickeloutside="handleBlur.bind(null, a)"
                          v-model.number="inputData[a.input]"
                        ></ElInputNumber>
                      </template>
                    </div>
                    <div class="item-cnt">{{a.cnt}}</div>
                  </router-link>
                </div>
                <ElButton type="text" icon="el-icon-remove-outline" class="remove-btn" @click="handleRemoveBtn(index)"></ElButton>
              </div>
            </ElCol>
          </transition-group>
        </draggable>
      </ElRow>

      <!-- 添加关注 -->
      <ElRow :gutter="20" style="margin-top:20px">
        <ElCol :span="8">
          <ElButton type="primary" class="w100" icon="el-icon-plus" plain @click="openDialog">添加关注</ElButton>
        </ElCol>
        <ElCol :span="16">
          <div class="chart attention-box">
            <div class="attion-title">
              <i class="el-icon-tickets"></i>
              <span class="text">近30天销量情况</span>
            </div>
            <div class="attion-body" style="width:100%; height:230px;cursor:pointer">
              <v-chart
                ref="chart"
                @click="chartClick"
                :options="chartOpts"
                style="width:100%; height:230px;cursor:pointer"
                auto-resize
              />
            </div>
          </div>
        </ElCol>
      </ElRow>
    </div>

    <!-- <div v-if="!userAndToken">
      加载失败，
      <div style="margin-top:5px;">
        <span class="common_color __pointer" @click="tologin">重新登录</span>
      </div>
    </div> -->
    <!-- 弹出组件 -->
    <yt-dialog :options="options" :events="events">
      <AttentionList ref="list" :all-list="list" />
    </yt-dialog>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
import storage from 'Utils/saver'
import ECharts from 'vue-echarts'
import echarts from 'echarts'
import draggable from 'vuedraggable'
import AttentionList from './AttentionList'

export default {
  name: 'dash',
  components: { countTo, 'v-chart': ECharts, draggable, AttentionList },
  data() {
    let vm = this
    return {
      // 当前输入序号
      currentInput: null,
      inputData: {
        dayCnt: ''
      },
      tabs: [],
      hasCount: {},
      list: [],
      editable: true,
      isDragging: false,
      delayedDragging: false,
      chartOpts: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#ddd'
            }
          },
          backgroundColor: 'rgba(255,255,255,1)',
          padding: [5, 10],
          textStyle: {
            color: '#7588E4'
          },
          extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '8%',
          containLabel: true
        },
        legend: {
          // right: 20,
          top: '8%',
          // orient: 'vertical',
          data: ['订单量', '利润', '销售额']
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: false,
          // splitLine: {
          //   show: true,
          //   interval: 'auto',
          //   lineStyle: {
          //     color: ['#D4DFF5']
          //   }
          // },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 12
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: ['#D4DFF5']
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 12
            }
          }
        },
        series: []
      },
      options: {
        title: '添加关注',
        visible: false
      },
      events: {
        open: () => {
          vm.$nextTick(() => {
            vm.$refs.list._initData()
          })
        },
        handleOkClick: () => {
          vm.$refs.list.submit(() => {
            vm.options.visible = false
            vm.getList()
          })
        }
      },
      // 常量获取
      const_ex: this.$const['OTHER/MENU'],

      // 主要颜色标签
      mainTabs: [
        {
          title: '主要SKU库存缺货预警',
          subTitle: '所有库存预警数量',
          icon: 'iconchanpinfenxi',
          count: '-',
          subCount: '-',
          to: {
            name: 'skuEarlyWarningIndex',
            params: { tab_name: '1', invStatus: 4 }
          },
          subTo: {
            name: 'skuEarlyWarningIndex',
            query: {}
          }
        },
        {
          title: '消息待回复',
          subTitle: '所有消息',
          icon: 'iconxiaoxi',
          count: '-',
          subCount: '-',
          to: {
            name: 'messageAwaitingReply',
            query: {
              readFlag: 0
            }
          },
          subTo: {
            name: 'messageAwaitingReply',
            query: {}
          }
        },
        {
          title: '评分过低',
          subTitle: '所有监控产品',
          icon: 'iconpingfen',
          count: '-',
          subCount: '-',
          to: {
            name: 'ProductDatasAnalysisWarning',
            params: {
              name: 'three'
            }
          },
          subTo: {
            name: 'ProductDatasAnalysisWarning',
            query: {}
          }
        }
      ],

      // 关注层
      attentionTabs: [
        {
          title: '预警消息',
          icon: 'el-icon-edit',
          list: [
            {
              name: '信用卡失效',
              cnt: '-',
              type: 0,
              to: {
                name: 'theWarningMessage',
                query: {}
              }
            },
            {
              name: '信用卡变更',
              cnt: '-',
              type: 6,
              to: {
                name: 'theWarningMessage',
                params: { name: 'seven' }
              }
            },

            {
              name: '政策违规',
              cnt: '-',
              type: 1,
              to: {
                name: 'theWarningMessage',
                params: { name: 'second' }
              }
            },
            {
              name: '产品价格错误',
              cnt: '-',
              type: 5,
              to: {
                name: 'theWarningMessage',
                params: { name: 'six' }
              }
            },
            {
              name: '产品标题错误',
              cnt: '-',
              type: 4,
              to: {
                name: 'theWarningMessage',
                params: { name: 'five' }
              }
            },
            {
              name: '产品退货率过高导致下架',
              cnt: '-',
              type: 3,
              to: {
                name: 'theWarningMessage',
                params: { name: 'four' }
              }
            },
            {
              name: '收款账户发生变化',
              cnt: '-',
              type: 2,
              to: {
                name: 'theWarningMessage',
                params: { name: 'three' }
              }
            }

            // {
            //   name: '信用卡变更',
            //   cnt: '-',
            //   to: {
            //     name: 'theWarningMessage',
            //     params: {name: 'seven'}
            //   }
            // },
          ]
        },
        {
          title: '产品信息监控',
          icon: 'el-icon-edit',
          list: [
            {
              name: '变体关系发生变化',
              cnt: '-',
              span: 24,
              to: {
                name: 'ProductLibrary',
                params: {
                  productStatus: '变体关系发生变化'
                }
              }
            },
            {
              name: '产品信息被更改',
              cnt: '-',
              span: 24,
              to: {
                name: 'ProductLibrary',
                params: {
                  activeName: '5',
                  status: 0
                }
              }
            },
            {
              name: '产品变成不可售',
              span: 24,
              cnt: '-',
              to: {
                name: 'ProductLibrary',
                params: {
                  activeName: '2',
                  status: 2
                }
              }
            },
            {
              name: '-',
              cnt: 20,
              span: 24,
              hidden: true,
              to: {
                name: '-',
                query: {}
              }
            }
          ]
        },
        {
          title: '库存预警',
          icon: 'el-icon-edit',
          list: [
            {
              name: '0~90天',
              cnt: '-',
              to: {
                name: 'skuEarlyWarningIndex',
                params: { tab_name: '3', invStatus: 3, invDayStatus: 1 }
              }
            },
            {
              name: '90~181天',
              cnt: '-',
              to: {
                name: 'skuEarlyWarningIndex',
                params: { tab_name: '3', invStatus: 3, invDayStatus: 2 }
              }
            },
            {
              name: '181~270天',
              cnt: '-',
              to: {
                name: 'skuEarlyWarningIndex',
                params: { tab_name: '3', invStatus: 3, invDayStatus: 3 }
              }
            },
            {
              name: '271~365天',
              cnt: '-',
              to: {
                name: 'skuEarlyWarningIndex',
                params: { tab_name: '3', invStatus: 3, invDayStatus: 4 }
              }
            },
            {
              name: '366天~',
              cnt: '-',
              to: {
                name: 'skuEarlyWarningIndex',
                params: { tab_name: '4', invStatus: 4, invDayStatus: 5 }
              }
            },
            {
              name: '-',
              cnt: 20,
              span: 24,
              hidden: true,
              to: {
                name: '-',
                query: {}
              }
            }
          ]
        },
        {
          title: '索赔预警',
          icon: 'el-icon-edit',
          list: [
            {
              name: '亚马逊丢件未赔偿',
              cnt: '-',
              to: {
                name: 'claimLists',
                query: { type: 1 }
              }
            },

            {
              name: '亚马逊损坏未赔偿',
              cnt: '-',
              to: {
                name: 'claimLists',
                query: { type: 2 }
              }
            },
            {
              name: '客户退款未退货未赔偿',
              cnt: '-',
              to: {
                name: 'claimLists',
                query: { type: 3 }
              }
            },
            {
              name: 'FBA配送费不对',
              cnt: '-',
              to: {
                name: 'claimLists',
                query: { type: 4, name: 'FBA配送费不对' }
              }
            },
            {
              name: '佣金不对',
              cnt: '-',
              to: {
                name: 'claimLists',
                query: { type: 4, name: '佣金不对' }
              }
            },

            {
              name: '仓储费不对',
              cnt: '-',
              to: {
                name: 'claimLists',
                query: { type: 4, name: '仓储费不对' }
              }
            },
            {
              name: '-',
              cnt: 20,
              span: 24,
              hidden: true,
              to: {
                name: '-',
                query: {}
              }
            }
          ]
        },
        {
          title: '广告监控',
          icon: 'el-icon-edit',
          list: [
            {
              name: '子SKU广告被暂停',
              cnt: '-',
              span: 24,
              to: {
                name: 'adProductAbnormal',
                query: { type: 1 }
              }
            },
            {
              name: '广告花费占比过高',
              cnt: '-',
              span: 24,
              to: {
                name: 'adProductAbnormal',
                query: { type: 2 }
              }
            },
            {
              name: '-',
              cnt: 20,
              span: 24,
              hidden: true,
              to: {
                name: '-',
                query: {}
              }
            },
            {
              name: '-',
              cnt: 20,
              span: 24,
              hidden: true,
              to: {
                name: '-',
                query: {}
              }
            }
          ]
        },
        {
          title: '产品监控',
          icon: 'el-icon-edit',
          list: [
            {
              span: 24,
              name: '首页出现差评',
              cnt: '-',
              to: {
                name: 'homeBadReviewMonitoring',
                query: {}
              }
            },
            {
              span: 24,
              name: '日订单波动超过',
              input: 'dayCnt',
              showText: true,
              cnt: '-',
              to: {
                name: 'DailyOrderFluctuation',
                query: {}
              }
            },
            {
              span: 24,
              name: '出现非自己店铺跟卖',
              cnt: '-',
              to: {
                name: 'BeFollowedToSellMonitoring',
                query: {}
              }
            },
            {
              span: 24,
              name: '退货率异常',
              cnt: '-',
              to: {
                name: 'BeFollowedToSellMonitoring',
                query: {}
              }
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.bindKeyEvent()
  },
  watch: {
    sellerId: {
      immediate: true,
      handler(val) {
        if (!val) {
          return
        }
        this.getList()
      }
    },
    // 'inputData.dayCnt':{
    //   immediate: true,
    //   handler(newVal){
    //       this.attentionTabs[5].list[1].to={
    //           name: 'DailyOrderFluctuation',
    //           query: { name: `超过${newVal}%`}
    //       }
    //   }
    // }
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.handleKeycode)
  },
  methods: {
    bindKeyEvent() {
      this.$nextTick(() => {
        document.addEventListener('keyup', this.handleKeycode)
      })
    },
    handleKeycode(e) {
      if (e.keyCode == 13) {
        this.handleBlur(this.currentInput)
      }
    },
    handleBlur(a) {
      let { input } = a
      if (input == 'dayCnt') {
        // 日订单波动
        let num = JSON.parse(JSON.stringify( (this.inputData[input])/ 100))
        this.$api[`homeOrderRangeConfig`]({
          ...this.storeIds,
          orderRange: num
        }).then(() => {
          a.showText = true
          this.getCount(`homeOrderRangeWornCnt`, 5, {}, 1, 2)
        })
      }
    },
    chartClick() {
      // 
      this.$router.push({ path: '/SFM' })
    },
    handleRemoveBtn(index) {
      this.tabs.splice(index, 1)
      this.saveTabs()
    },
    saveTabs() {
      let itemList = this.tabs.map((el, index) => ({
        itemType: el.itemType,
        sortBy: index
      }))
      this.list = itemList
      let params = {
        ...this.storeIds,
        itemList
      }
      this.$api[`homeItemConfigSave`](params)
    },
    handleDragEnd() {
      // 
      this.saveTabs()
      this.isDragging = false
    },
    openDialog() {
      this.options.visible = true
    },
    getTabCount(itemType) {
      this.hasCount[itemType] = true
      switch (itemType) {
        case 0:
          this.getWarningCount()
          break
        case 1:
          this.getProductWarningCnt()
          break
        case 2:
          this.getIvtWnCnt()
          break
        case 3:
          this.getClmLsWornCnt()
          break
        case 4:
          this.getAdProWornCnt()
          break
        case 5:
          this.getBrWornCnt()
          break

        default:
          break
      }
    },
    // sku预警-产品数量
    getSKuWarningCount() {
      this.getCount(
        `homeInventoryWornProductCnt`,
        'mainTabs',
        {},
        0,
        0,
        true,
        true
      )
      this.getCount(
        `homeInventoryWornProductCnt`,
        'mainTabs',
        {},
        0,
        1,
        true,
        true
      )
    },
    // 预警消息-数量
    getWarningCount() {
      // 0:信用卡失效；1:政策违规；2:收款账户发生变化；3:退货率过高；4:标题错误；5:产品价格错误；
      this.getCount(`homePerformanceNoticeCnt`, 0, {}, 0, 2, true)
    },
    // 客户消息-数量
    getCustomerCount() {
      // 状态,0:待回复；全部消息不传此字段
      this.getCount(`homeCusMsgWornCnt`, 'mainTabs', {}, 1, 0, true)
      this.getCount(`homeCusMsgWornCnt`, 'mainTabs', {}, 1, 1, true)
    },
    // 评分过低-产品数量
    getRateLowerCount() {
      this.getCount(`homePdWarnWornCnt`, 'mainTabs', {}, 2, 0, true)
      this.getCount(`homePdWarnWornCnt`, 'mainTabs', {}, 2, 1, true)
    },
    // 产品信息监控-预警数量
    // 类型，0:变体关系发生变化；1:产品信息被更改；2:产品变成不可售；
    getProductWarningCnt() {
      this.getCount(`homeProductWornCnt`, 1, {}, 0, 2, true)
    },
    // 库存预警-预警数量
    getIvtWnCnt() {
      // 类型，0:0~90天；1:91~180天；2:181~270天；3:271~365天；4:365天~；
      this.getCount(`homeInventoryWornCnt`, 2, {}, 0, 2, true)
    },
    // 索赔预警
    getClmLsWornCnt() {
      this.getCount(`homeClaimWornCnt`, 3, {}, 0, 2, true)
    },
    // 广告异常监控
    getAdProWornCnt() {
      // 子SKU广告被暂停-产品数量
      this.getCount(`homeAdProductWornCnt`, 4, {}, 0, 2)
      // 广告花费占比过高-产品数量
      this.getCount(`homeAdCostWornCnt`, 4, {}, 1, 2)
    },
    // 产品监控
    getBrWornCnt() {
      // 首页出现差评-产品数量
      this.getCount(`homeBrProductWornCnt`, 5, {}, 0, 2)
      // 日订单波动-产品数量
      this.getCount(`homeOrderRangeWornCnt`, 5, {}, 1, 2)
      // 出现非自己店铺跟卖-产品数量
      this.getCount(`homeOsProductWornCnt`, 5, {}, 2, 2)
      // 退货率异常
      this.getCount(`homePdWarnRefundRateWornCnt`, 5, {}, 3, 2)
    },
    // 近30天销量
    get30DaySaleCnt() {
      this.$api[`homeSalesRptList`](this.storeIds)
        .then(data => {
          // 
          let xAxisData = data.data[0].rptData.map(el => el.rptDate)
          let series = data.data.map(el => {
            // 报表类型，0:订单量；1:利润；2:销售额
            let name =
              el.rptType == 0 ? '订单量' : el.rptType == 1 ? '利润' : '销售额'
            let linear =
              el.rptType == 0
                ? [
                    {
                      offset: 0,

                      color: 'rgba(80, 255, 196,0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(80, 255, 196,0.1)'
                    }
                  ]
                : el.rptType == 1
                ? [
                    {
                      offset: 0,
                      color: 'rgba(199, 237, 250,0.5)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(199, 237, 250,0.2)'
                    }
                  ]
                : [
                    {
                      offset: 0,
                      color: 'rgba(216, 244, 247,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(216, 244, 247,1)'
                    }
                  ]
            return {
              name,
              type: 'line',
              smooth: true,
              showSymbol: false,
              symbol: 'circle',
              symbolSize: 6,
              data: el.rptData.map(el => el.objData),
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    linear,
                    false
                  )
                }
              },
              itemStyle: {
                normal: {
                  color:
                    el.rptType == 0
                      ? '#24d197'
                      : el.rptType == 1
                      ? '#58c8da'
                      : '#f7b851'
                }
              },
              lineStyle: {
                normal: {
                  width: 3
                }
              }
            }
          })
          this.chartOpts.xAxis.data = xAxisData
          this.chartOpts.series = series
        })
        .catch(() => {})
    },
    init() {
      this.getSKuWarningCount()
      this.getWarningCount()
      this.getCustomerCount()
      this.getRateLowerCount()
      this.getProductWarningCnt()
      this.getIvtWnCnt()
      this.getClmLsWornCnt()
      this.getAdProWornCnt()
      this.getBrWornCnt()
      this.get30DaySaleCnt()
    },
    getTopThreeTabCnt() {
      this.getSKuWarningCount()
      this.getCustomerCount()
      this.getRateLowerCount()
      this.get30DaySaleCnt()
    },
    // type : 0：上面三个的大字数量  1：上面三个的小字数量 2：中间的每个小字数量
    // isObj : 返回参数是对象形式
    // isSku : sku的状态跟数量字段是相反的,要特殊处理;
    getCount(api, key, params, index, type = 0, isObj, isSku) {
      if (key != 0) {
        this.attentionTabs[key] && (this.attentionTabs[key].list[index].cnt = '-')
      }
      this.$api[api]({
        platformId: this.platformId,
        sellerId: this.sellerId,
        siteId: this.siteId,
        ...params
      })
        .then(data => {
          if (isObj) {
            //返回参数是一个对象
            let list = data.data

            switch (type) {
              // eslint-disable-next-line no-case-declarations
              case 0:
                let Status = isSku ? 1 : 0
                list.forEach(e => {
                  if (e.noticeType == Status) this[key][index].count = e.wornCnt
                })
                break
              // eslint-disable-next-line no-case-declarations
              case 1:
                let Status1 = isSku ? 0 : 1
                list.forEach(e => {
                  if (e.noticeType == Status1)
                    this[key][index].subCount = e.wornCnt
                })
                break
              case 2:
                list.forEach(e => {
                  let el = this.attentionTabs[key].list[e.noticeType]
                  if (key === 0) {
                    // 预警消息，特殊处理
                    el = this.attentionTabs[key].list.find(
                      el => el.type == e.noticeType
                    )
                    // debugger
                  }

                  el.cnt = e.wornCnt
                })
                break
            }
          } else {
            //返回参数是一个数字型
            if (type == 0) {
              this[key][index].count = data.wornCnt
            } else if (type == 1) {
              this[key][index].subCount = data.wornCnt
            } else {
              this.attentionTabs[key].list[index].cnt = data.wornCnt
            }
          }
        })
        .catch(() => {
          
        })
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    handleAuth() {
      let name = ''
      switch (this.$store.state.common.routerType) {
        case 'amazon':
          name = 'shopAuthorization'
          break
        case 'ebay':
          name = 'ebayShopAuthorization'
          break
        default:
          break
      }
      this.$router.push({ name })
    },
    handleClose() {
      // 
      this.options.visible = true
    },
    getList() {
      this.getTopThreeTabCnt()
      this.getOrderRangeConfig()
      this.$api[`homeItemConfigList`](this.storeIds)
        .then(data => {
          this.list = data.data.sort((a, b) => a.sortBy > b.sortBy)
          this.setList()
        })
        .catch(() => {})
    },
    getOrderRangeConfig() {
      this.$api[`homeOrderRangeConfigInfo`](this.storeIds)
        .then(data => {
          this.inputData.dayCnt =  parseInt(data.orderRange*10000)/100
        })
        .catch(() => {})
    },
    setList() {
      let tabs = []
      this.list.forEach(el => {
        tabs.push({ ...this.attentionTabs[el.itemType], ...el })
        if (!this.hasCount[el.itemType]) {
          this.getTabCount(el.itemType)
        }
      })
      // 
      this.tabs = tabs
    },
    reload() {
      location.reload()
    },
    tologin() {
      let checkAccount = storage.get('local', 'checkAccount')
      let username = storage.get('local', 'username')
      localStorage.clear()
      if (checkAccount) {
        storage.set('local', 'checkAccount', checkAccount)
        storage.set('local', 'username', username)
      }
      sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    // userAndToken() {
    //   let user = storage.get('local', 'username')
    //   let token = storage.get('local', 'shop_token')
    //   if (user && token) {
    //     return true
    //   } else {
    //     return false
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.dash {
  .flip-list-move {
    transition: transform 0.5s;
  }

  .list-group {
    // padding-left: 15px;
    // padding-right: 15px;
    & > span {
      box-sizing: border-box;
      position: relative;
      // margin-left: -15px; margin-right: -15px;
      width: 100%;
      display: block;
      overflow: auto;
    }
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .main-tags {
    border-radius: 3px;
    color: #fff;
    box-sizing: border-box;
    // background: #1bc98e;
    background: #1bc98e; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to left,
      #1bc98e,
      #4af3bb
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to left,
      #1bc98e,
      #4af3bb
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    display: flex;
    flex-direction: row;
    &.main-tags-0 {
      background: #4e54c8; /* fallback for old browsers */
      background: -webkit-linear-gradient(
        to left,
        #4e54c8,
        #8f94fb
      ); /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(
        to left,
        #4e54c8,
        #8f94fb
      ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    &.main-tags-2 {
      background: #ff9800;
      background: -webkit-linear-gradient(
        to left,
        #ff9800,
        #ffc875
      ); /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(
        to left,
        #ff9800,
        #ffc875
      ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    .left {
      padding: 20px;
      i {
        font-size: 48px;
      }
    }
    .right {
      margin-right: 20px;
      flex: 1;
      .tag-title {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 22px;
        h3 {
          margin: 20px 0 10px 0;
          width: 100%;
          font-size: 22px;
        }
        .count {
          margin: 20px 0 10px 0;
          font-weight: bolder;
          font-size: 22px;
        }
      }

      .tag-subtitle {
        cursor: pointer;
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        h4 {
          font-size: 15px;
          margin: 0;
          width: 100%;
        }
        .count {
          font-size: 15px;
          font-weight: bolder;
        }
      }
    }
  }
  .attention-box {
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    margin-top: 20px;
    background: #fff;
    border-radius: 3px;
    position: relative;
    .remove-btn {
      display: none;
      &.el-button--text {
        color: #ccc;
      }
      position: absolute;
      right: 13px;
      top: 13px;
      padding: 0;
    }
    &:hover {
      .remove-btn {
        display: block;
      }
    }
    &.chart {
      margin-top: 0;
    }
    .attion-title {
      display: flex;
      align-items: center;
      cursor: move;
      user-select: none;
      padding: 10px;
      font-size: 14px;
      line-height: 22px;
      border-bottom: 1px solid #f2f3f7;
      font-weight: bold;
      i {
        font-size: 18px;
        color: #1bc98e;
        margin-right: 6px;
      }
    }
    .attion-body {
      // padding: 10px;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      canvas {
        cursor: pointer;
      }
      .attion-item {
        cursor: pointer;
        padding: 6px 34px;
        width: 50%;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f2f3f7;
        line-height: 24px;
        &.noBorder {
          border: none;
        }
        .item-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .custom-input {
            z-index: 222;
            width: 100px;
            &.el-input-number--mini {
              line-height: 22px;
              height: 22px;
            }
          }
        }
        .item-cnt {
          color: #1bc98e;
          font-weight: bold;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.custom-input.el-input-number--mini {
  .el-input__inner {
    line-height: 22px;
    height: 22px;
  }

  .el-input-number__decrease,
  .el-input-number__increase {
    height: 20px;
    line-height: 20px;
  }
}
</style>