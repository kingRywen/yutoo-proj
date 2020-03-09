<template>
    <div class="describle-tempalte">
        <yt-page url="order/descTempList" reserveSelection="ebayBargainingId" :tableConfig="tableConfig" :searchConfig="searchConfig" :btnConfig="btnConfig" :searchData="searchData" @submitForm="submitForm" @selectChange="selectChange" ref="page">
            <template slot="table">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="查看模板" placement="top" :open-delay="500">
                            <i class="el-icon-search iconBtn" @click="look(scope.row.ebayDescribeTemplateId)"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="操作日志" placement="top" :open-delay="500">
                            <i class="el-icon-tickets iconBtn" @click="log(scope.row.ebayDescribeTemplateId)"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="复制添加" placement="top" :open-delay="500">
                            <i class="el-icon-document-copy iconBtn" @click="cope(scope.row.ebayDescribeTemplateId)"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="编 辑" placement="top" :open-delay="500">
                            <i class="el-icon-edit iconBtn" @click="edit(scope.row.ebayDescribeTemplateId)"/>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </template>
        </yt-page>
        <log-info :params="logParams"></log-info>
    </div>
</template>

<script>
export default {
    data() {
        return {
            logParams: {
                url: 'order/descTempLog',
                info: {
                    ebayDescribeTemplateId: ''
                },
                visible: true
            },
            tableConfig: [
                {
                    label: '模板名称',
                    value: 'templateName'
                },
                {
                    label: '添加人',
                    value: 'creatorName'
                },
                {
                    label: '添加日期',
                    value: 'createTime'
                },
                {
                    label: '备注',
                    value: 'templateRemark'
                }
            ],
            searchConfig: [
                {
                    value: 'name',
                    type: 'input',
                    placeholder: '模板名称'
                }
            ],
            btnConfig: [
                {
                    name: '添 加',
                    icon: 'el-icon-plus',
                    fn: () => {
                        this.$refs.page.$dialog({
                            title: '选择模板布局',
                            visible: true,
                            component: () => import('./select-template.vue')
                        });
                    }
                },
                {
                    name: '刪 除',
                    type: 'danger',
                    icon: 'el-icon-delete',
                    disabled: () =>
                        this.ebayDescribeTemplateIds.length ? false : true,
                    fn: () => {
                        this.$confirm(
                            '此操作将永久删除该模板, 是否继续?',
                            '提示',
                            {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }
                        )
                            .then(() => {
                                this.$api['order/descTempRemove']({
                                    ebayDescribeTemplateIds: this
                                        .ebayDescribeTemplateIds
                                }).then(res => {
                                    this.hintAndUpdate(res.msg);
                                    this.$refs.page.clearSelection();
                                });
                            })
                            .catch();
                    }
                }
            ],
            ebayDescribeTemplateIds: [],
            searchData(val) {
                return val;
            }
        };
    },
    methods: {
        look(ebayDescribeTemplateId) {
            this.$router.push({
                name: 'H5edit',
                params: {
                    tempID: ebayDescribeTemplateId,
                    status: '查看'
                }
            });
        },
        cope(ebayDescribeTemplateId) {
            this.$router.push({
                name: 'H5edit',
                params: {
                    tempID: ebayDescribeTemplateId,
                    status: '复制'
                }
            });
        },
        edit(ebayDescribeTemplateId) {
            this.$router.push({
                name: 'H5edit',
                params: {
                    tempID: ebayDescribeTemplateId,
                    status: '编辑'
                }
            });
        },
        log(ebayDescribeTemplateId) {
            this.logParams = {
                url: 'order/descTempLog',
                info: {
                    ebayDescribeTemplateId
                },
                visible: true
            };
        },
        submitForm(data, title) {
            switch (title) {
                case '选择模板布局':
                    this.$router.push({
                        name: 'H5edit',
                        params: {
                            tempID: data,
                            status: '添加'
                        }
                    });
                    break;
                default:
                    break;
            }
        },
        selectChange(v) {
            this.ebayDescribeTemplateIds = v.map(i => i.ebayDescribeTemplateId);
        },
        hintAndUpdate(msg) {
            this.$message.success(msg);
            this.$refs.page.getList();
        }
    }
};
</script>

<style lang='scss'>
.describle-tempalte {
    background: #fff;
    height: 100%;
}
</style>