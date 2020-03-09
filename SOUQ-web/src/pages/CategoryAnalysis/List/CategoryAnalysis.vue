<!-- 商品分析——商品列表 -->
<template>
  <div class="_____prList">
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeInDown">
      <filter-input @search-click="handlerSearch" save-url="/categoryTerm/save" get-url="/categoryTerm/info" :button-list="btnList" v-if="refreshTable" :time="{prop: 'releaseDate', label: '上架时间'}"></filter-input>
    </transition>
    <div :class="$style.flex__dire">
      <transition-group enter-active-class="animated fadeInUp delay-1s" leave-active-class="animated fadeInDown delay-1s">
        <el-table key="1" :default-sort="sortProp" v-if="refreshTable" v-loading="loading" ref="singleTable" :data="tableData" highlight-current-row style="width: 100%;margin-top:20px" stripe>
          <el-table-column align="center" sortable type="index" width="100" label="排名">
          </el-table-column>
          <el-table-column align="center" label="类目名称">
            <template slot-scope="scope">
              <div class="title" :class="$style.color">
                <div>
                  <router-link :to="{name: '类目分析详情', query: {parentCategory: scope.row.category, taskId:7, title: scope.row.category}}">{{scope.row.category}}</router-link>
                </div>
                <div>
                  <router-link :to="{name: '类目分析详情', query: {parentCategory: scope.row.category, taskId:7, title: scope.row.category}}">{{scope.row.categoryZh}}</router-link>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" sortable property="newReviewCnt" label="新增评价数">
          </el-table-column>
          <el-table-column align="center" sortable property="sallingProductCnt" label="在售商品数">
          </el-table-column>
          <el-table-column align="center" sortable property="sellerCnt" label="店铺数">
          </el-table-column>

          <el-table-column align="center" sortable property="reviewCnt" label="产品评价总数">
          </el-table-column>

        </el-table>
        <div class="block" key="2" v-show="refreshTable">
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
  components: {
    FilterInput
  },

  created() {
    this.getList();
    console.log("首次进入", this.$route.name);
    this.setSort(this.$route.name);
  },
  data() {
    return {
      refreshTable: true,
      loading: true,
      sortProp: { prop: "price", order: "descending" },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: null,
      btnList: [
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
  },
  methods: {
    fun() {
      this.$router.push("ProductAnalysis/ProductChart?sku=B00AHRDKOO&taskId=7");
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
      if (name === "飙升商品") {
        console.log("飙升商品");
        this.sortProp.prop = "reviewCnt";
      } else if (name === "热销商品") {
        console.log("热销商品");
        this.sortProp.prop = "newReviewCntRate";
      } else {
        console.log("商品分析");
        this.sortProp.prop = {};
      }
      this.refreshTb();
    },

    getList() {
      this.loading = true;
      this.$axios
        .post(
          "/categoryAnalysis/list",
          {
            pageNumber: "1",
            pageSize: "10"
          }
          // {
          //   mock: true
          // }
        )
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data) {
            this.tableData = res.data.rows;
            this.pageSize = res.data.pageSize;
            this.total = res.data.total;
            this.pageNumber = res.data.pageNo;
          }
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

