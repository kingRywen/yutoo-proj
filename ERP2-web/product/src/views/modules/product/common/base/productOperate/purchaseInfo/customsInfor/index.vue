<template>
    <div style='margin-top:10px;' class='customsInfor'>
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" size='small'>
            <el-form-item label="英文报关名称" prop="customsNameEn">
                <el-input v-model.trim="ruleForm.customsNameEn" placeholder="（例：USB Data Cable）请控制在 35 个字符"></el-input>
            </el-form-item>
            <el-form-item label="中文报关名称" prop="customsNameCn">
                <el-input v-model.trim="ruleForm.customsNameCn"></el-input>
            </el-form-item>
            <el-form-item label="产品用途中文" prop="applicationCn">
                <el-input v-model.trim="ruleForm.applicationCn"></el-input>
            </el-form-item>
            <el-form-item label="产品用途英文" prop="applicationEn">
                <el-input v-model.trim="ruleForm.applicationEn"></el-input>
            </el-form-item>
            <el-form-item label="报关材质中文" prop="materialCn">
                <el-input v-model.trim="ruleForm.materialCn"></el-input>
            </el-form-item>
            <el-form-item label="报关材质英文" prop="materialEn">
                <el-input v-model.trim="ruleForm.materialEn"></el-input>
            </el-form-item>
            <el-form-item label="海关编码" prop="hsCode">
                <div style='display:flex;'>
                    <el-input v-model.trim="ruleForm.hsCode"></el-input>
                    <el-button type='text' @click='openWindow'>查询海关编码</el-button>
                </div>
            </el-form-item>
            <el-form-item label="退税率（%）" prop="refundTaxRate">
                <el-input v-model.trim="ruleForm.refundTaxRate" placeholder="最多支持两位小数"></el-input>
            </el-form-item>
            <el-form-item label="申报要素" prop="declareElement">
                <el-input v-model="ruleForm.declareElement" type='textarea' :rows='5' placeholder="多个申报元素,以'，'分隔"></el-input>
            </el-form-item>
            <el-form-item>
                <span slot='label'> 
                    <span class='red'>*</span>
                    <span>报关价清关税率</span> 
                </span>
                <div>
                    <ElButton  type='primary' size='large' @click='stateConfiguration'>国家配置</ElButton>
                    <ElButton  type='text' style='color: #F56C6C;' v-if='!countryOpts.length'>请配置</ElButton>
                    <ElButton  type='primary' plain size='large' v-if='countryOpts.length' @click='batchEdit'>批量应用修改</ElButton>
                    <el-form-item label="" prop="customsCountryId" style='display:inline-block;' v-if='countryOpts.length'>
                        <el-select v-model="ruleForm.customsCountryId" placeholder="请选择"   style="margin-left:10px;" size='large'  >
                            <el-option
                            v-for="item in countryOpts"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <ElButton  type='text'  style='float:right;' @click='opts2.visible = true'  v-if='countryOpts.length'>推荐报关价计算规则</ElButton>
                </div>
                <div style='margin-top:10px;' v-if='countryOpts.length'>
                    <yt-table :data='ruleForm.tableData' :columns="columns" border  :treeTable='true' :treeTableOtions='treeTableOtions' :tableRowClassName='tableRowClassName' class='el-table' @selectChange='selectChange' ref='table'></yt-table>
                </div>
            </el-form-item>
        </el-form>
        <!-- 国家配置 -->
        <Dialog :opts='opts' :events='addEvents' :validate='addValidate'>
            <StateConfiguration  v-if='opts.visible' ref='StateConfigurationDialog' :productRepoId='productRepoId' />
        </Dialog>
        <!-- 报关计税价规则 -->
        <Dialog :opts='opts2' :events='Events2' :validate='Validate2'>
            <TaxRule  v-if='opts2.visible' ref='TaxRuleDialog'  />
        </Dialog>
    </div>
</template>

<script>
import { Promise } from 'q';
export default {
    components:{
        Dialog:()=>import('Components/MainLayout/src/dialog'),
        StateConfiguration:()=>import('./dialog/StateConfiguration'),
        TaxRule:()=>import('./dialog/TaxRule')
    },
    props:['productRepoId'],
    data() {
        var refundTaxRateVail = (rule, value, callback) => {
            if(value){
                if (isNaN(Number(value))) {
                    return callback(new Error('请输入数字'));
                };
                if(String(value).indexOf(".")!==-1){
                    let y = String(value).indexOf(".")
                    let length = value.length - y -1
                    if(length>2){
                        return callback(new Error('若小数,请输入两位小数'));
                    }
                }
                this.ruleForm.refundTaxRate = this.ruleForm.refundTaxRate ?  Math.abs(+this.ruleForm.refundTaxRate) : ''
            }
            callback()
        };
        return {
            ruleForm:{
                customsNameEn:'',
                customsNameCn:'',
                applicationCn:'',
                applicationEn:'',
                materialCn:'',
                materialEn:'',
                hsCode:'',
                refundTaxRate:'',
                declareElement:'',
                customsCountryId:"",
                tableData:[]
            },
            rules:{ 
                customsNameEn:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                customsNameCn:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                // applicationCn:[
                //     { required: true, message: '请输入', trigger: ['blur']},
                // ],
                // applicationEn:[
                //     { required: true, message: '请输入', trigger: ['blur']},
                // ],
                materialCn:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                materialEn:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                hsCode:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                refundTaxRate:[
                    {  trigger: ['blur'], validator: refundTaxRateVail },
                ],
                // declareElement:[
                //     { required: true, message: '请输入', trigger: ['blur']},
                // ],
                customsCountryId:[
                     { required: true, message: '请选择', trigger: ['blur','change']},
                ]
            },
            countryOpts:[],

            opts:{
                visible:false,
                fullscreen:false,
                appendToBody:true,
                title:'选择需要配置报关家清关税的国家',
                top:'8vh',
                okBtnText:'确定',
                cancelBtnText:'取消',
                width:'50%',
                height:'600px'
            },
            addEvents:{
                handleOkClick:()=>{
                    return  this.$refs.StateConfigurationDialog.saveBtn().then((res)=>{
                        this.countryOpts = res.map(i=>{
                            return {
                                label:i.customsCountryName,
                                value:i.customsCountryId
                            }
                        })
                        console.log(this.countryOpts );
                        //this.selectCountry  = res
                        // console.log(this.selectCountry );
                        return Promise.resolve(true)
                    })
                }
            },
            addValidate:()=>{
                return this.$refs.StateConfigurationDialog.validate()
            },
            //selectCountry:[],
            //tableData:[],
            columns:[],
            treeTableOtions: {
                childs: 'childList',
                expandFunc: row => {
                    return row.childList && row.childList.length > 0
                }
            },
            getRules(index,row){
                var checkAge = (rule, value, callback) => {
                    //console.log(rule.field);
                    let name = rule.field.split(']')[2]
                    // console.log(rule);
                    // console.log(index);
                    // console.log(row);
                    //console.log(row[name] );
                    // console.log(row.customEdit);
                    if(row.customEdit){
                        if(name ==='customsPrice' && row[name]){
                            if((isNaN(Number(row[name])) )){
                                return  callback(new Error('请输入数字'));
                            }else{
                                row[name] = row[name] ? Math.abs(+row[name]) : ''
                            }
                        }else{
                            return callback();
                        }
                        
                    }else{
                        if( name ==='customsPrice' || name === 'taxRate'){
                            if((isNaN(Number(row[name])) || !row[name] ) && row[name] !==0){
                                return  callback(new Error('请输入数字'));
                            }   
                            //row[name] = row[name] ? Math.abs(+row[name]) : ''
                        };
                        if( name === 'customsPriceCurrency'){
                            if(row[name] == null ){
                                return  callback(new Error('请选择'));
                            }
                        }

                    }
                    callback();
                }
                return { validator: checkAge, trigger:['blur','change'] ,required:true }
            },



            opts2:{
                visible:false,
                fullscreen:false,
                appendToBody:true,
                title:'推荐报关价计算规则',
                top:'8vh',
                okBtnText:'确定',
                cancelBtnText:'取消',
                width:'50%',
                height:'600px'
            },
            Events2:{
                handleOkClick:()=>{
                    return  this.$refs.TaxRuleDialog.saveBtn()
                }
            },
            Validate2:()=>{
                return this.$refs.TaxRuleDialog.validate()
            },

            selectS:[],//国家配置选择项

        };
    },
    methods: {
       
        openWindow(){
            window.open('https://www.hsbianma.com/', '_blank')
        },
        stateConfiguration(){
            this.opts.visible = true 
        },
        tableRowClassName({row, rowIndex}){
            // console.log(row);
            // console.log(rowIndex);
            if (rowIndex === 0) {
                return 'success-row';
            }
        },
        selectChange(v){
            this.selectS = v
        },
        //批量应用修改
        batchEdit(){
            //console.log(this.selectS);
            let {customsPrice,customsPriceCurrency} = this.ruleForm.tableData[0]
            if( !customsPrice && !customsPriceCurrency){
                this.$message.warning('请先填写要修改数据')
                return
            }
            if(isNaN(Number(customsPrice))){
                this.$message.warning('请正确填写要修改数据')
                return
            };
            if(!this.selectS.length){
                this.$message.warning('请勾选要修改数据')
                return
            }
            // console.log(customsPrice);
            // console.log(customsPriceCurrency);
            this.$confirm('此操作将修改列表项所有数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids =  this.selectS.map(i=>i.productRepoCustomsRelId)
                //console.log(ids);
                ids.forEach(k=>{
                    changeData(this.ruleForm.tableData,k)
                })
                
                function changeData(data,id){
                    data.forEach(i=>{
                        if(i.productRepoCustomsRelId === id){
                            if( customsPrice || customsPrice===0 ){
                                i.customsPrice = customsPrice                                
                            };
                            if(customsPriceCurrency || customsPriceCurrency===0){
                                i.customsPriceCurrency = customsPriceCurrency   
                            };
                        };
                        if(i.childList){
                            changeData(i.childList,id)
                        }
                    })
                }
                this.$refs.table.$refs.table.clearSelection()
                this.$message.success('操作成功')
            }).catch(() => {
                 
            });
        },
        getData(){
            this.$api[`product/prProductRepoPurchaseGet`]({
                productRepoId:this.productRepoId,
                search : this.searchInp
            })
            .then((data) => {
                let { declareInfo } = data.rows
                //console.log(declareInfo);
                let {priceList,...info} = declareInfo
            
                this.ruleForm = info
                //this.ruleForm.customsCountryId = customsCountryId
                let child = [] 
                let parent 
                priceList.forEach(i=>{
                    if( i.parentChildType === 0){
                       parent = i  
                    };
                    if( i.parentChildType === 1 ){
                        child.push(i)
                    }
                })
                parent.customsPrice  = parent.customsPrice || parent.customsPrice === 0 ? parent.customsPrice : ''
                parent.customsPriceCurrency  = parent.customsPriceCurrency || parent.customsPriceCurrency === 0  ? parent.customsPriceCurrency : null
                parent.taxRate  = parent.taxRate || parent.taxRate === 0 ? parent.taxRate : ''
                child.forEach(i=>{
                    i.customsPrice = i.customsPrice || i.customsPrice === 0  ? i.customsPrice : ''
                    i.customsPriceCurrency = i.customsPriceCurrency || i.customsPriceCurrency === 0  ? i.customsPriceCurrency : null
                    i.taxRate = i.taxRate || i.taxRate === 0  ? i.taxRate : ''
                })
                let table = [
                    {
                        ...parent,
                        childList:child
                    }
                ];
                table.unshift({
                    customsPrice:null,
                    customsPriceCurrency:null,
                    customEdit:true
                })
                this.$set(this.ruleForm,'tableData',table)
                
                
                //console.log(this.tableData);
            })
        },
        //获取币种
        getPriceUnitOpts(){
            let vm = this
            this.$api[`product/purchaseGlEnumList`]({
                enumName:"Repo-Currency-Unit"
            })
            .then((data) => {
                let {rows} = data
                let arr = rows.map(i=>{
                    return{
                        label:i.labelCn,
                        value:i.value
                    }
                })
                this.columns = [
                    {
                        label:"仓库SKU",
                        value:'repoSku',
                        expand:true
                    },
                    {
                        label:"推荐报关价格",
                        value:'recoCustomsPrice',
                    },
                    {
                        label:"报关价格",
                        value:'pprice',
                        width:'300px',
                        render(h,scope){
                            return(
                                <div style='display:flex;'>
                                    <el-form-item prop={'tableData]'+ scope.$index+']customsPrice'} style='margin-right:10px;' rules={vm.getRules(scope.$index,scope.row)}>
                                        <el-input vModel={scope.row.customsPrice} ></el-input>
                                    </el-form-item>
                                    <el-form-item prop={'tableData]'+ scope.$index+']customsPriceCurrency'} style='width:80%' rules={vm.getRules(scope.$index,scope.row)}>
                                        <el-select vModel={scope.row.customsPriceCurrency} placeholder="请选择" style='width:100%'>
                                            {
                                                arr.map(item=>{
                                                    return (
                                                        <el-option
                                                        key={item.value}
                                                        label={item.label}
                                                        value={item.value}>
                                                        </el-option>
                                                    )
                                                })
                                            }
                                        </el-select>
                                    </el-form-item>
                                </div>   
                            )
                        }
                    },
                    {
                        label:"清关税率（%）",
                        value:'taxRate',
                        render(h,scope){
                            return scope.row.childList ? (
                                <el-form-item prop={'tableData]'+ scope.$index+']taxRate'} rules={vm.getRules(scope.$index,scope.row)}>
                                     <el-input vModel={scope.row.taxRate}></el-input>
                                </el-form-item>
                            ) : ''
                        }
                    },
                    {
                        label:"单个清关税费",
                        value:'singleTaxRate',
                    },
                ]
            })
        },
        saveBtn(){
            function deepCopy(obj) {
                var result = {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        result[key] = obj[key];
                    }
                }
                return result;
            }
            let arr = []
            if(!this.countryOpts.length){
                arr.push(Promise.reject(false))
            }   
            arr.push( this.$refs.ruleForm.validate())
            return Promise.all(arr).then(()=>{
                
                let ruleForm = deepCopy(this.ruleForm)
                let declareInfo = {...ruleForm};
                let parent = deepCopy(ruleForm.tableData[1]) 
                //let parent = tableData
                let child = parent.childList
                // console.log(parent);
                // console.log(child);
                delete parent.childList
                let priceList = [parent,...child]
                priceList.forEach(i=>{
                    i.customsCountryId = this.customsCountryId
                })
                declareInfo.priceList = priceList
                delete declareInfo.tableData
                return Promise.resolve({declareInfo})
            
            }).catch((err)=>{
                return Promise.reject(err)
            })
        },
        isValidSuccess() {
           
            function isEmpty(data) {
                if (Array.isArray(data) && data.length == 0) {
                    return true
                }
                if (data == null || data === '') {
                    return true
                }
                return false
            }

            let  ruleForm  = this.$refs.ruleForm //所有的验证fileds
            //console.log(ruleForm.fields);
        
            let validSuccess = true
             ruleForm.fields.forEach(i => {
                if(i.prop.indexOf(']')!==-1){ //下面的表格的验证
                    let index = i.prop.split(']')[1]*1
                    let name = i.prop.split(']')[2]
                    // console.log(index);
                    // console.log(name);
                    if(i.isRequired){
                        if( index ===1 ) {
                            let val =  this.ruleForm.tableData[index][name]
                           // console.log(val);
                            if(isEmpty(val) || i.validateState === 'error'){
                               // console.log(i);
                                validSuccess = false
                            }
                        }else if(index>1){
                            //console.log(this.ruleForm.tableData);
                            let val =  this.ruleForm.tableData[1].childList[index-2][name]
                            
                            if(isEmpty(val) || i.validateState === 'error'){
                                validSuccess = false
                               // console.log(i);
                            }
                        }
                        
                       
                    }
                    //console.log(val);
                }
                //上面form表单的验证
                else if( (i.isRequired && i.validateState === 'error' ) || ( i.isRequired && isEmpty(i.fieldValue) ) ) {
                    //console.log(i);
                    validSuccess = false
                };
            })
            //console.log(validSuccess);
            this.$emit('update:isComplete1', !validSuccess)
        },
    },
    created() {
        this.getData()
        this.getPriceUnitOpts()
    },
    computed:{
        // isComplete(){
        //     let first = false , second =false
        //     if(!this.countryOpts.length){
        //         first = false
        //     }else{
        //         first = true
        //     }
        //     //console.log(first);
        //     this.$refs.ruleForm  && this.$refs.ruleForm.validate((valid) => {
        //         if (valid) {
        //            second = true
        //         } else {
        //             second =false
        //         }
        //     });
        //     //console.log(second);
        //     return first && second
        // }
    },
    watch:{
        // isComplete(v){
        //    this.$emit('update:isComplete1', !v);
        // },
        ruleForm:{
            deep: true,
            handler(val) {
                //console.log(666);
                this.$nextTick(() => {
                    this.isValidSuccess()
                })
            }
        }
    }
};
</script>

<style scoped lang="scss">
.red{
    color: #F56C6C;
    font-size: 14px;
    vertical-align: middle;
}
.customsInfor{
    /deep/{
        .el-form-item--small.el-form-item {
            margin-bottom: 14px;
            margin-top: 14px;
        }
    }
}
.el-table
    /deep/ .success-row {
    background: #d9d9ff;
  }
</style>
