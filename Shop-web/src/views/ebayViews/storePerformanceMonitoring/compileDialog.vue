<template>
    <div>
        <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm" :label-position="'right'" :rules='rules'>
            <el-form-item  prop="positiveRate">
                <el-checkbox v-model="positiveRateCheck">好评率>=</el-checkbox>
                <el-input
                    placeholder="请输入值"
                    v-model="ruleForm.positiveRate"
                    size='mini'
                    style='width:270px;margin-left:116px;'
                    :disabled="!positiveRateCheck">
                </el-input>
                %
            </el-form-item>
            <el-form-item  prop="neutralNegativeCntD30">
                <el-checkbox v-model="neutralNegativeCntD30Check">{{neutralNegativeCntD30Html}}</el-checkbox>
                <el-input
                    placeholder="请输入值"
                    v-model="ruleForm.neutralNegativeCntD30"
                    size='mini'
                    style='width:270px;margin-left:56px;'
                    :disabled="!neutralNegativeCntD30Check">
                </el-input>
            </el-form-item>
            <el-form-item  prop="score">
                <el-checkbox v-model="scoreCheck">买家四项评分>=</el-checkbox>
                <el-input
                    placeholder="请输入值"
                    v-model="ruleForm.score"
                    size='mini'
                    style='width:270px;margin-left:80px;'
                    :disabled="!scoreCheck">
                </el-input>
            </el-form-item>
            <el-form-item  prop="topRatedSeller">
                <el-checkbox v-model="topRatedSellerCheck">Top-rated seller的要求指标</el-checkbox>
                <!-- <el-input
                    placeholder="请输入正整数"
                    v-model="ruleForm.topRatedSeller"
                    size='mini'
                    style='width:270px;margin-left:24px;'
                    :disabled="!topRatedSellerCheck">
                </el-input> -->
                <el-input-number
                    style='width:270px;margin-left:24px;'
                     v-model="ruleForm.topRatedSeller"
                    :min="1"
                    :disabled="!topRatedSellerCheck"
                    size='small'
                    placeholder="请输入正整数"
                ></el-input-number>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            positiveRateCheck:false,
            neutralNegativeCntD30Check:false,
            scoreCheck:false,
            topRatedSellerCheck:false,
            neutralNegativeCntD30Html:"最近一个月中差评<=",
            ruleForm:{
                positiveRate:null,
                neutralNegativeCntD30:null,
                score:null,
                topRatedSeller:null,
            },
            rules:{
                topRatedSeller:[
                     { required: true, message: '请输入', trigger: 'blur' }
                ],
                positiveRate:[
                     { required: true, message: '请输入', trigger: 'blur' }
                ],
                score:[
                     { required: true, message: '请输入', trigger: 'blur' }
                ],
                neutralNegativeCntD30:[
                     { required: true, message: '请输入', trigger: 'blur' }
                ],
            },
            oldRuleForm:{
                positiveRate:null,
                neutralNegativeCntD30:null,
                score:null,
                topRatedSeller:null,
            },
        };
    },
    methods: {
        _submit(){
             return this.$refs.ruleForm.validate().then(()=>{
                return this.$api['ebShopPerformanceConfig'](this.ruleForm).then();
            })
        },
        _initData(){
            let {sellerId,siteId}=this.sellerData;
            this.$api['ebShopPerformanceConfigDetail']({
                sellerId,
                siteId,
            })
            .then(data => {
                //console.log(data);
                let datas=data.data;
                this.ruleForm.positiveRate=datas.positiveRate;
                this.ruleForm.neutralNegativeCntD30=datas.neutralNegativeCntD30;
                this.ruleForm.score=datas.score;
                this.ruleForm.topRatedSeller=datas.topRatedSeller;

                this.oldRuleForm=this.ruleForm;
            }).catch(() => {})
        }
    },
    created() {

    },
};
</script>

<style scoped lang="less">

</style>
