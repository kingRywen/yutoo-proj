<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="产品列表" name="first" :lazy='true'>
			<keep-alive>
				<product-list />
			</keep-alive>			
		</el-tab-pane>
		<el-tab-pane label="源站点抓取" name="second" :lazy='true'>
			<keep-alive>
				<source-site-fetching />	
			</keep-alive>		
		</el-tab-pane>
		<el-tab-pane label="源店铺抓取" name="three" :lazy='true'>
			<keep-alive>
				<source-store-grab />
			</keep-alive>
		</el-tab-pane>
		<el-tab-pane label="源产品抓取" name="four" :lazy='true'>
			<keep-alive>
				<source-product-capture ref="fourView" />	
			</keep-alive>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import productList from './page/productList.vue'
	import sourceProductCapture from './page/sourceProductCapture.vue'
	import sourceSiteFetching from './page/sourceSiteFetching.vue'
	import sourceStoreGrab from './page/sourceStoreGrab.vue'
	export default{
		data(){
			return{
				activeName:'first'
			}
		},
		methods:{
			tabClick(e){
				if(e.name === 'four') this.$refs.fourView && this.$refs.fourView.getLayoutList()
			}
		},
		components:{
			productList,
			sourceProductCapture,
			sourceSiteFetching,
			sourceStoreGrab
		},
		computed:{
			toSellSiteId(){
				let name = this.$parent.$parent.$parent.activeName
				return parseInt(name)
			},
			pcid(){
				let pcid = this.$parent.$parent.$parent.pcid
				return pcid
			},
			moneyType(){
				return this.$parent.$parent.$parent.moneyType
			},
		},
		
	}
</script>

<style>
</style>
