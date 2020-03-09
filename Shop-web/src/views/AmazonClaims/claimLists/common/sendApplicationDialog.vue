<template>
    <div>
        <div class='box'>
            <!-- 发送申请 -->
            <div class='left'>
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item label="原因：" prop='contactReason' :rules="[{ required: true, message:'请输入内容',trigger:['change','blur']}]">
                        <el-input v-model.trim="form.contactReason" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="赔偿类型：" prop='type' v-if='params.Costiswrong'>
                        <el-select v-model="form.type" placeholder="请选择" size='small' style='width:100%' @change='getTemplate(form.type)'>
                            <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联caseID：" prop='caseId' v-if='form.type===1' :rules="[{ required: true, message:'请选择',trigger:['change','blur']}]">
                        <el-select v-model="form.caseId" placeholder="请选择" size='small' style='width:100%' filterable  clearable allow-create>
                            <el-option
                            v-for="item in caseIDOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间：" prop='time' v-if='form.type===1'>
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            v-model='form.time'
                            size='small'
                            style='width:100%'
                            :picker-options="getPickerOptions"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            clearable
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="正文："  prop='sendContent' :rules="[{ required: true, message:'请输入内容',trigger:['change','blur']}]">
                        <el-input v-model.trim="form.sendContent" type='textarea' size="small" rows='15' ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class='right'>
                <div style='background-color:#f5f5f5;line-height:30px;padding-left:10px;'>选择模板</div>
                <div style='width:90%;margin:10px auto;'>
                    <el-autocomplete
                        class="inline-input"
                        style='width:100%;'
                        size='small'
                        prefix-icon="el-icon-search"
                        v-model.trim="searchInp"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入模板名称"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                        ></el-autocomplete>
                </div>
                <div style='width:90%;margin:10px auto;border:1px solid #e5e5e5;' v-if='tempDatas.length>0'>
                    <div v-for='(item,index) in tempDatas' :key="item.id"  class='temp-div' @click='tempClick(item.templateName,index)'>{{item.templateName}}</div> 
                </div>
                <div v-else style='width:90%;margin:10px auto;'>
                    暂无数据
                </div>
            </div>
        </div>
        <!-- <div style='text-align:center;'> <el-button type="primary" size='small' style='width:110px;' :loading="btnloading" @click='sendContentBtn'>发送</el-button></div> -->
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            //赔偿类型
            typeOptions:[
                {label:'重测', value:0},
                {label:'索赔', value:1},
            ],
            caseIDOptions:[],//caseId选择项
            getPickerOptions:{
                disabledDate(time) {
                    return time.getTime() < Date.now() -24*3600*1000;
                },
            },
            //
            form:{
                contactReason:"",
                sendContent:"",
                templateType:null,
                taskId:"",
                caseId:'',
                time:[],
                type:0,
            },

            searchInp:"",//搜索的输入

            tempDatas:"",//模板的数据

            searchDatas:[],//搜索输入框匹配的数据

            btnloading:false, 
        };
    },
    methods: {
        //输入的搜索
            querySearch(queryString, cb) {
                var restaurants = this.searchDatas;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (
                         restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
                        
                    );
                };
            },
        //输入框的选择
            handleSelect(item){
                console.log(item);
                this.form.contactReason=item.contactReason;
                this.form.sendContent=item.templateContent;
                this.form.templateType=item.templateType;
            },
        //模板的每一项的点击
            tempClick(v,index){
                this.searchInp=v;
                this.form.contactReason=this.tempDatas[index].contactReason;
                this.form.sendContent=this.tempDatas[index].templateContent;
                this.form.templateType=this.tempDatas[index].templateType;
                //console.log(this.tempDatas[index]);
            },
        //获取模板
            getTemplate ( v ){
                let params={
                    taskId:this.params.taskId
                };
                if(this.params.Costiswrong) {
                    params.type= v || 0;
                    this.form.type= v || 0;
                };
                this.$api['taskClaimTemplateListTaskTemplate'](params)
                .then(data => {
                    if(data.code===0){
                        this.tempDatas=data.data;
                        this.tempDatas.forEach(i=>{
                            this.searchDatas.push(
                                {
                                    value:i.templateName,
                                    contactReason:i.contactReason,
                                    templateContent:i.templateContent,
                                    templateType:i.templateType,
                                }
                            ); //搜索输入框的数据 ,只能使用value字段作为选择下拉的数据
                        });
                        if(data.caseIds){
                            data.caseIds.forEach(k=>{
                                this.caseIDOptions.push({
                                    label:k,
                                    value:k
                                })
                            })
                        }   
                    }
                })
            },
        //点击发送
            _submit(){
                //this.btnloading=true;
                // this.$refs.form.validate((valid) => {
                //     if (valid) {
                //         this.$api['taskClaimTemplateSendEmail'](this.form)
                //         .then(data => {
                //             if(data.code===0){
                //                 this.btnloading=false;
                //                 this.$parent.$parent.$parent.handleClose();
                //                 this.$parent.$parent.$parent.$parent.$parent.getList()
                //             }
                //         }).catch(err=>{
                //             this.btnloading=false;
                //         })
                //     }else {
                //        this.btnloading=false;
                //     }
                // });
                return this.$refs.form.validate().then(()=>{
                    let {contactReason , sendContent , templateType ,taskId} =JSON.parse( JSON.stringify(this.form) ) ;
                    let params={ contactReason , sendContent , templateType ,taskId };
                    //费用不对时需要的参数
                    if(this.params.Costiswrong){
                        let { caseId , time , type } = this.form;
                        let [startTime , endTime ] = time || [];
                        params.caseId = caseId;
                        params.type = type;
                        params.startTime = startTime;
                        params.endTime = endTime;
                    }
                    // console.log(params);
                    //  return 
                    return  this.$api['taskClaimTemplateSendEmail'](params)
                })
              
            }
    },
    created() {
        this.getTemplate();
        this.form.templateType=this.params.templateType;
        this.form.taskId=this.params.taskId;

      
    },
};
</script>

<style scoped lang="less">
.box{
    display:flex;
    justify-content: space-around;
    .left{
        width: 60%;
    }
    .right{
        width: 30%;
        border:1px solid #e5e5e5;
    }
    .temp-div{
        line-height:30px;margin-left:6px;
        &:hover{
            color:#108ee9;
            cursor: pointer;
        }
    }
}

</style>
