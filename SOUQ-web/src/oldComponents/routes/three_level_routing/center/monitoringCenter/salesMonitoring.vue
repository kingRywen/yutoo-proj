<template>
  <!-- 跟卖监控 -->
  <div class='salesMonitoring'>
    <el-row class='paddingBobbtom'>
      <el-button type="success" @click="onaddCommodityk">添加商品</el-button>
      <!-- 添加产品 -->
      <el-dialog title="添加产品" :visible.sync="addCommodityk" style="min-width:1200px;padding-right:100px;" width="35%">
        <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%; padding-right:100px; ">
          <el-form-item label="商品ASIN:" prop="sku" :label-width="formLabelWidth" style="margin-top:20px; height：30px;">
            <el-input type="textarea" v-model="form.sku" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox v-model="form.allChildFlag">是否监控所有变体</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" style="width:100%;" @click="addCommodSubmit('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 取消监控 -->
      <el-button type="success" plain @click="cancelSalesMonitor()">取消监控</el-button>
      <el-button type="success" plain @click="deleteMonitorList()">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键字输入 -->
      <el-col :span="15">

        <!-- 输入框 关键字输入 -->
        <el-input placeholder="ASIN" v-model="searchSkuLists.sku" clearable @change="newLists1()" style='max-width:200px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="searchSalesMonitoring()">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <!-- 时间段选择 -->
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px; " @change="currentTimeData">
          <el-radio-button label=1>今日</el-radio-button>
          <el-radio-button label=7>7天</el-radio-button>
          <el-radio-button label=30>30天</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table stripe ref="multipleTable" :data="saveSalesLists" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="sku" label="ASIN" align='center'>
      </el-table-column>
      <el-table-column prop="imgs" label="图片" align='center'>
        <!-- 动态渲染图片 -->
        <template slot-scope="scope">
          <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl?scope.row.imageUrl:''" alt="" style="width: 70px;height: 70px">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" align='center'>
      </el-table-column>
      <el-table-column prop="status" label="状态" align='center'>
      </el-table-column>

      <el-table-column prop="sellerCnt" label="跟卖数量" align='center'>
      </el-table-column>
      <!-- <el-table-column prop=" monitorFlag" label="跟卖数量" align='center'>
        <template slot-scope="scoepe">
          {{scoepe.row. monitorFlag?"是":"否"}}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.taskId,scope.row.sku)" type="primary">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
      currentPage: null, //分页
      total: null, //总条数
      pageSize: null, //每页条数
      tabPosition: 1,
      saveSalesLists: [], //接收请求的列表数据

      addCommodityk: false, //添加任务
      rules: {
        sku: [{ required: true, message: "请输入商品ASIN:", trigger: "blur" }]
      },
      //添加商品
      form: {
        sku: "",
        monitorFlag: 1,
        platformId: this.$store.state.selectPlatform.platformId,
        allChildFlag: 1,
        monitorFlag: null
      },
      // 定义搜索
      searchSkuLists: {
        sku: ""
      },
      taskIds: [],
      userSelect: [],
      // 、、、、、、、、、、、、、、
      checked: false,
      addTask: false,
      formLabelWidth: "120px",

      // 表格数据
      tableData: [
        {
          Numbering: "BSKEYON1136",
          imgs: "Lacoste ",
          titles:
            "Lacoste Men's Short Sleeve '85th Anni' 00's Striped Polo, PH7326",
          sellingQuantity: "666"
        }
      ],
      // 放删除选中的数组
      multipleSelection: []
    };
  },

  created() {
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      pageNumber: 1,
      pageSize: 10
    };
    // this.getSalesMonitoringListApi();
    this.getSalesMonitoringList(this.params); //请求列表数据
    this.getSalesMonitoringSeeListApi();
  },
  computed: {
    ...mapState("monitor", {
      // saveSalesLists: state => state.salesLists
    }),
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
  },
  watch: {
    platformId(val) {
      this.getSalesMonitoringList({ ...this.params, platformId: val });
    }
  },
  methods: {
    newLists1() {
      this.getSalesMonitoringList(this.params); //请求类目查询列表
    },
    ...mapActions("monitor", [
      // getSalesMonitoringListApi
      "getSalesMonitoringSeeListApi"
    ]),
    ...mapMutations("monitor", {
      setWordList: "saveSalesLists"
    }),
    //请求列表
    getSalesMonitoringList(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/TaskProductSelling/list", params).then(res => {
        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.saveSalesLists = res.data.rows;
      });
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getSalesMonitoringList(params);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getSalesMonitoringList(params);
    },
    currentTimeData() {
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };
      console.log(params);
      return this.getSalesMonitoringList(params);
    },

    //点击添加商品
    onaddCommodityk() {
      this.addCommodityk = true;
      this.sku = []; //值为空
    },
    //添加任务提交
    addCommodSubmit(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            sku: this.form.sku.split("\n"), //转换为字符串并且可以换行
            monitorFlag: 1,
            platformId: this.$store.state.selectPlatform.platformId,
            allChildFlag: this.form.allChildFlag ? 1 : 0 //判断是否监控所有变体，传给后台1 或者 0
          };
          _this.$axios.post("/TaskProductSelling/save", params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.addCommodityk = false;
              this.getSalesMonitoringList();
            }
            if (res.data.code == 500) {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    //取消监控
    cancelSalesMonitor() {
      if (this.userSelect.length) {
        let cancelMonitor = [];
        if (this.userSelect.length) {
          this.userSelect.forEach(item => {
            cancelMonitor.push(item.taskId);
            if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              this.$message({
                showClose: true,
                message: "没有添加监控",
                type: "warning"
              });
            }
            let params = {
              taskIds: cancelMonitor
            };
            this.$axios
              .post("/TaskProductSelling/removeMonitor", params)
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.addCommodityk = false;
                  this.getSalesMonitoringListApi();
                  return;
                }
                if (res.data.code == 500) {
                  if (item.monitorFlag == 0 && this.userSelect.length == 1) {
                    this.$message({
                      showClose: true,
                      message: "没有添加监控",
                      type: "warning"
                    });
                  } else {
                    this.$message.error(res.data.msg);
                  }
                }
              });
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选择一个",
          type: "warning"
        });
      }
    },
    //删除监控列表
    deleteMonitorList() {
      if (this.userSelect.length) {
        let v = this.taskIds;
        let b = new Set(v);
        let result = Array.from(b);
        this.$axios
          .post("/TaskProductSelling/remove", { taskIds: result })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getSalesMonitoringList();
              this.taskIds = [];
            }
            if (res.data.code == 500) {
              this.$message.error(res.data.msg);
              this.taskIds = [];
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
    //搜索，跟卖监控 搜索
    searchSalesMonitoring() {
      if (this.searchSkuLists.sku) {
        this.recordSearch(this.searchSkuLists.sku);
      }
    },
    //记录搜索值
    recordSearch(sku) {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        sku
      };

      this.$axios.post("/TaskProductSelling/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.saveSalesLists = res.data.rows;
          this.setWordList(res.data.rows);
          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查到相关的数据");
          return;
        }
      });
    },

    ...mapActions("monitor", ["getSalesMonitoringListApi"]),
    // ...mapMutations("monitor", {
    //   setWordList: "getWordRankingLists"
    // }),
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.taskIds.push(item.taskId);
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
    handleClick(taskId, sku) {
      // console.log(index, rowDetail);
      this.$router.push({
        name: "salesMonitoringSee",
        params: {
          id: taskId,
          sku: sku
        }
      });
    }
  }
};
</script>

<style scoped>
/* .el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  padding-left: 20px !important;
} */
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
