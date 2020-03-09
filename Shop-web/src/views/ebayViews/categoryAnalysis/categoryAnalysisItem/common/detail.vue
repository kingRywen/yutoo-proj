<template>
	<MainLayout
	    :outerParams="outerParams"
	    :searchFields="searchFields"
	    :editBtns="editBtns"
		:edits="edits"
	    :columns="columns"
		:searchFunc = 'searchFunc'
	    @selectChange='selectChange'
		:handleLeft='true'
		:backBtn='true'
		:customDisplay='true'
	    ref="layout"
	    url="ebTaskCateAysDetails"
	    >  
	</MainLayout> 
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			return{
				edits:[
					{
					    name: "查看深度分析",
					    icon: "el-icon-search",
					    show: scope => {
					          return  scope.row.depthTaskId
					    },
					    fn: (scope) => {
					        return this.$router.push({
					        	name:'ebayCategoryDepthAnalysisDetail',
					        	query:{taskId:scope.row.depthTaskId}
					        })
					    }
					},
					{
					    name: "新增订单数",
					    icon: "el-icon-picture-outline",
					    show: scope => {
					          return  true
					    },
					    fn: (scope) => {
					        this.$refs.layout.$dialog({
					        	title: "数据展示",
					        	size:'large',
					        	params: {isCategory:true,category:scope.row.category,taskId:this.outerParams.taskId,url:"ebTaskCateAysListToProdOrderCnt"},
					        	component: () => import('./echartsDialog.vue'),
					        });
					    }
					},
				],
				searchFields:[
					{
						label:'类目',
						name:'categorys',
						type:'cascader',
						placeholder:'请选择类目',
						width:320,
						bind:{
							label:'name',
							value:'name',
							children:'childs',
							enabled:'enabled'
						},
						options:this.getCategory,
					},
				],
				editBtns:[
					{
						name:'加入深度分析',
						fn: ()=>{
							this.addDepthMethod()
						}
					},
					{
						name:'导出',
						fn: ()=> {
							this.exportMethod()
						}
					}
				],
				columns:[
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
								<el-tooltip open-delay={300} content={category} placement="top">
									<a class="fix__row_1" href={scope.row.categoryUrl} style="color:#108ee9;" target='_blink'>{category.length>50?newStr:category}</a>
								</el-tooltip>
							  </div>
							  
							) : (
							  <span>-</span>
							)
						}	
					},
					{
					    label: "TOP100产品日均订单量之和",
					    value: "top100ProdOrderCntD30",
						sortable:"custom",
						minWidth:'220',
					},
					{
					    label: "拍卖产品数",
					    value: "auctionProductCnt",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "拍卖卖家数",
					    value: "auctionSellerCnt",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "一口价产品数",
					    value: "buyItNowProductCnt",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "一口价卖家数",
					    value: "buyItNowSellerCnt",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "TOP100产品中中国卖家数",
					    value: "top100ProdCnSellerCnt",
						sortable:"custom",
						minWidth:'200',
					},
					{
					    label: "TOP100产品中中国卖家数占比",
					    value: "top100ProdCnSellerRate",
						sortable:"custom",
						minWidth:'220',
						render(h,scope){
							return(
								<span>{scope.row.top100ProdCnSellerRate*1000/10+"%"}</span>
							)
						}
					},
					{
					    label: "TOP1",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top1ImageUrl",
								img:true,
								link:'top1ProductUrl',
								render(h,scope){
								    return scope.row.top1ImageUrl ? (
										<el-popover placement="right" trigger="hover">
											<div
											  class="__img_wrapper mar-auto"
											  style="width:200px;height:200px"
											>
											  <img class="loadingImg" v-lazy={scope.row.top1ImageUrl} style="object-fit: contain;overflow: hidden;" />
											</div>
											<a slot="reference"  href={scope.row.top1ProductUrl} target='_blink'>
											  <img
												class="loadingImg"
												key={scope.row.top1ImageUrl}
												v-lazy={scope.row.top1ImageUrl}
												style="width:40px;height:40px"
											  />
											</a>
										</el-popover>
								    ) : (
										<span>-</span>
									)
								}
					        },
							{
							    label: "最近月销量",
							    value: "top1SalesCntD30",
							    sortable:"custom",
								width:'120',
							},
							{
							    label: "价格",
							    value: "top1Price",
							    sortable:"custom",
								width:'70',
								
							},
							{
							    label: "评分",
							    value: "top1StarCnt",
							    sortable:"custom",
								width:'70',
							},
							{
							    label: "评价数",
							    value: "top1ReviewCnt",
							    sortable:"custom",
								width:'90',
							},
					    ],
					},
					{
					    label: "TOP2",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top2ImageUrl",
					        	img:true,
					        	link:'top2ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top2ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top2ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top2ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top2ImageUrl}
					        					v-lazy={scope.row.top2ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top2SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top2Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top2StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top2ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP3",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top3ImageUrl",
					        	img:true,
					        	link:'top3ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top3ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top3ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top3ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top3ImageUrl}
					        					v-lazy={scope.row.top3ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top3SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top3Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top3StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top3ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP4",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top4ImageUrl",
					        	img:true,
					        	link:'top4ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top4ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top4ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top4ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top4ImageUrl}
					        					v-lazy={scope.row.top4ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top4SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top4Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top4StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top4ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP5",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top5ImageUrl",
					        	img:true,
					        	link:'top5ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top5ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top5ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top5ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top5ImageUrl}
					        					v-lazy={scope.row.top5ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top5SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top5Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top5StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top5ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP6",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top6ImageUrl",
					        	img:true,
					        	link:'top6ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top6ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top6ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top6ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top6ImageUrl}
					        					v-lazy={scope.row.top6ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top6SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top6Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top6StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top6ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP7",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top7ImageUrl",
					        	img:true,
					        	link:'top7ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top7ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top7ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top7ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top7ImageUrl}
					        					v-lazy={scope.row.top7ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top7SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top7Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top7StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top7ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP8",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top8ImageUrl",
					        	img:true,
					        	link:'top8ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top8ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top8ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top8ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top8ImageUrl}
					        					v-lazy={scope.row.top8ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top8SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top8Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top8StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top8ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP9",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top9ImageUrl",
					        	img:true,
					        	link:'top9ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top9ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top9ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top9ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top9ImageUrl}
					        					v-lazy={scope.row.top9ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top9SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top9Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top9StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top9ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP10",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top10ImageUrl",
					        	img:true,
					        	link:'top10ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top10ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top10ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top10ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top10ImageUrl}
					        					v-lazy={scope.row.top10ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top10SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top10Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top10StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top10ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP11",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top11ImageUrl",
					        	img:true,
					        	link:'top11ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top11ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top11ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top11ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top11ImageUrl}
					        					v-lazy={scope.row.top11ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top11SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top11Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top11StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top11ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP12",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top12ImageUrl",
					        	img:true,
					        	link:'top12ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top12ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top12ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top12ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top12ImageUrl}
					        					v-lazy={scope.row.top12ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top12SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top12Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top12StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top12ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP13",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top13ImageUrl",
					        	img:true,
					        	link:'top13ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top13ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top13ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top13ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top13ImageUrl}
					        					v-lazy={scope.row.top13ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top13SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top13Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top13StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top13ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP14",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top14ImageUrl",
					        	img:true,
					        	link:'top14ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top14ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top14ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top14ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top14ImageUrl}
					        					v-lazy={scope.row.top14ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top14SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top14Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top14StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top14ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP15",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top15ImageUrl",
					        	img:true,
					        	link:'top15ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top15ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top15ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top15ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top15ImageUrl}
					        					v-lazy={scope.row.top15ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top15SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top15Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top15StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top15ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP16",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top16ImageUrl",
					        	img:true,
					        	link:'top16ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top16ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top16ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top16ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top16ImageUrl}
					        					v-lazy={scope.row.top16ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top16SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top16Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top16StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top16ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP17",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top17ImageUrl",
					        	img:true,
					        	link:'top17ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top17ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top17ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top17ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top17ImageUrl}
					        					v-lazy={scope.row.top17ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top17SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top17Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top17StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top17ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP18",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top18ImageUrl",
					        	img:true,
					        	link:'top18ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top18ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top18ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top18ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top18ImageUrl}
					        					v-lazy={scope.row.top18ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top18SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top18Price",
					            sortable:"custom",
					        	width:'70',
								
					        },
					        {
					            label: "评分",
					            value: "top18StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top18ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP19",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top19ImageUrl",
					        	img:true,
					        	link:'top19ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top19ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top19ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top19ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top19ImageUrl}
					        					v-lazy={scope.row.top19ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top19SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top19Price",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评分",
					            value: "top19StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top19ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP20",
						minWidth:'150',
					    merge:[
					        {
					            label: "主图",
					            value: "top20ImageUrl",
					        	img:true,
					        	link:'top20ProductUrl',
					        	render(h,scope){
					        	    return scope.row.top20ImageUrl ? (
					        			<el-popover placement="right" trigger="hover">
					        				<div
					        				  class="__img_wrapper mar-auto"
					        				  style="width:200px;height:200px"
					        				>
					        				  <img class="loadingImg" v-lazy={scope.row.top20ImageUrl} style="object-fit: contain;overflow: hidden;" />
					        				</div>
					        				<a slot="reference"  href={scope.row.top20ProductUrl} target='_blink'>
					        				  <img
					        					class="loadingImg"
					        					key={scope.row.top20ImageUrl}
					        					v-lazy={scope.row.top20ImageUrl}
					        					style="width:40px;height:40px"
					        				  />
					        				</a>
					        			</el-popover>
					        	    ) : (
					        			<span>-</span>
					        		)
					        	}
					        },
					        {
					            label: "最近月销量",
					            value: "top20SalesCntD30",
					            sortable:"custom",
					        	width:'120',
					        },
					        {
					            label: "价格",
					            value: "top20Price",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评分",
					            value: "top20StarCnt",
					            sortable:"custom",
					        	width:'70',
					        },
					        {
					            label: "评价数",
					            value: "top20ReviewCnt",
					            sortable:"custom",
					        	width:'90',
					        },
					    ],
					},
					{
					    label: "TOP1卖家",
						minWidth:'150',
					    merge:[
					        {
					            label: "卖家名称",
					            value: "top1SellerId",
					        	render(h,scope){
									let {top1SellerId} = scope.row
					        		return top1SellerId ? (
					        			 <a href={scope.row.top1SellerUrl} target='_blink'>
					        				<span class="fix__row_1"  style={{color:"#108ee9"}}>{top1SellerId}</span>
					        			 </a>
					        		) : (
										<span>-</span>
									)
					        	}
					        },
					        {
					            label: "产品数",
					            value: "top1SellerProductCnt",
					            sortable:"custom",
					        	width:'100',
					        },
					    ],
					},
					{
					    label: "TOP2卖家",
						minWidth:'150',
					    merge:[
					        {
					            label: "卖家名称",
					            value: "top2SellerId",
					        	render(h,scope){
									let {top2SellerId} = scope.row
					        		return top2SellerId ? (
					        			 <a href={scope.row.top2SellerUrl} target='_blink'>
					        				<span class="fix__row_1" style={{color:"#108ee9"}}>{top2SellerId}</span>
					        			 </a>
					        		) : (
										<span>-</span>
									)
					        	}
					        },
					        {
					            label: "产品数",
					            value: "top2SellerProductCnt",
					            sortable:"custom",
					        	width:'100',
					        },
					    ],
					},
					{
					    label: "TOP3卖家",
						minWidth:'150',
					    merge:[
					        {
					            label: "卖家名称",
					            value: "top3SellerId",
					        	render(h,scope){
									let {top3SellerId} = scope.row
					        		return top3SellerId?(
					        			 <a href={scope.row.top3SellerUrl} target='_blink'>
					        				<span class="fix__row_1" style={{color:"#108ee9"}}>{top3SellerId}</span>
					        			 </a>
					        		) : (
										<span>-</span>
									)
					        	}
					        },
					        {
					            label: "产品数",
					            value: "top3SellerProductCnt",
					            sortable:"custom",
					        	width:'100',
					        },
					    ],
					},
					{
					    label: "TOP4卖家",
						minWidth:'150',
					    merge:[
					        {
					            label: "卖家名称",
					            value: "top4SellerId",
					        	render(h,scope){
									let {top4SellerId} = scope.row
					        		return top4SellerId?(
					        			 <a href={scope.row.top4SellerUrl} target='_blink'>
					        				<span class="fix__row_1" style={{color:"#108ee9"}}>{top4SellerId}</span>
					        			 </a>
					        		) : (
										<span>-</span>
									)
					        	}
					        },
					        {
					            label: "产品数",
					            value: "top4SellerProductCnt",
					            sortable:"custom",
					        	width:'100',
					        },
					    ],
					},
					{
					    label: "TOP5卖家",
						minWidth:'150',
					    merge:[
					        {
					            label: "卖家名称",
					            value: "top5SellerId",
					        	render(h,scope){
									let {top5SellerId} = scope.row
					        		return top5SellerId?(
					        			 <a href={scope.row.top5SellerUrl} target='_blink'>
					        				<span class="fix__row_1" style={{color:"#108ee9"}}>{top5SellerId}</span>
					        			 </a>
					        		) : (
										<span>-</span>
									)
					        	}
					        },
					        {
					            label: "产品数",
					            value: "top5SellerProductCnt",
					            sortable:"custom",
					        	width:'100',
					        },
					    ],
					},
				],
				selectList:[],
			}
		},
		created(){
			this.outerParams.taskId=this.$route.query.taskId;//任务id
		},
		methods:{
			exportMethod(){
				this.$confirm('此操作将导出').then(()=>{
					let categorys = []
					this.selectList.forEach((e)=>{
						categorys.push(e.category)
					})
					let params = {
						taskId:this.outerParams.taskId,
						category:this.$refs.layout.searchTrueData.category,
						sortField:this.$refs.layout.sortData.sortField,
						sort:this.$refs.layout.sortData.sort,
						categorys:categorys
					}
					this.$api['ebTaskCateAysExportDetails'](params).then((res)=>{
						downloadFile(
						  res,
						  '类目分析' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
						)
					})
				}).catch(()=>{})
			},
			addDepthMethod(){
				if (this.selectList.length) {
					this.$confirm('此操作将加入深度分析').then(()=>{

						let ids = []
						this.selectList.forEach(e => {
							ids.push(e.categoryId)
						})
						return this.$api['ebTaskCateDepthAysSave']({
							categoryIds:ids,
							platformId:this.ebayPlatformId,
							siteId:this.siteId
						}).then(data => {
							if (data.code === 0) {
								this.$refs.layout.getList()
							}							
						})
					}).catch(()=>{})
				}else{
					this.$message.warning('请选择至少一项')
				}
			},
			async getCategory(id = [0],selEl,itemDisabled){
				if(!selEl) selEl = {pcid:0};
				let siteId = await this.siteId;
				if(siteId){
					let {pcid} = selEl
					let params = {
						parentPcid:pcid,
						siteId:siteId,
						platformId:this.ebayPlatformId
					}
					return this.$api['ebProductCategoryGetCategory'](params)
						.then(data => {
							if (data && data.code && data.code !== 0) {
								this.$message.error(data.meg)
								return
							}
							return data.data.map(el => {
								return {
									...el,
									childs:el.haveChildren ? [] :null,
									enabled: true,
									isLeaf: !el.haveChildren
								}
							})
						})
				}
			},
			searchFunc(data){
				let {categorys,...info} = data;
				if(categorys){
					let category = categorys.join(':');
					return {category,...info}
				}else{
					return {...info}
				}
			},
			selectChange(v){
				this.selectList = [];
				v.forEach(i => {
				  this.selectList.push({category:i.category,categoryId:i.categoryId})
				});
			},
		},
		computed: {
			outerParams(){
				return {
					platformId:this.ebayPlatformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					taskId:null,
				}
			},
		},
	}
</script>

<style>
</style>
