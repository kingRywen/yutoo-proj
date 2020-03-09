<template lang="html">
    <el-checkbox-group v-model="checkedCities"  @change="handleCheckedCitiesChange">
        <el-row :gutter="10" class="list">
            <el-col :span="span" v-for="(item,index) in data" class="item" :key="index">
                <el-checkbox  :label="item.value" >{{item.label}}</el-checkbox>
            </el-col>
        </el-row>
    </el-checkbox-group>
</template>
<script>
export default {
    props:{
        data:{
            type:Array,
            default:()=>[
                {label:'订单总额',value:'1'},
                {label:'产品销售单价',value:'2'},
                {label:'客户支付运费',value:'3'},
                {label:'欧洲报关费用',value:'4'},

                {label:'订单产品包含',value:'5'},
                {label:'产品中文名包含关键词',value:'6'},
                {label:'订购产品包含店铺SKU前缀',value:'7'},
                {label:'订购产品包含自定义SKU前',value:'8'},

                {label:'订购产品包含自定义SKU后',value:'9'},
                {label:'订购产品包含店铺SKU后缀',value:'10'},
                {label:'订购产品店铺SKU包含字符',value:'11'},
                {label:'订购产品包含店铺SKU',value:'12'},

                {label:'订购产品包含类别',value:'13'},
                {label:'新增订单原因',value:'14'},
                {label:'不能包含的产品侵权风险',value:'15'},
                {label:'必须包含的产品侵权风险',value:'16'},

                {label:'不能包含的产品物流属性',value:'17'},
                {label:'必须包含的产品物流属性',value:'18'},
                {label:'产品插头规格',value:'19'},
                {label:'订单原来的运输方式',value:'20'},

                {label:'平台客户选择的运输方式',value:'21'},
                {label:'订单原来的发货仓库',value:'22'},
                {label:'采购总价格',value:'23'},
                {label:'平台订单类型',value:'24'},
            ]
        },
        span:{
            type:[String,Number],
            default:8
        },

    },
    data(){
        return {
            checkedCities:[],
        }
    },
    methods:{
        handleCheckedCitiesChange(val){
            this.$emit('change',val)
            console.log(val)
        }
    }

}
</script>

<style lang="scss">
    .list{
        border: 1px solid #ccc;
        border-bottom:none;
        border-right:none;
        .item{
            padding-left: 15px!important;
            line-height: 40px;
            height: 40px;
            border-bottom:  1px solid #ccc;
            border-right:  1px solid #ccc;
        }
    }

</style>
