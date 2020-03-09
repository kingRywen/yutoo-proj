<template>
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules'>
			<el-form-item prop='fixedValue' style='display:inline-block;'  label-width='50px'>
				<el-input  v-model.trim.number="formInline.fixedValue" placeholder="请输入" size='small'  style='width:450px;' clearable><template slot="prepend">($)</template></el-input>
			</el-form-item>	
        </el-form>
    </div>
</template>
<script>
import {priceValidate} from 'Utils/customValid'
export default {
    props:['params'],
    data() {
        return {
            rules:{
                fixedValue: [
                    { validator: priceValidate, trigger: ['blur'] , required: true, },
                ],
            },
            formInline:{
                fixedValue:null,
            },
        };
    },
    methods: {
        _submit(){
            return this.$refs.formInline.validate().then(()=>{
				let params = {
					...this.storeIds,
					campaignIds:this.params.row.map(e=>e.objectId),
					dailyBudget:this.formInline.fixedValue
				}
				return this.$api[`adCampaignUpdate`](params).then(data=>{
					return  Promise.resolve(true);
				})
			})
        },
    },
    created() {
		
    },
};
</script>

