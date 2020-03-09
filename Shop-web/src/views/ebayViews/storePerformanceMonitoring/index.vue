<template>
	<div>
		<div class="btns">
			<ElButton
				v-for="item in editBtns"
				:key="item.id"
				type="primary"
				size="small"
				:disabled="typeof item.disabled === 'function' ? item.disabled(selection) : false"
				@click="item.fn"
				plain
			>{{item.name}}</ElButton>
			<el-button type="primary" plain  @click="setManualUpdate" :loading="loadingBtn1" :disabled="BTNdisabled" size='small'>
            	{{refreshhtml}}
            <i class="el-icon-refresh el-icon--right"></i>
        </el-button>
        </div>
		<div style='margin-top:10px;'>
			 <yt-table
				v-loading="tableLoading"
				
				@selectChange="selectChange"
				border
				:data="tableList"
				:columns="columns"
				ref="table"
				>
			 </yt-table>
		</div>
		<Dialog
			:options="innerDialogOpts"
			:copyText="dialogComponent.copyText"
			:events="events"
			@close="innerDialogOpts.visible = false"
			>
			<transition-type name="fadeIn-fadeOut">
				<component
				v-if="innerDialogOpts.visible"
				:is="dialogComponent.component"
				:params="dialogComponent.params"
				ref="component"
				></component>
			</transition-type>
		</Dialog>
		
	</div>
</template>
<script>
import dayjs from 'dayjs';
import Dialog from './bigDialog';
export default {
	components: {
        Dialog
    },
	data() {
		let vm=this;
		return {
			innerDialogOpts: {
                visible: false,
                closeOnClickModal: true
            },
            dialogComponent: {},//弹框的组件
            //弹框的事件
            events:{
                open() {
                    setTimeout(() => {
                        vm.$nextTick(() => {
                        // 弹窗里的组件
                        let component = vm.$refs.component
                        if (!component) {
                            return
                        }
                        // 调用组件初始化函数
                        component && component._initData && component._initData()
                        })
                    })
                },
                close() {
                    // 弹窗里的组件
                    let component = vm.$refs.component
                    // 调用组件关闭函数
                    component && component._close && component._close()
                    },
                    handleOkClick() {
                    let component = vm.$refs.component
                    // if (!component) {
                    //   return
                    // }
                    if (!component._submit) {
                        throw new Error('确保弹窗组件内定义了_submit方法')
                    }
                    return (
                        component &&
                        component._submit &&
                        component._submit().then(res => {
                        if (res) {
                            vm.innerDialogOpts.visible = false
                            vm.getList(undefined, res === 'reset')
                        }
                        })
                    )
                }
            },
			tableLoading:false,
			//表格头部操作按钮
                editBtns:[
                    {
                        name: "编辑",
                        fn: () => {
                            this.compileBtn()
                        }
                    },
				],
			//columns表格
                columns: [
					{
                        label: "店铺名称",
                        value: "sellerAlias",
                        minWidth: 150,
					},
					{
                        label: "logo",
                        value: "logo",
						img:true,
						style: {
                            //图片宽高
                            width: 40,
                            height: 40
                        },
                        bulkyHeight: 120 //鼠标hover图片高，宽度自动

					},
					{
                        label: "好评率",
                        value: "positiveRate",
                        minWidth: 150,
						sortable:'true',
						render(h,scope){
							let div;
							if(scope.row.positiveRateDesc){
								div=(
									<div>
										<span>{scope.row.positiveRate?Math.ceil(scope.row.positiveRate*10000)/100+"%":"-"}</span> 
										<el-tooltip class="item" effect="light" content={scope.row.positiveRateDesc} placement="top-start">
											<i class='el-icon-warning' style={{fontSize:'22px',marginLeft:'10px',cursor:"pointer",verticalAlign:'sub'}}></i>
										</el-tooltip>
										
									</div>
								)
							}else{
								div=(
									<div>
										<span>{scope.row.positiveRate?Math.ceil(scope.row.positiveRate*10000)/100+"%":"-"}</span> 
									</div>
								)
							}
							return(
								div	
							)
						}
					},
					{
                        label: "最近一个月中差评数",
                        value: "neutralNegativeCntD30",
						width: 160,
						sortable:'true',
						render(h,scope){
							let div;
							if(scope.row.neutralNegativeDesc){
								div=(
									<div>
										<span>{scope.row.neutralNegativeCntD30 ? scope.row.neutralNegativeCntD30 :"-" }</span> 
										<el-tooltip class="item" effect="light" content={scope.row.neutralNegativeDesc} placement="top-start">
											<i class='el-icon-warning' style={{fontSize:'22px',marginLeft:'10px',cursor:"pointer",verticalAlign:'sub'}}></i>
										</el-tooltip>
										
									</div>
								)
							}else{
								div=(
									<div>
										<span>{scope.row.neutralNegativeCntD30 ? scope.row.neutralNegativeCntD30 :"-" }</span>  
									</div>
								)
							}
							return(
								div	
							)
						}

					},
					{
                        label: "卖家四项评分",
						//minWidth: 150,
						merge:[
							{
								label: "Item as described",
								value: "itemAsDescribed",
								width: 160,
								sortable:'true',
								render(h,scope){
									let div;
									if(scope.row.itemAsDescribedDesc){
										div=(
											<div>
												<span>{scope.row.itemAsDescribed ? scope.row.itemAsDescribed :"-" }</span> 
												<el-tooltip class="item" effect="light" content={scope.row.itemAsDescribedDesc} placement="top-start">
													<i class='el-icon-warning' style={{fontSize:'22px',marginLeft:'10px',cursor:"pointer",verticalAlign:'sub'}}></i>
												</el-tooltip>
												
											</div>
										)
									}else{
										div=(
											<div>
												<span>{scope.row.itemAsDescribed ? scope.row.itemAsDescribed :"-" }</span>  
											</div>
										)
									}
									return(
										div	
									)
								}
							},
							{
								label: "communication",
								value: "communication",
								width: 160,
								sortable:'true',
								render(h,scope){
									let div;
									if(scope.row.communicationDesc){
										div=(
											<div>
												<span>{scope.row.communication ? scope.row.communication :"-" }</span> 
												<el-tooltip class="item" effect="light" content={scope.row.communicationDesc} placement="top-start">
													<i class='el-icon-warning' style={{fontSize:'22px',marginLeft:'10px',cursor:"pointer",verticalAlign:'sub'}}></i>
												</el-tooltip>
												
											</div>
										)
									}else{
										div=(
											<div>
												<span>{scope.row.communication ? scope.row.communication :"-" }</span>  
											</div>
										)
									}
									return(
										div	
									)
								}

							},
							{
								label: "shipping Time",
								value: "shippingTime",
								width: 160,
								sortable:'true',
								render(h,scope){
									let div;
									if(scope.row.shippingTimeDesc){
										div=(
											<div>
												<span>{scope.row.shippingTime ? scope.row.shippingTime :"-" }</span> 
												<el-tooltip class="item" effect="light" content={scope.row.shippingTimeDesc} placement="top-start">
													<i class='el-icon-warning' style={{fontSize:'22px',marginLeft:'10px',cursor:"pointer",verticalAlign:'sub'}}></i>
												</el-tooltip>
												
											</div>
										)
									}else{
										div=(
											<div>
												<span>{scope.row.shippingTime ? scope.row.shippingTime :"-" }</span>  
											</div>
										)
									}
									return(
										div	
									)
								}
							},
							{
								label: "shipping Charges",
								value: "shippingCharges",
								width: 160,
								sortable:'true',
								render(h,scope){
									let div;
									if(scope.row.shippingChargesDesc){
										div=(
											<div>
												<span>{scope.row.shippingCharges ? scope.row.shippingCharges :"-" }</span> 
												<el-tooltip class="item" effect="light" content={scope.row.shippingChargesDesc} placement="top-start">
													<i class='el-icon-warning' style={{fontSize:'22px',marginLeft:'10px',cursor:"pointer",verticalAlign:'sub'}}></i>
												</el-tooltip>
												
											</div>
										)
									}else{
										div=(
											<div>
												<span>{scope.row.shippingCharges ? scope.row.shippingCharges :"-" }</span>  
											</div>
										)
									}
									return(
										div	
									)
								}
							},
						]
					},
					{
                        label: "top-Rated-Seller",
                        value: "topRatedSeller",
						minWidth: 150,
						sortable:'true',
						render(h,scope){
									let div;
									if(scope.row.topRatedSellerDesc){
										div=(
											<div>
												<span>{scope.row.topRatedSeller ? scope.row.topRatedSeller :"-" }</span> 
												<el-tooltip class="item" effect="light" content={scope.row.topRatedSellerDesc} placement="top-start">
													<i class='el-icon-warning' style={{fontSize:'22px',marginLeft:'10px',cursor:"pointer",verticalAlign:'sub'}}></i>
												</el-tooltip>
												
											</div>
										)
									}else{
										div=(
											<div>
												<span>{scope.row.topRatedSeller ? scope.row.topRatedSeller :"-" }</span>  
											</div>
										)
									}
									return(
										div	
									)
								}
					},
				],
			//外部参数
                outerParams: {
                    siteId: null,
					sellerId: null,
					platformId:null,
				},
		
			slectIds:[],//选择的ID的数组
			
			tableList:[],

			loadingBtn1: false,
			refreshhtml: '手动刷新',
			BTNdisabled: false,
		};
	},
	methods: {
		//编辑
			compileBtn(){
				//console.log('object');
				
				this.$dialog({
					title: "编辑指标",
					//params: {resultTime:v.resultTime,url:"ebTaskKeywordRankCurveList",taskId:v.taskId},
					width:'700px',
					component: () => import('./compileDialog.vue'),
					okBtnText: "确认",
					cancelBtnText: "取消"
				});
			},

		//获取更新状态
			getManualUpdate() {
				this.$api['ebShopPerformanceManualUpdateStatus']({
				//siteId:this.listQuery.siteId,
				//siteId:this.listQuery.siteId,
				siteId: this.outerParams.siteId,
				sellerId: this.outerParams.sellerId,
				})
				.then(data => {
					// debugger

					if (data.code === 0) {
					this.loadingBtn1 = false
					}
				})
				.catch(err => {
					// if (err && err.code) {
					//   this.refreshhtml = '正在刷新中'
					//   this.loadingBtn1 = true
					// }
					if (err.code === 500) {
					this.refreshhtml = '正在刷新中'
					this.loadingBtn1 = true
					}
					if (err.code === 200) {
					this.refreshhtml = '今日数据已更新'
					this.loadingBtn1 = false
					this.BTNdisabled = true
					}
				})
			},
		//设置更新
			setManualUpdate() {
				this.loadingBtn1 = true
				this.refreshhtml = '正在刷新中'
				this.$api['ebShopPerformanceManualUpdateStatus']({
				//siteId:this.listQuery.siteId,
				//siteId:this.listQuery.siteId,
					siteId: this.outerParams.siteId,
					sellerId: this.outerParams.sellerId,
				})
				.then(res => {
					if (res.code === 0) {
					// if(this.listQuery.cusCateId!==null){

					this.handleFilter()
					this.refreshhtml = '正在刷新中'
					this.BTNdisabled = true
					this.loadingBtn1 = false

					// }
					}
				})
				.catch(err => {
					//console.log(err);
					if (err.code === 200) {
						this.BTNdisabled = true
						this.refreshhtml = '今日数据已更新'
						this.loadingBtn1 = false
					} else if (err.code === 500) {
						this.BTNdisabled = true
						this.refreshhtml = '正在刷新中'
					}
				})
			},
		//表格勾选改变
			selectChange(v){
				//console.log(v);
				this.slectIds=v.map((i)=>{
					return i.taskId
				});
				//console.log(this.slectIds);
			},	
		//获取数据
			getData(){
				this.$api['ebShopPerformanceList']({
					...this.outerParams
				})
				.then(data => {
					this.tableList=data.data;
				}).catch(() => {})
			},
		  // 弹窗
			$dialog({
				title,
				width,
				size,
				component,
				okBtnText,
				copyText,
				cancelBtnText,
				params,
				appendToBody = false
				}) {
				component().then(com => {
					// console.log(com);
					com.default.inheritAttrs = false
					this.dialogComponent.component = com.default
					this.dialogComponent.params = params
					this.dialogComponent.copyText = copyText
					this.innerDialogOpts.title = title
					this.innerDialogOpts.visible = true
					this.innerDialogOpts.width = width
					this.innerDialogOpts.appendToBody = appendToBody
					this.innerDialogOpts.size = size
					this.innerDialogOpts.okBtnText = okBtnText
					this.innerDialogOpts.cancelBtnText = cancelBtnText
				})
			},
		
	},
	created() {
		//console.log(1);
		this.outerParams.platformId=this.ebayPlatformId;
		if (this.sellerId && this.siteId) {
			this.outerParams.siteId=this.siteId;
			this.outerParams.sellerId=this.sellerId;
			this.getData();
			this.getManualUpdate();
		}
	},
	watch:{
		sellerData() {
			if (this.sellerId && this.siteId) {
				this.outerParams.siteId=this.siteId;
				this.outerParams.sellerId=this.sellerId;
				this.getData();
				this.getManualUpdate();
			}
		}
	},
	// computed: {
	// 	events() {
	// 		return Object.assign(this.innerEvents, this.outerEvents)
	// 	},
	// 	dialogOpts() {
	// 	  return Object.assign(this.innerDialogOpts, this.outerDialogOtions)
	// 	}
	// },
};
</script>

<style scoped lang="less">

</style>
