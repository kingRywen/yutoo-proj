<template>
	<div>
		<div v-if='$route.name==="ebayDealStatistics"'>
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
				url="ebTaskSalesStatList"
				>  

				<!-- <div slot="left">123</div> -->
			</MainLayout> 
		</div>
		<router-view v-else></router-view>
	</div>
</template>
<script>
import dayjs from 'dayjs';
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
                        label: "任务名称",
                        name: "taskName",
                        type: "input",
                        placeholder:'请输入任务名称'
					},
					{
                        label: "数据类型",
                        name: "dataType",
						type: "select",
						placeholder:'请选择数据类型',
						options:[
                            { label: "产品链接",value: 0 },
                            { label: "关键词",value: 1 },
                            { label: "类目链接",value: 2 },
                            { label: "店铺链接",value: 3 },
                        ]
					},
					{
                        label: "链接",
                        name: "dataSource",
                        type: "input",
                        placeholder:'请输入链接',
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
                        label: "创建时间",
                        name: "time",
						type: "dateRange",
						width:300,
						placeholder:'请选择',
                    },
				],
			//表格头部操作按钮
                editBtns:[
                    {
                        name: "添加任务",
                        fn: () => {
                            this.$refs.layout.$dialog({
                                title: "添加任务",
                                width:'500px',
                                params: {taskFlag:0,siteId:this.outerParams.siteId,sellerId:this.outerParams.sellerId},
                               component: () => import('./addTaskDialog.vue'),
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

				],
			//columns表格
                columns: [
					{
                        label: "任务名称",
                        value: "taskName",
                        minWidth: 150,
					},
					{
                        label: "数据类型",
                        value: "dataType",
                        enum:{
							0:'产品链接',
							1:'关键词',
							2:':类目链接',
							3:'店铺链接',
						}
					},
					{
                        label: "抓取源",
                        value: "dataSources",
                        minWidth: 150,
                        render(h,scope){
                           return (
                               <el-button type='text' onClick={()=>vm.lookDataSources(scope)}>{scope.row.dataSources.length}</el-button>
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
                        label: "创建时间",
                        value: "createTime",
                        minWidth: 150
					},
					{
                        label: "结果生成时间",
                        value: "resultTime",
                        minWidth: 150
					},
				],
			//外部参数
                outerParams: {
                    siteId: null,
					sellerId: null,
					platformId:null,
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
		//查看详情
			lookDatsils(v){
				console.log(v);
				this.$router.push({
					path:"/ebayOrderToOptimize/ebayDealStatistics/datails",
					query:{
						name:v.taskName,
						taskId:v.taskId
					}
				})
			},
		//查看抓取源
			lookDataSources(scope){
				this.$refs.layout.$dialog({
					title: "数据源",
					size:"medium",
					params: {
						datas:scope.row.dataSources, 
						categoryUrl:scope.row.categoryUrl,
						searchPages:scope.row.searchPages,
						dataType:scope.row.dataType
					},
					component: () => import('./dataSourceDialog.vue'),
					// okBtnText: "确认",
					// cancelBtnText: "取消"
				});
			},
		//重新抓取
			refetchOneData(v){
				this.$api['ebTaskSalesStatReExecute']({
					ids:v,
					siteId :this.outerParams.siteId,
					sellerId :this.outerParams.sellerId,
				})
				.then(data => {
					this.$refs.layout.getList();
				}).catch(() => {})
			},
		//搜索条件的处理
			searchFunc(data){
				let {time,...info}=data;
				let [startTime,endTime]=time || [];
				return {startTime,endTime,...info};
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
					this.$api['ebTaskSalesStatBatchRemove']({
						ids:this.slectIds,
						siteId :this.outerParams.siteId,
						sellerId :this.outerParams.sellerId,
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
