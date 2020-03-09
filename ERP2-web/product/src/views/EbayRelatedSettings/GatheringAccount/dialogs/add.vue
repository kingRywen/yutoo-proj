<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px"  size='small'>
            <el-form-item label="自定义账户名" prop="storeId">
                <el-select v-model="ruleForm.storeId" placeholder="请选择" style='width:100%;'>
                    <el-option
                    v-for="item in storeIdOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联Paypal账户" prop="gatherAccountId">
                 <el-select v-model="ruleForm.gatherAccountId" placeholder="请选择"  style='width:100%;'>
                    <el-option
                    v-for="item in paypalAccountIdOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否激活" prop="activateFlag">
                 <el-checkbox v-model="ruleForm.activateFlag">是</el-checkbox>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['type','gatherAccountId'],
    data() {
        return {
            ruleForm:{
                storeId:'',
                gatherAccountId:"",
                activateFlag:false
            },
            storeIdOpts:[],
            paypalAccountIdOpts:[],
            rules:{
                storeId:[
                    { required: true, message: '请选择', trigger: ['change'] }
                ],
                gatherAccountId:[
                    { required: true, message: '请选择', trigger: ['change'] }
                ],
            },
        };
    },
    methods: {
        _submit(){
            return this.$refs.ruleForm.validate().then(()=>{
                let url = this.type === 'edit' ? 'product/PrConfigGatherAccountEbayUpdate' : 'product/PrConfigGatherAccountEbaySave'
                this.ruleForm.activateFlag = this.ruleForm.activateFlag ? 1 : 0
                return this.$api[url]({
                    ...this.ruleForm
                })
            })
        },
        getInfo(){
            this.$api[`product/PrConfigGatherAccountEbayInfo`]({
                id : this.gatherAccountId
            })
            .then((data) => {
                let { rows } = data
                this.ruleForm = rows
                this.ruleForm.activateFlag = this.ruleForm.activateFlag === 0 ? false : true
            })
        },
        getStoreIdOpts(){
            this.$api[`product/GlStoreDropDown`]()
            .then((data) => {
                let { rows } = data
                this.storeIdOpts = rows.map(i=>{
                    return {
                        label:i.value,
                        value:i.key,
                    }
                })
            })
        },
        getPaypalAccountIdOpts(){
            this.$api[`product/PrConfigPaypalAccountEbayDropDown`]()
            .then((data) => {
                let { rows } = data
                this.paypalAccountIdOpts = rows.map(i=>{
                    return {
                        label:i.value,
                        value:i.key,
                    }
                })
            })
        }
    },
    created() {
        if(this.type === 'edit'){
            this.getInfo()
        };
        this.getStoreIdOpts()
        this.getPaypalAccountIdOpts()
    },
};
</script>

<style scoped lang="scss">

</style>
