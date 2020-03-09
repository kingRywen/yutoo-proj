<!-- 店铺分析 - - 店铺列表 -->
<template>
  <div class="_____prList">
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeInDown">
      <filter-input @search-click="handlerSearch" :depth-type="depthType" save-url="/shopTerm/save" get-url="/shopTerm/info" :button-list="btnList" v-if="refreshTable" :time="{prop: 'openTime', label: '开店时间'}"></filter-input>
    </transition>
    <div :class="$style.flex__dire">
      <transition-group enter-active-class="animated fadeInUp" leave-active-class="animated fadeInDown">
        <el-table key='1' @sort-change="handlerSortChange" :default-sort="sortProp" v-if="refreshTable" v-loading="loading" ref="singleTable" :data="tableData" highlight-current-row style="width: 100%;margin-top:20px" stripe>
          <el-table-column sortable width="50" label="排名" align="center">
            <template slot-scope="scope">
              {{scope.$index + 1 + ((pageNumber-1)*pageSize)}}
            </template>
          </el-table-column>
          <el-table-column label="店铺名" width="160" align="center">
            <template slot-scope="scope">
              <div class="title">
                {{scope.row.title}}
              </div>
              <div class="sub" :class="$style.color">
                <router-link :to="{path: 'ShopAnalysis/ShopChart', query: {sellerId:scope.row.sellerId}}">
                  {{scope.row.sellerName}}
                </router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable property="noSalesNewReviewCnt" label="无跟卖产品新增评价数" width="190" align="center" :formatter="_formatter">
          </el-table-column>
          <el-table-column sortable property="newReviewCnt" label="店铺新增评价数" width="150" align="center" :formatter="_formatter">
          </el-table-column>
          <el-table-column sortable property="newReviewCntRate" label="店铺新增评价数整长率" width="190" align="center" :formatter="_formatPercentter">
          </el-table-column>
          <el-table-column sortable property="reviewCnt" label="店铺总评价数" width="140" align="center" :formatter="_formatter">
          </el-table-column>
          <el-table-column sortable property="categoryCnt" label="类目数" align="center" :formatter="_formatter">
          </el-table-column>
          <el-table-column sortable property="productCnt" label="产品数" align="center" :formatter="_formatter">
          </el-table-column>
          <el-table-column sortable property="openTime" label="开店时间" width="120" align="center" :formatter="_formatter">
          </el-table-column>
          <el-table-column sortable property="shopStarCnt" label="店铺评分" width="100" align="center" :formatter="_formatter">
          </el-table-column>
          <el-table-column sortable property="fbpFlag" label="产品发货方式" width="130" align="center" :formatter="_fbqFormatter">
          </el-table-column>
          <el-table-column sortable property="positiveRate" label="好评率" align="center" :formatter="_formatPercentter">
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-tooltip content="去SOUQ平台看看" placement="top">
                <a :href="scope.row.sellerUrl" target="_blank">
                  <i class="iconfont22" :class="$style.color">&#xe600;</i>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>

        </el-table>
        <div key='2' class="block" v-show="refreshTable">
          <el-pagination style="text-align: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </transition-group>
    </div>

    <!-- 列表 -->

  </div>
</template>

<script>
import FilterInput from "@/components/common/FilterInput";

export default {
  props: {
    type: {
      type: Number,
      default: 0
    }
  },

  components: {
    FilterInput
  },

  created() {
    this.isDepth();
    this.getList();
    console.log("首次进入", this.$route.name);
    this.setSort(this.$route.name);
  },

  beforeRouteUpdate(to, from, next) {
    this.isDepth();
    this.sortProp = { prop: "price", order: "descending" };
    this.tableData = [];
    this.pageNumber = 1;
    this.pageSize = 10;
    this.total = null;
    this.searchParams = {};
    this.getList();
    this.setSort(this.$route.name);

    next();
  },

  data() {
    return {
      depthType: false,
      refreshTable: true,
      loading: true,
      searchParams: {},
      sortProp: { prop: "price", order: "descending" },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: null,
      btnList: [
        {
          name: "统计周期",
          prop: "period",
          bindVal: true,
          list: [
            {
              label: "1天",
              value: 1
            },
            // {
            //   label: "每日",
            //   value: 1
            // },
            {
              label: "7天",
              value: 7
            },
            {
              label: "30天",
              value: 30
            }
          ]
        },
        {
          name: "发货方式",
          prop: "fbpFlag",
          bindVal: true,
          list: [
            {
              label: "不限",
              value: null
            },
            {
              label: "自发货",
              value: 0
            },
            {
              label: "FBS",
              value: 1
            }
          ]
        },
        {
          name: "店铺月新增评价数区间",
          prop: "monthNewReviewCnt",
          custom: [
            {
              label: "自定义最低价格"
            },
            {
              label: "自定义最高价格"
            }
          ],
          list: [
            {
              label: "不限",
              value: "不限"
            },
            {
              label: "1~2",
              value: 1
            },
            {
              label: "2~5",
              value: 2
            },
            {
              label: "5~10",
              value: 3
            },
            {
              label: "10~20",
              value: 4
            },
            {
              label: "20~50",
              value: 5
            },
            {
              label: ">=50",
              value: 6
            }
          ]
        },
        {
          name: "跟卖人数区间",
          prop: "sellerCnt",
          custom: [
            {
              label: "自定义最低值"
            },
            {
              label: "自定义最高值"
            }
          ],
          list: [
            {
              label: "不限",
              value: "不限"
            },
            {
              label: "1~2",
              value: 1
            },
            {
              label: "2~5",
              value: 2
            },
            {
              label: "5~10",
              value: 3
            },
            {
              label: "10~20",
              value: 4
            },
            {
              label: "20~50",
              value: 5
            },
            {
              label: ">=50",
              value: 6
            }
          ]
        },
        {
          name: "店铺产品数量区间",
          prop: "productCnt",
          custom: [
            {
              label: "自定义最低值"
            },
            {
              label: "自定义最高值"
            }
          ],
          list: [
            {
              label: "不限",
              value: "不限"
            },
            {
              label: "1~2",
              value: 1
            },
            {
              label: "2~5",
              value: 2
            },
            {
              label: "5~10",
              value: 3
            },
            {
              label: "10~20",
              value: 4
            },
            {
              label: "20~50",
              value: 5
            },
            {
              label: ">=50",
              value: 6
            }
          ]
        },
        {
          name: "店铺总评价数区间",
          prop: "reviewCnt",
          custom: [
            {
              label: "自定义最低值"
            },
            {
              label: "自定义最高值"
            }
          ],
          list: [
            {
              label: "不限",
              value: "不限"
            },
            {
              label: "1~2",
              value: 1
            },
            {
              label: "2~5",
              value: 2
            },
            {
              label: "5~10",
              value: 3
            },
            {
              label: "10~20",
              value: 4
            },
            {
              label: "20~50",
              value: 5
            },
            {
              label: ">=50",
              value: 6
            }
          ]
        },
        {
          name: "店铺评分区间",
          prop: "starCnt",
          custom: [
            {
              label: "自定义最低值"
            },
            {
              label: "自定义最高值"
            }
          ],
          list: [
            {
              label: "不限",
              value: "不限"
            },
            {
              label: "1~2",
              value: 1
            },
            {
              label: "2~3",
              value: 2
            },
            {
              label: "3~3.5",
              value: 3
            },
            {
              label: "3.5~4.0",
              value: 4
            },
            {
              label: "4.0~4.5",
              value: 5
            },
            {
              label: ">4.5",
              value: 6
            }
          ]
        },
        {
          name: "店铺新增评价数区间",
          prop: "newReviewCnt",
          custom: [
            {
              label: "自定义最低值"
            },
            {
              label: "自定义最高值"
            }
          ],
          list: [
            {
              label: "不限",
              value: "不限"
            },
            {
              label: "1~2",
              value: 1
            },
            {
              label: "2~5",
              value: 2
            },
            {
              label: "5~10",
              value: 4
            },
            {
              label: "10~20",
              value: 5
            },
            {
              label: "20~50",
              value: 6
            },
            {
              label: ">=50",
              value: 7
            }
          ]
        }
      ]
    };
  },
  mounted() {
    console.log(this.$route, "路由");
    if (this.type == 1) {
      this.sortProp = { prop: "newReviewCnt", order: "descending" };
    }
    if (this.type == 2) {
      this.sortProp = { prop: "reviewCnt", order: "descending" };
    }
  },
  methods: {
    isDepth() {
      // 判断哪种模式
      if (this.$route.query.parentCategory) {
        this.depthType = true;
      }
    },
    handlerSortChange({ column, prop, order }) {
      console.log(column, prop, order);
      let _order = order === "descending" ? "desc" : "asc";
      const sort = prop ? prop + " " + _order : null;
      if (sort) {
        this.searchParams.sort = sort;
      } else {
        delete this.searchParams.sort;
      }
      this.pageNumber = 1;
      this.tableData = [];
      this.getList();
    },

    // 切换路由时刷新表格
    refreshTb() {
      this.refreshTable = false;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },

    // 判断路由，设置排序
    setSort(name) {
      if (name === "飙升店铺") {
        console.log("飙升店铺");
        this.sortProp.prop = "newReviewCnt";
      } else if (name === "热销店铺") {
        console.log("热销店铺");
        this.sortProp.prop = "reviewCnt";
      } else {
        console.log("店铺列表");
        this.sortProp.prop = {};
      }
      this.refreshTb();
    },

    getList() {
      this.loading = true;

      let date7 = this.$.getNumDay(7);

      let params = {
        pageNumber: 1,
        pageSize: 10,
        minDate: date7[0],
        maxDate: date7[1],
        ...this.searchParams
      };

      if (this.$route.query.parentCategory) {
        params.categoryQuery = this.$route.query.parentCategory;
      }

      params = this.$.dealObjectValue(params);

      this.$axios.post("/shop/list", params).then(res => {
        this.loading = false;
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
        this.tableData = res.data.rows;
        this.pageSize = res.data.pageSize;
        this.total = res.data.total;
        this.pageNumber = res.data.pageNo;
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},

    // 搜索事件
    handlerSearch(params) {
      this.searchParams = params;
      this.getList();
    }
  },
  computed: {},
  watch: {
    $route(val) {
      if (this.type) {
        return;
      }
      this.setSort(val.name);
    }
  }
};
</script>

<style lang='scss'>
._____prList {
  .el-table {
    th {
      border: none;
    }
  }
  .block {
    margin-top: 20px;
  }
  .title {
    @include wrap-overflow(3);
  }
  .sub {
    @include wrap-overflow(1);
  }
}
</style>
<style module>
.img {
  width: 80px;
  height: 80px;
  background-size: cover;
}
.flex__dire {
  composes: flex__dire from "sass-loader!@/style/cssModule/color.scss";
}
.color {
  composes: color from "sass-loader!@/style/cssModule/color.scss";
}
</style>
