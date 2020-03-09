<template>
  <!-- 差评监控 -->
  <div class='negativeCommentMonitoring'>
    <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="dialogFormVisible" width="30%">
      <span>这是一段信息</span>
    </el-dialog>
    <el-row style="margin-bottom:8px; margin-right:0">
      <el-dropdown trigger="click">
        <el-button type="success">批量操作
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="statusHandle(0)">标记为待回复</el-dropdown-item>
          <el-dropdown-item @click.native="statusHandle(1)">标记为已解决</el-dropdown-item>
          <el-dropdown-item @click.native="statusHandle(2)">标记为已关闭</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- todoh -->
      <!-- <el-button type="success" style="margin-left:0" plain @click="deleteMonitorList">删除</el-button> -->
      <el-button type="success" style="margin-left:0" plain @click="toShopAuthorizationPage">店铺管理</el-button>
    </el-row>

    <el-row class='__my_form_inline'>
      <el-form :inline="true">
        <el-form-item label="店铺名称">
          <!-- <el-input placeholder="请输入店铺名字" v-model="searchListData.sellerAlias" style='width:100%;' clearable>
          </el-input> -->
          <el-select :popper-append-to-body="false"v-model="searchListData.sellerId" placeholder="选择店铺" style='width:100%;' clearable>
            <el-option v-for="item in ShopOptions" :key="item.sellerName" :label="item.sellerName" :value="item.sellerId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select :popper-append-to-body="false"v-model="searchListData.status" placeholder="选择状态" style='width:100%;' clearable>
            <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-date-picker unlink-panels v-model="searchListData.monitorTimeAry" clearable value-format="yyyy-MM-dd" type="daterange" align="right" range-separator="-" start-placeholder="开始日期" style='width:100%;' end-placeholder="结束日期" :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="ASIN">
          <el-input placeholder="请输入ASIN" v-model.trim="searchListData.sku" style='width:100%;' clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="买家名称">
          <el-input placeholder="请输入买家名称" v-model.trim="searchListData.buyerName" style='width:100%;' clearable>
          </el-input>
        </el-form-item>

      </el-form>
      <el-form :inline="true">
        <el-form-item label="选择评价星级">
          <el-checkbox-group v-model="searchListData.star" clearable>
            <el-checkbox label="1">一星</el-checkbox>
            <el-checkbox label="2">二星</el-checkbox>
            <el-checkbox label="3">三星</el-checkbox>
            <!-- todoh -->
            <!-- <el-button :disabled="Disabled" type="success" icon="el-icon-search" :loading="loading" style="margin-left:20px;margin-right:5px;" @click="onSearch">搜索</el-button> -->
            <el-button type="success" icon="el-icon-search" :loading="loading" style="margin-left:20px;margin-right:5px;" @click="onSearch">搜索</el-button>
            <el-button :disabled="Disabled" type="success" icon="el-icon-search" :loading="clearSearchLoading" @click="clearSearchLists">清空</el-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

    </el-row>

    <!-- <el-row class='paddingBobbtom' :gutter="12" type='flex' justify="space-between" style="margin-left:1px;">
      <div style="display:flex">
        <span style="line-height:80px;margin-right:10px; pading-top:20px; height:40px;">选择评价星级:</span>
        <el-checkbox-group v-model="noGoodLiistsSearch.star" style="margin-top:20px;" clearable @change="newLists6()">
          <el-checkbox label="1">一星</el-checkbox>
          <el-checkbox label="2">二星</el-checkbox>
          <el-checkbox label="3">三星</el-checkbox>
          <el-button type="success" icon="el-icon-search" style="margin-left:20px;" @click="onSearch()">搜索</el-button>
        </el-checkbox-group>
      </div>
    </el-row> -->

    <!-- 表格数据 -->
    <!-- {{this.$store.state.monitor.noGoodMonitoringLists}} -->
    <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="saveNoGoodMonitoringList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <!-- 暂时不需要SKU -->
      <!-- <el-table-column prop="sku" label="ASIN" align='center'>
      </el-table-column> -->
      <el-table-column prop="sellerAlias" label="店铺名称" align='center'>
      </el-table-column>
      <el-table-column prop="reviewDate" label="差评创建时间" align='center' width="120">
      </el-table-column>
      <el-table-column prop="sku" label="子ASIN" align='center' width="115">
      </el-table-column>
      <el-table-column prop="buyerName" label="买家名称" align='center'>
      </el-table-column>
      <el-table-column prop="skuAttr" label="变体属性" align='center'>
        <template slot-scope="scope">
          <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0]">
            <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0].attrName?scope.row.skuAttr[0].attrName:""}}</span>：
            <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[0]&&scope.row.skuAttr[0].attrValue?scope.row.skuAttr[0].attrValue:""}}</span>
          </div>
          <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1]">
            <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1].attrName?scope.row.skuAttr[1].attrName:""}}</span>：
            <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[1]&&scope.row.skuAttr[1].attrValue?scope.row.skuAttr[1].attrValue:""}}</span>
          </div>
          <div v-if="scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2]">
            <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2].attrName?scope.row.skuAttr[2].attrName:""}}</span>：
            <span>{{scope.row.skuAttr&&scope.row.skuAttr.length&&scope.row.skuAttr[2]&&scope.row.skuAttr[2].attrValue?scope.row.skuAttr[2].attrValue:""}}</span>
          </div>
          <div v-if="scope.row.skuAttr==''?true:false">-</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align='center' width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">待回复</span>
          <span v-if="scope.row.status=='1'">已解决</span>
          <span v-if="scope.row.status=='2'">已关闭</span>
        </template>
      </el-table-column>
      <!-- 取消平均星级 -->
      <!-- <el-table-column prop="star" label="平均星级" align='center'>
      </el-table-column> -->
      <el-table-column prop="orderId" label="订单ID" align='center'>
      </el-table-column>
      <el-table-column prop="star" label="评价星级" align='center' width="100">
        <template slot-scope="scope">
          {{ scope.row.star | filterFun }}
        </template>
      </el-table-column>
      <el-table-column prop="review" label="评价信息" align='center'>
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.review === '' || scope.row.review == null">{{scope.row.review}}</div>
          <el-tooltip v-else placement="top">

            <div style="max-width:400px" slot="content">
              {{scope.row.review}}
            </div>
            <div class="fix__row_2">
              {{ scope.row.review!=""?scope.row.review:"-"}}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapMutations } from "vuex";
import { isDisabled } from "@/api/functions";
export default {
  // 注册过滤器
  filters: {
    filterFun: function(value) {
      return `${parseInt(value)}星`;
    }
  },

  data() {
    // 时间选择器
    return {
      Disabled: true,
      searchListData: {
        star: []
      },
      clearSearchLoading: false,
      loading: true,
      surplusAmount: null, //剩余点数
      charge: null, //点数
      // monitorTimeAry: [], //时间选择器
      saveNoGoodMonitoringList: [],
      // // 多选框
      // checkList: [],
      value5: 3,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近两周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      tabPosition: 30,
      taskIds: [], //定义状态搜索
      statusList: [],
      userSelect: [], //定义选择数组
      // value6: '',
      value7: "",
      //定义搜索的SKU, 笔名，店铺名
      noGoodLiistsSearch: {
        status: [], //状态
        sku: "", //ASIN
        buyerName: "", //笔名
        sellerId: "", //卖家名称
        star: [], //星级
        reviewDate: [], //时间
        evaluateStar: null //星级
      },
      // checkedCities: false,
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 关键词
      inputText: "",

      originValue: "",
      // 状态
      StatusOptions: [
        {
          value: 0,
          label: "待回复"
        },
        {
          value: 1,
          label: "已解决"
        },
        {
          value: 2,
          label: "已关闭"
        }
      ],
      // 店铺
      ShopOptions: [],
      StatusValue: "",
      // 时间段

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1
    };
  },
  created() {
    this.getNoGoodMonitoringListApi();
    this.getPointeApi(); //请求扣点
    this.getShopOptions(); //请求店铺下拉ShopOptions
  },
  computed: {
    // ...mapState("monitor", {
    //   saveNoGoodMonitoringList: state => state.noGoodMonitoringLists
    // }),
  },
  watch: {
    // platformId(val) {
    //   this.getNoGoodMonitoringListApi({ platformId: val });
    // },
    reviewDate(val) {
      // console.log(val, "差评的时间变化");
    },
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.Disabled = isDisabled(newV);
        if (this.Disabled === true) {
          this.pageSize = 10;
          this.pageNumber = 1;
          this.getNoGoodMonitoringListApi();
        }
        //要干的事情
      },
      deep: true
    }
  },
  methods: {
    // 请求店铺下拉ShopOptions
    getShopOptions() {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.$axios.post("/SellerAuth/selectList", params).then(res => {
        let code = res.data.code;
        if (code == 0) {
          let data = res.data.data;
          this.ShopOptions = data;
        } else {
          this.ShopOptions = [];
        }
      });
    },
    // 请求扣点  差评监控扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/reviewMonitor/list").then(res => {
        if (res.data.code == 0) {
          this.surplusAmount = res.data.data.surplusAmount;
          this.charge = res.data.data.charge;
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
      });
    },

    // 请求列表
    getNoGoodMonitoringListApi(param = {}) {
      // debugger;
      const { pageSize, pageNumber } = this;
      let startTime = this.searchListData.monitorTimeAry
        ? this.searchListData.monitorTimeAry[0]
        : "";
      let endTime = this.searchListData.monitorTimeAry
        ? this.searchListData.monitorTimeAry[1]
        : "";
      const params = this.$.dealObjectValue({
        pageSize,
        pageNumber,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        ...this.searchListData,
        startTime,
        endTime,
        ...param
      });
      this.loading = true;
      this.$axios.post("/ShopReviewMonitor/list", params).then(res => {
        this.clearSearchLoading = false;
        const { pageNo, pageSize, total, rows } = res.data;
        if (res.data.code === 500) {
          this.$.showError(res);
          return;
        }
        if (rows && rows.length >= 0) {
          this.pageSize = pageSize;
          this.pageNumber = pageNo;
          this.total = total;
          this.saveNoGoodMonitoringList = rows;
        } else if (!rows) {
          this.saveNoGoodMonitoringList = rows;
          this.total = 0;
        }
        this.loading = false;
      });
    },

    //改变每页显示数量
    handleSizeChange(val) {
      this.pageSize = val;

      this.getNoGoodMonitoringListApi();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getNoGoodMonitoringListApi();
    },
    // 搜素请求为空是，刷新列表
    // newLists(e) {
    //   if (e === "" || e == null) {
    //     this.getNoGoodMonitoringListApi(); //关键词竞争分析列表
    //   } else if (el) {
    //   }
    // },
    // newLists1(e) {
    //   this.getNoGoodMonitoringListApi(); //关键词竞争分析列表
    // },

    //搜索
    onSearch() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getNoGoodMonitoringListApi();
    },
    // 清空搜索
    clearSearchLists() {
      this.clearSearchLoading = true;
      this.searchListData = { star: [] };
      // this.recordSearch();
    },
    // 清空搜索函数todom
    recordSearch(param = {}) {
      this.searchListData = {};
      const { pageSize, pageNumber } = this;
      let startTime = this.searchListData.monitorTimeAry
        ? this.searchListData.monitorTimeAry[0]
        : "";
      let endTime = this.searchListData.monitorTimeAry
        ? this.searchListData.monitorTimeAry[1]
        : "";
      const params = this.$.dealObjectValue({
        pageSize,
        pageNumber,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        startTime,
        endTime,
        ...param
      });
      this.loading = true;
      this.clearSearchLoading = true;
      this.$axios.post("/ShopReviewMonitor/list", params).then(res => {
        const { pageNo, pageSize, total, rows } = res.data;
        if (res.data.code === 500) {
          this.$.showError(res);
          return;
        }
        if (rows && rows.length >= 0) {
          this.pageSize = pageSize;
          this.pageNumber = pageNo;
          this.total = total;
          this.saveNoGoodMonitoringList = rows;
        } else if (!rows) {
          this.saveNoGoodMonitoringList = rows;
          this.total = 0;
        }
        this.loading = false;
        this.clearSearchLoading = false;
      });
    },
    //记录搜索值
    // recordSearch(statusText, sku, buyerName, sellerAlias, reviewDate, star) {
    //   let status = {
    //     status: Number(statusText)
    //   };

    //   let params = {
    //     platformId: this.$store.state.common.savePlatformIdAndSiteId.split("," )[0],
    //     pageNumber: 1,
    //     pageSize: 10
    //   };

    //   console.log(star, 111);

    //   if (star instanceof Array && star.length) {
    //     params = Object.assign({}, status, params);
    //   }

    //   params = { ...params, ...this.noGoodLiistsSearch };

    //   for (const key in params) {
    //     if (params.hasOwnProperty(key)) {
    //       const element = params[key];

    //       if (element === null || element === "") {
    //         delete params[key];
    //       }
    //       if (Array.isArray(element) === true) {
    //         if (element.length === 0) {
    //           delete params[key];
    //         }
    //       }
    //     }
    //   }

    //   let dates = params.reviewDate;
    //   if (
    //     !(Array.prototype.isPrototypeOf(reviewDate) && reviewDate.length === 0)
    //   ) {
    //     params = Object.assign({}, params, {
    //       endTime: dates[1],
    //       startTime: dates[0]
    //     });
    //     delete params.reviewDate;
    //   }
    //   console.log(params, "4444");
    //   // params.star = params.star.map(item => Number(item)); //数组中的字符串转数字
    //   this.$axios.post("/ShopReviewMonitor/list", params).then(res => {
    //     if (res.data.code == 500) {
    //       this.$message.error(res.data.msg);
    //       return;
    //     }
    //     if (res.data.rows.length) {
    //       this.currentPage = res.data.pageNo; //分页
    //       this.total = res.data.total;
    //       this.pageSize = res.data.pageSize;
    //       this.saveNoGoodMonitoringList = res.data.rows;
    //     }
    //     if (!res.data.rows.length) {
    //       this.currentPage = res.data.pageNo; //分页
    //       this.total = res.data.total;
    //       this.pageSize = res.data.pageSize;
    //       this.saveNoGoodMonitoringList = res.data.rows;
    //     }
    //   });
    // },
    batchProcessing(type) {
      let params = {
        shopReviewMonitorId: [1],
        status: type
      };
    },

    //批量操作处理
    statusHandle(type) {
      if (this.userSelect.length) {
        switch (type) {
          case 0:
            this.batchProcessing(type);
            break;
          case 1:
            this.batchProcessing(type);
            break;
          case 2:
            this.batchProcessing(type);
            break;
        }
        //去重复
        let a = this.taskIds;
        let s = new Set(a);
        let result = Array.from(s);
        // console.log(result, "222");
        let params = {
          shopReviewMonitorId: result,
          status: type
        };
        // console.log(params.shopReviewMonitorId, "444444");
        // console.log(params.status, "444444");
        this.$axios.post("/ShopReviewMonitor/update", params).then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: "批量操作成功",
              type: "success"
            });
            // this.taskIds = null;
            this.getNoGoodMonitoringListApi(this.params);
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },

    // 批量操作点击
    // handleClick() {
    //   alert("button click");
    // },
    // 删除todom
    // deleteMonitorList() {
    //   if (this.userSelect.length) {
    //     let v = this.taskIds;
    //     let b = new Set(v);
    //     let result = Array.from(b);
    //     this.$confirm("是否删除选中项?", "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     })
    //       .then(() => {
    //         this.$axios
    //           .post("/TaskProductSelling/remove", { taskIds: result })
    //           .then(res => {
    //             if (res.data.code == 0) {
    //               this.$message({
    //                 message: res.data.msg,
    //                 type: "success"
    //               });
    //               this.getSalesMonitoringList();
    //               this.taskIds = [];
    //             }
    //             if (res.data.code == 500) {
    //               this.$message.error(res.data.msg);
    //               this.taskIds = [];
    //             }
    //           });
    //       })
    //       .catch(() => {
    //         this.$message({
    //           type: "info",
    //           message: "已取消删除"
    //         });
    //       });
    //   } else {
    //     this.$message({
    //       showClose: true,
    //       message: "至少需要选中一个",
    //       type: "warning"
    //     });
    //   }
    // },
    // 跳转到店铺授权
    toShopAuthorizationPage() {
      this.$router.push("/admin/shopAuthorization");
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.taskIds = val.map(item => item.shopReviewMonitorId);
    },
    // table删除
    deleteRow(tableData) {
      // console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    // table的查看
    handleClick(index, rowDetail) {
      // console.log(index, rowDetail);
    }
  }
};
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0px !important;
}
.timeCss {
  display: inline;
  margin-left: 30px;
  color: #00c0de;
  font-size: 12px;
  float: right;
  margin-right: 150px;
}
.keywordIndexContainer {
  margin-top: 25px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
