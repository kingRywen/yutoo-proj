<template>
    <div>
        <!-- 添加或修改监控周期 -->
          <el-form :label-position="labelPosition" label-width="80px" :model="formData" ref='form'>
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
        </el-form>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            labelPosition:'center',
            formData:{
                daterange:'',
                monitorFrom:'',//监控开始时间
                monitorTo:'',//监控结束时间
                taskIds:[],//ID数组
            },
            pickerOptions:{
                 disabledDate(time) {
                    return time.getTime() < Date.now()-24*3600*1000;
                },
            }
        };
    },
    methods: {
        _submit(){
            this.formData.monitorFrom=this.formData.daterange[0];
            this.formData.monitorTo=this.formData.daterange[1];
            let url=this.params.type === 'add'? 'taskShopDepthAnalysisAddMonitor' : 'taskShopDepthAnalysisUpdateMonitor';
            return this.$refs.form.validate().then(() => {
                return this.$api[url](this.formData).then()
            })
        }
    },
    created() {
        this.formData.taskIds=this.params.taskIds;
    },
};
</script>

<style scoped lang="less">

</style>
