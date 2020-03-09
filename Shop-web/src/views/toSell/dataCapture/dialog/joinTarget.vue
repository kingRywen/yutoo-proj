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
		    label: "目标站点",
		    name: "siteId",
		    span: 24,
		    type: "select",
		    options: vm.getCountry,
		    required: true,
			labelWidth:'100px',
		},
      ],

    };
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
			let datas={
				...this.formData,
				asins:this.params.asins,
				sourceSiteId:this.siteId
			};
			if(this.params.taskId) datas.taskId = this.params.taskId
			let type = this.params.type
			return this.$api[`${type === 'outer' ? 'imSaleProdCheckSave' : 'imSaleProdCheckSaveTask'}`](datas).then(data=>{
				return  Promise.resolve(true);
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

