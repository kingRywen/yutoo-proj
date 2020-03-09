<template>
    <div>
        <el-form :model="ruleForm" :rules="rules"  label-width="76px" class="demo-ruleForm" ref='form'>
            <el-form-item label="产品ASIN" prop="asins">
                <el-input
                    type="textarea"
                    :rows="5"
                     size='small'
                    placeholder="请输入asin,一行一个"
                    v-model.trim="ruleForm.asins">
                </el-input>
            </el-form-item>
            <el-form-item label="关键词" prop="keywords">
                <el-input
                    type="textarea"
                    :rows="5"
                     size='small'
                    placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号"
                    v-model.trim="ruleForm.keywords">
                </el-input>
            </el-form-item>
            <el-form-item label="抓取频率" prop="frequency">
                <el-input
                    style='width:91%'
                    type="text"
                    size='small'
                    placeholder="请输入抓取频率,最小十分钟"
                    v-model.trim="ruleForm.frequency">
                </el-input>
                <span> 分钟</span>
            </el-form-item>
            <el-form-item label="任务名称" prop="taskName">
                <el-input
                    type="text"
                    size='small'
                    placeholder="请输入任务名称"
                    v-model.trim="ruleForm.taskName">
                </el-input>
            </el-form-item>
            <el-form-item label="监控时间" prop='dataTime'  :rules="[{ required: true, message: '请选择监控时间', trigger: ['blur','change']}]">
                <el-date-picker
                    style='width:100%'
                    v-model="ruleForm.dataTime"
                    type="daterange"
                    :pickerOptions='pickerOptions'
                    value-format='yyyy-MM-dd'
                    range-separator="~"
                    size='small'
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                 </el-date-picker>
            </el-form-item>
            <el-form-item label="" prop='ourType'  :rules="[{ required: true, message: '请选择是否本店产品', trigger:  ['blur','change']}]">
               <el-checkbox v-model="ruleForm.ourType" size='small'>是否本店产品</el-checkbox>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        // ASIN验证
        let asinValidate = (rule, value, callback)=> {
            if (!value) {
                callback(new Error('输入不能为空'))
                return
            }
            if (value == null || value == undefined) return
            let val = value
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== '')
            this.skusArr = val
            let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi
            let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi
            let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/
            let changePlatformd = 1 //上线要改
            let str = 'ASIN须为10位数，纯数字或大写字母和数字的组合'
            if (changePlatformd == 2) {
                reg = /^[0-9]{12,12}$/
                str = '请输入12位纯数字'
            } else if (changePlatformd == 3) {
                reg = /^(?!_)(?!.*?_$)[0-9_]+$/
                str = '请输入纯数字，允许下划线'
            } else if (changePlatformd == 4) {
                reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]{24}$/
                str = '长度24位，须小写字母与纯数字的组合'
            } else if (changePlatformd == 5) {
                reg = /^[0-9]*$/
                str = '请输入纯数字'
            }
            if (!val.every(el => reg.test(el))) {
                callback(new Error(str))
            } else if (
                val.some(el => regEn.test(el)) ||
                val.some(el => regCn.test(el))
            ) {
                callback(new Error('不能包含特殊字符'))
            } else if (val.length > 500) {
                callback(new Error('输入数量不能超过500个'))
            } else {
                callback()
            }
        }
        let keywordsValidate = (rule, value, callback) => {
            if (!value) {
                callback(new Error('输入不能为空'))
                return
            }
            let val = value
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== '')
            // let reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
            if (val.length > 500) {
                callback(new Error('输入数量不能超过500个'))
            } else {
                callback()
            }
        }
        let frequencyValidate = (rule, value, callback) => {
            if (!value) {
                callback(new Error('输入不能为空'))
                return
            }
            if( isNaN(Number(value))){
                return   callback(new Error('请输入数字'))
            }
            if( +value  <10){
                return   callback(new Error('请输入10以上的数字'))
            }
            if( String(value).indexOf('+')!==-1){
                return   callback(new Error('请输入数字'))
            }
            callback()
        }
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() <  Date.now() - (15+24)*3600*1000;
                },
            },
            ruleForm:{
                asins:'',//产品ASIN
                keywords:'',//关键词
                frequency:null,//抓取频率
                dataTime:[],
                taskName:'',//任务名称
                ourType:false

            },
            rules:{
                asins:[
                    { required: true, trigger: ['blur','change'] ,validator: asinValidate},
                ],
                keywords:[
                    { required: true, trigger: ['blur','change'],validator: keywordsValidate },
                ],
                frequency:[
                    { required: true, validator: frequencyValidate , trigger: ['blur','change'] },
                ],
                taskName:[
                    { required: true, message: '请输入任务名称', trigger: ['blur','change'] },
                ],
            }
                
        };
    },
    methods: {
         _submit() {
            return this.$refs.form.validate().then(()=>{
                let {asins,keywords,frequency,dataTime,taskName,ourType} =JSON.parse( JSON.stringify(this.ruleForm));
                let asin = asins
                            .split(/[\n|\r\n|\,|\，]/)
                            .map(el => el.trim())
                            .filter(el => el !== '');
                let keyword = keywords
                            .split(/[\n|\r\n|\,|\，]/)
                            .map(el => el.trim())
                            .filter(el => el !== '');
                let [monitorFrom,monitorTo] = dataTime;
                let isTrue = ourType ? 1 : 0;
                // console.log(isTrue);
                // return
                let params = {
                    asins:asin,
                    keywords:keyword,
                    monitorFrom,
                    monitorTo,
                    frequency,
                    taskName,
                    ourType:isTrue,

                    siteId:this.siteId,
                    sellerId:this.sellerId,
                    platformId:this.platformId
                }

                return this.$api['taskRankResearchSave'](params)
            })
        },
    },
    created() {

    },
};
</script>

<style scoped lang="less">

</style>
