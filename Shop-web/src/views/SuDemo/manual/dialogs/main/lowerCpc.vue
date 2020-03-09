<template>
    <!-- 添加跟卖 -->
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules'>
			<div>		
				<el-form-item label="降价规则" prop='source' style='display:inline-block;'  label-width='120px'>
					<el-input  v-model.trim="formInline.fixedValue" placeholder="请输入" size='small'  style='width:170px;' clearable><template slot="prepend">$</template></el-input> / 
				</el-form-item>			
				<el-form-item label="" prop='operator' style='display:inline-block;' label-width='3px'>
					<el-input  v-model.trim="formInline.fixedValue" placeholder="请输入" size='small'  style='width:170px;' clearable><template slot="append">分</template></el-input>
				</el-form-item>
			</div>
			<div>
				<el-form-item label="降价规则" prop='source' style='display:inline-block;'  label-width='120px'>
					<el-input  v-model.trim="formInline.fixedValue" placeholder="请输入" size='small'  style='width:170px;' clearable><template slot="prepend">$</template></el-input> / 
				</el-form-item>			
				<el-form-item label="" prop='operator' style='display:inline-block;' label-width='3px'>
					<el-input  v-model.trim="formInline.fixedValue" placeholder="请输入" size='small'  style='width:170px;' clearable><template slot="append">分</template></el-input>
				</el-form-item>
			</div>
			<el-form-item label="排名稳定时间" prop='source'  label-width='120px'>
				<el-input  v-model.trim="formInline.fixedValue" placeholder="请输入" size='small'  style='width:350px;' clearable><template slot="append">分</template></el-input>
			</el-form-item>	
			<el-form-item label="排名误差范围" prop='source'  label-width='120px'>
				<el-select v-model="formInline.source" placeholder="请选择" size='small' style='width:350px;' clearable >
					<el-option
					v-for="item in priceOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop='source'  label-width='120px'>
				<span slot="label">
					<el-tooltip effect="light" placement="top-start">
					  <div slot="content">只作用于未抓取到到排名的情况下</div>
					  <i
						style="color: #108ee9;margin-right:4px"
						class="el-icon-question"
					  />
					</el-tooltip>排名抓取频率
				</span>
				<el-input  v-model.trim="formInline.fixedValue" placeholder="请输入" size='small'  style='width:350px;' clearable></el-input>
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
                source: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                operator: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                fixedValue: [
                    { validator: priceValidate, trigger: ['blur'] , required: true, },
                ],
            },
            formInline:{
                source:null,//价格来源
                operator:null,//算法
                fixedValue:null,//固定价格

            },
            priceOptions:[
                {label:"推荐最高价",value:0},
            ],
            price2Options:[
                {label:"加",value:0},
            ],
        };
    },
    methods: {
        _submit(){
            return this.$refs.formInline.validate().then(()=>{
				return this.$api[`adCampaignNegativeKeywordAddKeyword`](datas).then(data=>{
					return  Promise.resolve(true);
				})
			})
        },
    },
    created() {
		
    },
};
</script>

