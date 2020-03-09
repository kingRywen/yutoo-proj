<template>
    <div>
        <!-- 加入店铺分析 -->
    <el-form  :label-position="labelPosition" label-width="80px"  :model="formData" ref='form' >
        <!-- 任务名称 -->
        <el-form-item label="任务名称" prop='taskName' 
            :rules="[ { required: true, message: '请输入任务名称', trigger: ['blur'] }]"
        >
            <el-input v-model.trim="formData.taskName" size='mini'></el-input>
        </el-form-item>
    </el-form>
      <div slot='btns' style='text-align:center;margin-top:40px;border-top:1px solid #e5e5e5;padding-top:15px;'>
            <el-button
                size="small"
                type="primary"
                :loading="loadingBtn"
                @click="handleOkClick"
                >确定</el-button>
            <el-button  size="small" @click="handleCancelClick">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            formData:{
                taskName:'',
                dataType:0,
                dataSource:''
            },
            labelPosition:'center',
            loadingBtn:false,
        };
    },
    methods: {
        //添加任务提交
        handleOkClick() {
            this.loadingBtn=true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                     this.$api['taskShopAnalysisSave'](this.formData).then(
                         (data)=>{
                             if(data.code===0){
                                this.handleCancelClick();
                             }
                         }
                     ).catch(err=>{
                        this.loadingBtn=false;
                     })
                } else{
                     this.loadingBtn=false;
                }
            });
          
            
        },
        handleCancelClick(){
             this.$parent.$parent.$parent.$parent.handleCancelClick()
        }
    },
    created() {
        this.formData.dataSource=this.params.storeUrls;
    },
};
</script>

<style scoped lang="less">

</style>
