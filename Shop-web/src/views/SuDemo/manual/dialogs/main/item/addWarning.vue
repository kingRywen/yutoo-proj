<template>
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width="70px">
			<el-form-item label="监控时间" prop="time" :label-width="formLabelWidth" style="width:100%;">
			  <div class="block" style="width:100%;">
			    <el-date-picker unlink-panels style="width:90%;" :picker-options="cfuns._pickerFuture" v-model="formInline.time" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="small">
			    </el-date-picker>
			  </div>
			</el-form-item>
			<el-form-item label="监控频率" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
			  <el-input type="text" v-model.trim="formInline.frequency" style="width:90%;" placeholder="请输入10-1440之间的整数" size="small" />
			  <span class="font12">&nbsp;分钟</span>
			</el-form-item>
        </el-form>
    </div>
</template>
<script>
import { checkFrequencyValidate  } from 'Utils/customValid'
export default {
    props:['params'],
    data() {
        return {
            rules:{
                time: [
                    { trigger: ['blur'] , required: true, message:'请选择监控时间' },
                ],
				frequency: [
				    { validator: checkFrequencyValidate, trigger: 'blur' }
				],
            },
            formInline:{
				time:null,
                frequency:null,
            },
			formLabelWidth:'80px'
        };
    },
    methods: {
        _submit(){
            return this.$refs.formInline.validate().then(()=>{
				let form = this.formInline
				let params = {
					...this.params,
					monitorFrom:form.time[0],
					monitorTo:form.time[1],
					frequency:form.frequency
				}
				return this.$api[`adKeywordQueryRankAddMonitor`](params).then(data=>{
					return  Promise.resolve(true);
				})
			})
        },
    },
};
</script>

