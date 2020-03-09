<template>
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules'>
			<el-form-item prop='fixedValue' style='display:inline-block;'  label-width='50px'>
				<el-input  v-model.trim="formInline.fixedValue" placeholder="请输入" size='small'  style='width:450px;' clearable><template slot="prepend">($)</template></el-input>
			</el-form-item>	
        </el-form>
    </div>
</template>
<script>

export default {
    props:['params'],
    data() {
		let priceValidate = (rule, value, cb) => {
			if (!value)	return cb(new Error('请输入价格'));
			if(isNaN(Number(value))) return cb(new Error('请输入数字'));
			if(value < 0.02 || value > 1000) return cb(new Error('请输入在0.02~1000之间的数字')); 
			cb()
		}
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
					bid:this.formInline.fixedValue
				}
				if(this.params.adFlag == 1){
					params.targetIds = this.params.data
				}else{
					params.keywordIds = this.params.data
				}
				return this.$api[`${this.params.adFlag == 1 ? 'adTargetUpdate' : 'adKeywordUpdate'}`](params).then(data=>{
					return  Promise.resolve(true);
				})
			})
        },
    },
    created() {
		
    },
};
</script>

