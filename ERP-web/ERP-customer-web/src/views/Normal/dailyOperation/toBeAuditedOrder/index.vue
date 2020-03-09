<template>
  <div>
    <!-- 待审核订单 -->
    <universal-layout
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
      @clickBtn="clickBtn"
    >
      <template slot="search">
        <search :searchList="searchList" @search="search"></search>
      </template>
      <template slot="table">
        <yt-table
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          ref="table"
          reserveSelection="orderId"
          :data="tableList"
          :columns="columns"
          :border="true"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column label="操作" width="80" align="center" slot="left">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改收货信息" placement="bottom">
                <el-button type="text" icon="el-icon-edit" class="ibtn" @click="edit(scope.row.orderId)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </yt-table>
      </template>
    </universal-layout>
    <!--  -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width">
      <component :is="dialog.component" ref="component" :orderId="currentOrderId" :data="products"></component>
      <span slot="footer" v-if="dialog.isShowBtn">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { myMixin, auditType } from '../mixins.js'
import { mapActions } from 'vuex'
import ModifyReceivingInfo from './ModifyReceivingInfo'
import productsImg from './productsImg'
const TIPS_MSG = '请先选择需要操作的数据'

export default {
    mixins: [myMixin],
    components: {
        ModifyReceivingInfo,
        productsImg
    },
    data() {
        const _this = this
        return {
            columns: [
                {
                    label: '图片',
                    value: 'productImg',
                    width: '100px',
                    img: true,
                    style: {
                        width: 49,
                        height: 49
                    },
                    badge(scope) {
                        return scope.row.urgentFlag === 1 ? '加急' : null
                    }
                },
                {
                    label: '订单产品数量',
                    value: 'orderProductQuantity',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.lookproductsImg.bind(
                                    this,
                                    scope.row.products
                                )}
                            >
                                {scope.row.orderProductQuantity}
                            </el-button>
                        )
                    }
                },
                {
                    label: '系统订单号',
                    value: 'orderNumSystem',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.goOrderInfo.bind(
                                    this,
                                    scope.row.orderId,
                                    scope.row.platformId,
                                    scope.row.orderType
                                )}
                            >
                                {scope.row.orderNumSystem}
                            </el-button>
                        )
                    }
                },
                {
                    label: '平台订单号',
                    value: 'orderNumPlatform',
                    width: '150px',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.goOrderInfo.bind(
                                    this,
                                    scope.row.orderId,
                                    scope.row.platformId,
                                    scope.row.orderType
                                )}
                            >
                                {scope.row.orderNumPlatform}
                            </el-button>
                        )
                    }
                },
                { label: '订单状态', value: 'orderStatusName' },
                { label: '订单金额', value: 'orderPrice' },
                { label: '订单客户名称', value: 'cneeName' },
                {
                    label: '邮箱',
                    value: 'cneeEmail',
                    render: (h, scope) => {
                        return <p class="textOverflow">{scope.row.cneeEmail}</p>
                    }
                },
                { label: '联系电话', value: 'cneePhone' },
                // { label: 'IP', value: 'ip' },
                { label: '操作人员', value: 'operatorName' },
                { label: '审核类型', value: 'examineTypeName' },
                {
                    label: '备注',
                    value: 'orderRemark',
                    render: (h, scope) => {
                        return (
                            <p class="textOverflow">{scope.row.orderRemark}</p>
                        )
                    }
                }
            ],
            btnList: [
                {
                    name: '批量审核通过',
                    fn: () => {
                        if (this.orderIds.length) {
                            this.confirmMsg('确认审核通过吗', () => {
                                let params = {
                                    state: 1,
                                    orderIds: _this.orderIds
                                }
                                _this.http(
                                    'email/examineExamine',
                                    params,
                                    'msg'
                                )
                            })
                        } else {
                            this.$message.warning(TIPS_MSG)
                        }
                    }
                },
                {
                    name: '批量作废订单',
                    fn: () => {
                        if (this.orderIds.length) {
                            this.confirmMsg('确认作废吗', () => {
                                let params = {
                                    state: 2,
                                    orderIds: _this.orderIds
                                }
                                _this.http(
                                    'email/examineExamine',
                                    params,
                                    'msg'
                                )
                            })
                        } else {
                            this.$message.warning(TIPS_MSG)
                        }
                    }
                },
                {
                    name: '设置加急发货',
                    children: [{ name: '加急' }, { name: '取消加急' }]
                }
            ],
            searchList: [
                {
                    label: '审核类型：',
                    type: 'select',
                    value: 'examineType',
                    children: auditType
                },
                {
                    placeholder: '订单来源（多选）',
                    type: 'multiple',
                    value: 'storeIds',
                    children: []
                },
                {
                    label: '添加时间：',
                    type: 'time',
                    value: 'time'
                }
            ],
            orderIds: [],
            currentOrderId: null,
            products: []
        }
    },
    methods: {
        lookproductsImg(products) {
            this.products = products
            this.openDialog({
                title: 'SKU图片',
                visible: true,
                width: '550px',
                isShowBtn: false,
                component: 'productsImg'
            })
        },
        edit(orderId) {
            this.currentOrderId = orderId
            this.openDialog({
                title: '修改收货信息',
                visible: true,
                component: 'ModifyReceivingInfo'
            })
            this.$nextTick(() => {
                this.$refs.component.resetForm()
                this.$refs.component.getOrderInfo(orderId)
            })
        },
        submitForm() {
            this.$refs.component.submitForm(this.currentOrderId, () => {
                this.openDialog({ visible: false })
                this.getList()
            })
        },
        clickBtn(val) {
            const len = this.orderIds.length
            if (len) {
                let state
                switch (val) {
                    case '加急':
                        state = 1
                        break
                    case '取消加急':
                        state = 0
                        break
                }
                this.http(
                    'order/setUrgentState',
                    { orderIds: this.orderIds, state },
                    'msg'
                )
            } else {
                this.$message.warning(TIPS_MSG)
            }
        },
        handleSelectionChange(val) {
            this.orderIds = val.map(i => i.orderId)
        },
        getList(val) {
            let params = {
                pageSize: this.pageSize,
                pageNumber: this.pageNo,
                sortOrder: 'asc'
            }
            if (val === 'search') {
                let newp = {}
                let searchInfo = this.searchInfo
                for (let k in searchInfo) {
                    if (
                        k === 'time' &&
                        searchInfo[k] !== null &&
                        searchInfo[k].length
                    ) {
                        newp['startTime'] = searchInfo[k][0]
                        newp['endTime'] = searchInfo[k][1]
                        continue
                    }
                    if (k === 'storeIds' && searchInfo[k].length) {
                        newp[k] = searchInfo[k]
                        continue
                    }
                    if (
                        (searchInfo[k] !== '' || searchInfo[k] != null) &&
                        k !== 'storeIds' &&
                        k !== 'time' &&
                        searchInfo[k] !== ''
                    ) {
                        newp[k] = searchInfo[k]
                        continue
                    }
                }
                console.log(params)

                params = Object.assign({}, params, newp)
            }
            this.http('email/examineList', params, 'list')
        },
        ...mapActions('product', ['getStoreId'])
    },
    mounted() {
        this.getList()
        this.getStoreId().then(() => {
            this.searchList[1].children = this.$store.state.product.storeIdList
        })
    }
}
</script>
<style lang="scss">
@import '@/assets/css/common.scss';
</style>