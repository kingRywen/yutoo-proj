<template>
    <!-- <div>自定义面单</div> -->
    <yt-page
        url="warehouse/wmDocumentModelMPage"
        reserveSelection="wmDocumentModelMId"
        :tableConfig="tableConfig"
        :searchConfig="searchConfig"
        :searchData="searchData"
        :btnConfig="btnConfig"
        @selectChange="selectChange"
        :dialogEvents="dialogEvents"
        ref="page"
    >
        <template slot="tableLeft">
            <el-table-column label="操作" align="center" width="140">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="复制面单" placement="top" :open-delay="500">
                        <i class="iconfont iconBtn" @click="copy(scope)">&#xe606;</i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="查看详情" placement="top" :open-delay="500">
                        <router-link target="_blank" :to="{name: 'faceSheetPreview',params: {id: scope.row.wmDocumentModelMId, modelType: scope.row.modelType,url:'wmDocumentModelMGet'}}" tag="a">
                            <i class="el-icon-search iconBtn"/>
                        </router-link>

                        <!-- <i class="el-icon-search iconBtn" @click="look(scope.row)"/> -->
                    </el-tooltip>
                    <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
                        <!-- <i class="iconfont iconBtn" @click="edit(scope)">&#xe606;</i> -->
                        <i class="el-icon-edit iconBtn" @click="edit(scope)"/>
                    </el-tooltip>
                </template>
            </el-table-column>
        </template>
    </yt-page>
</template>
<script>
import mixin from '../../storehouse/mixin';

export default {
    name: 'productsStock',
    mixins: [mixin],

    data() {
        const vm = this;
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
                    vm.$refs.page.getList();
                    // 调用组件关闭函数
                    component._close && component._close();
                },
                handleOkClick() {
                    let component = vm.$refs.page.$refs.component;
                    return (
                        component.submit &&
                        component.submit().then(res => {
                            if (!res) {
                                vm.getList();
                            }
                        })
                    );
                }
            },
            dialogOpts: {},
            tableConfig: [
                {
                    value: 'modelName',
                    label: ' 模板名称',
                    width: '400px',
                    render(h, scope) {
                        return <span>{scope.row.modelName}</span>;
                    }
                },
                {
                    value: 'modelType',
                    label: '模板类型',
                    render(h, scope) {
                        return (
                            <span>
                                {scope.row.modelType == 1 ? '面单' : '报关单'}
                            </span>
                        );
                    }
                },

                {
                    label: '规格',
                    multi: [
                        { label: '长', value: 'modelLength' },
                        { label: '宽', value: 'modelWidth' }
                    ]
                },
                {
                    value: 'defaultFlagName',
                    label: '状态',
                    render(h, scope) {
                        if (scope.row.defaultFlag) {
                            return (
                                <i
                                    class="el-icon-check status_icon success"
                                    onClick={() => {
                                        vm.changeStatus(scope.row);
                                    }}
                                />
                            );
                        } else {
                            return (
                                <i
                                    class="el-icon-close status_icon danger"
                                    onClick={() => {
                                        vm.changeStatus(scope.row);
                                    }}
                                />
                            );
                        }
                    }
                },
                {
                    value: 'createTime',
                    label: '添加时间',
                    width: '190px'
                },
                {
                    value: 'creatorName',
                    label: '添加人'
                }
            ],
            btnConfig: [
                {
                    name: '添加',
                    icon: 'el-icon-plus',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '添加',
                            visible: true,
                            width: '90%',
                            dialogOpts: {
                                top: '6vh',
                                fullscreen: true
                            },
                            params: {
                                data: {
                                    data: {}
                                },
                                isCopy: false
                            },
                            component: () =>
                                import('Components/FaceSheet/FaceSheetEdit.vue')
                        });
                    }
                },
                {
                    name: '删除',
                    type: 'danger',
                    icon: 'el-icon-delete',
                    fn: () => {
                        let wmDocumentModelMIdList = this.getChecked(
                            'wmDocumentModelMId'
                        );
                        if (!wmDocumentModelMIdList) {
                            return;
                        }
                        this.$.showWarning('是否删除选择的面单？', () => {
                            this.$api[`warehouse/wmDocumentModelMRemove`]({
                                wmDocumentModelMIdList
                            })
                                .then(() => {
                                    this.refresh();
                                })
                                .catch(() => {});
                        });
                    }
                }
            ]
        };
    },
    methods: {
        changeStatus(scope) {
            this.$confirm('此操作将更改当前其状态, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
                .then(() => {
                    const { wmDocumentModelMId, defaultFlag } = scope;
                    this.$api['warehouse/WmDocumentModelMActiveSet']({
                        wmDocumentModelMId,
                        defaultFlag: defaultFlag ? 0 : 1
                    }).then(res => {
                        this.$message.success(res.msg);
                        this.$refs.page.getList();
                    });
                })
                .catch(() => {
                    return false;
                });
        },
        look(printType, wmPackageIds) {
            const { href } = this.$router.resolve({
                name: 'faceSheetPrint',
                query: {
                    printType,
                    wmPackageIds: this.wmPackageIds,
                    isReplace: true
                }
            });
            window.open(href, '_blank');
        },
        edit(scope) {
            this.$refs.page.$dialog({
                title: `编辑${scope.row.modelType == 1 ? '面单' : '报关单'}`,
                visible: true,
                width: '90%',
                dialogOpts: {
                    top: '6vh',
                    fullscreen: true
                },
                params: {
                    data: scope.row,
                    isCopy: false
                },
                component: () =>
                    import('Components/FaceSheet/FaceSheetEdit.vue')
            });
        },
        copy(scope) {
            // this.$.showWarning('是否复制面单？', () => {
            //     this.$api[`warehouse/wmDocumentModelMCopy`]({
            //         wmDocumentModelMId: scope.row.wmDocumentModelMId
            //     }).then(() => {
            //         this.getList();
            //     });
            // });
            this.$refs.page.$dialog({
                title: `复制${scope.row.modelType == 1 ? '面单' : '报关单'}`,
                visible: true,
                width: '90%',
                dialogOpts: {
                    top: '6vh',
                    fullscreen: true
                },
                params: {
                    data: scope.row,
                    isCopy: true,
                    str: '自定义'
                },
                component: () =>
                    import('Components/FaceSheet/FaceSheetEdit.vue')
            });
        },
        searchData(val) {
            return val;
        },
        initData() {
            Promise.all([this.queryData(3), this.queryData(4)]).catch(() => {
                this.$notify({
                    title: '警告',
                    type: 'warning',
                    message: '初始化数据失败，请刷新重试'
                });
            });
        }
    },
    computed: {
        searchConfig() {
            return [
                {
                    label: '模板名称',
                    value: 'modelName',
                    placeholder: '',
                    type: 'input'
                },
                {
                    label: '模板类型',
                    value: 'modelType',
                    type: 'select',
                    placeholder: '',
                    children: [
                        {
                            label: '面单',
                            value: 1
                        },
                        {
                            label: '报关单',
                            value: 2
                        }
                    ]
                }
            ];
        }
    },
    watch: {}
};
</script>
<style lang="scss">
.status_icon {
    font-size: 24px;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
        transform: scale(1.5, 1.5);
    }
}
.success {
    color: #67c23a;
}
.danger {
    color: #f56c6c;
}
</style>