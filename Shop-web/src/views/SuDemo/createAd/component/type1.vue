<template>
	<div class="content">
		<div class="title">投放</div>
		<div style="padding-top: 10px;padding-bottom: 10px;">
			<div>你可以向广告活动添加多个广告组,但只能为每个广告组选择一种投放类型。</div>
			<div style="display: flex;margin-top: 20px;">
				<div  style="width: 60%;">
					<el-radio v-model="onTheType" label="1" style="font-weight: bold;" @change="changeChild6">关键词投放</el-radio>
					<div  style="margin-top: 10px;">选择有助于您的商品针对买家搜索展示的关键词。</div>
				</div>
				<div  style="border-left: 2px solid rgb(205,206,209);padding-left: 10px;">
					<div>如果你知道买家在搜索与您商品类似的商品时所用的</div>
					<div  style="margin-top: 10px;">搜索词,请使用此策略。</div>
				</div>
			</div>
			<div style="display: flex;margin-top: 30px;">
				<div style="width: 60%;">
					<el-radio v-model="onTheType" label="2"  style="font-weight: bold;" @change="changeChild6">商品投放</el-radio>
					<div  style="margin-top: 10px;">选择特定商品,分类,品牌或其他商品功能来定位你的广告。</div>
				</div>
				<div style="border-left: 2px solid rgb(205,206,209);padding-left: 10px;">
					<div>使用此策略可帮助买家在亚马逊上浏览商品详情和分</div>
					<div  style="margin-top: 10px;">类或搜索时发现您的商品。</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				onTheType:'1'
			}
		},
		methods:{
			changeChild6(e){
				this.$emit('changeChild6',e)
			}
		},
	}
</script>

<style lang="less" scoped>
	@import '../css/common.less';
</style>
