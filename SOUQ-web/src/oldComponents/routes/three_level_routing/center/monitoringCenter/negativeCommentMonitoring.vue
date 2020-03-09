<template>
  <!-- 差评监控 -->
  <div class='negativeCommentMonitoring'>
    <el-dialog title="提示" :visible.sync="dialogFormVisible" width="30%">
      <span>这是一段信息</span>
    </el-dialog>
    <el-row class='paddingBobbtom'>
      <!-- 选择状态 -->
      <span style="padiing:20px;">状态:</span>
      <el-select v-model="noGoodLiistsSearch.status" placeholder="选择状态" style='max-width:120px;margin-right:10px;'>
        <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <!-- 选择时间 -->
      <span>选择时间:</span>
      <template>
        <el-date-picker v-model="noGoodLiistsSearch.reviewDate" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
        </el-date-picker>
      </template>
      <!-- <el-date-picker v-model="value1" type="date" placeholder="选择日期" style="margin-right:10px;">
      </el-date-picker> -->
      <span>ASIN:</span>
      <el-input placeholder="请输入ASIN" v-model="noGoodLiistsSearch.sku" clearable style='max-width:200px;margin-right:10px;'>
      </el-input>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键字输入 -->
      <el-col :span="15">
        <span>笔名:</span>
        <el-input placeholder="请输入笔名" v-model="noGoodLiistsSearch.buyerName" clearable style='max-width:200px; margin-right:10px;'>
        </el-input>
        <!-- 输入框 关键字输入 -->
        <span>店铺名:</span>
        <el-input placeholder="请输入店铺名字" v-model="noGoodLiistsSearch.sellerAlias" clearable style='max-width:200px;  margin-right:10px;'>
        </el-input>
        <!-- 搜索按钮 -->
      </el-col>
      <el-col :span="9">
      </el-col>
    </el-row>
    <el-row class='paddingBobbtom' :gutter="12" type='flex' justify="space-between">
      <div style="display:flex">
        <span style="line-height:80px;margin-right:10px; pading-top:20px; height:40px;">选择评论星级:</span>
        {{noGoodLiistsSearch.checkList}}
        <el-checkbox-group v-model="noGoodLiistsSearch.checkList" style="margin-top:20px;">
          <el-checkbox label="1">一星</el-checkbox>
          <el-checkbox label="2">二星</el-checkbox>
          <el-checkbox label="3">三星</el-checkbox>
          <el-button type="success" icon="el-icon-search" style="margin-left:20px;" @click="onSearch()">搜索</el-button>
        </el-checkbox-group>
      </div>
    </el-row>
    <el-row style="margin-bottom:10px;">
      <el-dropdown split-button type="primary">
        批量操作
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="statusHandle(0)">待处理</el-dropdown-item>
          <el-dropdown-item @click.native="statusHandle(1)">已解决</el-dropdown-item>
          <el-dropdown-item @click.native="statusHandle(2)">已关闭</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <!-- 表格数据 -->
    <!-- {{this.$store.state.monitor.noGoodMonitoringLists}} -->
    <el-table stripe ref="multipleTable" :data="saveNoGoodMonitoringList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <!-- 暂时不需要SKU -->
      <!-- <el-table-column prop="sku" label="ASIN" align='center'>
      </el-table-column> -->
      <el-table-column prop="reviewDate" label="差评创建时间" align='center'>
      </el-table-column>
      <el-table-column prop="sku" label="子ASIN" align='center'>
      </el-table-column>
      <el-table-column prop="buyerName" label="笔名" align='center'>
      </el-table-column>
      <el-table-column prop="skuAttr" label="变体属性" align='center'>
      </el-table-column>
      <el-table-column prop="status" label="状态" align='center'>
        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">待处理</span>
          <span v-if="scope.row.status=='1'">已解决</span>
          <span v-if="scope.row.status=='2'">已关闭</span>
        </template>
      </el-table-column>
      <!-- 取消平均星级 -->
      <!-- <el-table-column prop="star" label="平均星级" align='center'>
      </el-table-column> -->
      <el-table-column prop="sellerAlias" label="店铺名称" align='center'>
      </el-table-column>
      <el-table-column prop="orderId" label="订单ID" align='center'>
      </el-table-column>
      <el-table-column label="评论星级" align='center'>
        <template slot-scope="scope">
          {{ scope.row.evaluateStar | filterFun }}

          <!-- <el-rate v-model="scope.row.status" disabled text-color="#ff9900">
          </el-rate> -->
        </template>
      </el-table-column>
      <el-table-column prop="review" label="评论信息" align='center'>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="100" layout="prev, pager, next, jumper" :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  // 注册过滤器
  filters: {
    filterFun: function(value) {
      // return "parseInt(value)星";
      return `${parseInt(value)}星`;
    }
  },

  data() {
    // 时间选择器
    return {
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
        sellerAlias: "", //卖家名称
        checkList: [], //星级
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
          value: "0",
          label: "待处理"
        },
        {
          value: "1",
          label: "已解决"
        },
        {
          value: "2",
          label: "已关闭"
        }
      ],
      StatusValue: "",
      // 时间段
      tabPosition: "top",
      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1
    };
  },
  created() {
    console.log(this.$store.state.selectPlatform.platformId);
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      star: 2,
      pageNumber: 1,
      pageSize: 10
    };

    this.getNoGoodMonitoringListApi(this.params);
  },
  computed: {
    ...mapState("monitor", {
      saveNoGoodMonitoringList: state => state.noGoodMonitoringLists
    }),
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
  },
  watch: {
    platformId(val) {
      this.getNoGoodMonitoringListApi({ ...this.params, platformId: val });
    }
  },
  methods: {
    //搜索
    onSearch() {
      if (
        this.noGoodLiistsSearch.status ||
        this.noGoodLiistsSearch.sku ||
        this.noGoodLiistsSearch.buyerName ||
        this.noGoodLiistsSearch.sellerAlias ||
        this.noGoodLiistsSearch.checkList ||
        this.noGoodLiistsSearch.reviewDate
      ) {
        this.recordSearch(
          this.noGoodLiistsSearch.status,
          this.noGoodLiistsSearch.sku,
          this.noGoodLiistsSearch.buyerName,
          this.noGoodLiistsSearch.sellerAlias,
          this.noGoodLiistsSearch.checkList,
          this.noGoodLiistsSearch.reviewDate
        );
      }
    },
    //记录搜索值
    recordSearch(
      statusText,
      sku,
      buyerName,
      sellerAlias,
      reviewDate,
      checkList
    ) {
      let status = {
        status: Number(statusText)
      };
      let a = this.noGoodLiistsSearch.checkList.map(item => Number(item)); //数组中的字符串转数字
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        startTime: "this.noGoodLiistsSearch.reviewDate[0]",
        endTime: "this.noGoodLiistsSearch.reviewDate[1]",
        startTime: this.noGoodLiistsSearch.reviewDate[0],
        endTime: this.noGoodLiistsSearch.reviewDate[1],
        sku: this.noGoodLiistsSearch.sku,
        buyerName: this.noGoodLiistsSearch.buyerName,
        sellerAlias: this.noGoodLiistsSearch.sellerAlias,
        evaluateStar: a
      };
      if (this.noGoodLiistsSearch.status) {
        params = Object.assign({}, status, params);
      }
      //p判断点击的星级？？？？？？？？？？？？？？？？？？？？
      // if (this.checkList) {
      //   console.log(this.checkList, "111");
      //   let evaluateStar = {};
      // }

      this.$axios.post("/ShopReviewMonitor/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.setWordList(res.data.rows);
          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查询到相关数据");
        }
      });
    },
    // 状态下拉选择
    // recordSearch(val) {
    //   let params = {
    //     platformId: 2,
    //     pageNumber: 1,
    //     pageSize: 10,
    //     status: Number(val)
    //   };
    //   this.$axios.post("/shopReviewMonitor/list", params).then(res => {
    //     if (res.data.code == 500) {
    //       this.$message.error(res.data.msg);
    //       return;
    //     }

    //     if (res.data.rows.length) {
    //       this.setWordList(res.data.rows);
    //       return;
    //     }
    //     // if (!res.data.rows.length) {
    //     //   this.$message.error("未查询到相关数据");
    //     // }
    //   });
    // },

    ...mapActions("monitor", ["getNoGoodMonitoringListApi"]),
    ...mapMutations("monitor", {
      setWordList: "saveNoGoodMonitoringList"
    }),
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
        console.log(result, "222");
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
            this.getNoGoodMonitoringListApi();
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选择一个",
          type: "warning"
        });
      }
    },

    // 批量操作点击
    handleClick() {
      alert("button click");
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      val.forEach(item => {
        this.taskIds.push(item.shopReviewMonitorId);
      });
    },
    // table删除
    deleteRow(tableData) {
      console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    // table的查看
    handleClick(index, rowDetail) {
      console.log(index, rowDetail);
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped>
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
