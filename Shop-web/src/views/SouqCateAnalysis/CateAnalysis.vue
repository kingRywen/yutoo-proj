<!--  -->
<template>
    <div class="___common" v-if="$route.name === 'CateAnalysis'">
    <template>
      <el-search :search="search" :clearSearch.sync="clearSearch" :platformId="platformId"></el-search>
    </template>
    <template>
      <el-handler :userSelect="userSelect" :hander="hander" :addShow.sync="options.visible" :addMoniShow.sync="options_add.visible" :Title.sync="options_add.title" :Api.sync="options_add.api" :date.sync="form_add.date" :frequency.sync="form_add.frequency" :Type.sync="options_add.type"></el-handler>
    </template>
    <template>
      <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
    </template>
    <!-- 添加产品 -->
    <el-dialog-yt :options="options" :events="events">
      <div class="box __box_wrapper">
        <el-form :model="form" :rules="rules" ref="ruleForm" style="width:94%;">
          <el-form-item label="选择类目 : " prop="category" :label-width="formLabelWidth" style="width:100%;">
            <el-cate :Cate.sync="form.category" :width="form.cateWidth" :HaveChildform.sync="form.haveChildren" :CategoryId.sync="form.categoryId" :platformId="platformId"></el-cate>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog-yt>
  </div>
  <router-view v-else></router-view>
  
  
</template>

<script>
export default {
  components: {},
  provide() {
    return {
      getList: this.getList,
      catchCate: this.catchCate,
      deleteTask: this.deleteTask,
      addTask: this.addTask,
      resetFields_add: this.resetFields_add,
      edit__: this.edit__,
      delete__: this.delete__,
      check__: this.check__
    };
  },
  activated() {
    this.$parent.$parent.$parent.change(this.$parent)
  },
  data() {
    //   类目校验
    var category_validate = (rule, value, callback) => {
      this.$nextTick(() => {
        // if (this.form.haveChildren !== 0) {
        // callback(new Error("请选择最后一级类目"));
        // } else {
        callback();
        // }
      });
    };
    return {
      // 搜索
      search: {
        taskName: false,
        cate: true
      },
      clearSearch: null,
      // 控件
      hander: {
        addTask: true,
        addButton: "添加类目",
        deleteTask: true,
        addTask4: true
      },
      // 添加任务，编辑任务
      formLabelWidth: "100px", //label宽度
      options: {
        loading: false,
        visible: false,
        width: "620px",
        title: "添加类目",
        URL: "",
        taskId: "",
        okBtnText: "确 认"
      },
      events: {
        handleOkClick: this.addTask
      },
      options_add: {
        loading: false,
        visible: false,
        width: "620px",
        title: "",
        api: "",
        okBtnText: "确 认"
      },
      form_add: {
        date: [],
        frequency: ""
      },
      form: {
        cateWidth: "100%",
        haveChildren: "",
        category: "",
        categoryId: null
      },
      rules: {
        category: this.rules_cate
      },
      rules_cate: [
        {
          required: true,
          message: "请选择类目",
          trigger: ["blur"]
        },
        { validator: category_validate, trigger: ["blur"] }
      ],
      // 表格
      table: {
        loading: false,
        rows: [],
        // rowKey: "taskId",
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          category: true,
          status: true,
          createTime: true,
          resultTime: true,
          Handle: {
            edit1: true,
            delete: true,
            check: true
          }
        }
      },
      userSelect: []
    };
  },

  created() {},
  mounted() {},
  methods: {
    // 列表
    getList(arg) {
      let params = {
        // adFlag: 1,
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        siteId: +this.$store.state.common.siteId__, //上线要改
        ...arg
      };
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["TaskCateAnalysisSouqList"](params)
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
            categoryId: this.form.categoryId,
            siteId: this.$store.state.common.siteId__
          };
          if (!this.options.taskId) {
            params.taskId = "";
          } else {
            params.taskId = this.options.taskId;
          }
          params = this.$.dealObjectValue(params);
          // console.log(params, "params");
          this.addFun(params);
        }
      });
    },
    addFun(params) {
      // console.log(params, "params");
      this.options.loading = true; // 按钮loading;
      this.$api[this.options.URL](params)
        .then(data => {
          this.options.loading = false;
          if (data.code == 0) {
            this.options.visible = false; // 关闭弹窗
            this.form.categoryId = "";
            this.clearSearch = new Date().getTime();
            return;
          }
        })
        .catch(err => {
          this.options.loading = false;
        });
    },
    catchCate(arg) {
      this.$api["TaskCateAnalysisSouqReCrawl"](arg).then(data => {
        this.getList();
      });
    },
    // 删除
    deleteTask(taskIds) {
      let params = {
        taskIds: taskIds,
        siteId: this.$store.state.common.siteId__
      };
      return this.$api["TaskCateAnalysisSouqRemove"](params)
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
    // 类目清空表单
    resetFields_add() {
      this.options.URL = "TaskCateAnalysisSouqSave";
      this.$store.commit("common/clearCate", new Date().getTime());
      // console.log(this.options.URL, "this.options.URL");
      this.options.taskId = "";
      this.rules.category = this.rules_cate;
    },
    // 编辑
    edit__(arg) {
      this.options.visible = true;
      // 通过编辑
      this.options.URL = "TaskCateAnalysisSouqUpdate";
      this.options.title = "编辑类目";
      this.options.taskId = arg.taskId;
      this.$nextTick(() => {
        this.rules.category = [
          {
            required: false
          },
          {
            validator: (rule, value, callback) => {
              this.$nextTick(() => {
                if (value != "") {
                  // if (this.form.haveChildren !== 0) {
                  // callback(new Error("请选择最后一级类目"));
                  // } else {
                  callback();
                  // }
                }
              });
            },
            trigger: ["blur", "change"]
          }
        ];
        this.$store.commit("common/clearCate", new Date().getTime());
      });
    },
    // 单个删除
    delete__(arg) {
      this.$confirm("此操作将删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            taskIds: [arg.taskId],
            siteId: +this.$store.state.common.siteId__
          };
          this.$api["TaskCateAnalysisSouqRemove"](params)
            .then(data => {
              if (data.code === 0) {
                let param = {
                  pageSize: 10,
                  pageNumber: 1
                };
                this.getList(param);
                return true;
              } else {
                return false;
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已放弃本次操作"
          });
        });
    },
    // 查看
    check__(arg) {
      // console.log(row, "row");
      let taskId = arg.taskId;
      let category = arg.category;
      this.$router.push({
        // path: "/SOUQ/CateAnalysisDetail",
        name: "CateAnalysisDetail",
        query: {
          taskId: taskId,
          category: category,
          sellerId: this.sellerId,
          siteId__: +this.$store.state.common.siteId__
        }
      });
    }
  },
  computed: {},
  watch: {
    skusArr(val) {
      if (val.length) {
        this.fontSum = val.length;
      } else {
        this.fontSum = 0;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
