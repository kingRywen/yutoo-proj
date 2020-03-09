<template>
    <!-- <div>常用面单</div> -->
    <yt-page url="warehouse/wmDocumentModelPage" reserveSelection="wmDocumentModelId" :tableConfig="tableConfig" :searchConfig="searchConfig" :searchData="searchData" @selectChange="selectChange" :dialogEvents="dialogEvents" ref="page">
        <template slot="tableLeft">
            <el-table-column label="操作" align="center" width="140">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="复制面单" placement="top" :open-delay="500">
                        <i class="iconfont iconBtn" @click="copy(scope)">&#xe606;</i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="查看详情" placement="top" :open-delay="500">
                        <router-link target="_blank" :to="{name: 'faceSheetPreview',params: {id: scope.row.wmDocumentModelId, modelType: scope.row.modelType,url:'wmDocumentModelGet'}}" tag="a">
                            <i class="el-icon-search iconBtn"/>
                        </router-link>
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
                                vm.getList();
                            }
                        })
                    );
                }
            },
            tableConfig: [
                { value: 'modelName', label: ' 模板名称' },
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
                }
            ]
        };
    },
    methods: {
        copy(scope) {
            // this.$.showWarning('是否复制面单？', () => {
            //     this.$api[`warehouse/wmDocumentModelCopy`]({
            //         wmDocumentModelId: scope.row.wmDocumentModelId
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
                    str: '常用'
                },
                component: () =>
                    import('Components/FaceSheet/FaceSheetEdit.vue')
            });
        },
        searchData(val) {
            return val;
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
    }
};
</script>
<style lang="scss">
</style>