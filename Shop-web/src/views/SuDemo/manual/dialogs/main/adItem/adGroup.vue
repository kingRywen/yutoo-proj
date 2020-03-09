<template>
    <!-- 添加跟卖 -->
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width='90px'>
			<el-form-item label="广告组名称" prop='name'>
				<el-input  v-model.trim="formInline.name" placeholder="请输入广告组名称" size='small'  style='width:510px;' clearable></el-input>				
			</el-form-item>
			<el-form-item label="默认竞价" prop='defaultBid'>
				<el-input  v-model.trim.number="formInline.defaultBid" placeholder="请输入默认竞价" size='small'  style='width:510px;' clearable></el-input>				
			</el-form-item>
			<el-form-item label="计算公式" prop='source' style='display:inline-block;width:170px;'>
				<el-select v-model="formInline.source" placeholder="请选择" size='small' style='width:150px;' clearable >
					<el-option
					v-for="item in priceOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="" prop='operator' style='display:inline-block;width:170px;'>
				<el-select v-model="formInline.operator" placeholder="请选择" size='small' style='width:150px;' clearable>
					<el-option
					v-for="item in price2Options"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="" prop='fixedValue' style='display:inline-block;width:190px;'>
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
				name: [
				    { required: true, message: '请输入广告组名称', trigger: 'blur' },
				],
				defaultBid: [
				    { validator: priceValidate, trigger: ['blur'] , required: true, },
				],
            },
            formInline:{
				name:'',
				defaultBid:null,//默认竞价
                source:null,//价格来源
                operator:null,//算法
                fixedValue:null,//固定价格

            },
            priceOptions:[
                {label:"推荐最高价",value:0},
                {label:"推荐最低价",value:1},
				{label:"建议竞价",value:2},
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
				let form = this.formInline
				let params = {
					...this.storeIds,
					adGroupId:this.params.objectId,
					name:form.name,
					defaultBid:form.defaultBid,
					propertyType:form.source,
					operator:form.operator,
					value:form.fixedValue
				}
				return this.$api[`adGroupUpdateToCustom`](params).then(data=>{
					return  Promise.resolve(true);
				})				
            })
        },
    },
    created() {
    	let vm = this
    	this.$nextTick(function(){
    		this.$api['adGroupInfoToCustom']({...vm.storeIds,adGroupId:vm.params.objectId}).then((e)=>{
				let data = e.data
				vm.formInline = {
					name:data.name,
					defaultBid:data.defaultBid,
					source:data.propertyType,
					operator:data.operator,
					fixedValue:data.value,
				}
    		})
    	})
    },
};
</script>

