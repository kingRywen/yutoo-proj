<!-- 竞品分析主页 -->
<template>
  <div class='keywordIndexContainer productAnalysisContainer'>
    <!-- 添加产品弹窗 -->
    <el-dialog top="30vh" title="添加产品" :visible.sync="dialogShow.dialogFormVisible" width="25%">
      <div class='dialogContent' style="overflow:hidden;">
        <div class='dialogProAnsContainer'>
          <!-- asin -->
          <div class='dialogTabNAme'>商品ASIN：</div>
          <div>
            <el-input type="textarea" :rows="4" placeholder="多个ASIN换行输入" v-model="dialogData.textarea" style="width:100%">
            </el-input>
          </div>
        </div>
        <!-- 是否马上添加到监控 -->
        <div style="margin-top:15px;">
          <el-checkbox v-model="dialogData.checked">是否添加监控</el-checkbox>
          <div class="block" style='margin-top:15px;' v-show="dialogData.checked">
            <el-date-picker v-model="dialogData.datePickValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <p class='saveContainer' style='text-align:center;margin-top:40px;'>
          <el-button type="primary" size="large" style='width:50%' @click="addProduct">确认</el-button>
        </p>
      </div>
    </el-dialog>
    <!-- 添加监控弹窗 -->
    <el-dialog top="30vh" title="添加监控" :visible.sync="dialogShow.dialogMonitorVisible" width="24%">
      <div class='dialogContent' style="overflow:hidden;">
        <div style="margin-top:15px;">
          <div class="block" style='margin-top:15px;display:flex;justify-content:center'>
            <el-date-picker v-model="dialogData.monitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class='saveContainer' style='text-align:center;margin-top:40px;'>
          <el-button type="primary" size="large" style='width:50%' @click="addMonitoring">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <el-row class='paddingBobbtom'>
      <el-button type="success" @click="dialogShow.dialogFormVisible = true">添加产品</el-button>
      <el-button type="success" plain @click="showAddMonitoring('add')">添加监控</el-button>
      <el-button type="success" plain @click="showAddMonitoring('change')" style="width:140px">修改监控周期</el-button>
      <el-button type="success" plain @click="cancelMonitoring">取消监控</el-button>
      <el-button type="success" plain @click="deleteProduct">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 -->
      <el-col :span="15">
        <el-input placeholder="输入ASIN" v-model="inputText" clearable style='max-width:200px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="searchProduct" :disabled="inputText.length>0?false:true">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <!-- 时间段选择 -->
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="useWhichTabs">
          <el-radio-button label="0">今日</el-radio-button>
          <el-radio-button label="7">7天</el-radio-button>
          <el-radio-button label="30">30天</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table height="600px" v-loading="tableLoading" stripe ref="Table" :data="listData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="sku" label="ASIN" align='center'>
      </el-table-column>
      <el-table-column prop="imageUrl" label="图片" align='center'>
        <template slot-scope="scope">
          <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl?scope.row.imageUrl:''" alt="" style="width: 70px;height: 70px">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" align='center'>
      </el-table-column>
      <el-table-column prop="category" label="类目" align='center'>
      </el-table-column>
      <el-table-column prop="sellerName" label="卖家" align='center'>
      </el-table-column>
      <el-table-column label="监控状态" align='center'>
        <template slot-scope="scope">{{ scope.row.monitorFlag==0?"未开启":scope.row.monitorFlag==1?"开启":'系统正在抓取中...' }}</template>
      </el-table-column>
      <el-table-column label="监控起止时间" align='center'>
        <template slot-scope="scope">{{ scope.row.monitorFrom?scope.row.monitorFrom.slice(0,10)+"~"+scope.row.monitorTo.slice(0,10):"" }}</template>
      </el-table-column>
      <el-table-column prop="handle" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.$index,scope.row)" type="primary" v-if="scope.row.buttonText">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <img src="@/assets/images/13.png" alt="Pc图标" style="width:25px;height:25px;">
      <PageVue v-bind:childPages="page" v-on:size-change="getSizeChange" v-on:current-page="getPage"></PageVue>
    </div>
  </div>
</template>

<script>
// todoi
import { mapActions, mapGetters } from "vuex";
import { getDay, Trim, removeArrEmpty } from "../../../../../api/functions.js";
import {
  proDefaultDay,
  ProductAnalysisListUrl,
  ProductAnalysisSaveUrl,
  ProductAnalysisRemoveUrl,
  ProductMonitoringUrl,
  cancelMonitoringUrl,
  ProductAnalysisUpdateMonitorUrl
} from "../../../../../api/myApi";
import PageVue from "../../../../common/page.vue";
export default {
  components: {
    PageVue
  },
  data() {
    return {
      dialogShow: {
        dialogFormVisible: false,
        dialogMonitorVisible: false,
        dialogMonitorType: ""
      },
      // 弹窗数据
      dialogData: {
        textarea: "",
        checked: true,
        datePickValue: "", // 添加产品的时间数组
        monitorDateValue: "" // 添加监控的时间数组
      },
      StatusValue: "",
      // 时间段
      tabPosition: this.$route.query.tabPosition || proDefaultDay,
      inputText: "",
      tableHandle: {
        multipleSelection: [],
        selectTaskIdArr: [],
        // 记录是搜索返回的数据，还是列表数据 1列表数据，-1搜索数据
        tableType: "-1"
      },
      page: {
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      }
    };
  },
  created() {},
  mounted() {
    // todoc
    this.changeTabPosition(
      this.tabPosition,
      this,
      parseInt(this.$route.query.currentPage),
      parseInt(this.$route.query.Size)
    );
    // setInterval(() => {
    //   this.changeTabPosition(this.tabPosition, false);
    // }, 30000); // 竞争分析和店铺分析不用定时刷新页面
  },
  computed: {
    listData() {
      return this.$store.state.competitive.ProductAnalysisList.rows;
    },
    tableLoading() {
      return this.$store.state.competitive.tableLoading;
    }
  },
  watch: {
    "page.Size"() {
      if (this.tableHandle.tableType == -1) {
        this.changeTabPosition(this.tabPosition, this);
      } else if (this.tableHandle.tableType == 1) {
        let txt = Trim(this.inputText, "");
        this.searchTabPosition(this.tabPosition, this, null, null, txt);
      }
      this.$router.push(
        "/admin/competitive/productAnalysis?currentPage=" +
          this.page.currentPage +
          "&Size=" +
          this.page.Size +
          "&tabPosition=" +
          this.tabPosition +
          "&tableType=" +
          this.tableHandle.tableType
      );
    },
    "page.currentPage"() {
      if (this.tableHandle.tableType == -1) {
        this.changeTabPosition(this.tabPosition, this);
      } else if (this.tableHandle.tableType == 1) {
        let txt = Trim(this.inputText, "");
        this.searchTabPosition(this.tabPosition, this, null, null, txt);
      }
      this.$router.push(
        "/admin/competitive/productAnalysis?currentPage=" +
          this.page.currentPage +
          "&Size=" +
          this.page.Size +
          "&tabPosition=" +
          this.tabPosition +
          "&tableType=" +
          this.tableHandle.tableType
      );
    },
    tabPosition() {
      this.$router.push(
        "/admin/competitive/productAnalysis?currentPage=" +
          this.page.currentPage +
          "&Size=" +
          this.page.Size +
          "&tabPosition=" +
          this.tabPosition +
          "&tableType=" +
          this.tableHandle.tableType
      );
    },
    inputText(a) {
      if (a === "") {
        this.getAll();
      }
    }
  },
  methods: {
    ...mapActions("competitive", [
      "actionGetProductAnalysisList",
      "actionSearchProductAnalysisList"
    ]),
    // input的值为空，则代表以展示列表的形式切换分页和tabs，但input有值并不代表就是搜索列表。还要在搜索返回数据之后切换成1
    getAll() {
      this.tableHandle.tableType = "-1";
      this.changeTabPosition(
        this.tabPosition,
        this,
        parseInt(this.$route.query.currentPage),
        parseInt(this.$route.query.Size)
      );
    },
    // 添加产品
    addProduct() {
      let params = {
        platformId: 1,
        skus: this.dialogData.textarea,
        monitorFlag: this.dialogData.checked === true ? 1 : 0
      };
      let skuArr = params.skus.replace(/\n/g, ",").split(","); // ["1 2", "2", "3", "4", "", "", "", ""]
      let newskuArr = [];
      skuArr.forEach((v, i) => {
        let vStr = Trim(v, "g"); //functions
        newskuArr.push(vStr);
      });
      params.skus = removeArrEmpty(newskuArr); //functions
      if (params.skus == "") {
        this.$alert("请至少输入一个ASIN");
        return;
      }
      // console.log(params.skus); // 处理后的params.skus数组
      if (params.monitorFlag == 1) {
        if (!this.dialogData.datePickValue) {
          this.$alert("请选择监控起始时间");
          return;
        }
        params.monitorFrom = this.dialogData.datePickValue[0];
        params.monitorTo = this.dialogData.datePickValue[1];
      }
      this.$store.commit("competitive/tableLoading", true); // loading
      this.$axios
        .post(ProductAnalysisSaveUrl, params)
        .then(res => {
          console.log("添加产品接口响应", res.data);
          if (res.data.code != 0) {
            this.$message.error(res.data.msg);
            this.$store.commit("competitive/tableLoading", false); // loading
            return;
          }
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.dialogShow.dialogFormVisible = false;
          this.changeTabPosition(this.tabPosition, this); // 添加产品后重新发起请求todo
        })
        .catch(err => {
          console.log("添加产品失败", err);
        });
    },
    // 删除产品
    deleteProduct() {
      let taskIdArr = this.tableHandle.selectTaskIdArr;
      console.log(taskIdArr == "");
      if (taskIdArr == "") {
        this.$message.error("请选择要删除的选项");
        return;
      }
      this.$confirm("此操作将删除选中项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            taskIds: taskIdArr
          };
          console.log(params);
          this.$store.commit("competitive/tableLoading", true); // loading
          this.$axios.post(ProductAnalysisRemoveUrl, params).then(res => {
            if (res.data.code != 0) {
              this.$message.error(res.data.msg + " 确保删除前取消监控");
              this.changeTabPosition(
                this.tabPosition,
                this,
                parseInt(this.$route.query.currentPage),
                parseInt(this.$route.query.Size)
              ); // 删除任务后重新发起请求
              return;
            }
            this.$nextTick(function() {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            });
            // this.dialogShow.dialogFormVisible = false;
            this.changeTabPosition(
              this.tabPosition,
              this,
              parseInt(this.$route.query.currentPage),
              parseInt(this.$route.query.Size)
            ); // 删除任务后重新发起请求
            console.log("删除失败响应", res.data);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加/修改监控
    showAddMonitoring(type) {
      if (this.listData == undefined) {
        if (type == "add") {
          this.$message.error("暂无可监控的数据，请先添加产品");
        }
        if (type == "change") {
          this.$message.error("暂无可修改的数据，请先添加产品");
        }
        return;
      }
      if (this.tableHandle.selectTaskIdArr == "") {
        if (type == "add") {
          this.$message.error("请选择要添加的选项");
        }
        if (type == "change") {
          this.$message.error("请选择要修改的选项");
        }
        return;
      }
      this.dialogShow.dialogMonitorVisible = true;
      this.dialogShow.dialogMonitorType = type;
    },
    addMonitoring() {
      let type = this.dialogShow.dialogMonitorType;
      let monitoringUrl;
      if (type == "add") {
        monitoringUrl = ProductMonitoringUrl;
      }
      if (type == "change") {
        monitoringUrl = ProductAnalysisUpdateMonitorUrl;
      }
      let taskIdArr = this.tableHandle.selectTaskIdArr;
      let params = {
        taskIds: taskIdArr
      };
      if (!this.dialogData.monitorDateValue) {
        this.$alert("请选择监控起始时间");
        return;
      }
      params.monitorFrom = this.dialogData.monitorDateValue[0];
      params.monitorTo = this.dialogData.monitorDateValue[1];
      this.$store.commit("competitive/tableLoading", true); // loading
      this.$axios
        .post(monitoringUrl, params)
        .then(res => {
          console.log("添加监控/修改接口响应", res.data);
          if (res.data.code != 0) {
            if (type == "add") {
              this.$message.error(
                res.data.msg + "未处理成功的由于处于监控状态。"
              );
            }
            if (type == "change") {
              this.$message.error(
                res.data.msg + "未处理成功的由于未开启监控。"
              );
            }
            this.$store.commit("competitive/tableLoading", false); // loading
            this.dialogShow.dialogMonitorVisible = false;
            return;
          }
          if (type == "add") {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
          }
          if (type == "change") {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          }
          this.dialogShow.dialogMonitorVisible = false;
          this.changeTabPosition(this.tabPosition, this); // 添加产品后重新发起请求
        })
        .catch(err => {
          console.log("添加、修改监控失败", err);
        });
    },
    //取消监控
    cancelMonitoring() {
      let taskIdArr = this.tableHandle.selectTaskIdArr;
      console.log(taskIdArr == "");
      if (taskIdArr == "") {
        this.$message.error("请选择要取消的选项");
        return;
      }
      let params = {
        taskIds: taskIdArr
      };
      console.log(params);
      this.$confirm("此操作将取消监控选中项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.commit("competitive/tableLoading", true); // loading
          this.$axios.post(cancelMonitoringUrl, params).then(res => {
            if (res.data.code != 0) {
              this.$message.error(res.data.msg + "已取消的不能重复提交");
              this.changeTabPosition(
                this.tabPosition,
                this,
                parseInt(this.$route.query.currentPage),
                parseInt(this.$route.query.Size)
              ); // 取消监控任务后重新发起请求
              return;
            }
            this.$nextTick(function() {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            });
            // this.dialogShow.dialogFormVisible = false;
            this.changeTabPosition(
              this.tabPosition,
              this,
              parseInt(this.$route.query.currentPage),
              parseInt(this.$route.query.Size)
            ); // 取消监控任务后重新发起请求todo
            // if (this.tableHandle.tableType == -1) {
            //   this.changeTabPosition(
            //     this.tabPosition,
            //     this,
            //     parseInt(this.$route.query.currentPage),
            //     parseInt(this.$route.query.Size)
            //   ); // 取消监控任务后重新发起请求todo
            // } else if (this.tableHandle.tableType == 1) {
            //   this.searchTabPosition(
            //     this.tabPosition,
            //     this,
            //     null,
            //     null,
            //     Trim(this.inputText, "g")
            //   ); // 取消监控任务后重新发起请求
            // }
            console.log("取消监控失败响应", res.data);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃操作"
          });
        });
    },
    // 单个ASIN搜索
    searchProduct() {
      let txt = Trim(this.inputText, "g");
      if (txt.length == 0) {
        this.$message.error("ASIN不能为空");
        return;
      }
      this.searchTabPosition(this.tabPosition, this, 1, 10, txt);
    },
    searchTabPosition(day, _this, pageNumber, pageSize, sku) {
      // 竞品分析列表/ProductAnalysis/list
      this.$store.dispatch("competitive/actionSearchProductAnalysisList", {
        params: {
          platformId: 1,
          sku: sku,
          // startTime: "2018-6-12",
          startTime: getDay(day).computedDay, //functions
          // endTime: "2018-6-15",
          endTime: getDay().today, // functions
          pageNumber: pageNumber || this.page.currentPage,
          pageSize: pageSize || this.page.Size
        },
        _this: _this
      });
    },
    // search模式的tab 今天 7天 30天
    searchChangeTabs(tabval, argsku) {
      this.page.currentPage = 1; // 切换条件从第一页开始
      this.searchTabPosition(
        tabval,
        this,
        this.page.currentPage,
        this.page.Size,
        argsku
      );
    },
    // 实际根据tableType切换今天，7
    useWhichTabs(tabval) {
      let txt = Trim(this.inputText, "g");
      if (this.tableHandle.tableType == 1) {
        this.searchChangeTabs(tabval, txt);
      } else {
        this.changeTabs(tabval);
      }
    },
    // 默认模式tab 今天 7天 30天
    changeTabs(tabval) {
      this.page.currentPage = 1; // 切换条件从第一页开始
      this.changeTabPosition(
        tabval,
        this,
        this.page.currentPage,
        parseInt(this.$route.query.Size)
      );
    },
    // tableType为列表数据的分页切换和时间段切换
    changeTabPosition(day, _this, pageNumber, pageSize) {
      // 竞品分析列表/ProductAnalysis/list
      this.$store.dispatch("competitive/actionGetProductAnalysisList", {
        params: {
          platformId: 1,
          // sku: "B00AHRDKOO",
          // startTime: "2018-6-12",
          startTime: getDay(day).computedDay, //functions
          // endTime: "2018-6-15",
          endTime: getDay().today, // functions
          pageNumber: pageNumber || this.page.currentPage,
          pageSize: pageSize || this.page.Size
        },
        _this: _this
      });
    },
    // table选中
    handleSelectionChange(val) {
      this.tableHandle.multipleSelection = val;
      let selected = this.tableHandle.multipleSelection;
      this.tableHandle.selectTaskIdArr = [];
      selected.forEach((v, i) => {
        this.tableHandle.selectTaskIdArr = this.tableHandle.selectTaskIdArr.concat(
          v.taskId
        );
      });
      // console.log(this.tableHandle.selectTaskIdArr);
    },
    // table删除
    deleteRow(tableData) {},
    // table的查看
    handleClick(index, rowDetail) {
      console.log(index, rowDetail);
      this.$router.push(
        "/admin/competitive/checkProductAnalysis?sku=" +
          rowDetail.sku +
          "&taskId=" +
          rowDetail.taskId
      );
      // console.log(rowDetail);
    },
    // 监听分页
    getSizeChange(size) {
      this.page.Size = size;
    },
    getPage(currentPage) {
      this.page.currentPage = currentPage;
    }
  }
};
</script>

<style scoped>
.productAnalysisContainer {
  margin-top: 30px;
  border: 1px solid #ebeef5;
  padding: 10px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
/* 弹窗自定义区域 */
</style>
