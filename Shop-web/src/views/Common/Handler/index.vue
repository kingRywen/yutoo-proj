<!-- 操作按钮 -->
<template>
  <div class="___common">
    <!-- {{userSelect}} -->
    <div class="margin_top10 margin_bottom10">
      <el-button :loading="loading" v-if="hander.analysys" size="mini" type="primary" plain @click="analysys">趋势分析</el-button>
      <el-button :loading="loading" v-if="hander.analysysAmazon" size="mini" type="primary" plain @click="analysysAmazon">趋势分析</el-button>
      <!-- souq添加类目分析 -->
      <el-button :loading="loading" v-if="hander.addTask" size="mini" type="primary" plain @click="showAdd">{{hander.addButton}}</el-button>
      <el-button :loading="loading" v-if="hander.addTask2" size="mini" type="primary" plain @click="showAdd2">{{hander.addButton}}</el-button>
      <el-button :loading="loading" v-if="hander.addTask3" size="mini" type="primary" plain @click="addCateAnalysis">{{hander.addButton}}</el-button>
      <el-button :loading="loading" v-if="hander.addTask3__" size="mini" type="primary" plain @click="addCateAnalysis__">{{hander.addButton}}</el-button>
      <!-- 导出数据 -->
      <el-button :loading="loading" v-if="hander.download" size="mini" type="primary" plain @click="download">{{hander.downloadText}}</el-button>
      <el-button :loading="loading" v-if="hander.addTask4" size="mini" type="primary" plain @click="refreshCate">抓取数据</el-button>
      <el-button :loading="loading" v-if="hander.deleteTask" size="mini" type="primary" plain @click="showDelete('task')">删除</el-button>
      <!-- 授权页面的删除 -->
      <el-button :loading="loading" v-if="hander.deleteAuth" size="mini" type="primary" plain @click="showDelete('auth')">删除</el-button>
      <!-- 类目设置的删除 -->
      <el-button :loading="loading" v-if="hander.deleteCate" size="mini" type="primary" plain @click="showDelete('cusCateIds')">删除</el-button>
	  <el-button :loading="loading" v-if="hander.returnRateWarning" size="mini" type="primary" plain @click="returnRateWarningMethod('cusCateIds')">批量设置退货率预警值</el-button>
      <el-button :loading="loading" v-if="hander.verify" size="mini" type="primary" plain @click="verifyFun">标题卖点校验</el-button>
			<el-button :loading="loading" v-if="hander.verify2" size="mini" type="primary" plain @click="verifyFun2">后台词校验</el-button>
      <el-button :loading="loading" v-if="hander.priority" size="mini" type="primary" plain @click="priorityFun(1)">设置优先</el-button>
      <el-button :loading="loading" v-if="hander.cancel_priority" size="mini" type="primary" plain @click="priorityFun(0)">取消优先</el-button>
      <el-button :loading="loading" v-if="hander.addMoni" size="mini" type="primary" plain @click="showMoni('add')">添加监控</el-button>
      <el-button :loading="loading" v-if="hander.changeMoni" size="mini" type="primary" plain @click="showMoni('change')">修改监控周期</el-button>
      <el-button :loading="loading" v-if="hander.cancelMoni" size="mini" type="primary" plain @click="showCancel">取消监控</el-button>
	  <el-button v-if="hander.showBrandStatus == 1 && hander.showCatchBtn" size="mini" type="primary" plain disabled loading>商标数据抓取中</el-button>
	  <el-button :loading="loading" v-if="hander.showStatStatus != 1 && hander.showCatchBtn && hander.showBrandStatus != 1" size="mini" type="primary" plain @click="resetCatchMethod">重新统计</el-button>
	  <el-button v-if="hander.showStatStatus == 1 && hander.showBrandStatus != 1 && hander.showCatchBtn" size="mini" type="primary" plain disabled>统计中</el-button>
	  <el-button v-if="hander.showTool" size="mini" type="primary" plain @click="showDialog()">关键词生成工具</el-button>
	  <el-button v-if="hander.showToolNew" size="mini" type="primary" plain @click="showDialogNew()">关键词生成工具</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  inject: {
    getList: {
      default: null
    },
    addTask: {
      default: null
    },
	resetTask:{
		default: null
	},
    catchCate: {
      default: null
    },
    deleteTask: {
      default: null
    },
    addMoni: {
      default: null
    },
	WarningMethod: {
		default: null
	},
    // 清楚监控表单
    resetFields: {
      default: null
    },
    draw__: {
      default: null
    },
    // 清楚添加表单
    resetFields_add: {
      default: null
    },
    verify: {
      default: null
    },
		verify2: {
		  default: null
		},
    priority: {
      default: null
    },
    cancel_priority: {
      default: null
    },
    cancelMoni: {
      default: null
    },
    beforeAdd: {
      default: null
    },
    download: {
      default: null
    },
	showToolDialog:{
		default: null
	},
	showToolDialogNew:{
		default:null
	}
  },
  props: {
    userSelect: {
      type: Array
    },
    hander: {
      type: Object
    },
    loading:{
      default: false
    }
  },

  created() {},
  mounted() {},
  methods: {
	  showDialog(){
		this.showToolDialog() 
	  },
	  showDialogNew(){
		this.showToolDialogNew()  
	  },
    analysys() {
      let len = this.userSelect.length;
      if (len > 0) {
        // console.log(this.userSelect, "this.userSelect");
        // this.$message.warning("缺接口");
        let params = {
          siteId: +this.$route.query.siteId__ || this.siteId
        };
        let arr = [];
        this.userSelect.forEach(el => {
          arr.push(el.asin);
        });
        params.asin = arr;
        this.draw__(params);
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
    analysysAmazon() {
      let len = this.userSelect.length;
      if (len > 0) {
        // console.log(this.userSelect, "this.userSelect");
        // this.$message.warning("缺接口");
        let params = {
          siteId: +this.$route.query.siteId__ || this.siteId
        };
        let arr = [];
        this.userSelect.forEach(el => {
          arr.push(el.parentAsin);
        });
        params.parentAsin = arr;
        this.draw__(params);
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
    // 添加
    showAdd() {
      try {
        this.$emit("update:addShow", true);
        if (this.resetFields_add) {
          // 如果传入，代表需要打开页面的时候清理表单
          this.resetFields_add();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 需要选择的的添加，如加入词库，加入排名
    showAdd2() {
      let len = this.userSelect.length;
      if (len > 0) {
        this.$emit("update:addShow", true);
        if (this.beforeAdd) {
          this.beforeAdd();
        }
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
		resetCatchMethod(){
			let len = this.userSelect.length;
			if (len > 0) {
			  let arr = [];
			  this.userSelect.forEach(el => {
			    arr.push(el.category);
			  });
			  let params = {
			    categorys: arr,
			  };
			  this.resetTask(params);
			} else {
			  this.$message.warning("请至少选择一项");
			}
		},
    addCateAnalysis() {
      let len = this.userSelect.length;
      if (len > 0) {
        let arr = [];
        this.userSelect.forEach(el => {
          arr.push(el.categoryId);
        });	
        let params = {
          categoryIds: arr,
          siteId: this.siteId
        };
        this.addTask(params);
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
    addCateAnalysis__() {
      this.$message.warning("功能开发中");
    },
    refreshCate() {
      let len = this.userSelect.length;
      if (len > 0) {
        let arr = [];
        this.userSelect.forEach(el => {
          arr.push(el.taskId);
        });
        let params = {
          taskIds: arr,
          siteId: this.$store.state.common.siteId__
        };
        this.catchCate(params);
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
    verifyFun() {
      let len = this.userSelect.length;
      if (len > 0) {
        let str;
        str = "此操作对选中项进行校验, 是否继续?";
        this.$confirm(str, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let arr = this.userSelect;
            let verifyIds = [];
            arr.forEach(el => {
              verifyIds.push(el.verifyId);
            });
            this.verify(verifyIds);
          })
          .catch(err => {
            console.log(err);
            this.$message({
              type: "info",
              message: "已放弃本次操作"
            });
          });
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
		verifyFun2() {
		  let len = this.userSelect.length;
		  if (len > 0) {
		    let str;
		    str = "此操作对选中项进行校验, 是否继续?";
		    this.$confirm(str, "提示", {
		      confirmButtonText: "确定",
		      cancelButtonText: "取消",
		      type: "warning"
		    })
		      .then(() => {
		        let arr = this.userSelect;
		        let verifyIds = [];
		        arr.forEach(el => {
		          verifyIds.push(el.verifyId);
		        });
		        this.verify2(verifyIds);
		      })
		      .catch(err => {
		        console.log(err);
		        this.$message({
		          type: "info",
		          message: "已放弃本次操作"
		        });
		      });
		  } else {
		    this.$message.warning("请至少选择一项");
		  }
		},
    // 设置优先，取消优先
    priorityFun(type) {
      let len = this.userSelect.length;
      if (len > 0) {
        let str;
        if (type === 0) {
          str = "此操作对选中项取消优先, 是否继续?";
        } else {
          str = "此操作对选中项优先设置, 是否继续?";
        }
        this.$confirm(str, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let arr = this.userSelect;
            let verifyIds = [];
            verifyIds=arr.map(el => {
              return el.verifyId
            });
            this.priority(verifyIds, type);
          })
          .catch(err => {
            console.log(err);
            this.$message({
              type: "info",
              message: "已放弃本次操作"
            });
          });
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
    // 删除根据taskId
    showDelete(type) {
      let len = this.userSelect.length;
      if (len > 0) {
        this.$confirm("此操作将删除该选中项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.handlerDelete(type);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已放弃本次操作"
            });
          });
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
	returnRateWarningMethod(){
		let len = this.userSelect.length;
		if (len > 0) {
		  this.WarningMethod();
		} else {
		  this.$message.warning("请至少选择一项");
		}
	},
    async handlerDelete(type) {
      let deleteArr = this.userSelect;
      let arr = [];
      deleteArr.forEach(item => {
        if (type === "task") {
          arr.push(item.taskId);
        } else if (type === "auth") {
          arr.push(item.sellerAuthId);
        } else if (type === "cusCateIds") {
          arr.push(item.cusCateId);
        }
      });
      let result = await this.deleteTask(arr);
      if (result === true) {
        let params = {};
        if (type !== "cusCateIds") {
          params = {
            pageSize: 10,
            pageNumber: 1
          };
        }
        this.getList(params);
      }
    },
    // 删除根据sellerAuthIds

    // 添加监控
    showMoni(type) {
      if (this.userSelect.length > 0) {
        let title, api;
        if (type === "add") {
          // 遍历如果都处于监控状态，则不用添加
          let notMoni = this.userSelect.find(item => {
            // 如果找到未处于监控的则可以继续弹窗
            return item.monitorFlag === 0;
          });
          if (notMoni) {
            this.$emit("update:addMoniShow", true);
            this.$emit("update:Type", "some");
          } else {
            this.$message.warning("选中项已处于监控状态，如有延误请刷新再重试");
            return;
          }
          title = "添加监控";
          api = "add";
          this.$emit("update:pickerOptions", {
              disabledDate(time) {
                return time.getTime() < Date.now()-24*3600*1000;
              },
          });
          this.$nextTick(() => {
            this.resetFields();
          });
        } else {
          this.$emit("update:addMoniShow", true);
          this.$emit("update:Type", "some");
          title = "修改监控周期";
          api = "change";
          this.$nextTick(() => {
              this.resetFields();
              if (this.userSelect.length === 1) {
              // 如果选中的只有一条修改监控
              // console.log(this.userSelect[0]);
              let date1 = this.userSelect[0].monitorFrom;
              let date2 = this.userSelect[0].monitorTo;
              // date
              let date;
              if (date1 && date2) {
                date = [
                  this.userSelect[0].monitorFrom,
                  this.userSelect[0].monitorTo
                ];
                this.$emit("update:date", date);
                this.$emit("update:pickerOptions", {
                    disabledDate(time) {
                      return time.getTime() < new Date(date1).getTime()-24*3600*1000 
                    },
                });
              } else {
                this.$emit("update:date", []);
                this.$emit("update:pickerOptions", {
                    disabledDate(time) {
                      return time.getTime() < Date.now()-24*3600*1000;
                    },
                });
              }
              // frequency
              let frequency = this.userSelect[0].frequency;
              if (frequency) {
                this.$emit("update:frequency", frequency + "");
              } else {
                this.$emit("update:frequency", "");
              }
            } else {
            
            }
          });
        }
        this.$emit("update:Title", title);
        this.$emit("update:Api", api);
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
    // 取消监控
    showCancel() {
      let len = this.userSelect.length;
      if (len > 0) {
        // 遍历如果都处于监控状态，则不用添加
        let notMoni = this.userSelect.find(item => {
          // 如果找到未处于监控的则可以继续弹窗
          return item.monitorFlag === 1;
        });
        if (!notMoni) {
          this.$message.warning(
            "选中项未处于监控状态，无需取消，如有延误请刷新再重试"
          );
          return;
        }
        this.$confirm("此操作将取消选中项的监控, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.handlerCancel();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已放弃本次操作"
            });
          });
      } else {
        this.$message.warning("请至少选择一项");
      }
    },
    async handlerCancel() {
      let deleteArr = JSON.parse(JSON.stringify(this.userSelect));
      let taskIds = [];
      deleteArr.forEach(item => {
        taskIds.push(item.taskId);
      });
      let result = await this.cancelMoni(taskIds);
      if (result === true) {
        let params = {
          pageSize: 10,
          pageNumber: 1
        };
        this.getList(params);
      }
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
</style>
