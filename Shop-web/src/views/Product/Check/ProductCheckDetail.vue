<!--  -->
<template>
  <div class="___common">
    <!-- <template>
      <div class="title_h1 margin_bottom8">
        <span class="title_icon"></span>
        <span class="color_666">ASIN :</span>
        <span class="titleBox">{{this.$route.query.asin}}</span>
      </div>
    </template> -->
    <el-tabs type="card" v-model="table.type" @tab-click="handleClick">
      <el-tab-pane label="有效词" name="1">
        <template>
          <el-search-detail :backFun='true' ref="searchDetail"></el-search-detail>
        </template>
        <template>
          <section class="__relative">
            <template>
              <el-handler :userSelect="userSelect" :hander="hander" :addShow.sync="options.visible"></el-handler>
            </template>
            <template>
              <!-- {{table.show.tableSelect}}  -->
              <!-- {{ table.show.tableSelect[2].selected.indexOf('a')!==-1?true:false}} -->
              <el-table-select :tableSelect="table.show.tableSelect" class="__right"></el-table-select>
            </template>
          </section>
        </template>
        <template>
          <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
        </template>
      </el-tab-pane>
      <el-tab-pane label="无效词" name="0">
        <template>
          <el-search-detail  ref="searchDetail"></el-search-detail>
        </template>
        <template>
          <section class="__relative">
            <template>
              <el-handler :userSelect="userSelect" :hander="hander" :addShow.sync="options.visible"></el-handler>
            </template>
            <template>
              <!-- {{table.show.tableSelect}}  -->
              <!-- {{ table.show.tableSelect[2].selected.indexOf('a')!==-1?true:false}} -->
              <el-table-select :tableSelect="table.show.tableSelect" class="__right"></el-table-select>
            </template>
          </section>
        </template>
        <template>
          <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加产品 -->
    <el-dialog-yt :options="options" :events="events">
      <div class="box __box_wrapper">
        <el-form :model="form" :rules="rules" ref="ruleForm" style="width:94%;">
          <el-form-item label="关键词 : " prop="keywords" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="textarea" v-model="form.keywords" style="width:100%;" :rows="4" placeholder="多个关键词用换行或逗号分隔（1-20个）" />
            <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
          </el-form-item>
          <!-- {{form.type}} -->
          <el-form-item :label-width="formLabelWidth" prop="type" style="width:100%" label="选择类型 : ">
            <el-checkbox-group v-model="form.type">
              <el-checkbox v-for="item in form.typeArr" :label="item.value">{{item.typeName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="任务名称 : " prop="taskName" :label-width="formLabelWidth" style="width:100%;margin-bottom:6px">
            <el-input v-model.trim="form.taskName" style="width:100%;" size="mini" placeholder="最多输入30个字符" maxlength="30" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" style="width:100%;margin-bottom:0">
            <el-checkbox v-model="form.monitorFlag">是否添加监控</el-checkbox>
          </el-form-item>
          <el-form-item prop="monitorTimeAry" label="监控时间 : " :label-width="formLabelWidth" style="width:100%;" v-if='form.monitorFlag'>
            <el-date-picker unlink-panels :picker-options="cfuns._pickerFuture" :label-width="formLabelWidth" class="el-date-wrapper" style="width:100%" v-model="form.monitorTimeAry" type="daterange" align="left" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" size="mini">
            </el-date-picker>
          </el-form-item>
          <!-- 监控频率 -->
          <el-form-item v-if='form.monitorFlag' label="监控频率 : " prop="frequency" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="text" v-model="form.frequency" style="width:93%;" placeholder="请输入10-1440之间的整数" size="mini" />
            <span class="font12">&nbsp;分钟</span>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog-yt>
  </div>
</template>

<script>
export default {
  components: {},
  provide() {
    return {
      getList: this.getList,
      addTask: this.addTask,
      resetFields_add: this.resetFields_add,
      beforeAdd: this.beforeAdd
    };
  },
  data() {
    // 自定义校验关键词
    var validateKeyword = (rule, value, callback) => {
      if (!value) {
        this.keywordsArr = [];
        callback(new Error("输入不能为空"));
        return;
      }
      let val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      this.keywordsArr = val;
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      let keyworldLength = null;
      // if (regEn.test(value) || regCn.test(value)) {
      //   callback(new Error("不能包含特殊字符"));
      // } else
      if (val.length > 20) {
        callback(new Error("输入数量不能超过20个"));
      } else {
        callback();
      }
    };
    // 添加产品自定义监控频率
    var validateFrequency = (rule, value, callback) => {
      value = this.cfuns.Trim(value, "g");
      value = +value;
      if (/^[0-9]*$/.test(value) === false) {
        callback(new Error("请输入整数"));
      } else if (value < 10 || value > 1440) {
        callback(new Error("请输入10-1440之间的整数"));
      } else {
        callback();
      }
    };
    return {
      // 搜索
      search: {
        asin: true
      },
      clearSearch: null,
      // 控件
      hander: {
        addTask2: true,
        addButton: "加入排名"
        // deleteAuthCate: true
      },
      // 添加任务，编辑任务
      formLabelWidth: "100px", //label宽度
      options: {
        loading: false,
        visible: false,
        width: "620px",
        title: "添加产品",
        okBtnText: "确 认"
      },
      events: {
        handleOkClick: this.addTask
      },
      form: {
        // 搜索
        search: {
          asin: true
        },
        cateWidth: "100%",
        // 添加的数据
        typeArr: [
          {
            value: 0,
            typeName: "自然搜索"
          },
          {
            value: 1,
            typeName: "广告搜索"
          }
        ],
        type: [],
        frequency: "",
        keywords: null,
        skus: null,
        monitorFlag: false,
        monitorFrom: null,
        monitorTo: null,
        monitorTimeAry: [],
        taskName: ""
        // 添加的数据 end
      },
      fontSum: 0,
      keywordsArr: [],
      rules: {
        keywords: [
          {
            required: true,
            validator: validateKeyword,
            trigger: ["blur", "change"]
          }
        ],
        type: [
          {
            required: true,
            message: "请选择搜索类型",
            trigger: ["blur", "change"]
          }
        ],
        monitorTimeAry: [
          {
            required: true,
            message: "请选择监控起始时间",
            trigger: ["blur"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-1440）",
            trigger: ["blur", '"change"']
          },
          { validator: validateFrequency, trigger: ["blur"] }
        ],
        taskName: [
          {
            required: false,
            max: 30,
            message: "任务名称(30个字符以内)",
            trigger: ["blur", "change"]
          }
        ]
      },
      // 表格
      table: {
        type: "1",
        URL: "ProductKeywordVerifyListToVerifyDetail", //列表的table,要是添加页面的table,默认table
        loading: false,
        // rowKey: "keyword",
        rows: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        count: 0,
        show: {
          keyword2: true,
          tableSelect: [
            {
              indeterminate: false,
              checkAll: true,
              name: "ARA数据",
              selected: ["a", "b", "c", "d", "e", "f"],
              allSelected: ["a", "b", "c", "d", "e", "f"],
              childList: [
                {
                  name: "搜索量",
                  label: "a"
                },
                {
                  name: "订单量",
                  label: "b"
                },
                {
                  name: "点击量",
                  label: "c"
                },
                {
                  name: "加购量",
                  label: "d"
                },
                {
                  name: "转化率",
                  label: "e"
                },
                {
                  name: "点击率",
                  label: "f"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "广告数据",
              selected: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
              allSelected: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
              childList: [
                {
                  name: "曝光量",
                  label: "a"
                },
                {
                  name: "订单量",
                  label: "b"
                },

                {
                  name: "点击量",
                  label: "c"
                },
                {
                  name: "转化率",
                  label: "d"
                },
                {
                  name: "点击率",
                  label: "e"
                },
                {
                  name: "CPC",
                  label: "f"
                },
                {
                  name: "花费",
                  label: "g"
                },
                {
                  name: "销售总额",
                  label: "h"
                },
                {
                  name: "ACOS",
                  label: "i"
                }
              ]
            },
            {
              indeterminate: false,
              checkAll: true,
              name: "其他",
              selected: ["a", "b"],
              allSelected: ["a", "b"],
              childList: [
                {
                  name: "Google搜索量",
                  label: "a"
                },
                {
                  name: "产品数",
                  label: "b"
                }
              ]
            }
          ]
          // googleSearches: true, //"  GOOGLE搜索量"
          // amazonProducts: true, // 亚马逊商品数
          // ARA: {
          //   araSearches: true, //"  ARA搜索量",
          //   araHits: true, //"  ARA点击量",
          //   araOrders: true, //"  ARA订单量",
          //   araCarts: true, //"  ARA加购量",
          //   araClickRates: true, //"  ARA点击率",
          //   araConversionRates: true //"  ARA转化率"
          // },
          // ADV: {
          //   advertExposure: true, // "  广告曝光量",
          //   advertHits: true, //"  广告点击量",
          //   advertOrders: true, // "   广告订单量",
          //   advertClickRates: true, // "  广告点击率",
          //   advertConversionRates: true, //"  广告转化率",
          //   advertCpc: true, //"  广告CPC",
          //   advertAcos: true, //"  广告ACOS",
          //   advertCost: true, //"  广告花费",
          //   advertSales: true //"  广告销售总额"
          // }
        }
      },
      userSelect: []
    };
  },
  created() {
    // console.log(this.$route.query.verifyId);
    // console.log(this.$route.query.asin);
    if (this.sellerId && this.siteId) {
      this.getList();
      // this.table.rows = [
      //   {
      //     keyword: "  关键词",
      //     araSearches: "  ARA搜索量",
      //     araHits: "  ARA点击量",
      //     araOrders: "  ARA订单量",
      //     araCarts: "  ARA加购量",
      //     araClickRates: "  ARA点击率",
      //     araConversionRates: "  ARA转化率",
      //     advertExposure: "  广告曝光量",
      //     advertHits: "  广告点击量",
      //     advertOrders: "   广告订单量",
      //     advertClickRates: "  广告点击率",
      //     advertConversionRates: "  广告转化率",
      //     advertCpc: "  广告CPC",
      //     advertAcos: "  广告ACOS",
      //     advertCost: "  广告花费",
      //     advertSales: "  广告销售总额",
      //     amazonProducts: "   亚马逊商品数",
      //     googleSearches: "  GOOGLE搜索量"
      //   }
      // ];
    }
  },
  mounted() {},
  methods: {
    // 切换tabs
    handleClick() {
      this.getList({
        pageSize: 10,
        pageNumber: 1
      });
    },
    // 列表
    getList(arg) {
      if (
        this.$route.query.verifyId === undefined ||
        !this.$route.query.asin === undefined
      ) {
        this.$router.push("/dash");
      }
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        siteId: this.siteId, //上线要改
        sellerId: this.sellerId, //上线要改
        type: +this.table.type,
        verifyId: +this.$route.query.verifyId,
		keywordFlag : this.keywordFlag,
        ...arg
      };
      // 如果与日期，要分开赋值
      if (params.keywordSrc) {
        params.keywords = params.keywordSrc;
        delete params.keywordSrc;
      }
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api[this.table.URL](params)
        .then(data => {
          this.table.loading = false;
          this.table.rows = data.rows;
          this.table.pageNumber = data.pageNo;
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          return true;
        })
        .catch(err => {
          this.table.loading = false;
          console.log(err);
          return true;
        });
    },
    // 自定义展示表格默认全选

    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
    },
    // 分页
    handleSizeChange(pageSize) {
      let arg = { pageSize: pageSize };
      this.getList(arg);
    },
    handleCurrentChange(pageNumber) {
      let arg = { pageNumber: pageNumber };
      this.getList(arg);
    },
    // 添加
    addTask() {
      // this.$message.warning("接口暂未提供");
      // return;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          // 设置任务名称
          if (!this.form.taskName || this.form.taskName == "") {
            let len = [...new Set(this.keywordsArr)].length;
            // console.log(len);
            let taskName = this.keywordsArr[0] + " " + len;
            taskName = taskName.slice(-30);
            // console.log(taskName);
            this.form.taskName = taskName;
          }
          // 设置任务名称end
          let params = {
            siteId: this.siteId, //上线要改
            platformId: 1,
            sellerId: this.sellerId, //上线要改
            keywords: [...new Set(this.keywordsArr)],
            skus: [this.$route.query.asin],
            monitorFlag: this.form.monitorFlag ? 1 : 0,
            taskName: this.form.taskName,
            type: this.form.type,
            frequency: this.form.frequency !== "" ? +this.form.frequency : ""
          };
          params = this.$.dealObjectValue(params);
          if (params.monitorFlag == 0) {
            this.addFun(params);
          } else {
            let time = {
              monitorFrom: this.form.monitorTimeAry[0],
              monitorTo: this.form.monitorTimeAry[1]
            };
            this.addFun({ ...params, ...time });
          }
        }
      });
    },
    addFun(params) {
      this.options.loading = true; // 按钮loading;
      this.$api["TaskKeywordRankSaveKeywordAndAd"](params)
        .then(data => {
          this.options.loading = false;
          if (data.code == 0) {
            this.options.visible = false; // 关闭弹窗
            this.$refs["ruleForm"].resetFields(); //清除数据记录
            this.clearSearch = new Date().getTime();
            return;
          }
        })
        .catch(err => {
          this.options.loading = false;
        });
    },
    resetFields_add() {
      this.reset();
    },
    beforeAdd() {
      this.keywordsArr = [];
      let arr = this.userSelect;
      arr.forEach(el => {
        this.keywordsArr.push(el.keyword);
      });
      this.form.keywords = "";
      // this.form.keywords = this.keywordsArr.split(",");
      // console.log(arr, "arr");
      console.log(this.keywordsArr);
      this.keywordsArr.forEach(el => {
        this.form.keywords += el + ",";
      });
      this.form.keywords = this.form.keywords.slice(0, -1);
    },
    reset() {
      // todo
      // this.form.userSelect__copy = [];
    }
  },
  computed: {
	  keywordFlag(){
		  return this.$parent.$parent.$parent.activeName === 'first' ? 0 : 1
	  }
  },
  watch: {
    sellerData(val) {
      // console.log(val);
      if (
        val.sellerId !== this.$route.query.sellerId ||
        val.siteId !== this.$route.query.siteId
      ) {
        // this.$router.replace("/dash");
      } else {
        this.getList();
      }
    },
    keywordsArr(val) {
      if (val.length) {
        // 自动生成任务名称
        // this.excavateForm.name = val[0] + " " + val.length;
        this.fontSum = val.length;
      } else {
        // this.excavateForm.name = null;
        this.fontSum = 0;
      }
    },
	
  }
};
</script>

<style lang='scss' scoped>
._title {
  display: flex;
  ._label {
    width: 50px;
    text-align: right;
  }
  ._content_box {
    border: 1px solid #e4e4e4;
    width: 574px;
    padding: 8px;
    line-height: 1.5em;
    min-height: 100px;
  }
}
</style>
