<template>
	<div>
		<MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			:treeTable="treeTable"
			:treeTableOtions="treeTableOtions"
			@select="handleSelect"
			:showWdg="false"
			:searchFunc='searchFunc'
			key=1
			ref="layout"
			url="imSaleProdCheckListProduct"
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
					
				],
				searchFields:[
					{
						label:'ASIN',
						name:'asin',
						type:'input',
						placeholder:'请输入产品ASIN',
						labelWidth: '40px',
					},
					{
						label:'源站点',
						name:'sourceSiteId',
						type:'select',
						placeholder:'请选择源站点',	
						options:vm.getCountry
					},
					{
						label:'源店铺',
						name:'sourceSellerId',
						type:'select',
						placeholder:'请选择源店铺',	
						options:vm.getStore
					},
					{
						label:'更新时间',
						name:'time',
						type:'dateRange',
					},
				],
				editBtns:[
					
					{
						name:'导出',
						showLoading:true,
						fn: ()=>{
							let data = vm.getSelection().map((e)=>{
								return e.asin
							})
							return vm.exportMethod(data)
						}
					},
					{
						name:'重新抓取',
						disabled: selection => {
							return selection.length == 0
						},
						fn: ()=>{
							let data = []
							vm.getSelection().forEach((e)=>{
								if(e.childList && e.childList.length == 0){
									data.push(e.parentAsin)
								}else if(!e.childList){
									data.push(e.asin)
								}
							})
							return vm.resetCate(data)
						}
					},
					{
						name:'删除',
						disabled:selection=>{
							return selection.length == 0
						},
						fn: ()=>{
							let data = []
							vm.getSelection().forEach((e)=>{
								if(e.childList && e.childList.length == 0){
									data.push(e.parentAsin)
								}else if(!e.childList){
									data.push(e.asin)
								}
							})
							vm.$confirm(`此操作将删除,是否继续`,'提示',{type:'warning'}).then(()=>{
								let params = {siteId:vm.outerParams.siteId,asins:data}
								vm.$api['imSaleProdCheckRemove'](params).then((e)=>{
									vm.$refs.layout.getList()
								})
							}).catch(()=>{})
						}
					},
				],
				columns:[
					{
						label:'ASIN',
						value:'asin',
						expand:true,
						render(h,scope){
							return (
							<a href={scope.row.productUrl} target="_blank" style='color: #108ee9;'>{scope.row.asin}</a>
							)
							
						}
					},
					{
						label:'更新时间',
						value:'updateTime',
						width:'150px',
					},
					{
						label:'源站点',
						value:'sourceSiteName',
					},
					{
						label:'源店铺',
						value:'sourceSellerId',
					},
					{
						label:'源总价格',
						value:'totalPrice',
						width:'100px',
						render(h,scope){
							let totalPrice = scope.row.totalPrice
							if(totalPrice && totalPrice>0) totalPrice = totalPrice.toFixed(2)
							return totalPrice || totalPrice == 0 ? (
								totalPrice == 0 ? (
									<span>0</span>
								) : totalPrice > 0 ? (
									<span>{vm.moneyType} {totalPrice}</span>
									// <span>{vm.moneyType1(scope.row.sourceSiteName)} {totalPrice}</span>
								) : totalPrice<-10 ? (
									<span>抓取失败</span>
								) : (									
									<span>不能配送</span>
								)
							) : scope.row.childList ? (
								<span>-</span>
							)
							:  (
								<span>未抓取</span>
							)
						}
					},
					{
						label:'源库存',
						value:'quantity',
						sortable:"custom",
						render(h,scope){
							let quantity = scope.row.quantity
							return quantity || quantity == 0 ? (
								quantity > 29 ? (
									<span>30+</span>
								) : (
									<span>{quantity}</span>	
								)
							) : (
								<span>-</span>
							)
						}
					},
				],
				treeTable:true,
				treeTableOtions:{
					childs:'childList',
					expandFunc:row =>{
						return row.childList && row.childList.length>0
					}
				},
			}
		},
		methods:{
			resetCate(data){
				return this.$confirm('此操作将重新抓取,是否继续','提示',{type:'warning'}).then(()=>{
					return this.$api['imSaleProdCheckReExecute']({checkStatus:0,siteId:this.outerParams.siteId,asins:data}).then(()=>{
						this.$refs.layout.getList()
					})
				}).catch(()=>{})
			},
			searchFunc(data) {
			  let { time, ...info } = data;
			  let [startTime, endTime] = time || [];
			  return { startTime, endTime, ...info };
			},
			getStore(){
				let params = {siteId:this.outerParams.siteId}
				return this.$api['imSaleProdCheckListSellerId1'](params).then((res)=>{
					return res.data.map(el => {
						return {
							label:el,
							value:el
						}
					})
				})
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
			},
			handleSelect(select, row) {
				let vm = this
				if (row.childList) {
					row.childList.forEach(el => {
					vm.$refs.layout.$refs.table.$refs.table.toggleRowSelection(el)
					})
				}
			},
			exportMethod(data){
				let params = {
					siteId:this.outerParams.siteId,
					checkStatus:this.outerParams.checkStatus,
					asin:this.$refs.layout.searchTrueData.asin,
					asins:data && data.length ? data : null,
					minLowest:this.$refs.layout.searchTrueData.minLowest,
					maxLowest:this.$refs.layout.searchTrueData.maxLowest,
					minHighest:this.$refs.layout.searchTrueData.minHighest,
					maxHighest:this.$refs.layout.searchTrueData.maxHighest,
					fbaPriceFlag:this.$refs.layout.searchTrueData.fbaPriceFlag,
					field_69:this.$refs.layout.searchTrueData.field_69,
					sourdeSiteId:this.$refs.layout.searchTrueData.sourdeSiteId,
					sourceSellerId:this.$refs.layout.searchTrueData.sourceSellerId,
					startTime:this.$refs.layout.searchTrueData.startTime,
					endTime:this.$refs.layout.searchTrueData.endTime,
					// sortField:this.$refs.layout.sortData.sortField,
					// sortOrder:this.$refs.layout.sortData.sort == 1 ? 'asc' : this.$refs.layout.sortData.sort == 0 ? 'desc' : null,
				}
				return this.$api['imSaleProdCheckListProductExport'](params).then((res)=>{
					downloadFile(
					  res,
					  '目标市场校验-产品列表' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
					)
				})
			},
			moneyType1(e){
				return this.siteList.find(i=>i.siteName === e).symbol
			},
		},
		computed: {
			outerParams(){
				return {
					siteId:this.$parent.$parent.$parent.toSellSiteId,
					checkStatus:0,
					pcid:this.$parent.$parent.$parent.pcid
				}
			},
			moneyType(){			
				return this.$parent.$parent.$parent.moneyType
			},
			siteList(){
				return this.$parent.$parent.$parent.siteList
			}
		},
		mounted(){

		},
		watch:{
			'outerParams.siteId' :{
				handler(){
					this.getStore()
				}
			}
		}
	}
</script>

<style>
</style>
