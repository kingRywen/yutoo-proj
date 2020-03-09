<template>
	<div>
		<MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
            :treeTable="treeTable"
            :searchFunc="searchFunc"
            @selectChange='selectChange'
            ref="layout"
            url="ebTaskCategoryRankList"
            >  

            <!-- <div slot="left">123</div> -->
        </MainLayout> 
	</div>
</template>

<script>
export default {
	data() {
		let vm=this;
		return {
			treeTable:false,
            treeTableOtions:{},
            searchData: {},
			//筛选条件的搜索
                searchFields:[
                    {
                        label: '类目',
                        name: "categorys",
                        type: "cascader",
						placeholder:'请输选择类目',
						width:320,
						options:vm.getCategory,
						bind: {
							label: 'name',
							value: 'name',
							children: 'childs',
							enabled: 'enabled'
						},
						// last: true,
						// hidden(data) {
						// 	return data.dataType === 2
						// }
					},
					{
                        label: "产品ID",
                        name: "asin",
                        type: "input",
                        placeholder:'请输入产品ID'
					},
					{
                        label: "监控状态",
                        name: "monitorFlag",
                        type: "select",
                        placeholder:'请选择监控状态',
                        options:[
                            { label: "关闭监控",value: 0 },
                            { label: "开启监控",value: 1 },
                        ]
					},
					{
                        label: "抓取状态",
                        name: "status",
                        type: "select",
                        placeholder:'请选择抓取状态',
                        options:[
                            { label: "抓取中",value: 1 },
                            { label: "抓取成功",value: 2 },
                            { label: "抓取失败",value: 3 },
                        ]
                    },
                    {
                        label: "数据类型",
                        name: "productType",
                        type: "select",
                        placeholder:'请选择数据类型',
                        options: [
                            {label: "全部",value: 0 },
                            {label: "拍卖",value: 1},
                            {label: "一口价",value: 2},
                        ]
                    },
                    {
                        label: "创建时间",
                        name: "time",
						type: "dateRange",
						width:300,
						placeholder:'请选择',
						pickerOptions: {
							disabledDate(time) {
								return time.getTime() > Date.now();
							},
						}
                    },
				],
			//表格头部操作按钮
                editBtns:[
                    {
                        name: "添加任务",
                        fn: () => {
                            this.$refs.layout.$dialog({
                                title: "添加产品",
                                size:'small',
                                params: {siteId:this.outerParams.siteId,sellerId:this.outerParams.sellerId},
                                component: () => import('./common/addTaskDialog.vue'),
                                okBtnText: "确认",
                                cancelBtnText: "取消"
                            });
                        }
                    },
                    {
                        name: "删除",
                        fn: () =>{
                            this.delBtn()
                        }
					},
					{
                        name: "添加监控",
                        fn: () =>{
                            this.startMonitoring()
                        }
                    },
					 {
                        name: "修改监控",
                        fn: () =>{
                            this.alertMonitoring()
                        }
					},
					{
                        name: "取消监控",
                        fn: () =>{
                            this.endMonitoring()
                        }
					},
				],
			//columns表格
                columns: [
                    {
                        label: "类目",
                        value: "category",
						minWidth: 150,
						// render(h,scope){
                        //     return (
                        //        <a href={scope.row.categoryUrl} target='_blink' style={{color:"#108ee9"}}>{scope.row.category}</a>
                        //     )
						// }
						render(h,scope){
							let { category } = scope.row
							// return <span class="fix__row_2">{shippingWeight.join(', ')}</span>
							return category ? (
								<el-tooltip open-delay={300} content={category}>
									<a href={scope.row.categoryUrl} target='_blink' style={{color:"#108ee9"}} class="fix__row_1">{scope.row.category}</a>
								</el-tooltip>
							) : (
								<span>-</span>
							)
						}
                    },
                    {
                        label: "主图",
                        value: "imageUrl",
						minWidth: 150,
						img:true,
						style: {
                            //图片宽高
                            width: 40,
                            height: 40
                        },
                        bulkyHeight: 120 //鼠标hover图片高，宽度自动
					},
					{
                        label: "产品id",
                        value: "asin",
                        minWidth: 150,
                        render(h,scope){
                            return (
                               <a href={scope.row.productUrl} target='_blink' style={{color:"#108ee9"}}>{scope.row.asin}</a>
                            )
                        }
					},
					{
                        label: "标题",
                        value: "title",
						minWidth: 150,
						render(h,scope){
							let { title } = scope.row
							// return <span class="fix__row_2">{shippingWeight.join(', ')}</span>
							return title ? (
								<el-tooltip open-delay={300} content={title}>
								<span class="fix__row_1">{title}</span>
								</el-tooltip>
							) : (
								<span>-</span>
							)
						}
					},
					{
                        label: "抓取状态",
                        value: "status",
						minWidth: 150,
						render(h,scope){
							return(
								scope.row.status===1?"抓取中":scope.row.status===2?"抓取成功":'抓取失败'
							)
						}
					},
					{
                        label: "监控状态",
                        value: "monitorFlag",
						minWidth: 150,
						enum:{
							0:'关闭',
							1:'开启'
						}
					},
					{
                        label: "监控频率",
                        value: "frequency",
						minWidth: 150,
						render(h,scope){
							return (
								<span>{scope.row.frequency?scope.row.frequency+'分钟':"-"}</span>
							)
						}
					},
					{
                        label: "数据类型",
                        value: "productType",
						minWidth: 150,
						enum:{
							0:"全部",
							1:"拍卖",
							2:"一口价",
						}
					},
					{
                        label: "创建时间",
                        value: "createTime",
                        minWidth: 150
					},{
                        label: "监控开始时间",
                        value: "monitorFrom",
                        minWidth: 150
					},
					{
                        label: "监控结束时间",
                        value: "monitorTo",
                        minWidth: 150
					},
				],
			//外部参数
                outerParams: {
                    siteId: null,
					sellerId: null,
					platformId:null,
					taskFlag:0,//自然搜索
				},
			//表格列表操作按钮
                edits: [
                    {
                        name: "查看详情",
                        icon: "el-icon-search",
                        show: scope => {
                            //console.log(scope);
                            return scope.row.status===2;
                        },
                        fn: (scope) => {
                            return this.lookDatsils(scope.row)
                        }
					},
					{
                        name: "修改",
                        icon: "el-icon-edit-outline",
                        show: scope => {
                            //console.log(scope);
                            return true//scope.row.status===2;
                        },
                        fn: (scope) => {
                            return this.onealertMonitoring(scope.row.taskId,scope.row)
                        }
                    },
                    {
                        name: "重新抓取",
                        icon: "el-icon-refresh",
                        show: scope => {
                              return  scope.row.status!==1 && scope.row.status!==2;
                        },
                        fn: (scope) => {
                            //console.log(scope);
                            return this.refetchOneData(scope.row.taskId)
                        }
                    },

                ],

            slectIds:[],//选择的ID的数组
		};
	},
	methods: {
		//获取类目
			async getCategory(id = [0], selEl, itemDisabled){
				if (!selEl) {
					selEl = {
					pcid: 0
					}
				};
				let siteId = await this.siteId;
				if(siteId){
					let { pcid } = selEl
					let params = {
						parentPcid:pcid,
						siteId: siteId,
						platformId: this.ebayPlatformId
					}
					return this.$api[`ebProductCategoryGetCategory`](params)
						.then(data => {
						if (data && data.code && data.code !== 0) {
							this.$message.error(data.msg)
							return
						}
						//console.log(data);
						return data.data.map(el => {
							return {
							...el,
							childs: el.haveChildren ? [] : null,
							enabled: true,
							isLeaf: !el.haveChildren
							}
						})
					})
					.catch(() => {})
				};
			},
		//查看详情
			lookDatsils(v){
				//console.log(v);
				this.$refs.layout.$dialog({
					title: "数据展示",
					size:'large',
					params: {resultTime:v.resultTime,url:"ebTaskCategoryRankCurveList",taskId:v.taskId},
					component: () => import('./common/echartsDialog.vue'),
					// okBtnText: "确认",
					// cancelBtnText: "取消"
				});
			},
		//重新抓取
			refetchOneData(v){
				this.$api['ebTaskCategoryRankReCrawl']({
					taskIds:[v]
				})
				.then(data => {
					this.$refs.layout.getList();
				}).catch(() => {})
			},
		//搜索条件的处理
			searchFunc(data){
				let {time,categorys,...info}=data;
				let [startTime,endTime]=time || [];
				if(categorys){
					let category=categorys.join(':');
					return {startTime,endTime,category,...info};
				}else{
					return {startTime,endTime,...info};
				};
				
				
			},
		//删除人任务
			delBtn(){
				//console.log(this.slectIds.length);
				if( !this.slectIds.length){
					this.$message.warning('请至少选择一项');
					return
				};
				this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
					}).then(() => {
						this.$api['ebTaskCategoryRankRemove']({
							taskIds:this.slectIds
						})
						.then(data => {
							this.$refs.layout.getList()
						}).catch(() => {})
					}).catch(() => {
			  
				});
				
			},
		//开启监控
			startMonitoring(){
				if( !this.slectIds.length){
					this.$message.warning('请至少选择一项');
					return
				};
				this.$refs.layout.$dialog({
					title: "添加监控",
					size:'small',
					params: {taskIds:this.slectIds,url:"ebTaskCategoryRankAddMonitor"},
					component: () => import('./common/startMonitoringDialog.vue'),
					okBtnText: "确认",
					cancelBtnText: "取消"
				});
			},
		//修改监控
			alertMonitoring(){
				if( !this.slectIds.length){
					this.$message.warning('请至少选择一项');
					return
				};
				this.$refs.layout.$dialog({
					title: "修改监控",
					size:'small',
					params: {taskIds:this.slectIds,url:'ebTaskCategoryRankUpdateMonitor'},
					component: () => import('./common/startMonitoringDialog.vue'),
					okBtnText: "确认",
					cancelBtnText: "取消"
				});
			},
		//点击列表的单个的修改
			onealertMonitoring(v,data){
				this.$refs.layout.$dialog({
					title: "修改监控",
					size:'small',
					params: {taskIds:[v],url:'ebTaskCategoryRankUpdateMonitor',datas:data},
					component: () => import('./common/startMonitoringDialog.vue'),
					okBtnText: "确认",
					cancelBtnText: "取消"
				});
			},
		//取消监控
			endMonitoring(){
				if( !this.slectIds.length){
					this.$message.warning('请至少选择一项');
					return
				};
				this.$confirm('此操作将永久取消该监控, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
					}).then(() => {
						this.$api['ebTaskCategoryRankRemoveMonitor']({
							taskIds:this.slectIds
						})
						.then(data => {
							this.$refs.layout.getList()
						}).catch(() => {})
					}).catch(() => {
						
				});
				
			},
		//表格勾选改变
			selectChange(v){
				//console.log(v);
				this.slectIds=v.map((i)=>{
					return i.taskId
				});
				//console.log(this.slectIds);
			},	
		
	},
	created() {
		//console.log(1);
		this.outerParams.platformId=this.ebayPlatformId;
		if (this.sellerId && this.siteId) {
			this.outerParams.siteId=this.siteId;
			this.outerParams.sellerId=this.sellerId;
		}
	},
	watch:{
		sellerData() {
			if (this.sellerId && this.siteId) {
				this.outerParams.siteId=this.siteId;
				this.outerParams.sellerId=this.sellerId;
			}
		}
	}
};
</script>

<style scoped lang="less">

</style>
