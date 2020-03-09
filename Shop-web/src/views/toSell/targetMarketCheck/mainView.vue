<template>
	<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane label="校验中" name="first" :lazy='true'>
			<check-in ref="checkInRef" />		
		</el-tab-pane>
		<el-tab-pane label="在售" name="second" :lazy='true'>
			<on-sale ref="onSaleRef" />	
		</el-tab-pane>
		<el-tab-pane label="不在售" name="three" :lazy='true'>
			<not-to-sell ref="notToSellRef" />
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import checkIn from './page/checkIn.vue'
	import onSale from './page/onSale.vue'
	import notToSell from './page/notToSell.vue'
	export default{
		data(){
			return{
				activeName:'first',
			}
		},
		methods:{
			tabClick(){
				this.$parent.$parent.$parent.getCustomCategory()
			}
		},
		components:{
			checkIn,
			onSale,
			notToSell
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
			siteList(){
				return this.$parent.$parent.$parent.siteList
			}
		},
	}
</script>

<style>
</style>
