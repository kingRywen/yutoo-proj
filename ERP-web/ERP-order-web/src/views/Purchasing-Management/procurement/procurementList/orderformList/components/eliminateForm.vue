<template lang="html">
    <div class="eliminateForm">
        <yt-table :data="listA" :columns="columnsA" :border="true" :selection='false' style="margin-bottom:25px;"/>

        <yt-table :data="listB" :columns="columnsB" :border="true" :selection='false'>
            <el-table-column label="序号" width="90" type="index" align="center" slot="left"/>
            <el-table-column label="操作" width="150" align="center" slot="right">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看历史采购价" placement="bottom">
                        <i class="iconfont icon-caigoujiage iconBtn" @click="lookAtHistory(scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </yt-table>


        <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.visible"
            width="1200px"
            center
            :append-to-body='true'>

            <historyRecord ref="historyRecord"/>


        </el-dialog>
    </div>
</template>

<script>
import historyRecord from './historyRecord'
export default {
    components: {
        historyRecord
    },
    data() {
        return {
            dialog: {
                title: null,
                visible: false
            },
            listA: [],
            listB: [],
            columnsA: [
                { value: 'purchasersName', label: '采购人员' },
                { value: 'warehouseName', label: '仓库名称' },
                { value: 'pinOrderNumber', label: '销单号' },
                { value: 'purchaseNumber', label: '采购单号' },
                { value: 'pinName', label: '采购销单人' },
                { value: 'lowerSingleNumber', label: '下单号' },
                { value: 'pinTime', label: '销单时间' },
                { value: 'purchaseTypeName', label: '采购类型' }
            ],
            columnsB: [
                {
                    value: 'productImg',
                    label: '图片',
                    width: 100,
                    img: true,
                    style: {
                        width: 50,
                        height: 50
                    },
                    bulkyHeight: 180
                },
                { value: 'customSku', label: '自定义SKU', width: 120 },
                { value: 'productBarCode', label: '条形码' },
                { value: 'productName', label: '名称' },
                { value: 'productStateName', label: '产品状态' },
                {
                    value: '',
                    label: '属性',
                    children: 'variantPropertys',
                    prop: {
                        key: 'propertyName',
                        value: 'propertyValue'
                    }
                },
                { value: 'lowerSingleQuantity', label: '下单数量' },
                { value: 'productSingleAmount', label: '下单单价' },
                { value: 'totalProductSingleAmount', label: '下单总额' },
                { value: 'pinQuantity', label: '销单数量' },
                { value: 'pinOrderPrice', label: '销单单价' },
                {
                    label: '销单总额',
                    render: (h, scope) => {
                        return (
                            <span>
                                {scope.row.pinQuantity *
                                    scope.row.pinOrderPrice}
                            </span>
                        )
                    }
                }
            ]
        }
    },
    methods: {
        lookAtHistory(row) {
            this.dialog.title = `历史采购记录 - ${row.productSku}`
            this.dialog.visible = true
            this.$nextTick(() => {
                this.$refs.historyRecord.getHistoryInfo(
                    0,
                    row.productId,
                    row.purchaseId
                )
            })
        },
        getListData(pinOrderNumber) {
            this.loading = true
            this.$api['procurement/pinOrderDetail']({
                pinOrderNumber
            })
                .then(res => {
                    this.loading = false
                    this.listA = []
                    this.listA.push({
                        purchasersName: res.rows.purchasersName,
                        warehouseName: res.rows.warehouseName,
                        pinOrderNumber: res.rows.pinOrderNumber,
                        purchaseNumber: res.rows.purchaseNumber,
                        pinName: res.rows.pinName,
                        lowerSingleNumber: res.rows.lowerSingleNumber,
                        pinTime: res.rows.pinTime,
                        purchaseTypeName: res.rows.purchaseTypeName
                    })
                    this.listB = res.rows.products
                })
                .catch(err => {
                    this.$message.error(err.msg)
                    this.loading = false
                })
        }
    }
}
</script>

<style lang="css">
.eliminateForm {
    min-height: 500px;
}
</style>
