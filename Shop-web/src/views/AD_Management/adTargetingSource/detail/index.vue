<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="分析" name="first" :lazy='true'>
			<ana-lyze />		
		</el-tab-pane>
		<el-tab-pane label="任务列表" name="second" :lazy='true'>
			<task-list />	
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import anaLyze from './page/analyze.vue'
	import taskList from './page/taskList.vue'
	export default{
		data(){
			return{
				activeName:'first',
			}
		},
		methods:{
			tabClick(){
				
			}
		},
		components:{
			anaLyze,
			taskList
		},
		computed:{
			
		},
	}
</script>

<style>
</style>
