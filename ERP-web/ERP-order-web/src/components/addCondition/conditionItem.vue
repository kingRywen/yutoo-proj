<template lang="html">
    <div class="">
        <div class="formRow">
            <el-form-item label="订单总额：" prop="startOrderAmount">
                <el-input-number v-model="form.startOrderAmount" :precision="2"  controls-position="right" :min="1" />
            </el-form-item>
            <p style="line-height:36px;margin-left:10px;">~</p>
            <el-form-item prop="endOrderAmount" class="formmar0">
                <el-input-number v-model="form.endOrderAmount" :precision="2"  controls-position="right" :min="form.startOrderAmount" />
            </el-form-item>
            <el-form-item prop="orderAmountCurrencyType" class="formmar0">
                <el-select v-model="form.orderAmountCurrencyType" placeholder="请选择币种" style="width:120px;">
                    <el-option label="人民币"  value="RMB"/>
                    <el-option label="美元"  value="$"/>
                </el-select>
            </el-form-item>
        </div>
        <div class="formRow">
            <el-form-item label="产品销售单价：" prop="startSalesPrice">
                <el-input-number v-model="form.startSalesPrice" :precision="2"  controls-position="right" :min="1" />
            </el-form-item>
            <p style="line-height:36px;margin-left:10px;">~</p>
            <el-form-item prop="endSalesPrice" class="formmar0">
                <el-input-number v-model="form.endSalesPrice" :precision="2"  controls-position="right" :min="form.startSalesPrice" />
            </el-form-item>
            <el-form-item prop="salesPriceCurrencyType" class="formmar0">
                <el-select v-model="form.salesPriceCurrencyType" placeholder="请选择币种" style="width:120px;">
                    <el-option label="人民币"  value="RMB"/>
                    <el-option label="美元"  value="$"/>
                </el-select>
            </el-form-item>
        </div>
        <div class="formRow">
            <el-form-item label="客户支付运费：" prop="startCustomerFreight">
                <el-input-number v-model="form.startCustomerFreight" :precision="2"  controls-position="right" :min="1" />
            </el-form-item>
            <p style="line-height:36px;margin-left:10px;">~</p>
            <el-form-item prop="endCustomerFreight" class="formmar0">
                <el-input-number v-model="form.endCustomerFreight" :precision="2"  controls-position="right" :min="form.startCustomerFreight" />
            </el-form-item>
            <el-form-item prop="salesPriceCurrencyType" class="formmar0">
                <el-select v-model="form.customerFreightCurrencyType" placeholder="请选择币种" style="width:120px;">
                    <el-option label="人民币"  value="RMB"/>
                    <el-option label="美元"  value="$"/>
                </el-select>
            </el-form-item>
        </div>
        <div class="formRow">
            <el-form-item label="欧洲报关费用：" prop="startCustomsCost">
                <el-input-number v-model="form.startCustomsCost" :precision="2"  controls-position="right" :min="1" />
            </el-form-item>
            <p style="line-height:36px;margin-left:10px;">~</p>
            <el-form-item prop="endCustomsCost" class="formmar0">
                <el-input-number v-model="form.endCustomsCost" :precision="2"  controls-position="right" :min="form.startCustomsCost" />
            </el-form-item>
            <el-form-item prop="salesPriceCurrencyType" class="formmar0">
                <el-select v-model="form.customsCostCurrencyType" placeholder="请选择币种" style="width:120px;">
                    <el-option label="人民币"  value="RMB"/>
                    <el-option label="美元"  value="$"/>
                </el-select>
            </el-form-item>
        </div>
        <div class="formRow">
            <el-form-item label="采购价格：" prop="startPurchaseAmount">
                <el-input-number v-model="form.startPurchaseAmount" :precision="2"  controls-position="right" :min="1" />
            </el-form-item>
            <p style="line-height:36px;margin-left:10px;">~</p>
            <el-form-item prop="endCustomsCost" class="formmar0">
                <el-input-number v-model="form.endPurchaseAmount" :precision="2"  controls-position="right" :min="form.startPurchaseAmount" />
            </el-form-item>
            <el-form-item prop="salesPriceCurrencyType" class="formmar0">
                <el-select v-model="form.purchaseAmountCurrencyType" placeholder="请选择币种" style="width:120px;">
                    <el-option label="人民币"  value="RMB"/>
                    <el-option label="美元"  value="$"/>
                </el-select>
            </el-form-item>
        </div>
        <el-form-item label="订单产品包含：" prop="orderProductContain">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.orderProductContain"/>
        </el-form-item>
        <el-form-item label="产品中文名包含关键词：" prop="productNameContain">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.productNameContain"/>
        </el-form-item>
        <el-form-item label="订购产品包含自定义SKU前缀：" prop="customSkuPrefix">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.customSkuPrefix"/>
        </el-form-item>
        <el-form-item label="订购产品包含店铺SKU前缀：" prop="storeSkuPrefix">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.storeSkuPrefix"/>
        </el-form-item>
        <el-form-item label="订购产品包含自定义SKU后缀：" prop="customSkuSuffix">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.customSkuSuffix"/>
        </el-form-item>
        <el-form-item label="订购产品包含店铺SKU后缀：" prop="storeSkuSuffix">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.storeSkuSuffix"/>
        </el-form-item>
        <el-form-item label="订购产品店铺SKU包含字符：" prop="storeSkuCharContain">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.storeSkuCharContain"/>
        </el-form-item>
        <el-form-item label="订购产品包含店铺SKU：" prop="storeSkuContain">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.storeSkuContain"/>
        </el-form-item>
        <el-form-item label="订购产品包含类别：" prop="productCategoryContain">
            <el-input type="textarea" class="textarea" placeholder="一行一个" v-model.trim="form.productCategoryContain"/>
        </el-form-item>
        <el-form-item label="产品侵权风险：" prop="" class="needborder">
            <el-checkbox-group>
                <el-checkbox v-for="item in tortlist" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="产品物流属性：" prop="" class="needborder">
            <el-checkbox-group>
                <el-row>
                    <el-col :span="4" v-for="item in logisticslist" :key="item.value">
                        <el-checkbox  :label="item.value" >{{item.label}}</el-checkbox>
                    </el-col>
                </el-row>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="产品插头规格：" prop="" class="needborder">
            <el-checkbox-group v-model="form.productPlugSpec">
                <el-row>
                    <el-col :span="4" v-for="item in Specificationslist" :key="item.value">
                        <el-checkbox  :label="item.value" >{{item.label}}</el-checkbox>
                    </el-col>
                </el-row>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="订单原来的运输方式：" prop="originalTransportType">
            <el-select v-model="form.originalTransportType">
                <el-option :label="i.label" :value="i.value" v-for="i in transportTypeList" :key='i.value'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="平台客户选择的运输方式：" prop="customerTransportType">
            <el-select v-model="form.customerTransportType">
                <el-option :label="i.label" :value="i.value" v-for="i in transportTypeList" :key='i.value'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-checkbox v-model="checked">库存数满足订单需求数</el-checkbox>
        </el-form-item>


    </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
export default {
    data(){
        return {
            form:{},
            tortlist:[//产品侵权风险
                {label:'非仿牌',value:1},
                {label:'仿牌',value:2},
                {label:'灰色产品',value:3},
            ],
            logisticslist:[//产品物流属性
                {label:'普货',value:1},
                {label:'纯电池',value:2},
                {label:'带内置电池',value:3},
                {label:'带外置电池',value:1},
                {label:'含纽扣电池',value:2},
                {label:'液体',value:3},

                {label:'粉末',value:1},
                {label:'打火机',value:2},
                {label:'刀具-剪刀-仿真枪',value:3},
                {label:'带磁物品',value:1},
                {label:'其他禁运物品',value:2},
                {label:'木质类-竹制类',value:3},

                {label:'膏状',value:1},
                {label:'易碎',value:2},
                {label:'动物羽毛类',value:3},
                {label:'大功率电池',value:1},
                {label:'电子烟',value:2},
                {label:'移动电源',value:3},

                {label:'可拆卸电池',value:1},
                {label:'厨具',value:2},
                {label:'电机-马达',value:3},
                {label:'超体积普货',value:1},
                {label:'超体积非普货',value:2},
                {label:'手机',value:3},

                {label:'平衡车',value:1},
                {label:'液体笔类',value:2},
                {label:'纺织品',value:3},
                {label:'植物种子',value:1},
            ],
            Specificationslist:[
                {label:'原装美规',value:1},
                {label:'原装欧规',value:1},
                {label:'原装英规',value:1},
                {label:'原装澳规',value:1},
                {label:'原装日规',value:1},
                {label:'通用美规',value:1},

                {label:'已配美规转接头',value:1},
                {label:'已配欧规转接头',value:1},
                {label:'已配英规转接头',value:1},
                {label:'已配澳规转接头',value:1},
                {label:'已配日规转接头',value:1},
                {label:'中式扁插',value:1},
            ]
        }
    },
    computed:{
        ...mapState('common',[
            'transportTypeList'
        ])
    },
    methods:{
        ...mapActions('common',[
            'initTransportTypeList'
        ])
    },
    mounted(){
        this.initTransportTypeList()
    }
}
</script>

<style lang="scss">
    .formRow{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .formmar0{
        .el-form-item__content{
            margin-left: 10px!important;
        }
    }
    .needborder{
        .el-form-item__content{
            border: 1px solid #dcdfe6;
            padding-left: 10px;
            border-radius: 3px;
        }
    }

</style>
