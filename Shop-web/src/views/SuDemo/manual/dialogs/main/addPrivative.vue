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
		 	required: "adKeyword",
			placeholder:'请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号',
			rows:4,
			labelWidth:'90px'
		},
		
      ],

    };
  },
  methods: {
    _submit() {
        return this.$refs.form.validate().then(() => {
			if(this.formData.keywordQuerys){
				let newKeyword = this.formData.keywordQuerys.split(/\n/)
				delete this.formData.keywordQuerys
				this.formData.keywordTexts = newKeyword
			}
			let datas={
				platformId:this.platformId,
				siteId:this.siteId,
				sellerId:this.sellerId,	
				campaignIds:[this.formData.campaignIds],
				matchType:this.formData.matchType,
				keywordTexts:this.formData.keywordTexts,
			};
			return this.$api[`adCampaignNegativeKeywordAddKeyword`](datas).then(data=>{
				return  Promise.resolve(true);
			})	  

			
        });
    },
  },
  created(){
	 this.formData.keywordQuerys =  this.params.datas.join('\n')
  },
  computed:{
	 
  }
  
};
</script>

