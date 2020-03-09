<template>
    <!-- 设置保底利润率运费 -->
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width='100px'>
            <el-form-item label="目标站点佣金" prop='targetCommission' v-if='params.isAll' >
                <el-input v-model.number="formInline.targetCommission" placeholder="请输入值" size='small' style='width:93%;' clearable></el-input> %
            </el-form-item>
            <el-form-item label="保底利润率" prop='profitRate' >
                <el-input v-model.number="formInline.profitRate" placeholder="请输入值" size='small' style='width:93%;' clearable></el-input> %
            </el-form-item>
             <el-form-item label="源站点运费" prop='sourceFare'>
                <el-input v-model.number="formInline.sourceFare" placeholder="请输入值" size='small' style='width:93%;' clearable></el-input> $
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        var validatePass = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入'));
            };
            if(isNaN(Number(value))){
                 return callback(new Error('请输入数字'));
            };
            callback()
        };
        return {
            formInline:{
               targetCommission:null,//目标站点佣金
               profitRate:null,//保底利润率
               sourceFare:null,//源站点运费
            },
            rules:{
                targetCommission: [
                    { validator: validatePass, trigger: ['blur','change'] , required: true, },
                ],
                profitRate: [
                    { validator: validatePass, trigger: ['blur' ,'change'] ,  required: true,},
                ],
                sourceFare: [
                    { validator: validatePass, trigger: ['blur' ,'change'] ,  required: true,},
                ],
            },
            url:null, //请求的地址
        };
    },
    methods: {
          _submit(){
          return this.$refs.formInline.validate().then(()=>{
                let params = JSON.parse( JSON.stringify(this.formInline));
                params.targetCommission = params.targetCommission / 100 ;
                params.profitRate = params.profitRate / 100 ;
                return this.$api[this.url](params).then(()=>{if(this.params.fn) this.params.fn()})
            }).then(()=>{
				return Promise.resolve(true);
			})
        },
        _initData(){
            if( !this.params.isAll){ //设置佣金和保底利润不需要回显
                return
            };
            this.$api['imSaleProdAbleConfigCateInfo']({
                siteId:this.formInline.siteId,
                pcid:this.formInline.pcid
            })
            .then(data => {
                let res=data.data;
                this.formInline.targetCommission = res.targetCommission *100 ;
                this.formInline.profitRate = res.profitRate * 100;
                this.formInline.sourceFare = res.sourceFare ;
            })
        }
    },
    created() {
        this.formInline.siteId=this.params.siteId;
        if(this.params.pcid) {
            this.formInline.pcid=this.params.pcid*1;
        };
        if(this.params.asins) {
            this.formInline.asins=this.params.asins;
        };   
        if(this.params.isAll){ //是全局设置 或者 类目单独设置
            this.url='imSaleProdAbleSaveConfigCate';
        }else{
             this.url='imSaleProdAbleSaveConfigProduct';
             delete this.formInline.targetCommission
        }
    },
};
</script>

<style scoped lang="less">
.el-form-item{
    margin-bottom: 18px;
}
</style>
