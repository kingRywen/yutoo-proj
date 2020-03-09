<template>
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width="100px">
			<el-form-item label="任务名称" prop="taskName" style="width:100%;">
			    <el-input type="text" v-model.trim="formInline.taskName" style="width:90%;" placeholder="请输入任务名称" size="small" />
			</el-form-item>
			<el-form-item label="数据类型" prop="dataType" style="width:100%;">
				<el-select v-model="formInline.dataType"  style="width:90%;" size="small" placeholder="请选择数据类型">
					<el-option v-for="item in dataTypeList" :label="item.label" :value="item.value" :key="item.value" ></el-option>
				</el-select>
			</el-form-item>
			
			<!-- 产品asin链接 -->
			<el-form-item label="产品ASIN" prop="dataSource0" style="width:100%;" v-if="formInline.dataType === 0">
			    <el-input type="textarea" rows="3" v-model.trim="formInline.dataSource0" style="width:90%;" placeholder="请输入产品ASIN,多个换行输入" size="small" />
			</el-form-item>
			
			<!-- 关键词 -->
			<el-form-item label="关键词" prop="dataSource1" style="width:100%;" v-if="formInline.dataType === 1">
			    <el-input type="textarea" rows="3" v-model.trim="formInline.dataSource1" style="width:90%;" placeholder='请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号' size="small" />
			</el-form-item>
			<el-form-item label="搜索页数" prop="searchPages1" style="width:100%;" v-if="formInline.dataType === 1">
			    <el-select v-model="formInline.searchPages1"  style="width:90%;" size="small" placeholder="请选择搜索页数">
			    	<el-option v-for="item in pagesList" :label="item" :value="item" :key="item" ></el-option>
			    </el-select>
			</el-form-item>
			
			<!-- 类目 -->
			<el-form-item prop="dataSource2" style="width:100%;" v-if="formInline.dataType === 2">
				<span slot="label"><span style="color: #f56c6c;margin-right: 4px;">*</span>类目</span>
			    <el-cate width="90%"  :HaveChildform.sync="haveChildren" :CategoryId.sync="formInline.dataSource2" :platformId="platformId"></el-cate>
			</el-form-item>
			<el-form-item label="搜索页数" prop="searchPages2" style="width:100%;" v-if="formInline.dataType === 2">
			    <el-select v-model="formInline.searchPages2"  style="width:90%;" size="small" placeholder="请选择搜索页数">
			    	<el-option v-for="item in pagesList" :label="item" :value="item" :key="item" ></el-option>
			    </el-select>
			</el-form-item>
			
			<!-- TOP10000链接 -->
			<el-form-item label="TOP100链接" prop="dataSource3" style="width:100%;" v-if="formInline.dataType === 3">
			    <el-input type="textarea" rows="3" v-model.trim="formInline.dataSource3" style="width:90%;" placeholder="请输入TOP100链接,多个换行输入" size="small" />
			</el-form-item>
			
        </el-form>
    </div>
</template>
<script>
import { adKeywordsValidate,urlValidate,asinValidate } from 'Utils/customValid'
export default {
    props:['params'],
    data() {
		var category_validate = (rule, value, callback) => {
		  this.$nextTick(() => {
			if(!this.formInline.dataSource2) callback(new Error("请选择类目"));
		    if (this.haveChildren !== 0) {
		      callback(new Error("请选择最后一级类目"));
		    } else {
		      callback();
		    }
		  });
		}
        return {
			formInline:{
				taskName:null,
				dataType:null,
				dataSource0:null,
				dataSource1:null,
				searchPages1:null,
				dataSource2:null,
				searchPages2:null,
				dataSource3:null
			},
            rules:{
                taskName: [
                    { trigger: ['blur'] , required: true, message:'请输入任务名称' },
                ],
				dataType: [
				    { trigger: ['blur'] , required: true, message:'请选择数据类型' },
				],
				dataSource0: [
					{ validator: asinValidate, trigger: ["blur"] },
				    { trigger: ['blur'] , required: true, message:'请输入ASIN' },
				],
				dataSource1: [
					{ validator: adKeywordsValidate, trigger: ["blur"] },
					{ trigger: ['blur'] , required: true, message:'请输入关键词' },
				],
				dataSource2:[
					{ validator: category_validate, trigger: ["blur"] },
				],
				dataSource3: [
					{ validator: urlValidate, trigger: ["blur"] },
				    { trigger: ['blur'] , required: true, message:'请输入链接' },
				],
				searchPages1: [
				    { trigger: ['blur'] , required: true, message:'请选择搜索页数' },
				],
				searchPages2: [
				    { trigger: ['blur'] , required: true, message:'请选择搜索页数' },
				],
            },
			haveChildren:'',
			dataTypeList:[
				{label:'产品ASIN',value:0},
				{label:'关键词',value:1},
				{label:'类目',value:2},
				{label:'TOP100链接',value:3},
			],
            pagesList:[1,2,3,4,5,6,7,8,9,10],
        };
    },
    methods: {
        _submit(){
            return this.$refs.formInline.validate().then(()=>{
				let form = this.formInline
				let params = {
					...this.storeIds,
					...this.params,
					taskName:form.taskName,
					dataType:form.dataType,					
				}
				switch(form.dataType){
					case 0:
						params.dataSourceList = this.moreRowText(form.dataSource0)
					break;
					case 1:
						params.dataSourceList = this.moreRowText(form.dataSource1)
						params.searchPages = form.searchPages1
					break;
					case 2:
						params.dataSourceList = [form.dataSource2]
						params.searchPages = form.searchPages2
					break;
					case 3:
						params.dataSourceList = this.moreRowText(form.dataSource3)
					break;
				}
				return this.$api[`adSourcePositionSave`](params).then(data=>{
					return  Promise.resolve(true);
				})
			})
        },
    },
};
</script>

