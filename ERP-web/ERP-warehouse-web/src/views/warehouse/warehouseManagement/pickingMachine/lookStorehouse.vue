<template>
    <div class="lookStorehouse" v-loading="loading" element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading">
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :btnList="btnConfig" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="searchConfig" @search="search"></search>
            </template>
            <template slot="table">
                <yt-table :data="tableList" @selectChange="selsectConscientious" reserveSelection="productId" ref="table" :columns="columns" :border="true"></yt-table>
            </template>
        </universal-layout>
        <!--  -->
        <el-dialog title="选择库位" :visible.sync="visible" width="600px" :append-to-body="true">
            <div class="content" v-loading="Kloading" element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading">
                <search :searchList="searchConfig" style="margin-bottom:15px;background: #f2f2f2;border-radius: 5px;
    padding: 10px;" @search="searchK"/>
                <!--  -->
                <!-- <el-table :data="list" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="divisionName" label="区域" align="center"></el-table-column>
          <el-table-column prop="locationName" label="库位" align="center"></el-table-column>
          <el-table-column prop="locationNormName" label="规格" align="center"></el-table-column>
                </el-table>-->
                <yt-table ref="tablek" :data="list" :columns="columns" reserveSelection="wmLocationId" :border="true" @selectChange="handleSelectionChange"></yt-table>

                <!--  -->
                <el-pagination class="pagination" @current-change="handleCurrentChangeK" :current-page.sync="KpageNo" :page-size="10" layout="total, prev, pager, next" :total="Ktotal"></el-pagination>
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
    data() {
        return {
            KpageNo: 1,
            Ktotal: 0,
            Kloading: false,
            visible: false,
            list: [],
            //
            pageNo: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            tableList: [],
            btnConfig: [
                {
                    name: '添加',
                    fn: () => {
                        this.visible = true;
                        this.getAllowList();
                    }
                },
                {
                    name: '删除',
                    type: 'danger',
                    disabled: () => {
                        return this.selsectCIds.length ? false : true;
                    },
                    fn: () => {
                        // if (this.selsectCIds.length) {
                        this.$confirm(
                            '此操作将永久删除该库位, 是否继续?',
                            '提示',
                            {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }
                        )
                            .then(() => {
                                this.$api[
                                    'warehouse/WmPickingRobotRangeRemove'
                                ]({
                                    wmPickingRobotId: this.wmPickingRobotId,
                                    wmLocationIds: this.selsectCIds
                                }).then(res => {
                                    this.$message.success(res.msg);
                                    this.$refs.table.clearSelection();
                                    this.getList();
                                });
                            })
                            .catch(() => {
                                return false;
                            });
                        // } else {
                        //     this.$message.warning('请选择需要删除的库位');
                        // }
                    }
                }
            ],
            searchConfig: [
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
                        width: '85px'
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
                }
            ],
            columns: [
                { value: 'divisionName', label: '区域' },
                { value: 'locationName', label: '库位' },
                { value: 'locationNormName', label: '规格' }
            ],
            wmPickingRobotId: '',
            searchInfo: {},
            searchInfoK: {},

            wmLocationIds: [],
            selsectCIds: []
        };
    },
    methods: {
        searchK(val) {
            this.KpageNo = 1;
            this.searchInfoK = { ...val };
            this.$refs.table.clearSelection();
            this.getAllowList('search');
        },
        handleSelectionChange(val) {
            this.wmLocationIds = val.map(item => item.wmLocationId);
        },
        addStorehouse() {
            if (this.wmLocationIds.length) {
                this.$api['warehouse/WmPickingRobotRangeSave']({
                    wmPickingRobotId: this.wmPickingRobotId,
                    wmLocationIds: this.wmLocationIds
                }).then(res => {
                    this.$message.success(res.msg);
                    this.visible = false;
                    this.getList();
                });
            } else {
                this.$message.warning('请选择需要添加的库位');
            }
        },
        handleCurrentChangeK(val) {
            this.KpageNo = val;
            this.getAllowList('search');
        },

        //
        selsectConscientious(val) {
            this.selsectCIds = val.map(item => item.wmLocationId);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList('search');
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getList('search');
        },
        search(val) {
            this.searchInfo = { ...val };
            this.pageNo = 1;
            this.$refs.table.clearSelection();
            this.getList('search');
        },
        async getCurrentInfo(obj) {
            this.loading = true;
            this.wmPickingRobotId = obj.wmPickingRobotId;
            await this.getDivisionList({
                wmWarehouseIds: Array.of(obj.wmWarehouseId)
            });
            await this.getList();
        },
        //获取拣货机负责列表
        getAllowList(val) {
            this.Kloading = true;
            let params = {
                pageSize: 10,
                pageNumber: this.KpageNo,
                wmPickingRobotId: this.wmPickingRobotId,
                findType: 0 //1表示只查询拣货机器人负责的库位 值：0表示过滤掉拣货机器人负责的库位
            };
            if (val == 'search') {
                params = Object.assign({}, params, this.searchInfoK);
            }
            this.$api['warehouse/WmLocationGlobalList'](params).then(res => {
                let { pageNo, pageSize, rows, total } = res.page;
                this.list = rows;
                this.KpageNo = pageNo;
                this.Ktotal = total;
            });
            this.Kloading = false;
        },
        //获取拣货机负责列表
        getList(val) {
            this.loading = true;
            let params = {
                pageSize: this.pageSize,
                pageNumber: this.pageNo,
                wmPickingRobotId: this.wmPickingRobotId,
                findType: 1 //1表示只查询拣货机器人负责的库位 值：0表示过滤掉拣货机器人负责的库位
            };
            if (val == 'search') {
                params = Object.assign({}, params, this.searchInfo);
            }
            this.$api['warehouse/WmLocationGlobalList'](params).then(res => {
                let { pageNo, pageSize, rows, total } = res.page;
                this.tableList = rows;
                this.pageNumber = pageNo;
                this.pageSize = pageSize;
                this.total = total;
            });
            this.loading = false;
        },
        //获取仓库分区列表 =>区域
        getDivisionList(params = {}) {
            this.$api['warehouse/WWarehouseGlobalDivisionList'](params).then(
                res => {
                    this.searchConfig[0].children = res.list.map(i => {
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
<style lang="scss">
.lookStorehouse {
    min-height: 480px;
    max-height: 560px;
    overflow-y: auto;
    padding: 0 10px;
    .UniversalLayout {
        position: initial;
    }
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
</style>
