<template>
	<div>
		<el-form :label-position="labelPosition" label-width="70px" :model="formData" ref='form' :rules="rules">
			<el-form-item label="监控频率" prop='frequency'>
				<el-input v-model.number="formData.frequency" style="width: 150px;" size="small"></el-input>
				<el-select v-model="formData.unit" style="width: 100px;margin-left: 20px;" size="small">
					<el-option v-for="item in timeList" :label="item.label" :key="item.value" :value="item.value"></el-option>
				</el-select>
			</el-form-item>		
		</el-form>
	</div>
</template>

<script>
export default{
	props:['params'],
	data(){		
		var checkFre = (rule,value,callback) => {
			if(!value) return callback(new Error('请输入值'))
			if(!Number.isInteger(value)){
				callback(new Error('请输入数字'))
			}else{
				callback()
			}
		}
		return{
			labelPosition:'right',
			formData:{
				frequency:'',
				unit:null,
			},
			timeList:[
				{label:'分钟',value:'min'},
				{label:'小时',value:'h'},
				{label:'天',value:'d'}
			],
			rules:{
				frequency:[
					{validator:checkFre,trigger:'blur'}
				],
				unit:[
					{required:true,message:'请选择单位',trigger:'blur'}
				],
			}
		}
	},
	methods:{
		_submit(){
			return this.$refs.form.validate().then(() => {
				  let params = {
					  sellerId:this.sellerId,
					  siteId:this.siteId,
					  platformId:this.platformId,
					  ...this.formData,
				  }
				  return this.$api['newTaskAdDataFrequencyUpdate'](params).then(()=>{
				      return  Promise.resolve("reset");
				  })
			})		
		},
		init(){
			let params = {
				sellerId:this.sellerId,
				siteId:this.siteId,
				platformId:this.platformId,
			}
			this.$api['newTaskAdDataFrequencyInfo'](params).then((res)=>{
				this.formData.frequency = res.data.frequency
				this.formData.unit = res.data.unit
			})
		},
	},
	mounted(){
		this.init()
	},
}
</script>

<style lang='scss' scoped>
</style>

