<template>
	<div>
		<MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			ref="layout"
			url="homePerformanceNoticeLsit"
		></MainLayout>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			let vm = this
			return{
				edits:[],
				searchFields:[
					{
						label:'预警时间',
						name:'warningTime',
						type:'dateRange',
					},
					{
						label:'状态',
						name:'status',
						type:'select',
						placeholder:'请选择状态',
						options:[
							{label:'未读',value:0},
							{label:'已读',value:1}
						]
					},
				],
				editBtns:[
					{
						name:'导出',
						showLoading:true,
						fn: ()=>{
							let titles = vm.getSelection().map(el=>el.title)
							vm.exportMethod(titles)
						}
					},
					{
						name:'标记为已读',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let titles = vm.getSelection().map(el=>el.title)
							vm.signMethod('read',titles)
						}
					},
					{
						name:'标记为未读',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let titles = vm.getSelection().map(el=>el.title)
							vm.signMethod('unread',titles)
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
							  <el-tooltip open-delay={300} content={subject} placement="top">
								<span class="fix__row_1">{subject}</span>
							  </el-tooltip>
							) : (
							  <span>-</span>
							)
						}
					},
					{
						label:'状态',
						value:'status',
						minWidth:100,
						render(h,scope){
							let status = scope.row.status
							return status ? (
								<span>已读</span>
							) : (
								<span>未读</span>
							)
						}
					},
					{
						label:'内容',
						value:'noticeBody',
						minWidth:150,
						render(h, scope) {
							let { noticeBody } = scope.row
							return noticeBody ? (
							  <el-tooltip open-delay={300} content={noticeBody} placement="top">
								<span class="fix__row_1">{noticeBody}</span>
							  </el-tooltip>
							) : (
							  <span>-</span>
							)
						}
					},
				]
			}
		},
		methods:{
			exportMethod(data){
				let params = {
					title:data
				}
				this.$api['xxx'](params).then((res)=>{
					downloadFile(
					  res,
					  '信用卡失效' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
					)
				})
			},
			signMethod(type,data){
				this.$confirm(`此操作将标记为${type==='read'?'已读':'未读'},是否继续`,'提示',{type:'warning'}).then(()=>{
					let params = {type:type,titles:data}
					switch(type){
						case 'read' :
							this.$api['xxx'](params).then(()=>{})
						break;
						case 'unread' : 
							this.$api['xxx'](params).then(()=>{})
						break;
					}
				}).catch(()=>{})			
			}
		},
		computed: {
			outerParams(){
				return {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					noticeType:0,
				}
			},
		},
		watch:{
			
		}
	}
</script>

<style>
</style>

