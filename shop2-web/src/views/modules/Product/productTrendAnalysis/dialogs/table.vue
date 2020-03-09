<template>
	<div class="w1100">
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
			let vm = this
			return {
				columns: [
					{
						label: 'ASIN',
						value: 'asin',
						render(h,scope){
							let {asin} = scope.row
							return <a href={vm.storeUrls.asinUrl + asin} target="_blank" type="text">{asin}</a>
						}
					},		
					//123/
					{
						label: '状态',
						value: 'status',
						_enum: {
							1: '抓取中',
							2: '抓取成功',
							'>=3': '抓取失败'
						},
					},
				],
				outerTableList:[]
			}
		},
		mounted(){
			let params = {
				...this.storeInfo,
				taskId:this.params.id
			}
			this.$api[this.params.url](params).then((res)=>{
				this.outerTableList = res.data.map((e)=>({
					asin:e.asin,
					status:e.status
				}))
				
			})
		}
	}
</script>
