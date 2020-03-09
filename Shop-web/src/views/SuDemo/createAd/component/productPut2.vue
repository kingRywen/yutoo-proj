<template>
	<div class="content">
		<div class="title">可选:否定商品投放</div>
		<div style='width:50%;min-width:450px;margin-top:20px;padding-bottom:10px;'>
		    <el-tabs type="border-card" v-model="activeName">
		        <el-tab-pane label="排除品牌" name="1">
					<el-form :model="formData1" ref="formData1" label-width="100px" label-position="top">
						<el-form-item prop="brands">
							<el-input
							    type="textarea"
							    :rows="25"
							    placeholder="请输入内容"
							    v-model="formData1.brands">
							</el-input>
						</el-form-item>
					</el-form>		            
		        </el-tab-pane>
		        <el-tab-pane label="排除SKU" name="2">
		            <el-form :model="formData2" ref="formData2" label-width="100px" label-position="top">
		            	<el-form-item prop="asins" >
		            		<el-input
		            		    type="textarea"
		            		    :rows="25"
		            		    placeholder="请输入内容"
		            		    v-model="formData2.asins">
		            		</el-input>
		            	</el-form-item>
		            </el-form>
		        </el-tab-pane>
		    </el-tabs>
		</div>
	</div>
    
</template>

<script>
export default {
    data() {
        return {
            activeName : '1',
			formData1:{
				brands: null,
			},
            formData2:{
				asins : null,
			}
            
        };
    },
    methods: {
		validateFn(){
			let params = {}
			if(this.formData1.brands) params.brands = this.moreRowText(this.formData1.brands)
			if(this.formData2.asins) params.asins = this.moreRowText(this.formData2.asins)
			if(Object.keys(params).length == 0){
				return Promise.resolve(null)
			}else{
				return Promise.resolve(params)
			}
			
		}
    },
};
</script>

<style scoped lang="less">
	@import '../css/common.less';
</style>
