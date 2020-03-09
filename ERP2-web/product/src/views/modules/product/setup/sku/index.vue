<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="仓库SKU" name="first" :lazy='true'>
			<keep-alive>
				<warehouse-sku />
			</keep-alive>			
		</el-tab-pane>
		<el-tab-pane label="店铺SKU" name="second" :lazy='true'>
			<keep-alive>
				<shop-sku />
			</keep-alive>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import warehouseSku from './page/warehouseSku.vue'
	import shopSku from './page/shopSku.vue'
	export default{
		data(){
			return{
				activeName:'first'
			}
		},
		methods:{
			tabClick(e){

			}
		},
		components:{
			warehouseSku,
			shopSku,
		},
	}
</script>

<style>
</style>
