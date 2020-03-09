<template>
    <!-- 黑白名单用户 -->
    <div class>
        <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :pageNo="pageNo" :pageSize="pageSize" :total="total">
            <template slot="search">
                <search :searchList="type==0?searchList:searchList1" @search="search"></search>
            </template>
            <template slot="allbtn">
                <div style="width: 100%;display: flex;">
                    <el-button size="small" type="primary" @click="add" style="height:32px;">添 加</el-button>
                    <el-button size="small" type="primary" @click="addDel" style="margin-right:10px;height:32px;">批量删除</el-button>

                    <el-upload
                        class="uploadBtn"
                        :action="url"
                        ref="upload"
                        :with-credentials="true"
                        :headers="headers"
                        :data="file"
                        multiple
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :file-list="fileList"
                    >
                        <el-button size="small" type="primary">批量导入</el-button>
                    </el-upload>
                </div>
            </template>
            <template slot="table">
                <yt-table :data="tableList" :columns="columns" :border="true" @handleSelectionChange="handleSelectionChange">
                    <el-table-column type="index" label="编号" width="100" align="center" slot="left"/>
                    <el-table-column label="操作" width="130" align="center" slot="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="edit(scope.row.blacklistId)">编 辑</el-button>
                            <el-button type="text" @click="isDel(scope.row.blacklistId)">删 除</el-button>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
        </universal-layout>

        <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="600px" center>
            <addEditUser ref="addEditUser" @save="save" :info="formInfo" :type="type"/>
            <span slot="footer">
                <el-button @click="resetForm()">取 消</el-button>
                <el-button type="primary" @click="submitForm()">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import addEditUser from '../addEditUser/index.vue';
import storage from 'Utils/saver';
import { CONST_PORT_CONFIG } from '@/config/index';

export default {
    props: {
        type: [String, Number] //0 黑名单 1白名单
    },
    data() {
        let arr = [
            {
                label: '邮箱',
                value: 'email',
                type: 'input'
            },
            {
                label: '来源订单号',
                value: 'orderNumber',
                type: 'input'
            },
            {
                label: '电话',
                value: 'phone',
                type: 'input'
            },
            {
                label: '地址',
                value: 'address',
                type: 'input'
            },
            {
                label: '拉黑理由',
                value: 'reason',
                type: 'input'
            }
        ];
        let arr1 = [
            {
                label: '邮箱',
                value: 'email',
                type: 'input'
            },
            {
                label: '来源订单号',
                value: 'orderNumber',
                type: 'input'
            },
            {
                label: '电话',
                value: 'phone',
                type: 'input'
            },
            {
                label: '地址',
                value: 'address',
                type: 'input'
            }
        ];

        return {
            searchList: arr,
            searchList1: arr1,
            tableList: [],
            columns: [
                {
                    value: 'email',
                    label: '邮箱'
                },
                {
                    value: 'address',
                    label: '地址'
                },
                {
                    value: 'ip',
                    label: 'IP'
                },
                {
                    value: 'phone',
                    label: '电话'
                },
                {
                    value: 'cardNumber',
                    label: '卡号'
                },
                {
                    value: 'orderNumber',
                    label: '来源订单'
                },
                {
                    value: 'reason',
                    label: '理由'
                },
                {
                    label: '添加时间/添加人',
                    multi: ['creaotrName', 'createTime']
                },
                {
                    label: '修改时间/修改人',
                    multi: ['modifyTime', 'modifyName']
                }
            ],
            pageNo: 1,
            pageSize: 10,
            total: 0,
            dialog: {
                title: null,
                visible: false
            },
            searchInfo: {},
            blacklistIds: [],
            formInfo: {},
            blacklistId: null,
            url: CONST_PORT_CONFIG.ORDER_URL + '/blacklist/batch/import',
            file: {},
            headers: {
                token: storage.get('local', 'token')
            },
            fileList: []
        };
    },
    methods: {
        clearFiles() {
            this.$refs.upload.clearFiles();
        },
        uploadError(err, file, fileList) {
            console.log(err);
        },
        uploadSuccess(response, file, fileList) {
            if (response.code == 0) {
                this.getList();
                this.$message.success(response.msg);
            } else {
                this.$message.error(response.msg);
            }
        },
        beforeUpload(file) {
            this.file['type'] = this.type;
        },
        addDel() {
            if (this.blacklistIds.length) {
                this.del({ blacklistIds: this.blacklistIds });
            } else {
                this.$message.warning('请选择需要批量删除的数据');
            }
        },
        add() {
            this.dialog.title = '添加';
            this.dialog.visible = true;
        },
        edit(blacklistId) {
            this.dialog.title = '编辑';
            this.dialog.visible = true;
            this.blacklistId = blacklistId;
            this.http('blacklistInfo', { blacklistId }, res => {
                this.formInfo = res.rows;
            });
        },
        isDel(blacklistId) {
            this.$confirm('确认删除吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        blacklistIds: Array.of(blacklistId)
                    };
                    this.del(params);
                })
                .catch(() => {
                    return false;
                });
        },
        del(params) {
            this.http('blacklistRemove', params, res => {
                this.$message.success(res.msg);
                this.getList();
            });
        },
        handleSelectionChange(val) {
            this.blacklistIds = val.map(item => item.blacklistId);
        },
        search(val) {
            this.searchInfo = val;
            this.getList('search');
        },
        getList(val) {
            let params = {
                sortOrder: 'asc',
                pageSize: this.pageSize,
                pageNumber: this.pageNo,
                type: this.type
            };
            if (val == 'search') {
                let obj = { ...this.searchInfo };
                let data = {};
                for (let k in obj) {
                    if (obj[k]) data[k] = obj[k];
                }
                params = Object.assign({}, params, data);
            }
            this.http('blacklistList', params, res => {
                this.pageSize = res.pageSize;
                this.pageNo = res.pageNo;
                this.total = res.total;
                this.tableList = res.rows;
            });
        },
        save(data) {
            let params = Object.assign({}, data, {
                type: this.type
            });
            let url;
            if (this.dialog.title == '添加') {
                url = 'blacklistSave';
            } else {
                url = 'blacklistUpdate';
                params = Object.assign({}, params, {
                    blacklistId: this.blacklistId
                });
            }
            this.http(url, params, res => {
                this.$message.success(res.msg);
                this.resetForm();
                this.getList();
            });
        },
        resetForm() {
            this.$refs.addEditUser.resetForm();
            this.dialog.visible = false;
        },
        submitForm() {
            this.$refs.addEditUser.submitForm();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList('search');
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getList('search');
        },
        http(url, params, callback) {
            this.$api[`order/${url}`](params)
                .then(res => {
                    callback && callback(res);
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        }
    },
    components: {
        addEditUser
    }
};
</script>

<style lang="scss">
.uploadBtn {
    display: flex;
    width: 100%;
}
</style>
