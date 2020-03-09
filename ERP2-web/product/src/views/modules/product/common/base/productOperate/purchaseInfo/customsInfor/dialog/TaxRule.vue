<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size='small' label-width="120px">
             <el-form-item
                v-for="(item, index) in ruleForm.countryList"
                :label="item.countryName"
                :key="item.key"
                :prop="'countryList.' + index + '.customsRate'"
                :rules='getRules(index)'
            >
                <div style='display:flex'>
                    <el-input v-model.trim="item.customsRate" style='width:95%'>
                        <template slot="prepend">供应商报价</template>
                    </el-input>
                    <div style='margin-left:10px;'>%</div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { parse } from 'path';
export default {
    data() {
        return {
            ruleForm:{
                countryList:[]
            },
            rules:{

            },
            getRules(index){
                var checkAge = (rule, value, callback) => {
                    let name = rule.field.split('.')[2]
                    // console.log(name);
                    // console.log(value);
                    if((isNaN(Number(value)) || !value) && value!==0){
                        return  callback(new Error('请输入数字'));
                    }   
                    this.ruleForm.countryList[index][name] = value ? Math.abs(+value) : ''
                    callback();
                }
                return { validator: checkAge, trigger:['blur'] ,required :true}
            },
        };
    },
    methods: {
        getRule(){
            this.$api[`product/glCustomsCountryList`]()
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.ruleForm.countryList = rows
            })
        },
        saveBtn(){
            let arr = this.ruleForm.countryList.map(i=>{
                return{
                    customsCountryId : i.customsCountryId,
                    customsRate :  parseInt(i.customsRate*100)/10000
                }
            })
            return this.$api[`product/glCustomsCountryUpdate`](arr)
        }
    },
    created() {
        this.getRule()
    },
    computed:{
        validate(){
            return ()=>{
                return  this.$refs.ruleForm.validate()
            }
        }
    }
};
</script>

<style scoped lang="scss">

</style>
