<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="流量预警" name="first" :lazy='true'>
			<keep-alive>
				<warning />	
			</keep-alive>		
		</el-tab-pane>
		<!-- <el-tab-pane label="趋势分析" name="second" :lazy='true'>
			<keep-alive>
				<analyze />	
			</keep-alive>
		</el-tab-pane> -->
	</el-tabs>
</template>

<script>
	import warning from './page/warning.vue'
	import analyze from './page/analyze.vue'
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
			warning,
			analyze,
		},
	}
</script>

<style>
</style>
