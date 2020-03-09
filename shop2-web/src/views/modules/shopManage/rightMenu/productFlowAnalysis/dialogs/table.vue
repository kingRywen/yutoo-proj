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
						label: '预警问题',
						value: 'warnContent',
					},
				],
				outerTableList:[]
			}
		},
		mounted(){
			this.$nextTick(()=>{
				this.outerTableList = this.params.data
			})
			
		}
	}
</script>
