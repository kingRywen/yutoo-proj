<template>
	<div class="mainContent">
		<div>
			<el-tooltip effect="dark" content="预警数量为未读数量，每日统计两次" placement="top">
				<span>说明</span>
			</el-tooltip>
		</div>
		<div>
			<div v-for="item in viewData" :key="item.value" @click="clickMethod(item.label,item.value)">
				<p>{{item.label}}</p>
				<p>{{item.num}}</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				viewData:[
					{label:'政策违规',value:0,num:0},
					{label:'退货率过高产品下架',value:1,num:0},
					{label:'产品价格错误',value:2,num:0},
					{label:'产品标题错误',value:3,num:0},
					{label:'信用卡失效',value:4,num:0},
					{label:'信用卡变更',value:5,num:0},
					{label:'收款账户发生变化',value:6,num:0},
					{label:'客户消息',value:7,num:0},
					{label:'A-Z',value:8,num:0},
					{label:'自发货提醒',value:9,num:0},
					{label:'FBA入仓数据差异',value:10,num:0},
				]
			}
		},
		methods:{
			clickMethod(label,value){
				this.$router.push({
					path:'/shopManage/warningMessage/detail',
					query:{
						type:value,
						title:label
					}
				})
			},
			getNum(){
				this.$api['shopManage/warnStatistics']({...this.storeInfo}).then((res)=>{
					let data = res.data
					data.forEach((e)=>{
						this.viewData.find(i=>i.value == e.warnType).num = e.warnCnt
					})
				})
			}
		},
		mounted(){
			this.$nextTick(()=>{
				this.getNum()
			})
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.mainContent{
		height: 800px;
		width: 100%;
		min-width: 1500px;
		background: rgb(242,242,242);
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 16.5%;
		>div:nth-child(1){
			margin-top: 10px;
			span{
				font-size: 12px;
			}
			>span:nth-child(1){
				display: inline-block;
				background: rgb(0,152,152);
				font-size: 13px;
				padding: 3px 19px;
				border-radius: 4px;
				color: #fff;
				margin-right: 10px;
			}
		}
		>div:nth-child(2){
			margin-top: 10px;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			>div{
				width: 230px;
				height: 125px;
				background: #FFF;
				margin: 0 20px 30px 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				cursor:pointer;
				>p{
					margin: 0;
					font-size: 14px;
				}
				>p:nth-child(2){
					font-size: 18px;
					color: #FF9900;
					margin-top: 4px;
				}
			}
		}
	}
</style>
