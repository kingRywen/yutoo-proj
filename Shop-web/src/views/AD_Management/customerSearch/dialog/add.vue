<template>
  <div>
    <yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
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
		    label: "选择系列",
		    name: "campaignIds",
		    span: 24,
		    type: "select",
		    options: vm.getCountry1,
		    required: true,
			labelWidth:'90px',
			filterable:true,
			placeholder:'请输入或选择系列',
			multi:true,
			onChange:(e,data)=>{
				vm.getGroupMethod(e,data)
			}
		},
		{
		    label: "选择组",
		    name: "adGroupIds",
		    span: 24,
		    type: "select",
		    options: [],
			labelWidth:'90px',
			filterable:true,
			placeholder:'请输入或选择组',
			multi:true,
		},
		{
		    label: "否定词类型",
		    name: "matchType",
		    span: 24,
		    type: "select",
		    options: [
				{label:'精确否定',value:'negativeExact'},
				{label:'词组否定',value:'negativePhrase'},
			],
		    required: true,
			labelWidth:'90px'
		},
		{
		 	label: "关键词",
		 	name: "keywordQuerys",
		 	span: 24,
		 	type: "textarea",
		 	required: true,
			placeholder:'请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号',
			rows:4,
			labelWidth:'90px'
		},
		
      ],

    };
  },
  methods: {
	getGroupMethod(e,data){
		this.activeFields[1].options = []
		let params = {campaignIds:data && data.length ? data : null,adType:1,platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId,stateArr:['enabled'],}
		this.$api['adKeywordQueryAdDataOption'](params).then((res)=>{
			res.data.forEach(el => {
				this.activeFields[1].options.push({
					label:el.name,
					value:el.id
				})
			})
		})
	},
    _submit() {
      return this.$refs.form.validate().then(() => {
			if(this.formData.keywordQuerys){				
				let newKeyword = this.moreRowText(this.formData.keywordQuerys)
				delete this.formData.keywordQuerys
				this.formData.keywordTexts = newKeyword
			}
			let datas={
				platformId:this.platformId,
				siteId:this.siteId,
				sellerId:this.sellerId,	
				campaignIds:this.formData.campaignIds,
				adGroupIds:this.formData.adGroupIds,
				matchType:this.formData.matchType,
				keywordTexts:[]
			};
			let url = 'adCampaignNegativeKeywordAddKeyword'
			if(datas.adGroupIds && datas.adGroupIds.length){
				delete datas.campaignIds
				url = 'adNegativeKeywordAddKeyword'
			}else{
				delete datas.adGroupIds
			}
			
			//验证   失败的留下
			let reg = /^[ A-Za-z0-9\']*$/
			let failList = []
			this.formData.keywordTexts.forEach((e)=>{
				if(reg.test(e)){
					datas.keywordTexts.push(e)
				}else{
					failList.push(e)
				}
			})
					
			// if(datas.keywordTexts && datas.keywordTexts.length==0) datas.keywordTexts = null
			if(datas.keywordTexts && datas.keywordTexts.length==0){
				if(failList && failList.length){
					this.$set(this.formData,'keywordQuerys',failList.join('\n'))
				}
				this.$notify.error({
				    title: '提示',
				    message: '关键词只能输入字母、数字、单引号,请重新编辑留下的关键词!'
				});
				return
			}		
			
			
			return this.$api[url](datas).then(data=>{
				if(failList.length == 0){
					this.params.fn()
					return  Promise.resolve('close');
				}else{
					if(failList && failList.length){
						this.$set(this.formData,'keywordQuerys',failList.join('\n'))
					}
					this.$notify.error({
					    title: '提示',
					    message: '关键词只能输入字母、数字、单引号,请重新编辑留下的关键词!'
					});
				}							
			}).catch(()=>{
				if(failList && failList.length){
					this.$set(this.formData,'keywordQuerys',failList.join('\n'))
					this.$notify.error({
					    title: '提示',
					    message: '关键词只能输入字母、数字、单引号,请重新编辑留下的关键词!'
					});
				}
			})				
      });
    },
	getCountry1(){
		let params = {adType:0,platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId,stateArr:['enabled'],}
		return this.$api['adKeywordQueryAdDataOption'](params).then((res)=>{
			return res.data.map(el => {
				return {
					label:el.name,
					value:el.id
				}
			})
		})
	}
  },
  created(){
	 this.formData.keywordQuerys =  this.params.datas.join('\n')
  },
  computed:{
	 
  }
  
};
</script>

<style>
</style>

