<template>
	<div class="mainContent tableTasks" v-loading.fullscreen.lock="mainLoading" :style="{height:viewHeight}">
		<div class="leftCt"  :style="{height:viewHeight}">
			<div>
				<div>
					<el-input v-model="searchText" size="small" clearable placeholder="输入ASIN、SKU搜索" style="width: 40%;"></el-input>
					<el-tooltip content="选择父产品，默认选择全部子产品，可以选择部分子产品，未选中的不参加计算" placement="top">
					  <span class="desBtn">说明</span>
					</el-tooltip>
				</div>			
				<div>
					<main-layout
					    :outerParams = "outerParams"
						:columns="leftColumns" 
						:treeTable="true" 
						:treeTableOtions="treeTableOtions" 
						:checkStrictly = 'false'
						reserveSelection = 'sellerSku'
						url="shopManage/productListToSku"
						ref="leftLayout"
					></main-layout>
				</div>
			</div>
			<div>
				<el-button @click="addToRight" >添加</el-button>
			</div>
		</div>
		<div class="rightCt"  :style="{height:viewHeight}">
			<div>
			  <span>已选{{selectNum}}个</span>
			  <el-button type="text" @click="delMethod('all')" style="color:#ff9966" >全部删除</el-button>
			</div>
			<div>
				<main-layout
					:columns="rightColumns" 
					:treeTable="true" 
					:showSelection = 'false'
					:treeTableOtions="treeTableOtions" 
					:outerTableList = 'rightTableData'
					:isExpandAll = 'true'
					ref="rightLayout"
				></main-layout>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			//是否是流量预警的添加   只有流量预警的添加需特殊处理
			isFlow:{
				type:Boolean,
				default:false,
			},
			
			//可视高度
			viewHeight:{
				type:String,
				default:'760px'
			}
			
		},
		data() {
			let vm = this
			return {
				mainLoading: false,
				searchText:null,
				treeTableOtions: {
					childs: 'childList',
					expandFunc: row => {
						return row.childList && row.childList.length > 0
					}
				},
				leftColumns:[
					{
						label: 'SKU',
						value: 'sellerSku',
						numField: 'childList',
						expand: true,
						noTooltip:true,
					},
					{
						label: 'ASIN',
						value:'asin'
					},
					{
						label: '主图',
						value: 'imagePath',
						img:true,
						style: {
						  width: 40,
						  height: 40
						},
					},
				],
				rightColumns:[
					{
						label: 'SKU',
						value: 'sellerSku',
						numField: 'childList',
						expand: true,
						noTooltip:true,
					},
					{
						label: 'ASIN',
						value:'asin'
					},
					{
						label: '主图',
						value: 'imagePath',
						img:true,
						style: {
						  width: 40,
						  height: 40
						},
					},
					{
						label: '操作',
						width:'70px',
						render(h,scope){
							return <el-button type="text" icon="el-icon-close" onClick={() => { vm.delMethod('single',scope) }} ></el-button>
						}
					}
					//123/
				],
				rightTableData:[],
			}
		},
		methods: {
			//父可以调用此函数来验证
			validateFn(){
				if(this.rightTableData.length){
					return true
				}else{
					return false
				}
			},
			delMethod(type,data){
				if(type === 'all'){
					this.$set(this,'rightTableData',[])
				}else if(type === 'single'){
					if(data.row.parentSku){
						let parentIndex = this.rightTableData.findIndex(e => e.sellerSku === data.row.parentSku)
						let childIndex = this.rightTableData[parentIndex].childList.findIndex(e => e.sellerSku === data.row.sellerSku)
						this.rightTableData[parentIndex].childList.splice(childIndex,1)
						if(!this.isFlow && this.rightTableData[parentIndex].childList.length === 0) this.rightTableData.splice(parentIndex,1)
					}else{
						this.rightTableData.splice(this.rightTableData.findIndex(e => e.sellerSku === data.row.sellerSku),1)
					}				
				}
				this.$message.success('操作成功')
			},
			addToRight(){
				let selecteData = this.$refs.leftLayout.selection
				if(selecteData && selecteData.length){
					
					//非流量添加任务,单独勾选父不允许添加进右侧表格
					if(!this.isFlow && (selecteData.filter(e => e.childList && e.childList.length > 0).some(i => selecteData.map(v=>v.parentSku).indexOf(i.sellerSku) === -1))) return this.$message.warning('不能单独勾选父产品')
					
					//1.去处理数据   2.并且把它添加到右侧表格
					let resultData =  this.computeData(selecteData)
					if(resultData.length) {
						this.rightTableData = resultData.filter(i => i)
						this.$message.success('添加成功')
					}else{
						this.$message.warning('和右侧数据存在重复')
					}					
					this.$refs.leftLayout.clearSelection()
					
				}else{
					this.$message.warning('请勾选至少一项表格数据')
				}				
			},
			computeData(data){
				let newData = []
				
				//首先 过滤掉已经添加的数据
				this.rightTableData.forEach(e => {
					if(data.some(i => i.sellerSku === e.sellerSku)){
						data.splice(data.findIndex(v => v.sellerSku === e.sellerSku),1)
					}
					if(e.childList && e.childList.length){
						e.childList.forEach(o => {
							if(data.some(w => w.sellerSku === o.sellerSku)){
								data.splice(data.findIndex(v => v.sellerSku === o.sellerSku),1)
							}
						})
					}	
				})
				
				newData = this.rightTableData.filter(i => i)
				//优先处理有子产品的父产品
				data.filter(e => e.childList && e.childList.length > 0).forEach(e => {
					newData.push({...e,childList:[]})
				})
				
				//再处理子产品
				data.filter(e => e.parentSku).forEach(i => {
					//先处理有父产品的子产品
					if( newData.map(v => v.sellerSku).indexOf(i.parentSku) !== -1 ){
						newData.find(a => a.sellerSku === i.parentSku).childList.push({...i})
					}
					//再处理没有勾选父产品的子产品, 需要手动补上相对应的父产品
					else{
						let parentObj = this.$refs.leftLayout.tableList.find(w => w.sellerSku === i.parentSku)
						newData.push({...parentObj,childList:[]})
						newData.find(a => a.sellerSku === i.parentSku).childList.push({...i})
					}
				})
				
				//最后处理无子产品的父产品
				data.filter(e => !e.parentSku && !e.childList).forEach(e => {
					newData.push({...e})
				})
				
				return newData
			}
		},
		computed: {
			outerParams(){
				return {
					...this.storeInfo,
					searchText:this.searchText
				}
			},
			selectNum(){
				let num = 0
				this.rightTableData.forEach(e => {
					num++
					if(e.childList && e.childList.length){
						e.childList.forEach(i => num++ )
					}
				})
				return num
			}
		}
	}
	
</script>
//123/
<style scoped="scoped" lang="scss">
	.mainContent.tableTasks {
		width: 100%;
		height: 760px;
		display: flex;
		justify-content: space-between;
		min-width: 1080px;
		>div {
			width: 50%;
			height: 760px;
		}

		.leftCt {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 18px 0 0;
			overflow-y: auto !important;
			>div:nth-child(1){
				>div:nth-child(1){
					display: flex;
					align-items: flex-end;
					margin-bottom: 20px;
					.desBtn{
						display: inline-block;
						background: rgb(0,152,152);
						font-size: 13px;
						padding: 0px 19px;
						border-radius: 4px;
						color: #fff;
						margin-right: 10px;
						height: 20px;
						line-height: 20px;
						margin-left: 10px;
					}
				}			
			}
			>div:nth-child(2){
				.el-button{
					float: right;
				}
			}
		}

		.rightCt {
			border-left: 1px solid rgb(215, 215, 215);
			overflow-y: auto !important;
			overflow-x: hidden !important;
			box-sizing: border-box;
			padding: 0 0 0 18px;
			>div:nth-child(1){
				display: flex;
				justify-content: space-between;
				align-items:center;
				margin-bottom: 21px;
			}
		}
	}
</style>
