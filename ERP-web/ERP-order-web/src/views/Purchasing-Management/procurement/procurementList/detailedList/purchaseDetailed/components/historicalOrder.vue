<template lang="html">
    <!-- 历史下单记录 -->
    <div class="historicalList">
        <template v-if="data.length">

            <el-input placeholder="请输入订单号" clearable v-model.trim="selectnumber" style="width:300px;margin-bottom:10px;" size="medium">    
                <el-button slot="append" icon="el-icon-search" type="primary" @click="search"> 搜 索 </el-button>               
            </el-input>
            
            <template v-if="_list.length">
                <div class="list" v-for="(item,index) in _list" :key="index"> 
                <el-row class="item">
                    <el-col :span="3">
                        订单号：<span class="number" @click="lookOrderInfo(item.lowerSingleNumber )"> {{ item.lowerSingleNumber }} </span>
                    </el-col>
                    <el-col :span="3">
                        下单时间：{{ item.lowerSingleTime }}
                    </el-col>
                    <el-col :span="3">
                        运费总金额：{{ item.freightAmount }}
                    </el-col>
                    <el-col :span="3">
                        优惠总额：{{ item.totalDiscount }}
                    </el-col>
                    <el-col :span="3">
                        下单总金额：{{ item.orderAmount }}
                    </el-col>
                    <el-col :span="3">
                        追踪号：
                        <a href="http://www.kuaidi100.com/" target="_blank" style="text-decoration: none;">                        
                            <span class="number"> {{ item.trackNumber }} </span>
                        </a>                        
                    </el-col>                    
                </el-row>
                <yt-table :data="item.products" :columns="columns" :border="true" :selection="false"/>
             </div>
            </template>
            <div v-else style="font-size:14px;">
                    没有找到该订单号下单记录
            </div>

            <el-dialog :title="title"
                :visible.sync="visible"
                width="1200px"
                center>
                    <queryOrderForm ref="queryOrderForm"></queryOrderForm>
            </el-dialog>  
        </template>
        <template v-else>
  <div>暂无下单记录</div>
</template>
    </div>
</template>

<script>
import queryOrderForm from '@/views/Purchasing-Management/procurement/procurementList/orderformList/components/queryOrderForm'
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    components: {
        queryOrderForm
    },
    watch: {
        selectnumber(val) {
            if (!val) this.selectStatus = false
        }
    },
    computed: {
        _list() {
            if (this.selectStatus) {
                return this.list
            } else {
                return this.data
            }
        }
    },
    data() {
        return {
            list: [],
            columns: [
                {
                    value: 'productImg',
                    label: '图片',
                    img: true,
                    style: {
                        width: 60,
                        height: 60
                    },
                    bulkyHeight: 180
                },
                { value: 'productSku', label: '下单产品' },
                { value: 'productName', label: '产品名称' },
                { value: 'productQuantity', label: '下单产品数量' },
                { value: 'productPrice', label: '产品下单单价' }
            ],
            title: '',
            visible: false,
            selectnumber: '',
            selectStatus: false
        }
    },
    methods: {
        search() {
            if (this.selectnumber) {
                this.selectStatus = true
                this.list = this.data.filter(
                    item => item.lowerSingleNumber == this.selectnumber
                )
            } else {
                this.selectStatus = false
            }
        },
        lookOrderInfo(lowerSingleNumber) {
            this.title = `订单详情 - ${lowerSingleNumber}`
            this.visible = true
            this.$nextTick(() => {
                this.$refs.queryOrderForm.getListData(lowerSingleNumber)
            })
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
.historicalList {
    .list {
        margin-bottom: 20px;
        .item {
            height: 40px;
            line-height: 40px;
            border: 1px solid #ebeef5;
            border-bottom: none;
            text-indent: 20px;
            background: $bgColor;
            position: relative;
            bottom: -2px;
            .number {
                color: #009aff;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
            }
        }
    }
}
</style>
