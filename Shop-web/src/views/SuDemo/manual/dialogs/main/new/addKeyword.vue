<template>
    <div>
        <el-form :label-position="'right'" :model="formData" ref='formData'  :rules='rules'>
			<el-form-item label="否定品牌" prop='brands'  label-width='80px'>
				<el-input  v-model.trim="formData.brands" placeholder="请输入否定品牌,每行一个"  style='width:450px;' type='textarea' rows="4" ></el-input>
			</el-form-item>	
			<el-form-item label="ASIN" prop='asins'  label-width='80px'>
				<el-input  v-model.trim="formData.asins" placeholder="请输入ASIN,每行一个"  style='width:450px;' type='textarea' rows="4" ></el-input>
			</el-form-item>	
        </el-form>
    </div>
</template>
<script>
import {asinValidateNull} from 'Utils/customValid'
export default {
    props:['params'],
    data() {
        return {
            rules:{
				asins: [
				    { validator: asinValidateNull, trigger: ['blur'] },
				],
            },
            formData:{
                brands:null,
				asins:null,
            },
        };
    },
    methods: {
        _submit(){
			if(!this.formData.brands && !this.formData.asins) return this.$message.warning('请输入至少一个')
            return this.$refs.formData.validate().then(()=>{
				let params = {
					...this.storeIds,
					adGroupId:this.params.adGroupId[0],
					negativeTarget:{
						brands: this.formData.brands ? this.moreRowText(this.formData.brands) :null,
						asins: this.formData.asins ? this.moreRowText(this.formData.asins) : null,
					}
				}
				return this.$api[`adNegativeTargetSave`](params)
			})
        },
    },
    created() {
		
    },
};
</script>

