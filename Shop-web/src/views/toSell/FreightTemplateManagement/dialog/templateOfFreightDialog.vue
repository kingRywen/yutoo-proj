<template>
<!-- 添加运费模板 -->
    <div>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width='96px'>
            <el-form-item label="运费模板名称" prop='tempName'>
                <el-input v-model.number="formInline.tempName" placeholder="请输入运费模板名称" size='small' style='width:100%;' clearable></el-input>
            </el-form-item>
            <el-form-item label="运费金额($)" prop='fare'>
                <el-input v-model.number="formInline.fare" placeholder="请输入值" size='small' style='width:100%;' clearable></el-input>
            </el-form-item>
            <el-form-item label="适用店铺" prop='sellerIds'>
                <!-- 修改是单选 -->
                <el-select v-model="formInline.sellerIds" placeholder="请选择" style='width:100%;' clearable size='small' collapse-tags :multiple='!params.alter'>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
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
                tempName:null,
                fare:null,
                sellerIds:[]
            },
            rules:{
                tempName: [
                    { message:"请输入" , trigger: ['blur' ,'change'] ,  required: true,},
                ],
                fare: [
                    { validator: validatePass, trigger: ['blur' ,'change'] ,  required: true,},
                ],
                sellerIds: [
                    { message:"请选择" , trigger: ['blur' ,'change'] ,  required: true,},
                ],
            },
            options:[
                {label:"1",value:1},
                {label:"2",value:2},
                {label:"3",value:3},
            ]
        };
    },
    methods: {
        _submit(cb){
            
            return this.$refs.formInline.validate().then( async ()=>{

                let params = JSON.parse( JSON.stringify(this.formInline) );
                if( this.params.alter ){ //修改时参数变了
                    params.sellerId = params.sellerIds ;
                    delete params.sellerIds 
                }
                let res  = await this.$api[this.params.url](params)
                cb && cb(res)
                this.$emit('addSuccess')
                return res
            })
        },
        //获取授权店铺,获取跟卖店铺的下拉选项
        getAuthorizationShop(){
            let opt=[] ;
            this.stateData.forEach(i=>{
                if ( i.platformName === "Amazon" ) {
                    //console.log(i);
                    let siteList = i.siteList;
                    siteList.forEach( k => {
                        k.sellerList.forEach( h => {
                            opt.push({
                                label: h.sellerAlias ,
                                value: h.sellerId
                            })
                        })
                    })
                }
            });
            //console.log(opt);
            this.options=opt
        },
        _initData(){
            //修改时回显
            if( !this.params.alter ){
                return
            }
            this.$api['saleFareTempInfo']({
                tempId	: this.params.tempId
            })
            .then(data => {
                let { sellerId , tempName , fare } =data.data;
                this.formInline.tempName=tempName;
                this.formInline.fare=fare;
                this.formInline.sellerIds=sellerId
               
                //console.log(this.formInline);
            })
        },
    },
    created() {
        if( this.params.alter){ //修改时
            this.formInline.tempId = this.params.tempId;
        }
    },
    computed:{
       stateData(){
           return this.$store.state.common.stateData
       }
    },
    watch:{
        stateData:{
            handler(){
                if (this.stateData) {
                    //console.log(this.stateData);
                    this.getAuthorizationShop()
                };
            },
            immediate:true,
       },
    }
};
</script>

<style scoped lang="less">
.el-form-item{
    margin-bottom: 18px;
}
</style>
