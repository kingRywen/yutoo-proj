<template>
    <div class="transport-mode">
        <yt-page
            url="warehouse/transportPage"
            reserveSelection="logisticTransportId"
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
                        <el-tooltip content="编辑" placement="top-start">
                            <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">
                                <i class="el-icon-edit normal-btn-icon"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="查看" placement="top-start">
                            <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row, true)">
                                <i class="el-icon-search normal-btn-icon"></i>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </template>
        </yt-page>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
export default {
    data() {
        let vm = this;
        return {
            searchConfig: [
                {
                    value: 'logisticTransportationIdList',
                    type: 'multiple',
                    placeholder: '运输方(多选)',
                    children: []
                },
                {
                    value: 'logisticTransportTypeIdList',
                    type: 'multiple',
                    placeholder: '运输方式(多选)',
                    children: []
                },
                {
                    label: '添加时间',
                    value: 'time',
                    type: 'time'
                },
                {
                    value: 'customsDeclarationIdList',
                    type: 'multiple',
                    placeholder: '报关单模板(多选)',
                    children: []
                },
                {
                    value: 'faceSheetIdList',
                    type: 'multiple',
                    placeholder: '面单模板(多选)',
                    children: []
                }
            ],
            btnConfig: [
                {
                    name: '添加运输方',
                    fn: () => {
                        vm.$refs.page.$dialog({
                            title: '添加运输方',
                            visible: true,
                            width: '1000px',
                            component: () => import('./addTransport.vue')
                        });
                    }
                },
                {
                    name: '添加运输方式',
                    fn: () => {
                        this.addTransportWay();
                    }
                },
                {
                    name: '删除',
                    fn: () => {
                        if (vm.$editMsg(vm.selectData, false)) return;
                        let logisticTransportIdList = vm.selectData.map(
                            item => item.logisticTransportId
                        );
                        vm.$api['warehouse/transportRemove']({
                            logisticTransportIdList
                        }).then(data => {
                            vm.$deleteMsg(data);
                            vm.$refs.page.getList();
                            vm.$refs.page.clearSelection();
                        });
                    }
                },
                {
                    name: '批量设置面单',
                    fn: () => {
                        if (vm.$editMsg(vm.selectData, false)) return;
                        this.$refs.page.$dialog({
                            title: '批量设置面单',
                            visible: true,
                            width: '360px',
                            component: () => import('./faceSheet.vue'),
                            childFn: [
                                {
                                    name: 'getIdList',
                                    params: {
                                        logisticTransportIdList: vm.selectData.map(
                                            item => item.logisticTransportId
                                        )
                                    }
                                }
                            ]
                        });
                    }
                },
                {
                    name: '批量设置报关单',
                    fn: () => {
                        if (vm.$editMsg(vm.selectData, false)) return;
                        vm.$refs.page.$dialog({
                            title: '批量设置报关单',
                            visible: true,
                            width: '360px',
                            component: () => import('./customsDeclaration.vue'),
                            childFn: [
                                {
                                    name: 'getIdList',
                                    params: {
                                        logisticTransportIdList: vm.selectData.map(
                                            item => item.logisticTransportId
                                        )
                                    }
                                }
                            ]
                        });
                    }
                }
            ],
            tableConfig: [
                {
                    label: '运输方名称',
                    value: 'logisticTransportationName'
                },
                {
                    label: '运输方式数量',
                    render(h, scope) {
                        return (
                            <i
                                class="link-color"
                                onClick={() => {
                                    vm.addTransportWay(scope.$index, scope.row);
                                }}
                            >
                                {scope.row.transportTypeNum}
                            </i>
                        );
                    }
                },
                {
                    label: '添加人',
                    value: 'creatorName'
                },
                {
                    label: '添加时间',
                    value: 'createTime'
                },
                {
                    label: '是否激活',
                    render: vm.$.checkFlag((index, row) => {
                        let logisticTransportId = row.logisticTransportId;
                        let activateFlag = row.activateFlag == 1 ? 0 : 1;
                        this.$api['warehouse/transportActiveSet']({
                            logisticTransportId,
                            activateFlag
                        }).then(() => {
                            vm.$refs.page.getList('search');
                        });
                    })
                }
            ],
            selectData: []
        };
    },
    created() {
        this.getTransportationList();
        this.getForwarderTypeList();
        this.getManifestTempList();
        this.getFaceSheetTempList();
    },
    mounted() {
        console.log(this.$refs.page.buttonNumList);
    },
    watch: {
        transportationList(val) {
            this.searchConfig[0].children = val;
        },
        forwarderTypeList(val) {
            this.searchConfig[1].children = val;
        },
        manifestTempList(val) {
            this.searchConfig[3].children = val;
        },
        faceSheetTempList(val) {
            this.searchConfig[4].children = val;
        }
    },
    computed: {
        ...mapState('logistics', [
            'transportationList',
            'forwarderTypeList',
            'manifestTempList',
            'faceSheetTempList'
        ])
    },
    methods: {
        ...mapActions('logistics', [
            'getTransportationList',
            'getForwarderTypeList',
            'getManifestTempList',
            'getFaceSheetTempList'
        ]),
        addTransportWay(index, row) {
            let vm = this;
            let logisticTransportIds = null;

            if (row) {
                logisticTransportIds = [row.logisticTransportId];
            } else {
                logisticTransportIds = vm.selectData.map(
                    item => item.logisticTransportId
                );
            }
            if (vm.$editMsg(logisticTransportIds)) return;
            vm.$refs.page.$dialog({
                title: '添加运输方式',
                visible: true,
                width: '1000px',
                component: () => import('./addTransportWay.vue'),
                childFn: [
                    {
                        name: 'getLists',
                        params: {
                            logisticTransportId: logisticTransportIds[0]
                        }
                    }
                ]
            });
        },
        searchData(val) {
            if (val.time && val.time.length) {
                val.createTimeStart = val.time[0];
                val.createTimeEnd = val.time[1];
            }
            delete val.time;
            return val;
        },
        selectChange(val) {
            this.selectData = val;
        },
        submitForm(val, title) {
            switch (title) {
                case '添加运输方':
                    this.addTransports(val);
                    break;
                case '编辑运输方':
                    this.addTransports(val, 'edit');
                    break;
                case '查看运输方':
                    this.$refs.page.resetForm();
                    break;
                case '添加运输方式':
                    this.$refs.page.closeForm();
                    break;
                case '批量设置面单':
                    this.setFaceSheet(val);
                    break;
                case '批量设置报关单':
                    this.setCustomsDeclaration(val);
                    break;
                default:
                    break;
            }
        },
        handleEdit(index, row, view) {
            let logisticTransportId = row.logisticTransportId;
            let params = {};
            let title = '';
            if (view) {
                title = '查看运输方';
                params = {
                    logisticTransportId,
                    isViewFlag: true
                };
            } else {
                title = '编辑运输方';
                params = {
                    logisticTransportId
                };
            }
            this.$refs.page.$dialog({
                title,
                visible: true,
                width: '1000px',
                component: () => import('./addTransport.vue'),
                childFn: [
                    {
                        name: 'edit',
                        params
                    }
                ]
            });
        },
        addTransports(val, type) {
            if (val == false) {
                this.$refs.page.resetForm();
                return;
            }
            let params = JSON.parse(JSON.stringify(val));
            let vm = this;
            vm.$api['warehouse/transportSave'](params)
                .then(_data => {
                    vm.$refs.page.closeForm();
                    if (type == 'edit') {
                        return;
                    }
                    vm.$confirm('是否继续添加运输方式?', '提示', {
                        confirmButtonText: '确定添加运输方式',
                        cancelButtonText: '暂时不添加',
                        type: 'warning'
                    })
                        .then(() => {
                            vm.addTransportWay(1, {
                                logisticTransportId: _data.logisticTransportId
                            });
                        })
                        .catch(() => {
                            vm.$message({
                                type: 'info',
                                message: '已取消添加'
                            });
                        });
                })
                .catch(() => {
                    console.log('err');
                });
        },
        setFaceSheet(val) {
            let vm = this;
            vm.$api['warehouse/transportFaceSheetSet'](val)
                .then(data => {
                    vm.$deleteMsg(data);
                    vm.$refs.page.closeForm();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        setCustomsDeclaration(val) {
            let vm = this;
            vm.$api['warehouse/transportCustomsDeclarationSet'](val)
                .then(data => {
                    vm.$deleteMsg(data);
                    vm.$refs.page.closeForm();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>
<style lang="scss">
.transport-mode {
    background: #fff;
}
</style>