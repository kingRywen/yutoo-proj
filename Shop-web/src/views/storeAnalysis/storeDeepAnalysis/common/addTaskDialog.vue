<template>
    <div>
        <!-- 添加任务 -->
        <el-form :label-position="labelPosition" label-width="80px" :model="formData" ref='form'>
            <el-form-item label="店铺ID" :rules="[ { required: true, message: '请输入店铺ID', trigger: 'blur' }]" prop='name'>
                <el-input v-model.trim="formData.name" type='textarea' size="mini" placeholder="多个换行输入"  :rows="4"></el-input>
            </el-form-item>
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
                name:"",//店铺ID
                daterange:'',
                siteId:'',
                sellerId:'',
                platformId:this.platformId,
                monitorFlag:1,//监控状态
                monitorFrom:'',//监控开始时间
                monitorTo:'',//监控结束时间
                monitorSellerIds:[],//ID数组
            },
            pickerOptions:{
                 disabledDate(time) {
                    return time.getTime() <= Date.now()-24*3600*1000;
                },
            }
        };
    },
    methods: {
        _submit(){
            this.formData.monitorFrom=this.formData.daterange[0];
            this.formData.monitorTo=this.formData.daterange[1];
            let val = this.formData.name.split(/[\n|\r\n|\,|\，]/)
            .map(el => el.trim())
            .filter(el => el !== '');
            this.formData.monitorSellerIds=val;
            return this.$refs.form.validate().then(() => {
                return this.$api['taskShopDepthAnalysisSave'](this.formData).then()
            })
        }
    },
    created() {
        this.formData.siteId=this.params.siteId;
        this.formData.sellerId=this.params.sellerId;
        this.formData.platformId=this.platformId;
    },
};
</script>

<style scoped lang="less">

</style>
