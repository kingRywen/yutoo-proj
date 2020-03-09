<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="广告" name="first" :lazy='true'>
			<keep-alive>
				<ad-page />
			</keep-alive>			
		</el-tab-pane>
		<el-tab-pane label="关键词" name="second" :lazy='true'>
			<keep-alive>
				<keyword-page />	
			</keep-alive>		
		</el-tab-pane>
		<el-tab-pane label="否定关键词" name="three" :lazy='true'>
			<keep-alive>
				<no-keyword-page />
			</keep-alive>
		</el-tab-pane>
		<el-tab-pane label="客户搜索词" name="four" :lazy='true'>
			<keep-alive>
				<customer-page ref="fourChild" />	
			</keep-alive>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import adPage from './keywordPage/adPage.vue'
	import customerPage from './keywordPage/customerPage.vue'
	import keywordPage from './keywordPage/keywordPage.vue'
	import noKeywordPage from './keywordPage/noKeywordPage.vue'
	export default{
		data(){
			return{
				activeName:'second'
			}
		},
		methods:{
			tabClick(e){
				if(e.name === 'four'){
					this.$nextTick(function(){
						this.$refs.fourChild.searchMethod()
					})	
				}
			},
			goCustomer(e){
				this.activeName = 'four'
				this.$nextTick(function(){
					this.$refs.fourChild.listQuery.keywordIds = [e]
					this.$refs.fourChild.searchMethod()
				})				
			}
		},
		components:{
			adPage,
			customerPage,
			keywordPage,
			noKeywordPage
		},
		computed:{
			classifyId(){
				return this.$parent.$parent.$parent.currentNode.classifyId || null
			},
		}
	}
</script>

<style>
</style>
