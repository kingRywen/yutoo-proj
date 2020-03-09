<template>
    <!-- 基本信息 -->
    <div class="baseInfo" v-loading="loading" element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading">
        <ul>
            <li v-for="(i,j) in baseInfo" :key="j" class="baseinfo_item">{{ `${i.label}：${i.value || '-'}`}}</li>
        </ul>
        <yt-table :data="baselist" :columns="baseColumns" :border="true" :selection="false"/>
        <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </div>
</template>

<script>
export default {
    data() {
        return {
            baseInfo: [],
            baselist: [],
            baseColumns: [],
            pageSize: 10,
            pageNo: 1,
            total: 0,
            paramsObj: {},
            url: '',
            loading: false
        };
    },
    methods: {
        getInfo(val) {
            this.loading = true;
            let { name, id, type } = val;
            this.setColumns(type);
            let obj = {
                [name]: id
            };
            let url;
            if (type == '盘点') {
                this.inventoryInfo(obj);
                url = 'inventoryPlanArea';
            } else if (type == '移库') {
                this.moveLibraryInfo(obj);
                url = 'movePlanlistProduct';
            }
            this.paramsObj = { ...obj };
            this.url = url;
            this.getInfoList(url, obj);
        },
        setColumns(type) {
            if (type == '盘点') {
                this.baseColumns = [
                    { value: 'area', label: '区域' },
                    { value: 'wmLocationName', label: '库位' },
                    { value: 'specification', label: '规格' }
                ];
            } else if (type == '移库') {
                this.baseColumns = [
                    {
                        value: 'imageBase',
                        label: '主图',
                        img: true,
                        width: 110,
                        style: {
                            width: 50,
                            height: 50
                        }
                    },
                    { value: 'skuCus', label: '自定义sku' },
                    {
                        value: 'wmLocationName',
                        label: '原库位',
                        children: 'originalLocation'
                    },
                    {
                        value: 'wmLocationName',
                        label: '转移库位',
                        children: 'targetLocation'
                    },
                    { value: 'amount', label: '数量' }
                ];
            }
        },
        //列表
        getInfoList(url, params) {
            this.$api['warehouse/' + url]({
                pageSize: this.pageSize,
                pageNumber: this.pageNo,
                ...params
            }).then(res => {
                let { pageSize, pageNo, rows, total } = res;
                this.baselist = rows;
                this.pageSize = pageSize;
                this.pageNo = pageNo;
                this.total = total;
                this.loading = false;
            });
        },
        //移库基本信息
        moveLibraryInfo(params) {
            this.$api['warehouse/movePlanInfo'](params).then(res => {
                const {
                    wmWarehouseName,
                    applicantName,
                    createTime,
                    remark,
                    reason,
                    passFlag
                } = res.rows;
                this.baseInfo = [
                    { label: '选择仓库', value: wmWarehouseName },
                    { label: '申请人', value: applicantName },
                    { label: '申请时间', value: createTime },
                    { label: '备注', value: remark }
                ];
                this.$emit('change', {
                    reason,
                    passFlag: passFlag ? 1 : 0
                });
            });
        },
        //盘点基本信息
        inventoryInfo(params) {
            this.$api['warehouse/inventoryPlanInfo'](params).then(res => {
                const {
                    wmWarehouseName,
                    typeName,
                    applicantName,
                    createTime,
                    scopeName,
                    remark,

                    reason,
                    passFlag
                } = res.rows;
                this.baseInfo = [
                    { label: '选择仓库', value: wmWarehouseName },
                    { label: '盘点类型', value: typeName },
                    { label: '申请人', value: applicantName },
                    { label: '申请时间', value: createTime },
                    { label: '盘点库存范围', value: scopeName },
                    { label: '备注', value: remark }
                ];
                this.$emit('change', {
                    reason,
                    passFlag: passFlag ? 1 : 0
                });
            });
        },
        handleSizeChange(val) {
            this.loading = true;
            this.pageSize = val;
            this.getInfoList(this.url, this.paramsObj);
        },
        handleCurrentChange(val) {
            this.loading = true;
            this.pageNo = val;
            this.getInfoList(this.url, this.paramsObj);
        }
    }
};
</script>
<style lang="scss">
.baseInfo {
    padding: 10px;
    border: 1px solid #ebeef5;
}
.baseinfo_item {
    padding: 10px 0 10px 20px;
    font-size: 15px;
}
.pagination {
    text-align: right;
    margin-top: 10px;
}
</style>

