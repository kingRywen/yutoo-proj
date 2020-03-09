<template lang="html">
    <!-- 有货先发 -->
    <el-form ref="form" :model="form"  size="small">
        <div style="display:flex;justify-content: space-between;">
            <h3 class="dialogItemTitle">未生包裹产品</h3>
            <p>未生包裹产品总重量  {{allWeight}} kg ; 未生成包裹已锁定重量  {{allGeneratedWeight}} kg ; 当前先发重量{{allcurrFirstDelivery}}kg</p>
        </div>
        <div class="border">
            <yt-table :data="tableList" :columns="columns" :border="true" :selection="false">
                <el-table-column label="先发数量" width="180" align="center" slot="right">
                    <template slot-scope="scope">
                        <el-form-item
                            :prop="'products.' + scope.$index + '.quantity'"
                            :rules="[
                              { required: true, message: '请输入发货数量',trigger: 'change' },
                              { type: 'number', message: '必须为数字值'}
                            ]">
                            <el-input v-model.number="form.products[scope.$index].quantity"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </yt-table>
        </div>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            tableList: [],
            columns: [
                {
                    value: 'productImg',
                    label: '图片',
                    width: '200',
                    img: true,
                    style: {
                        width: 60,
                        height: 60
                    },
                    bulkyHeight: 180
                },
                {
                    value: 'productName',
                    label: '产品名称',
                    align: 'left',
                    render: (h, scope) => {
                        return (
                            <ul>
                                <li>{scope.row.customSku}</li>
                                <li>{scope.row.storeSku}</li>
                                <li>{scope.row.productName}</li>
                            </ul>
                        )
                    }
                },
                { value: 'productQuantity', label: '订购数量' },
                {
                    label: '库存',
                    align: 'left',
                    width: '180px',
                    render: (h, scope) => {
                        return (
                            <ul>
                                <li>{'锁定：' + scope.row.lockStock}</li>
                                <li>{'库存：' + scope.row.stock}</li>
                                <li>{'采购中：' + scope.row.purchaseing}</li>
                            </ul>
                        )
                    }
                }
            ],
            form: {
                products: []
            },
            allWeight: null,
            allGeneratedWeight: null,
            allcurrFirstDelivery: null
        }
    },
    watch: {
        tableList(val) {
            this.form.products = val.map(item => {
                return {
                    orderProductId: item.productId,
                    quantity: ''
                }
            })
        }
    },
    methods: {
        submitForm(callback) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.form, {
                        orderId: this.$route.query.orderServiceId
                    })
                    this.$api['order/deliverSave'](params)
                        .then(res => {
                            this.$message.success(res.msg)
                            callback && callback(true)
                        })
                        .catch(err => {
                            this.$message.error(err.msg)
                        })
                } else {
                    return false
                }
            })
        },
        //获取发货信息
        getInfo() {
            this.$api['order/deliverInfo']({
                orderId: this.$route.query.orderServiceId
            })
                .then(res => {
                    this.tableList = res.rows
                    if (this.tableList.length) {
                        let allWeight = this.tableList.map(
                            item => item.uNGeneratedLogWeight
                        )
                        let allGeneratedWeight = this.tableList.map(
                            item => item.uNGeneratedWeight
                        )
                        let allcurrFirstDelivery = this.tableList.map(
                            item => item.currFirstDelivery
                        )

                        this.allWeight = this.and(allWeight)
                        this.allGeneratedWeight = this.and(allGeneratedWeight)
                        this.allcurrFirstDelivery = this.and(
                            allcurrFirstDelivery
                        )

                        console.log(
                            this.allWeight,
                            this.allGeneratedWeight,
                            this.allcurrFirstDelivery
                        )
                    }
                })
                .catch(err => {
                    this.$message.error(err.msg)
                })
        },
        resetForm() {
            this.$refs.form.resetFields()
        },
        and(arr) {
            if (arr instanceof Array && arr.length) {
                let result
                result = arr.reduce((i, j) => {
                    return i + j
                })
                return result
            } else {
                console.error('Not an array')
            }
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
</style>
