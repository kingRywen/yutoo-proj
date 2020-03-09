<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="产品差评监控" name="first" :lazy='true'>
			<keep-alive>
				<product />	
			</keep-alive>		
		</el-tab-pane>
		<el-tab-pane label="店铺差评监控" name="second" :lazy='true'>
			<keep-alive>
				<shop />	
			</keep-alive>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import product from './page/product.vue'
	import shop from './page/shop.vue'
	export default{
		data(){
			return{
				activeName:'first'
			}
		},
		methods:{
			tabClick(e){
				
			},
		},
		components:{
			product,
			shop,
		},
	}
</script>

<style>
</style>
