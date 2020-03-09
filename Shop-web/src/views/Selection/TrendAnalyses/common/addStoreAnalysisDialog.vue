<template>
    <!-- 加入店铺分析的弹窗 -->
    <div>
    <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="任务名称" prop='taskName'  :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur'}]">
            <el-input
                v-model.trim="form.taskName" 
                placeholder="请输入任务名称" 
                size='mini' 
                style='width:300px;'
            >
            </el-input>
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
                taskName:null,//任务名称
                sellerId:null,//卖家id
                siteId:null,
                dataType:0,//默认为店铺链接 ,
                dataSource:[],//链接数组,
                platformId:this.platformId,//平台id
            }
        };
    },
    methods: {
       _submit() {
            return this.$refs.form.validate().then(()=>{
                return this.$api[this.params.url](this.form)
            })
        }
    },
    created() {
        this.form.sellerId=this.params.sellerId;
        this.form.siteId=this.params.siteId;
        this.form.dataSource=this.params.dataSource;
        this.form.platformId=this.platformId;

    },
};
</script>

<style scoped lang="less">

</style>
