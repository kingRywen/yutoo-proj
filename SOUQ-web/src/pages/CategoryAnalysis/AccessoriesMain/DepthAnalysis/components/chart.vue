<template lang="html">
    <div class="chart" v-loading="loading">
        <layout>
            <template slot="title">{{title}}</template>
            <template slot="content">
  <div class="pie_warp">
    <div class="pie">
      <chart :options="option" auto-resize style="width:100%" ref="bar" />
    </div>
    <!-- <lookList/> -->
  </div>
</template>
        </layout>
    </div>
</template>

<script>
import layout from "../base/layout";
import selectTime from "../base/selectTime";
import echarts from "echarts";
import lookList from "../base/look-list";
export default {
  props: {
    dataUrl: {
      type: String,
      default: "",
      required: true
    },
    title: {
      type: String,
      default: "-",
      required: true
    },
    name: {
      type: String,
      default: "",
      required: true
    }
  },
  mounted() {
    this.bar = this.$refs.bar;
    this.refresh();
  },
  data() {
    return {
      loading: true,
      option: {
        tooltip: {
          trigger: "item",
          show: true, //是否跟随鼠标，显示
          position: [350, 350],
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          //   type: "scroll",
          orient: "vertical", //horizontal 控制显示的位置横向还是纵向
          itemGap: 20, //每项之间的间隔,横向为水平
          itemWidth: 15, //没项的宽度
          itemHeight: 15, //没项的高度
          selectedMode: true, //是否可以点击改变系列的显示转态
          textStyle: {
            color: "#424F62",
            fontSize: 16
          },
          right: 0,
          top: "middle",
          bottom: 0
        },
        series: [
          {
            name: "",
            type: "pie", //type 决定是什么样的图形样式，饼图或其他
            radius: ["50%", "70%"], //控制大小
            center: ["30%", "50%"], //控制页面布局距离
            color: [
              "#39cccc",
              "#0074d9",
              "#7fdbff",
              "#2ecc40",
              "#ffdc00",
              "#ff851b"
            ],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ]
      }
    };
  },

  methods: {
    getData() {
      let vm = this;
      this.$axios
        .post(this.dataUrl, {
          category: this.$route.query.parentCategory
        })
        .then(res => {
          if (res.data && res.data.data) {
            // 处理数据
            let data = [],
              data1 = [];
            let _data = res.data.data;

            _data.forEach(el => {
              let _look = el.releaseRange || el.openTimeRange;
              let str = "";
              if (el.salesRange) {
                if (el.salesRange == "2000-") {
                  str = `销量为2000以上`;
                } else {
                  str = `销量为${el.salesRange}`;
                }

                data1.push({
                  value: el.productCnt,
                  name: `${str}:  ${el.productCnt}(件)    ${el.productCntRate *
                    100 || el.salesRate * 100}%` // 上架分布
                });
              }

              if (_look) {
                switch (_look) {
                  case "-7":
                    str = `7天内${this.name}        `;
                    break;
                  case "8-15":
                    str = `8-15天内${this.name}   `;
                    break;
                  case "16-30":
                    str = `16-30天内${this.name} `;
                    break;
                  case "31-60":
                    str = `31-60天内${this.name} `;
                    break;
                  case "61-180":
                    str = `61-半年内${this.name}  `;
                    break;
                  case "181-365":
                    str = `半年-1年内${this.name} `;
                    break;
                  case "366-730":
                    str = `1-2年内${this.name}     `;
                    break;
                  case "730-":
                    str = `2年内${this.name}         `;
                    break;

                  default:
                    break;
                }

                data.push(str);

                data1.push({
                  value: el.productCnt || el.shopCnt,
                  name: `${str}:  ${el.productCnt ||
                    el.shopCnt}(件)    ${el.productCntRate * 100 ||
                    el.salesRate * 100 ||
                    el.shopCntRate * 100}%` // 上架分布
                });
              }
            });

            vm.loading = false;

            vm.option.series[0].data = data1;
            vm.bar.mergeOptions(vm.option);
          }
        });
    },
    refresh() {
      this.getData();
    }
  },
  components: {
    layout,
    selectTime,
    lookList
  }
};
</script>

<style lang="scss" scoped>
.pie_warp {
  display: flex;
  flex-direction: row;
  .pie {
    width: 650px;
  }
}
</style>
