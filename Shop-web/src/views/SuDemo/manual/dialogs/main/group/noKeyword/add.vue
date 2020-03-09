<template>
	<div>
		<yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
		<div v-if="isShowError" style="color: #f56c6c;font-size: 12px;margin-left: 90px;">否定词只能输入字母、数字、单引号,请重新编辑留下的否定词!</div>
	</div>
</template>

<script>
	export default {
		props: ["params"],
		data() {
			var vm = this
			return {
				formData: {
					keywordQuerys: ''
				},
				activeFields: [
					{
						label: "否定词类型",
						name: "matchType",
						span: 24,
						type: "select",
						options: [{
								label: '精确否定',
								value: 'negativeExact'
							},
							{
								label: '词组否定',
								value: 'negativePhrase'
							},
						],
						required: true,
						labelWidth: '90px'
					},
					{
						label: "否定词",
						name: "keywordQuerys",
						span: 24,
						type: "textarea",
						required: true,
						placeholder: '多个换行输入',
						rows: 4,
						labelWidth: '90px'
					},

				],
				isShowError:false,
			};
		},
		methods: {
			_submit() {
				return this.$refs.form.validate().then(() => {
					if (this.formData.keywordQuerys) {
						let newKeyword = this.moreRowText(this.formData.keywordQuerys)
						delete this.formData.keywordQuerys
						this.formData.keywordTexts = newKeyword
					}
					let datas = {
						platformId: this.platformId,
						siteId: this.siteId,
						sellerId: this.sellerId,
						campaignIds : [this.$route.query.groupObjectId],
						matchType: this.formData.matchType,
						keywordTexts: [],
					};
					
					
					
					
					//验证   失败的留下
					let reg = /^[ A-Za-z0-9\'-]*$/
					let failList = []
					this.formData.keywordTexts.forEach((e)=>{
						if(reg.test(e)){
							datas.keywordTexts.push(e)
						}else{
							failList.push(e)
						}
					})
					
					//如果没有成功的  就不调接口
					if(datas.keywordTexts && datas.keywordTexts.length==0){
						this.setDataMethod(failList)					
						return
					}	
													
					return this.$api['adCampaignNegativeKeywordAddKeyword1'](datas).then(data => {
						if(failList.length == 0){
							this.isShowError = true
							return  Promise.resolve(true);
						}else{
							this.setDataMethod(failList)					
						}	
					}).catch(()=>{
						this.setDataMethod(failList)
					})
				});
			},
			setDataMethod(arr){
				if(arr && arr.length){
					this.$set(this.formData,'keywordQuerys',arr.join('\n'))
					this.isShowError = true
				}	
			}
		},
	};
</script>

<style>
</style>
