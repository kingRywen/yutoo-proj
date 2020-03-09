<template>
	<div>
		<div class="content" v-for="(item,index) in list">
			<div style="background: rgb(242,242,242);height: 30px;line-height: 30px;">
				<span style="margin-left: 10px;">策略{{index + 1}}</span><el-button @click="isShowDiv(index)" type="text" :class="item.divDisplay==='none'?'el-icon-caret-bottom':'el-icon-caret-top'" style="font-size: 20px;padding-top: 5px;margin-left: 5px;" ></el-button>
				
				<el-tooltip v-if="list.length > 1" class="item"  effect="light" content="删除指标" placement="top">
					<el-button  @click="delIndexMethod(index)" type="text" class="el-icon-delete" style="font-size: 20px;float: right;padding-top: 5px;margin-right: 5px;" ></el-button>
				</el-tooltip>
				
				<el-tooltip class="item"  effect="light" content="添加指标" placement="top">
					<el-button  @click="addIndexMethod" type="text" class="el-icon-circle-plus-outline" style="font-size: 20px;float: right;padding-top: 5px;margin-right: 25px;" ></el-button>
				</el-tooltip>
				
				<el-tooltip class="item"  effect="light" content="降序，顺序置前的优先级更高" placement="top">
					<i class="el-icon-sort-down"  style="color: #4BA2D7;font-size: 20px;float: right;margin-top: 5px;margin-right: 45px;"></i>
				</el-tooltip>
			</div>			
			<div class="contentItem" :style="{display:item.divDisplay}">
				<div>123</div>
				<div>123</div>
				<div>123</div>
				<div>123</div>
				<div>123</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				list:[
					{
						divDisplay:'block'
					},
				],
			}
		},
		methods:{
			isShowDiv(index){
				this.list[index].divDisplay = `${this.list[index].divDisplay === 'block' ? 'none' : 'block'}`
			},
			addIndexMethod(){
				this.list.push({
					divDisplay:'block'
				})
			},
			delIndexMethod(index){
				this.list.splice(index,1)
			}
		}
	}
</script>

<style scoped>
	.content{
		width:100%;
		height:auto;
		margin-top: 10px;
	}
	.contentItem{
		width: 100%;
		height: auto;
		padding: 10px;
		background: lightblue;
	}
</style>
