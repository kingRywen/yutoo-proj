<template lang="html">
    <section class="record">
        <div class="select">
            <el-form :inline="true" :model="selectForm" class="demo-form-inline selectform" size='medium'>
                <el-form-item label="导入时间：">
                    <el-date-picker v-model="selectForm.beforeTime"  type="datetime"  placeholder="选择日期时间" align="right"/>
                </el-form-item>
                <el-form-item label="~">
                    <el-date-picker v-model="selectForm.afterTime"  type="datetime"  placeholder="选择日期时间" align="right"/>
                </el-form-item>
                <el-form-item label="导入人员：">
                      <el-input v-model="selectForm.name" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitSelect">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button class="downloadBtn" type="primary" @click="downloadAll()" size='medium'>下载</el-button>
        <el-table :data="recordList" style="width: 100%;margin-top:15px;" @selection-change="handleSelect" border>
            <el-table-column type="selection" width="55" align='center'/>
            <el-table-column prop="time" label="导入时间" width="260" align='center'/>
            <el-table-column prop="state" label="上传状态" align='center'>
                <template slot-scope="scope">
                    <p>
                        <span>上传完成    提交总数量：200</span>
                    </p>
                    <p>
                        <span>成功 200</span>
                        <span>失败 100</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="导入人员" width="180" align='center'/>
            <el-table-column label="下载处理报告" width="180" align='center'>
                <template slot-scope="scope">
                    <el-button type="text" @click='download(scope.row)'>下载</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagination"  :page-size="1" layout="prev, pager, next, jumper" :total="10"/>
    </section>
</template>

<script>
export default {
    data() {
        return {
            selectForm: {
                beforeTime: '',
                afterTime: '',
                name: '',
            },
            recordList:[
                {time:'123456',state:'1',name:999},
            ] //记录table
        }
    },
    methods: {
        //搜索
        onSubmitSelect() {
            console.log('Submit')
        },
        // 下载all
        downloadAll() {
            alert('下载')
        },
        // 当个下载
        download(obj) {
            console.log(obj)
        },
        //勾选的
        handleSelect(val) {
            console.log(val)
        }
    }

}
</script>

<style lang="scss">
.select {
    background-color: rgba(242, 242, 242, 1);
    border-radius: 5px;
    position: relative;
    .selectform {
        padding: 12px;
        .el-form-item {
            margin-bottom: 0;
        }
    }
}
.downloadBtn {
    margin-top: 15px;
    width: 83px;
}
.pagination{
    position: absolute;
    bottom: 35px;
    right: 35px;
}
</style>
