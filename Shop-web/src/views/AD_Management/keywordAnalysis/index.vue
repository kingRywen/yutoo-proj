<template>
	<div>
		<div v-if='$route.name==="keywordAnalysis"'>
			<MainLayout
				:outerParams="outerParams"
				:edits="edits"
				:searchFields="searchFields"
				:editBtns="editBtns"
				:columns="columns"
				:searchFunc='searchFunc'
				url="adKeywordAnalysisList"
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
						name:'查看',
						icon: "el-icon-search",
						show:(scope)=>{
							return scope.row.status == 2
						},
						fn: (scope) => {
							vm.$router.push({
								name:'keywordAnalysisDetail',
								query:{
									taskId:scope.row.taskId,
								}
							})
						}
					},
					{
						name:'重新抓取',
						icon: "el-icon-refresh",
						show:(scope)=>{
							return scope.row.status == 3
						},
						fn: (scope) => {
							let taskIds = [scope.row.taskId]
							vm.$confirm('此操作将重新抓取,是否继续','提示',{type:'warning'}).then(()=>{
								vm.$api['adKeywordAnalysisReCrawl'](taskIds).then(()=>{
									vm.getLayoutList()
								})
							}).catch(()=>{})							
						}
					}
				],
				searchFields:[
					{
						label:'关键词名称',
						name:'keyword',
						type:'input',
						placeholder:'请输入关键词名称',
						labelWidth:'75px'
					},
					{
						name:'status',
						type:'select',
						placeholder:'选择状态',
						options:[
							{label:'处理中',value:1},
							{label:'处理成功',value:2},
							{label:'处理失败',value:3},
						]
					},
					{
						label:'创建时间',
						name:'time',
						type:'dateRange',
						labelWidth: '60px',
						pickerOptions:{
							disabledDate(time) {
								return  time.getTime() > Date.now() - 15 * 3600 * 1000
							}
						}
					},
				],
				editBtns:[
					{
						name:'添加任务',
						// disabled: selection => {
						//   return selection.length == 0
						// },
						fn: scope => {
							// let keyword = []
							// let data = vm.getSelection()
							// for(var i=0;i<data.length;i++){
							// 	if(data[i].keywords && data[i].keywords.length){
							// 		for(var j=0;j<data[i].keywords.length;j++){
							// 			keyword.push(data[i].keywords[j])
							// 		}
							// 	}
							// }
						    vm.$refs.layout.$dialog({
						      title:'添加任务',
						      width:'600px',
						      params:{
								// data:keyword,
								outerParams:vm.outerParams
						      },
						      component: () => import("./dialog/add.vue"),
							  cancelBtnText:'取消',
							  okBtnText:'确认'
						    });
						},
					},
					{
						name:'删除',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let taskIds = vm.getSelection().map(el=>el.taskId)
							vm.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
								vm.$api['adKeywordAnalysisRemove']({taskIds:taskIds}).then(()=>{
									vm.getLayoutList()
								})
							}).catch(()=>{})
						}
					}
				],
				columns:[
					{
						label:'任务名称',
						value:'taskName'
					},
					{
						label:'关键词数量',
						value:'keywords',
						minWidth:150,
						render(h, scope) {
						  let keywords = scope.row.keywords
						  return keywords && keywords.length ? (
						    <el-button
						      type="text"
						      onClick={() => {
						        vm.$refs.layout.$dialog({
						          title: "数据源",
						          size:"small",
						          params: {
									list:keywords
						          },
						          component: () => import("./dialog/table.vue")
						        });
						      }}
						    >
						      {keywords.length}
						    </el-button>
						  ) : (
							<span style="color: #377EA8;">0</span>
						  )
						}
					},
					{
						label:'状态',
						value:'status',
						minWidth:100,
						enum:{
							1:'抓取中',
							2:'抓取成功',
							3:'抓取失败'
						}
					},
					{
						label:'创建时间',
						value:'createTime',
						minWidth:140,	
					},
					{
						label:'结果生成时间',
						value:'resultTime',
						minWidth:140,	
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
				}
			},
		},
	}
</script>

