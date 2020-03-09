<template>
    <!-- 统计区间设置弹框 -->
    <div v-loading='loading'>
        <el-tabs type="card" @tab-click='tabClick' >
            <el-tab-pane label="BSR排名区间" style='margin-left:76px;' >
                <el-form :inline="true" :model="bsrForm" class="demo-form-inline" ref='bsrForm' :label-position="'right'">
                    <div v-for='(item,index) in bsrForm.child' :key='index' > 
                        <el-form-item :label="`区间${index+1}`" :prop="'child.'+ index + '.minRank'" :rules='bsrFormRules(index)'>
                            <el-input v-model.trim="item.minRank" placeholder="请输入正整数" size='mini'></el-input>
                        </el-form-item>
                        <el-form-item label="~" :prop="'child.'+ index + '.maxRank'" :rules='bsrFormRules(index)'>
                            <el-input v-model.trim="item.maxRank" placeholder="请输入正整数" size='mini'></el-input>
                        </el-form-item>
                        <el-form-item label-width="0px" style="width:58px;position:relative;top:1px;" >
                            <i class="el-icon-remove-outline common_font_color __pointer" 
                                v-if='bsrForm.child.length>1'
                                @click='bsrForm.child.splice(index,1)'
                                ></i>
                            <i class="el-icon-circle-plus-outline common_font_color __pointer" 
                                style="padding:0px 5px"
                                v-if='index=== bsrForm.child.length-1'
                                @click="bsrForm.child.push({minRank:'',maxRank:''})"
                                >
                            </i>
                        </el-form-item>
                    </div>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="上架时间" style='margin-left:76px;' >
                <el-form :inline="true" :model="putawayForm" class="demo-form-inline" ref='putawayForm'>
                    <div v-for='(item,index) in putawayForm.child' :key='index' > 
                        <el-form-item :label="`区间${index+1}`" :prop="'child.'+ index + '.minReleaseDay'" :rules='putawayFormRules(index)'>
                            <el-input v-model.trim="item.minReleaseDay" placeholder="请输入正整数" size='mini'></el-input>
                        </el-form-item>
                        <el-form-item label="~" :prop="'child.'+ index + '.maxReleaseDay'" :rules='putawayFormRules(index)'>
                            <el-input v-model.trim="item.maxReleaseDay" placeholder="请输入正整数" size='mini'></el-input>
                        </el-form-item>
                        <el-form-item label-width="0px" style="width:58px;position:relative;top:1px;" >
                            <i class="el-icon-remove-outline common_font_color __pointer" 
                                v-if='putawayForm.child.length>1'
                                @click='putawayForm.child.splice(index,1)'
                                ></i>
                            <i class="el-icon-circle-plus-outline common_font_color __pointer" 
                                style="padding:0px 5px"
                                v-if='index=== putawayForm.child.length-1'
                                @click="putawayForm.child.push({minRank:'',maxRank:''})"
                                >
                            </i>
                        </el-form-item>
                    </div>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="评分" style='margin-left:76px;'>
                <el-form :inline="true" :model="gradeForm" class="demo-form-inline" ref='gradeForm'>
                    <div v-for='(item,index) in gradeForm.child' :key='index' >
                        <el-form-item :label="`区间${index+1}`" :prop="'child.'+ index + '.minStarCnt'" :rules='gradeFormFormRules(index)'>
                            <el-input v-model.trim="item.minStarCnt" placeholder="请输入" size='mini'></el-input>
                        </el-form-item>
                        <el-form-item label="~" :prop="'child.'+ index + '.maxStarCnt'" :rules='gradeFormFormRules(index)'>
                            <el-input v-model.trim="item.maxStarCnt" placeholder="请输入" size='mini'></el-input>
                        </el-form-item>
                        <el-form-item label-width="0px" style="width:58px;position:relative;top:1px;" >
                            <i class="el-icon-remove-outline common_font_color __pointer" 
                                v-if='gradeForm.child.length>1'
                                @click='gradeForm.child.splice(index,1)'
                                ></i>
                            <i class="el-icon-circle-plus-outline common_font_color __pointer" 
                                style="padding:0px 5px"
                                v-if='index=== gradeForm.child.length-1'
                                @click="gradeForm.child.push({minRank:'',maxRank:''})"
                                >
                            </i>
                        </el-form-item>
                    </div>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="日新增评价数" style='margin-left:76px;'>
                <el-form :inline="true" :model="evaluateForm" class="demo-form-inline" ref='evaluateForm'>
                    <div v-for='(item,index) in evaluateForm.child' :key='index' >
                        <el-form-item :label="`区间${index+1}`" :prop="'child.'+ index + '.minReviewCnt'" :rules='evaluateFormFormRules(index)'>
                            <el-input v-model.trim="item.minReviewCnt" placeholder="请输入正整数" size='mini'></el-input>
                        </el-form-item>
                        <el-form-item label="~"  :prop="'child.'+ index + '.maxReviewCnt'" :rules='evaluateFormFormRules(index)'>
                            <el-input v-model.trim="item.maxReviewCnt" placeholder="请输入正整数" size='mini'></el-input>
                        </el-form-item>
                        <el-form-item label-width="0px" style="width:58px;position:relative;top:1px;">
                            <i class="el-icon-remove-outline common_font_color __pointer" 
                                v-if='evaluateForm.child.length>1'
                                @click='evaluateForm.child.splice(index,1)'
                                ></i>
                            <i class="el-icon-circle-plus-outline common_font_color __pointer" 
                                style="padding:0px 5px"
                                v-if='index=== evaluateForm.child.length-1'
                                @click="evaluateForm.child.push({minRank:'',maxRank:''})"
                                >
                            </i>
                        </el-form-item>
                    </div>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div slot='btns' style='text-align:center;margin-top:40px;border-top:1px solid #e5e5e5;padding-top:15px;'>
            <el-button  size="small" @click="restoreDefaultClick" :loading="loadingBtn">恢复默认</el-button>
            <el-button
                size="small"
                type="primary"
                :loading="loadingBtn"
                @click="handleOkClick"
                >确定</el-button>
            <el-button  size="small" @click="handleCancelClick">取消</el-button>
        </div>
         
      
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            tabIndex:0,//点击的tabIndex
            
            bsrForm:{ child:[] },//BSR排名区间
            putawayForm:{ child:[] },//上架时间
            gradeForm:{ child:[] },//评分
            evaluateForm:{ child:[] },//日新增评价数
            //BSR排名区间表单验证
                bsrFormRules(index) {
                    let checkAge = (rule, value, callback) => {
                        //console.log(rule);
                        let Num=Number(value);
                        let fild=rule.field.split('.');
                        let name=fild[fild.length-1]; //label名字
                        let location=fild[fild.length-2]*1+1;//当前输入的是第几项
                        let length=this.bsrForm.child.length;//数组的长度
                       
                        //console.log(name);
                        //console.log();
                        if(name==='maxRank' && location===length && !value){//输入框的最后一项可以为空
                             return callback();

                        }else if (!value) {
                            return callback(new Error('不能为空'));

                        }else if(isNaN(Num)){
                             return callback(new Error('请输入数字'));

                        }else if( Num%1!==0 || Num<=0 || String(value).indexOf('.')!==-1){
                            return callback(new Error('请输入大于一的正整数'));

                        }else if(name==='minRank' && this.bsrForm.child[index].maxRank ){
                            if( Number(this.bsrForm.child[index].minRank) >  Number(this.bsrForm.child[index].maxRank) ){
                                return callback(new Error('大于大值'));
                            }

                        }else if(name==='maxRank' && this.bsrForm.child[index].minRank){
                            if( Number(this.bsrForm.child[index].minRank) > Number(this.bsrForm.child[index].maxRank) ){
                                return callback(new Error('小于小值'));
                            }
                        };
                        this.bsrForm.child.forEach((i,inde)=>{
                            if( (Num === Number(i.minRank) ||  Num===Number(i.maxRank) ) && inde!==index && Num!==0){
                                return callback(new Error(`区间${inde+1}已填`));
                            }
                        });
                        callback();
                        
                    };
                    return  { validator: checkAge, trigger: 'change' }
                },
            //上架时间表单验证
                putawayFormRules(index){
                    let checkAge = (rule, value, callback) => {
                        //console.log(rule);
                        let Num=Number(value);
                        let fild=rule.field.split('.');
                        let name=fild[fild.length-1];//label名字
                        let location=fild[fild.length-2]*1+1;//当前输入的是第几项
                        let length=this.putawayForm.child.length;//数组的长度
                        //console.log(name);
                        if(name==='maxReleaseDay' && location===length && !value){//输入框的最后一项可以为空
                            return callback();

                        }else if (!value && value!==0) {
                            return callback(new Error('不能为空'));

                        }else if(isNaN(Num)){
                             return callback(new Error('请输入数字'));

                        }else if( Num%1!==0 || Num<0 || String(value).indexOf('.')!==-1){
                            return callback(new Error('请输入正整数'));

                        }else if(name==='minReleaseDay' && this.putawayForm.child[index].maxReleaseDay ){
                            if( Number(this.putawayForm.child[index].minReleaseDay) > Number(this.putawayForm.child[index].maxReleaseDay) ){
                                return callback(new Error('大于大值'));
                            }

                        }else if(name==='maxReleaseDay' && this.putawayForm.child[index].minReleaseDay){
                            if( Number(this.putawayForm.child[index].minReleaseDay) > Number(this.putawayForm.child[index].maxReleaseDay) ){
                                return callback(new Error('小于小值'));
                            }
                        };
                        this.putawayForm.child.forEach((i,inde)=>{
                            if( (Num === Number(i.minReleaseDay) ||  Num===Number(i.maxReleaseDay) ) && inde!==index && Num!==0){
                                return callback(new Error(`区间${inde+1}已填`));
                            }
                        });
                        callback();
                        
                    };
                    return  {  validator: checkAge, trigger: 'change' }
                },
            //评分表单验证
                gradeFormFormRules(index){
                    let checkAge = (rule, value, callback) => {
                        //console.log(value);
                        let Num=Number(value);
                        let fild=rule.field.split('.');
                        let name=fild[fild.length-1];//label名字
                        let location=fild[fild.length-2]*1+1;//当前输入的是第几项
                        let length=this.gradeForm.child.length;//数组的长度

                        if( name==='maxStarCnt' && location===length && !value){ //输入框的最后一项可以为空
                             return callback();
                        
                        }else if (!value && value!==0) {
                            return callback(new Error('不能为空'));

                        }else if(isNaN(Num)){
                             return callback(new Error('请输入数字'));

                        }else if( 0>Num || Num>5){
                            return callback(new Error('请输入0~5之间'));

                        }else if( String(value).indexOf('.')!==-1){
                            var y = String(value).indexOf(".") + 1;//获取小数点的位置
                            var count = String(value).length - y;//获取小数点后的个数
                            if(count>1 || count===0){
                                 return callback(new Error("一位小数"));
                            };

                        }else if (String(value).indexOf('0')===0 && String(value).length>1){
                             return callback(new Error('请正确输入数字'))

                        };
                        if(String(value).indexOf('.')===0 && String(value).length>1){
                             return callback(new Error('请正确输入数字'))

                        }else if(name==='minStarCnt' && this.gradeForm.child[index].maxStarCnt ){
                            if( Number(this.gradeForm.child[index].minStarCnt) >  Number(this.gradeForm.child[index].maxStarCnt) ){
                                return callback(new Error('大于大值'));
                            }

                        }else if(name==='maxStarCnt' && this.gradeForm.child[index].minStarCnt){
                            if( Number(this.gradeForm.child[index].minStarCnt) > Number(this.gradeForm.child[index].maxStarCnt) ){
                                return callback(new Error('小于小值'));
                            }
                        };

                        this.gradeForm.child.forEach((i,inde)=>{
                            if( (Num === Number(i.minStarCnt) ||  Num===Number(i.maxStarCnt) ) && inde!==index && Num!==0){
                                return callback(new Error(`区间${inde+1}已填`));
                            }
                        });
                        callback()
                      
                    };
                return  {  validator: checkAge, trigger: 'change' }
                },
            //日新增评价数表单验证
                evaluateFormFormRules(index){
                    let checkAge = (rule, value, callback) => {
                        //console.log(rule);
                        let Num=Number(value);
                        let fild=rule.field.split('.');
                        let name=fild[fild.length-1];//label名字
                        let location=fild[fild.length-2]*1+1;//当前输入的是第几项
                        let length=this.evaluateForm.child.length;//数组的长度

                        //console.log(name);
                        if(name==='maxReviewCnt' && location===length && !value){ //输入框的最后一项可以为空
                             return callback();

                        }else if (!value && value!==0) {
                            return callback(new Error('不能为空'));

                        }else if(isNaN(Num)){
                             return callback(new Error('请输入数字'));

                        }else if( (value+'').indexOf('.')!==-1 ){
                            var y = String(value).indexOf(".") + 1;//获取小数点的位置
                            var count = String(value).length - y;//获取小数点后的个数
                            if(count>2){
                                 return callback(new Error('若小数,请输入两位小数之内'));
                            }
                        }else if((value+'').indexOf('.')===-1 && !/^[0-9]\d*$/.test(value)){
                            return callback(new Error('若整数,请输入正整数'));

                        }else if(name==='minReviewCnt' && this.evaluateForm.child[index].maxReviewCnt ){
                            if( Number(this.evaluateForm.child[index].minReviewCnt) > Number(this.evaluateForm.child[index].maxReviewCnt) ){
                                return callback(new Error('大于大值'));
                            }

                        }else if(name==='maxReviewCnt' && this.evaluateForm.child[index].minReviewCnt){
                            if( Number(this.evaluateForm.child[index].minReviewCnt) > Number(this.evaluateForm.child[index].maxReviewCnt) ){
                                return callback(new Error('小于小值'));
                            }
                        };
                        this.evaluateForm.child.forEach((i,inde)=>{
                            if( (Num === Number(i.minReviewCnt) ||  Num===Number(i.maxReviewCnt) ) && inde!==index && Num!==0){
                                return callback(new Error(`区间${inde+1}已填`));
                            }
                        });
                        callback();
                        
                    };
                    return  { validator: checkAge, trigger: 'change' }
                },

            loadingBtn:false, //确定按钮的loading

            loading:true, //整个大框的loading

        };
    },
    methods: {
        //确定提交
            handleOkClick(){

                this.loadingBtn=true;

                let idnex=this.tabIndex;

                let isTrue=true;
                let str='';
                let data= {taskId:this.params.taskId} ;
                if(idnex===0){
                    this.$refs.bsrForm.validate((valid) => {
                        if (!valid) {
                            isTrue=false;
                            str='BSR排名区间';
                        }else{
                            data.bsr=this.bsrForm.child;
                            data.flag=0;
                        } 
                    });
                }else if(idnex===1){
                    this.$refs.putawayForm.validate((valid) => {
                        if (!valid) {
                            isTrue=false;
                            str='上架时间'
                        }else{
                            data.release=this.putawayForm.child;
                            data.flag=1;
                        }
                    });
                }else if(idnex===2){
                    this.$refs.gradeForm.validate((valid) => {
                        if (!valid) {
                            isTrue=false;
                            str='评分'
                        }else{
                            data.star=this.gradeForm.child;
                            data.flag=2;
                        }
                    });
                }else if(idnex===3){
                    this.$refs.evaluateForm.validate((valid) => {
                        if (!valid) {
                            isTrue=false;
                            str='日新增评价数'
                        } else{
                            data.review=this.evaluateForm.child;
                            data.flag=3;
                        }
                    });
                };

               
                // console.log(isTrue);
                // console.log(str);
                // return
               

                if(isTrue){
                    this.loading=true;
                    this.$api['taskShopDepthAnalysisSaveRangeConfig'](
                       data
                    )
                    .then(data => {
                        if(data.code===0){
                            //this.handleCancelClick();
                            this.loadingBtn=false;

                            this.loading=false;

                            this.params.fn();
                        }
                    }).catch(() => {

                        this.loadingBtn=false;
                        this.loading=false;

                    })
                }else{
                    this.$message({
                        message:`${str}填写错误`,
                        type:'warning'
                    });
                    this.loadingBtn=false;
                }

            },
        //取消提交
            handleCancelClick(){
                //console.log(this.$parent);
                this.$parent.$parent.$parent.$parent.handleCancelClick()
            },
        //点击标签页改变
            tabClick(v){
                this.tabIndex=v.index*1;
            },
        //恢复默认
            restoreDefaultClick(){

                this.loadingBtn=true;
                
                let data={taskId:this.params.taskId};
                let idnex=this.tabIndex;

                if(idnex===0){
                    data.bsr=[];
                    data.flag=0;
                    this.$refs.bsrForm.clearValidate()
                  
                }else if(idnex===1){
                    data.release=[];
                    data.flag=1;
                    this.$refs.putawayForm.clearValidate()
                   
                }else if(idnex===2){
                    data.star=[];
                    data.flag=2;
                    this.$refs.gradeForm.clearValidate()

                }else if(idnex===3){
                    data.review=[];
                    data.flag=3;
                     this.$refs.evaluateForm.clearValidate()
                };

                this.$api['taskShopDepthAnalysisSaveRangeConfig'](
                       data
                    )
                    .then(data => {
                        if(data.code===0){
                            //this.handleCancelClick();
                            this.loadingBtn=false;
                            this.getData();
                            this.params.fn();

                        }
                    }).catch(() => {
                        this.loadingBtn=false;
                    })
            },
        //获取数据
            getData(){

                this.loading=true;

                this.$api['taskShopDepthAnalysisGetRangeConfig']({
                    taskId:this.params.taskId
                })
                .then(res => {
                    //console.log(res);
                    let {code,data}=res;
                    if(code===0){
                        this.loading=false;
                        this.bsrForm.child=data.bsr;
                        this.putawayForm.child=data.release;
                        this.gradeForm.child=data.star;
                        this.evaluateForm.child=data.review;
                    }
                }).catch(() => {
                      this.loading=false;
                });
            }
        
    },
    created() {
        this.getData();

    },
};
</script>

<style scoped lang="scss">

</style>
