<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px"  size='small'>
            <el-form-item label="输入网址" prop="strategyName">
                <el-input v-model="ruleForm.strategyName" clearable placeholder="输入要采集的网址，多个网址换行" type='textarea' :rows='7'></el-input>
            </el-form-item>
            <div style='margin-left:90px;color:#888;'>
                <p>系统支持采集以下网址：</p> 
                <p>速卖通(www.aliexpress.com) , Ebay国际(www.ebay.com) , 亚马逊所有站 , Wish(www.wish.com) , Lazada(www.lazada.com.my)</p>
            </div>
            <el-form-item label="指定认领人" prop="strategyType">
                <el-select v-model="ruleForm.strategyType" placeholder="请选择" style='width:100%' >
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="strategyName">
                <el-input v-model="ruleForm.strategyName" clearable placeholder="" type='textarea' :rows='5'></el-input>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm:{

            },
            rules:{
                strategyName:[
                    { required: true, message: '请输入', trigger: ['blur'] }
                ],
                strategyType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] }
                ],
            },
            options:[],
        };
    },
    methods: {
        _submit(){
              return this.$refs.ruleForm.validate().then(()=>{
                  return this.$api[`product/url`](params)
              })
        },
        getOpts(){
            this.$api[`product/url`](params)
            .then((data) => {
                let {rows} = data
                this.options = rows.map(i=>{
                    return {
                        label:'',
                        value:'',
                    }
                })
            })
        }
    },
    created() {

    },
};
</script>

<style scoped lang="scss">

</style>
