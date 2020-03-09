<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="广告组" name="first" :lazy='true'>
			<keep-alive>
				<group />
			</keep-alive>			
		</el-tab-pane>
		<el-tab-pane label="否定关键词" name="second" :lazy='true'>
			<keep-alive>
				<no-keyword />
			</keep-alive>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import group from './groupPage/group.vue'
	import noKeyword from './groupPage/noKeyword.vue'
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
			group,
			noKeyword,
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
