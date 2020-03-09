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
		    required: true
		},
		{
		    label: "数据类型",
		    name: "dataType",
		    span: 24,
		    type: "select",
		    options: [
				{label:"类目",value:0 },
				{label:"关键词+类目",value:1},
		    ],
		    required: true,
			onChange:(a,b,c)=>{
				if(b == 0){
					if(this.activeFields[3].label == '关键词'){
						this.activeFields.splice(3,1)
					}
				}else{
					this.activeFields.splice(3,0,{
						label: "关键词",
						name: "keyword",
						span: 24,
						type: "textarea",
						required: "keyword",
						placeholder:'多个换行输入',
						rows:4
					})
				}
			}
		},		  
        {
            label: '类目',
            name: 'pcids',
            span: 24,
            placeholder: '请选择类目',
            options: vm.loadTree,
            bind: {
              label: 'name',
              value: 'pcid',
              children: 'childs',
              enabled: 'enabled'
            },
            type: 'cascader',
            required: true
        },
		{
		  label: "搜索页数",
		  name: "searchPages",
		  span: 24,
		  type: "input",
		  required:'justNumber',
		},
        {
            label: "运送国家",
            name: "shippingCountries",
            span: 24,
            type: "select",
            options: vm.getCountry,
			multi:true,
            required: true,
        },
      ],

    };
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
			
			let {keyword,taskName,dataType,pcids,searchPages,shippingCountries} = JSON.parse(JSON.stringify(this.formData))
			let keywords = null  
			if(keyword){
				keywords = keyword
					.split(/[\n|\r\n|\,|\，]/)
					.map(el => el.trim())
					.filter(el => el !== '');
			}
			
			let pcid = this.formData.pcids.slice(0).pop()
			
			let datas={
				pcid,
				taskName,
				dataType,
				searchPages,
				shippingCountries,
				...this.params,
			};
			if(keyword) datas.keywords = keywords
			datas.searchPages = parseInt(datas.searchPages)
			return this.$api[`taskSaleSiteSave`](datas).then(data=>{
				return  Promise.resolve("reset");
			})	  

			
      });
    },
	getCountry(){
		return this.$api['siteListCountry1']().then((res)=>{
			return res.data.map(el => {
				return {
					label:el.countryName,
					value:el.siteId
				}
			})
		})
	},
	loadTree(id = [0], selEl, itemDisabled) {
	  if (!selEl) {
	    selEl = {
	      pcid: 0
	    }
	  }
	  let { pcid } = selEl
	  let params = {
	    parentPcid:pcid,
	    siteId: this.siteId,
	    platformId: this.platformId
	  }
	  return this.$api[`GetCateList`](params)
	    .then(data => {
	      if (data && data.code && data.code !== 0) {
	        this.$message.error(data.msg)
	        return
	      }
	      
	
	      return data.data.map(el => {
	        return {
	          ...el,
	          childs: el.haveChildren ? [] : null,
	          enabled: true,
	          isLeaf: !el.haveChildren
	        }
	      })
	    })
	    .catch(() => {})
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

