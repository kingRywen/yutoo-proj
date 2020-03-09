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
      formData: {},
      activeFields: [
		{
		    label: "任务名称",
		    name: "taskName",
		    span: 24,
		    type: "input",
		    required: true,
			labelWidth:'100px',
		},
		{
		    label: "店铺所属站点",
		    name: "sellerSiteId",
		    span: 24,
		    type: "select",
		    options: vm.getCountry,
		    required: true,
			labelWidth:'100px',
		},
		{
		 	label: "店铺ID",
		 	name: "sellerId",
		 	span: 24,
		 	type: "textarea",
		 	required: "keyword",
			labelWidth:'100px',
			placeholder:'多个换行输入'
		},
		{
		  label: "抓取页数",
		  name: "searchPages",
		  span: 24,
		  type: "input",
		  required:'justNumber',
		  labelWidth:'100px',
		},
		{
		    label: "运送国家",
		    name: "shippingCountries",
		    span: 24,
		    type: "select",
		    options: vm.getCountry1,
			multi:true,
		    required: true,
			labelWidth:'100px',
		},
      ],

    };
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
			if(this.formData.sellerId){
				let newKeyword = this.formData.sellerId.split(/\s+/).map(el => el.trim()).filter(el => el !== '');
				this.formData.sellerIds = newKeyword
			}
			let datas={
				...this.formData,
				...this.params,
			};
			delete datas.sellerId
			datas.searchPages = parseInt(datas.searchPages)
			return this.$api[`taskSaleSellerSave`](datas).then(data=>{
				return  Promise.resolve("reset");
			})	  

			
      });
    },
	getCountry(){
		return this.$api['siteListSite1']().then((res)=>{
			return res.data.map(el => {
				return {
					label:el.siteName,
					value:el.siteId
				}
			})
		})
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

