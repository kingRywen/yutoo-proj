<template>
    <div class="box-popover">
        <el-popover
            placement="left"
            width="310"
            trigger="click"
            v-if="customColumn.oneLevelHeader">
            <el-checkbox-group v-model="customColumn.checkboxList" @change="setTableColumn" class="one-level">
                <el-checkbox v-for="item in customColumn.checkboxOptions" :label="item.label">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <el-button slot="reference" size="mini" type="primary" plain>自定义列表展示</el-button>
        </el-popover>
        <el-popover
            placement="left"
            width="310"
            trigger="click"
            v-else>
            <div class="two-level-one">
                <!-- 一级表头不限列数 -->
                <el-checkbox v-for="(item, index) in customColumn.oneLevelCheckbox" :indeterminate="item.indeterminate" v-model="item.checkAll" @change="handleCheckAllChange(index)">{{item.name}}</el-checkbox>
            </div>
            
            <div class="two-level-two">
                <!-- 二级表头列数为2 -->
                <el-checkbox-group v-for="(item, index) in customColumn.towLevelCheckbox" v-model="item.list" @change="setTwoLevelTableColumn(index)">
                    <el-checkbox v-for="checkbox in item.checkboxs" :label="checkbox.label">{{checkbox.name}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <el-button slot="reference" size="small" type="primary" plain>自定义列表展示</el-button>
        </el-popover>
    </div>
</template>
<script>
import _ from "lodash";
export default {
    props: ["customColumn"],
    /*
    // 数据结构
    data(){
        return{
            oneLevelHeader:false,//必填
            
            // 二选一
            checkboxList:['araSearches'],
            checkboxOptions:[
                {label:'araSearches',name:'ARA搜索量' },
                {label:'araOrders',name:'ARA订单量' },
                {label:'araHits',name:'ARA点击量' },
                {label:'araCarts',name:'ARA加购量' },
                {label:'araConversionRates',name:'ARA转化率' },
                {label:'araClickRates',name:'ARA点击率' }
            ],

            // 二选一
            constList:[
                    [
                        'araSearches',
                        'araOrders',
                        'araHits',
                        'araCarts',
                        'araConversionRates',
                        'araClickRates'
                    ],
                    [
                        'advertExposure',
                        'advertHits',
                        'advertClickRates',
                        'advertOrders',
                        'advertConversionRates',
                        'advertCpc',
                        'advertCost',
                        'advertSales',
                        'advertAcos',
                    ],
                    [
                        'googleSearches',
                        'amazonProducts'
                    ]
                ],
            oneLevelCheckbox:[
                {indeterminate:false,checkAll:true,name:'ARA数据'},
                {indeterminate:false,checkAll:true,name:'广告数据'},
                {indeterminate:false,checkAll:true,name:'其他'}
            ],
            towLevelCheckbox:[
                {
                    list:null,
                    checkboxs:[
                            {label:'araSearches',name:'ARA搜索量' },
                            {label:'araOrders',name:'ARA订单量' },
                            {label:'araHits',name:'ARA点击量' },
                            {label:'araCarts',name:'ARA加购量' },
                            {label:'araConversionRates',name:'ARA转化率' },
                            {label:'araClickRates',name:'ARA点击率' },
                        ]
                },
                {
                    list:null,
                    checkboxs:[
                            {label:'advertExposure',name:'曝光量' },
                            {label:'advertHits',name:'点击量' },
                            {label:'advertClickRates',name:'点击率' },
                            {label:'advertOrders',name:'订单量' },
                            {label:'advertConversionRates',name:'转化率' },
                            {label:'advertCpc',name:'CPC' },
                            {label:'advertCost',name:'花费' },
                            {label:'advertSales',name:'广告销售额' },
                            {label:'advertAcos',name:'ACOS' },
                        ]
                },
                {
                    list:null,
                    checkboxs:[
                        {label:'googleSearches',name:'Google搜索量' },
                        {label:'amazonProducts',name:'产品数' },
                        ]
                }
            ]
        }
    },
    */
    created() {
        if(this.customColumn.oneLevelHeader===false){
            let array = this.customColumn.constList
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                this.customColumn.towLevelCheckbox[index].list =_.cloneDeep(element)
            }
        };
        // console.log('--------------ewqqqqqqqqqqq');
        // console.log(this.customColumn);
    },
    methods:{
        setTableColumn(val){
            this.$emit('setCustomColumn',val);
        },
        handleCheckAllChange(index){
            this.customColumn.towLevelCheckbox[index].list = this.customColumn.oneLevelCheckbox[index].checkAll ? this.customColumn.constList[index] : [];
            this.customColumn.oneLevelCheckbox[index].indeterminate = false;
            this.$emit('setCustomColumnAndIndex',{list:this.customColumn.towLevelCheckbox[index].list,index});
        },
        setTwoLevelTableColumn(index){
            let checkedCount = this.customColumn.towLevelCheckbox[index].list.length;
            this.customColumn.oneLevelCheckbox[index].checkAll = checkedCount === this.customColumn.constList[index].length;
            this.customColumn.oneLevelCheckbox[index].indeterminate = checkedCount > 0 && checkedCount < this.customColumn.constList[index].length;
            this.$emit('setCustomColumnAndIndex',{list:this.customColumn.towLevelCheckbox[index].list,index});
        }
    }
}
</script>

<style lang="less" scoped>
    .el-popover{
        .one-level{
            // width: 305px;
            .el-checkbox{
                margin-left: 0;
                width: 150px;
            }
        }
        .two-level-two{
            width: 305px;
            .el-checkbox-group{
                .el-checkbox{
                    margin-left: 0;
                    width: 150px;
                }
            }
        }
    }
</style>