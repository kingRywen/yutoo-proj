<!-- 查看 -->
<template>
  <div class="___common">
    <a v-show="false" ref="exportExcel"></a>
    <div v-show="showCircle" class="scroll-box" ref="outer" @mouseenter="showCircle = true" @mousemove="handleMousemove" @mousedown="handleMouseDown">
      <div class="scroll-box-inner" ref="inner" @mousemove="handleMousemove($event, true)"></div>
      <div class="arrow-left" @mousedown.stop="handleArrowMousedown"></div>
      <div class="arrow-right" @mousedown.stop="handleArrowMousedown"></div>
    </div>
    <template>
      <div class="title_h1 margin_bottom8">
        <span class="title_icon"></span>
        <span class="color_666">类目分析 :</span>
        <span class="titleBox">{{this.$route.query.category | strReplece}}</span>
      </div>
    </template>
    <template>
      <el-search :search="search" :clearSearch.sync="clearSearch" :platformId="platformId" :backFun="backFun"></el-search>
    </template>
    <template>
      <section class="__relative">
        <template>
          <el-handler :userSelect="userSelect" :hander="hander"></el-handler>
        </template>
        <template>
          <el-table-select :tableSelect="table.show.tableSelect2" class="__right"></el-table-select>
        </template>
      </section>
    </template>
    <template>
      <el-table-pagination ref="table" :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect" :stripe="false"></el-table-pagination>
    </template>
    <!-- 图表 -->
    <el-dialog :close-on-click-modal="false" :title="chartData.title" :visible.sync="chartData.visible" height="505px" width="950px" @close="closeDialog">
      <detail-chart :chartData.sync="chartData" ref="child"></detail-chart>
    </el-dialog>
  </div>
</template>
<script>
import { CONST_PORT_CONFIG } from "Config";
import detailChart from "./echarts";
const { BASE_URL } = CONST_PORT_CONFIG;
export default {
  components: { detailChart },
  provide() {
    return {
      getList: this.getList,
      check__: this.check__,
      draw__: this.draw__,
      addTask: this.addTask,
      clearSort: this.clearSort,
      download: this.downloadFun
    };
  },
  data() {
    return {
      showCircle: false,
      // 搜索
      search: {
        taskName: false,
        cate: true
      },
      // 控件
      hander: {
        addTask3: true,
        addButton: "加入深度分析",
        download: true,
        downloadText: "导出数据"
        // deleteAuthCate: true
      },
      clearSearch: null,
      chartData: {
        visible: false,
        chartShow: true,
        title: "新增评价",
        category: "",
        siteId: ""
      },
      // 表格
      table: {
        loading: false,
        rows: [],
        // rowKey: "categoryId",
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          category: true,
          Handle_head: {
            check: true
          },
          tableSelect2: [
            {
              indeterminate: false,
              checkAll: true,
              name: "其他",
              selected: ["a", "b", "c", "d", "e", "f"],
              allSelected: ["a", "b", "c", "d", "e", "f"],
              childList: [
                {
                  name: "产品数",
                  label: "a"
                },
                {
                  name: "FBS产品数",
                  label: "b"
                },
                {
                  name: "自发货产品数",
                  label: "c"
                },
                {
                  name: "品牌数",
                  label: "d"
                },
                {
                  name: "卖家数",
                  label: "e"
                },
                {
                  name: "近30天日平均新增评价数",
                  label: "f"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP1产品",
              selected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              allSelected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              childList: [
                {
                  name: "主图",
                  label: "a"
                },
                {
                  name: "日均新增评价数",
                  label: "b"
                },
                {
                  name: "评分",
                  label: "c"
                },
                {
                  name: "总评价数",
                  label: "d"
                },
                {
                  name: "上架时间",
                  label: "e"
                },
                {
                  name: "价格",
                  label: "f"
                },
                {
                  name: "跟卖人数",
                  label: "g"
                },
                {
                  name: "发货方式",
                  label: "h"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP2产品",
              selected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              allSelected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              childList: [
                {
                  name: "主图",
                  label: "a"
                },
                {
                  name: "日均新增评价数",
                  label: "b"
                },
                {
                  name: "评分",
                  label: "c"
                },
                {
                  name: "总评价数",
                  label: "d"
                },
                {
                  name: "上架时间",
                  label: "e"
                },
                {
                  name: "价格",
                  label: "f"
                },
                {
                  name: "跟卖人数",
                  label: "g"
                },
                {
                  name: "发货方式",
                  label: "h"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP3产品",
              selected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              allSelected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              childList: [
                {
                  name: "主图",
                  label: "a"
                },
                {
                  name: "日均新增评价数",
                  label: "b"
                },
                {
                  name: "评分",
                  label: "c"
                },
                {
                  name: "总评价数",
                  label: "d"
                },
                {
                  name: "上架时间",
                  label: "e"
                },
                {
                  name: "价格",
                  label: "f"
                },
                {
                  name: "跟卖人数",
                  label: "g"
                },
                {
                  name: "发货方式",
                  label: "h"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP4产品",
              selected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              allSelected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              childList: [
                {
                  name: "主图",
                  label: "a"
                },
                {
                  name: "日均新增评价数",
                  label: "b"
                },
                {
                  name: "评分",
                  label: "c"
                },
                {
                  name: "总评价数",
                  label: "d"
                },
                {
                  name: "上架时间",
                  label: "e"
                },
                {
                  name: "价格",
                  label: "f"
                },
                {
                  name: "跟卖人数",
                  label: "g"
                },
                {
                  name: "发货方式",
                  label: "h"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP5产品",
              selected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              allSelected: ["a", "b", "c", "d", "e", "f", "g", "h"],
              childList: [
                {
                  name: "主图",
                  label: "a"
                },
                {
                  name: "日均新增评价数",
                  label: "b"
                },
                {
                  name: "评分",
                  label: "c"
                },
                {
                  name: "总评价数",
                  label: "d"
                },
                {
                  name: "上架时间",
                  label: "e"
                },
                {
                  name: "价格",
                  label: "f"
                },
                {
                  name: "跟卖人数",
                  label: "g"
                },
                {
                  name: "发货方式",
                  label: "h"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP1卖家",
              selected: ["a", "b", "c", "d"],
              allSelected: ["a", "b", "c", "d"],
              childList: [
                {
                  name: "TOP100产品数",
                  label: "a"
                },
                {
                  name: "近30天店铺新增评价数",
                  label: "b"
                },
                {
                  name: "店铺产品数",
                  label: "c"
                },
                {
                  name: "卖家名称",
                  label: "d"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP2卖家",
              selected: ["a", "b", "c", "d"],
              allSelected: ["a", "b", "c", "d"],
              childList: [
                {
                  name: "TOP100产品数",
                  label: "a"
                },
                {
                  name: "近30天店铺新增评价数",
                  label: "b"
                },
                {
                  name: "店铺产品数",
                  label: "c"
                },
                {
                  name: "卖家名称",
                  label: "d"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP3卖家",
              selected: ["a", "b", "c", "d"],
              allSelected: ["a", "b", "c", "d"],
              childList: [
                {
                  name: "TOP100产品数",
                  label: "a"
                },
                {
                  name: "近30天店铺新增评价数",
                  label: "b"
                },
                {
                  name: "店铺产品数",
                  label: "c"
                },
                {
                  name: "卖家名称",
                  label: "d"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP4卖家",
              selected: ["a", "b", "c", "d"],
              allSelected: ["a", "b", "c", "d"],
              childList: [
                {
                  name: "TOP100产品数",
                  label: "a"
                },
                {
                  name: "近30天店铺新增评价数",
                  label: "b"
                },
                {
                  name: "店铺产品数",
                  label: "c"
                },
                {
                  name: "卖家名称",
                  label: "d"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "TOP5卖家",
              selected: ["a", "b", "c", "d"],
              allSelected: ["a", "b", "c", "d"],
              childList: [
                {
                  name: "TOP100产品数",
                  label: "a"
                },
                {
                  name: "近30天店铺新增评价数",
                  label: "b"
                },
                {
                  name: "店铺产品数",
                  label: "c"
                },
                {
                  name: "卖家名称",
                  label: "d"
                }
              ]
            }
          ]
        }
      },
      userSelect: [],
      handlerButtonLoading: {
        funCopyButtonLoading: false,
        funExportButtonLoading: false,
        funAddButtonLoading: false
      }
    };
  },

  created() {
    this.getList();
  },
  mounted() {
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("mousemove", this.handleMousemove);
    window.addEventListener("resize", this.setInnerCirclePosition);
    this.$nextTick(() => {
      this.innerCircle = this.$refs.inner;
      let tableEl = document.querySelectorAll(".___common.__table")[0];
      tableEl.addEventListener("mouseenter", this.handleTableMouseenter);
      tableEl.addEventListener("mouseleave", this.handleTableMouseleave);
      // this.setInnerCirclePosition()
    });
  },
  beforeDestroy() {
    let tableEl = document.querySelectorAll(".___common.__table")[0];
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("mousemove", this.handleMousemove);
    window.removeEventListener("resize", this.setInnerCirclePosition);
    if (tableEl) {
      tableEl.removeEventListener("mouseenter", this.handleTableMouseenter);
      tableEl.removeEventListener("mouseleave", this.handleTableMouseleave);
    }
  },
  filters: {
    strReplece(val) {
      val = val.replace(/:/g, " >> ");
      return val;
    }
  },
  methods: {
    // 导出todo
    downloadFun() {
      let params = {
        taskId: this.$route.query.taskId,
        siteId: +this.$route.query.siteId__
      };
      let categorys = [];
      if (this.userSelect.length > 0) {
        this.userSelect.forEach(el => {
          categorys.push(el.category);
        });
        params.categorys = categorys;
      }
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.$ajax({
        method: "post",
        url: BASE_URL + "taskCateAnalysisSouq/exportData",
        data: params,
        responseType: "blob"
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "souq类目分析详情.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    handleTableMouseenter() {
      this.showCircle = true;
      this.setInnerCirclePosition();
    },
    handleTableMouseleave() {
      this.showCircle = false;
    },
    setInnerCirclePosition() {
      if (!this.$refs.outer) {
        return;
      }
      this.$nextTick(() => {
        let {
          offsetLeft,
          offsetTop,
          offsetWidth,
          offsetHeight
        } = this.$refs.outer;
        let {
          offsetWidth: offsetWidth1,
          offsetHeight: offsetHeight1
        } = this.innerCircle;
        this.originX = offsetLeft + offsetWidth / 2;
        this.originY = offsetTop + offsetWidth / 2;
        this.originLeft = this.originX - offsetWidth1 / 2;
        this.originTop = this.originY - offsetHeight1 / 2;

        this.innerCircle.style.left = this.originLeft + "px";
        this.innerCircle.style.top = this.originTop + "px";
      });
    },
    handleMouseDown(e) {
      this.move = true;
      // 当前点击的点
      this.currentPointX = e.pageX;
      this.currentPointY = e.pageY;
      if (this.move) {
        let child = this.innerCircle;
        if (child) {
          this.moveAndScroll(child, e);
        }
      }
    },
    handleMouseUp(e) {
      this.move = false;
      this.innerCircle.style.left = this.originLeft + "px";
      this.innerCircle.style.top = this.originTop + "px";

      if (window.requestAnimationFrame) {
        window.cancelAnimationFrame(this.requestId);
      } else {
        clearTimeout(this.requestId);
      }
      this.requestId = null;
    },
    // 如果不需要移动内圆 isMoveInnerCircle: false
    moveAndScroll(child, e, isMoveInnerCircle = true) {
      let vm = this;
      let { target, pageX, pageY } = e;
      // 移动小圆
      let {
        offsetLeft: pLeft,
        offsetTop: pTop,
        offsetWidth,
        offsetHeight
      } = child;

      if (isMoveInnerCircle) {
        let scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        child.style.left = pageX - offsetWidth / 2 + "px";
        child.style.top = pageY - offsetHeight / 2 + "px" - scrollTop;
      }

      // 滑动scroll
      let scrollLeftEl = document.querySelectorAll(
        ".el-table__body-wrapper"
      )[0];
      let distanceX = Math.abs(pageX - this.originX);
      let distanceY = pageY - this.originY;
      window._setTimeout =
        window._setTimeout ||
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.setTimeout;

      function updateScroll() {
        //
        if (vm.requestId) {
          if (window.requestAnimationFrame) {
            window.cancelAnimationFrame(vm.requestId);
          } else {
            clearTimeout(vm.requestId);
          }

          vm.requestId = null;
        }
        if (pageX > vm.originX) {
          // 右
          scrollLeftEl.scrollLeft += 2 + distanceX;
          vm.requestId = window._setTimeout(updateScroll);
        }
        if (pageX < vm.originX && scrollLeftEl.scrollLeft > 0) {
          // 左
          scrollLeftEl.scrollLeft -= 2 + distanceX;
          if (scrollLeftEl.scrollLeft !== 0) {
            vm.requestId = window._setTimeout(updateScroll);
          }
        }
      }

      if (scrollLeftEl) {
        updateScroll();
      }
    },
    handleArrowMousedown(e) {
      this.move = true;
      if (this.move) {
        let child = this.innerCircle;
        if (child) {
          this.moveAndScroll(child, e, false);
        }
      }
    },
    handleMousemove(e, isSelf) {
      if (this.move) {
        let child = this.innerCircle;
        if (child) {
          this.moveAndScroll(child, e);
        }
      }
    },
    clearSort() {
      this.$refs.table.clearSortable();
    },
    // 列表
    getList(arg) {
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        taskId: this.$route.query.taskId,
        siteId: +this.$route.query.siteId__,
        ...arg
      };
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["TaskCateAnalysisSouqDetails"](params)
        .then(data => {
          this.table.loading = false;
          this.table.rows = data.rows;
          //
          if (
            data.rows == "" &&
            data.pageNo !== null &&
            data.pageNo !== "" &&
            data.pageNo !== 1
          ) {
            let a = {
              pageSize: this.table.pageSize,
              pageNumber: 1
            };
            this.getList(a);
            return;
          } else {
            this.table.pageNumber = data.pageNo;
          }
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          return true;
        })
        .catch(err => {
          this.table.loading = false;

          return true;
        });
    },
    addTask(arg) {
      this.$api["TaskCateDepthAnalysisSouqSave"](arg).then(data => {
        this.getList();
      });
    },
    check__(arg) {
      //
      this.$router.push({
        name: "SouqDepthDetails",
        query: {
          taskId: arg.depthTaskId,
          category: arg.category,
          sellerId: this.sellerId,
          siteId__: this.$route.query.siteId__,
          fromCate: this.$route.fullPath
        }
      });
    },
    // 画图 五
    draw__(row) {
      this.chartData.visible = true;
      this.chartData.category = row.category;
      this.chartData.siteId = +this.$route.query.siteId__;
      this.$nextTick(() => {
        this.$refs.child.showChartChild(this.chartData.category);
      });
    },
    // 关闭弹窗时调用子组件方法清空日期 六
    closeDialog() {
      this.$refs.child.clearDate();
    },
    backFun() {
      let siteId__ = this.$route.query.siteId__;
      if (siteId__) {
        this.$router.push({
          path: "/SOUQ/cateAnalysis",
          query: {
            siteId__: siteId__
          }
        });
      } else {
        this.$router.push("/SOUQ/cateAnalysis");
      }
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
</style>
