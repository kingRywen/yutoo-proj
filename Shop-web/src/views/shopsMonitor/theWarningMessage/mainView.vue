<template>
	<div>
		<MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			:searchFunc='searchFunc'
			:outSearchData="searchData"
			ref="layout"
			url="homePerformanceNoticeLsit"
		></MainLayout>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	import dayjs from 'dayjs'
	export default{
		data(){
			let vm = this
			return{
				edits:[],
				searchFields:[],
				// searchData: {
				//   time: [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'),dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')]
				// },
				searchData: {
				  status: 0
				},
				searchFields1:[
					{label:'预警时间',labelWidth: '60px',name:'time',type:'dateRange',pickerOptions:{disabledDate(time) {return  time.getTime() > Date.now() - 15 * 3600 * 1000}}},
					{label:'状态',name:'status',type:'select',placeholder:'请选择状态',options:[{label:'未读',value:0},{label:'已读',value:1}]},					
				],
				searchFields3:[
					{label:'预警时间',labelWidth: '60px',name:'time',type:'dateRange',pickerOptions:{disabledDate(time) {return time.getTime() > Date.now() - 15 * 3600 * 1000}}},
					{label:'读取状态',name:'status',type:'select',placeholder:'请选择状态',options:[{label:'未读',value:0},{label:'已读',value:1}]},
					{label:'上架状态',name:'shelfStatus',type:'select',placeholder:'请选择状态',options:[{label:'未上架',value:0},{label:'已上架',value:1},{label:'上架中',value:2},{label:'上架失败',value:3}]},			
				],
				editBtns:[
					{
						name:'导出',
						showLoading:true,
						fn: ()=>{
							let noticeIds = vm.getSelection().map(el=>el.noticeId)
							return vm.exportMethod(noticeIds)
						}
					},
					{
						name:'上架',
						show:()=>{
							return vm.noticeType == 3
						},
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let noticeIds = vm.getSelection().map(el=>el.noticeId)
							vm.putAwayMethod(noticeIds)
						}
					},
					{
						name:'标记为已读',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let noticeIds = vm.getSelection().map(el=>el.noticeId)
							vm.signMethod(1,noticeIds)
						}
					},
					{
						name:'标记为未读',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let noticeIds = vm.getSelection().map(el=>el.noticeId)
							vm.signMethod(0,noticeIds)
						}
					},
				],
				columns:[
					{
						label:'预警时间',
						sortable:"custom",
						value:'noticeTime',
						minWidth:100,	
					},
					{
						label:'主题',
						value:'subject',
						minWidth:150,
						render(h, scope) {
							let { subject } = scope.row
							return subject ? (
							  <el-tooltip open-delay={300} content={subject} placement="top" effect="light">
								<span class="fix__row_1">{subject}</span>
							  </el-tooltip>
							) : (
							  <span>-</span>
							)
						}
					},
					// {
					// 	label:'关联ASIN',
					// 	value:'asin',
					// 	minWidth:100,
					// 	url:'productUrl',
					// 	isShow:true,
					// },
					// {
					// 	label:'关联SKU',
					// 	value:'sku',
					// 	minWidth:100,
					// 	isShow:true,
					// 	render(h, scope) {
					// 		let { sku } = scope.row
					// 		return sku ? (
					// 		  <el-tooltip open-delay={300} content={sku} placement="top" effect="light">
					// 			<span class="fix__row_1">{sku}</span>
					// 		  </el-tooltip>
					// 		) : (
					// 		  <span>-</span>
					// 		)
					// 	}
					// },
					// {
					// 	label:'主图',
					// 	value:'img',
					// 	img:true,
					// 	isShow:true,
					// },
					{
					    label: '读取状态',
					    value: 'status',
					    enum: {
						    1: '已读',
						    0: '未读'
					    },
					    isShow:true,
					},
					{
					    label: '上架状态',
					    value: 'shelfStatus',
					    enum: {
						    0: '未上架',
						    1: '已上架',
							2: '上架中',
							3: '上架失败',
					    },
					    isShow:true,
					},
					// {
					//   label:'关联产品数量',
					//   value: "productCnt",
					//   minWidth:140,
					//   isShow:true,
					//   render(h,scope){
					//       return(
					// 		  <el-button
					// 			type="text"
					// 			style='color: #108ee9;'
					// 			onClick={() => {
					// 			  vm.$refs.layout.$dialog({
					// 			    title:'产品详情',
					// 			    width:'800px',
					// 			    params:{
					// 					data:scope.row.productList
					// 			    },
					// 			    component: () => import("./commonDialog/tableDialog.vue"),
					// 			  });
					// 			}}
					// 		  >{scope.row.productCnt}</el-button>
					//       )
					//   }
					// },
					{
						label: '状态',
						value: 'status',
						enum: {
							1: '已读',
							0: '未读'
						},
						isShow:true,
					},
					// {
					// 	label:'内容',
					// 	value:'noticeBody',
					// 	showTooltip:true,
					// 	minWidth:150,
					// 	render(h, scope) {
					// 		let { noticeBody } = scope.row
					// 		return noticeBody ? (
					// 		  <el-tooltip open-delay={300} content={noticeBody} placement="top" effect="light">
					// 			<span class="fix__row_1">{noticeBody}</span>
					// 		  </el-tooltip>
					// 		) : (
					// 		  <span>-</span>
					// 		)
					// 	}
					// },
				]
			}
		},
		methods:{
			putAwayMethod(data){			
				this.$confirm(`此操作将上架,是否继续`,'提示',{type:'warning'}).then(()=>{
					let params = {platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId,noticeIds:data}
					this.$api['homePerformanceSelfNotice'](params).then((res)=>{
						this.$refs.layout.getList()
					})
				}).catch(()=>{})
			},
			searchFunc(data) {
			  let { time, ...info } = data;
			  let [startTime, endTime] = time || [];
			  return { startTime, endTime, ...info };
			},
			exportMethod(data){
				let params = {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					noticeType:this.noticeType,
					status:this.$refs.layout.searchTrueData.status,
					shelfStatus:this.$refs.layout.searchTrueData.shelfStatus,
					startTime:this.$refs.layout.searchTrueData.startTime,
					endTime:this.$refs.layout.searchTrueData.endTime,
					searchText:this.$refs.layout.searchTrueData.searchText,
					noticeIds:data.length?data:null
				}
				return this.$api['homePerformanceExportNotice'](params).then((res)=>{
					downloadFile(
					  res,
					  '预警消息' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
					)
				})
			},
			signMethod(type,data){
				this.$confirm(`此操作将标记为${type==1?'已读':'未读'},是否继续`,'提示',{type:'warning'}).then(()=>{
					let params = {platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId,status:type,noticeIds:data,noticeType:this.noticeType}
					this.$api['homePerformanceHandleNotice'](params).then((res)=>{
						this.$refs.layout.getList()
					})
				}).catch(()=>{})			
			},
			getView(name){
				this.$refs.layout.tableList = []
				let show2,show3,show4
				switch(name){					
					case 'first':
					this.searchFields = this.searchFields1
					show2=false;show3=false;show4=true
					break;
					case 'second':
					this.searchFields = this.searchFields1
					show2=false;show3=false;show4=true
					break;
					case 'three':
					this.searchFields = this.searchFields1
					show2=false;show3=false;show4=true
					break;
					case 'four':
					this.searchFields = this.searchFields3
					show2=true;show3=true;show4=false
					break;
					case 'five':
					this.searchFields = this.searchFields1
					show2=false;show3=false;show4=true
					break;
					case 'six':
					this.searchFields = this.searchFields1
					show2=false;show3=false;show4=true
					break;
					case 'seven':
					this.searchFields = this.searchFields1
					show2=false;show3=false;show4=true
					break;
				}
				this.columns[2].isShow = !show2
				this.columns[3].isShow = !show3
				this.columns[4].isShow = !show4
			},
		},
		computed: {
			outerParams(){
				return {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					noticeType:this.noticeType,
				}
			},
			noticeType(){
				let name = this.$parent.activeName
				return name === 'first' ? 0
				: name === 'second' ? 1
				: name === 'three' ? 2
				: name === 'four' ? 3
				: name === 'five' ? 4
				: name === 'six' ? 5
				: 6
			}
		},
		mounted(){		
			this.$nextTick(()=>{
				this.getView(this.$parent.activeName)
			})			
		}
	}
</script>

<style>
</style>

