<template>
<!-- 添加人份无 -->
    <div>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="rules" ref='form'>
            <el-form-item label="数据类型"  prop='productType'>
                <el-select v-model="formLabelAlign.productType" placeholder="请选择" size='mini' style='width:100%'>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择类目"  prop='categoryIdArr'>
                <el-cascader 
                    v-loading="loadingCas" 
                    placeholder="请选择" 
                    style='width:100%'
                    @active-item-change='activeItemChange'
                    v-model="formLabelAlign.categoryIdArr" 
                    :options="cascaderOptions" 
                    :props="prop"
                     size="mini" 
                    clearable>
                </el-cascader>
            </el-form-item>
            <el-form-item label="产品ID" prop='asin'>
                <el-input v-model="formLabelAlign.asin" placeholder="请输入" size='mini' style='width:100%'></el-input>
            </el-form-item>
            <!-- <el-form-item label="关键词" prop='dataSources'>
                <el-input v-model="formLabelAlign.dataSources" placeholder="一行一个,限20个" size='mini' style='width:100%' type='textarea'></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="任务名称" prop='taskName'>
                <el-input v-model="formLabelAlign.taskName" placeholder="请输入" size='mini' style='width:100%'></el-input>
            </el-form-item> -->
            <el-form-item label="" prop="isStart">
                <el-checkbox v-model="formLabelAlign.isStart">是否开启监控</el-checkbox>
            </el-form-item>
            <div v-if='formLabelAlign.isStart'>
                <el-form-item label="监控时间" prop='dataTime'>
                    <el-date-picker
                        v-model="formLabelAlign.dataTime"
                        type="daterange"
                        value-format='yyyy-MM-dd'
                        range-separator="至"
                        size='mini'
                        :picker-options="pickerOptions"
                        style='width:100%'
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="监控评率" prop='frequency'>
                    <el-input v-model="formLabelAlign.frequency" placeholder="请输入10以上的数字" size='mini' style='width:100%' ></el-input>
                </el-form-item>
            </div>
        </el-form>
        
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        let frequencyvalidator=(rule, value, callback) =>{
            if (!value) {
                callback(new Error('输入不能为空'))
                return
            }
           if (isNaN(Number(value)) || Number(value)<10) {
                callback(new Error('请输入10以上的数字'))
            } else {
                callback()
            }
        };
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() -24*3600*1000;
                }
            },
            labelPosition:'left',
            options:[
                {value:0,label:'全部'},
                {value:1,label:'拍卖'},
                {value:2,label:'一口价'},
            ],
            formLabelAlign:{
                productType:null,
                asin:null, 
                // dataSources:null,
                //taskName:null,
                dataTime:[],
                frequency:null,
                siteId:null,
                sellerId:null,
                categoryIdArr:null,
                categoryId:null,
                monitorFlag:null,//是否开启监控
                isStart:false,//是否开启监控
            },
            rules: {
                productType: [
                    { trigger: 'blur',required:true , message:'请选择'}
                ],
                asin: [
                    {trigger: 'blur',required:true, message:'请输入'}
                ],
                categoryIdArr: [
                    { trigger: 'change' ,required:true, message:'请选择'}
                ],
                // taskName: [
                //     {  trigger: 'blur' ,required:true ,message:'请输入'}
                // ],
                dataTime: [
                    {  trigger: 'blur' ,required:true ,message:'请选择'}
                ],
                frequency:[
                    { validator:frequencyvalidator, trigger: 'change',required:true}
                ]
            },

    
            loadingCas: false,
            // 类目选择todod
            prop: {
                value: "pcid",
                children: "childs",
                label: "name"
            },
            cascaderOptions:[],
        };
    },
    methods: {
        //第一次类目列表获取 
        getCategorList() {
            let parentPcid= 0;
            this.$api['ebProductCategoryGetCategory']({
                platformId:this.formLabelAlign.platformId,
                siteId:this.formLabelAlign.siteId,
                sellerId:this.formLabelAlign.sellerId,
                parentPcid,
            })
            .then(data => {
                //console.log(data.data);
                this.cascaderOptions = data.data;
                this.cascaderOptions.forEach(i=>{
                    if(i.haveChildren){
                        i.childs=[];
                    }
                })
            }).catch(() => {})
        },
        //父级选择触发
        activeItemChange(val){
            //console.log(val);
            let id=val[val.length-1];

            this.$api['ebProductCategoryGetCategory']({
                platformId:this.formLabelAlign.platformId,
                siteId:this.formLabelAlign.siteId,
                sellerId:this.formLabelAlign.sellerId,
                parentPcid:id,
            })
            .then(data => {
                //console.log(data);
                let datas=data.data;
                datas.forEach(j=>{
                    if(j.haveChildren){
                        j.childs=[];
                    }
                });
                //debugger
                //console.log(this.cascaderOptions);

                let options=this.cascaderOptions;
                this.findItem(options,datas,id);
                this.cascaderOptions=options;
            
            })
        },
        //为对应的父级赋值
        findItem(options,datas,id){
            //debugger
            //console.log(id);
            for (let index = 0; index < options.length; index++) {
                const j = options[index];
                 if( j.pcid === id && j.haveChildren){
                    //console.log('object');
                    delete j.childs;
                    this.$set(j,'childs',datas);
                    break;
                }else{
                    if(j.childs && j.childs.length){
                        this.findItem(j.childs,datas,id)
                    }
                };
            }
            // options.forEach(j=>{
            //     //console.log(j);
            //     if( j.pcid === id && j.haveChildren){
            //         console.log('object');
            //         this.$set(j,'childs',datas);
            //         return 
            //     }else{
            //         if(j.childs && j.childs.length){
            //             this.findItem(j.childs,datas,id)
            //         }
            //     };
            // })
        },
        _submit() {
            return this.$refs.form.validate().then(()=>{
                let {categoryIdArr}=this.formLabelAlign;
                this.formLabelAlign.categoryId=categoryIdArr[categoryIdArr.length-1];
             
                let [monitorFrom,monitorTo]=this.formLabelAlign.dataTime;
                this.formLabelAlign.monitorFrom=monitorFrom;
                this.formLabelAlign.monitorTo=monitorTo;

                if(this.formLabelAlign.isStart){
                    this.formLabelAlign.monitorFlag=1;
                }else{
                    this.formLabelAlign.monitorFlag=0;
                };
                return this.$api['ebTaskCategoryRankSave'](this.formLabelAlign).then();
            })
        },
    },
    created() {
        this.formLabelAlign.siteId=this.params.siteId;
        this.formLabelAlign.platformId=this.ebayPlatformId;
        this.formLabelAlign.sellerId=this.params.sellerId;
        //this.formLabelAlign.taskFlag=this.params.taskFlag;  //任务类型
        this.getCategorList();
    }
};
</script>

<style scoped lang="less">

</style>
