<!--  -->
<template>
  <div class="___common">
    <template>
      <el-search :search="search" :clearSearch.sync="clearSearch" :clearfield='clearfield'></el-search>
    </template>
    <template>
      <el-handler :userSelect="userSelect" :hander="hander" :addShow.sync="options.visible" :addMoniShow.sync="options_add.visible" :Title.sync="options_add.title" :Api.sync="options_add.api" :date.sync="form_add.date" :frequency.sync="form_add.frequency" :Type.sync="options_add.type" :pickerOptions.sync='pickerOptions'></el-handler>
    </template>
    <template>
      <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
    </template>
    <!-- 添加产品 -->
    <el-dialog-yt :options="options" :events="events">
      <div class="box __box_wrapper">
        <el-form size="small" :model="form" :rules="rules" ref="ruleForm" style="width:94%;">

          <el-form-item label="产品ASIN" prop="sku" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="input" v-model.trim="form.sku" placeholder="请输入产品ASIN" style="width:100%;" size="mini" />
          </el-form-item>

          <el-form-item label="关联ASIN" prop="relateSku" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="input" v-model.trim="form.relateSku" placeholder="请输入关联ASIN" style="width:100%;" size="mini" />
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" style="width:100%;margin-bottom:0">
            <el-checkbox v-model="form.monitorFlag">是否添加监控</el-checkbox>
          </el-form-item>
          <el-form-item prop="monitorTimeAry" label="监控时间" :label-width="formLabelWidth" style="width:100%;" v-if='form.monitorFlag'>
            <el-date-picker unlink-panels :picker-options="cfuns._pickerFuture" :label-width="formLabelWidth" class="el-date-wrapper" style="width:100%" v-model="form.monitorTimeAry" type="daterange" align="left" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" size="mini">
            </el-date-picker>
          </el-form-item>
          <!-- 监控频率 -->
          <el-form-item v-if='form.monitorFlag' label="监控频率" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="text" v-model.trim="form.frequency" style="width:80%;" placeholder="请输入10-1440之间的整数" size="mini" />
            <span class="font12">&nbsp;分钟</span>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog-yt>
    <!-- 添加修改监控 -->
    <el-dialog-yt :options="options_add" :events="events_add">
      <div class="box __box_wrapper">
        <el-form size="small" :model="form_add" :rules="rules_add" ref="ruleForm_add" style="width:94%;">
          <!-- 监控起止时间 -->
          <el-form-item label="监控时间" prop="date" :label-width="formLabelWidth" style="width:100%;">
            <div class="block" style="width:100%;">
              <el-date-picker unlink-panels style="width:100%;" :picker-options="cfuns._pickerFuture" v-model="form_add.date" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
              </el-date-picker>
            </div>
          </el-form-item>
          <!-- 监控频率 -->
          <el-form-item label="监控频率" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="text" v-model.trim="form_add.frequency" style="width:90%;" placeholder="请输入10-1440之间的整数" size="mini" />
            <span class="font12">&nbsp;分钟</span>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog-yt>
    <!-- 图表 -->
    <el-dialog :close-on-click-modal="false" :title="chartData.title" :visible.sync="pcMonitoringData" height='505px' width="70%" @close="closeDialog" :fullscreen='dialogFullscreen'>
        <span slot="title" style="font-size:18px;">
            <span >{{chartData.title}}</span>
            <i class="iconfont1 iconfangda bigIcon"  @click="dialogFullscreen=!dialogFullscreen" style='float:right;margin-right:24px;font-size:15px;cursor:pointer'></i>
        </span>
      <el-rank-chart :chartData.sync="chartData" ref="child" :createTime='createTime' :fullscreen='dialogFullscreen'  :xAxisName='"时间"' :yAxisName='"排名"'></el-rank-chart>
    </el-dialog>
  </div>
</template>

<script>
	import dayjs from 'dayjs'
export default {
  components: {},
  provide() {
    return {
      getList: this.getList,
      deleteTask: this.deleteTask,
      addTask: this.addTask,
      addMoni: this.addMoni,
      //   changeMoni: this.changeMoni,
      resetFields: this.resetFields,
      cancelMoni: this.cancelMoni,
      edit__: this.edit__,
      refresh__: this.refresh__,
      check__: this.check__
    };
  },
  data() {
    // 自定义校验关键词
    var validateKeyword = (rule, value, callback) => {
      if (value == null || value == undefined) return;
      var val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      if (!value) {
        this.keywordsArr = [];
        callback(new Error("输入不能为空"));
        return;
      }
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
    // 自定义校验SKU
    var validateSku = (rule, value, callback) => {
      if (!value) {
        callback(new Error("输入不能为空"));
        return;
      }
      if (value == null || value == undefined) return;
      let val = value;
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/;
      let changePlatformd = 1; //上线要改
      let str = "ASIN须为10位数，纯数字或大写字母和数字的组合";
      if (changePlatformd == 2) {
        reg = /^[0-9]{12,12}$/;
        str = "请输入12位纯数字";
      } else if (changePlatformd == 3) {
        reg = /^(?!_)(?!.*?_$)[0-9_]+$/;
        str = "请输入纯数字，允许下划线";
      } else if (changePlatformd == 4) {
        reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]{24}$/;
        str = "长度24位，须小写字母与纯数字的组合";
      } else if (changePlatformd == 5) {
        reg = /^[0-9]*$/;
        str = "请输入纯数字";
      }
      if (!reg.test(val)) {
        callback(new Error(str));
      } else if (regEn.test(val) || regCn.test(val)) {
        callback(new Error("不能包含特殊字符"));
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
       pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
      },
       clearfield:['sku','relateSku','monitorFlag','date'],
       dialogFullscreen:false,
      // 搜索
      search: {
        sku: true,
        relateSku: true,
        monitorFlag: true,
        date: true
      },
      clearSearch: null,
      // 控件
      hander: {
        addTask: true,
        addButton: "添加产品",
        deleteTask: true,
        addMoni: true,
        changeMoni: true,
        cancelMoni: true
      },
      // 添加任务，编辑任务
      formLabelWidth: "100px", //label宽度
      options: {
        loading: false,
        visible: false,
        width: "500px",
        title: "添加产品",
        okBtnText: "确认",
        resetFields: () => {
          this.$refs.ruleForm.resetFields();
        }
      },
      events: {
        handleOkClick: this.addTask
      },
      //关键词排名的变量
      form: {
        frequency: "",
        keywords: null,
        sku: null,
        relateSku: null,
        monitorFlag: false,
        monitorFrom: null,
        monitorTo: null,
        monitorTimeAry: []
      },
      rules: {
        keywords: [
          {
            required: true,
            validator: validateKeyword,
            trigger: ["blur", "change"]
          }
        ],
        sku: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur", "change"]
          },
          { validator: validateSku, trigger: ["blur", "change"] }
        ],
        relateSku: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur", "change"]
          },
          { validator: validateSku, trigger: ["blur", "change"] }
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
        ]
      },
      // 添加任务，编辑任务end
      // 添加修改监控
      options_add: {
        loading: false,
        visible: false,
        width: "500px",
        title: "",
        api: "",
        okBtnText: "确认",
        type: "", // 选中的还是编辑的
        editItem: null // 编辑单项的数据
      },
      events_add: {
        handleOkClick: this.addMoni
      },
      form_add: {
        date: [],
        frequency: ""
      },
      rules_add: {
        date: [
          {
            required: true,
            message: "请选择监控起始时间",
            trigger: ["change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-1440）",
            trigger: ["blur", '"change"']
          },
          { validator: validateFrequency, trigger: ["blur"] } //限定输入的个数
        ]
      },
      // 添加修改监控end
      // 表格
      table: {
        loading: false,
        rows: [],
        // rowKey: "taskId",
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          taskName: false,
					imageUrl_RQ:true,
          sku: true,
					imageUrl_RQ2:true,
          relateSku: true,
          title: true,
          status: true,
          monitorFlag: true,
          frequency: true,
          createTime: true,
          monitorFrom: true,
          monitorTo: true,
          resultTime: false,
          Handle: {
            edit: true,
            refresh: true,
            check: true
          }
        }
      },
      userSelect: [],
      // 画图需要的数据 四
      pcMonitoringData: false,
      chartData: {
        chartShow: true,
        title: "",
        taskId: "",
        type: "",
        monitorFrom: "",
        monitorTo: "",
        itemType: ""
      },
      createTime:"",//创建时间
    };
  },

  created() {
    if (this.sellerId && this.siteId) {
      this.getList();
    }
  },
  mounted() {},
  methods: {
    // 列表
    getList(arg) {
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        platformId: this.platformId, // 上线要改
        siteId: this.siteId, //上线要改
        sellerId: this.sellerId, //上线要改
        ...arg
      };
      // 如果与日期，要分开赋值
      if (params.date) {
        params.startTime = params.date[0];
        params.endTime = params.date[1];
      }
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["TaskKeywordRankList5"](params)
        .then(data => {
          this.table.loading = false;
          this.table.rows = data.rows;
          // console.log(data.rows == "");
          if (
            data.rows == "" &&
            data.pageNo !== null &&
            data.pageNo !== "" &&
            data.pageNo !== 1
          ) {
            let a = {
              pageSize: this.table.pageSize,
              pageNumber: 1
            };
            this.getList(a);
            return;
          } else {
            this.table.pageNumber = data.pageNo;
          }
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
    // 添加
    addTask() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let params = {
            platformId: this.platformId, //上线要改
            siteId: this.siteId, //上线要改
            sellerId: this.sellerId, //上线要改
            sku: this.form.sku,
            relateSku: this.form.relateSku,
            monitorFlag: this.form.monitorFlag ? 1 : 0,
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
      this.$api["TaskKeywordRankSave5"](params)
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
    // 删除
    deleteTask(taskIds) {
      let params = { taskIds: taskIds };
      return this.$api["TaskKeywordRankRemove5"](params)
        .then(data => {
          if (data.code === 0) {
            return true;
          } else {
            return false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 添加/修改监控
    addMoni() {
      this.$refs["ruleForm_add"].validate(valid => {
        if (valid) {
          let API;
          let taskIds;
          let Url;
          if (this.options_add.type === "some") {
            // 通过选中
            let deleteArr = JSON.parse(JSON.stringify(this.userSelect));
            taskIds = [];
            deleteArr.forEach(item => {
              taskIds.push(item.taskId);
            });
            // 通过选中时,判断时添加还是修改监控
            API = this.options_add.api;
            if (API === "add") {
              Url = "TaskKeywordRankAddMonitor5";
            } else {
              Url = "TaskKeywordRankUpdateMonitor5";
            }
          } else if (this.options_add.type === "one") {
            // 通过点击编辑
            let editItem = this.options_add.editItem;
            taskIds = [];
            taskIds.push(editItem.taskId);
            Url = "TaskKeywordRankUpdateMonitor5";
          }
          let params = {
            frequency:
              this.form_add.frequency !== "" ? +this.form_add.frequency : "",
            monitorFrom: this.form_add.date[0],
            monitorTo: this.form_add.date[1],
            taskIds: taskIds
          };
          params = this.$.dealObjectValue(params);
          this.options_add.loading = true; //按钮loading
          this.$api[Url](params)
            .then(data => {
              this.options_add.loading = false;
              if (data.code == 0) {
                this.options_add.visible = false; // 关闭弹窗
                this.$refs["ruleForm_add"].resetFields(); //清除数据记录
                this.clearSearch = new Date().getTime();
                return;
              }
            })
            .catch(err => {
              this.options_add.loading = false;
            });
        }
      });
    },
    // 添加/修改监控添加表单
    resetFields() {
      this.$refs["ruleForm_add"].resetFields(); //清除数据记录
    },
    // 取消监控
    cancelMoni(taskIds) {
      let params = { taskIds: taskIds };
      return this.$api["TaskKeywordRankRemoveMonitor5"](params)
        .then(data => {
          if (data.code === 0) {
            return true;
          } else {
            return false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑
    edit__(arg) {
      // console.log(arg);
      this.options_add.visible = true;
      let date1 = arg.monitorFrom;
      let date2 = arg.monitorTo;
      // date
      let date;
      if (date1 && date2) {
        date = [arg.monitorFrom, arg.monitorTo];
         this.pickerOptions={
            disabledDate(time) {
              return time.getTime() < new Date(date1).getTime()-24*3600*1000 
            },
        }
        this.form_add.date = [] = date;
      } else {
         this.pickerOptions={
            disabledDate(time) {
              return time.getTime() < Date.now()-24*3600*1000;
            },
        }
        this.form_add.date = [dayjs(Date.now()).format('YYYY-MM-DD'),dayjs(Date.now()).format('YYYY-MM-DD')];
      }
      // frequency
      let frequency = arg.frequency;
      if (frequency) {
        this.form_add.frequency = frequency + "";
      } else {
        this.form_add.frequency = "";
      }
      // 通过编辑
      this.options_add.type = "one";
      this.options_add.title = "修改监控周期";
      this.options_add.editItem = arg;
    },
    // 重新抓取
    refresh__(arg) {
      // console.log(arg);
      let params = {
        taskId: arg.taskId
      };
      this.$confirm("此操作将重新抓取该项数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api["TaskKeywordRankReCrawl5"](params).then(data => {
            if (data.code === 0) {
              this.clearSearch = new Date().getTime();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已放弃本次操作"
          });
        });
    },
    // 画图 五
    check__(row) {
      // console.log(row);

      this.createTime=row.createTime;
      this.pcMonitoringData = true;
      this.chartData.title = "数据展示";
      this.chartData.taskId = row.taskId;
      this.chartData.itemType = 5;
      this.chartData.type = 1;
      this.chartData.url = "TaskKeywordRankRtItemList5";
      this.chartData.keywords = row.keywords;
      // console.log(this.$refs);
      this.$nextTick(() => {
        this.$refs.child.showChartChild(
          this.chartData.taskId,
          this.chartData.type
        );
      });
    },
    // 关闭弹窗时调用子组件方法清空日期 六
    closeDialog() {
      this.$refs.child.clearDate();
    }
  },
  computed: {},
  watch: {
    sellerData() {
      this.table.pageNumber = 1;
      this.getList();
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
