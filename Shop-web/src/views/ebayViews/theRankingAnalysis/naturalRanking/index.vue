<template>
	<div>
		<div v-if='$route.name==="ebayNaturalRanking" || $route.name==="ebayAdPlacement" '>
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
				url="ebTaskKrFqList"
				>  

				<!-- <div slot="left">123</div> -->
			</MainLayout> 
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
export default {
	data() {
		return {
			treeTable:false,
            treeTableOtions:{},
            searchData: {},
			//筛选条件的搜索
                searchFields:[
                    {
                        label: "关键词",
                        name: "keyword",
                        type: "input",
                        placeholder:'关键词'
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
                        placeholder:'请选择'
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
                                params: {taskFlag:this.outerParams.taskFlag,siteId:this.outerParams.siteId,sellerId:this.outerParams.sellerId},
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
                        label: "关键词",
                        value: "keyword",
                        minWidth: 150
                    },
					{
                        label: "产品类型",
                        value: "productType",
						minWidth: 150,
						enum:{
							0:'全部',
							1:'拍卖',
							2:'一口价',
						}
					},
					{
                        label: "抓取页数",
                        value: "searchPages",
                        minWidth: 150
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
							0:'关闭监控',
							1:'开启监控'
						}
					},
					{
                        label: "监控频率",
                        value: "frequency",
						minWidth: 150,
						render(h,scope){
							return (
								<span>{scope.row.frequency+'分钟'}</span>
							)
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
					taskFlag:null
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
		//查看详情
			lookDatsils(v){
				//console.log(v);
				let path=this.outerParams.taskFlag;
				if( !path){  //广告
					this.$router.push({ 
						path:"/ebayTheRankingAnalysis/ebayAdPlacement/rankingChangeProductNum",
						query:{
							name:v.keyword,
							taskId:v.taskId,
							createTime:v.createTime,
							taskFlag:0
						}
					})
				}else{
					this.$router.push({
						path:"/ebayTheRankingAnalysis/ebayNaturalRanking/rankingChangeProductNum",
						query:{
							name:v.keyword,
							taskId:v.taskId,
							createTime:v.createTime,
							taskFlag:1
						}
					})
				}
			},
		//重新抓取
			refetchOneData(v){
				this.$api['ebTaskKrFqReCrawl']({
					taskIds:[v]
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
				this.$api['ebTaskKrFqRemove']({
					taskIds:this.slectIds
				})
				.then(data => {
					this.$refs.layout.getList()
				}).catch(() => {})
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
					params: {taskIds:this.slectIds,url:"ebTaskKrFqAddMonitor"},
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
					params: {taskIds:this.slectIds,url:'ebTaskKrFqtUpdateMonitor'},
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
					params: {taskIds:[v],url:'ebTaskKrFqtUpdateMonitor',datas:data},
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
				this.$api['ebTaskKrFqRemoveMonitor']({
					taskIds:this.slectIds
				})
				.then(data => {
					this.$refs.layout.getList()
				}).catch(() => {})
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
		};

		if(this.$route.name==='ebayNaturalRanking'){  //自然
			this.outerParams.taskFlag=1;
		}else{
			this.outerParams.taskFlag=0;
		}
	},
	watch:{
		sellerData() {
			if (this.sellerId && this.siteId) {
				this.outerParams.siteId=this.siteId;
				this.outerParams.sellerId=this.sellerId;
			}
		},
		$route(){
			//console.log(this.$route.name);
			if(this.$route.name==='ebayNaturalRanking'){  //自然
				this.outerParams.taskFlag=1;
			}else{
				this.outerParams.taskFlag=0;
			}
		}
	}
};
</script>

<style scoped lang="less">

</style>
