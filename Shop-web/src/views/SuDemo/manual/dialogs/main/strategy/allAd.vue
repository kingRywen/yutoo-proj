<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="定时调整预算" name="first">
			<add-budget ref="child1" :params="params" />
			<div style="margin: 10px 0 0 48%">
				<el-button @click="child1Submit" type="primary" size="small" >保存</el-button>
			</div>			
		</el-tab-pane>
		<el-tab-pane label="否定策略" name="second">
			<no-word ref="child2" :params="params" />
			<div style="margin: 10px 0 0 48%">
				<el-button @click="child2Submit" type="primary" size="small" >保存</el-button>
			</div>
		</el-tab-pane>
		<el-tab-pane label="广告产品暂停策略" name="seventh">
			<ad-stop ref="child7" :params="params" />
			<div style="margin: 10px 0 0 48%">
				<el-button @click="child7Submit" type="primary" size="small" >保存</el-button>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import addBudget from './addBudget.vue'
	import noWord from './noWord.vue'
	import adStop from './adStop.vue'
	export default{
		props:['params'],
		data(){
			return{
				activeName:'first'
			}
		},
		methods:{
			tabClick(e){

			},
			child1Submit(){
				return this.$refs.child1._submit().then((res)=>{
					console.log(res)
				})
			},
			child2Submit(){
				return this.$refs.child2._submit().then((res)=>{
					console.log(res)
				})
			},
			child7Submit(){
				return this.$refs.child7._submit().then((res)=>{
					console.log(res)
				})
			},
			getData(){
				this.$refs.child1._initData()
				this.$refs.child2._initData()
				this.$refs.child7._initData()
			}
		},
		components:{
			addBudget,noWord,adStop
		},	
		created(){
			this.$nextTick(function(){
				this.getData()
			})		
		}
	}
</script>

<style>
</style>
