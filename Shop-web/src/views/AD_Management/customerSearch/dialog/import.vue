<template>
    <div>
        <ImportFile :downloadParams = 'downloadParams' @success="handleSuccess" filename="客户搜索词模板" :data="downloadParams" :downloadApi="downloadApi" :action="action" />
    </div>
</template>

<script>
import { host } from "Config";
export default {
    props:['params'],
    data() {
		let vm = this
        return {
            ImportFileData:{
                
            },
            downloadApi: 'adKeywordQueryExportTemplate',
            action: `${host}adKeywordQuery/importData`,
        };
    },
    methods: {
        //导入数据成功
        handleSuccess({ res, file, fileList }) {
			if (res.code === 0) {
				GLOBAL.vbus.$emit("business.response.newSuccess", res);
				if( res.fail || res.ignore ){
					GLOBAL.vbus.$emit("business.response.newFalseMessage",res)	
				}else{
					this.params.fn()
					this.params.success()
				}							
			}else{
				this.$message.error(res.msg)
			}
        },
    },
	computed:{
		downloadParams(){
			return {
				...this.storeIds
			}			
		},
	}
};
</script>
