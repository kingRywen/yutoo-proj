<template>
    <!-- 修改价格 -->
    <div v-loading='divLoading'>
        <el-form :label-position="'center'" :model="formInline" ref='formInline'  :rules='rules' label-width='90px'>
            <div>
                <el-form-item label="销售价" prop='source' style='display:inline-block;width:140px;'>
                    <el-select v-model="formInline.source" placeholder="请选择" size='small' style='width:120px;' clearable>
                        <el-option
                        v-for="item in priceOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop='operator' style='display:inline-block;width:140px;' v-if='formInline.source!==4'>
                    <el-select v-model="formInline.operator" placeholder="请选择" size='small' style='width:120px;' clearable>
                        <el-option
                        v-for="item in price2Options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop='fixedValue' style='display:inline-block;width:200px;'
                    :style="{marginLeft:formInline.source===4 ?'30px':'0'}"
                >
                    <div  :style='{width:formInline.source===4 ? "260px" : "140px"}'>
                        <el-input  v-model.trim="formInline.fixedValue" placeholder="请输入固定值" size='small' style='width:11px;'  :style="{width:formInline.source===4 ?'220px':'120px'}" clearable></el-input>
                        <span> $</span>
                    </div>
                </el-form-item>
            </div>
            <el-form-item label="默认价格" prop='defaultValue' v-if='formInline.source!==0 && formInline.source!==4'>
                <el-input v-model.trim="formInline.defaultValue" placeholder="请输入值" size='small' style='width:400px;' clearable></el-input> $
            </el-form-item>
            <el-form-item label="运费模板" prop='tempId'>
                <el-select v-model="formInline.tempId" placeholder="请选择" size='small' style='width:310px;' clearable>
                    <el-option
                    v-for="item in fare_tempOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" size='small' style='margin-left:10px;'  @click='addTemp'>添加模板</el-button>
            </el-form-item>
        </el-form>
        <yt-dialog :options='dialogOptions' :events='dialogEvents'>
            <templateOfFreightDialog  ref='comp' v-if='dialogOptions.visible' @addSuccess='addSuccess'  :params='addTempParams' />
        </yt-dialog>
    </div>
</template>

<script>
import templateOfFreightDialog from "../../../FreightTemplateManagement/dialog/templateOfFreightDialog"
export default {
    props:['params'],
    components:{
        templateOfFreightDialog
    },
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
            rules:{
                source: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                operator: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                fixedValue: [
                    { validator: validatePass, trigger: ['blur','change'] , required: true, },
                ],
                defaultValue: [
                    { validator: validatePass, trigger: ['blur' ,'change'] ,  required: true,},
                ],
                tempId: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },
            formInline:{
                sellerId:null,
                source:null,//价格来源
                operator:null,//算法
                fixedValue:null,//固定价格
                defaultValue:null,//默认价格
                tempId:null,//运费模板

            },
            priceOptions:[
                {label:"源站点总价",value:0},
                {label:"亚马逊自营价",value:1},
                {label:"跟卖最低价",value:2},
                {label:"跟卖最高价",value:3},
                {label:"自定义价格",value:4},
            ],
            price2Options:[
                {label:"+",value:0},
                {label:"-",value:1},
                {label:"*",value:2},
                {label:"/",value:3},
            ],
            fare_tempOptions:[
               
            ],

            dialogOptions:{
                title:'添加模板',
                width:'500px',
                visible:false,
                appendToBody:true
            },
            dialogEvents:{
                handleOkClick:()=>{
                    return this.handleSubmitClick()
                }
            },

            divLoading:false,

             //添加模板的参数
            addTempParams:{
                url:'saleFareTempSave'
            }
        

        };
    },
    methods: {
        _submit(){
            return this.$refs.formInline.validate().then(()=>{
                 let {source} = this.formInline;
                if( source=== 0 ){
                    delete this.formInline.defaultValue;
                }else if ( source=== 4 ){
                    delete this.formInline.defaultValue;
                    delete this.formInline.operator;
                };
                for ( let k in this.formInline ) {
                    if ( k=== 'fixedValue' || k=== 'defaultValue' ){
                        this.formInline[k] = this.formInline[k]*1 ;
                    }
                };
                return this.$api['imSaleProdExeUpdatePrice'](this.formInline)
            })
        },
        //添加模板
        addTemp(){
            this.dialogOptions.visible=true;
        },
        handleSubmitClick(){
            this.$refs.comp._submit((val)=>{
                console.log(val);
                if(val.code===0){
                     this.dialogOptions.visible=false;
                }
            });
        },
        //回显数据
        initData(){
            if(this.formInline.skus && this.formInline.skus.length !==1 ){
                return 
            };
            let params = JSON.parse(JSON.stringify(this.formInline));
            params.sku = params.skus[0];
            delete params.skus
            this.divLoading = true ;
            this.$api['imSaleProdExePriceInfo']({
                ...params
            })
            .then(data => {
                // console.log(data)
                 this.divLoading = false ;
                let res = data.data ;
                this.formInline.source = res.source;
                this.formInline.tempId = res.tempId;
                this.formInline.fixedValue = res.fixedValue;
                this.formInline.operator = res.operator;
                this.formInline.defaultValue = res.defaultValue;
                
            })
        },
        //获取模板 和 接收子组件添加模板成功
        addSuccess(){
            if(! this.formInline.sellerId ){
                return
            }
            this.fare_tempOptions=[]
            this.$api['saleFareTempListAll']({
                sellerId : this.formInline.sellerId
            })
            .then(data => {
                data.data.forEach( i => {
                    this.fare_tempOptions.push({
                        label: i.tempName ,
                        value: i.tempId ,
                    })
                })
            })
        }
    },
    created() {
        console.log(this.params);
        this.formInline.skus=this.params.skuList.map(e=>{return  e.sku});
        //console.log(this.formInline.asin);
        this.formInline.siteId=this.params.siteId;
        this.formInline.sellerId=this.params.skuList[0].sellerId;
        this.initData();
        this.addSuccess()
        //console.log(this.formInline);
    },
};
</script>

<style scoped lang="less">
.el-form-item{
    margin-bottom: 18px;
}
</style>
