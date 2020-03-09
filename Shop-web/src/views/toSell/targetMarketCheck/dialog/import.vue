<template>
  <div>
    <yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
	<ImportFile :isAuto="false" @success="handleSuccess" filename="目标市场校验模板" :data="ImportFileData" :downloadApi="downloadApi" :action="action" ref="uploadChild" />
  </div>
</template>

<script>
import { host } from "Config";
export default {
  props: ["params"],
  data() {
	var vm = this
    return {
      formData: {},
	  ImportFileData:{},
	  downloadApi: 'imSaleProdCheckDownloadFile',
	  action: `${host}imSaleProdCheck/importData`,
      activeFields: [		  
        {
            label: '目标站点',
            name: 'siteId',
            span: 24,
            placeholder: '请选择目标站点',
            options: vm.getCountry,
            type: 'select',
            required: true
        },
      ],

    };
  },
  methods: {
    _submit() {
	  if(!this.$refs.uploadChild.fileList.length) return this.$message.warning('请选择要导入的文件')
      return this.$refs.form.validate().then(() => {
			let datas={
				...this.formData,
				...this.params,
				file:this.$refs.uploadChild.fileList
			};
			return this.$api[`imSaleProdCheckImportData`](datas).then(data=>{
				if(this.params.fn) this.params.fn()
			})	  		
      }).then(()=>{
			return Promise.resolve(true)
		})
    },
	handleSuccess({ res, file, fileList }) {

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

