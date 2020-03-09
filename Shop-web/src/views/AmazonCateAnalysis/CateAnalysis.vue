<template>
  <div class="___common">
    <template>
      <!-- <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination> -->
	  <MainLayout
	    :outerParams="outerParams"
	    :searchFields="searchFields"
	    :editBtns="editBtns"
	  	:edits="edits"
	    :columns="columns"
		:searchFunc = 'searchFunc'
	    ref="layout"
	    url="TaskCateAnalysisSouqListAmazon"
	      >  
	  </MainLayout>
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
</template>

<script>
export default {
  components: {},
  provide() {
    return {
      catchCate: this.catchCate,
      deleteTask: this.deleteTask,
      addTask: this.addTask,
      resetFields_add: this.resetFields_add,
      edit__: this.edit__,
      delete__: this.delete__,
      check__: this.check__
    };
  },
  data() {
	let vm = this
    //   类目校验
    var category_validate = (rule, value, callback) => {
      vm.$nextTick(() => {
        // if (vm.form.haveChildren !== 0) {
        // callback(new Error("请选择最后一级类目"));
        // } else {
        callback();
        // }
      });
    };
    return {
      // 搜索
	  edits:[
		  {
		  	name:'查看',
		  	icon:'el-icon-search',
		  	show:scope=>{
		  		return scope.row.status === 2
		  	},
		  	fn:scope=>{
		  		vm.check__(scope.row)
		  	}
		  },
		 //  {
		 //  	name:'重新抓取',
		 //  	icon:'el-icon-refresh',
			// show:scope=>{
			// 	return scope.row.status != 1
			// },
		 //  	fn: scope=>{
		 //  		vm.catchCateItme(scope.row.taskId)
		 //  	}
		 //  },
		 //  {
		 //  	name:'删除',
		 //  	icon:'el-icon-delete',
		 //  	fn: scope=>{
		 //  		vm.delete__(scope.row)
		 //  	}
		 //  },
	  ],
	  editBtns:[
		  {
		  	name:"添加类目",
		  	fn: () => {
				this.resetFields_add();
				this.options.visible = true
		  	}
		  },
		  {
		  	name:'删除',
			disabled: selection => {
			  return selection.length == 0
			},
		  	fn: ()=>{
		  				let taskIds = vm.getSelection().map(el=>el.taskId)
		  		this.deleteTask(taskIds)
		  	}
		  },
		  {
		  	name:'抓取数据',
			disabled: selection => {
			  return selection.length == 0
			},
		  	fn: ()=>{
				let taskIds = vm.getSelection().map(el=>el.taskId)
		  		this.catchCate(taskIds)
		  	}
		  },
		   {
		  	name:'重新统计',
			show:()=>{
				return vm.siteId == 1
			},
			disabled: selection => {
			  return selection.length == 0
			},
		  	fn: ()=>{
		  		let taskIds = vm.getSelection().map(el=>el.taskId)
		  		this.resetMethod(taskIds)
		  	}
		  },
	  ],
	  searchFields:[
		  {
		  	label:'类目',
		  	name:'categorys',
		  	type:'cascader',
				labelWidth:'40px',
		  	placeholder:'请选择类目',
		  	bind:{
		  		label:'name',
		  		value:'name',
		  		children:'childs',
		  		enabled:'enabled'
		  	},
		  	options:this.getCategory,
		  },
	  ],
	  columns:[
	  	{
	  		label:'类目',
	  		value:'category',
			width:300,
			align:'left',
			render(h, scope) {
				let  category  = scope.row.category
				if(category.length>50){
					let newArr = category.split(':')
					var newStr = ''
					newStr = `${newArr[0]}...${newArr.pop()}`
				}
	  			return category ? (
				  <div>					
					<el-tooltip open-delay={300} content={category} placement="top"  effect="light">
						<a class="fix__row_1" href={scope.row.categoryUrl} style="color:#108ee9;" target='_blink'>{category.length>50?newStr:category}</a>
					</el-tooltip>
				  </div>
				  
	  			) : (
	  			  <span>-</span>
	  			)
	  		}	
	  	},
		{
			label:'抓取状态',
			value:'status',
			minWidth:150,
			align:'left',
			render(h,scope){
				let {status} = scope.row
				return status===0 ? (
					<span>待抓取</span>
				) : status===1 ? (
					<span>抓取中</span>							
				) : status===2 ? (
					<span>抓取成功</span>
				) : (
					<span>抓取失败</span>
				)
			}
		},
	  	{
	  		label:'创建时间',
	  		value:'createTime',
			align:'left',
	  		minWidth:150,
	  	},
	  	
	  	{
	  		label:'结果生成时间',
	  		value:'resultTime',
			align:'left',
	  		minWidth:150,
	  	},
	  ],
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
        okBtnText: "确 认",
        resetFields: () => {
          vm.$refs.ruleForm.resetFields();
        }
      },
      events: {
        handleOkClick: vm.addTask
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
        category: vm.rules_cate
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
    };
  },

  created() {},
  mounted() {},
  methods: {
	  resetMethod(ids){
			this.$confirm('此操作将重新统计,是否继续','提示',{type:'warning'}).then(()=>{
				this.$api['taskCategoryAnalysisReStat']({taskIds:ids}).then((res)=>{
					if(res.code==0) this.$refs.layout.getList()
				})
			}).catch(()=>{})
	  },
	  searchFunc(data){
			let {categorys,...info} = data;
			if(categorys){
				let category = categorys.join(':');
				return {category,...info}
			}else{
				return {...info}
			}
	  },
	  async getCategory(id = [0],selEl,itemDisabled){
	  	if(!selEl) selEl = {pcid:0};
	  	let siteId = await this.sellerData.siteId;
	  	if(siteId){
	  		let {pcid} = selEl
	  		let params = {
	  			parentPcid:pcid,
	  			siteId:siteId,
	  			platformId:this.platformId
	  		}
	  		return this.$api['GetCateList'](params)
	  			.then(data => {
	  				if (data && data.code && data.code !== 0) {
	  					this.$message.error(data.meg)
	  					return
	  				}
	  				return data.data.map(el => {
	  					return {
	  						...el,
	  						childs:el.haveChildren ? [] :null,
	  						enabled: true,
	  						isLeaf: !el.haveChildren
	  					}
	  				})
	  			}).catch((err)=>{
	  		})
	  	}
	  },
	  // selectChange(v){
	  // 	this.userSelect = [];
	  // 	v.forEach(i => {
	  // 	  this.userSelect.push(i)
	  // 	});
	  // },
    // 添加
    addTask() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let params = {
            categoryId: this.form.categoryId,
            siteId: this.siteId
          };
          if (!this.options.taskId) {
            params.taskId = "";
          } else {
            params.taskId = this.options.taskId;
          }
          params = this.$.dealObjectValue(params);
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
			this.$refs.layout.getList()
            return;
          }
        })
        .catch(err => {
          this.options.loading = false;
        });
    },
    catchCate(arg) {
	  this.$confirm('此操作将重新抓取,是否继续','提示',{type:'warning'}).then(()=>{
		 this.$api["TaskCateAnalysisSouqReCrawlAmazon"]({taskIds:arg}).then(data => {
		   this.$refs.layout.getList();
		 }); 
	  }).catch(()=>{})
      
    },
	catchCateItme(data){
		this.$confirm('此操作将重新抓取,是否继续','提示',{type:'warning'}).then(()=>{
			this.$api["TaskCateAnalysisSouqReCrawlAmazon"]({taskIds:[data]}).then(data => {
			  this.$refs.layout.getList();
			});
		}).catch(()=>{})
	},
    // 删除
    deleteTask(taskIds) {
		this.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
			let params = {
			  taskIds: taskIds,
			  siteId: this.$store.state.common.siteId__
			};
			return this.$api["TaskCateAnalysisSouqRemoveAmazon"](params)
			  .then(data => {
			    if (data.code === 0) {
						this.$refs.layout.getList()
			      return true;
			    } else {
			      return false;
			    }
			  })
			  .catch(err => {
			    console.log(err);
			  });
		}).catch(()=>{})
      
    },
    // 类目清空表单
    resetFields_add() {
      this.options.URL = "TaskCateAnalysisSouqSaveAmazon";
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
          this.$api["TaskCateAnalysisSouqRemoveAmazon"](params)
            .then(data => {
              if (data.code === 0) {
                // let param = {
                //   pageSize: 10,
                //   pageNumber: 1
                // };
                this.$refs.layout.getList();
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
      let taskId = arg.taskId;
      let category = arg.category;
	  let brandStatus = arg.brandStatus
	  let statStatus = arg.statStatus
      this.$router.push({
        name: "AmazonCateAnalysisDetail",
        query: {
          taskId: taskId,
          category: category,
		  brandStatus:brandStatus,
		  statStatus:statStatus,
          siteId__: +this.$store.state.common.siteId__
        }
      });
    }
  },
  watch: {
    skusArr(val) {
      if (val.length) {
        this.fontSum = val.length;
      } else {
        this.fontSum = 0;
      }
    }
  },
  computed: {
  	outerParams(){
  		return {
  			siteId:this.siteId
  		}
  	},
	sellerData(){
		return JSON.parse(sessionStorage.getItem("shop_seller_data") || null)
	}
  },
};
</script>

<style lang='scss' scoped>
</style>
