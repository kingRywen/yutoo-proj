<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size='small'>
            <el-form-item label="选择国家" prop="countryId">
                <el-select v-model="ruleForm.countryId" placeholder="请选择"  clearable  style='width:100%;'>
                    <el-option
                    v-for="item in countryOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运输方" prop="transportationId">
                <el-select v-model="ruleForm.transportationId" placeholder="请选择"  clearable style='width:100%;'>
                    <el-option
                    v-for="item in transportationOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运输方式" prop="transportTypeId">
                <el-select v-model="ruleForm.transportTypeId" placeholder="请选择"  clearable style='width:100%;'>
                    <el-option
                    v-for="item in transportTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计价方式" prop="calculationType">
                <el-select v-model="ruleForm.calculationType" placeholder="请选择"  clearable style='width:100%;'>
                    <el-option
                    v-for="item in calculationTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运输天数" prop="transportDays">
                <el-input placeholder="请输入" v-model.trim="ruleForm.transportDays"  clearable></el-input>
            </el-form-item>
            <el-form-item label="体积重" prop="baseNumber">
                <el-input placeholder="请输入" v-model.trim="ruleForm.baseNumber" clearable>
                    <template slot="prepend">长*宽*高 /</template>
                </el-input>
            </el-form-item>
            <el-form-item label="重量单位" prop="weightOrVolumeUnit">
                <el-select v-model="ruleForm.weightOrVolumeUnit" placeholder="请选择"  clearable style='width:100%;'>
                    <el-option
                    v-for="item in weightUnitOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" >
                <span slot='label'> 
                    <span class='red'>*</span>
                    <span>费用（￥)</span> 
                </span>
                <div class='price' v-for='(item,index) in ruleForm.priceList' :key='item.id'>
                    <div>
                        <div>
                            <el-form-item :prop="'priceList.' + index + '.weightOrVolumeStart'" :rules='getRules(index)'>
                                <el-input placeholder="请输入" v-model.trim="item.weightOrVolumeStart">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item  :prop="'priceList.' + index + '.weightOrVolumeEnd'" label-width="20px" :rules='getRules(index)' >
                                <span slot='label' style='margin-left:6px;'> ~ </span>
                                <el-input placeholder="请输入" v-model.trim="item.weightOrVolumeEnd">
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div>
                        <el-form-item  label='' :prop="'priceList.' + index + '.price'" label-width="20px" :rules='getRules(index)'>
                                <el-input placeholder="请输入" v-model.trim="item.price">
                                    <template slot="prepend">费用</template>
                                </el-input>
                        </el-form-item>
                    </div>
                    <div style='min-width:110px;margin-left:10px;'> 
                            <ElButton @click="ruleForm.priceList.push({
                                weightOrVolumeStart:'',
                                weightOrVolumeEnd:'',
                                price:'',
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
        </el-form>
    </div>
</template>

<script>
export default {
    props:['firstTransportId'],
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
                countryId:'',
                transportationId:'',
                transportTypeId:"",
                calculationType:'',
                transportDays:'',
                baseNumber:'',
                weightOrVolumeUnit:'',
                priceList:[
                    {
                        weightOrVolumeStart:"",
                        weightOrVolumeEnd:"",
                        price:"",
                    }
                ]
            },
            countryOpts:[],//国家的下拉
            transportationOpts:[],//运输方的下拉
            transportTypeOpts:[],//运输方式的下拉
            calculationTypeOpts:[//计价方式下拉
                {label:'按体积',value:1},
                {label:'按重量',value:2},
            ],
            weightUnitOpts:[],//重量单位下拉
            rules:{
                countryId:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                transportationId:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                transportTypeId:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                calculationType:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                weightOrVolumeUnit:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                transportDays:[
                    { required: true, trigger: ['blur'] ,validator: validatePass},
                ],
                baseNumber:[
                    { required: true, trigger: ['blur'] ,validator: taxValidatePass},
                ]

            },
            getRules(index){
                var checkAge = (rule, value, callback) => {
                    let name = rule.field.split('.')[2]
                    // console.log(name);
                    // console.log(value);
                    if( (isNaN(Number(value)) || !value) && value!==0){
                        return  callback(new Error('请输入数字'));
                    }   
                    this.ruleForm.priceList[index][name] = value ? Math.abs(+value) : ''
                    callback();
                }
                return { validator: checkAge, trigger:['blur'] }
            },
        };
    },
    methods: {
        //获取运输方的下拉
        getTransportationOpts(){
            this.$api[`product/FirstTransportGlTransportationList`]({})
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.transportationOpts = rows.map(i=>{
                    return{
                        label:i.name,
                        value:i.id
                    }
                })
            })
        },
        //获取运输方式的下拉
        getTransportTypeOpts(){
            this.$api[`product/FirstTransportGlTransportTypeList`]({})
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.transportTypeOpts = rows.map(i=>{
                    return{
                        label:i.name,
                        value:i.id
                    }
                })
            })
        },
        //获取重量单位的下拉
        getWeightUnitOpts(){
            this.$api[`product/purchaseGlEnumList`]({
                 enumName:"Repo-Weight-Unit"
            })
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.weightUnitOpts = rows.map(i=>{
                    return{
                        label:i.labelCn,
                        value:i.value
                    }
                })
            })
        },
        //获取国家的下拉
        getArea(id,options){
            return this.$api[`product/purchaseGlAreaGetChild`]({
                parentAreaId : null,
                level:2
            })
            .then((data) => {
                let {rows} =  data
                //console.log(rows);
                this.countryOpts = rows.map(i=>{
                    return{
                        label:i.name,
                        value:i.id
                    }
                })
               
            })
        },
        saveBtn(){
            let params  = JSON.parse(JSON.stringify(this.ruleForm))
            params.priceList.forEach(i=>{
                i.weightOrVolumeUnit = params.weightOrVolumeUnit
            })
            return this.$api[`product/glFirstTransportSave`](params)
        },
        //获取回显数据
        getInfo(){
            this.$api[`product/glFirstTransportInfo`]({
                firstTransportId:this.firstTransportId
            })
            .then((data) => {
                this.ruleForm = data.rows
                this.ruleForm.weightOrVolumeUnit = this.ruleForm.priceList[0].weightOrVolumeUnit
            })
        },
        editBtn(){
            let params  = JSON.parse(JSON.stringify(this.ruleForm))
            params.priceList.forEach(i=>{
                i.weightOrVolumeUnit = params.weightOrVolumeUnit
            })
            return this.$api[`product/glFirstTransportUpdate`](params)
        },
    },
    created() {
        this.getTransportationOpts()
        this.getTransportTypeOpts()
        this.getWeightUnitOpts()
        this.getArea()
        if(this.firstTransportId || this.firstTransportId ===0 ){
            this.getInfo()
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
.price{
    display: flex;
    &>div:first-child{
        width:50%;
        display: flex;
        &>div{
            width:50%;
        }
    }
    &>div:nth-of-type(2){
        width:50%;
    }
    /deep/.el-input-group__prepend{
            padding:0 10px !important;
        }    
}
.red{
    color: #F56C6C;
    font-size: 14px;
    vertical-align: middle;
}
</style>
