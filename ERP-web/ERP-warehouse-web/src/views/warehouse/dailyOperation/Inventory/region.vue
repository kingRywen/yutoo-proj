<template>
    <!-- 区域 -->
    <div>
        <div class="btnbox">
            <el-button size="mini" type="success" @click="add">添 加</el-button>
            <el-button size="mini" type="danger" @click="del" :disabled="wmLocationIds.length?false:true">删 除</el-button>
        </div>
        <div class="inventory-list">
            <yt-table ref="table" :data="checkedPageList" reserveSelection="wmLocationId" :columns="columns" :border="true" @selectChange="selectChange"></yt-table>
            <ElPagination
                :total="checkedList.length"
                :current-page="checkedListPag.pageNumber"
                :page-size="checkedListPag.pageSize"
                @size-change="handleCheckedListSizeChange"
                @current-change="handleCheckedListCurrentChange"
                layout="total, prev, pager, next"
            ></ElPagination>
        </div>
        <!--  -->
        <el-dialog title="选择库位" :visible.sync="visible" width="600px" :append-to-body="true" @open="kdialogopen">
            <div class="content">
                <search :searchList="searchList" style="margin-bottom:15px;background: #f2f2f2;border-radius: 5px;
    padding: 10px;" @search="search" />
                <!--  -->
                <!-- <el-table :data="list" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="divisionName" label="区域" align="center"></el-table-column>
          <el-table-column prop="locationName" label="库位" align="center"></el-table-column>
          <el-table-column prop="locationNormName" label="规格" align="center"></el-table-column>
                </el-table>-->
                <yt-table :data="list" ref="ktable" :columns="columnsDialog" reserveSelection="wmLocationId" :border="true" @selectChange="handleSelectionChange"></yt-table>

                <!--  -->
                <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNo" :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="addStorehouse">确 定 添 加</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
export default {
    inheritAttrs: false,
    props: {
        lockFlag: {
            default: null
        },
        columns: {
            type: Array,
            default: () => [
                { value: 'divisionName', label: '区域' },
                { value: 'locationName', label: '库位' },
                { value: 'locationNormName', label: '规格' }
            ]
        },
        wmWarehouseIds: Array,
        isWarehouse: Function, //是否选择仓库
        checkedList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        checkedPageList() {
            if (!this.checkedList || !this.checkedList.length) {
                return [];
            }
            const { total, pageSize, pageNumber } = this.checkedListPag;
            return this.checkedList.slice(
                (pageNumber - 1) * pageSize,
                pageNumber * pageSize
            );
        }
    },
    data() {
        return {
            checkedListPag: {
                total: 0,
                pageNumber: 1,
                pageSize: 10
            },
            total: 0,
            pageNo: 1,
            pageSize: 10,
            visible: false,
            columnsDialog: [
                { value: 'divisionName', label: '区域' },
                { value: 'locationName', label: '库位' },
                { value: 'locationNormName', label: '规格' }
            ],
            searchList: [
                {
                    label: '区域：',
                    value: 'wmWarehouseDivisionIds',
                    type: 'multiple',
                    children: [],
                    style: {
                        width: '463px'
                    }
                },
                {
                    label: '行：',
                    value: 'rowStartIndex',
                    type: 'input',
                    style: {
                        width: '70px'
                    }
                },
                {
                    label: '~',
                    value: 'rowEndIndex',
                    type: 'input',
                    style: {
                        width: '70px'
                    }
                },
                {
                    label: '列：',
                    value: 'columnStartIndex',
                    type: 'input',
                    style: {
                        width: '70px'
                    }
                },
                {
                    label: '~',
                    value: 'columnEndIndex',
                    type: 'input',
                    style: {
                        width: '70px'
                    }
                },
                {
                    label: '层：',
                    value: 'floorStartIndex',
                    type: 'input',
                    style: {
                        width: '70px'
                    }
                },
                {
                    label: '~',
                    value: 'floorEndIndex',
                    type: 'input',
                    style: {
                        width: '70px'
                    }
                }
            ],
            list: [],
            wmLocationIds: [],
            checkedregionList: [],
            searchInfo: {}
        };
    },
    methods: {
        handleCheckedListSizeChange(val) {
            this.checkedListPag.pageSize = val;
        },
        handleCheckedListCurrentChange(val) {
            this.checkedListPag.pageNumber = val;
        },
        conversionNumber(val) {
            if (val === '') {
                return null;
            }
            if (Number(val) === NaN) {
                return val;
            }
            return Number(val);
        },
        search(val) {
            for (let k in val) {
                if (k == 'wmWarehouseDivisionIds') {
                    continue;
                }
                val[k] = this.conversionNumber(val[k]);
            }
            this.searchInfo = { ...val };
            this.pageNo = 1;
            this.getStorehouseList('search');
        },
        del() {
            this.$emit('del', this.wmLocationIds);
        },
        clearSelection() {
            this.$refs.table.clearSelection();
        },
        kdialogopen() {
            this.$nextTick(() => {
                this.$refs.ktable.clearSelection();
            });
        },
        add() {
            this.isWarehouse()
                .then(wmWarehouseId => {
                    this.visible = true;
                    this.getDivisionList({
                        wmWarehouseIds: Array.of(wmWarehouseId)
                        // inventoryCount: 0
                    });
                    this.getStorehouseList();
                })
                .catch(() => {
                    return false;
                });
        },
        addStorehouse() {
            if (!this.checkedregionList.length) {
                return this.$message.warning('请选择库位');
            }
            this.$emit(
                'setData',
                [...this.checkedregionList, ...this.checkedList],
                () => {
                    this.visible = false;
                }
            );
        },
        selectChange(val) {
            this.wmLocationIds = val.map(item => item.wmLocationId);
            this.$emit('change', this.wmLocationIds);
        },
        handleSelectionChange(val) {
            this.checkedregionList = val.map(item => item);
        },
        handleSizeChange(val) {},
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getStorehouseList('search');
        },

        //获取库位列表
        getStorehouseList(val) {
            let p = {
                pageNumber: this.pageNo,
                pageSize: this.pageSize,
                wmWarehouseIds: this.wmWarehouseIds,
                wmPickingRobotId: this.$attrs.wmPickingRobotId,
                findType: this.$attrs.wmPickingRobotId != null ? 0 : null,
                lockFlag: this.lockFlag
                // inventoryCount: 0
            };
            if (val == 'search') {
                p = Object.assign({}, p, this.searchInfo);
            }
            this.$api['warehouse/WmLocationGlobalList'](p).then(res => {
                let { pageNo, total, rows, pageSize } = res.page;
                this.total = total;
                this.pageNo = pageNo;
                this.pageSize = pageSize;
                this.list = rows;
            });
        },
        //获取仓库分区列表 =>区域
        getDivisionList(params = {}) {
            this.$api['warehouse/WWarehouseGlobalDivisionList'](params).then(
                res => {
                    this.searchList[0].children = res.list.map(i => {
                        return {
                            label: i.name,
                            value: i.id
                        };
                    });
                }
            );
        }
    }
};
</script>
<style>
.btnbox {
    padding: 10px 0 10px 10px;
    border: 1px solid #ebeef5;
    border-bottom: none;
}
.content {
    min-height: 300px;
    max-height: 560px;
    overflow-y: auto;
}
.pagination {
    text-align: right;
    margin-top: 10px;
}
.inventory-list {
    max-height: 300px;
    overflow-y: auto;
}
</style>

