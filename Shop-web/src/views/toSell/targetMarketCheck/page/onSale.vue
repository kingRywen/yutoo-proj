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
			:customDisplay='true'			
			@select="handleSelect"
			:searchFunc='searchFunc'
			key=2
			ref="layout"
			url="imSaleProdCheckListProduct"
		>
			
		</MainLayout>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	import { unique } from 'Utils/tools'
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
						labelWidth: '50px',
					},
					{
						label:'跟卖最高价格/源总价格',
						name:'minHighest1',
						type:'input',
						width:'80px',
						labelWidth: '160px',
						showPer:true
					},
					{
						label:'~',
						name:'maxHighest1',
						type:'input',
						labelWidth: '20px',
						width:'80px',
						showPer:true
					},
					{
						label:'跟卖最低价格/源总价格',
						name:'minLowest1',
						type:'input',
						width:'80px',
						labelWidth: '160px',
						showPer:true
					},
					{
						label:'~',
						name:'maxLowest1',
						type:'input',
						labelWidth: '20px',
						width:'80px',
						showPer:true
					},
					{
						label:'亚马逊自营',
						name:'fbaPriceFlag',
						type:'select',
						placeholder:'是否有亚马逊自营',	
						options:[
							{label:'是',value:1},
							{label:'否',value:0}
						],
						labelWidth: '100px',
					},
					{
						label:'源站点',
						name:'sourceSiteId',
						type:'select',
						placeholder:'请选择源站点',	
						options:vm.getCountry,
						labelWidth: '50px',
					},
					{
						label:'源店铺',
						name:'sourceSellerId',
						type:'select',
						placeholder:'请选择源店铺',	
						options:vm.getStore,
						labelWidth: '160px',
					},
					{
						label:'更新时间',
						name:'time',
						type:'dateRange',
						labelWidth: '181px',
					},
				],
				editBtns:[
					{
						name:'加入可跟卖库',
						disabled: selection => {
							return selection.length == 0
						},
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
							return vm.joinMethod(data)
						}
					},
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
						name:'设置产品类目',
						disabled: selection => {
							return selection.length == 0
						},
						fn: ()=>{
							let data = vm.getSelection().map((e)=>{
								let arr = e.parentAsin ? e.parentAsin : e.asin
								return arr
							})
							data = unique(data)
							vm.$refs.layout.$dialog({
							  title:'设置产品类目',
							  width:'600px',
							  params:{
								siteId:this.outerParams.siteId,
								parentAsins:data,
								fn:vm.getCate,
								checkStatus:2
							  },
							  component: () => import("../dialog/setPcid.vue"),
							  okBtnText:'确认',
							  cancelBtnText:'取消'
							});
						},
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
						width:'150px',
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
						label:'主图',
						value:'imageUrl',
						img:true
					},
					{
						label:'源站点',
						value:'sourceSiteName',
					},
					{
						label:'源店铺',
						value:'sourceSellerId',
						width:180,
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
						minWidth:'90px',
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
						label:'跟卖卖家数',
						value:'sellerCnt',
						sortable:"custom",
						minWidth:'110px'
					},
					{
						label:'跟卖最高价',
						value:'maxPrice',
						sortable:"custom",
						minWidth:'110px',
						render(h,scope){
							let maxPrice = scope.row.maxPrice
							return maxPrice ? (
								<span>{vm.moneyType} {maxPrice}</span>
							) : (
								<span>-</span>
							)
						}
					},
					{
						label:'跟卖最低价',
						value:'minPrice',
						sortable:"custom",
						minWidth:'110px',
						render(h,scope){
							let minPrice = scope.row.minPrice
							return minPrice ? (
								<span>{vm.moneyType} {minPrice}</span>
							) : (
								<span>-</span>
							)
						}
					},
					{
						label:'是否有FBA跟卖',
						value:'fbaFlag',
						sortable:"custom",
						minWidth:'130px',
						render(h,scope){
							let fbaFlag = scope.row.fbaFlag
							return fbaFlag || fbaFlag == 0 || scope.row.childList ? 
							scope.row.childList ? 
							scope.row.childList.some((e)=>{return e.fbaFlag == 1}) ? (
								<span>是</span>
							) 
							: (
								<span>-</span>
							)
							: fbaFlag ? (
								<span>是</span>
							) : (
								<span>否</span>
							)
							: (
								<span>-</span>
							)
						}
					},
					{
						label:'亚马逊自营价格',
						value:'fbaPrice',
						sortable:"custom",
						minWidth:'150px',
						// render(h,scope){
						// 	return scope.row.fbaPrice ? (
						// 		<span>$ {scope.row.fbaPrice}</span>
						// 	) : (
						// 		<span>无</span>
						// 	)
						// },
						render(h,scope){
							let fbaPrice = scope.row.fbaPrice
							return fbaPrice || fbaPrice == 0 || scope.row.childList ? 
							scope.row.childList ? 
							scope.row.childList.some((e)=>{return e.fbaPrice}) ? (
								<span>有</span>
							) 
							: (
								<span>无</span>
							)
							: fbaPrice ? (
								<span>{vm.moneyType} {fbaPrice}</span>
							) : (
								<span>{vm.moneyType} {fbaPrice}</span>
							)
							: (
								<span>无</span>
							)
						}
					},
					// {
					// 	label:'跟卖最高价格/源总价格',
					// 	value:'highest',
					// 	sortable:"custom",
					// 	minWidth:'210px',
					// 	render(h,scope){
					// 	    let span='';
					// 	    if( scope.row.childList && scope.row.childList.length){
					// 	        let priceArr = []
					// 	        scope.row.childList.forEach(i=>{
					// 	            if( i.highest < 0 ){
					// 	                priceArr.push(null)
					// 	            }else{
					// 	                priceArr.push(i.highest)
					// 	            }                             
					// 	        });
					// 	        // console.log(priceArr);
					// 	        let newArr = [];
					// 	        priceArr.forEach(i=>{
					// 	            if( i || i===0){
					// 	                newArr.push(i)
					// 	            }
					// 	        });
					// 	        if( newArr.length ){
					// 	             span = ( '$'+ Math.max.apply(null,newArr) ) ;
					// 	        }else{
					// 	            span =  ('-')
					// 	        }
					// 	    }else{
					// 	        span = ( (scope.row.highest || scope.row.highest===0) ? '$'+scope.row.highest : '-' );
					// 	    };
					// 	    return(
					// 	        <span>{ span }</span>
					// 	    )
					// 	}
					// },
					{
					    label: "跟卖最高价格/源总价格",
					    value: "highest",
					    minWidth: 160,
					    //money:'us',
					    //sortable:"custom"
					    render(h,scope){
					        let span='';
					        if( scope.row.childList && scope.row.childList.length){
					            let priceArr = []
					            scope.row.childList.forEach(i=>{
					                if( i.highest < 0 ){
					                    priceArr.push(null)
					                }else{
					                    priceArr.push(i.highest)
					                }                             
					            });
					            let newArr = [];
					            priceArr.forEach(i=>{
					                if( i || i===0){
					                    newArr.push(i)
					                }
					            });
					            if( newArr.length ){
					                 span = ( Math.max.apply(null,newArr)) ;
					            }else{
					                span =  ('-')
					            }
					        }else{
					            span = ( (scope.row.highest || scope.row.highest===0) ? scope.row.highest : '-' );
					        };
					  
					        if( span !== '-'){
					            span = parseInt(span*10000)/100+"%"
					        };
					        return(
					            <span>{ span }</span>
					        )
					    }
					
					},
					{
					    label: "跟卖最低价格/源总价格",
					    value: "lowest",
					    minWidth: 160,
					    //sortable:"custom"
					    render(h,scope){
					        let span='';
					        if( scope.row.childList && scope.row.childList.length){
					            let priceArr = []
					            scope.row.childList.forEach(i=>{
					                if( i.lowest < 0 ){
					                    priceArr.push(null)
					                }else{
					                    priceArr.push(i.lowest)
					                }                             
					            });
					            let newArr = [];
					            priceArr.forEach(i=>{
					                if( i || i===0){
					                    newArr.push(i)
					                }
					            });
					            if( newArr.length ){
					                 span = ( Math.min.apply(null,newArr) ) ;
					            }else{
					                span =  ('-')
					            }
					        }else{
					            span = ( (scope.row.lowest || scope.row.lowest===0) ? scope.row.lowest : '-' );
					        };
					        if( span !== '-'){
					            span = parseInt(span*10000)/100+"%"
					        };
					        return(
					            <span>{ span }</span>
					        )
					    }
					
					},
					// {
					// 	label:'跟卖最低价格/源总价格',
					// 	value:'lowest',
					// 	sortable:"custom",
					// 	minWidth:'210px',
					// 	render(h,scope){
					// 	    let span='';
					// 	    if( scope.row.childList && scope.row.childList.length){
					// 	        let priceArr = []
					// 	        scope.row.childList.forEach(i=>{
					// 	            if( i.lowest < 0 ){
					// 	                priceArr.push(null)
					// 	            }else{
					// 	                priceArr.push(i.lowest)
					// 	            }                             
					// 	        });
					// 	        let newArr = [];
					// 	        priceArr.forEach(i=>{
					// 	            if( i || i===0){
					// 	                newArr.push(i)
					// 	            }
					// 	        });
					// 	        if( newArr.length ){
					// 	             span = ( '$'+ Math.min.apply(null,newArr) ) ;
					// 	        }else{
					// 	            span =  ('-')
					// 	        }
					// 	    }else{
					// 	        span = ( (scope.row.lowest || scope.row.lowest===0) ? '$'+scope.row.lowest : '-' );
					// 	    };
					// 	    return(
					// 	        <span>{ span }</span>
					// 	    )
					// 	}
					// },
					{
						label:'类目',
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
								<el-tooltip open-delay={300} content={category} placement="top"  effect="light">
									<a class="fix__row_1" href={scope.row.categoryUrl} style="color:#108ee9;" target='_blink'>{category.length>50?newStr:category}</a>
								</el-tooltip>
							  </div>
							  
							) : (
							  <span>-</span>
							)
						}
					},
					{
						label:'状态',
						value:'grabStatusString',
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
			searchFunc(data) {
			  let { time,minHighest1,maxHighest1,minLowest1,maxLowest1, ...info } = data;
			  let [startTime, endTime] = time || [];
			  let minHighest = minHighest1 ? Number(minHighest1)/100 : null;
			  let maxHighest = maxHighest1 ? Number(maxHighest1)/100 : null;
			  let minLowest = minLowest1 ? Number(minLowest1)/100 : null;
			  let maxLowest = maxLowest1 ? Number(maxLowest1)/100 : null;
			  return { startTime, endTime,minHighest,maxHighest,minLowest,maxLowest, ...info };
			},
			resetCate(data){
				console.log(this.$parent.$parent.$parent.moneyType)
				return this.$confirm('此操作将重新抓取,是否继续','提示',{type:'warning'}).then(()=>{
					return this.$api['imSaleProdCheckReExecute']({checkStatus:2,siteId:this.outerParams.siteId,asins:data}).then(()=>{
						this.$refs.layout.getList()
					})
				}).catch(()=>{})
			},
			getCate(){
				this.$parent.$parent.$parent.$parent.$parent.$parent.getCustomCategory()
			},
			joinMethod(data){
				return this.$confirm(`此操作将加入可跟卖库,是否继续`,'提示',{type:'warning'}).then(()=>{
					let params = {siteId:this.outerParams.siteId,asins:data,checkStatus:this.outerParams.checkStatus}
					return this.$api[`imSaleProdAbleSave`](params).then((e)=>{
						this.$refs.layout.getList()
					})
				}).catch(()=>{})
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
			    return	this.$api['imSaleProdCheckListProductExport'](params).then((res)=>{
					downloadFile(
					  res,
					  '目标市场校验-产品列表' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
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
			moneyType1(e){
				return this.siteList.find(i=>i.siteName === e).symbol
			},
		
		},
		computed: {
			outerParams(){
				return {
					siteId:this.$parent.$parent.$parent.toSellSiteId,
					checkStatus:2,
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
