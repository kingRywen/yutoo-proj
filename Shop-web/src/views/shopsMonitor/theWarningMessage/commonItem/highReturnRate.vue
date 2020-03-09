<template>
	<div>
		<MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			:outerTableList='outerTableList'
			ref="layout"
		></MainLayout>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			let vm = this
			return{
				outerTableList:[
					{
						time:'2018.09.10-2019.06.18',
						title:'Amazon Seller Account Protection',
						asin:'BISLWOSFT',
						sku:'0000',
						image:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1718395925,3485808025&fm=27&gp=0.jpg',
						status:1,
						content:'Amazon Seller Account Protection Amazon Seller Account Protection Amazon Seller Account Protection Amazon Seller Account Protection Amazon Seller Account Protection Amazon Seller Account Protection',
					}
				],
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
					{
						label:'ASIN',
						name:'asin',
						type:'input',
						placeholder:'请输入ASIN或SKU',
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
						name:'上架',
						disabled: selection => {
						  return selection.length == 0
						},
						fn: ()=>{
							let titles = vm.getSelection().map(el=>el.title)
							vm.signMethod('read',titles)
						}
					},
				],
				columns:[
					{
						label:'预警时间',
						sortable:"custom",
						value:'time',
						minWidth:100,	
					},
					{
						label:'主题',
						value:'title',
						minWidth:150,
						render(h, scope) {
							let { title } = scope.row
							return title ? (
							  <el-tooltip open-delay={300} content={title} placement="top">
								<span class="fix__row_1">{title}</span>
							  </el-tooltip>
							) : (
							  <span>-</span>
							)
						}
					},
					{
					  label:'关联ASIN/SKU',
					  showLabel:true,
					  value: "asin",
					  toggle:['asin','sku'],
					  minWidth:140,
					  render(h,scope,a,b){
					      return(
							  <el-button
								type="text"
								style='color: #108ee9;'
								onClick={() => {
								  vm.$refs.layout.$dialog({
								    title:'产品详情',
								    width:'800px',
								    params:{
										asin:scope.row.asin,
										sku:scope.row.sku,
								    },
								    component: () => import("../commonDialog/tableDialog.vue"),
								  });
								}}
							  >{b}</el-button>
					      )
					  }
					},
					{
						label:'主图',
						value:'image',
						img:true,
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
						value:'content',
						minWidth:150,
						render(h, scope) {
							let { content } = scope.row
							return content ? (
							  <el-tooltip open-delay={300} content={content} placement="top">
								<span class="fix__row_1">{content}</span>
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
					  '政策违规' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
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
				}
			},
		},
		watch:{
			
		}
	}
</script>

<style>
</style>

