<template>
  <!-- 跟卖监控查看 -->
  <div class='salesMonitoringSee'>
    <el-dialog title="提示" :visible.sync="dialogFormVisible" width="30%">
      <span>这是一段信息</span>
    </el-dialog>

    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键字输入 -->
      <el-col :span="15">
        <el-input placeholder="ASIN" v-model="sonSkuList.sku" clearable style='max-width:200px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="searchSonSku()">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <!-- 时间段选择 -->
        <!-- <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;">
          <el-radio-button label="top">今日</el-radio-button>
          <el-radio-button label="right">7天</el-radio-button>
          <el-radio-button label="bottom">30天</el-radio-button>
        </el-radio-group> -->
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <!-- <div style="padding:20px 10px;">ASIN:BKDEGGTCEDG</div> -->
    <div style="padding:20px 10px;">ASIN:{{skutitle}}</div>
    <el-table stripe ref="multipleTable" :data="saveSalesMonitoringSeeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">

      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="sku" label="子ASIN" align='center'>
      </el-table-column>
      <el-table-column prop="soldTime" label="跟卖时间" align='center'>
      </el-table-column>
      <el-table-column prop="sellerName" label="卖家" align='center'>
      </el-table-column>

      <el-table-column prop="title" label="标题" align='center'>
      </el-table-column>

      <el-table-column prop="price" label="价格" align='center'>
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
  data() {
    return {
      sonSkuList: {
        sku: "",
        taskId: ""
      },
      skutitle: "",
      taskId: "",
      // ??//////////////
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 关键词
      inputText: "",

      originValue: "",

      // 时间段
      tabPosition: "top",

      multipleSelection: [],
      // 分页
      currentPage3: 1
    };
  },
  watch: {
    $route(to, from, next) {
      console.log(to, from, next);
      if (to.name === "salesMonitoringSee") {
        this.getchildSkuList();
        this.skutitle = this.$route.params.sku; //传参
      }
    }
  },
  created() {
    // this.getSalesMonitoringSeeListApi();
  },
  mounted() {},
  computed: {
    ...mapState("monitor", {
      saveSalesMonitoringSeeList: state => state.salesMonitoringSeeList,
      addKeywordRankingTasks: state => state.keywordRankingTasks
    })
  },
  methods: {
    ...mapActions("monitor", ["getSalesMonitoringSeeListApi"]),
    ...mapMutations("monitor", {
      setWordList: "saveSalesMonitoringSeeList"
    }),

    //传父文件的参数过来，请求数据
    getchildSkuList(pageNumber = 1, pageSize = 10) {
      let params = {
        taskId: this.$route.params.id,
        pageNumber,
        pageSize
      };
      // console.log(this.$route.params.id);
      this.$axios.post("/TaskProductSelling/queryDetails", params).then(res => {
        // console.log(res);
        // debugger;
        this.setWordList(res.data.rows);
      });
    },

    //搜索子SKU
    searchSonSku() {
      if (this.sonSkuList.sku) {
        this.recordSearch(this.sonSkuList.sku, this.sonSkuList.taskId);
      }
    },
    //记录搜索值
    recordSearch(sku, taskId) {
      let params = {
        sku,
        taskId: this.$route.params.id,

        pageNumber: 1,
        pageSize: 10
      };
      debugger;
      this.$axios.post("/TaskProductSelling/queryDetails", params).then(res => {
        console.log(res, 212121);
        if (res.data.rows.length) {
          this.setWordList(res.data.rows);
          return;
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查询到相关的数据");
        }
      });
    },
    // table选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
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
</style>
