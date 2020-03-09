<template>
    <!-- 拣货篮位置管理-->
    <div>
        <yt-page
            url="warehouse/WmPickingBasketSeatList"
            reserveSelection="wmPickingBasketSeatId"
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
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="iconBtn el-icon-edit-outline" @click="edit(scope.row.wmPickingBasketSeatId)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </template>
        </yt-page>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import { mixins } from '@/views/warehouse/dailyOperation/mixins';
export default {
    mixins: [mixins],
    data() {
        const vm = this;
        return {
            tableConfig: [
                { value: 'wmWarehouseName', label: '仓库名称' },
                { value: 'seatModel', label: '篮位编码' },
                { value: 'normName', label: '对应篮子规格' },
                { value: 'valueLength', label: '长' },
                { value: 'valueWidth', label: '宽' },
                { value: 'valueHigh', label: '高' },
                {
                    value: 'activatedFlag',
                    label: '状态',
                    render(h, scope) {
                        if (scope.row.activatedFlag) {
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
                { value: 'createTime', label: '添加时间', width: '200px' },
                { value: 'createUserName', label: '添加人' }
            ],
            searchConfig: [
                {
                    placeholder: '仓库（多选）',
                    value: 'warehouseIds',
                    type: 'multiple',
                    children: []
                },
                {
                    placeholder: '对应篮子规格',
                    value: 'wmPickingBasketNormId',
                    type: 'select',
                    children: []
                },
                {
                    placeholder: '激活状态',
                    value: 'activatedFlag',
                    type: 'select',
                    children: [
                        { label: '激活', value: 1 },
                        { label: '未激活', value: 0 }
                    ]
                },
                {
                    label: '添加时间',
                    value: 'time',
                    type: 'time'
                }
            ],
            btnConfig: [
                {
                    name: '添 加',
                    fn: () => {
                        this.$refs.page.$dialog({
                            visible: true,
                            title: '添加拣货篮位置',
                            confirmButtonText: '确认添加',
                            width: '650px',
                            component: () => import('./addEdit'),
                            fnName: 'add'
                        });
                    }
                },
                {
                    name: '批 量 打 印',
                    type: 'success',
                    disabled: () => {
                        return this.wmPickingBasketSeatIds.length
                            ? false
                            : true;
                    },
                    fn: () => {
                        // if (!this.wmPickingBasketSeatIds.length) {
                        //     return this.$message.warning(
                        //         '请选择需要批量打印的数据'
                        //     );
                        // }
                        const { href } = this.$router.resolve({
                            name: 'pbPrint',
                            query: {
                                title: '批量打印',
                                wmPickingBasketSeatIds: this
                                    .wmPickingBasketSeatIds,
                                type: 'WmPickingBasketSeatPrint'
                            }
                        });
                        window.open(href, '_blank');
                    }
                }
            ],
            wmPickingBasketSeatIds: [],
            wmPickingBasketSeatId: ''
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
                    const { wmPickingBasketSeatId, activatedFlag } = scope;

                    this.$api['warehouse/WmPickingBasketSeatActiveSet']({
                        wmPickingBasketSeatId,
                        activatedFlag: activatedFlag ? 0 : 1
                    }).then(res => {
                        this.coincident(res.msg);
                    });
                })
                .catch(() => {
                    return false;
                });
        },
        searchData(val) {
            let p = {};
            for (let k in val) {
                if (k == 'time' && Array.isArray(val.time) && val.time.length) {
                    let [startTime, endTime] = val.time;
                    p['startTime'] = startTime;
                    p['endTime'] = endTime;
                    continue;
                }
                p[k] = val[k];
            }
            return p;
        },
        selectChange(val) {
            this.wmPickingBasketSeatIds = val.map(i => i.wmPickingBasketSeatId);
        },
        submitForm(val, title) {
            switch (title) {
                case '添加拣货篮位置':
                    this.add(val);
                    break;
                case '编辑拣货篮位置':
                    this.editSave(val);
                    break;
                default:
                    break;
            }
        },
        //edit
        edit(wmPickingBasketSeatId) {
            this.wmPickingBasketSeatId = wmPickingBasketSeatId;
            this.$refs.page.$dialog({
                visible: true,
                title: '编辑拣货篮位置',
                confirmButtonText: '确认编辑',
                width: '650px',
                component: () => import('./addEdit'),
                fnName: 'edit',
                params: wmPickingBasketSeatId
            });
        },
        editSave(val) {
            let params = {
                activatedFlag: val.activatedFlag,
                wmWarehouseId: val.wmWarehouseId,
                wmPickingBasketNormId: val.wmPickingBasketNormId,
                seatModel: '',
                wmPickingBasketSeatId: this.wmPickingBasketSeatId
            };
            if (val.isBatch) {
                params.seatModels = val.generateList;
            } else {
                params.seatModel = val.seatModels;
            }
            this.$api['warehouse/WmPickingBasketSeatUpdate'](params).then(
                res => {
                    this.coincident(res.msg);
                }
            );
        },
        //添加
        add(val) {
            let params = {
                activatedFlag: val.activatedFlag,
                wmWarehouseId: val.wmWarehouseId,
                wmPickingBasketNormId: val.wmPickingBasketNormId,
                seatModels: []
            };
            if (val.isBatch) {
                params.seatModels = val.generateList;
            } else {
                params.seatModels = Array.of(val.seatModels);
            }
            this.$api['warehouse/WmPickingBasketSeatCreate'](params).then(
                res => {
                    this.coincident(res.msg);
                }
            );
        },
        ...mapActions(['getWarehouseList', 'getWmPickingBasketNormList'])
    },
    created() {
        this.getWarehouseList(1).then(data => {
            this.searchConfig[0].children = data;
        });
        this.getWmPickingBasketNormList().then(data => {
            this.searchConfig[1].children = data;
        });
    }
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