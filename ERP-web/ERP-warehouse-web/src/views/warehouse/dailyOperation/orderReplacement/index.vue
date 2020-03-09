<template>
    <!-- <div>订单退换货管理</div> -->
    <div>
        <yt-page url="warehouse/returnList" reserveSelection="wmReturnId" :tableConfig="tableConfig" :searchConfig="searchConfig" :btnConfig="btnConfig" :searchData="searchData" @submitForm="submitForm" @selectChange="selectChange" ref="page">
            <template slot="tableLeft">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="操作日志" placement="top">
                            <i class="iconBtn el-icon-document" @click="log(scope.row.wmReturnId)"></i>
                        </el-tooltip>
                        <!-- <el-button type="text" size="mini" @click="log(scope.row.wmReturnId)">操作日志</el-button> -->
                    </template>
                </el-table-column>
            </template>
            <template slot="tableRight">
                <el-table-column label="退货产品总数量" align="center">
                    <template slot-scope="scope">
                        <el-button slot="reference" type="text" @click="productQuantity(scope.row.wmReturnId)">{{scope.row.total}}</el-button>
                    </template>
                </el-table-column>
            </template>
        </yt-page>
        <!--  -->
        <el-dialog title="退款产品" :visible.sync="returnProduct" width="600px">
            <div style="max-height: 580px;overflow-y: auto;">
                <yt-table :data="productQuantityList" :columns="columns" :border="true" :selection="false"></yt-table>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            returnProduct: false,
            tableConfig: [
                { value: 'storeName', label: '订单来源店铺' },
                {
                    value: 'orderNumber',
                    label: '订单号',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.lookOrderInfo.bind(
                                    this,
                                    scope.row
                                )}
                            >
                                {scope.row.orderNumber}
                            </el-button>
                        );
                    }
                },
                { value: 'reasonName', label: '退换货原因' },
                { value: 'returnType', label: '退货类型' },
                { value: 'customerName', label: '客户名称' },
                { value: 'customerEmail', label: '邮箱' },
                {
                    value: 'customerTelephone',
                    label: '联系电话',
                    width: '195px'
                },
                { value: 'createTime', label: '添加时间', width: '195px' },
                { value: 'principalName', label: '负责人' }
            ],
            btnConfig: [
                {
                    name: '设置负责人员',
                    disabled: () => {
                        return this.wmReturnIds.length ? false : true;
                    },
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '设置负责人',
                            width: '500px',
                            visible: true,
                            component: () => import('./personInCharge'),
                            fnName: 'getprincipalList',
                            params: this.wmReturnIds
                        });
                    }
                }
            ],
            wmReturnIds: [],
            productQuantityList: [],
            columns: [
                {
                    value: 'imageBase',
                    label: '主图',
                    img: true,
                    width: 110,
                    style: {
                        width: 50,
                        height: 50
                    }
                },
                { value: 'skuStore', label: '店铺SKU' },
                { value: 'warehoused', label: '已入库' },
                { value: 'unwarehoused', label: '未入库' }
            ]
        };
    },
    computed: {
        searchConfig() {
            return [
                {
                    placeholder: '所有退换货原因（多选）',
                    value: 'reasons',
                    type: 'multiple',
                    children: this.$store.state.daily.problemTypeList
                },
                {
                    placeholder: '入库状态',
                    value: 'status',
                    type: 'select',
                    children: this.$store.state.daily.warehousingStatus
                },
                {
                    placeholder: '订单来源',
                    value: 'storeIds',
                    type: 'cascader',
                    children: this.$store.state.daily.storeAllList,
                    props: {
                        value: 'storeId',
                        label: 'name',
                        children: 'stores'
                    }
                },
                {
                    lebel: '添加时间',
                    value: 'time',
                    type: 'time'
                }
            ];
        }
    },
    mounted() {
        this.getStoreAllList();
    },
    methods: {
        ...mapActions(['getStoreAllList']),
        lookOrderInfo(row) {
            let { orderId, orderType, platformId } = row;
            let type = null;
            if (orderType == 3 || orderType == 4 || orderType == 5) {
                type = 3;
            } else {
                type = orderType;
            }
            window.open(
                `/erp-order/#/salesManagement/associatedSettings/allOrderLists/lookOver?deliveryStatus=已发货&orderServiceId=${orderId}&platformId=${platformId}&orderType=${type}`,
                '_blank'
            );
        },
        searchData(val) {
            let p = {};
            for (let k in val) {
                if (k == 'time' && Array.isArray(val.time) && val.time.length) {
                    p['createTimeStart'] = val.time[0];
                    p['createTimeEnd'] = val.time[1];
                    continue;
                }
                if (k == 'storeIds' && val.storeIds.length) {
                    p['storeIds'] = [val.storeIds[val.storeIds.length - 1]];
                    continue;
                }
                p[k] = val[k];
            }
            return p;
        },
        selectChange(val) {
            this.wmReturnIds = val.map(i => i.wmReturnId);
        },

        //退货产品总数量
        /* eslint-disable */
        productQuantity(wmReturnId) {
            this.returnProduct = true;
            this.$api['warehouse/returnProductList']({
                wmReturnId
            }).then(res => {
                this.productQuantityList = res.rows;
            });
        },
        log(wmReturnId) {
            this.$refs.page.$dialog({
                title: '操作日志',
                visible: true,
                component: () => import('../Inventory/log'),
                display: false,
                fnName: 'getLogList',
                params: {
                    url: 'warehouse/returnLogList',
                    id: wmReturnId,
                    idName: 'wmReturnId',
                    columns: [
                        {
                            value: 'createTime',
                            label: '操作时间',
                            width: '150px'
                        },
                        {
                            value: 'operatorName',
                            label: '操作人员',
                            width: '100px'
                        },
                        { value: 'msg', label: '具体操作' }
                    ]
                }
            });
        },
        submitForm(val, title) {
            switch (title) {
                case '设置负责人':
                    this.setPersonInCharge(val);
                    break;
                default:
                    break;
            }
        },
        //设置负责人
        setPersonInCharge(val) {
            this.$api['warehouse/returnPrincipalSetting']({
                ...val,
                wmReturnIds: this.wmReturnIds
            }).then(res => {
                this.$message.success(res.msg);
                this.$refs.page.getList();
                this.$refs.page.resetForm();
            });
        }
    }
};
</script>
<style lang="scss">
</style>

