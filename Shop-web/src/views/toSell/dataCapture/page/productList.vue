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
			:outSearchData="searchData"
			:initialParmas = "initialParmas"
			@select="handleSelect"
			reserveSelection = 'asin'
			:showWdg = 'false'
			ref="layout"
			url="imSaleProdSrcListProduct"
		></MainLayout>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			var vm = this
			return{
				searchData: {
				  countrySiteId: 2
				},
				initialParmas: {
					countrySiteId : 2
				},
				edits:[
					
				],
				searchFields:[
					{
						label:'ASIN',
						name:'asin',
						type:'input',
						placeholder:'请输入产品ASIN',
						labelWidth: '60px',
					},
					{
						label:'价格',
						name:'minPrice',
						type:'input',
						width:'70px'
					},
					{
						label:'~',
						name:'maxPrice',
						type:'input',
						labelWidth: '20px',
						width:'70px'
					},
					{
						label:'总价',
						name:'minTotalPrice',
						type:'input',
						width:'70px'
					},
					{
						label:'~',
						name:'maxTotalPrice',
						type:'input',
						labelWidth: '20px',
						width:'70px'
					},
					{
						label:'库存',
						name:'minQuantity',
						type:'input',
						width:'70px'
					},
					{
						label:'~',
						name:'maxQuantity',
						type:'input',
						labelWidth: '20px',
						width:'70px'
					},
					{
						label:'运送国家',
						name:'countrySiteId',
						type:'select',
						placeholder:'请选择运送国家',
						labelWidth: '60px',
						options:vm.getCountry
					},
					{
						label:'配送情况',
						name:'deliveryType',
						type:'select',
						placeholder:'请选择配送情况',
						labelWidth: '60px',
						options:[
							{label:'可配送',value:0},
							{label:'不可配送',value:1},
							{label:'未抓取',value:2},
							{label:'抓取失败',value:3},
						]
					},
				],
				editBtns:[
					{
						name:'加入目标市场校验',
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
							vm.$refs.layout.$dialog({
							  title:'加入目标市场校验',
							  width:'600px',
							  params:{
								siteId:this.outerParams.siteId,
								asins:data,
								type:'outer'
							  },
							  component: () => import("../dialog/joinTarget.vue"),
							  okBtnText:'确认',
							  cancelBtnText:'取消'
							});
						}
					},
					{
						name:'导出',
						showLoading:true,
						fn: ()=>{
							let data = []
							vm.getSelection().forEach((e)=>{
								if(e.childList && e.childList.length == 0){
									data.push(e.parentAsin)
								}else if(!e.childList){
									data.push(e.asin)
								}
							})
							return vm.exportMethod(data)
						}
					},
					{
						name:'重新抓取',
						disabled:selection=>{
							return selection.length == 0
						},
						fn: ()=>{
							// let data = vm.getSelection().map(e=>e.asin)
							// let newData = []
							// vm.getSelection().forEach((e,index)=>{
							// 	if(data.indexOf(e.parentAsin) == -1){
							// 		newData.push(e.asin)
							// 	}
							// 	if(data.indexOf(e.parentAsin) != -1 && !e.childList ){
							// 		newData.push(e.asin)
							// 	}
							// })
							let newData = []
							vm.getSelection().forEach((e)=>{
								if(e.childList && e.childList.length == 0){
									newData.push(e.parentAsin)
								}else if(!e.childList){
									newData.push(e.asin)	
								}
							})
							vm.$refs.layout.$dialog({
							  title:'添加任务',
							  width:'600px',
							  params:{
								siteId:this.outerParams.siteId,
								edit:true,
								asins:newData,
								name:`${newData[0]}${newData.length}`
							  },
							  component: () => import("../dialog/addTaskProduct.vue"),
							  okBtnText:'确认',
							  cancelBtnText:'取消'
							});
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
								vm.$api['imSaleProdSrcRemove'](params).then((e)=>{
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
						width:'150',
						expand:true,
						render(h,scope){
							return (
							<a href={scope.row.productUrl} target="_blank" style='color: #108ee9;'>{scope.row.asin}</a>
							)
							
						}
					},
					{
						label:'主图',
						value:'imageUrl',
						img:true,
						width:'100px',
					},
					{
						label:'更新时间',
						value:'updateTime',
						width:'140px'
					},
					{
						label:'品牌名',
						value:'brand',
					},
					{
						label:'库存量',
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
					{
						label:'价格',
						value:'price',
						sortable:"custom",
						render(h,scope){
							let price = scope.row.price
							if(price){
								if(price.indexOf('~') != -1){
									//有~
									let list = price.split('~')
									if(list[0] === list[1]){
										return <span>{vm.moneyType} {Number(list[0]).toFixed(2)}</span>
									}else{
										return <span>{vm.moneyType} {Number(list[0]).toFixed(2)}~{vm.moneyType} {Number(list[1]).toFixed(2)}</span>
									}	
								}else{
									//无~
									return <span>{vm.moneyType} {Number(price).toFixed(2)}</span>
								}																
							}else{
								return <span>-</span>
							}
						}
					},
					// {
					// 	label:'运费',
					// 	value:'fare',
					// 	width:'100px',
					// 	headerTooltip: <div>显示的是上方筛选条件中运送国家对应的运费,不能配送显示 <i class="el-icon-close" style="color:red;font-size:14px;font-weight:bold"></i> ,可配送显示具体的运费,未抓取显示 <b>-</b> ,抓取失败 (即页面没有展示运费的) 显示 <div style="display:inline-block;width:12px;height:12px;line-height:12px;border-radius:50%;font-size:7px;background:#FFFFFF;color:#FF0000;border:1px solid #FF0000;text-align: center;"><b>!</b></div></div>,
					// 	render(h,scope){
					// 		let fare = scope.row.fare
					// 		if(fare && fare>0) fare = fare.toFixed(2)
					// 		return fare || fare == 0 ? (
					// 			fare == 0 ? (
					// 				<span>0</span>
					// 			) : fare > 0 ? (
					// 				<span>$ {fare}</span>
					// 			) : fare<-10 ? (
					// 				<div style="width:20px;height:20px;line-height:20px;border-radius:50%;font-size:15px;background:#FFFFFF;color:#FF0000;border:1px solid #FF0000;text-align: center;margin-left: 38%;"><b>!</b></div>
					// 			) : (									
					// 				<i class="el-icon-close" style="color:red;font-size:28px"></i>
					// 			)
					// 		) : (
					// 			<span>-</span>
					// 		)
					// 	}
					// },
					{
						label:'运费',
						value:'fare',
						width:'100px',
						render(h,scope){
							let fare = scope.row.fare
							if(fare && fare>0) fare = fare.toFixed(2)
							return fare || fare == 0 ? (
								fare == 0 ? (
									<span>{vm.moneyType} 0</span>
								) : fare > 0 ? (
									<span>{vm.moneyType} {fare}</span>
								) : fare<-10 ? (
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
					// {
					// 	label:'总价',
					// 	value:'totalPrice',
					// 	width:'100px',
					// 	render(h,scope){
					// 		let totalPrice = scope.row.totalPrice
					// 		if(totalPrice && totalPrice>0) totalPrice = totalPrice.toFixed(2)
					// 		return totalPrice || totalPrice == 0 ? (
					// 			totalPrice == 0 ? (
					// 				<span>0</span>
					// 			) : totalPrice > 0 ? (
					// 				<span>$ {totalPrice}</span>
					// 			) : totalPrice<-10 ? (
					// 				<div style="width:20px;height:20px;line-height:20px;border-radius:50%;font-size:15px;background:#FFFFFF;color:#FF0000;border:1px solid #FF0000;text-align: center;margin-left: 38%;"><b>!</b></div>
					// 			) : (									
					// 				<i class="el-icon-close" style="color:red;font-size:28px"></i>
					// 			)
					// 		) : (
					// 			<span>-</span>
					// 		)
					// 	}
					// },
					{
						label:'总价',
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
						label:'所属类目',
						value:'category',
						width:300,
						align:'left',
						render(h, scope) {
							let  category  = scope.row.category
							if(category.length>50){
								let newArr = category.split(':')
								var newStr = ''
								newStr = `${newArr[0]}...${newArr.pop()}`
							}
							return category ? (
							  <div>					
								<el-tooltip open-delay={300} content={category} placement="top" effect="light">
									<a class="fix__row_1" href={scope.row.categoryUrl} style="color:#108ee9;" target='_blink'>{category.length>50?newStr:category}</a>
								</el-tooltip>
							  </div>
							  
							) : (
							  <span>-</span>
							)
						}
					}
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
			getCountry(){
				return this.$api['siteListCountry1']().then((res)=>{
					return res.data.map(el => {
						return {
							label:el.countryName,
							value:el.siteId
						}
					})
				})
			},
			exportMethod(data){
				let params = {
					siteId:this.outerParams.siteId,
					asin:this.$refs.layout.searchTrueData.asin,
					minPrice:this.$refs.layout.searchTrueData.minPrice,
					maxPrice:this.$refs.layout.searchTrueData.maxPrice,
					minTotalPrice:this.$refs.layout.searchTrueData.minTotalPrice,
					maxTotalPrice:this.$refs.layout.searchTrueData.maxTotalPrice,
					minQuantity:this.$refs.layout.searchTrueData.minQuantity,
					maxQuantity:this.$refs.layout.searchTrueData.maxQuantity,
					countrySiteId:this.$refs.layout.searchTrueData.countrySiteId,
					deliveryType:this.$refs.layout.searchTrueData.deliveryType,
					asins:data && data.length ? data : null,
					// sortField:this.$refs.layout.sortData.sortField,
					// sortOrder:this.$refs.layout.sortData.sort == 1 ? 'asc' : this.$refs.layout.sortData.sort == 0 ? 'desc' : null,
				}
				return this.$api['imSaleProdSrcListProductExport'](params).then((res)=>{
					downloadFile(
					  res,
					  '产品列表' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
					)
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
		},
		computed: {
			outerParams(){
				return {
					siteId:this.$parent.$parent.$parent.toSellSiteId,
					pcid:this.$parent.$parent.$parent.pcid
				}
			},
			moneyType(){			
				return this.$parent.$parent.$parent.moneyType
			},
		},
		mounted(){

		},
		watch:{
			
		}
	}
</script>

<style>
</style>
