<template>
  <!-- 店铺授权 -->
  <div class='shopAuthorization'>
    <el-dialog title="提示" :visible.sync="dialogFormVisible" width="30%" style="padding: 0 69px 30px 102px;">
      <span>这是一段信息</span>
    </el-dialog>
    <el-row class='paddingBobbtom'>
      <!-- <el-button type="success" icon="el-icon-search" style="margin-left:20px; margin-right:30px;">添加授权</el-button> -->

      <!-- 添加任务 -->
      <el-button type="success" @click="onaddTask">添加授权</el-button>
      <div style="display:inline;">站点:</div>
      <!-- 添加授权弹窗 -->
      <el-dialog title="    添加店铺" :visible.sync="addShopTask" width="35%">
        <el-form :rules="rules" ref="ruleForm" style="width:80%;margin: 0 auto; " class="boxs">
          <el-form-item prop="keywords">
            <template>
              <div style=" " class="textLeft">国家站点 </div>
            </template>
            <!-- 获取站点 -->
            <el-select v-model="addAuthorizationData.value" style="width300px;">
              <el-option v-for="(item,index) in siteData" :key="index" :label="item.siteName" :value="item.siteId" style="width300px;">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="keywords">
            <el-input placeholder="请输入内容" v-model="shopAuthorizationForm.sellerAlias">
              <template slot="prepend">店铺名称</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="keywords">
            <el-input placeholder="请输入内容" v-model="shopAuthorizationForm.accessKey">
              <template slot="prepend">AWS秘钥ID</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="keywords">
            <el-input placeholder="请输入内容" v-model="shopAuthorizationForm.secretKey">
              <template slot="prepend">秘钥</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="keywords">
            <el-input placeholder="请输入内容" v-model="shopAuthorizationForm.sellerId">
              <template slot="prepend">卖家ID</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" style="width:100%;" @click="addAuthorizationSubmit('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 获取站点 -->
      <!-- {{this.siteData}} -->
      <div style="width:200px; display:inline-block;">
        <el-select v-model="shopAuthorization.siteId" clearable @change="newLists1()">
          <el-option v-for="(item,index) in siteData" :key="index" :label="item.siteName" :value="item.siteId">
          </el-option>
        </el-select>
      </div>
      <span>店铺名称:</span>
      <el-input placeholder="请输入店铺名称" v-model="shopAuthorization.sellerAlias" clearable style='max-width:200px;margin-right:10px;' @change="newLists2()">
      </el-input>
      <span>卖家ID:</span>
      <el-input placeholder="请输入卖家ID" v-model="shopAuthorization.sellerId" clearable style='max-width:200px;margin-right:10px;' @change="newLists3()">
      </el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-left:20px;" @click="onShopAuthorizationSearch()">搜索</el-button>

      <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="currentTimeData">
        <el-radio-button label="1">今日</el-radio-button>
        <el-radio-button label="7">7天</el-radio-button>
        <el-radio-button label="30">30天</el-radio-button>
      </el-radio-group>
    </el-row>
    <!-- 表格数据 -->
    <el-table stripe ref="multipleTable" :data="shopAuthorizationLists" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="siteName" label="站点" align='center'>
      </el-table-column>
      <el-table-column prop="sellerAlias" label="店铺名称" align='center'>
      </el-table-column>
      <el-table-column prop="sellerId" label="卖家ID" align='center'>
      </el-table-column>
      <el-table-column prop="authTime" label="授权时间" align='center'>
      </el-table-column>
      <el-table-column label="操作" align='center' style="width:350px;">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteShopLists(scope.row.sellerAuthId)">删除</el-button>
          <el-button type="text" @click="CloseMonitoring(scope.row.sellerAuthId)"> 关闭差评监控 </el-button>
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

import axios from "axios";
export default {
  data() {
    // 时间选择器
    return {
      tabPosition: 1,
      currentPage: null, //分页
      total: null, //总条数
      pageSize: null, //每页条数
      shopAuthorizationLists: [], //接收请求的数据
      //添加授权站点定义
      addAuthorizationData: {
        options: "",
        value: ""
      },
      //添加授权提交  定义表单数据
      shopAuthorizationForm: {
        platformId: this.$store.state.selectPlatform.platformId,
        siteId: "",
        sellerAlias: "",
        accessKey: "",
        secretKey: "",
        sellerId: ""
      },
      // 定义站点
      siteData: [],
      // userSelectsite: "",
      // 定义图片类目名称列表
      // props: {
      //   value: "siteId",
      //   // children: "recursionList",
      //   label: "siteName"
      // },
      StatusValue: "",
      addShopTask: false, //添加店铺授权弹窗
      rules: {
        keywords: [
          { required: true, message: "请输入关键字", trigger: "blur" }
        ],
        sku: [{ required: true, message: "请输入商品ASIN:", trigger: "blur" }]
      },
      formLabelWidth: "120px",
      nationalSite: "", //国家站点
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: "",
      value2: "",
      // checkList: ["选中且禁用", "复选框 A"],
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 关键词
      inputText: "",
      originValue: "",
      // 搜索 店铺授权
      shopAuthorization: {
        siteId: "",
        sellerAlias: "",
        sellerId: ""
      },
      addSiteDataLists: {
        siteId: "",
        sellerAlias: "",
        sellerId: ""
      },

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1,

      userSelect: [], //定义选中事件
      taskIds: [] //定义删除授权列表ID
    };
  },
  created() {
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      pageNumber: 1,
      pageSize: 10
    };
    this.getShopAuthorizationApi(this.params); //初始化请求列表
    this.getCategorList(); //请求站点
  },
  computed: {
    ...mapState("shopAuthorization", {
      // shopAuthorizationLists: state => state.shopAuthorizationLists, //n拿到的值
      siteListsData: state => state.getSiteLists //站点数据
    }),
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
  },
  watch: {
    platformId(val) {
      this.getShopAuthorizationApi({ ...this.params, platformId: val });
    }
  },
  methods: {
    newLists1() {
      this.getShopAuthorizationApi(this.param); //关键词竞争分析列表
    },
    newLists2() {
      this.getShopAuthorizationApi(this.param); //关键词竞争分析列表
    },
    newLists3() {
      this.getShopAuthorizationApi(this.param); //关键词竞争分析列表
    },
    //请求列表
    getShopAuthorizationApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/SellerAuth/list", params).then(res => {
        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.shopAuthorizationLists = res.data.rows;
      });
    },
    // 分页 改变条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getShopAuthorizationApi(params);
    },
    // 改变页数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getShopAuthorizationApi(params);
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
      return this.getShopAuthorizationApi(params);
    },

    // 获取站点方法
    getCategorList() {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.$axios.post("/TaskSiteShare/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.siteData = res.data;
      });
    },
    //  添加授权提交
    addAuthorizationSubmit() {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        siteId: this.addAuthorizationData.value,
        sellerAlias: this.shopAuthorizationForm.sellerAlias,
        accessKey: this.shopAuthorizationForm.accessKey,
        secretKey: this.shopAuthorizationForm.secretKey,
        sellerId: this.shopAuthorizationForm.sellerId
      };
      this.$axios.post("/SellerAuth/save", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.addShopTask = false;
          this.getShopAuthorizationApi();
          (this.addAuthorizationData.value = null),
            (this.shopAuthorizationForm = {
              sellerAlias: null,
              accessKey: null,
              secretKey: null,
              sellerId: null
            });
        }
      });
    },
    ...mapActions("shopAuthorization", [
      // "getShopAuthorizationApi",
      "getSiteApi"
    ]),
    ...mapMutations("shopAuthorization", {
      setWordList: "shopAuthorization", //这个地方是方法名
      setSiteList: "getSiteList" //获取站点数据方法
    }),
    //搜索   店铺授权搜索
    onShopAuthorizationSearch() {
      if (
        this.shopAuthorization.siteId ||
        this.shopAuthorization.sellerAlias ||
        this.shopAuthorization.sellerId
      ) {
        this.recordSearch(
          this.shopAuthorization.siteId,
          this.shopAuthorization.sellerAlias,
          this.shopAuthorization.sellerId
        );
      }
    },
    //记录搜索值
    recordSearch(siteId, sellerAlias, sellerId) {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        siteId,
        sellerAlias,
        sellerId
      };

      axios({
        method: "post",
        url: "http://192.168.0.98:7001/SellerAuth/list",
        //注意get的参数是params！！！！
        data: params,
        headers: {
          token: "4238dbca0804f989cae2f642cb0a37a1"
        }
      }).then(res => {
        console.log(res, "???");
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.shopAuthorizationLists = res.data.rows;

          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查询到相关的数据");
        }
        console.log(res);
        console.log(params);
      });
    },
    //删除
    deleteShopLists(id) {
      console.log(id, "666");
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            sellerAuthIds: [id]
          };
          this.$axios.post("SellerAuth/remove", params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.getShopAuthorizationApi();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //关闭差评监控
    CloseMonitoring(id) {
      console.log(id, "666");
      this.$confirm("此操作将关闭差评就阿宁该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            sellerAuthId: id
          };
          this.$axios.post("/SellerAuth/turnOffMonitor", params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.getShopAuthorizationApi();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消监控"
          });
        });
    },

    onaddTask() {
      this.addShopTask = true;
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val; //定义选中事件
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
    }
  }
};
</script>

<style scoped>
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;

  padding-left: 20px;
}
.box {
}
.textLeft {
  border-radius: 4px 0 0 4px;
  color: #909399;
  width: 93px;
  height: 38px;
  display: inline-block;
  border: 1px solid #dcdfe6;
  background: #f5f7fa;
}
.box {
  min-width: 390px;
  width: 70%;
  box-sizing: border-box;
}
.textLeft {
  text-indent: 1em;
}
.el-select > .el-input {
  display: block;
  padding-left: 100px;
}

.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
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
.interval {
  display: inline-block;
  margin-left: 50px;
}
</style>
