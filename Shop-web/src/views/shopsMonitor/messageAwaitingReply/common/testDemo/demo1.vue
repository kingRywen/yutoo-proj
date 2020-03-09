<template>
	<div class="btn123" style="display: inline-block;">
		<el-cascader class="btnCascader" popper-class="btnCascaderItem" :value="topBatchBtnVal" :props="topBatchData.props"  placeholder="策略" :options="topBatchData.options" style="width: 150px;" @change="handleTopLeftBatchChange" size="small"></el-cascader>
	</div>
</template>

<script>
	export default {
		props:{
			adType:{
				type:Number,
				default:1
			}
		},
		data() {
			return {
				topBatchBtnVal: null,
				topBatchData: {
					props: {
						label: "label",
						value: "label",
						expandTrigger: "hover"
					},
					options: [
						{
							label: `${this.adType == 1 ? '调整预算' : '调整出价'}`,
							children: [
								{
									label: "新增"
								},
								{
									label: "编辑"
								},
								{
									label: "关闭"
								},
								{
									label: "开启"
								},
								{
									label: "删除"
								},
							]
						},
						{
							label: "否定词",
							children: [
								{
									label: "新增"
								},
								{
									label: "编辑"
								},
								{
									label: "关闭"
								},
								{
									label: "开启"
								},
								{
									label: "删除"
								},
							]
						},
						{
							label: "调价策略",
							children: [
								{
									label: "新增"
								},
								{
									label: "编辑"
								},
								{
									label: "关闭"
								},
								{
									label: "开启"
								},
								{
									label: "删除"
								},
							]
						},
						{
							label: "降CPC",
							children: [
								{
									label: "新增"
								},
								{
									label: "编辑"
								},
								{
									label: "关闭"
								},
								{
									label: "开启"
								},
								{
									label: "删除"
								},
							]
						},
						{
							label: `${this.adType == 3 ? '广告排名策略' : '广告产品暂停'}`,
							children: [
								{
									label: "新增"
								},
								{
									label: "编辑"
								},
								{
									label: "关闭"
								},
								{
									label: "开启"
								},
								{
									label: "删除"
								},
							]
						},
					],

				},
			}
		},
		methods: {
			handleTopLeftBatchChange(val) {
				this.topBatchBtnVal = [];
				this.$emit('changeAdStrategy',val)
			},
		},
		mounted(){
			let vm = this
			this.$nextTick(function(){
				if(vm.adType == 3) vm.topBatchData.options[4].children.splice(4,1)
			})
		}
	}
</script>

<style lang='scss'>
	.btn123 {
		/deep/ .el-input__inner::-webkit-input-placeholder {
			text-align: center;
			color: #4BA2D7;
		}

		.el-input__inner::-moz-placeholder {
			text-align: center;
			color: #4BA2D7;
		}

		.el-input__inner:-ms-input-placeholder {
			text-align: center;
			color: #4BA2D7;
		}
	}

	.btnCascader .el-cascader__label {
		border: 1px solid #b7daef !important;
		border-radius: 4px !important;
	}
	.btnCascaderItem .el-cascader-menu {
		min-width: 150px;
		min-height: 60px !important;
		text-align: center;
		.el-cascader-menu__item{
			color: rgb(75, 162, 215);
			margin-top: 4px;
		}
	}
</style>
