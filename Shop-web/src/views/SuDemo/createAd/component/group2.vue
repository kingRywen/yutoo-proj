<template>
	<div class="content">
		<div class="title">竞价</div>
		<div class="mainForm">
			<el-form :model="formData" ref="formData" label-width="100px" label-position="top">
				<el-form-item prop='defaultBid' :rules="defaultBidRule()">
					<span slot="label"><span style="color: #f56c6c;margin-right: 4px;">*</span>默认竞价</span>
					<el-input v-model.trim="formData.defaultBid"  size='small'  style='width:500px;'  clearable></el-input>				
				</el-form-item>
				<el-form-item prop='propertyType' style='display:inline-block;width:170px;' :rules="propertyTypeRule()">
					<el-select v-model="formData.propertyType" size='small' style='width:150px;' clearable >
						<el-option
							v-for="item in priceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="" prop='operator' style='display:inline-block;width:170px;'  :rules="operatorRule()">
					<el-select v-model="formData.operator" size='small' style='width:150px;' clearable>
						<el-option
							v-for="item in price2Options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="" prop='value' style='display:inline-block;width:490px;' :rules="valueRule()">
					<el-input  v-model.trim="formData.value" size='small'  style='width:160px;' clearable><template slot="append">$</template></el-input>	
					<el-button @click="isShowBudget = !isShowBudget" style="margin-left: 20px;" type="primary" size="small" plain>{{isShowBudget ? '取消添加策略' : '添加CPC优化策略'}}</el-button>			
				</el-form-item>
			</el-form>
			<group2-child v-if="isShowBudget" ref="child"  />
		</div>
	</div>
</template>

<script>
	import group2Child from 'Views/SuDemo/createAd/item/group2Child.vue'
	export default {
		data() {
			return {
				formData:{
					defaultBid:null,
					propertyType:null,
					operator:null,
					value:null,
				},
				priceOptions:[
				    {label:"推荐最高价",value:0},
				    {label:"推荐最低价",value:1},
					{label:"建议竞价",value:2},
				],
				price2Options:[
				    {label:"加",value:0},
				    {label:"减",value:1},
				    {label:"乘",value:2},
				    {label:"除",value:3},
				],
				isShowBudget:false,
			}
		},
		watch:{
			'formData':{
				handler(val){
					if(!val.propertyType && !val.operator && !val.value){
						this.$refs.formData.clearValidate(['propertyType','operator','value'])
					}
				},
				deep:true
			}
		},
		methods:{
			validateFn(){
				let {formData,child} = this.$refs
				let forms = [formData,child].filter(e=>e!=null)
				return Promise.all(forms.map(e=>e.validate())).then((res)=>{
					let {...obj1} = this.formData
					if(res && res.length == 2){
						let obj2 = this.deepCopyGlobal(res[1])
						delete obj2.totalBid
						delete obj2.totalBidList
						delete obj2.bidType
						delete obj2.defaultAddBid
						return {
							obj1,
							adGroupStrategy:obj2
						}
					}else{
						return {
							obj1
						}
					}
				})
			},
			defaultBidRule(item, index) {
				let check = (rule, value, cb) => {
					if (!this.formData.defaultBid) return cb(new Error('请输入默认竞价'))
					let reg = /^\d+(\.\d+)?$/
					if(!reg.test(this.formData.defaultBid)) return cb(new Error('请输入数字'))
					cb()
				}
				return [{
					validator: check
				}]
			},
			propertyTypeRule(){
				let check = (rule, value, cb) => {
					let form = this.formData
					if ((form.propertyType || form.operator || form.value) && !form.propertyType) return cb(new Error('请选择类型'))
					cb()
				}
				return [{
					validator: check
				}]
			},
			operatorRule(){
				let check = (rule, value, cb) => {
					let form = this.formData
					if ((form.propertyType || form.operator || form.value) && !form.operator && form.operator !== 0) return cb(new Error('请选择运算符'))
					cb()
				}
				return [{
					validator: check
				}]
			},
			valueRule(){
				let check = (rule, value, cb) => {
					let form = this.formData
					if ((form.propertyType || form.operator || form.value) && !form.value) return cb(new Error('请输入值'))
					if(!form.value) cb()
					let reg = /^\d+(\.\d+)?$/
					if(!reg.test(form.value)) return cb(new Error('请输入数字'))
					cb()
				}
				return [{
					validator: check
				}]
			},
		},
		components:{
			group2Child
		}
	}
</script>

<style lang="less" scoped>
	@import '../css/common.less';
</style>
