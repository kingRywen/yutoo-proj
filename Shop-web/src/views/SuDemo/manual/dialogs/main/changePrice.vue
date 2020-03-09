<template>
    <!-- 添加跟卖 -->
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width='70px'>
			<el-form-item label="原始出价" prop='source' style='display:inline-block;width:150px;'>
				<el-select v-model="formInline.source" placeholder="请选择" size='small' style='width:130px;' clearable >
					<el-option
					v-for="item in priceOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="" prop='operator' style='display:inline-block;width:150px;'>
				<el-select v-model="formInline.operator" placeholder="请选择" size='small' style='width:130px;' clearable>
					<el-option
					v-for="item in price2Options"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="" prop='operator' style='display:inline-block;width:190px;'>
				<el-input  v-model.trim="formInline.fixedValue" placeholder="请输入固定值" size='small'  style='width:170px;' clearable><template slot="append">$</template></el-input>				
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
                    { validator: priceValidate, trigger: ['blur','change'] , required: true, },
                ],
            },
            formInline:{
                source:null,//价格来源
                operator:null,//算法
                fixedValue:null,//固定价格

            },
            priceOptions:[
                {label:"推荐最高价",value:0},
                {label:"推荐最低价",value:1},
				{label:"自定义价格",value:2},
            ],
            price2Options:[
                {label:"加",value:0},
                {label:"减",value:1},
                {label:"乘",value:2},
                {label:"除",value:3},
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

