<template>
<!--添加和编辑定时调整预算策略 -->
    <div v-loading='loading'>
        <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="优化方式" prop="name">
                <el-select v-model="ruleForm.seoType" placeholder="请选择活动区域" size='mini' @change='selectChange' :disabled="seoTypeDisabled">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                     </el-option>
                </el-select>
            </el-form-item>
            <!-- 周一到周日 -->
            <el-form-item label="请选择" prop="radio" v-if='ruleForm.seoType===1'   :rules="radioRules()"  >
                <el-radio-group v-model="ruleForm.radio" @change='radioChange'>
                    <el-radio-button 
                        v-for='item in radioOtopns' 
                        :key='item.value' 
                        :disabled="item.disabled"
                        :label="item.label"
                    ></el-radio-button>
                </el-radio-group>
            </el-form-item>
            <!-- 时间段和价格 -->
            <div style='margin-top:10px;'>
                <div v-for='(item,index) in ruleForm.children' :key='item.id'>
                    <el-row>
                        <el-col  :span="10">
                            <el-form-item label='时间段' :prop="'children.' + index + '.hourStart'" :rules='dayFormRules(index)'>
                                <el-time-select
                                    :disabled="item.disabled"
                                    size='mini'
                                    v-model="item.hourStart"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '1:00',
                                        end: '23:00'
                                    }"
                                    placeholder="选择时间">
                                </el-time-select>    
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label='~' :prop="'children.' + index + '.hourEnd'" :rules='dayFormRules(index)'>
                                <el-time-select
                                    size='mini'
                                    :disabled="item.disabled"
                                    v-model="item.hourEnd"
                                    :picker-options="{
                                        start: '01:00',
                                        step: '1:00',
                                        end: '24:00'
                                    }"
                                    placeholder="选择时间">
                                </el-time-select>    
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col  :span="20">
                            <el-form-item label="价格($)" :prop="'children.' + index + '.price'" :rules='dayFormRules(index)'>
                                <el-input v-model.trim="item.price" placeholder="请输入内容" size='mini' :disabled="item.disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <ElButton 
                                style='margin-top:6px;margin-left:6px;'
                                size="small" type="plain" icon="el-icon-plus" plain
                                 @click='ruleForm.children.push({hourStart:null,hourEnd:null,price:null})'
                                v-if='params.type!=="look"'
                            ></ElButton>
                            <ElButton  
                                style='margin-top:6px;margin-left:6px;'
                                size="small" type="danger" icon="el-icon-delete" plain
                                v-if='ruleForm.children.length!==1 && params.type!=="look" '                              
                                @click='ruleForm.children.splice(index,1)'
                            ></ElButton>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <el-form-item label="是否开启" prop="pauseFlag">
                <el-switch
                    v-model="ruleForm.pauseFlag"
                    :disabled='switchDisabled'
                    >
                </el-switch>
            </el-form-item>
        </el-form>
        <yt-dialog :options='opts' :events='dialogEvents'>
            <SetSkuPrice  v-if='opts.visible' ref='dialog' :params='dialogParams' :selectSkus='selectSkus'  />
        </yt-dialog>
    </div>
</template>

<script>
import SetSkuPrice from "./SetSkuPrice"
export default {
    props:['params','selectSkus'],
    components:{
        SetSkuPrice
    },
    data() {
        return {
            opts:{
                visible : false,
                width: '700px',
                okBtnText:'确定',
                title:'设置SKU原价',
                appendToBody: true
            },
            dialogEvents:{
                handleOkClick : () =>{
                    this.$refs.dialog.saveBtn().then( res => {
                        this.$emit('addSuccess')
                        this.opts.visible = false
                    })
                }
            },
            dialogParams:"",

            options:[
                {value: 0, label: '每日'},               
                {value: 1, label: '周一到周日'},               
            ],
            radioOtopns:[
                {value: 0, label: '周日'},  
                {value: 1, label: '周一'},  
                {value: 2, label: '周二'},  
                {value: 3, label: '周三'},  
                {value: 4, label: '周四'},  
                {value: 5, label: '周五'},  
                {value: 6, label: '周六'},  
            ],
            ruleForm:{
                seoType:0,
                radio:'周日',
                pauseFlag:true,
                children:[
                    {hourStart:null,hourEnd:null,price:null}
                ],
                products:[]
            },
            dayFormRules(index){
                if(this.params.type==='look'){  //查看时不用校验
                    return
                };   
                let checkAge = (rule, value, callback) => {
                        // console.log(rule);
                        // console.log(value)
                        let fild=rule.field.split('.');
                        let name=fild[fild.length-1]; //label名字
                        let location=fild[fild.length-2]*1+1;//当前输入的是第几项

                        //单选验证
                        if(!value && name==='radio'){
                            return callback(new Error('请选择') );
                            //console.log('radio');
                        };

                        //价格验证
                        if( (!value && name==='price') ||  (isNaN(Number(value)) && name==='price')){
                             return callback(new Error('请输入数字') );
                        };
                        if(name==='price'){
                             this.ruleForm.children.forEach((i,inde)=>{
                                if( (value === i.price) &&  inde!==index ){
                                    return callback(new Error(`第${inde+1}项已填`));
                                }
                            });
                        };
                     
                        //时间段的验证
                        if( !value && ( name==='hourStart' || name==='hourEnd')){
                            if( name==='hourStart' && this.ruleForm.children[index].hourEnd){
                                 return callback(new Error('小值需小于大值'));
                            }else if(name==='hourEnd' && this.ruleForm.children[index].hourStart){
                                 return callback(new Error('大值需大于小值'));
                            };
                            return callback(new Error('请正确选择'));
                        };
                        if( name==='hourStart' || name==='hourEnd'){ //当前输入的是时间段
                            if( index!==0 && (!this.ruleForm.children[index-1].hourEnd || !this.ruleForm.children[index-1].hourStart) ){
                                  return callback(new Error('请先完整填写上区间'));
                            };  
                            this.ruleForm.children.forEach((i,inde)=>{
                                if( name==='hourStart' &&  inde!==index && index!==0 && this.ruleForm.children[index-1].hourEnd ){
                                    let start=value.slice(0,2)*1;
                                    let topEnd=this.ruleForm.children[index-1].hourEnd.slice(0,2)*1;
                                    // console.log(start);
                                    // console.log(topEnd);
                                    if( start < topEnd){
                                        return callback(new Error('需大于或等于上区间的大值'));
                                    }
                                  
                                }else if( name==='hourEnd' && this.ruleForm.children[index+1] &&  this.ruleForm.children[index+1].hourStart  &&  inde!==index  ){
                                    let end=value.slice(0,2)*1;
                                    let nextStart=this.ruleForm.children[index+1].hourStart.slice(0,2)*1;
                                    // console.log(end);
                                    // console.log(nextStart);
                                    if( end > nextStart){
                                        return callback(new Error('需大于或等于下区间的小值'));
                                    }
                                }
                            });
                           
                        };  
                        if( name==='hourStart' && this.ruleForm.children[index].hourEnd ){
                            let start=value.slice(0,2)*1;
                            let end=this.ruleForm.children[index].hourEnd.slice(0,2)*1;
                            // console.log(start);
                            // console.log(end);
                            //console.log( this.ruleForm.children[index].hourStart )
                            // if( this.ruleForm.children[index].hourStart===' ' ){
                            //     return callback(new Error('小值需小于大值'));
                            // }
                            if(start>=end){
                                this.ruleForm.children[index].hourStart=null;
                                return callback(new Error('小值需小于大值'));
                            }
                        }else if(name==='hourEnd' && this.ruleForm.children[index].hourStart) {
                            let end=value.slice(0,2)*1;
                            let start=this.ruleForm.children[index].hourStart.slice(0,2)*1;
                            // console.log(start);
                            // console.log(end);
                            // if( this.ruleForm.children[index].hourEnd===' ' ){
                            //     return callback(new Error('大值需大于小值'));
                            // }
                            if(start>=end){
                                this.ruleForm.children[index].hourEnd=null;
                                return callback(new Error('大值需大于小值'));
                            }
                        };
                       
                        callback();
                        
                    };
                    return  { validator: checkAge, trigger: ['change'] }
            },

            seoTypeDisabled:false,
            switchDisabled:false,

            loading:false,

            radioRules(){
                if(this.params.type==='look'){  //查看时不用校验
                    return
                };  
                let rule= [{ required: true, message: '请选择', trigger: 'change' }]  ;
                return  rule
            },


            alterDayList:[],//编辑时回显每日的大数组
            alterWeekList:[],//编辑时回显周一到周日的大数组

        
        }
    },
    methods:{
        _initData(){
            this.loading=true;
            if(this.params.type==='look' ){ //查看时不能编辑
                this.seoTypeDisabled=true;
                this.switchDisabled=true;
            };
            let {sellerId,siteId}=this.sellerData;
            this.$api['priceSeoManualStrategyDetail']({
                sellerId,
                siteId,
                productId:this.params.productId
            })
            .then(data => {
                //console.log(data);
                this.loading=false;
                let {seoType,list,pauseFlag}=data.data;
                // if(pauseFlag){ //开启的状态
                //     this.ruleForm.pauseFlag=true;
                // }else{
                //     this.ruleForm.pauseFlag=false;
                // };
                this.ruleForm.seoType=seoType;
                if(seoType===1){  //周一到周日
                    let radio;
                    this.radioOtopns.forEach(j=>{
                        if(j.value===list[0].weekDay){
                            radio=j.label;
                        }
                    })
                    this.ruleForm.radio=radio;
                    if(this.params.type==='look'){  //查看时
                        this.radioOtopns=[];
                        switch(radio){
                                case '周日':
                                    this.radioOtopns.push( {value: 0, label: '周日' ,disabled:true } );
                                break;
                                case '周一':
                                    this.radioOtopns.push( {value: 1, label: '周一' ,disabled:true} );
                                break;
                                case '周二':
                                    this.radioOtopns.push( {value: 2, label: '周二' ,disabled:true} );
                                break;
                                case '周三':
                                    this.radioOtopns.push( {value: 3, label: '周三' ,disabled:true} );
                                break;
                                case '周四':
                                    this.radioOtopns.push( {value: 4, label: '周四' ,disabled:true} );
                                break;
                                case '周五':
                                    this.radioOtopns.push( {value: 5, label: '周五' ,disabled:true} );
                                break;
                                case '周六':
                                    this.radioOtopns.push( {value: 6, label: '周六' ,disabled:true} );
                                break;

                                default:
                                break;
                        }
                    }
                };
                //console.log(list);
                list.forEach(i=>{
                    if(this.params.type==='look' ){ //查看时不能编辑
                        i.disabled=true;
                    };
                    if(i.hourStart || i.hourStart ===0){
                        if(i.hourStart*1<=9){
                            i.hourStart="0"+i.hourStart+":"+'00'
                        }else{
                            i.hourStart=i.hourStart+":"+'00' 
                        }
                    };
                    if(i.hourEnd){
                        if(i.hourEnd*1<=9){
                            i.hourEnd="0"+i.hourEnd+":"+'00'
                        }else{
                            i.hourEnd=i.hourEnd+":"+'00' 
                        }
                    }
                });

                if (seoType===1) { //周一到周日
                    this.alterWeekList = JSON.parse(JSON.stringify(list));
                    let id=list[0].weekDay;
                    let map=[];
                    list.forEach(h=>{
                        if(h.weekDay===id){
                            map.push(h)
                        }
                    });
                    this.ruleForm.children = map;
                } else {
                    this.ruleForm.children = list;
                    this.alterDayList = JSON.parse(JSON.stringify(list));
                }
                
                // console.log(list);
                // console.log(this.alterWeekList);
                // console.log(this.alterDayList);
                
            }).catch(err=>{
                    this.loading=false;
            })
        },
        //周一到周日单选改变
        radioChange(v){
            if(this.params.type==='alter'){
                let radio; 
                this.radioOtopns.forEach(j=>{
                    if(j.label===v){
                        radio=j.value;
                    }
                })
                //console.log(radio);
                let alterWeekList = JSON.parse(JSON.stringify(this.alterWeekList)) 
                let map=[];
                alterWeekList.forEach(k=>{
                    if(k.weekDay===radio){
                        map.push(k)
                    }
                });
               
                if(map.length){
                    this.ruleForm.children = map;
                }else{
                    this.ruleForm.children.forEach(i => {
                        i.hourStart = null
                        i.hourEnd = null
                        i.price = null
                    })
                  
                }
            }
        },
        selectChange(v){
            //console.log(v);
            this.$refs.ruleForm.resetFields();
            this.ruleForm.children=[
                {hourStart:null,hourEnd:null,price:null}
            ];
            if( this.params.type==='alter') {
                if( v===1 ){ //周一到周日
                    if (this.alterWeekList.length) {
                        let radio=this.alterWeekList[0].weekDay;
                        // console.log(radio);
                        let map=[];
                        this.alterWeekList.forEach(k=>{
                            if(k.weekDay===radio){
                                map.push(k)
                            }
                        });
                        //console.log(map);
                        if(map.length){
                            this.ruleForm.children = JSON.parse(JSON.stringify(map)) ;
                        }
                    }else {
                        this.ruleForm.children.forEach(i => {
                            i.hourStart = null
                            i.hourEnd = null
                            i.price = null
                        })
                    } 
                } else {
                    if (this.alterDayList.length) {
                        this.ruleForm.children=JSON.parse(JSON.stringify(this.alterDayList)) ;
                    } else {
                        this.ruleForm.children.forEach(i => {
                            i.hourStart = null
                            i.hourEnd = null
                            i.price = null
                        })
                    }
                }
            }
           // this.$refs.ruleForm.resetFields();
        },
        dialogNextStep(){
             return this.$refs.ruleForm.validate().then(() => {
                let {sellerId,siteId}=this.sellerData;
                let {seoType,children,radio,pauseFlag} = JSON.parse(JSON.stringify(this.ruleForm)) ;
                let datas={};
                datas.sellerId=sellerId;
                datas.siteId=siteId;
                datas.seoType=seoType;
                datas.ids=this.params.ids;
                //datas.pauseFlag=1;//默认开启
                if(pauseFlag){
                    datas.pauseFlag=1;
                }else{
                    datas.pauseFlag=0;
                };
                if(seoType===0){ //每日
                    children.forEach(i=>{
                        //开始时间段和结束时间段转换为 0 ~24
                        let hourStart=i.hourStart.slice(0,2)*1;
                        let hourEnd=i.hourEnd.slice(0,2)*1;
                        i.hourStart=hourStart;
                        i.hourEnd=hourEnd;
                        i.weekDay=-1;
                    });
                    datas.list=children;
                }else {
                    //debugger
                    let list=[];
                    let weekDay;
                    this.radioOtopns.forEach(j=>{
                        if(j.label===this.ruleForm.radio){
                            weekDay=j.value;
                        }
                    })
                    children.forEach(i=>{
                        let hourStart=i.hourStart.slice(0,2)*1;
                        let hourEnd=i.hourEnd.slice(0,2)*1;
                        let price=i.price;
                        list.push({
                            hourStart,
                            hourEnd,
                            weekDay,
                            price
                        });
                    });
                    //console.log(list);

                    datas.list=list;
                };
                this.opts.visible = true
                this.dialogParams = {datas:datas,url:this.params.url}
            })
        },
    },
    created() {
        //console.log(this.params);
        //console.log(this.params.pauseFlag);
        if(this.params.type==='look' || this.params.type==='alter' ){
            this._initData()
            if(this.params.pauseFlag===1){
                this.ruleForm.pauseFlag=true;
            }else{
                this.ruleForm.pauseFlag=false;
            }
        }
       
    },
};
</script>

<style scoped lang="less">

</style>
