<template>
    <!-- 盘点管理 -->
    <div>
        <yt-page
            url="warehouse/inventoryPlanList"
            reserveSelection="wmInventoryPlanId"
            :tableConfig="tableConfig"
            :searchConfig="searchConfig"
            :btnConfig="btnConfig"
            :searchData="searchData"
            @submitForm="submitForm"
            @selectChange="selectChange"
            ref="page"
        >
            <template slot="tableLeft">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!--  -->
                        <el-tooltip effect="dark" :content="item.value" placement="top" v-for="(item,j) in scope.row.buttonList" :key="j">
                            <i class="iconBtn" :class="item.icon" @click="tableBtn(item.key,scope.row.wmInventoryPlanId)"></i>
                        </el-tooltip>
                        <!--  -->
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
                { value: 'batchNumber', label: '批次号', width: '200px' },
                { value: 'wmWarehouseName', label: '仓库' },
                { value: 'typeName', label: '盘点类型' },
                { value: 'statusName', label: '盘点状态' },
                { value: 'scopeName', label: '盘点库存范围' },
                { value: 'applicantName', label: '申请人员' },
                { value: 'createTime', label: '申请时间', width: '195px' },
                { value: 'completeTime', label: '完结时间', width: '195px' }
                // { value: 'remark', label: '备注' }
            ],
            searchConfig: [
                {
                    placeholder: '盘点类型',
                    value: 'type',
                    type: 'select',
                    children: this.$store.state.daily.inventoryType
                },
                {
                    placeholder: '仓库（多选）',
                    value: 'wmWarehouseIds',
                    type: 'multiple',
                    children: []
                },
                {
                    placeholder: '盘点状态',
                    value: 'status',
                    type: 'select',
                    children: this.$store.state.daily.inventoryStatus
                },
                {
                    label: '添加时间',
                    value: 'time',
                    type: 'time'
                }
            ],
            btnConfig: [
                {
                    name: '添加盘点计划',
                    icon: 'el-icon-plus',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '添加盘点计划',
                            visible: true,
                            component: () => import('./addEdit')
                        });
                    }
                },
                {
                    name: '批量审核',
                    icon: 'el-icon-zoom-in',
                    disabled: () => {
                        return this.wmInventoryPlanIds.length ? false : true;
                    },
                    fn: () => {
                        console.log(this.wmInventoryPlanIds);
                        this.$refs.page.$dialog({
                            title: '批量审核',
                            visible: true,
                            component: () => import('./batchToExamine')
                        });
                    }
                },
                {
                    name: '打印盘点清单',
                    icon: 'el-icon-printer',
                    type: 'success',
                    disabled: () => {
                        return this.wmInventoryPlanIds.length ? false : true;
                    },
                    fn: () => {
                        const { href } = this.$router.resolve({
                            name: 'inPrint',
                            query: {
                                title: '盘点清单',
                                wmInventoryPlanIds: this.wmInventoryPlanIds
                            }
                        });
                        window.open(href, '_blank');
                    }
                },
                {
                    name: '导出盘点报告',
                    icon: 'el-icon-download',
                    disabled: () => {
                        return this.wmInventoryPlanIds.length ? false : true;
                    },
                    fn: () => {
                        this.exportPresentation(this.wmInventoryPlanIds);
                    }
                }
                // {
                //     name: '删 除',
                //     icon: 'el-icon-delete',
                //     type: 'danger',
                //     disabled: () => {
                //         return this.wmInventoryPlanIds.length ? false : true;
                //     },
                //     fn: () => {
                //         this.$confirm(
                //             '此操作将永久删除该计划, 是否继续?',
                //             '提示',
                //             {
                //                 confirmButtonText: '确定',
                //                 cancelButtonText: '取消',
                //                 type: 'warning',
                //                 center: true
                //             }
                //         )
                //             .then(() => {
                //                 this.$api['warehouse/inventoryplandelete']({
                //                     wmInventoryPlanIds: this.wmInventoryPlanIds
                //                 }).then(res => {
                //                     this.coincident(res.msg);
                //                 });
                //             })
                //             .catch(() => {
                //                 return false;
                //             });
                //     }
                // },
                // {
                //     name: '异 常 完 结',
                //     icon: 'el-icon-warning',
                //     type: 'danger',
                //     disabled: () => {
                //         return this.wmInventoryPlanIds.length ? false : true;
                //     },
                //     fn: () => {}
                // }
            ],
            wmInventoryPlanIds: [],
            wmInventoryPlanId: ''
        };
    },
    methods: {
        tableBtn(type, wmInventoryPlanId) {
            switch (type) {
                case 1:
                    this.info(wmInventoryPlanId);
                    break;
                case 2:
                    this.singleToExamine(wmInventoryPlanId);
                    break;
                case 3:
                    this.log(wmInventoryPlanId);
                    break;
                case 4:
                    this.edit(wmInventoryPlanId);
                    break;
                case 5:
                    this.look(wmInventoryPlanId);
                    break;
                case 6:
                    this.exportPresentation(wmInventoryPlanId);
                    break;
                default:
                    break;
            }
        },
        //搜索
        searchData(val) {
            let n = {};
            for (let k in val) {
                if (k == 'time' && val[k] != null && val[k].length) {
                    n['createTimeStart'] = val[k][0];
                    n['createTimeEnd'] = val[k][1];
                    continue;
                }
                n[k] = val[k];
            }
            return n;
        },
        selectChange(val) {
            this.wmInventoryPlanIds = val.map(i => i.wmInventoryPlanId);
        },
        //提交
        submitForm(val, title) {
            switch (title) {
                case '审核':
                    this.batchAudit({
                        ...val,
                        wmInventoryPlanIds: Array.of(this.wmInventoryPlanId)
                    });
                    break;
                case '批量审核':
                    this.batchAudit({
                        wmInventoryPlanIds: this.wmInventoryPlanIds,
                        ...val
                    });
                    break;
                case '添加盘点计划':
                    this.add(val);
                    break;
                case '编辑盘点计划':
                    this.editSave(val);
                    break;
                default:
                    break;
            }
        },
        //查看原因
        look(wmInventoryPlanId) {
            this.$refs.page.$dialog({
                title: '查看原因',
                visible: true,
                component: () => import('./singleToExamine'),
                display: false,
                fnName: 'getInfo',
                params: {
                    id: wmInventoryPlanId,
                    name: 'wmInventoryPlanId',
                    type: '盘点',
                    disabled: true
                }
            });
        },
        //查看详情
        info(wmInventoryPlanId) {
            this.$refs.page.$dialog({
                title: '查看',
                visible: true,
                width: '1100px',
                component: () => import('./info'),
                display: false,
                fnName: 'getInfo',
                params: {
                    name: 'wmInventoryPlanId',
                    id: wmInventoryPlanId,
                    type: '盘点'
                }
            });
        },
        //操作日志
        log(wmInventoryPlanId) {
            this.$refs.page.$dialog({
                title: '操作日志',
                visible: true,
                component: () => import('./log'),
                display: false,
                fnName: 'getLogList',
                params: {
                    url: 'warehouse/inventoryPlaneOperationLog',
                    id: wmInventoryPlanId,
                    idName: 'wmInventoryPlanId',
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
        //编辑判断计划保存
        editSave(val) {
            this.$api['warehouse/inventoryPlaneUpdate']({
                ...val,
                wmInventoryPlanId: this.wmInventoryPlanId
            }).then(res => {
                this.coincident(res.msg);
            });
        },
        //编辑盘点计划
        edit(wmInventoryPlanId) {
            this.wmInventoryPlanId = wmInventoryPlanId;
            this.$refs.page.$dialog({
                title: '编辑盘点计划',
                visible: true,
                component: () => import('./addEdit'),
                fnName: 'editInfo',
                params: wmInventoryPlanId
            });
        },
        //添加盘点计划
        add(val) {
            this.$api['warehouse/inventoryPlanCreate'](val).then(res => {
                this.coincident(res.msg);
            });
        },
        //导出
        exportPresentation(wmInventoryPlanIds) {
            if (!Array.isArray(wmInventoryPlanIds)) {
                wmInventoryPlanIds = Array.of(wmInventoryPlanIds);
            }
            this.$api['warehouse/inventoryPlanReport']({
                wmInventoryPlanIds
            }).then(res => {
                window.location.href = res.rows.path;
            });
        },
        //单个审核
        singleToExamine(wmInventoryPlanId) {
            this.wmInventoryPlanId = wmInventoryPlanId;
            this.$refs.page.$dialog({
                title: '审核',
                visible: true,
                component: () => import('./singleToExamine'),
                fnName: 'getInfo',
                params: {
                    id: wmInventoryPlanId,
                    name: 'wmInventoryPlanId',
                    type: '盘点'
                }
            });
        },
        //审核
        batchAudit(params) {
            this.$api['warehouse/inventoryPlanAudit'](params).then(res => {
                this.coincident(res.msg);
            });
        },
        isChecked() {
            if (this.wmInventoryPlanIds.length) {
                return true;
            } else {
                this.$message.warning('请先选择需要批量处理的数据');
                return false;
            }
        },
        ...mapActions(['getWarehouseList'])
    },
    created() {
        this.getWarehouseList(1).then(data => {
            this.searchConfig[1].children = data;
        });
    }
};
</script>


