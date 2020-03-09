<template>
	<div>
		<MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			:searchFunc='searchFunc'
			ref="layout"
			url="taskSaleSellerListTask"
		></MainLayout>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			var vm = this
			return{
				edits:[
					{
						name:'查看',
						icon: "el-icon-search",
						show:(scope)=>{
							return scope.row.status == 2
						},
						fn: (scope) => {
							let siteOption = 0
							let type = scope.row.shippingCountries.some(el=>{return el==='CA(加拿大)'})
							if(type){
								siteOption = 2
							}else{
								siteOption = 1
							}
							vm.$router.push({
								name:'dataCaptureDetail',
								query:{
									taskId:scope.row.taskId,
									siteId:vm.outerParams.siteId,
									siteOption:siteOption,
									moneyType:vm.moneyType
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
							let data = [scope.row.taskId]
							vm.confirmMethod('grab',data)
						}
					}
				],
				searchFields:[
					{
						label:'任务名称',
						name:'taskName',
						type:'input',
						placeholder:'请输入任务名称',
						labelWidth: '60px',
					},
					{
						label:'店铺ID',
						name:'sellerId',
						type:'input',
						placeholder:'请输入店铺ID',
					},
					{
						label:'抓取状态',
						name:'status',
						type:'select',
						placeholder:'请选择抓取状态',
						options:[
							{label:'处理中',value:1},
							{label:'处理成功',value:2},
							{label:'处理失败',value:3},
						]
					},
					{
						label:'站点',
						name:'sellerSiteId',
						type:'select',
						placeholder:'请选择店铺所属站点',
						options:vm.getCountry,
					},
					{
						label:'时间',
						name:'time',
						type:'dateRange',
						labelWidth: '60px',
					},
					
					
				],
				editBtns:[				
					{
						name:'添加任务',
						fn: ()=>{
							vm.$refs.layout.$dialog({
							  title:'添加任务',
							  width:'600px',
							  params:{
								siteId:this.outerParams.siteId
							  },
							  component: () => import("../dialog/addTaskStore.vue"),
							  okBtnText:'确认添加',
							  cancelBtnText:'取消'
							});
						}
					},
					{
						name:'删除',
						disabled: selection => {
							return selection.length == 0
						},
						fn: ()=>{
							let data = vm.getSelection().map(e=>e.taskId)
							vm.confirmMethod('del',data)
						}
					},
					{
						name:'重新抓取',
						disabled: selection => {
							return selection.length == 0
						},
						fn: ()=>{
							let data = vm.getSelection().map(e=>e.taskId)
							vm.confirmMethod('grab',data)
						}
					},
				],
				columns:[
					{
						label:'任务名称',
						value:'taskName',
						showTooltip:true,
					},
					{
						label:'店铺所属站点',
						value:'sellerSiteName',
					},
					{
						label:'店铺数量',
						value:'sellerIds',
						render(h, scope) {
						  let num = scope.row.sellerIds.length
						  return num > 0 ? (
						    <el-button
						      type="text"
							  style='color: #108ee9;'
						      onClick={() => {
						        vm.$refs.layout.$dialog({
						          title: "数据源",
						          size:"small",
						          params: {
									type:'store',
									list:scope.row.sellerIds,
									shoreId:true
						          },
						          component: () => import("../dialog/table.vue")
						        });
						      }}
						    >
						      {num}
						    </el-button>
						  ) : (
							<span>-</span>
						  )
						}
					},
					{
						label:'搜索页数',
						value:'searchPages',
					},
					{
						label:'运送国家',
						value:'shippingCountries',
						render(h,scope){
							let shippingCountries = scope.row.shippingCountries
							if(shippingCountries && shippingCountries.length>0){
								let str = shippingCountries.join(',')
								return shippingCountries.length > 1 ? (
									<el-tooltip effect="light" placement="top" content={str} >
										<span style="color:rgb(16, 142, 233)">{shippingCountries[0]}</span>
									</el-tooltip>
								) : (
									<span>{shippingCountries[0]}</span>
								)
							}else{
								return <span>-</span>
							}
						}
					},
					{
						label:'创建时间',
						value:'createTime',
					},
					{
						label:'抓取状态',
						value:'status',
						enum:{
							1:'处理中',
							2:'处理成功',
							3:'处理失败'
						}
					},
					{
						label:'结果生成时间',
						value:'resultTime',
					},
				],
				
			}
		},
		methods:{
			searchFunc(data) {
			  let { time, ...info } = data;
			  let [startTime, endTime] = time || [];
			  return { startTime, endTime, ...info };
			},
			confirmMethod(type,data){
				this.$confirm(`此操作将${type === 'del' ? '删除' : '重新抓取'},是否继续`,'提示',{type:'warning'}).then(()=>{
					let params = {siteId:this.outerParams.siteId,taskIds:data}
					this.$api[`${type === 'del' ? 'taskSaleSellerBatchRemove' : 'taskSaleSellerReExecute'}`](params).then((e)=>{
						this.$refs.layout.getList()
					})
				}).catch(()=>{})
			},
			getCountry(){
				return this.$api['siteListSite1']().then((res)=>{
					return res.data.map(el => {
						return {
							label:el.siteName,
							value:el.siteId
						}
					})
				})
			}
		},
		computed: {
			outerParams(){
				return {
					siteId:this.$parent.$parent.$parent.toSellSiteId
				}
			},
			moneyType(){			
				return this.$parent.$parent.$parent.moneyType
			},
		},
		mounted(){

		},
		watch: {		
		    $route(to, from) {
				if(from.name === 'dataCaptureDetail') this.getLayoutList()
		    }
		},
	}
</script>

<style>
</style>

