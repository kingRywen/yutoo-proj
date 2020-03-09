<template>
    <!-- 发票管理 -->
    <yt-page
        url="warehouse/wmDocumentModelMPage"
        reserveSelection="wmDocumentModelMId"
        :tableConfig="tableConfig"
        :searchConfig="searchConfig"
        :searchData="searchData"
        :btnConfig="btnConfig"
        :outerParams="outerParams"
        @selectChange="selectChange"
        :dialogEvents="dialogEvents"
        ref="page"
    >
        <template slot="tableLeft">
            <el-table-column label="操作" align="center" width="140">
                <template slot-scope="scope">
                    <!-- <el-tooltip effect="dark" content="复制面单" placement="top" :open-delay="500">
                        <i class="iconfont iconBtn" @click="copy(scope)">&#xe606;</i>
                    </el-tooltip>-->
                    <el-tooltip effect="dark" content="查看详情" placement="top" :open-delay="500">
                        <router-link target="_blank" :to="{name: 'faceSheetPreview',params: {id: scope.row.wmDocumentModelMId, modelType: scope.row.modelType,url:'wmDocumentModelMGet'}}" tag="a">
                            <i class="el-icon-search iconBtn"/>
                        </router-link>
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
import mixin from '../storehouse/mixin';

export default {
    name: 'productsStock',
    mixins: [mixin],
    data() {
        let vm = this;
        return {
            outerParams: {
                modelType: 3
            },
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
            tableConfig: [
                {
                    value: 'modelName',
                    label: ' 模板名称',
                    width: '400px',
                    render(h, scope) {
                        if (scope.row.defaultFlag) {
                            return (
                                <div>
                                    <span style="margin-right:5px;">
                                        {' '}
                                        {scope.row.modelName}
                                    </span>
                                    <el-tag type="warning" size="small">
                                        默认
                                    </el-tag>
                                </div>
                            );
                        } else {
                            return <span>{scope.row.modelName}</span>;
                        }
                    }
                },
                {
                    label: '规格',
                    multi: [
                        { label: '长', value: 'modelLength' },
                        { label: '宽', value: 'modelWidth' }
                    ]
                },
                { value: 'createTime', label: '添加时间' },
                { value: 'creatorName', label: '添加人' }
            ],
            btnConfig: [
                {
                    name: '添加',
                    icon: 'el-icon-plus',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '添加发票',
                            visible: true,
                            width: '90%',
                            dialogOpts: {
                                top: '6vh',
                                fullscreen: true
                            },
                            params: {
                                data: {},
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
        edit(scope) {
            this.$refs.page.$dialog({
                title: '编辑发票',
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
            this.$.showWarning('是否复制面单？', () => {
                this.$api[`warehouse/wmDocumentModelMCopy`]({
                    wmDocumentModelMId: scope.row.wmDocumentModelMId
                }).then(() => {
                    this.getList();
                });
            });
        },
        searchData(val) {
            return Object.assign(val, { modelType: 3 });
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
                }
            ];
        }
    }
};
</script>
