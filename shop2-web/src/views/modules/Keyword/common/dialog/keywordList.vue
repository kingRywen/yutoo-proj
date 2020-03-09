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
			return {
				columns: [ 
					{
						label: '关键词',
						value: 'keyword',
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
				this.outerTableList = res.data.keywords.map((e)=>({
					keyword:e	
				}))
				
			})
		}
	}
</script>
