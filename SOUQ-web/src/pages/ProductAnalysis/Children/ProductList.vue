<!-- 商品分析——商品列表 -->
<template>
  <div class="_____prList">
    <!-- {{$route}} -->
    <!-- <div>
      <button @click="fun">列表里的某一个跳转到图表</button>
    </div>
    <div>
      <button @click="fun">列表里的某一个跳转到图表</button>
    </div>
    <div>
      <button @click="fun">列表里的某一个跳转到图表</button>
    </div> -->
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeInDown">
      <filter-input @search-click="handlerSearch" save-url="/productTerm/save" get-url="/productTerm/info" :depth-type="depthType" :button-list="btnList" v-if="refreshTable" :time="{prop: 'releaseDate', label: '上架时间'}"></filter-input>
    </transition>
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeInDown">
      <div :class="$style.flex__dire" v-if="refreshTable">

        <el-table @sort-change="handlerSortChange" :default-sort="sortProp" v-loading="loading" ref="singleTable" :data="tableData" highlight-current-row style="width: 100%;margin-top:20px" stripe>
          <el-table-column sortable width="50" label="排名">
            <template slot-scope="scope">
              {{scope.$index + 1 + ((pageNumber-1)*pageSize)}}
            </template>
          </el-table-column>
          <el-table-column label="主图" width="90">
            <template slot-scope="scope">
              <div class="__img_wrapper">
                <img class="loadingImg" :key="scope.row.imageUrl" :class="$style.img" v-lazy="scope.row.imageUrl.replace('_SR38,50_', '_SR150,150_')">
                <!-- <img :key="scope.row.imageUrl" :src="scope.row.imageUrl.replace('_SR38,50_', '_SR150,150_')"> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标题" width="180">
            <template slot-scope="scope">
              <div>
                <router-link class="title" :to="{name: '商品图表分析', query: {sku: scope.row.parentSku, title: scope.row.title}}">{{scope.row.title}}</router-link>
              </div>
              <div :class="$style.color">
                <router-link title="" class="sub" :to="{path: '/shop/ShopAnalysis/ShopChart', query: {sellerId: 'A1HVX4F8BRJFYR', title: 'C&R Clothiers'}}">
                  <!-- <i class="iconfont22" style="font-size:16px">&#xe641;</i> Fashion Soft TPU Silicon Clear Phone Case Grils Fashion Sexy -->
                </router-link>

              </div>
            </template>
          </el-table-column>
          <el-table-column sortable property="newReviewCnt" label="新增评价数" width="120" :formatter="_formatter" align="center">
          </el-table-column>
          <el-table-column sortable property="newReviewCntRate" label="新增评价数增长率" width="160" align="center">
            <template slot-scope="scope">
              {{scope.row.newReviewCntRate | _formatPercent}}
            </template>
          </el-table-column>
          <el-table-column sortable property="starCnt" label="评分" :formatter="_formatter" align="center">
          </el-table-column>

          <el-table-column sortable property="price" label="价格" align="center">
          </el-table-column>
          <el-table-column sortable property="releaseDate" label="上架时间" :formatter="_formatter" align="center">
          </el-table-column>
          <el-table-column sortable label="发货方式" property="fbpFlag" align="center">
            <template slot-scope="scope">
              {{scope.row.fbpFlag | fbqName}}
            </template>
          </el-table-column>
          <el-table-column sortable property="sellerCnt" label="跟卖人数" align="center">
          </el-table-column>
          <el-table-column sortable property="skuCnt" label="子SKU数" align="center">
          </el-table-column>
          <el-table-column sortable property="reviewCnt" label="评价总数" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip content="去SOUQ平台看看" placement="top">
                <a :href="scope.row.productUrl" target="_blank">
                  <i class="iconfont22" :class="$style.color">&#xe600;</i>
                </a>
              </el-tooltip>

              <el-tooltip content="下载" placement="top">
                <router-link to="/WholeStationAnalysis">
                  <i class="iconfont22" :class="$style.color">&#xe675;</i>
                </router-link>
              </el-tooltip>

            </template>
          </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination style="text-align: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total.sync="total">
          </el-pagination>
        </div>

      </div>
    </transition>

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
    console.log("首次进入", this.$route.name);
    this.setSort(this.$route.name);
  },
  beforeRouteUpdate(to, from, next) {
    this.isDepth();
    this.sortProp = { prop: "price", order: "descending" };
    if (this.type == 1) {
      this.sortProp = { prop: "newReviewCntRate", order: "descending" };
    }
    if (this.type == 2) {
      this.sortProp = { prop: "reviewCnt", order: "descending" };
    }
    this.tableData = [];
    this.pageNumber = 1;
    this.pageSize = 10;
    this.total = null;
    this.searchParams = {};
    // this.getList();
    this.setSort(this.$route.name);

    next();
  },

  data() {
    return {
      depthType: false,
      refreshTable: true,
      loading: true,
      sortProp: {},
      tableData: [],
      pageNumber: 1,
      pageSize: 10,
      total: null,
      searchParams: {},
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
          name: "价格区间",
          prop: "price",
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
          name: "跟卖人数",
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
          name: "子SKU数量区间",
          prop: "skuCnt",
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
          name: "评价数区间",
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
          name: "评分区间",
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
          name: "新增评价数区间",
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
      this.sortProp = { prop: "newReviewCntRate", order: "descending" };
    }
    if (this.type == 2) {
      this.sortProp = { prop: "reviewCnt", order: "descending" };
    }
  },
  filters: {
    fbqName(val) {
      return val === 0 ? "自发货" : val === 1 ? "FBS" : "不限";
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
      if (prop === "price") {
        prop = "minPrice";
      }
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
    // 表格重新请求数据
    refreshTableData() {
      this.tableData.splice(0);
      this.getList();
      console.log("重新请求");
    },
    fun() {
      this.$router.push("ProductAnalysis/ProductChart?sku=B00AHRDKOO&taskId=7");
    },

    // 切换路由时刷新表格
    refreshTb() {
      this.refreshTable = false;

      this.$nextTick(() => {
        this.refreshTable = true;
        this.pageNumber = 1;
        this.refreshTableData();
      });
    },

    // 判断路由，设置排序
    setSort(name) {
      if (name === "飙升商品") {
        console.log("飙升商品");
        this.sortProp.prop = "reviewCnt";
      } else if (name === "热销商品") {
        console.log("热销商品");
        this.sortProp.prop = "newReviewCntRate";
      } else {
        console.log("商品分析");
        this.sortProp.prop = null;
      }
      this.refreshTb();
    },

    getList(opts = {}) {
      this.loading = true;
      let date7 = this.$.getNumDay(7);
      let param = {
        minDate: date7[0],
        maxDate: date7[1],
        ...this.searchParams,
        ...opts
      };

      if (this.$route.query.parentCategory) {
        param.categoryQuery = this.$route.query.parentCategory;
      }

      param = this.$.dealObjectValue(param);

      this.$axios
        .post("/product/list", {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          ...param
        })
        .then(res => {
          this.loading = false;
          if (res.data.rows) {
            this.tableData = res.data.rows;
            this.pageSize = res.data.pageSize;
            this.total = res.data.total;
            this.pageNumber = res.data.pageNo;
          } else {
            this.tableData = [];
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.refreshTableData();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.refreshTableData();
    },

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
.flex__dire {
  composes: flex__dire from "sass-loader!@/style/cssModule/color.scss";
}
.color {
  composes: color from "sass-loader!@/style/cssModule/color.scss";
}
</style>

