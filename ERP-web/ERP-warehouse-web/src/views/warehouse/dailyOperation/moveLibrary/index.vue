<template>
    <!-- 移库管理 -->
    <div>
        <yt-page url="warehouse/movePlanList" reserveSelection="wmMovePlanId" :tableConfig="tableConfig" :searchConfig="searchConfig" :btnConfig="btnConfig" :searchData="searchData" @submitForm="submitForm" @selectChange="selectChange" ref="page">
            <template slot="tableLeft">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="item.value" placement="top" v-for="(item,j) in scope.row.buttonList" :key="j">
                            <i class="iconBtn" :class="item.icon" @click="tableBtn(item.key,scope.row.wmMovePlanId)"></i>
                        </el-tooltip>
                        <!-- <el-button type="text" size="mini" @click="info(scope.row.wmMovePlanId)">查看详情</el-button>
                        <el-button type="text" size="mini" @click="singleToExamine(scope.row.wmMovePlanId)">审核</el-button>
                        <el-button type="text" size="mini" @click="log(scope.row.wmMovePlanId)">操作日志</el-button>
                        <el-button type="text" size="mini" @click="edit(scope.row.wmMovePlanId)">编辑</el-button>
                        <el-button type="text" size="mini" @click="look(scope.row.wmMovePlanId)">查看原因</el-button>-->
                    </template>
                </el-table-column>
            </template>

            <template slot="tableRight">
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="scope.row.remark" placement="top">
                            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.remark}}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </template>
        </yt-page>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import { mixins } from '../mixins';
export default {
    mixins: [mixins],
    data() {
        return {
            tableConfig: [
                { value: 'wmWarehouseName', label: '仓库' },
                { value: 'statusName', label: '状态' },
                { value: 'applicantName', label: '申请人员' },
                { value: 'createTime', label: '申请时间' },
                { value: 'completeTime', label: '完结时间' }
                // { value: 'remark', label: '备注', width: '200px' }
            ],
            searchConfig: [
                {
                    placeholder: '仓库（多选）',
                    value: 'wmWarehouseIds',
                    type: 'multiple',
                    children: []
                },
                {
                    placeholder: '状态',
                    value: 'status',
                    type: 'select',
                    children: this.$store.state.daily.movelibraryStatus
                },
                {
                    label: '申请时间',
                    name: 'supplierId',
                    value: 'time',
                    type: 'time'
                }
            ],
            btnConfig: [
                {
                    name: '添加移库计划',
                    icon: 'el-icon-plus',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '添加移库计划',
                            width: '1020px',
                            visible: true,
                            component: () => import('./addEdit')
                        });
                    }
                },
                {
                    name: '批量审核',
                    icon: 'el-icon-zoom-in',
                    disabled: () => {
                        return this.wmMovePlanIds.length ? false : true;
                    },
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '批量审核',
                            visible: true,
                            component: () =>
                                import('../Inventory/batchToExamine')
                        });
                    }
                }
                // {
                //     name: '删 除',
                //     icon: 'el-icon-delete',
                //     type: 'danger',
                //     disabled: () => {
                //         return this.wmMovePlanIds.length ? false : true;
                //     },
                //     fn: () => {}
                // },
                // {
                //     name: '异 常 完 结',
                //     icon: 'el-icon-warning',
                //     type: 'danger',
                //     disabled: () => {
                //         return this.wmMovePlanIds.length ? false : true;
                //     },
                //     fn: () => {}
                // }
            ],
            wmMovePlanIds: [],
            wmMovePlanId: ''
        };
    },
    methods: {
        tableBtn(type, wmMovePlanId) {
            switch (type) {
                case 1:
                    this.info(wmMovePlanId);
                    break;
                case 2:
                    this.singleToExamine(wmMovePlanId);
                    break;
                case 3:
                    this.log(wmMovePlanId);
                    break;
                case 4:
                    this.edit(wmMovePlanId);
                    break;
                case 5:
                    this.look(wmMovePlanId);
                    break;
                default:
                    break;
            }
        },
        //查看详情
        info(wmMovePlanId) {
            this.$refs.page.$dialog({
                title: '查看',
                visible: true,
                width: '1100px',
                component: () => import('../Inventory/info'),
                display: false,
                fnName: 'getInfo',
                params: {
                    name: 'wmMovePlanId',
                    id: wmMovePlanId,
                    type: '移库'
                }
            });
        },
        //搜索
        searchData(val) {
            return val;
        },
        selectChange(val) {
            console.log(val);
            this.wmMovePlanIds = val.map(i => i.wmMovePlanId);
        },
        //查看原因
        look(wmMovePlanId) {
            this.$refs.page.$dialog({
                title: '查看原因',
                visible: true,
                component: () => import('../Inventory/singleToExamine'),
                display: false,
                fnName: 'getInfo',
                params: {
                    id: wmMovePlanId,
                    name: 'wmMovePlanId',
                    type: '移库',
                    disabled: true
                }
            });
        },
        //单个审核
        singleToExamine(wmMovePlanId) {
            this.wmMovePlanId = wmMovePlanId;
            this.$refs.page.$dialog({
                title: '审核',
                visible: true,
                component: () => import('../Inventory/singleToExamine'),
                fnName: 'getInfo',
                params: {
                    id: wmMovePlanId,
                    name: 'wmMovePlanId',
                    type: '移库'
                }
            });
        },
        //批量审核
        batchAudit(params) {
            this.$api['warehouse/movePlanAudit'](params).then(res => {
                this.coincident(res.msg);
            });
        },
        //操作日志
        log(wmMovePlanId) {
            this.$refs.page.$dialog({
                title: '操作日志',
                visible: true,
                component: () => import('../Inventory/log'),
                display: false,
                fnName: 'getLogList',
                params: {
                    url: 'warehouse/movePlanOperationLog',
                    id: wmMovePlanId,
                    idName: 'wmMovePlanId',
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
        //编辑
        edit(wmMovePlanId) {
            this.wmMovePlanId = wmMovePlanId;
            this.$refs.page.$dialog({
                title: '编辑移库计划',
                width: '920px',
                visible: true,
                component: () => import('./addEdit'),
                fnName: 'edit',
                params: wmMovePlanId
            });
        },
        //添加移库计划
        addMovelibrary(val) {
            this.$api['warehouse/movePlanCreate'](val).then(res => {
                this.coincident(res.msg);
            });
        },
        //编辑移库计划
        editMovelibrary(val) {
            this.$api['warehouse/movePlanUpdate']({
                ...val,
                wmMovePlanId: this.wmMovePlanId
            }).then(res => {
                this.coincident(res.msg);
            });
        },
        //提交
        submitForm(val, title) {
            switch (title) {
                case '批量审核':
                    this.batchAudit({
                        wmMovePlanIds: this.wmMovePlanIds,
                        ...val
                    });
                    break;
                case '审核':
                    this.batchAudit({
                        ...val,
                        wmMovePlanIds: Array.of(this.wmMovePlanId)
                    });
                    break;
                case '添加移库计划':
                    this.addMovelibrary(val);
                    break;
                case '编辑移库计划':
                    this.editMovelibrary(val);
                    break;
                default:
                    break;
            }
        },
        ...mapActions(['getWarehouseList'])
    },
    created() {
        this.getWarehouseList(1).then(data => {
            this.searchConfig[0].children = data;
        });
    }
};
</script>
<style lang="scss">
</style>
