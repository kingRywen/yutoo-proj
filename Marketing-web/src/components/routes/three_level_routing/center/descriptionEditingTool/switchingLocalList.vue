<template>
  <!-- 切换本地列表 -->
  <div class='switchingLocalList'>

    <el-row>
      <el-button type="success" @click="addEdition()">添加版本</el-button>
      <!-- <el-button type="success" plain @click="deleteRow(tableData)">删除</el-button> -->
      <el-button type="success" plain @click="deleteList()">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row style="margin-top:10px;margin-bottom: 16px;height:32px" type="flex" justify="space-between">
      <!-- 输入框 关键词输入 -->
      <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">

        <el-input placeholder="输入版本名称" v-model.trim="searchEditions.versionName" clearable @change="newLists1" style='max-width:150px;'>
        </el-input>
        <el-input placeholder="描述内容" v-model.trim="searchEditions.content" clearable @change="newLists2" style='max-width:150px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="searchEditionList()">搜索</el-button>
      </el-col>
      <!-- <el-col :span="10" style="padding-top:10px;" class="timeStyleBox timeStyle">
        <el-radio-group v-model="tabPosition" @change="currentTimeData()">
          <el-radio-button label="1">今日</el-radio-button>
          <el-radio-button label="7">7天</el-radio-button>
          <el-radio-button label="30">30天</el-radio-button>
        </el-radio-group>
        <template>
          <div style="display:inline;">
            <el-date-picker  unlink-panels :label-width="formLabelWidth" value-format="yyyy-MM-dd" @blur="newTime()" clearable @change="newLists3()" class="el-date-wrapper" style="width:45%" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </template>
      </el-col> -->
    </el-row>
    <!-- 表格数据 -->
    <el-table :max-height="12000" v-loading="loading" stripe :data="editionListget" tooltip-effect="dark" class="tableBox" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="versionName" label="版本名称" align='center'>
      </el-table-column>
      <el-table-column label="描述内容" align='center'>
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.content === '' || scope.row.content == null">{{scope.row.content | filterHtml}}</div>
          <el-tooltip v-else placement="top" :open-delay="600">
            <div slot="content">{{scope.row.content | filterHtml}}</div>
            <div class="fix__row_2">
              {{scope.row.content | filterHtml}}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="修订时间" align='center'>
      </el-table-column>
      <el-table-column label="操作" align='center' class="deleteStyle">
        <template slot-scope="scope">
          <el-button @click="sendParams(scope.row)" type="primary">编辑</el-button>
          <!-- <el-button @click="onEdit(scope.$index,scope.row)" type="primary">编辑</el-button> -->
          <el-button @click="onDelete(scope.row.descriptionId)" type="primary" plain>删除</el-button>
        </template>

      </el-table-column>
    </el-table>
    <!-- <el-button type="success" style="margin:10px;">另存为版本</el-button> -->
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
      loading: true,
      formLabelWidth: "120px",
      surplusAmount: null, //剩余点数
      charge: null, //点数
      monitorTimeAry: [], //时间选择器
      tabPosition: 30,
      currentPage: null, //分页
      total: null, //总条数
      pageSize: null, //每页条数
      editionListget: [],
      // 搜索定义的变量
      searchEditions: {
        versionName: "",
        content: ""
      },
      userSelect: [],
      descriptionIds: [],

      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 关键词
      inputText: "",
      // 来源
      originOptions: [
        {
          value: "选项1",
          label: "Google"
        },
        {
          value: "选项2",
          label: "速卖通"
        },
        {
          value: "选项3",
          label: "merchantwords"
        }
      ],
      originValue: "",
      // 状态
      StatusOptions: [
        {
          value: "选项1",
          label: "开启"
        },
        {
          value: "选项2",
          label: "抓取成功"
        }
      ],
      StatusValue: "",

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getEditionListApi(vm.params); //版本列表
    });
    console.log("请求");
  },

  //初始调用方法
  created() {
    this.$store.commit(
      "common/pathFromCheckProductAnalysis",
      "/admin/descriptionEditing"
    );
    this.params = {
      platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
        ","
      )[0],
      pageNumber: 1,
      pageSize: 10
    };
    this.getEditionListApi(this.params); //版本列表
    this.getPointeApi(); //请求扣点
  },
  //计算属性
  computed: {
    // ...mapState("editingTools", {
    //   editionListget: state => state.editionListget
    // })
  },
  watch: {
    // platformId(val) {
    //   this.getEditionListApi({ ...this.params, platformId: val });
    // }
  },
  methods: {
    // 请求扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/description/list").then(res => {
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
    newLists1(e) {
      if (e === "" || e == null) {
        this.getEditionListApi(this.params); //
      }
    },
    newLists2(e) {
      if (e === "" || e == null) {
        this.getEditionListApi(this.params); //
      }
    },
    // ...mapActions("editingTools", ["getEditionListApi"]),
    ...mapMutations("editingTools", {
      // setWordLists: "getKeywordList"
    }),
    //请求列表
    getEditionListApi(
      params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/Description/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          this.loading = false;
        }
        if (res.data.rows && res.data.rows.length) {
          this.loading = false;
          this.currentPage = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.editionListget = res.data.rows;
        }
        if (res.data.rows && !res.data.rows.length) {
          this.loading = false;
          this.currentPage = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.editionListget = res.data.rows;
        }
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.getEditionListApi(params);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.getEditionListApi(params);
    },
    //获取多少天以前的时间
    getBeforeTime(n) {
      var n = n;
      var d = new Date();
      var year = d.getFullYear();
      var mon = d.getMonth() + 1;
      var day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      return (
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    //计算本月有多少天
    getCountDays() {
      var curDate = new Date();
      var curMonth = curDate.getMonth();
      curDate.setMonth(curMonth + 1);
      curDate.setDate(0);
      return curDate.getDate();
    },
    //根据时间选择日期 1.7.30
    currentTimeData() {
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      let dateObj = new Date();
      let _end = `${dateObj.getFullYear()}-${dateObj.getMonth() +
        1}-${dateObj.getDate()}`;
      let _start = null;
      switch (params.createTime) {
        case 7:
          // _end = _start;
          // console.log(this.getBeforeTime(7), this.getCountDays());
          _start = this.getBeforeTime(7);
          break;
        case 30:
          // console.log(this.getBeforeTime(30), this.getCountDays());
          _start = this.getBeforeTime(30);
          break;
        default:
          _start = _end;
      }
      this.monitorTimeAry = [_start, _end];
      this.$forceUpdate();
      // console.log(params);
      return this.getEditionListApi(params);
    },
    //自由选择时间 刷新列表
    newTime() {
      let a = Number(this.tabPosition);
      this.tabPosition = null;
      let params = {
        // createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      };
      return this.getEditionListApi(params);
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.descriptionIds.push(item.descriptionId);
      });
    },

    // 删除多个
    deleteList() {
      if (this.userSelect.length) {
        if (this.userSelect.length) {
          let a = this.descriptionIds; //去重
          let s = new Set(a);
          let result = Array.from(s);
          this.$confirm("确定删除数据？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$axios
                .post("/Description/remove", { descriptionIds: result })
                .then(res => {
                  if (res.data.code == 0) {
                    //成功返回的数据
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.getEditionListApi();
                    this.descriptionIds = [];
                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                    this.$message.error(res.data.msg);
                    this.descriptionIds = [];
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    //删除 单个
    onDelete(id) {
      if (id) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let a = this.descriptionIds;
            a.push(id);
            let result = Array.from(a);
            // console.log(result, "555555555");
            this.$axios
              .post("/Description/remove", { descriptionIds: result })
              .then(res => {
                if (res.data.code == 0) {
                  //成功返回的数据
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });

                  this.getEditionListApi();
                  this.descriptionIds = [];
                  return;
                }
                if (res.data.code == 500) {
                  this.$message.error(res.data.msg);
                  this.$message.error(res.data.msg);
                  this.descriptionIds = [];
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },

    open2() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //搜索版本名称 描述内容
    searchEditionList() {
      if (this.searchEditions.versionName || this.searchEditions.content) {
        this.reacordSearch(
          this.searchEditions.versionName,
          this.searchEditions.content
        );
      }
    },
    //记录搜索值
    reacordSearch(versionName, content) {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: 1,
        pageSize: 10,
        versionName,
        content
      };
      // console.log(params, "666");
      this.$axios.post("/Description/list", params).then(res => {
        // console.log(res.data.rows, "5555");
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.currentPage = res.data.pageNo;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.editionListget = res.data.rows;
          return;
        }
        if (!res.data.rows.length) {
          this.currentPage = res.data.pageNo;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.editionListget = res.data.rows;
        }
      });
    },

    //添加版本
    addEdition() {
      this.$router.push({
        name: "descriptionEditing"
      });
    },
    // // 编辑
    sendParams(row) {
      let params = {
        descriptionId: row.descriptionId
      };
      this.$axios.post("/Description/info", params).then(res => {
        if (res.data.code == 0) {
          this.$router.push({
            name: "addNewEdition",
            query: {
              descriptionId: res.data.data.descriptionId,
              versionName: res.data.data.versionName,
              content: res.data.data.content
            }
          });
        }
      });
    }

    // 分页
  }
};
</script>

<style scoped>
/* .el-button + .el-button {
  margin-left: 20px !important;
} */
.timeCss {
  display: inline;
  margin-left: 30px;
  color: #00c0de;
  font-size: 12px;
}
.tableBox {
  width: 100%;
  margin-top: 10px;
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
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: orange;
  background-color: #fff;
  border-color: orange;
  -webkit-box-shadow: -1px 0 0 0;
  box-shadow: -1px 0 0 0;
}
</style>
