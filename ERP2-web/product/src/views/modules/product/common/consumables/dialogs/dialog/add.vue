<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" size='small'>
            <el-form-item label="供应商类型" prop="purchaseType">
                <el-select v-model="ruleForm.purchaseType" placeholder="请选择"  clearable  style='width:100%;' @change='supplierTypeChange'>
                    <el-option
                    v-for="item in supplierTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="供应商" prop="supplierId">
                <div style='display:flex;'>
                    <el-select v-model="ruleForm.supplierId" placeholder="请选择"  clearable style='width:96%;'>
                        <el-option
                        v-for="item in supplierOpts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="text" @click='addSupplier'>添加供应商</el-button>
                </div>
            </el-form-item>
            <el-form-item label="开票税点" prop="tax">
                <el-input v-model.trim="ruleForm.tax" placeholder="请输入" clearable style='width:98%'></el-input>
                %
            </el-form-item>
            <el-form-item label="产品状态" prop="productionStatus">
                <el-radio-group v-model="ruleForm.productionStatus">
                    <el-radio :label="0">正常</el-radio>
                    <el-radio :label="2">缺货</el-radio>
                    <el-radio :label='1'>停产</el-radio>
                    <el-radio :label="3">清库</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态备注" prop="productionStatusDesc">
                <el-input v-model="ruleForm.productionStatusDesc" placeholder="请输入" type='textarea' :rows='5' clearable></el-input>
            </el-form-item>
            <el-form-item label="" >
                <span slot='label'> 
                    <span class='red'>*</span>
                    <span>采购天数</span> 
                </span>
                <div class='days'>
                    <div>
                        <el-form-item prop='productionDays'>
                            <el-input placeholder="请输入" v-model.trim="ruleForm.productionDays" clearable>
                                <template slot="prepend">生产天数</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item prop='freightDays'>
                            <el-input placeholder="请输入" v-model.trim="ruleForm.freightDays" clearable>
                                <template slot="prepend">运输天数</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item prop='storageDays'>
                            <el-input placeholder="请输入" v-model.trim="ruleForm.storageDays" clearable>
                                <template slot="prepend">入库天数</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="" >
                <span slot='label'> 
                    <span class='red'>*</span>
                    <span>供应商报价</span> 
                </span>
                <div class='price' v-for='(item,index) in ruleForm.priceList' :key='item.id'>
                    <div>
                        <div>
                            <el-form-item :prop="'priceList.' + index + '.numStart'" :rules='getRules(index)'>
                                <el-input placeholder="请输入" v-model.trim="item.numStart">
                                    <template slot="prepend" style="width:30px;">数量</template>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item  :prop="'priceList.' + index + '.numEnd'" label-width="20px" :rules='getRules(index)' >
                                <span slot='label' style='margin-left:6px;'> ~ </span>
                                <el-input placeholder="请输入" v-model.trim="item.numEnd">
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div>
                        <el-form-item  label='' :prop="'priceList.' + index + '.price'" label-width="20px" :rules='getRules(index)'>
                                <el-input placeholder="请输入" v-model.trim="item.price">
                                    <template slot="prepend">单价</template>
                                </el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item  label='' :prop="'priceList.' + index + '.purchaseFreight'" label-width="20px" :rules='getRules(index)'>
                                <el-input placeholder="请输入" v-model.trim="item.purchaseFreight">
                                     <template slot="prepend">采购运费</template>
                                </el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item  label='' :prop="'priceList.' + index + '.processPrice'" label-width="20px" :rules='getRules(index)'>
                                <el-input placeholder="请输入" v-model.trim="item.processPrice">
                                     <template slot="prepend">加工费用</template>
                                </el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item  label='' :prop="'priceList.' + index + '.otherPrice'" label-width="20px" :rules='getRules(index)' >
                                <el-input placeholder="请输入" v-model.trim="item.otherPrice">
                                    <template slot="prepend">其他费用</template>
                                </el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item  label='' :prop="'priceList.' + index + '.priceUnit'"  label-width="20px" :rules='getRules(index)'>
                            <el-select v-model="item.priceUnit" placeholder="请选择">
                                <el-option
                                v-for="item in priceUnitOpts"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div style='min-width:110px;margin-left:10px;'> 
                            <ElButton @click="ruleForm.priceList.push({
                                numStart:null,
                                numEnd:null,
                                price:null,
                                purchaseFreight:null,
                                processPrice:null,
                                otherPrice:null,
                                priceUnit:null,
                            })" size="small" type="plain" icon="el-icon-plus" plain></ElButton>
                            <ElButton  
                                v-if='ruleForm.priceList.length !==1' 
                                size="small" type="danger" 
                                icon="el-icon-delete" 
                                plain
                                @click='ruleForm.priceList.splice(index,1)'
                                >
                            </ElButton>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="" prop="defaultFlag">
                <span slot='label'> 
                    <span class='red'>*</span>
                    <span>是否默认供应商</span> 
                </span>
                <el-checkbox v-model="ruleForm.defaultFlag">是</el-checkbox>
            </el-form-item>
        </el-form>
        <Dialog :opts='opts' :events='addEvents' :validate='addValidate'>
            <Add  v-if='opts.visible' ref='addDialog' />
        </Dialog>
    </div>
</template>

<script>
import { Promise } from 'q';
// produceStatus	0正常1停产2缺货3清货
export default {
    components:{
        Dialog:()=>import('Components/MainLayout/src/dialog'),
        Add:()=>import('./addSupplier')
    },
    props:['editData'],
    data() {
        let validatePass =  (rule, value, callback) => {
            let name = rule.field
            // console.log(name);
            // console.log(value);
            if(isNaN(Number(value)) || !value || !/^[1-9]\d*$/.test(value)){
                return  callback(new Error('请输入正整数'));
            }   
            this.ruleForm[name] = value ? Math.abs(+value) : ''
            callback();
        }
        let taxValidatePass = (rule, value, callback) => {
            let name = rule.field
            // console.log(name);
            // console.log(value);
            if(isNaN(Number(value)) || !value){
                return  callback(new Error('请输入数字'));
            }   
            this.ruleForm[name] = value ? Math.abs(+value) : ''
            callback();
        }
        return {
            ruleForm:{
                purchaseType:null,
                supplierId:null,
                tax:"",
                productionStatus:'',
                productionStatusDesc:'',
                productionDays:'',
                freightDays:'',
                storageDays:"",
                priceList:[
                    {
                        numStart:"",
                        numEnd:"",
                        price:'',
                        purchaseFreight:"",
                        processPrice:"",
                        otherPrice:"",
                        priceUnit:'',
                    }
                ],
                defaultFlag:false
            },
            priceUnitOpts:[],
            rules:{
                purchaseType:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                supplierId:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                tax:[
                     { required: true, trigger: ['blur'] ,validator: taxValidatePass},
                ],
                productionStatus:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                productionStatusDesc:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                productionDays:[
                     { required: true, trigger: ['blur'] , validator: validatePass },
                ],
                freightDays:[
                    { required: true, trigger: ['blur'], validator: validatePass},
                ],
                storageDays:[
                    { required: true, trigger: ['blur'] ,validator: validatePass},
                ],
            },
            getRules(index){
                var checkAge = (rule, value, callback) => {
                    let name = rule.field.split('.')[2]
                    // console.log(name);
                    // console.log(value);
                    if( name !=='priceUnit'){
                        if((isNaN(Number(value)) || !value) && value!==0){
                            return  callback(new Error('请输入数字'));
                        }   
                        this.ruleForm.priceList[index][name] = value ? Math.abs(+value) : ''
                    }
                    if(name === 'priceUnit'){
                        if(!value && value !==0){
                            return  callback(new Error('请选择'));
                        }
                    }
                    callback();
                }
                return { validator: checkAge, trigger:['change','blur'] }
            },
            skuOpts:[],//sku下拉框
            supplierOpts:[],//供应商下拉
            supplierTypeOpts:[],//供应商类型下拉

            opts:{
                visible:false,
                fullscreen:false,
                appendToBody:true,
                title:'添加供应商',
                top:'8vh',
                okBtnText:'确定',
                cancelBtnText:'取消',
                width:'70%',
                height:'600px'
            },
            addEvents:{
                handleOkClick:()=> {
                    return  this.$refs.addDialog.saveBtn().then(()=> {
                        this.ruleForm.supplierId = null
                        this.ruleForm.purchaseType = null
                        this.ruleForm.supplierOpts = []
                        return Promise.resolve(true)
                    })
                }
            },
            addValidate:()=> {
                return this.$refs.addDialog.validate()
            },
        };
    },
    methods: {
        //获取币种
        getPriceUnitOpts(){
            this.$api[`product/purchaseGlEnumList`]({
                enumName:"Repo-Currency-Unit"
            })
            .then((data) => {
                let {rows} = data
                this.priceUnitOpts = rows.map(i=>{
                    return{
                        label:i.labelCn,
                        value:i.value,
                        labelEn : i.labelEn
                    }
                })
            })
        },
        supplierTypeChange(v){
            this.supplierOpts =[]
            this.ruleForm.supplierId = null
            if (v || v===0) {
                this.getSupplierOpts()
            }
        },
        //获取供应商的下拉
        getSupplierOpts(){
            this.$api[`product/glSupplierGetComboBox`]({
                purchaseType : this.ruleForm.purchaseType
            })
            .then((data) => {
                console.log(data);
                let {rows} = data
                this.supplierOpts = rows.map(i=>{
                    return{
                        label:i.name,
                        value:i.id
                    }
                })

            })
        },
        //获取供应商采购类型的下拉
        glSelectPurchaseType(){
            this.$api[`product/glSelectPurchaseType`]()
            .then((data) => {
                let {rows} =  data
                this.supplierTypeOpts = rows.map(i=>{
                    return {
                        label:i.name,
                        value:i.id
                    }
                })
                // console.log(data);
            })
        },
        //添加供应商
        addSupplier(){
            this.opts.visible = true 
        },
        //保存供应商
        saveBtn(){
            return this.$refs.ruleForm.validate().then( () => {
                let params = JSON.parse(JSON.stringify(this.ruleForm))
                //供应商名字
                this.supplierTypeOpts.forEach( i => {
                    if( i.value === params.purchaseType){
                        params.supplierName =  i.label
                    }
                })
                //激活状态
                params.defaultFlag = params.defaultFlag === false ? 0 : 1
                //价格单位
                let firstPriceUnitName = ''
                //报价
                let priceArr = []
                params.priceList.forEach(i=>{
                    priceArr.push(i.price)
                    this.priceUnitOpts.forEach(k=>{
                        if(i.priceUnit === k.value){
                            i.priceUnitName = k.labelEn
                            if(!firstPriceUnitName) firstPriceUnitName = k.labelEn
                        }   
                    })
                })
                priceArr.sort((a,b)=>{
                    return a - b
                })
                params.purchasePrice =  firstPriceUnitName + priceArr[0] + '~' + priceArr[priceArr.length-1] 
                //含税价
                let {tax} = params
                let minIncludingTaxPrice = priceArr[0] * params.tax
                let maxIncludingTaxPrice = priceArr[priceArr.length-1] * tax
                params.includingTaxPrice = firstPriceUnitName + minIncludingTaxPrice.toFixed(2) + '~' + maxIncludingTaxPrice.toFixed(2) 
                //采购运费 
                params.purchaseFreight =  firstPriceUnitName + params.priceList[0].purchaseFreight 
                //添加的标识
                if(!params.addId){
                    params.addId = Date.now()  
                }
                return Promise.resolve(params)
            })
            
        },
        
    },
    created() {
        this.getPriceUnitOpts()
        this.glSelectPurchaseType()
        if( this.editData ){
            console.log(this.editData );
            let {defaultFlag} = this.editData
            this.getSupplierOpts()
            for(let k in this.editData ){
                if(this.editData.hasOwnProperty(k)){
                    this.ruleForm[k] = this.editData[k]
                }
            }
            this.ruleForm.defaultFlag = defaultFlag === 1 ? true :false
        }
    },
    computed:{
        validate(){
            return ()=>{
                return this.$refs.ruleForm.validate()
            }
        }
    }
};
</script>

<style scoped lang="scss">
.days{
    display: flex;
    justify-content: space-between;
    &>div{
        width:30%;
    }
}
.red{
    color: #F56C6C;
    font-size: 14px;
    vertical-align: middle;
}
.price{
    display: flex;
    &>div:first-child{
        width:26%;
        display: flex;
        &>div{
            width:50%;
        }
    }
    /deep/.el-input-group__prepend{
            padding:0 10px !important;
        }
        
    
}
 
</style>
