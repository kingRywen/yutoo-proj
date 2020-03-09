<template>

  <div id="components-layout-demo-top-side">
    <v-layout>
      <yt-header :index="0"></yt-header>
      <v-layout style="flex-direction: row;">
        <v-layout style="padding:24px 24px">
          <v-content>
            <!-- 主体内容开始 -->
            <div>
              <v-row :gutter="16">
                <v-col :xs="12" :lg="8" :md="8" v-for="(card, i) in cards" :key="i">
                  <yt-card v-bind="card"></yt-card>
                </v-col>
              </v-row>
              <Building>
                <v-row :gutter="16">
                  <v-col :xs="12" :lg="8" :md="8">
                    <v-card title="今日订单" :loading="loading">
                      <p>待付款</p>
                      <p>已付款</p>
                      <p>已取消</p>
                    </v-card>
                    <v-card title="待发货" :loading="loading">
                      <p>已付款待处理</p>
                      <p>待配快递</p>
                      <p>发货中（含打包拣货）</p>
                      <p>异常</p>
                    </v-card>
                    <v-button icon="plus" style="width: 100%">
                      <span>添加关注</span>
                    </v-button>
                  </v-col>
                  <v-col :xs="12" :lg="16" :md="16">
                    <v-card title="近30天销售量" :loading="loading">
                      <div ref="main" style="width: 100%;height:200px;"></div>
                    </v-card>
                    <v-card title="销售单品排名" :loading="loading">
                      <div ref="main1" style="width: 100%;height:260px;"></div>
                    </v-card>
                  </v-col>
                </v-row>
              </Building>
            </div>
          </v-content>
        </v-layout>
      </v-layout>
    </v-layout>
  </div>

</template>

<script>
import Vue from "vue";
import ytHeader from "components/layout/header.vue";
import ytCard from "components/base/ytCard.vue";
import Building from "components/base/building.vue";
import { fetchAllData, echartsCommonConfig, fetchData } from "common/common";
import apis, { GET_ADMIN_CHARTS, GET_ADMIN_CARD, GET_MAIN_MENU } from "apis";

var echarts = require("echarts");
require("assets/style/echarts-theme/shine");

export default {
  name: "adminMain",
  components: {
    ytHeader,
    Building,
    ytCard
  },
  async mounted() {
    let vm = this;
    // this.mainMenu = await this.getMenuData();
    setTimeout(() => {
      this.loading = false;

      let data = [
        {
          rows: [
            {
              title: "未读邮件",
              count: 243,
              subTitle: "本系统所有邮件",
              subCount: 2545,
              color: "#108ee9",
              icon: "mail"
            },
            {
              title: "待办事项",
              count: 24,
              subTitle: "所有和其相关的待办事项",
              subCount: "",
              color: "#f46e65",
              icon: "clock-circle-o"
            },
            {
              title: "待补货",
              count: 24,
              subTitle: "上升产品",
              subCount: 2,
              color: "#00a854",
              icon: "api",
              link: "/intelligentReplenishment.html"
            }
          ]
        },
        {
          title: {
            text: "堆叠区域图"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "邮件营销",
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {}
              },
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: "联盟广告",
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {}
              },
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: "视频广告",
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {}
              },
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: "直接访问",
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {}
              },
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: "搜索引擎",
              type: "line",
              stack: "总量",
              label: {
                normal: {
                  show: true,
                  position: "top"
                }
              },
              areaStyle: {
                normal: {}
              },
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        }
      ];
      this.cards = data[0].rows;

      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(vm.$refs.main, "roma");
        var myChart1 = echarts.init(vm.$refs.main1, "roma");
        // 绘制图表
        // data.then(res => {
        //   myChart1.setOption(res.data.data);
        // });
        myChart1.setOption(data[1]);
        myChart.setOption({
          tooltip: {},
          grid: echartsCommonConfig.grid,
          xAxis: {
            data: [
              "衬衫",
              "羊毛衫",
              "雪纺衫",
              "裤子",
              "高跟鞋",
              "袜子",
              "衬衫",
              "羊毛衫",
              "雪纺衫",
              "裤子",
              "高跟鞋",
              "袜子"
            ]
          },
          yAxis: {},
          series: [
            {
              name: "销量",
              type: "bar",
              data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20]
            }
          ]
        });

        window.onresize = function() {
          myChart.resize();
          myChart1.resize();
        };
      });
    }, 0);
  },
  // methods: {
  //   // 获取菜单项
  //   async getMenuData() {
  //     return fetchData({ ...apis.MERCHANT_MENU_LIST_BY_USER, data: {} }).then(
  //       res => {
  //         console.log(res);
  //         return res.data.rows;
  //       }
  //     );
  //   }
  // },
  data: function() {
    return {
      mainMenu: [],
      cards: [],
      loading: true
    };
  }
};
</script>

<style lang="less">
#components-layout-demo-top-side {
  background: #ececec;
  .ant-card {
    margin-bottom: 20px;
  }
  // .logo {
  //   width: 120px;
  //   height: 48px;
  //   background: #333;
  //   border-radius: 6px;
  //   margin: 16px 28px 16px 0;
  //   float: left;
  // }
}
</style>