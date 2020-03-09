<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" size='small'>
            <el-form-item label="备注" prop="produceStatusRemark">
                <el-input v-model="ruleForm.produceStatusRemark"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['productRepoIds','produceStatus'],
    data() {
        return {
            ruleForm:{
                produceStatusRemark	:""
            },
            rules:{

            },
        };
    },
    methods: {
        changeStatus(){
            // produceStatus	0正常1停产2缺货3清货
            let parsms = {
                produceStatus:this.produceStatus,
                productRepoIds:this.productRepoIds,
            }
            if(this.ruleForm.produceStatusRemark){
                parsms.produceStatusRemark = this.ruleForm.produceStatusRemark
            }
            return this.$api[`product/purchasePrProductRepoSetStatus`](parsms)

        }
    },
    created() {

    },
    computed:{
        Validate(){
            return  ()=>Promise.resolve(true)
        },
    }
};
</script>

<style scoped lang="scss">

</style>
