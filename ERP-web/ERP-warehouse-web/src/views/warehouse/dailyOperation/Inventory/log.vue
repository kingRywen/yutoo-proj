<template>
    <!-- 操作日志 -->
    <div class="logbox">
        <yt-table :data="list" :columns="columns" :border="true" :selection="false"></yt-table>
        <el-pagination
            style="text-align: right;margin-top:10px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30,50]"
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
            list: [],
            columns: [],
            pageNo: 1,
            pageSize: 10,
            total: 0,
            objInfo: {}
        };
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val;
            this.getLogList(this.objInfo);
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getLogList(this.objInfo);
        },
        getLogList(obj) {
            this.objInfo = { ...obj };
            let { id, url, idName, columns } = obj;
            this.id = id;
            this.url = url;
            this.idName = idName;
            this.columns = [...columns];

            this.$api[url]({
                [idName]: id,
                pageSize: this.pageSize,
                pageNumber: this.pageNo,
                sortOrder: 'asc'
            }).then(res => {
                let { pageNo, pageSize, total, rows } = res;
                this.pageNo = pageNo;
                this.pageSize = pageSize;
                this.total = total;
                this.list = rows;
            });
        }
    }
};
</script>
<style lang="scss">
.logbox {
    height: 560px;
    overflow-y: auto;
}
</style>
