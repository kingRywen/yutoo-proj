<template>
<!-- 添加人份无 -->
    <div>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="rules" ref='form'>
            <el-form-item label="数据类型"  prop='productType'>
                <el-select v-model="formLabelAlign.productType" placeholder="请选择" size='mini' style='width:100%'>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品ID" prop='asin'>
                <el-input v-model="formLabelAlign.asin" placeholder="请输入" size='mini' style='width:100%'></el-input>
            </el-form-item>
            <el-form-item label="关键词" prop='dataSources'>
                <el-input v-model="formLabelAlign.dataSources" placeholder="一行一个,限20个" size='mini' rows='5' style='width:100%' type='textarea'></el-input>
            </el-form-item>
            <el-form-item label="任务名称" prop='taskName'>
                <el-input v-model="formLabelAlign.taskName" placeholder="请输入" size='mini' style='width:100%'></el-input>
            </el-form-item>
            <el-form-item label="" prop="isStart">
                <el-checkbox v-model="formLabelAlign.isStart">是否开启监控</el-checkbox>
            </el-form-item>
            <div v-if='formLabelAlign.isStart'>
                <el-form-item label="监控时间" prop='dataTime'>
                    <el-date-picker
                        v-model="formLabelAlign.dataTime"
                        type="daterange"
                        value-format='yyyy-MM-dd'
                        range-separator="至"
                        size='mini'
                        :picker-options="pickerOptions"
                        style='width:100%'
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="监控频率" prop='frequency'>
                    <el-input v-model="formLabelAlign.frequency" placeholder="请输入10以上的数字" size='mini' style='width:100%' ></el-input>
                </el-form-item>
            </div>
        </el-form>
        
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        let keywordsvalidator=(rule, value, callback) =>{
            if (!value) {
                callback(new Error('输入不能为空'))
                return
            }
            let val = value
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== '')
           if (val.length > 20) {
                callback(new Error('输入数量不能超过20个'))
            } else {
                callback()
            }
        };
        let frequencyvalidator=(rule, value, callback) =>{
            if (!value) {
                callback(new Error('输入不能为空'))
                return
            }
           if (isNaN(Number(value)) || Number(value)<10) {
                callback(new Error('请输入10以上的数字'))
            } else {
                callback()
            }
        };
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() -24*3600*1000;
                }
            },
            labelPosition:'left',
            options:[
                {value:0,label:'全部'},
                {value:1,label:'拍卖'},
                {value:2,label:'一口价'},
            ],
            formLabelAlign:{
                taskFlag:null,
                productType:null,
                asin:null, 
                dataSources:null,
                taskName:null,
                dataTime:[],
                frequency:null,
                siteId:null,
                sellerId:null,
                monitorFlag:null,//是否开启监控
                isStart:false,//是否开启监控
            },
            rules: {
                productType: [
                    { trigger: 'blur',required:true , message:'请选择'}
                ],
                asin: [
                    {trigger: 'blur',required:true, message:'请输入'}
                ],
                dataSources: [
                    { validator:keywordsvalidator,trigger: 'change' ,required:true }
                ],
                taskName: [
                    {  trigger: 'blur' ,required:true ,message:'请输入'}
                ],
                dataTime: [
                    {  trigger: 'blur' ,required:true ,message:'请选择'}
                ],
                frequency:[
                    { validator:frequencyvalidator, trigger: 'change',required:true}
                ]
            }
        };
    },
    methods: {
         _submit() {
            return this.$refs.form.validate().then(()=>{
                let val = this.formLabelAlign.dataSources
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== '');
                this.formLabelAlign.keywords=val;
             
                let [monitorFrom,monitorTo]=this.formLabelAlign.dataTime;
                this.formLabelAlign.monitorFrom=monitorFrom;
                this.formLabelAlign.monitorTo=monitorTo;

                if(this.formLabelAlign.isStart){
                    this.formLabelAlign.monitorFlag=1;
                }else{
                    this.formLabelAlign.monitorFlag=0;
                };
                return this.$api['ebTaskKeywordRankSave'](this.formLabelAlign).then();
            })
        },
    },
    created() {
        this.formLabelAlign.siteId=this.params.siteId;
        this.formLabelAlign.platformId=this.ebayPlatformId;
        this.formLabelAlign.sellerId=this.params.sellerId;
        this.formLabelAlign.taskFlag=this.params.taskFlag;  //任务类型
    },
};
</script>

<style scoped lang="less">

</style>
