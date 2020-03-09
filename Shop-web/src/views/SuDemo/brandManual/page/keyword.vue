<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="关键词" name="first" :lazy='true'>
			<keep-alive>
				<keyword-item />	
			</keep-alive>		
		</el-tab-pane>
		<el-tab-pane label="否定关键词" name="second" :lazy='true'>
			<keep-alive>
				<no-keyword-item />	
			</keep-alive>
		</el-tab-pane>
		<!-- <el-tab-pane label="客户搜索词" name="third" :lazy='true'>
			<keep-alive>
				<customer-search-item />	
			</keep-alive>
		</el-tab-pane> -->
	</el-tabs>
</template>

<script>
	import keywordItem from './keywordPage/keywordItem.vue'
	import noKeywordItem from './keywordPage/noKeywordItem.vue'
	// import customerSearchItem from 'Views/AD_Management/customerSearch/index.vue' 
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
			keywordItem,
			noKeywordItem,
			// customerSearchItem
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
