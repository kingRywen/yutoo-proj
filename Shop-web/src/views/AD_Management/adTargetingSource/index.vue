<template>
	<div>
		<div v-if='$route.name==="adTargetingSource"'>
			<MainLayout
				:outerParams="outerParams"
				:edits="edits"
				:searchFields="searchFields"
				:editBtns="editBtns"
				:columns="columns"
				:searchFunc='searchFunc'		
				url="adSourcePositionList"
				ref="layout"
			></MainLayout>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	export default{
		data(){
			let vm = this
			return{
				edits:[
					{
					    name: "查看",
					    icon: "el-icon-search",
						show:scope=>{
							return scope.row.status === 2
						},
						fn: scope => {
						    vm.$router.push({
								name:'adTargetingSourceDetail',
								query:{
									parentTaskId:scope.row.taskId
								}
							})
						},					
					},
					{
					    name: "删除",
					    icon: "el-icon-delete",
						fn: scope => {
						    let data = [scope.row.taskId]
						    vm.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
						    	vm.$api['adSourcePositionRemove']({taskIds:data}).then(()=>{
						    		vm.getLayoutList()
						    	})
						    }).catch(()=>{})
						},					
					},
				],
				searchFields:[
					{
						label:'任务名称',
						name:'searchName',
						type:'input',
						labelWidth:'60px',
						placeholder:'请输入任务名称',
					},
					{
						label:'抓取状态',
						name:'status',
						type:'select',
						placeholder:'请选择状态',
						options:[
							{label:'处理中',value:1},
							{label:'处理成功',value:2},
							{label:'处理失败',value:3},
						]
					},
					{
						label:'添加时间',
						name:'time',
						type:'dateRange',
						labelWidth: '85px',
						pickerOptions:{
							disabledDate(time) {
								return  time.getTime() > Date.now()	//中国时间
								//return  time.getTime() > Date.now() - 15 * 3600 * 1000  //太平洋时间
							}
						}
					},
					
				],
				editBtns:[
					{
						name:'添加任务',
						fn: ()=>{
							vm.$refs.layout.$dialog({
							  title:'添加任务',
							  width:'500px',
							  params:{
							  	parentTaskId:0
							  },
							  component: () => import("./dialog/add.vue"),
							  cancelBtnText:'取消',
							  okBtnText:'确认'
							});
						}
					},
					{
						name:'删除',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let data = vm.getSelection().map(el=>el.taskId)
							vm.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
								vm.$api['adSourcePositionRemove']({taskIds:data}).then(()=>{
									vm.getLayoutList()
								})
							}).catch(()=>{})
						}
					},
					{
						name:'重新抓取',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let data = vm.getSelection().map(el=>el.taskId)
							vm.$confirm('此操作将重新抓取,是否继续','提示',{type:'warning'}).then(()=>{
								vm.$api['adSourcePositionReCrawl']({taskIds:data}).then(()=>{
									vm.getLayoutList()
								})
							}).catch(()=>{})
						}
					},
				],
				columns:[
					{
						label:'任务名称',
						value:'taskName',
						minWidth:140,	
					},
					{
						label:'数据类型',
						value:'dataType',
						minWidth:100,
						enum:{
							0:'产品ASIN',
							1:'关键词',
							2:'类目',
							3:'TOP100链接',
						}
					},
					{
						label:'链接数量',
						value:'dataSources',
						minWidth:150,
						render(h, scope) {
						  let dataSources = scope.row.dataSources						  
						  return dataSources && dataSources.length ? (
						    <el-button
						      type="text"
						      onClick={() => {
								let dataType = scope.row.dataType
						        vm.$refs.layout.$dialog({
						          title: "数据源",
						          size:"small",
						          params: {
									dataType:dataType,
									list:dataSources,
									searchPages:scope.row.searchPages
						          },
						          component: () => import("./dialog/table.vue")
						        });
						      }}
						    >
						      {scope.row.dataSources.length}
						    </el-button>
						  ) : (
							<span style="color: #377EA8;">-</span>
						  )
						}
					},
					{
						label:'添加时间',
						value:'createTime',
						minWidth:150,
					},
					
					{
						label:'状态',
						value:'status',
						minWidth:100,
						enum:{
							0:'待处理',
							1:'处理中',
							2:'处理成功',
							'>2':'处理失败',
						}
					},
					{
						label:'结果生成时间',
						value:'resultTime',
						minWidth:150,
					},
					
				]
			}
		},
		methods:{						
			searchFunc(data) {
			  let { time, ...info } = data;
			  let [startTime, endTime] = time || [];
			  return { startTime, endTime, ...info };
			},			
		},
		computed: {
			outerParams(){
				return {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					parentTaskId:0
				}
			},
		},
		watch:{
			
		}
	}
</script>

