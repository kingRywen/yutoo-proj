<template>
    <!-- <div>所有产品库存</div> -->
    <yt-page
        class="product-list"
        url="warehouse/wmInventoryList"
        reserveSelection="productId"
        :fixedPage="true"
        :tableConfig="tableConfig"
        :searchConfig="searchConfig"
        :btnConfig="btnConfig"
        :searchData="searchData"
        @selectChange="selectChange"
        :dialogEvents="dialogEvents"
        @onClickBtn="onClickBtn"
        :evalFunc="evalFunc"
        ref="page"
    >
        <template slot="search">
            <!--  -->
            <el-form :inline="true" class="searchform">
                <el-form-item label="仓库（多选）">
                    <el-select size="small" multiple collapse-tags v-model="selectInfo.warehouseIds" @change="changewarehouse">
                        <el-option :label="i.label" :value="i.value" v-for="i in warehouseList" :key="i.item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域 (多选) ">
                    <el-select size="small" multiple collapse-tags v-model="selectInfo.wmWarehouseDivisionIds">
                        <el-option :label="i.label" :value="i.value" v-for="i in regionalList" :key="i.item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="库位">
                    <table-select :wmWarehouseIds="selectInfo.warehouseIds" @handleselect="(val)=>selectInfo.locationIds=val"></table-select>
                </el-form-item>
                <el-form-item>
                    <el-select clearable size="small" collapse-tags v-model="selectInfo.searchType">
                        <el-option :label="i.label" :value="i.value" v-for="i in $const['WAREHOUSE/productsType']" :key="i.item"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input clearable  size="small" v-model.trim="selectInfo.searchValue"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
                </el-form-item>
            </el-form>
            <!--  -->
        </template>

        <template slot="tableLeft">
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="查看详情" placement="top" :open-delay="500">
                        <i class="el-icon-search iconBtn" @click="viewDetails(scope)"/>
                    </el-tooltip>
                </template>
            </el-table-column>
        </template>
    </yt-page>
</template>
<script>
/* eslint-disable */
import { mapState, mapActions, mapMutations } from 'vuex';
import mixin from '../storehouse/mixin';
import Vue from 'vue';
import TableSelect from '@/components/tableSelect/tableSelect';
import { evalFunc } from 'Plugins/util';
export default {
    name: 'productsStock',
    mixins: [mixin],
    components: {
        TableSelect
    },
    data() {
        let vm = this;
        return {
            dialogEvents: {
                open() {
                    vm.$nextTick(() => {
                        // 弹窗里的组件
                        let component = vm.$refs.page.$refs.component;
                        // 调用组件初始化函数
                        component._initData && component._initData();
                    });
                },
                close() {
                    // 弹窗里的组件
                    let component = vm.$refs.page.$refs.component;
                    // 调用组件关闭函数
                    component._close && component._close();
                },
                handleOkClick() {
                    let component = vm.$refs.page.$refs.component;
                    return (
                        component.submit &&
                        component.submit().then(res => {
                            if (!res) {
                                vm.$refs.page.getList(true);
                            }
                        })
                    );
                }
            },
            tableConfig: [
                {
                    value: 'imgPath',
                    label: '图片',
                    img: true,
                    style: {
                        //图片宽高
                        width: 45,
                        height: 45
                    }
                },
                {
                    value: 'customSku',
                    label: '自定义SKU',
                    width: 200,
                    align: 'left',
                    // eslint-disable-next-line
                    render(h, scope, arr) {
                        // eslint-disable-next-line
                        let {
                            children,
                            expand,
                            loading,
                            _level,
                            customSku
                        } = scope.row;
                        // eslint-disable-next-line
                        let { $index: index } = scope;
                        return (
                            <div
                                class="flex-c"
                                style={{
                                    paddingLeft: (_level - 1) * 40 + 'px',
                                    justifyContent: 'start'
                                }}
                            >
                                <div class="btn" style="margin-right:4px">
                                    {_level === 1 ? (
                                        <el-button
                                            disabled={loading}
                                            icon={
                                                loading
                                                    ? 'el-icon-loading'
                                                    : scope.row._expanded
                                                    ? 'el-icon-minus'
                                                    : 'el-icon-plus'
                                            }
                                            onClick={() => {
                                                if (!scope.row._expanded) {
                                                    if (!scope.row.children) {
                                                        let {
                                                            productId
                                                        } = scope.row;
                                                        let params = {
                                                            parentId: productId
                                                        };
                                                        vm.$set(
                                                            scope.row,
                                                            'loading',
                                                            true
                                                        );
                                                        vm.$api[
                                                            `warehouse/wmInventoryListChilds`
                                                        ](params)
                                                            .then(data => {
                                                                vm.$set(
                                                                    scope.row,
                                                                    'children',
                                                                    data.list
                                                                );
                                                                vm.$set(
                                                                    scope.row,
                                                                    'loading',
                                                                    false
                                                                );
                                                                vm.$set(
                                                                    scope.row,
                                                                    '_expanded',
                                                                    true
                                                                );
                                                            })
                                                            .catch(() => {});
                                                    } else {
                                                        vm.$set(
                                                            scope.row,
                                                            '_expanded',
                                                            true
                                                        );
                                                    }
                                                } else {
                                                    scope.row._expanded = false;
                                                }
                                            }}
                                            type="text"
                                        />
                                    ) : null}
                                </div>
                                <div class="text">{customSku}</div>
                            </div>
                        );
                    }
                },
                { value: 'name', label: '产品名' },

                { value: 'inventoryDaysSafety', label: '安全库存天数' },
                { value: 'inventoryDaysUnsalable', label: '滞销库存天数' },

                {
                    value: 'inventory',
                    label: '仓库数量',
                    render(h, scope) {
                        return scope.row.inventory != null ? (
                            <el-button
                                onClick={() => {
                                    vm.$refs.page.$dialog({
                                        title: '仓库库存',
                                        visible: true,
                                        width: '1100px',
                                        params: scope.row,
                                        component: () =>
                                            import('./components/ProductInventory.vue')
                                    });
                                }}
                                type="text"
                            >
                                <b>{scope.row.inventory}</b>
                            </el-button>
                        ) : (
                            <span>-</span>
                        );
                    }
                },
                {
                    label: '在库库存',
                    merge: [
                        {
                            label: '本地仓',
                            value: 'localInventory'
                        },
                        {
                            label: '海外仓',
                            value: 'overseasInventory'
                        },
                        {
                            label: '平台仓',
                            value: 'platformInventory'
                        }
                    ]
                },
                { value: 'purchaseInventory', label: '采购中库存', width: 100 },
                { value: 'lockingInventory', label: '锁定总数' },
                {
                    label: '待收库存',
                    merge: [
                        {
                            label: '平台',
                            value: 'pendingPlatformInventory',
                            render(h, scope) {
                                return scope.row.pendingPlatformInventory !=
                                    null ? (
                                    <el-button
                                        onClick={() => {
                                            vm.$refs.page.$dialog({
                                                title: '待收库存',
                                                visible: true,
                                                width: '1100px',
                                                params: {
                                                    ...scope.row,
                                                    _type: 3
                                                },
                                                component: () =>
                                                    import('./components/InventoryToreceived.vue')
                                            });
                                        }}
                                        type="text"
                                    >
                                        <b>
                                            {scope.row.pendingPlatformInventory}
                                        </b>
                                    </el-button>
                                ) : (
                                    <span>-</span>
                                );
                            }
                        },
                        {
                            label: '海外仓',
                            value: 'pendingOverseasInventory',
                            render(h, scope) {
                                return scope.row.pendingOverseasInventory !=
                                    null ? (
                                    <el-button
                                        onClick={() => {
                                            vm.$refs.page.$dialog({
                                                title: '待收库存',
                                                visible: true,
                                                width: '1100px',
                                                params: {
                                                    ...scope.row,
                                                    _type: 2
                                                },
                                                component: () =>
                                                    import('./components/InventoryToreceived.vue')
                                            });
                                        }}
                                        type="text"
                                    >
                                        <b>
                                            {scope.row.pendingOverseasInventory}
                                        </b>
                                    </el-button>
                                ) : (
                                    <span>-</span>
                                );
                            }
                        },
                        {
                            label: '本地仓',
                            value: 'pendingLocalInventory',
                            render(h, scope) {
                                return scope.row.pendingLocalInventory !=
                                    null ? (
                                    <el-button
                                        onClick={() => {
                                            vm.$refs.page.$dialog({
                                                title: '待收库存',
                                                visible: true,
                                                width: '1100px',
                                                params: {
                                                    ...scope.row,
                                                    _type: 1
                                                },
                                                component: () =>
                                                    import('./components/InventoryToreceived.vue')
                                            });
                                        }}
                                        type="text"
                                    >
                                        <b>{scope.row.pendingLocalInventory}</b>
                                    </el-button>
                                ) : (
                                    <span>-</span>
                                );
                            }
                        }
                    ]
                },
                { value: 'historyInCount', label: '历史入库总数' },
                { value: 'historyOutCount', label: '历史出库总数' },
                { value: 'updateTime', label: '更新时间', width: 90 }
            ],
            btnConfig: [
                {
                    name: '批量操作',
                    children: [
                        { name: '打印插头规格' },
                        { name: '批量打印产品仓库条形码' }
                    ]
                },
                {
                    name: '批量导出',
                    children: [
                        { name: '当前条件导出' },
                        { name: '导出入库记录' },
                        { name: '导出所有仓库库存' }
                    ]
                },
                {
                    name: '全局产品预警库存设置',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '全局产品预警库存设置',
                            okBtnText: '保存',
                            visible: true,
                            width: '640px',
                            params: {},
                            component: () =>
                                import('./components/GlobalProductWarning.vue')
                        });
                    }
                },
                {
                    name: '单个产品预警库存设置',
                    disabled: () => {
                        return vm.selection.length !== 1;
                    },
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '单个产品预警库存设置',
                            okBtnText: '保存',
                            visible: true,
                            width: '700px',
                            params: {
                                productId: vm.selection[0].productId,
                                productType:
                                    vm.selection[0]._level === 1 ? 3 : 1
                            },
                            component: () =>
                                import('./components/SingleProductWarning.vue')
                        });
                    }
                },
                {
                    name: '导入产品质量问题',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '导入产品质量问题',
                            okBtnText: '确认导入',
                            cancelBtnText: '取消',
                            visible: true,
                            width: '600px',
                            params: {
                                type: '导入产品质量问题'
                            },
                            component: () =>
                                import('../storehouse/components/ImportLocation.vue')
                        });
                    }
                }
            ],
            selectInfo: {
                wmWarehouseIds: [],
                wmWarehouseDivisionIds: '',
                locationIds: [],
                searchType: [],
                searchValue: ''
            }
        };
    },
    methods: {
        ...mapActions('vmWarehouse', ['queryData']),
        ...mapMutations('vmWarehouse', ['clearRegionalList']),
        //搜索仓库改变时
        changewarehouse(wmWarehouseIds) {
            console.log(wmWarehouseIds);
            if (!wmWarehouseIds.length) {
                this.clearRegionalList();
                return;
            }
            this.queryData({
                type: 4,
                outParams: { wmWarehouseIds }
            });
        },
        // 树展开函数
        evalFunc(data, expandAll, parent = null, level = null) {
            return evalFunc.apply(this, arguments);
        },
        onClickBtn(name) {
            let notSelects = [
                    '当前条件导出',
                    '导出所有仓库库存',
                    '导出入库记录'
                ],
                ids,
                idsString,
                params,
                parentIds,
                variantIds;
            if (notSelects.indexOf(name) === -1) {
                ids = this.getChecked(false);
                if (!ids || !ids.length) {
                    return;
                }
                idsString = ids.map(el => el.productId).join('-');
            }

            switch (name) {
                case '打印插头规格':
                    this.$refs.page.$dialog({
                        title: '选择打印数量',
                        visible: true,
                        width: '600px',
                        params: {
                            ids
                        },
                        component: () =>
                            import('./components/SelectPlugSpecification.vue')
                    });
                    break;

                case '批量打印产品仓库条形码':
                    parentIds = ids
                        .filter(el => el._level === 1)
                        .map(el => el.productId)
                        .join('-');
                    variantIds = ids
                        .filter(el => el._level !== 1)
                        .map(el => ({
                            productName: el.name,
                            productId: el.productId,
                            productSku: el.customSku,
                            productImg: el.imgPath
                        }));

                    if (variantIds) {
                        this.$refs.page.$dialog({
                            title: '选择仓库',
                            visible: true,
                            width: '400px',
                            okBtnText: '确认',
                            params: {
                                variantIds
                            },
                            component: () =>
                                import('./components/SelectWarehouse.vue')
                        });
                    } else {
                        this.$message.warning('请选择变体');
                    }

                    break;

                case '当前条件导出':
                    params =
                        this.$refs.page.$refs.search &&
                        this.$refs.page.$refs.search.searchForm;
                    this.$api[`warehouse/wmInventoryExportCurrent`](params)
                        .then(() => {
                            this.$.notify();
                        })
                        .catch(() => {});
                    break;

                case '导出入库记录':
                    this.$refs.page.$dialog({
                        title: '导出入库记录',
                        visible: true,
                        width: '600px',
                        okBtnText: '确认导出',
                        params: {
                            ids
                        },
                        component: () => import('./components/ExportRecord.vue')
                    });
                    break;

                case '导出所有仓库库存':
                    this.$api[`warehouse/wmInventoryExportInventory`]()
                        .then(() => {
                            this.$.notify();
                        })
                        .catch(() => {});
                    break;

                default:
                    break;
            }
        },

        viewDetails(scope) {
            this.$refs.page.$dialog({
                title: `查看详情`,
                visible: true,
                width: '1200px',
                params: scope.row,
                component: () => import('./components/MainDetails.vue')
            });
        },
        search() {
            this.$refs.page.searchInfo = { ...this.selectInfo };
            this.$refs.page.getList('search');
        },
        searchData(val) {
            return val;
        },
        initData() {
            Promise.all([this.queryData(3)]).catch(() => {
                this.$notify({
                    title: '警告',
                    type: 'warning',
                    message: '初始化数据失败，请刷新重试'
                });
            });
        }
    },
    computed: {
        ...mapState('vmWarehouse', ['warehouseList', 'regionalList']),
        searchConfig() {
            let vm = this;
            return [
                {
                    label: '仓库(多选)',
                    value: 'wmWarehouseIds',
                    type: 'multiple',
                    children: vm.warehouseList
                },
                {
                    label: '区域(多选)',
                    value: 'wmWarehouseDivisionIds',
                    type: 'multiple',
                    children: vm.regionalList
                },

                {
                    label: '库位编码',
                    value: 'locationCode',
                    type: 'input'
                },

                {
                    label: '',
                    value: 'searchType',
                    type: 'select',
                    placeholder: '选择搜索字段',
                    children: vm.$const['WAREHOUSE/productsType']
                },
                {
                    label: '',
                    value: 'searchValue',
                    placeholder: '输入搜索值',
                    type: 'input'
                }
            ];
        }
    },
    created() {
        this.initData();
    }
};
</script>
<style lang="scss">
.searchform {
    .el-form-item {
        margin-bottom: 0;
    }
}
.product-list {
    .el-table--mini th,
    .el-table--mini td {
        padding: 0;
    }
}
</style>