<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" size='small'>
            <el-form-item label="备注" prop="productionStatusRemark">
                <el-input v-model="ruleForm.productionStatusRemark"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['remarkId','remarkStatus'],
    data() {
        return {
            ruleForm:{
                productionStatusRemark	:""
            },
            rules:{

            },
        };
    },
    methods: {
        changeStatus(){
            // produceStatus	0正常1停产2缺货3清货
            let parsms = {
                productionStatus:this.remarkStatus,
                productRepoPriceId:this.remarkId,
            }
            if(this.ruleForm.productionStatusRemark){
                parsms.productionStatusRemark = this.ruleForm.productionStatusRemark
            }
            return this.$api[`product/prProductRepoPurchaseSupplierSetStatus`](parsms)

        }
    },
    created() {

    },
    computed:{
        validate(){
            return  ()=> {return Promise.resolve(true)}
        },
    }
};
</script>

<style scoped lang="scss">

</style>
