<template>
	<div>
		<div v-if="$route.name==='ebayAuctionProductRanking'">
			<MainLayout
			    :outerParams="outerParams"
			    :edits="edits"
			    :searchFields="searchFields"
			    :editBtns="editBtns"
			    :columns="columns"
			    :searchFunc="searchFunc"
			    @selectChange='selectChange'
			    ref="layout"
			    url="ebTaskAuctionRankList"
			    >  
			</MainLayout> 
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				columns:[
					{
						label:'关键词',
						value:'keyword',
					},
					{
						label:'抓取页数',
						value:'searchPages',
					},
					{
						label:'监控状态',
						value:'monitorFlag',
						render(h,scope){
							let {monitorFlag} = scope.row
							return monitorFlag ? (
								<span>开启监控</span>
							) : (
								<span>关闭监控</span>							
							)
						}
					},
					{
						label:'监控周期',
						render(h, scope) {
							if(scope.row.monitorFrom&&scope.row.monitorTo){
								let monitorFrom  = scope.row.monitorFrom.split(' ')[0]
								let  monitorTo  = scope.row.monitorTo.split(' ')[0]
								return monitorFrom&&monitorTo ? (
									<span class="fix__row_2">{monitorFrom}-{monitorTo}</span>
								) : (
								  <span>-</span>
								)
							}else{
								return <span>-</span>
							}							
						}
					},
					{
						label:'抓取频率',
						value:'frequency',
					},
					{
						label:'创建时间',
						value:'createTime',
					},
					{
						label:'抓取状态',
						value:'status',
						render(h,scope) {
							let {status} = scope.row
							return status===0 ? (
								<span>待处理</span>
							) : status===1 ? (
								<span>处理中</span>
							) : status===2 ? (
								<span>处理成功</span>
							) : status===3 ? (
								<span>处理失败</span>
							) : status===4 ? (
								<span>页面不存在</span>
							) : status===5 ? (
								<span>大数据分析失败</span>
							) : (
								<span>kafka连接异常</span>
							)
						}
					},
					{
						label:'结果生成时间',
						value:'resultTime',
					},
				],
				editBtns:[
					{
						name:'添加任务',
						fn:()=>{
							this.$refs.layout.$dialog({
                                title: "添加任务",
                                size:'small',
                                params: {siteId:this.siteId,sellerId:this.sellerId,platformId:this.ebayPlatformId},
                                component: () => import('./common/addDialog.vue'),
                                okBtnText: "确认",
                                cancelBtnText: "取消"
                            });
						}
					},
					{
						name:'停止监控',
						fn:()=>{
							this.stopBtn()
						}
					},
					{
						name:'开启监控',
						fn:()=>{
							if (this.selectList.length>0) {
								this.$refs.layout.$dialog({
								    title: "开启监控",
								    size:'small',
								    params: {isControl:true,taskIds:this.selectList,siteId:this.siteId,sellerId:this.sellerId,platformId:this.ebayPlatformId},
								    component: () => import('./common/addDialog.vue'),
								    okBtnText: "确认",
								    cancelBtnText: "取消"
								});
							}else{
								this.$message.warning('请至少选择一项')
							}
							
						}
					},
					{
						name:'修改监控周期',
						fn:()=>{
							if (this.selectList.length>0) {
								this.$refs.layout.$dialog({
								    title: "修改监控周期",
								    size:'small',
								    params: {isControl:true,editControl:true,taskIds:this.selectList,siteId:this.siteId,sellerId:this.sellerId,platformId:this.ebayPlatformId},
								    component: () => import('./common/addDialog.vue'),
								    okBtnText: "确认",
								    cancelBtnText: "取消"
								});
							}else{
								this.$message.warning('请至少选择一项')
							}
							
						}
					},
					{
						name:'删除',
						fn:()=>{
							this.stopBtn('del')
						}
					},
				],
				edits: [
                    {
                      name: "查看详情",
                      icon: "el-icon-search",
                      show: scope => {
                        return scope.row.status===2;
                      },
                      fn: scope => {
                        return this.$router.push({
                          name: "ebayAuctionProductDetail",
                          query:{taskId:scope.row.taskId}
                        });
                      }
                    },
                ],
				searchFields:[
                    {
                        label: "关键词",
                        name: "keyword",
                        type: "input",
                        placeholder:'请输入关键词'
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
                        options: [
                            {label: "抓取中",value: 1 },
                            {label: "抓取成功",value: 2},
                            {label: "抓取失败",value: 3},
                        ]
                    },
                    {
                        label: "添加时间",
                        name: "time",
						type: "dateRange",
						width:300,
                        placeholder:'请选择'
                    },
				],
				selectList:[],
			}
		},
		methods:{
			searchFunc(data){
				let {time,...info}=data;
				let [startTime,endTime]=time || [];
				return {startTime,endTime,...info};
			},
			selectChange(v){
				this.selectList = [];
				v.forEach(i => {
				  this.selectList.push(i.taskId)
				});
			},
			stopBtn(e) {
				if (this.selectList.length === 0) {
				  this.$message({
					message: "请至少选择一项",
					type: "warning"
				  });
				  return;
				}
				this.$api[e==='del'?'ebTaskAuctionRankRemove':"ebTaskAuctionRankCancelMonitor"]({
				  taskIds:this.selectList
				})
				  .then(data => {
					if (data.code === 0) {
					  this.$refs.layout.getList();
					}
				  })
				  .catch(() => {});
			},
		},
		computed: {
			outerParams(){
				return {
					platformId:this.ebayPlatformId,
					siteId:this.siteId,
					sellerId:this.sellerId
				}
			},
		},
	}
</script>

<style>
</style>
