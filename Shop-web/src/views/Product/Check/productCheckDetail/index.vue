<template>
	<div>
		<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
			<el-tab-pane label="源关键词" name="first" :lazy='true'>	
				<product-check-detail ref="child1" key=1 />
			</el-tab-pane>
			<el-tab-pane label="单词" name="second" :lazy='true'>	
				<product-check-detail ref="child2" key=2 />
			</el-tab-pane>
		</el-tabs>
		
	</div>
	
	
</template>

<script>
	import productCheckDetail from '../ProductCheckDetail.vue'
	export default { 
		data(){
			return {
				activeName:'first'
			}
		},
		methods:{
			tabClick(){
				this.$refs.child1.getList({
					pageSize: 10,
					pageNumber: 1
				})	
				this.$refs.child2.getList({
					pageSize: 10,
					pageNumber: 1
				})				
			}
		},
		components:{
			productCheckDetail
		}
	}
</script>

<style>
</style>
