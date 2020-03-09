<template lang="html">
    <!-- 历史销单记录 -->
    <div class="historicalList">
        <template v-if="data.length">

            <el-input placeholder="请输入订单号" clearable v-model.trim="selectnumber" style="width:300px;margin-bottom:10px;" size="medium">    
                <el-button slot="append" icon="el-icon-search" type="primary" @click="search"> 搜 索 </el-button>               
            </el-input>
            <template v-if="_list.length">
                <div class="list" v-for="(item,index) in _list" :key="index" >
                    <el-row class="item">
                        <el-col :span="6">
                            销单号：<span class="number" @click="lookInfo(item.pinOrderNumber)">{{item.pinOrderNumber}}</span>
                        </el-col>
                        <el-col :span="6">
                            下单号：{{ item.lowerSingleNumber }}
                        </el-col>
                        <el-col :span="6">
                            销单时间：{{ item.pinOrderTime }}
                        </el-col>
                        <el-col :span="6">
                            销单金额：{{ item.pinOrderAmount }}
                        </el-col>
                    </el-row>
                    <yt-table :data="item.products" :columns="columns" :border="true" :selection="false"/>
                </div>                
            </template>
            <div v-else style="font-size:14px;">
                    没有找到该销单号记录
            </div>
            

            <el-dialog
                :title="title"
                :visible.sync="visible"
                width="1000px"
                center>
                <eliminateForm ref="eliminateForm"></eliminateForm>
            </el-dialog>
        </template>
        <template v-else>
  <div class>暂无销单记录</div>
</template>
    </div>
</template>

<script>
import eliminateForm from '../../../orderformList/components/eliminateForm.vue'
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
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
                { value: 'productName', label: '销单产品' },
                { value: 'productPrice', label: '销单单价' },
                { value: 'productQuantity', label: '销单数量' },
                // {   value: "productQuantity",label: "销单数量" },
                { value: 'discountPrice', label: '优惠金额' }
            ],
            title: '',
            visible: false,
            selectnumber: '',
            selectStatus: false,
            list: []
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
    watch: {
        selectnumber(val) {
            if (!val) this.selectStatus = false
        }
    },
    methods: {
        search() {
            console.log(this.data)
            if (this.selectnumber) {
                this.selectStatus = true
                this.list = this.data.filter(
                    item => item.pinOrderNumber == this.selectnumber
                )
            } else {
                this.selectStatus = false
            }
        },
        lookInfo(pinOrderNumber) {
            this.title = `销单详情 - ${pinOrderNumber}`
            this.visible = true
            this.$nextTick(() => {
                this.$refs.eliminateForm.getListData(pinOrderNumber)
            })
        }
    },
    components: {
        eliminateForm
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
            }
        }
    }
}
</style>
