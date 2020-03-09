<template>
	<yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default{
	props:['params'],
	data(){		
		return{
			formData: {},
			activeFields: [
			  {
				label: "品牌类型",
				name: "brandType",
				span: 24,
				type: "select",
				options: [
					{label: "仅广告",value: 1},
					{label: "可布局",value: 2},
				],
				required: true
			  },
			],
		}
	},
	methods:{
		_submit(){
			return this.$refs.form.validate().then(() => {
				  let params = {
					  ...this.formData,
					  serialNumbers:this.params.serialNumbers
				  }
				  return this.$api['brandManageUpdateBrandType'](params).then(()=>{
				      return  Promise.resolve("reset");
				  })
			})		
		},
	},
}
</script>

<style lang='scss' scoped>
</style>
