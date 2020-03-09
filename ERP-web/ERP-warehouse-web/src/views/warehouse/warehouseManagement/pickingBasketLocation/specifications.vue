<template>
    <!-- 規格管理-->
    <div>
        <yt-page
            url="warehouse/WmPickingBasketNormList"
            reserveSelection="id"
            :tableConfig="tableConfig"
            :searchConfig="searchConfig"
            :btnConfig="btnConfig"
            :searchData="searchData"
            @submitForm="submitForm"
            @selectChange="selectChange"
            ref="page"
            class="specifications"
        >
            <template slot="tableRight">
                <el-table-column label="操作" align="center" width="170px">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="iconBtn el-icon-edit-outline" @click="edit(scope.row.wmPickingBasketNormId)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <i class="iconBtn el-icon-delete" type="text" @click="del(scope.row.wmPickingBasketNormId)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </template>
        </yt-page>
    </div>
</template>
<script>
import { mixins } from '@/views/warehouse/dailyOperation/mixins';
import { mapActions } from 'vuex';
export default {
    mixins: [mixins],
    data() {
        return {
            tableConfig: [
                { value: 'normName', label: '规格名称', width: '180px' },
                {
                    label: '规格尺寸',
                    render(h, scope) {
                        let sizeUnitName = scope.row.sizeUnitName;
                        let l = `长：${scope.row.valueLength + sizeUnitName}; `;
                        let w = `宽：${scope.row.valueWidth + sizeUnitName}; `;
                        let high = `高：${scope.row.valueHigh +
                            sizeUnitName}; `;
                        return <p>{l + ' ' + w + ' ' + high}</p>;
                    }
                },
                { value: 'normDesc', label: '备注' },
                {
                    value: 'activatedFlag',
                    label: '状态',
                    width: '100px',
                    render(h, scope) {
                        if (scope.row.activatedFlag) {
                            return (
                                <i class="el-icon-check status_icon success" />
                            );
                        } else {
                            return (
                                <i class="el-icon-close status_icon danger" />
                            );
                        }
                    }
                }
            ],
            searchConfig: [],
            btnConfig: [
                {
                    name: '添 加',
                    fn: () => {
                        this.$refs.page.$dialog({
                            visible: true,
                            title: '添加篮子规格',
                            confirmButtonText: '确认添加',
                            width: '450px',
                            component: () => import('./addEditspecifications')
                        });
                    }
                },
                {
                    name: '批 量 删 除',
                    type: 'danger',
                    fn: () => {
                        if (!this.wmPickingBasketNormIds.length) {
                            return this.$message.warning(
                                '请选择需要批量删除的篮子'
                            );
                        }
                        this.checkedDel({
                            wmPickingBasketNormIds: this.wmPickingBasketNormIds
                        });
                    }
                }
            ],
            wmPickingBasketNormIds: [],
            wmPickingBasketNormId: ''
        };
    },
    methods: {
        searchData(val) {
            return val;
        },
        selectChange(val) {
            this.wmPickingBasketNormIds = val.map(i => i.wmPickingBasketNormId);
        },
        submitForm(val, title) {
            switch (title) {
                case '添加篮子规格':
                    this.add(val);
                    break;
                case '编辑篮子规格':
                    this.editSave(val);
                    break;
                default:
                    break;
            }
        },
        checkedDel(params) {
            this.$api['warehouse/WmPickingBasketNormDelete'](params).then(
                res => {
                    this.coincident(res.msg);
                    this.getWmPickingBasketNormList();
                }
            );
        },
        del(wmPickingBasketNormId) {
            this.$confirm('此操作将永久删除篮子规格, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.checkedDel({
                        wmPickingBasketNormIds: Array.of(wmPickingBasketNormId)
                    });
                })
                .catch(() => {
                    return false;
                });
        },
        //edit
        edit(wmPickingBasketNormId) {
            this.wmPickingBasketNormId = wmPickingBasketNormId;
            this.$refs.page.$dialog({
                visible: true,
                title: '编辑篮子规格',
                confirmButtonText: '确认编辑',
                width: '450px',
                component: () => import('./addEditspecifications'),
                fnName: 'edit',
                params: wmPickingBasketNormId
            });
        },
        editSave(val) {
            this.$api['warehouse/WmPickingBasketNormUpdate']({
                ...val,
                wmPickingBasketNormId: this.wmPickingBasketNormId
            }).then(res => {
                this.coincident(res.msg);
                this.getWmPickingBasketNormList();
            });
        },
        //添加
        add(val) {
            this.$api['warehouse/WmPickingBasketNormCreate'](val).then(res => {
                this.coincident(res.msg);
                this.getWmPickingBasketNormList();
            });
        },
        ...mapActions(['getWmPickingBasketNormList'])
    }
};
</script>
<style lang="scss">
@import '@/assets/css/common.scss';
.status_icon {
    font-size: 24px;
}
.success {
    color: #67c23a;
}
.danger {
    color: #f56c6c;
}
.specifications {
    .UniversalLayout {
        position: initial;
        .search {
            display: none;
        }
    }
}
</style>