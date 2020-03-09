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
            label: '选择类目',
            name: 'pcid',
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
      ],

    };
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
			let newPcid = this.formData.pcid.slice(0).pop()
			delete this.formData.pcid
			this.formData.pcid = newPcid
			let datas={
				...this.formData,
				...this.params,
			};
			return this.$api[`imSaleProdCheckUpdateCate`](datas).then(data=>{
				if(data.code == 0) this.params.fn()
				
			})	  			
      }).then(()=>{
		  return  Promise.resolve(true);
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
  computed:{
	  siteId(){
		  return this.params.siteId
	  }
  }
  
};
</script>

<style>
</style>

