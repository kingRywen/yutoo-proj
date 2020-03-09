<template>
    <div>
        <el-form :inline="true" :model="form" size="small">
            <el-form-item label="操作时间:">
                <el-date-picker clearable v-model="form.time" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="操作内容:">
                <el-input v-model="form.content" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
        <yt-table :data="logList" :columns="columns" border :selection="false"></yt-table>
        <el-pagination
            style="text-align: right;
             margin-top: 15px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[20, 40, 80, 120]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        modelLogType: Number
    },
    data() {
        return {
            logList: [],
            columns: [
                {
                    label: '操作时间',
                    value: 'operationalTime',
                    width: 250,
                    align: 'center'
                },
                {
                    label: '操作人',
                    value: 'userName',
                    width: 250,
                    align: 'center'
                },
                {
                    label: '操作内容',
                    value: 'content',
                    align: 'center'
                }
            ],
            total: 100,
            pageSize: 10,
            pageNo: 1,
            form: {
                time: [],
                content: ''
            }
        };
    },
    methods: {
        search() {
            this.pageNo = 1;
            this.getLog('search');
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getLog('search');
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getLog('search');
        },
        getLog(isSearch) {
            let params = {
                modelLogType: this.modelLogType,
                pageSize: this.pageSize,
                pageNumber: this.pageNo
            };
            if (isSearch == 'search') {
                if (this.form.content !== '') {
                    params['content'] = this.form.content;
                }
                if (Array.isArray(this.form.time) && this.form.time.length) {
                    params['startDate'] = this.form.time[0];
                    params['endDate'] = this.form.time[1];
                }
            }
            this.$api['product/productGlobalLog'](params).then(res => {
                const { pageNo, pageSize, rows, total } = res;
                this.pageNo = pageNo;
                this.pageSize = pageSize;
                this.total = total;
                this.logList = rows;
            });
        }
    },
    mounted() {
        this.getLog();
    }
};
</script>