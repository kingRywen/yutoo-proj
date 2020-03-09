<template>
  <!-- 跟卖监控查看 -->
  <div class='salesMonitoringSee __wrapper_i'>
    <!-- 添加产品 -->
    <el-dialog :close-on-click-modal="false" title="修改价格" :visible.sync="form.showDialog" style="padding-right:100px;" width="400px">
      <div class="box __box_wrapper">
        <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%;">
          <!-- todoh -->

          <el-form-item label="标准价" prop="priceStandard" :rules="rules.priceStandard" label-width="80px" style="width:100%;">
            <span class="placeholder_color" style="position:absolute;z-index:100;left:5px;">$</span>
            <el-input type="text" v-model="form.priceStandard" placeholder="标准价" />
          </el-form-item>

          <el-form-item label="最低价" prop="priceMin" :rules="rules.priceMin" label-width="80px" style="width:100%;">
            <span class="placeholder_color" style="position:absolute;z-index:100;left:5px;">$</span>
            <el-input type="text" v-model="form.priceMin" placeholder="最低价" />
          </el-form-item>

          <el-form-item style="width:100%;text-align:center">
            <el-button :loading="form.btnLoading" type="primary" style="width:38%;margin-left:25px !important;" @click="editPrice('ruleForm')">确 定</el-button>
            <el-button type="primary" style="width:38%;margin-left:20px !important;" @click="form.showDialog=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <div style="padding:0px 2px 8px;" class="font_14px" v-model="skutitle">
      <span class="title_icon"></span>
      <span class="color_666">任务名称:</span>
      <span class="titleBox">{{taskName}}</span>
    </div>
    <!-- 布局 -->
    <el-row type='flex' class="margin_bottom8">
      <!-- 输入框 关键词输入 -->
      <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
        <el-input placeholder="请输入子ASIN" v-model.trim="searchListData.sku" clearable style='max-width:150px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="searchSonSku">搜索</el-button> -->
        <el-button type="success" icon="el-icon-search" @click="searchSonSku">搜索</el-button>
        <!-- 搜索按钮 -->
        <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="reSearchSonSku" style="margin-left:5px !important">清空</el-button>
      </el-col>
    </el-row>
    <el-row type='flex' class="margin_bottom8">
      <!-- 输入框 关键词输入 -->
      <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
        <!-- 删除 -->
        <el-button type="success" plain @click="deleteMonitorList">删除</el-button>
        <el-button type="success" plain @click="stopMonitorList" style="margin-left:5px !important">暂停调价</el-button>
        <el-button type="success" plain @click="openPriceCtrl" style="margin-left:5px !important">开启调价</el-button>
      </el-col>
      <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
        <!-- todoh -->
        <el-date-picker unlink-panels :picker-options="pickerOptions" :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="true" @change="newTime">
        </el-date-picker>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <!-- <div style="padding:20px 10px;">ASIN:BKDEGGTCEDG</div> -->
    <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="saveSalesMonitoringSeeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortable">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="sku" label="ASIN" align='center'>
      </el-table-column>
      <!-- 图片等比缩放 -->
      <!-- <el-table-column prop="imageUrl" label="主图" align='center' width="150px">
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover">
            <img :src="scope.row.imageUrl" />
            <div class="__img_wrapper" slot="reference">
              <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column prop="sellerSku" label="店铺sku" align='center'>
        <template slot-scope="scope">
          <span>{{scope.row.sellerSku?scope.row.sellerSku:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priceStandard" label="标准价格" align='center' sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.priceStandard?"$"+scope.row.priceStandard:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priceMin" label="最低价格" align='center' sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.priceMin?"$"+scope.row.priceMin:"-"}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="priceCurrent" label="当前价格" align='center' sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.priceCurrent&&scope.row.status!==2?"$"+scope.row.priceCurrent:"-"}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="sellerCountDay" label="卖家数" align='center' sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.sellerCountDay&&scope.row.status!==2?scope.row.sellerCountDay:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cartFlag" label="购物车" align='center'>
        <template slot-scope="scope">
          <span>{{scope.row.cartFlag!==null&&scope.row.cartFlag===0?"无":scope.row.cartFlag===1?"有":'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updatePriceFlag" label="调价状态" align='center'>
        <template slot-scope="scope">
          <span>{{scope.row.updatePriceFlag===1?"开启":scope.row.updatePriceFlag===0?"关闭":'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align='center' min-width="165px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===2?true:false" type="primary" :disabled="true">已下架</el-button>
          <el-button v-if="scope.row.sellerCountDay>1&&scope.row.status!==2?true:false" @click="handleClick(scope.row)" type="primary">查看</el-button>
          <el-button v-if="!scope.row.sellerCountDay||scope.row.sellerCountDay<=1?true:false" :disabled="true" type="primary">无跟卖</el-button>
          <el-button @click="handlePrice(scope.row)" type="primary">编辑价格</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { isDisabled, Trim, getDay } from "@/api/functions";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    // 波动价格 正数（正整数，正小数）
    var validatePriceRange = (rule, value, callback) => {
      value = Trim(value, "g");
      value = +value;
      if (
        /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/.test(value) ===
        false
      ) {
        callback(new Error("只能输入正数"));
      } else if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) === false) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      sort: null,
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
      userSelect: [],
      // 编辑价格
      form: {
        showDialog: false,
        priceStandard: "",
        priceMin: "",
        btnLoading: false
      },
      rules: {
        // 标准价格
        priceStandard: [
          {
            required: true,
            message: "请输入标准价",
            trigger: ["change", "blur"]
          },
          { validator: validatePriceRange, trigger: ["blur", "change"] } //限制正数
        ],
        // 最低价格
        priceMin: [
          {
            required: true,
            message: "请输入价格",
            trigger: ["change", "blur"]
          },
          { validator: validatePriceRange, trigger: ["blur", "change"] } //限制正数
        ]
      },
      isDisabled: true,
      hrefData: null,
      loading: true,
      saveSalesMonitoringSeeList: [],
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      tabPosition: 30,
      searchListData: {
        sku: ""
      },
      taskName: this.$route.query.taskName,
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
      "/admin/monitoringCenter/preventSalesMonitoring"
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
    //删除列表
    deleteMonitorList() {
      if (this.userSelect.length) {
        this.$confirm("此操作将删除选中项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let deleteArr = [];
          if (this.userSelect.length) {
            this.userSelect.forEach(item => {
              deleteArr.push(item.taskId);
              let params = {
                taskIds: deleteArr
              };
              this.$axios
                .post("/taskNoSellingDetail/remove", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.pageNumber = 1;
                    this.getchildSkuList();
                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            });
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
    //暂停列表
    stopMonitorList() {
      if (this.userSelect.length) {
        this.$confirm("此操作将暂停选中项的修改价格功能, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let deleteArr = [];
          if (this.userSelect.length) {
            this.userSelect.forEach(item => {
              deleteArr.push(item.detailId);
              let params = {
                ids: deleteArr,
                updatePriceFlag: 0
              };
              this.$axios
                .post("/taskNoSellingDetail/updatePriceFlag", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.getchildSkuList();
                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            });
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
    // 开启价格
    openPriceCtrl() {
      if (this.userSelect.length) {
        this.$confirm("此操作将开启选中项的修改价格功能, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let deleteArr = [];
          if (this.userSelect.length) {
            this.userSelect.forEach(item => {
              deleteArr.push(item.detailId);
              let params = {
                ids: deleteArr,
                updatePriceFlag: 1
              };
              this.$axios
                .post("/taskNoSellingDetail/updatePriceFlag", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.getchildSkuList();
                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            });
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
    //编辑价格
    handlePrice(row) {
      this.form.priceStandard = "";
      this.form.priceMin = "";
      this.form.detailId = row.detailId;
      this.form.showDialog = true;
      console.log(row);
    },
    // 编辑价格todon
    editPrice(formName, point) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            detailId: this.form.detailId,
            priceStandard: this.form.priceStandard,
            priceMin: this.form.priceMin
          };
          params = this.$.dealObjectValue(params);
          this.form.btnLoading = true;
          _this.$axios
            .post("/taskNoSellingDetail/updatePrice", params)
            .then(res => {
              this.form.btnLoading = false;
              if (res.data.code == 0) {
                // 扣点弹窗
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.form.showDialog = false;
                this.$refs[formName].resetFields(); //清除数据记录
              } else if (res.data.code == 500) {
                this.$message.error(res.data.msg);
              }
            });
        }
      });
    },
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
        (this.sort = null), this.getchildSkuList(); //请求列表
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
      this.$axios.post("/taskNoSellingDetail/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          this.loading = false;
        }
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
        path: "/admin/monitoringCenter/preventSalesMonitoring/preventSaleList",
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
      this.searchListData = { sku: "" };
      // this.getchildSkuList();
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
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
