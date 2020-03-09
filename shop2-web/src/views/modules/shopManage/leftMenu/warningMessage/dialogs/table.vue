<template>
	<div>
		<main-layout
			:outerTableList = 'outerTableList'
			:columns="columns" 
			:showSelection = 'false'
			ref="layout"
		></main-layout>
	</div>
</template>
<script>
	export default {
		props:['params'],
		data() {
			return {
				columns: [ 
					{
						label: 'SKU',
						value: 'sku',
					},
					{
						label: 'ASIN',
						value: 'asin',
					},
					{
						label: '主图',
						value: 'imageUrl',
						img:true,
					},	
					{
						label: '发货数量',
						value: 'shippedCnt',
					},	
					{
						label: '入仓数量',
						value: 'receivedCnt',
					},	
					{
						label: '差异数量',
						value: 'differencesCnt',
					},	
				],
				outerTableList:[]
			}
		},
		methods:{
			setOption(){
				if(this.params.type === 1){
					this.columns = this.columns.splice(0,4)
					this.columns[3] = {
						label: '数量',
						value: 'productCnt',
					}
				}
			},
			getList(){
				this.outerTableList = this.params.item
			}
		},
		created(){
			this.$nextTick(()=>{
				this.setOption()
			})			
		},
		mounted(){
			this.$nextTick(()=>{
				this.getList()
			})		
		}
	}
</script>
