<template>
    <!-- 查看详情 -->
    <div>
        <el-tabs type="card" class="infotabs" @tab-click="tabsHandleClick" v-model="currentTabs">
            <el-tab-pane label="基本信息" name="first">
                <base-info ref="baseInfo"/>
            </el-tab-pane>
            <el-tab-pane :label="currentTypelistObj.type == '盘点'?'盘点记录':'移库记录'" name="second">
                <universal-layout
                    v-loading="loading"
                    element-loading-text="数据加载中..."
                    element-loading-spinner="el-icon-loading"
                    class="recordBox"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :btnList="btnList"
                    :pageNo="pageNo"
                    :pageSize="pageSize"
                    :total="total"
                >
                    <template slot="search">
                        <search :searchList="searchList" @search="search"></search>
                    </template>
                    <template slot="table">
                        <yt-table :data="tableList" ref="table" :columns="columns" :selection="selection" @selectChange="selectChange" :border="true"></yt-table>
                    </template>
                </universal-layout>
            </el-tab-pane>
        </el-tabs>
        <!--  -->
        <el-dialog title="问题库存" :visible.sync="issueVisible" width="580px" :append-to-body="true">
            <div class="issueBox">
                <yt-table :data="issueList" ref="table" :columns="issueColumns" :border="true" :selection="false"></yt-table>
                <el-pagination
                    class="pagination"
                    @size-change="handleSizeChangeissue"
                    @current-change="handleCurrentChangeissue"
                    :current-page="issuePageNo"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="issuePageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="issueTotal"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { downloadFile } from 'Utils/tools'
import baseInfo from './baseInfo';
export default {
    components: {
        baseInfo
    },
    data() {
        return {
            loading: false,
            pageNo: 1,
            pageSize: 10,
            total: 0,

            issuePageNo: 1,
            issuePageSize: 10,
            issueTotal: 0,
            btnList: [],
            searchList: [],
            columns: [],
            tableList: [],
            issueList: [],
            issueColumns: [
                { value: 'uniqueLabel', label: '问题仓库sku' },
                { value: 'issueTypeName', label: '问题类型' }
            ],
            currentTabs: 'first',
            currentTypelistObj: {}, // 当前类型的的对象,
            issueVisible: false,
            wmInventoryPlanRecordId: '',
            wmInventoryPlanIds: [],
            searchInfo: {},
            selection: false
        };
    },
    computed: {
        isType() {
            if (this.currentTypelistObj.type == '盘点') {
                return true;
            } else if (this.currentTypelistObj.type == '移库') {
                return false;
            }
        }
    },
    methods: {
        tabsHandleClick(tab) {
            if (tab.name == 'second') {
                this.loading = true;
                //获取盘点记录 、、或者移库计划
                console.log(this.currentTypelistObj);
                let obj = {
                    [this.currentTypelistObj.name]: this.currentTypelistObj.id
                };
                let url = '';
                if (this.currentTypelistObj.type == '盘点') {
                    url = 'inventoryPlanLog';
                    this.selection = true;
                    this.columns = [
                        { value: 'wmWarehouseName', label: '仓库' },
                        { value: 'wmLocationName', label: '库位' },
                        { value: 'skuCus', label: '产品sku', width: '180px' },
                        { value: 'nameCh', label: '名称' },
                        { value: 'wmInventoryPlanType', label: '盘点类型' },
                        {
                            value: 'repertoryOriginalAmount',
                            label: '原有库存数'
                        },
                        {
                            value: 'finalInventoryAmount',
                            label: '最终盘点数量'
                        },
                        {
                            value: 'issueAmount',
                            label: '问题数量',
                            width: 90,
                            render: (h, scope) => {
                                return (
                                    <el-button
                                        type="text"
                                        onClick={this.issue.bind(
                                            this,
                                            scope.row.wmInventoryPlanRecordId
                                        )}
                                    >
                                        {scope.row.issueAmount}
                                    </el-button>
                                );
                            }
                        },
                        { value: 'inventoryTime', label: '盘点时间' },
                        { value: 'operator', label: '盘点人' }
                    ];
                    this.searchList = [
                        {
                            label: '盘点时间',
                            value: 'time',
                            type: 'time'
                        }
                    ];
                    this.btnList = [
                        {
                            name: '下载盘点报告',
                            fn: () => {
                                if (!this.wmInventoryPlanIds.length) {
                                    return this.$message.warning(
                                        '请选择需要下载的数据'
                                    );
                                }
                                this.$api['warehouse/inventoryPlanReport']({
                                    wmInventoryPlanIds: this.wmInventoryPlanIds
                                }).then(res => {
                                    // window.location.href = res.rows.path;
                                    downloadFile(res.rows.path)
                                });
                            }
                        }
                    ];
                } else if (this.currentTypelistObj.type == '移库') {
                    url = 'movePlanLog';
                    this.selection = false;
                    this.searchList = [
                        {
                            label: '移库时间',
                            value: 'time',
                            type: 'time'
                        }
                    ];
                    this.columns = [
                        {
                            value: 'image',
                            label: '主图',
                            img: true,
                            width: 110,
                            style: {
                                width: 50,
                                height: 50
                            }
                        },
                        { value: 'skuCus', label: '自定义sku' },
                        { value: 'nameCh', label: '名称' },
                        { value: 'wmLocationOriginalName', label: '原库位' },
                        { value: 'stockOutAmount', label: '出库数量' },
                        { value: 'wmLocationIdNewName', label: '新库位' },
                        { value: 'stockInAmount', label: '入库数量' },
                        { value: 'moveTime', label: '移库时间' },
                        { value: 'operatorName', label: '移库人' }
                    ];
                    this.btnList = [];
                }
                this.getList(url, obj);
            }
        },
        //获取table 列表数据  =>盘点记录/移库记录
        getList(url, params) {
            let np = {
                pageSize: this.pageSize,
                pageNumber: this.pageNo,
                ...params
            };
            this.$api['warehouse/' + url](np).then(res => {
                let { pageNo, pageSize, total, rows } = res;
                this.pageNo = pageNo;
                this.pageSize = pageSize;
                this.total = total;
                this.tableList = rows;
                this.loading = false;
            });
        },
        getInfo(val) {
            this.currentTypelistObj = { ...val };
            this.$refs.baseInfo.getInfo(val);
        },
        handleSizeChangeissue(val) {
            this.issuePageSize = val;
            this.issue(this.wmInventoryPlanRecordId);
        },
        handleCurrentChangeissue(val) {
            this.issuePageNo = val;
            this.issue(this.wmInventoryPlanRecordId);
        },
        //问题数量
        issue(wmInventoryPlanRecordId) {
            this.wmInventoryPlanRecordId = wmInventoryPlanRecordId;
            this.issueVisible = true;
            let params = {
                pageSize: this.issuePageSize,
                pageNumber: this.issuePageNo,
                wmInventoryPlanRecordId
            };
            this.$api['warehouse/inventoryPlanLogIssue'](params).then(res => {
                let { pageNo, pageSize, total, rows } = res;
                this.issuePageNo = pageNo;
                this.issuePageSize = pageSize;
                this.issueTotal = total;
                this.issueList = rows;
            });
        },
        selectChange(val) {
            this.wmInventoryPlanIds = val.map(item => item.wmInventoryPlanId);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentRequest();
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.currentRequest();
        },
        search(val) {
            this.pageNo = 1;
            this.searchInfo = val;
            this.currentRequest();
        },
        //判断当前请求是判断还是移库 获取列表
        currentRequest() {
            this.loading = true;
            let url = '';
            let val = this.searchInfo;
            let params = {
                [this.currentTypelistObj.name]: this.currentTypelistObj.id
            };
            if (this.currentTypelistObj.type == '盘点') {
                url = 'inventoryPlanLog';
                if (
                    val.time != null &&
                    Array.isArray(val.time) &&
                    val.time.length
                ) {
                    let [inventoryTimeStart, inventoryTimeEnd] = val.time;
                    params['inventoryTimeStart'] = inventoryTimeStart;
                    params['inventoryTimeEnd'] = inventoryTimeEnd;
                }
            } else if (this.currentTypelistObj.type == '移库') {
                url = 'movePlanLog';
                if (
                    val.time != null &&
                    Array.isArray(val.time) &&
                    val.time.length
                ) {
                    let [moveTimeStart, moveTimeEnd] = val.time;
                    params['moveTimeStart'] = moveTimeStart;
                    params['moveTimeEnd'] = moveTimeEnd;
                }
            }
            this.getList(url, params);
        },
        resetForm() {}
    }
};
</script>
<style lang="scss">
.infotabs {
    min-height: 580px;
    .recordBox {
        position: inherit;
    }
}
.issueBox {
    min-height: 200px;
    max-height: 480px;
    overflow-y: auto;
}
.pagination {
    text-align: right;
    margin-top: 10px;
}
</style>