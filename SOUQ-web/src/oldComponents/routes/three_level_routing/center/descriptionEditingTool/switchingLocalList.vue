<template>
  <!-- 切换本地列表 -->
  <div class='switchingLocalList'>

    <el-row class='paddingBobbtom'>
      <el-button type="success" @click="addEdition()">添加版本</el-button>
      <!-- <el-button type="success" plain @click="deleteRow(tableData)">删除</el-button> -->
      <el-button type="success" plain @click="deleteList()">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键字输入 -->
      <el-col :span="15">

        <el-input placeholder="输入版本名称" v-model="searchEditions.versionName" clearable @change="newLists1()" style='max-width:200px;'>
        </el-input>
        <el-input placeholder="描述内容" v-model="searchEditions.content" clearable @change="newLists2()" style='max-width:200px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="searchEditionList()">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <!-- 时间段选择 -->
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="currentTimeData">
          <el-radio-button label="1">今日</el-radio-button>
          <el-radio-button label="7">7天</el-radio-button>
          <el-radio-button label="30">30天</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table stripe :data="editionListget" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="versionName" label="版本名称" align='center'>
      </el-table-column>
      <el-table-column label="描述内容" align='center'>
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="修订时间" align='center'>
      </el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button @click="sendParams(scope.row)" type="primary">编辑</el-button>
          <!-- <el-button @click="onEdit(scope.$index,scope.row)" type="primary">编辑</el-button> -->
          <el-button @click="onDelete()" type="primary">删除</el-button>
        </template>

      </el-table-column>
    </el-table>
    <!-- <el-button type="success" style="margin:10px;">另存为版本</el-button> -->
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
      tabPosition: 1,
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

  //初始调用方法
  created() {
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      pageNumber: 1,
      pageSize: 10
    };
    this.getEditionListApi(this.params); //版本列表
  },
  //计算属性
  computed: {
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
    // ...mapState("editingTools", {
    //   editionListget: state => state.editionListget
    // })
  },
  watch: {
    platformId(val) {
      this.getEditionListApi({ ...this.params, platformId: val });
    }
  },
  methods: {
    newLists1() {
      this.getEditionListApi(this.params); //
    },
    newLists2() {
      this.getEditionListApi(this.params); //
    },
    // ...mapActions("editingTools", ["getEditionListApi"]),
    ...mapMutations("editingTools", {
      // setWordLists: "getKeywordList"
    }),
    //请求列表
    getEditionListApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/Description/list", params).then(res => {
        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.editionListget = res.data.rows;
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getEditionListApi(params);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getEditionListApi(params);
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
        }
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选择一个",
          type: "warning"
        });
      }
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
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        versionName,
        content
      };
      console.log(params, "666");
      this.$axios.post("/Description/list", params).then(res => {
        console.log(res.data.rows, "5555");
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.currentPage = res.data.pageNo;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.editionListget = res.data.rows;
          this.setWordLists(res.data.rows);
          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查到该数据");
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
            params: {
              descriptionId: res.data.data.descriptionId,
              versionName: res.data.data.versionName,
              content: res.data.data.content
            }
          });
        }
      });
    },
    //删除 单个
    onDelete() {
      if (this.userSelect.length) {
        if (this.userSelect.length) {
          let a = this.descriptionIds;
          let s = new Set(a);
          let result = Array.from(s);
          console.log(result, "555555555");
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
        }
      } else {
        this.$message({
          showClose: true,
          message: "请勾选后再操作删除",
          type: "warning"
        });
      }
    }
    // 分页
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
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: orange;
  background-color: #fff;
  border-color: orange;
  -webkit-box-shadow: -1px 0 0 0;
  box-shadow: -1px 0 0 0;
}
</style>
