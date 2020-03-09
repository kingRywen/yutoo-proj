<!-- 类目查询页面 -->
<template>
  <div class='keywordIndexContainer __wrapper_i'>
    <!-- 添加任务 -->
    <section class="parentPosition">
      <el-row>
        <el-button type="success" @click="onCategoryTask">添加任务</el-button>
        <el-dialog :close-on-click-modal="false" title="添加任务" :visible.sync="onCategoryTaskDiakig" width="600px">
          <div slot="title">
            <span class="el-dialog__title">添加任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <div class="box __box_wrapper">

            <el-form :rules="rules" :model="siteForm" ref="ruleForm" style="width:100%;" label-position="right">
              <!-- <el-form-item label="选择站点: " prop="siteNames" :label-width="formLabelWidth" style="width:100%;">
                <el-select :popper-append-to-body="false"v-model="siteForm.siteNames" style="width:100%;">
                  <el-option v-for="(item,index) in siteData" :label="item.siteName" :value="item.siteId">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="类目:" :label-width="formLabelWidth" prop="category" style="width:100%;">
                <div class="block" style="width:100%;">
                  <!-- todoh -->
                  <el-cascader class="cate__" placeholder="可以输入或者点击选择" @active-item-change="handleItemChange" @change="model_change" style="width:100%;" v-model="siteForm.category" :options="skuListw" :props="props" @focus="getCategor"></el-cascader>
                </div>
              </el-form-item>
              <el-form-item label="页 数: " prop="pageList" :label-width="formLabelWidth" style="width:100%;">
                <el-select :popper-append-to-body="false" v-model="siteForm.pageList" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="showPoint('ruleForm')">确 定</el-button>
              </el-form-item>
            </el-form>

          </div>

        </el-dialog>
        <el-button type="success" plain @click="deleteList">删除</el-button>
      </el-row>
      <!-- 布局 -->
      <el-row style="margin-top:8px;margin-bottom: 8px;height:30px" type="flex" justify="space-between">
        <!-- 输入框 -->
        <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
          <el-input placeholder="请输入类目名称" v-model.trim="searchListData.category" clearable style='max-width:150px;'>
          </el-input>

          <!-- 选择状态 -->
          <el-select :popper-append-to-body="false" v-model="searchListData.status" placeholder="选择状态" style='max-width:120px' clearable>
            <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- 搜索按钮 -->
          <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="searchData">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" @click="searchData">搜索</el-button>
        </el-col>
        <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
          <el-date-picker unlink-panels :label-width="formLabelWidth" value-format="yyyy-MM-dd" clearable @change="newTime" class="el-date-wrapper" style="width:53%;max-width:240px" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-radio-group v-model="tabPosition" @change="currentTimeList" class="timeStyleBox">
            <el-radio-button label="1">今日</el-radio-button>
            <el-radio-button label="7">7天</el-radio-button>
            <el-radio-button label="30">30天</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table v-loading="loading" :max-height="12000" stripe ref="multipleTable" :data="geQueryLists" tooltip-effect="dark" class="tableBox" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="category" label="类目" align='center'>
          <template slot-scope="scope">

            <div class="fix__row_2" v-if="scope.row.category === '' || scope.row.category == null">{{scope.row.category | _formatData}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.category">
              <div class="fix__row_2">
                <!-- 9-22 -->
                {{scope.row.category | _formatData_cate}}
              </div>
            </el-tooltip>

          </template>
        </el-table-column>

        <el-table-column prop="siteName" label="站点" align='center'>
        </el-table-column>
        <el-table-column prop="status" label="状态" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.status==='0'">处理中</span>
            <span v-if="scope.row.status=='1'">处理中</span>
            <span v-if="scope.row.status=='2'">处理成功</span>
            <span v-if="scope.row.status>=3">处理失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="resultTime" label="结果生成时间" align='center'>
        </el-table-column>
        <el-table-column prop="handle" label="操作" align='center'>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row.taskId,scope.row.category)" type="primary" v-if="scope.row.status=='2'">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style='margin-top:20px;'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-point :data="pointData"></el-point>
    </section>
  </div>
</template>

<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'

import { mapActions, mapState, mapMutations } from "vuex";
import { isDisabled, getItemFromArr, getDay } from "@/api/functions";
export default {
  // components: {
  //   vieCheck
  // },
  data() {
    var category_validate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择类目"));
      } else {
        this.$nextTick(() => {
          if (this.siteForm.haveChildren !== 0) {
            callback(new Error("请选择最后一级类目"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      isDisabled: true,
      searchListData: {},
      loading: false,
      surplusAmount: null, //剩余点数
      charge: null, //点数
      monitorTimeAry: [],
      userSelect: [],
      geQueryLists: [], //接收请求列表数据
      pageNumber: 1,
      pageSize: 10,
      total: null,
      tabPosition: "", //默认 选择今日

      searchLists: {
        category: "",
        status: ""
      },
      onCategoryTaskDiakig: false, //添加任务弹窗
      // 添加任务弹窗数据
      queryForm: {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],

        siteValue: null, // 站点
        pageValue: null, //页数
        keywords: "" //关键词
      },
      // 校验
      rules: {
        siteNames: [{ required: true, message: "请选择站点", trigger: "blur" }],
        category: [
          {
            required: true,
            validator: category_validate,
            trigger: "blur"
          }
        ],
        pageList: [{ required: true, message: "请选择页数", trigger: "blur" }]
      },
      formLabelWidth: "90px", //公用宽度
      siteData: [], // 定义站点接收赋值
      //选择的页数
      pageOptions: [
        {
          value: 1,
          label: 1
        },
        {
          value: 2,
          label: 2
        },
        {
          value: 3,
          label: 3
        },
        {
          value: 4,
          label: 4
        },
        {
          value: 5,
          label: 5
        },
        {
          value: 6,
          label: 6
        },
        {
          value: 7,
          label: 7
        },
        {
          value: 8,
          label: 8
        },
        {
          value: 9,
          label: 9
        },
        {
          value: 10,
          label: 10
        }
      ],

      skuListw: [], //定义添加任务的类目类别

      // 类目选择todod
      props: {
        value: "name",
        children: "childs",
        label: "name"
        //  value: "categoryName",
      },
      deleteData: [], //定义删除的列表
      // 定义添加任务的数据
      siteForm: {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        categoryId: null,
        haveChildren: null,
        siteNames: null, //站点
        category: null, //类目
        pageList: null //页数
      },
      // 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

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
        // {
        //   value: "0",
        //   label: "待处理"
        // },
        {
          value: "1",
          label: "处理中"
        },
        {
          value: "2",
          label: "处理成功"
        },
        {
          value: "3",
          label: "处理失败"
        }
      ],

      // 表格数据

      // 放删除选中的数组
      multipleSelection: []
      // 分页
    };
  },
  created() {
    // this.monitorTimeAry.push(this.getBeforeTime(30), this.getBeforeTime(0));
    this.getCategoryApi(); //请求类目查询列表
    this.getCategorList(); //请求站点
    this.getCategor(); //添加类目
    this.getPointeApi(); //请求扣点
  },
  mounted() {},
  computed: {
    // charge() {
    //   return this.$store.state.point.getPointeData.charge;
    // },
    // surplusAmount() {
    //   return this.$store.state.point.getPointeData.surplusAmount;
    // },
    // ...mapState("selectionTool", {
    //   getCategory: state => state.getCategorys
    // })
    // })
  },
  watch: {
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.isDisabled = isDisabled(newV);
        //要干的事情
        if (this.isDisabled === true) {
          this.pageSize = 10;
          this.pageNumber = 1;
          this.getCategoryApi();
        }
      },
      deep: true
    }
    // platformId(val) {
    //   this.getCategoryApi({ platformId: val });
    // }
  },
  methods: {
    // 请求扣点  类目查询扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/categoryQuery/list").then(res => {
        this.surplusAmount = res.data.data.surplusAmount;
        this.charge = res.data.data.charge;
      });
    },
    // 请求列表
    getCategoryApi(param = {}) {
      // debugger;
      this.loading = true;
      const { pageSize, pageNumber } = this;
      let startTime = this.monitorTimeAry ? this.monitorTimeAry[0] : "";
      let endTime = this.monitorTimeAry ? this.monitorTimeAry[1] : "";
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
      if (params.category) {
        params.category = params.category.replace(/>/g, ":");
      }
      this.$axios.post("/TaskCategoryQuery/list", params).then(res => {
        this.searchLoading = false;
        this.loading = false;
        const { pageNo, pageSize, total, rows } = res.data;
        if (res.data.code === 500) {
          this.$.showError(res);
          return;
        }
        if (rows && rows.length >= 0) {
          this.pageSize = pageSize;
          this.pageNumber = pageNo;
          this.total = total;
          this.geQueryLists = rows;
          // rows.forEach(item => {
          //   item.category = item.category.replace(/:/g, ">");
          // });
        } else if (!rows) {
          this.geQueryLists = rows;
          this.total = 0;
        }
      });
    },

    // 分页 改变条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCategoryApi();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNumber = val;
      this.getCategoryApi();
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
    // 根据日期选择列表数据
    currentTimeList() {
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      let _end = null;
      let _start = null;
      switch (params.createTime) {
        case 7:
          _start = getDay(7).computedDay;
          _end = getDay().today;
          break;
        case 30:
          _start = getDay(30).computedDay;
          _end = getDay().today;
          break;
        default:
          _start = getDay().today;
          _end = getDay().today;
      }
      this.monitorTimeAry = [_start, _end];
      this.$forceUpdate();
      this.getCategoryApi({
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      });
    },
    //自由选择时间 刷新列表
    newTime(val) {
      const { $ } = this;
      if (!val) {
        this.tabPosition = null;
        return this.getCategoryApi();
      }

      const [start, end] = val;

      // console.log($.formatTime(end + 7 * 24 * 3600 * 1000, "{y}/{m}/{d}"));

      if (
        $.formatTime(start, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 1;
      } else if (
        $.formatTime(
          new Date(start).valueOf() + 7 * 24 * 3600 * 1000,
          "{y}/{m}/{d}"
        ) === $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 7;
      } else if (
        $.formatTime(
          new Date(start).valueOf() + 30 * 24 * 3600 * 1000,
          "{y}/{m}/{d}"
        ) === $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 30;
      } else {
        this.tabPosition = null;
      }

      return this.getCategoryApi();
    },

    // 类目排名添加  类目获取
    getCategor(id = 0) {
      if (this.skuListw.length) {
        return;
      }

      let cateList = this.$.getStorage("cateList");

      if (Object.keys(cateList).indexOf(id) > -1) {
        return;
      }

      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        parentPcid: id
      };
      this.$axios.post("/TaskCategoryRank/getCategory", params).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.forEach(el => {
            if (el.haveChildren == 1) {
              this.$set(el, "childs", []);
            }
          });
          this.skuListw = data;
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    // todon
    getCategorById(id = 0) {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        parentPcid: id
      };
      return this.$axios.post("/TaskCategoryRank/getCategory", params);
    },
    // todonow
    model_change(val) {
      // console.log(val);
      // let categoryId = this.findItem(
      //   this.skuListw,
      //   val[val.length - 1],
      //   parent
      // );
      this.handleItemChange(val, true);
    },
    handleItemChange(val, notSend_getCategorById) {
      // console.log(
      //   document.getElementsByClassName("el-cascader-menus"),
      //   "类目div"
      // );
      // todon
      // console.log(val);
      const valStr = val.join(":");
      const parent = val.slice(0, val.length - 1).join(":");
      // 获取子类目
      let cateList = this.$.getStorage("cateList");
      // console.log(cateList);
      this.siteForm.category = val;
      // 从this.skuListw中找到当前选中项
      // let Arr = getItemFromArr(this.skuListw, function(item) {
      //   return item.name === val[val.length - 1];
      // });
      // console.log(Arr);
      let categoryId = this.findItem(
        this.skuListw,
        val[val.length - 1],
        parent
      );
      //change进来的不要发请求
      if (notSend_getCategorById === true) {
        return;
      }
      if (Object.keys(cateList).indexOf(valStr) > -1) {
        this.setSub(this.selEl, cateList[valStr], val);
        this.handCate();
        return;
      }
      this.getCategorById(this.selEl.pcid).then(res => {
        if (res.data.code == null) {
          return;
        }

        if (res && res.data && res.data.code === 500) {
          this.$message.error(res.data.msg);
          return;
        }
        let data = res.data.data;
        this.setSub(this.selEl, data, val);
        this.handCate();
      });
    },
    setSub(selEl, data, val) {
      const valStr = val.join(":");
      // get
      let cateList = this.$.getStorage("cateList");
      data.forEach(el => {
        if (el.haveChildren == 1) {
          this.$set(el, "childs", []);
        }
      });
      cateList[valStr] = data;
      this.$.setStorage("cateList", JSON.stringify(cateList));

      this.$set(this.selEl, "childs", data);
    },

    findItem(arr, name, pName) {
      if (pName) {
        arr.forEach(el => {
          if (el.name === name && pName === el.parentName) {
            this.selEl = el;
            this.siteForm.categoryId = el.pcid;
            this.siteForm.haveChildren = el.haveChildren;
            // console.log(el);
            // this.parentSelEl = arr;
            return false;
          } else {
            if (el.childs && el.childs.length > 0) {
              this.findItem(el.childs, name, pName);
            }
          }
        });
      } else {
        arr.forEach(el => {
          if (el.name === name) {
            this.selEl = el;
            this.siteForm.categoryId = el.pcid;
            this.siteForm.haveChildren = el.haveChildren;
            // console.log(el);
            // this.parentSelEl = arr;
            return false;
          } else {
            if (el.childs && el.childs.length > 0) {
              this.findItem(el.childs, name);
            }
          }
        });
      }
      // console.log(this.siteForm, "此时的siteForm");
      this.$refs.ruleForm.validateField("category");
    },

    // 点击添加弹窗
    onCategoryTask() {
      this.onCategoryTaskDiakig = true;
      // 清空数据
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务
    addTaskSubmit(formName, point) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let a = this.siteForm.category;
          let b = a.join(":");
          let params = {
            type: point,
            merchantId: 4,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0],
            siteId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[1],
            category: b,
            searchPages: this.siteForm.pageList,
            categoryId: this.siteForm.categoryId
          };
          // 扣点按钮loading
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          this.$axios.post("/TaskCategoryQuery/save", params).then(res => {
            // 扣点弹窗
            if (point === 0) {
              if (res.data.code == 0) {
                this.pointData.show = true;
                this.pointData.point = res.data.data + "点";
                this.pointData.formName = formName;
              } else if (res.data.code === 500) {
                this.$message.error(res.data.msg);
              }
              return;
            }
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$nextTick(() => {
                this.pointData.show = false; // 关闭扣点弹窗
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              this.reloadPointApi(); // 重新获取点数
              this.$refs[formName].resetFields(); //清除数据记录
              this.onCategoryTaskDiakig = false; //关闭弹窗
              this.searchListData = {};
              this.getCategoryApi({
                pageSize: 10,
                pageNumber: 1
              }); //请求类目查询列表
              return;
            }
            if (res.data.code == 500) {
              this.$nextTick(() => {
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    //  删除列表
    deleteList() {
      if (this.userSelect.length) {
        // let a = this.deleteData;
        // let s = new Set(a);
        // let result = Array.from(s);
        let arr = [];
        this.userSelect.forEach(item => {
          arr.push(item.taskId);
        });
        this.$confirm("确定删除数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .post("/TaskCategoryQuery/remove", { taskIds: arr })
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.searchListData = {};
                  this.getCategoryApi({
                    pageNumber: 1
                  }); //请求类目查询列表
                  this.deleteData = [];
                }
                if (res.data.code == 500) {
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
      } else {
        this.$message({
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },

    // {{scope.row.category.replace(":",">>")}}
    // 搜索
    searchData() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.searchLoading = true;
      this.getCategoryApi();
    },
    // 记录搜索值
    recordSearch(category, status) {
      let a = this.searchLists.category;
      let b = a.replace(/[>]{1}/gi, ","); //将>>转译成 ,  间隔

      let c = Number(this.searchLists.status);
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: 1,
        pageSize: 10
        // category: b,
        // status: this.searchLists.status
      };

      (this.searchLists.category = this.searchLists.category.replace(
        ">>",
        ":"
      )),
        (params = { ...params, ...this.searchLists });

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key];
          if (element === "" || element == null) delete params[key];
        }
      }

      this.$axios.post("/TaskCategoryQuery/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.currentPage = res.data.pageNo;
        this.pageSize = res.data.pageSize;
        this.total = res.data.total;
        this.geQueryLists = res.data.rows;
      });
    },

    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.deleteData.push(item.taskId);
      });
    },

    //获取站点
    // 获取站点方法
    getCategorList() {
      // console.log(this.getAnalysisList, "888");
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.$axios.post("/TaskSiteShare/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.siteData = res.data;
      });
    },
    // table的查看
    handleClick(taskId, category) {
      this.$router.push({
        path: "/admin/SelectionTool/CatalogQuery/CatalogQuerySee",
        query: {
          taskId,
          category
        }
      });
    }
  }
};
</script>

<style scoped>
.box {
  position: relative;
}

.footerStyle {
  padding: 0 140px 20px 122px;
  margin-top: 20px;
}
.tableBox {
  width: 100%;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
</style>
