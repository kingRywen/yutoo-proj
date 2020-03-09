<template>
  <div>
    <h5 class="_title">子类目分析</h5>
    <div>
      <filter-input @search-click="handlerSearch" :show-category="false" :button-list="btnList" :time="{prop: 'date', label: '时间筛选'}" depth-type />
      <div :class="$style.flex__dire">
        <el-table v-if="refreshTable" v-loading="loading" ref="singleTable" :data="tableData" highlight-current-row style="width: 100%;margin-top:20px" height="300" stripe>
          <el-table-column align="center" label="子类目名称" width="180">
            <template slot-scope="scope">
              <div class="sub" :class="$style.color">
                <div>
                  <router-link :to="{name: '类目分析详情', query: {parentCategory: scope.row.category, taskId:7, title:  scope.row.category}}">{{scope.row.category}}</router-link>
                </div>
                <div>
                  <router-link :to="{name: '类目分析详情', query: {parentCategory: scope.row.category, taskId:7, title:  scope.row.category}}">{{scope.row.categoryZh}}</router-link>
                </div>

              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" sortable property="sallingProductCnt" label="产品数" width="120">
          </el-table-column>
          <el-table-column align="center" sortable property="sellerCnt" label="店铺数" width="160">
          </el-table-column>
          <el-table-column align="center" sortable property="newReviewCnt" label="新增评价数">
          </el-table-column>

          <el-table-column align="center" sortable property="productCntRate" label="产品数占大类百分比">
          </el-table-column>
          <el-table-column align="center" sortable property="newReviewCntRate" label="新增评价数占大类百分比">
          </el-table-column>
          <div slot="empty">
            <none-page no-back>暂无数据</none-page>
          </div>

        </el-table>
      </div>

      <h5 class="_title">价格区间、上架时间分布</h5>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-table v-loading="loading1" ref="singleTable" :data="priceTableData" highlight-current-row style="width: 100%;" stripe>
            <div slot="empty">
              <none-page no-back>暂无数据</none-page>
            </div>
            <el-table-column align="center" label="价格区间" width="180">
              <template slot-scope="scope">
                <span>{{scope.row.priceRange | unescape}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" property="productCnt" label="商品数量" width="120">
            </el-table-column>
            <el-table-column align="center" property="salesCnt" label="销量" width="160">
            </el-table-column>
            <el-table-column align="center" property="avgSalesCnt" label="平均销量">
            </el-table-column>

            <el-table-column align="center" label="销量占比">
              <template slot-scope="scope">
                <span>{{scope.row.salesRate}}%</span>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
        <el-col :span="12" :class="$style.mb20">
          <s-chart data-url="/cateProductReleaseR/list" title="商品上架时间分布" name="上架"></s-chart>
        </el-col>
        <el-col :span="12" :class="$style.mb20">
          <s-chart data-url="/cateProductSalesR/list" title="商品销量分布" name="销量"></s-chart>
        </el-col>
        <el-col :span="12" :class="$style.mb20">
          <s-chart data-url="/cateShopOpenTimeR/list" title="开店时间分布" name=""></s-chart>
        </el-col>
      </el-row>
    </div>
    <!-- <none-page v-if="tableData.length === 0 && !loading">子类目信息不存在。</none-page> -->
  </div>
</template>

<script>
import FilterInput from "@/components/common/FilterInput";
import NonePage from "@/components/common/NonePage";
import sChart from "./components/chart";
export default {
  components: {
    FilterInput,
    NonePage,
    sChart
  },
  created() {
    let date = this.$.getNumDay(7);
    this.searchParams.minDate = date[0];
    this.searchParams.maxDate = date[1];
    this.getListByCategory();
    this.getCateProductPriceR();
  },
  beforeRouteUpdate(to, from, next) {
    console.log("更新数据");
    this.searchParams = {};
    let date = this.$.getNumDay(7);
    this.searchParams.minDate = date[0];
    this.searchParams.maxDate = date[1];
    this.tableData = [];
    this.loading = true;
    this.loading1 = true;
    this.sortProp = { prop: "price", order: "descending" };
    this.refreshTable = true;
    this.getListByCategory();
    this.getCateProductPriceR();
    next();
  },
  data() {
    return {
      searchParams: {},
      btnList: [
        {
          name: "产品数",
          prop: "productCnt",
          // bindVal: true,
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
          name: "新增评价数",
          prop: "newReviewCnt",
          custom: [
            {
              label: "自定义最低价格"
            },
            {
              label: "自定义最高价格"
            }
          ],
          // bindVal: true,
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
          name: "店铺数",
          prop: "shopCnt",
          custom: [
            {
              label: "自定义最低价格"
            },
            {
              label: "自定义最高价格"
            }
          ],
          // bindVal: true,
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
        }
      ],
      loading: true,
      tableData: [],
      refreshTable: true,
      sortProp: { prop: "price", order: "descending" },

      priceTableData: [],
      loading1: true
      // activeName: 'a'
    };
  },
  methods: {
    getList({ url, loading, data, params }) {
      this.$axios.post(url, this.$.dealObjectValue(params)).then(res => {
        this[loading] = false;
        this[data] = res.data.data;
      });
    },
    getListByCategory() {
      this.getList({
        url: "/categoryAnalysis/listByCategoryQuery",
        params: {
          parentCategory: this.$route.query.parentCategory,
          ...this.searchParams
        },
        loading: "loading",
        data: "tableData"
      });
    },
    getCateProductPriceR() {
      this.getList({
        url: "/cateProductPriceR/list",
        params: {
          category: this.$route.query.parentCategory
        },
        loading: "loading1",
        data: "priceTableData"
      });
    },

    // 搜索事件
    handlerSearch(params) {
      this.searchParams = params;
      this.loading = true;
      this.getListByCategory();
    }
  }
};
</script>

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
.mb20 {
  composes: mb20 from "sass-loader!@/style/cssModule/color.scss";
}
</style>
