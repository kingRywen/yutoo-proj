<template>
  <!-- 跟卖监控查看 -->
  <div class='salesMonitoringSee'>
    <div style="padding:0px 2px 8px;" class="font_14px" v-model="skutitle">
      <span class="title_icon"></span>
      <span class="color_666">ASIN:</span>
      <span class="titleBox">{{skutitle}}</span>
    </div>
    <!-- 布局 -->
    <el-row type='flex' class="margin_bottom8">
      <!-- 输入框 关键词输入 -->
      <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
        <el-input placeholder="请输入子ASIN" v-model.trim="searchListData.condition" clearable style='max-width:150px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="searchSonSku">搜索</el-button> -->
        <el-button type="success" icon="el-icon-search" @click="searchSonSku">搜索</el-button>
        <!-- 搜索按钮 -->
        <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="reSearchSonSku" style="margin-left:5px !important">清空</el-button>
      </el-col>
      <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
        <!-- todoh -->
        <el-date-picker unlink-panels :picker-options="pickerOptions" :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="true" @change="newTime">
        </el-date-picker>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <!-- <div style="padding:20px 10px;">ASIN:BKDEGGTCEDG</div> -->
    <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="saveSalesMonitoringSeeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortable" empty-text="暂无跟卖">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="sku" label="子ASIN" align='center'>
      </el-table-column>
      <!-- 图片等比缩放 -->
      <el-table-column prop="imageUrl" label="主图" align='center' width="150px">
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover">
            <img :src="scope.row.imageUrl" />
            <div class="__img_wrapper" slot="reference">
              <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="soldTime" label="跟卖时间" align='center'>
      </el-table-column> -->
      <!-- <el-table-column prop="sellerName" label="卖家" align='center'>
        <template slot-scope="scope">
          <span v-if="!scope.row.sellerUrl">{{scope.row.sellerName}}</span>
          <a rel="noopener noreferrer nofollow" v-else :href="scope.row.sellerUrl?scope.row.sellerUrl:'javascript:;'" target="_blank" style="color:#0000ee;">{{scope.row.sellerName}}</a>
        </template>
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.sellerName === '' || scope.row.sellerName == null">{{scope.row.sellerName | _formatData}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.sellerName">
            <div class="fix__row_2">
              <span v-if="!scope.row.sellerUrl">{{scope.row.sellerName}}</span>
              <a rel="noopener noreferrer nofollow" v-else :href="scope.row.sellerUrl?scope.row.sellerUrl:'javascript:;'" target="_blank" style="color:#0000ee;">{{scope.row.sellerName}}</a>
            </div>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="title" label="标题" align='center'>
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title | _formatData}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.title">
            <div class="fix__row_2">
              <span v-if="!scope.row.productUrl">{{scope.row.title}}</span>
              <a rel="noopener noreferrer nofollow" v-else :href="scope.row.productUrl?scope.row.productUrl:'javascript:;'" target="_blank" style="color:#0000ee;">{{scope.row.title}}</a>
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column prop="fbpFlag" label="发货方式" align='center'>
        <template slot-scope="scope">
          <span>{{scope.row.fbpFlag==0?"自发货":scope.row.fbpFlag==1?"FBA":scope.row.fbpFlag==2?"自发货+FBA":"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" align='center' sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.price?scope.row.price:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sellerCnt" label="跟卖卖家数量" align='center' sortable='custom'>
      </el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-alert v-show="showAlert" style="position:fixed;top:30vh;left:50%;margin-left:-200px;width:400px;z-index:9999;" title="提示" type="success" :description="description">
    </el-alert>
  </div>
</template>
<script>
/* eslint-disable */
import { isDisabled, getDay } from "@/api/functions";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      sort: null,
      showAlert: false,
      showAlertTime: 0,
      description: "",
      isDisabled: true,
      hrefData: null,
      loading: true,
      saveSalesMonitoringSeeList: [],
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      tabPosition: 30,
      searchListData: {
        condition: ""
      },
      DateMsg: {
        width: "140px",
        DateValue: getDay().today,
        type: "date"
      },
      // 定义添加监控只能是30天之内
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let one = 30 * 24 * 3600 * 1000;
          let oneMonths = curDate - one;
          return time.getTime() > Date.now() || time.getTime() < oneMonths;
        }
      },
      skutitle: this.$route.query.sku,
      taskId: "",
      multipleSelection: [],
      sellerName1: true,
      sellerName2: false,
      title1: true,
      title2: false
    };
  },
  watch: {
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.isDisabled = isDisabled(newV);
        if (this.isDisabled === true) {
          this.getchildSkuList();
        }
        //要干的事情
      },
      deep: true
    },
    $route(to, from, next) {
      // console.log(to, from, next);
      if (to.name === "salesMonitoringSee") {
        this.getchildSkuList();
        this.skutitle = this.$route.params.sku; //传参
      }
    }
  },
  created() {
    this.$store.commit(
      "common/pathFromCheckProductAnalysis",
      "/admin/monitoringCenter/salesMonitoring"
    );
    this.getchildSkuList();
  },
  mounted() {
    // 到达这里存一下整个路径matched，给子组件做面包屑插入
    let obj = {};
    obj.path = this.$route.matched[this.$route.matched.length - 1].path;
    obj.name = this.$route.matched[this.$route.matched.length - 1].name;
    obj.meta = this.$route.matched[this.$route.matched.length - 1].meta;
    obj.query = this.$route.query;
    this.obj = obj;
    this.$store.commit("monitor/saveSkuMatchedForChild", this.obj);
    //end
  },
  computed: {
    ...mapState("monitor", {
      addKeywordRankingTasks: state => state.keywordRankingTasks
    })
  },
  methods: {
    ...mapActions("monitor", ["getSalesMonitoringSeeListApi"]),
    ...mapMutations("monitor", {}),
    newTime(val) {
      this.pageSize = 10;
      this.pageNumber = 1;
      if (!val) {
        // 去掉日期的时候恢复默认
        this.DateMsg.DateValue = "";
        this.getchildSkuList();
        return;
      }
      this.DateMsg.DateValue = val;
      this.getchildSkuList();
    },
    //传父文件的参数过来，请求数据
    // 排序
    sortable(sort_param) {
      console.log(sort_param.prop);
      let type;
      if (sort_param.order === "descending") {
        type = "desc";
      } else {
        type = "asc";
      }
      // console.log(this.params.sort);
      if (sort_param.prop === null) {
        this.sort = null;
        this.getchildSkuList(); //请求列表
      } else {
        let prop = this.toLine(sort_param.prop);
        this.sort = prop + " " + type;
        this.getchildSkuList(); //请求列表
      }
    },
    getchildSkuList() {
      const { pageSize, pageNumber } = this;
      let taskId = parseInt(this.$route.query.taskId);
      let statTime = this.DateMsg.DateValue;
      let params = this.$.dealObjectValue({
        pageSize,
        pageNumber,
        taskId,
        statTime,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        ...this.searchListData
      });
      if (this.sort === null) {
        delete params.sort;
      } else {
        params.sort = this.sort;
      }
      this.loading = true;
      this.$axios.post("/TaskProductSelling/queryDetails", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          this.loading = false;
        }
        // if (this.showAlertTime == 0) {
        //   if (res.data.data.code === 500) {
        //     this.showAlert = true;
        //     this.description = res.data.data.msg;
        //   }
        // }
        this.loading = false;
        this.pageNumber = res.data.pageNo; //分页
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.saveSalesMonitoringSeeList = res.data.rows;
      });
    },
    // table的查看
    handleClick(row) {
      // console.log(row);
      this.$router.push({
        path: "/admin/monitoringCenter/salesMonitoring/sellerList",
        query: {
          sku: row.sku,
          taskId: this.$route.query.taskId,
          statTime: this.DateMsg.DateValue
        }
      });
    },
    //搜索子SKU
    searchSonSku() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getchildSkuList();
    },
    // 清空搜索
    reSearchSonSku() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.searchListData = { condition: "" };
      // this.getchildSkuList();
    },
    // table选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    // table删除
    deleteRow(tableData) {
      // console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
    },
    //改变每页显示数量
    handleSizeChange(val) {
      this.pageSize = val;
      this.getchildSkuList();
    },
    //改变页数
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getchildSkuList();
    }
  }
};
</script>

<style scoped>
.titleBox {
  text-indent: 1em;
  color: #777;
  font-weight: 900;
}
.keywordIndexContainer {
  margin-top: 20px;
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
</style>
