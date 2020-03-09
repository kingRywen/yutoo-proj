<template>
<!-- 加入竞品分析弹窗 -->
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="监控时间" prop='dataTime'  :rules="[{ required: true, message: '请选择监控时间', trigger: 'blur'}]">
                <el-date-picker
                    v-model="form.dataTime"
                    type="daterange"
                    @change='dateChange'
                    value-format='yyyy-MM-dd'
                    range-separator="至"
                    size='mini'
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
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
            form:{
                dataTime:null,//监控时间
                sellerId:null,//卖家id
                siteId:null,//站点id
                asins:[],
                monitorFrom:null,//监控开始时间
                monitorTo:null,//监控结束时间
                platformId:this.platformId,//站点id
            }
        };
    },
    methods: {
         _submit() {
            return this.$refs.form.validate().then(()=>{
                return this.$api[this.params.url](this.form)
            })
        },
        dateChange(v){
            //console.log(v);
            if(v){
                this.form.monitorFrom=v[0];
                this.form.monitorTo=v[1];
            }; 
        }
    },
    created() {
        this.form.sellerId=this.params.sellerId;
        this.form.siteId=this.params.siteId;
        this.form.asins=this.params.asins;
        this.form.platformId=this.platformId;
    },
};
</script>

<style scoped lang="less">

</style>
