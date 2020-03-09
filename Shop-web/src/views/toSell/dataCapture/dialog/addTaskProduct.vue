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
		  asin:'',
	  },
      activeFields: [
		{
		    label: "任务名称",
		    name: "taskName",
		    span: 24,
		    type: "input",
		    required: true,
			// disabled:false,
		},
		{
		 	label: "产品ASIN",
		 	name: "asin",
		 	span: 24,
		 	type: "textarea",
		 	required: "asin",
			placeholder:'多个换行输入'
		},
		{
		    label: "运送国家",
		    name: "shippingCountries",
		    span: 24,
		    type: "select",
		    options: vm.getCountry1,
			multi:true,
		    required: true,
		},
      ],

    };
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
			if(this.formData.asin){
				let newKeyword = this.formData.asin.split(/\s+/).map(el => el.trim()).filter(el => el !== '');
				this.formData.asins = newKeyword
			}
			let datas={
				...this.formData,
				...this.params,
			};
			delete datas.asin
			// taskSaleProductReExecute
			return this.$api[`${this.params.edit ? 'taskSaleProductReSave' : 'taskSaleProductSave'}`](datas).then(data=>{
				return  Promise.resolve(true);
			})	  

			
      });
    },
	getCountry1(){
		return this.$api['siteListCountry1']().then((res)=>{
			return res.data.map(el => {
				return {
					label:el.countryName,
					value:el.siteId
				}
			})
		})
	}
  },
  created(){
	if(this.params.edit){
		// this.activeFields[0].disabled = true
		this.formData.taskName = this.params.name
		this.formData.asin =  this.params.asins.join('\n')
	}
  },
  computed:{
	  siteId(){
		  return this.params.siteId
	  }
  }
  
};
</script>

<style>
</style>

