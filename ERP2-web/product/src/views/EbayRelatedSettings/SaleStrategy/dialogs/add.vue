<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  size='small'>
            <el-form-item label="策略名称" prop="strategyName">
                <el-input v-model.trim="ruleForm.strategyName" clearable></el-input>
            </el-form-item>
            <el-form-item label="优化方式" prop="strategyType">
                <el-select v-model="ruleForm.strategyType" placeholder="请选择" style='width:100%' >
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='' v-if='ruleForm.strategyType===1'>
                 <el-radio-group v-model="radio">
                    <el-radio-button :label="item.value" v-for='item in radioGroup' :key='item.value'>{{item.label}}</el-radio-button>
                </el-radio-group>
            </el-form-item>  
            <div class='time' v-for='(it,index) in ruleForm.strategyList' :key='index'>
                <div>
                    <el-form-item label="时间点"  :prop="'strategyList.' + index + '.time'" :rules='getRules(index)'>
                        <el-time-picker
                            style='width:100%'
                            v-model="it.time"
                            :picker-options="{ format:' HH:mm'}"
                            value-format='HH:mm'
                            clearable
                            placeholder="任意时间点">
                        </el-time-picker>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="上架产品数量" :prop="'strategyList.' + index + '.shelfPercentage'" :rules='getRules(index)'>
                        <div class='item'>
                            <div style='display:flex;'>
                                <el-input v-model.trim="it.shelfPercentage" placeholder="请输入" style='width:92%' clearable></el-input>
                                <div style=';min-width:22px;'>&nbsp;&nbsp;%</div> 
                            </div>
                            <div style='display:inline-block;'>
                                <ElButton @click="ruleForm.strategyList.push({time:'',shelfPercentage:null})" size="small" type="plain" icon="el-icon-plus" plain></ElButton>
                                <ElButton  
                                    v-if='ruleForm.strategyList.length !==1' 
                                    size="small" type="danger" 
                                    icon="el-icon-delete" 
                                    plain
                                    @click='ruleForm.strategyList.splice(index,1)'
                                    >
                                </ElButton>
                            </div>
                        </div>
                    </el-form-item>
                </div>
            </div>
            <el-form-item label='是否激活' prop='pauseFlag' >
                <el-checkbox v-model="pauseFlag">是</el-checkbox>
            </el-form-item> 
        </el-form>
    </div>
</template>

<script>
import { parse } from 'path';
export default {
    props:['type','strategyId','data'],
    data() {
        return {
            radio:'0',
            pauseFlag:false,
            radioGroup:[
                {label:"周日",value:0},
                {label:"周一",value:1},
                {label:"周二",value:2},
                {label:"周三",value:3},
                {label:"周四",value:4},
                {label:"周五",value:5},
                {label:"周六",value:6},
            ],
            ruleForm:{
                strategyName:'',
                strategyType:0,
                strategyList:[
                    {time:'',shelfPercentage:null},
                ]
            },
            options:[
                {label:"每日",value:0},
                {label:"周一到周日",value:1},
            ],
            rules:{
                strategyName:[
                    { required: true, message: '请输入', trigger: ['blur','change'] }
                ],
                strategyType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] }
                ],
               
            },
            getRules(index){
                var checkAge = (rule, value, callback) => {
                    let name = rule.field.split('.')[2]
                    // console.log(rule);
                    // console.log(value);
                    if(name ==='time'){
                        if (!value) {
                            return callback(new Error('请选择'));
                        };
                        if( index!==0 && (!this.ruleForm.strategyList[index-1].time)){
                            this.ruleForm.strategyList[index].time = ''
                            return callback(new Error('请先完整填写上一个'));
                        };  
                        this.ruleForm.strategyList.forEach((i,inde)=>{
                            if(i.time === value &&  index!==inde ){
                                this.ruleForm.strategyList[index].time = ''
                                return callback(new Error('第'+(inde+1)+'个已填'));
                            }
                            return
                        });
                        let top = this.ruleForm.strategyList[index-1] && this.ruleForm.strategyList[index-1].time
                        let next = this.ruleForm.strategyList[index+1] && this.ruleForm.strategyList[index+1].time
                        if(top){
                            let valHour = +value.split(":")[0]
                            let valMinit = +value.split(":")[1]
                            let topHour = +top.split(":")[0]
                            let topMinit = +top.split(":")[1]
                            if( valHour < topHour){
                                this.ruleForm.strategyList[index].time = ''
                                return callback(new Error('需大于上一个'));
                            }else if(valHour === topHour){
                                if(valMinit<topMinit){
                                    this.ruleForm.strategyList[index].time = ''
                                    return callback(new Error('需大于上一个'));
                                }
                            }
                        };
                        if(next){
                            let valHour = +value.split(":")[0]
                            let valMinit = +value.split(":")[1]
                            let nextHour = +next.split(":")[0]
                            let nextMinit = +next.split(":")[1]
                            if( valHour > nextHour){
                                this.ruleForm.strategyList[index].time = ''
                                return callback(new Error('需小于下一个'));
                            }else if(valHour === nextHour){
                                if(valMinit > nextMinit){
                                    this.ruleForm.strategyList[index].time = ''
                                    return callback(new Error('需小于下一个'));
                                }
                            }
                        };
                    };
                    if (name ==='shelfPercentage' ) {
                        if (!value) {
                            return callback(new Error('请输入'));
                        };
                        if(isNaN(Number(value))){
                             return callback(new Error('请输入数字'));
                        }
                        this.ruleForm.strategyList[index].shelfPercentage = +this.ruleForm.strategyList[index].shelfPercentage 
                        // if(value.indexOf('.')!==-1){
                        //     var y = value.indexOf(".") + 1;//获取小数点的位置
                        //     var count = value.length - y;//获取小数点后的个数
                        //     if(count>2){
                        //          return callback(new Error('若小数,请输入两位小数'));
                        //     }
                        // }
                      
                        // if( index!==0 && (!this.ruleForm.strategyList[index-1].shelfPercentage)){
                        //     this.ruleForm.strategyList[index].shelfPercentage = ''
                        //     return callback(new Error('请先完整填写上一个'));
                        // }; 
                        // this.ruleForm.strategyList.forEach((i,inde)=>{
                        //     if( +i.shelfPercentage === +value &&  index!==inde ){
                        //         this.ruleForm.strategyList[index].shelfPercentage = ''
                        //         return callback(new Error('第'+(inde+1)+'个已填'));
                        //     }
                        //     return
                        // });
                        // let top = this.ruleForm.strategyList[index-1] && this.ruleForm.strategyList[index-1].shelfPercentage
                        // let next = this.ruleForm.strategyList[index+1] && this.ruleForm.strategyList[index+1].shelfPercentage
                        // if(top){
                        //     if( +value < +top){
                        //         this.ruleForm.strategyList[index].shelfPercentage = ''
                        //         return callback(new Error('需大于上一个'));
                        //     }
                        // };
                        // if(next){
                        //     if( +value > +next){
                        //         this.ruleForm.strategyList[index].shelfPercentage = ''
                        //         return callback(new Error('需小于下一个'));
                        //     }
                        // }
                    };

                    callback()
                };
                return { validator: checkAge, trigger: ['blur'] }
            }
        };
    },
    methods: {
        _submit(){
            return this.$refs.ruleForm.validate().then(()=>{
                let params  = JSON.parse(JSON.stringify(this.ruleForm))
                params.strategyList.forEach(i=>{
                    if(params.strategyType === 0){
                        i.weekDay = -1
                    }else{
                        i.weekDay = +this.radio
                    };
                    let timeArr = i.time.split(":")
                    i.shelfTimeHour = +timeArr[0]
                    i.shelfTimeMinute = +timeArr[1]
                    delete i.time
                    i.shelfPercentage = i.shelfPercentage /100

                })
                params.pauseFlag = this.pauseFlag ? 1 : 0
                let url = this.type==='add' || this.type==='copyAdd' ? 'product/prSellStrategyEbaySave' : 'product/prSellStrategyEbayUpdate'
                return this.$api[url](
                    params
                )
            })
        },
        getInfo(){
            this.$api[`product/prSellStrategyEbayInfo`]({
                strategyId :this.strategyId
            })
            .then((data) => {
                let {rows} = data
                this.ruleForm = rows
                if( this.ruleForm.strategyType === 1){
                    this.radio = this.ruleForm.strategyList[0].weekDay 
                };
                this.ruleForm.strategyList.forEach(i=>{
                    i.shelfPercentage = parseInt(i.shelfPercentage*100) 
                    let shelfTimeHour = i.shelfTimeHour< 9 ? '0' + i.shelfTimeHour : i.shelfTimeHour 
                    let shelfTimeMinute = i.shelfTimeMinute < 9 ? '0' + i.shelfTimeMinute : i.shelfTimeMinute 
                    i.time =  shelfTimeHour + ':' + shelfTimeMinute
                })
                //this.pauseFlag = this.ruleForm.
                    console.log(data);
            })
        }
    },
    created() {
        if(this.type==='edit'){
            this.getInfo()
        }else if(this.type==='copyAdd'){
            let res = this.data
            this.ruleForm.strategyName = res.strategyName
            this.ruleForm.strategyType = res.strategyType
            this.pauseFlag = res.pauseFlag === 0 ? false :true
        }
    },
};
</script>

<style scoped lang="scss">
.time{
    display:flex;
    &>div{
        width:50%
    }
}
.item{
    display:flex;
    &>div{
        &:first-child{
            width:83%;
        }
        &:last-child{
            width:17%;
            min-width:110px;
        }
    }
}
</style>
