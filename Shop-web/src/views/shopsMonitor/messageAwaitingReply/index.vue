<template>
	<div>
		<div v-if='$route.name==="messageAwaitingReply"'>
			<MainLayout
				:outerParams="outerParams"
				:edits="edits"
				:searchFields="searchFields"
				:editBtns="editBtns"
				:columns="columns"
				:searchFunc='searchFunc'		
				:showWdg = 'false'
				:outSearchData="searchData"
				:initialParmas="initialParmas"
				url="homeCusMsgList"
				ref="layout"
			></MainLayout>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		created(){
			if(this.$route.query){
				this.searchData.readFlag = this.$route.query.readFlag
				this.initialParmas.readFlag = this.$route.query.readFlag
			}
		},
		data(){
			let vm = this
			return{
				searchData:{
				    readFlag: vm.$route.query.readFlag || null
				},
				initialParmas: {
					readFlag: vm.$route.query.readFlag || null
				},
				edits:[
					// {
					//     name: "查看内容",
					//     icon: "el-icon-search",
					// 	fn: scope => {
					// 	    vm.$refs.layout.$dialog({
					// 	      title:'邮件内容',
					// 	      width:'1000px',
					// 	      params:{
					// 			id:scope.row.id,
					// 			isShow:scope.row.status == 0 || scope.row.status == 3 ? true : false
					// 	      },
					// 	      component: () => import("./common/mailDialog.vue"),
					// 		  cancelBtnText:scope.row.status == 0 || scope.row.status == 3 ? '不需要回复' : null,
					// 		  okBtnText:scope.row.status == 0 || scope.row.status == 3 ? '发送' : null
					// 	    });
					// 	},
					// 	
					// },
				],
				searchFields:[
					{
						label:'最新发件时间',
						name:'time',
						type:'dateRange',
						labelWidth: '85px',
						pickerOptions:{
							disabledDate(time) {
								return  time.getTime() > Date.now() - 15 * 3600 * 1000
							}
						}
					},
					// {
					// 	label:'状态',
					// 	name:'status',
					// 	type:'select',
					// 	placeholder:'请选择状态',
					// 	options:[
					// 		{label:'待回复',value:0},
					// 		{label:'已回复',value:1},
					// 		{label:'回复中',value:2},
					// 		{label:'回复失败',value:3},
					// 	]
					// },
					{
						label:'读取状态',
						name:'readFlag',
						type:'select',
						placeholder:'请选择状态',
						options:[
							{label:'未读',value:0},
							{label:'已读',value:1},
						]
					},
				],
				editBtns:[
					{
						name:'导出',
						showLoading:true,
						fn: ()=>{
							let data = vm.getSelection().map(el=>el.id)
							return vm.exportMethod(data)
						}
					},
					{
						name:'标记已读',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let data = vm.getSelection().map(el=>el.id)
							vm.isReadMethod(data,1)
						}
					},
					{
						name:'标记未读',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let data = vm.getSelection().map(el=>el.id)
							vm.isReadMethod(data,0)
						}
					},
					{
						name:'标记无需回复',
						fn: ()=>{
							vm.signMethod()
							
							//vm.method123()
							
							//test
							// vm.$refs.layout.$dialog({
							// 	title:'练习的blockly弹窗',
							// 	width:'1200px',
							// 	top:'10vh',
							// 	component:() => import('Views/shopsMonitor/messageAwaitingReply/common/testDemo/demo4.vue'),
							// 	okBtnText:'保存',
							// 	cancelBtnText:'取消',
							// 	showMaxBtn: true,
							// })
						},
					}
				],
				columns:[
					{
						label:'最新发件时间',
						sortable:"custom",
						value:'lastMsgDate',
						minWidth:140,	
					},
					{
						label:'发件人',
						value:'buyerName',
						minWidth:100,	
					},
					{
						label:'主题',
						value:'subject',
						minWidth:150,
						render(h, scope) {
							let { subject } = scope.row
							return subject ? (
							  <el-tooltip open-delay={300} content={subject} placement="top">
								<span class="fix__row_1">{subject}</span>
							  </el-tooltip>
							) : (
							  <span>-</span>
							)
						}
					},
					// {
					// 	label:'关联订单编号',
					// 	value:'orderCnt',
					// 	minWidth:150,
					// 	render(h, scope) {
					// 	  let orderCnt = scope.row.orderCnt
					// 	  return orderCnt ? (
					// 	    <el-button
					// 	      type="text"
					// 	      onClick={() => {
					// 	        vm.$refs.layout.$dialog({
					// 	          title: "关联订单编号",
					// 	          size:"small",
					// 	          params: {
					// 				list:scope.row.orderIdList
					// 	          },
					// 	          component: () => import("./common/associatedDialog.vue")
					// 	        });
					// 	      }}
					// 	    >
					// 	      {scope.row.orderCnt}
					// 	    </el-button>
					// 	  ) : (
					// 		<span style="color: #377EA8;">{scope.row.orderCnt}</span>
					// 	  )
					// 	}
					// },
					// {
					// 	label:'状态',
					// 	value:'status',
					// 	minWidth:100,
					// 	enum:{
					// 		0:'待回复',
					// 		1:'已回复',
					// 		2:'回复中',
					// 		3:'回复失败'
					// 	}
					// },
					{
						label:'状态',
						value:'readFlag',
						minWidth:100,
						enum:{
							0:'未读',
							1:'已读',
						}
					},
					{
						label:'操作',
						align:'left',
						render(h,scope){
							return scope.row.status != 1 && scope.row.status != 2 ? (
								  <el-button
								    type="primary"
									size="small"
									plain
									style="padding:9px 15px"
								    onClick={() => {
								      vm.signMethod()
								    }}
								  >标记无需回复</el-button>
							) : (
								<span></span>
							)
						}
					},
				]
			}
		},
		methods:{
			method123() {
				let regData = {
					"code": 0,
					"total": 10,
					"success": 5,
					"fail": 3,
					"ignore": 2,
					"failMsgList": ["品牌编号:75284261 同一品牌拥有多个编号时不能设置全部类目","品牌编号:75284261 同一品牌拥有多个编号时不能设置全部类目","品牌编号:75284261 同一品牌拥有多个编号时不能设置全部类目"],				
					"ignoreMsgList": ["品牌编号:75284261 同一品牌拥有多个编号时不能设置全部类目","品牌编号:75284261 同一品牌拥有多个编号时不能设置全部类目"]
				}
				let msg = `<span>共处理: ${regData.total}条 , <span style="color:#67C23A">成功: ${regData.success}条</span> , <span style="color:#F56C6C">失败: ${regData.fail}条</span> , <span style="color:#409EFF">忽略: ${regData.ignore}条 ! </span></span>`
				this.$message({
				  type: "success",
				  dangerouslyUseHTMLString: true,
				  message:msg
				});
				let str = ''
				if(regData.failMsgList && regData.failMsgList.length){
					str = `<p style="font-weight: bold;">失败原因:</p>`
					regData.failMsgList.forEach((e)=>{
						str += e+'<br/>'
					})
					if(regData.ignoreMsgList && regData.ignoreMsgList.length) str += '<br/>'
				}
				if(regData.ignoreMsgList && regData.ignoreMsgList.length){
					str += `<p style="font-weight: bold;">忽略原因:</p>`
					regData.ignoreMsgList.forEach((e)=>{
						str += e+'<br/>'
					})
				}
				this.$notify({
				  type: "error",
				  dangerouslyUseHTMLString: true,
				  message:str
				}); 
			},
			exportMethod(data){
				let params = {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					status:this.$refs.layout.searchTrueData.status,
					startTime:this.$refs.layout.searchTrueData.startTime,
					endTime:this.$refs.layout.searchTrueData.endTime,
					ids:data && data.length ? data : null
				}
				return this.$api['homeCusMsgExport'](params).then((res)=>{
					downloadFile(
					  res,
					  '客户消息' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
					)
				})
			},
			searchFunc(data) {
			  let { time, ...info } = data;
			  let [startTime, endTime] = time || [];
			  return { startTime, endTime, ...info };
			},
			signMethod(){
				this.$confirm(`此操作将标记为不需要回复,是否继续`,'提示',{type:'warning'}).then(()=>{
					let params = {
						platformId:this.platformId,
						siteId:this.siteId,
						sellerId:this.sellerId,
					}
					this.$api['homeCusMsgHandleMsg'](params).then(()=>{
						this.$refs.layout.getList()
					})
				}).catch(()=>{})			
			},
			isReadMethod(data,type){
				let params = {...this.outerParams,readFlag:type,ids:data}
				this.$confirm(`此操作将标记${type?'已读':'未读'},是否继续`,'提示',{type:'warning'}).then(()=>{
					this.$api['homeCusMsgMarkRead'](params).then(()=>{
						this.getLayoutList()
					})
				}).catch(()=>{})		
			}
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
		watch:{
			
		}
	}
</script>

