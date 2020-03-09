<template>
	<div class="content">
		<div class="title">创建广告活动</div>
		<div class="mainForm">
			<el-form :model="formData" ref="formData" label-width="100px" label-position="top">
				<el-form-item label="广告系列名称" prop="name" :rules="{required:true,message:'请输入广告系列名称'}">
					<el-input v-model.trim="formData.name" size="small" style="width: 500px;"></el-input>
				</el-form-item>
				<el-form-item label="开始时间" prop="startDate" :rules="{required:true,message:'请选择开始时间'}">
					<el-date-picker v-model="formData.startDate" :picker-options="startPickerOptions" value-format="yyyy-MM-dd" type="date" size="small" style="width: 500px;" ></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="endDate">
					<el-date-picker v-model="formData.endDate" :picker-options="endPickerOptions" value-format="yyyy-MM-dd" type="date" size="small" style="width: 500px;" ></el-date-picker>
				</el-form-item>
				<el-form-item label="投放类型" prop="targetingType" :rules="{required:true,message:'请选择投放类型'}">
					<el-select v-model="formData.targetingType" size="small" style="width: 500px;" @change="typeChange">
						<el-option label="手动" value="manual" key="manual"></el-option>
						<el-option label="自动" value="auto" key="auto"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="每日预算" prop="dailyBudget" :rules="{required:true,message:'请输入每日预算'}">
					<el-input-number v-model.trim="formData.dailyBudget" size="small" style="width: 500px;" :controls="false" :precision='2'></el-input-number>
					<el-button @click="isShowBudget = !isShowBudget" style="margin-left: 20px;" type="primary" size="small" plain>{{isShowBudget ? '取消添加策略' : '添加预算优化策略'}}</el-button>
				</el-form-item>
			</el-form>
			<series1-child v-if="isShowBudget" ref="child"  />
		</div>
	</div>
</template>

<script>
	import dayjs from 'dayjs'
	import series1Child from 'Views/SuDemo/createAd/item/series1Child.vue'
	export default {
		data() {
			let vm = this
			return {
				formData:{
					name:null,
					startDate:dayjs().subtract(15, 'hour').format('YYYY-MM-DD'),
					endDate:null,
					targetingType:'auto',
					dailyBudget:null,
				},
				startPickerOptions:{
					disabledDate(time) {
						// 15 + 24
						let endTime = vm.formData.endDate && new Date(vm.formData.endDate).getTime() || null
						if(endTime) return time.getTime() > endTime || time.getTime() < Date.now() - 39 * 3600 * 1000		
					    return time.getTime() < Date.now() - 39 * 3600 * 1000
					}
				},
				endPickerOptions:{
					disabledDate(time) {
						let startTime = vm.formData.startDate && new Date(vm.formData.startDate).getTime() || null
						if(startTime) return time.getTime() < startTime - 24 * 3600 * 1000
					    return time.getTime() < Date.now() - 39 * 3600 * 1000
					}
				},
				isShowBudget:false,
			}
		},
		methods:{
			validateFn(){
				let {formData,child} = this.$refs
				let forms = [formData,child].filter(e=>e!=null)
				return Promise.all(forms.map(e=>e.validate())).then((res)=>{
					let {...adCampaign} = this.formData
					if(res && res.length == 2){
						let obj2 = this.deepCopyGlobal(res[1])
						delete obj2.totalBid
						delete obj2.totalBidList
						return {
							adCampaign,
							adCampaignStrategy:obj2
						}
					}else{
						return {
							adCampaign
						}
					}
				})
			},
			typeChange(e){
				this.$emit('changeChild1',e)
			}
		},
		components:{
			series1Child
		}
	}
</script>

<style lang="less" scoped>
	@import '../css/common.less';
</style>
