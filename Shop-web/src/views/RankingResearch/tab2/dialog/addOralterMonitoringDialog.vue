<template>
    <div>
        <!-- 修改监控周期 -->
          <el-form :label-position="labelPosition" label-width="80px" :model="formData" ref='form'  :rules="rules" >
            <el-form-item label="监控周期" :rules="[ { required: true, message: '请选择监控周期', trigger: 'blur' }]" prop='daterange'>
                <el-date-picker
                    style='width:366px;'
                    v-model="formData.daterange"
                    type="daterange"
                    align="right"
                    size="mini"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="抓取频率" prop="frequency">
                <el-input
                    style='width:91%'
                    type="text"
                    size='small'
                    placeholder="请输入抓取频率,最小十分钟"
                    v-model.trim="formData.frequency">
                </el-input>
                <span> 分钟</span>
            </el-form-item>
        </el-form>
        
    </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
    props:['params'],
    data() {
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
        let vm = this;
        return {
            labelPosition:'center',
            formData:{
                daterange:[],
                frequency:''
            },
            pickerOptions:{
                 disabledDate(time) {
                          return time.getTime() < Date.now()-(15+24)*3600*1000;
                },
            },
            rules:{
                frequency:[
                    { required: true, validator: frequencyValidate , trigger: ['blur','change'] },
                ],      
            }
        };
    },
    methods: {
        _submit(){

            return this.$refs.form.validate().then(() => {
                let {daterange,taskIds,frequency} = JSON.parse(JSON.stringify(this.formData));
                let [monitorFrom,monitorTo] = daterange;
                return this.$api[this.params.url]({
                    taskIds,
                    frequency,
                    monitorFrom,
                    monitorTo
                })
            })
        }
    },
    created() {
        //console.log(this.params);
        this.formData.taskIds = this.params.taskIds;
        if( this.params.monitorFrom && this.params.monitorTo){
            let nowDate = dayjs( Date.now()-(15)*3600*1000).format('YYYY-MM-DD')
            this.formData.daterange = [nowDate,nowDate];
        };

    },
};
</script>

<style scoped lang="less">

</style>
