<template>
    <div class="add-transport-way">
        <simple-table label="运输方式管理">
            <el-row class="mb10">
                <el-col :span="24">
                    <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
                    <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <yt-table :columns="columns" :data="tableData" :border="true" @selectChange="data => selectData = data">
                        <template slot="right">
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-tooltip content="编辑" offset="1" placement="bottom" effect="light">
                                        <el-button class="normal-table-icon" size="mini" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="删除" offset="1" placement="bottom" effect="light">
                                        <el-button class="normal-table-icon" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </template>
                    </yt-table>
                    <section class="pagination">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :page-sizes="[10,30,60,80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                    </section>
                </el-col>
            </el-row>
        </simple-table>

        <yt-dialog :options="options" :events="events">
            <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="110px">
                <el-form-item label="自定义名称:" prop="transportTypeName">
                    <el-input v-model="form.transportTypeName" class="way-normal-input" size="small"></el-input>
                </el-form-item>
                <el-form-item label="运输类型:" prop="transportType">
                    <el-select v-model="form.transportType" @change="changeTransportType" size="small" placeholder="请选择" class="way-normal-input">
                        <el-option v-for="item in transportTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运输方运输方式:" prop="logisticTransportationTypeId">
                    <el-select v-model.number="form.logisticTransportationTypeId" size="small" placeholder="请选择" class="way-normal-input">
                        <el-option v-for="item in logisticTransportationList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="限制物流属性:" prop="logisticTypeIds">
                    <el-select v-model="form.logisticTypeIds" size="small" multiple collapse-tags placeholder="(多选)" class="way-normal-input">
                        <el-option v-for="item in productTypeList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="重货计算方式:" prop="calculationNum">
                    长*宽*高/
                    <el-input v-model="form.calculationNum" size="small" style="width: 278px;margin-left: 6px;"></el-input>
                </el-form-item>
                <el-form-item prop="activateFlag" label="重量尺寸限制:">
                    <el-checkbox :true-label="1" :false-label="0" class="isChecked" v-model="form.weightDemensionLimitFlag">启用</el-checkbox>
                </el-form-item>
                <!-- <div v-if="form.weightDemensionLimitFlag"> -->
                <div v-if="form.weightDemensionLimitFlag">
                    <el-form-item label="尺寸单位:" prop="unit">
                        <el-select v-model="form.unit" size="small" placeholder="请选择" class="way-normal-input">
                            <el-option v-for="item in unitItemTypeList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <ElFormItem label="长:" label-width="80px" prop="length">
                        <el-input v-model="form.length" size="small" class="weight-demen" style="width: 50px"></el-input>
                    </ElFormItem>
                    <ElFormItem label="宽:" label-width="20px" prop="width">
                        <el-input v-model="form.width" size="small" class="weight-demen" style="width: 50px"></el-input>
                    </ElFormItem>
                    <ElFormItem label="高:" label-width="20px" prop="height">
                        <el-input v-model="form.height" size="small" class="weight-demen" style="width: 50px"></el-input>
                    </ElFormItem>
                    <ElFormItem label="周长:" label-width="40px" class="weight-demen" prop="perimeter">
                        <el-input v-model="form.perimeter" size="small" style="width: 50px"></el-input>
                    </ElFormItem>
                    <ElFormItem label="重量:" label-width="40px" class="weight-demen" prop="weight">
                        <el-input v-model="form.weight" size="small" style="width: 50px"></el-input>KG
                    </ElFormItem>
                </div>
                <div></div>
                <el-form-item prop="activateFlag" label-width="90px">
                    <el-checkbox :true-label="1" :false-label="0" class="isChecked" v-model="form.activateFlag">是否激活</el-checkbox>
                </el-form-item>
            </el-form>
        </yt-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    data() {
        let vm = this;
        return {
            pageSize: 10,
            pageNo: 1,
            total: 10,
            logisticTransportationList: [],
            rules: vm.$formValidate([
                {
                    label: '自定义名称',
                    value: 'transportTypeName',
                    maxLen: 40
                },
                {
                    label: '运输类型',
                    value: 'transportType'
                },
                {
                    label: '运输方运输方式',
                    value: 'logisticTransportationTypeId'
                },
                {
                    label: '限制物流属性',
                    value: 'logisticTypeIds'
                },
                {
                    label: '重货计算方式',
                    value: 'calculationNum'
                },
                {
                    label: '单位尺寸',
                    value: 'unit'
                },
                {
                    label: '长',
                    value: 'length',
                    required: false
                },
                {
                    label: '宽',
                    value: 'width',
                    required: false
                },
                {
                    label: '高',
                    value: 'height',
                    required: false
                },
                {
                    label: '周长',
                    value: 'perimeter',
                    required: false
                },
                {
                    label: '重量',
                    value: 'weight',
                    required: false
                }
            ]),
            form: {
                weightDemensionLimitFlag: 0,
                logisticTypeIds: [],
                logisticTransportationTypeId: null,
                length: null,
                height: null,
                perimeter: null,
                weight: null,
                width: null
            },
            columns: [
                {
                    label: '名称',
                    value: 'transportTypeName'
                },
                {
                    label: '运输类型',
                    value: 'transportTypeStr'
                },
                {
                    label: '是否激活',
                    render: vm.$.checkFlag((index, row) => {
                        let logisticTransportTypeId =
                            row.logisticTransportTypeId;
                        let activateFlag = row.activateFlag == 1 ? 0 : 1;
                        this.$api['warehouse/transportTypeActiveSet']({
                            logisticTransportTypeId,
                            activateFlag
                        }).then(() => {
                            vm.getLists();
                        });
                    })
                }
            ],
            tableData: [],
            options: {
                title: '添加运输方式',
                width: '580px',
                visible: false,
                appendToBody: true,
                okBtnText: '确定',
                cancelBtnText: '取消',
                display: true,
                copyText: undefined
            },
            logisticTransportId: null,
            events: {
                open: () => {
                    vm.$nextTick(() => {
                        vm.$refs.form.clearValidate();
                    });
                },
                handleOkClick: () => {
                    let data = JSON.parse(JSON.stringify(vm.form));
                    if (!data.weightDemensionLimitFlag) {
                        delete data.unit;
                        delete data.length;
                        delete data.width;
                        delete data.height;
                        delete data.perimeter;
                        delete data.weight;
                    }
                    data.logisticTransportId = vm.logisticTransportId;
                    data.activateFlag || (data.activateFlag = 0);
                    return vm.$api['warehouse/transportTypeSave'](data)
                        .then(() => {
                            vm.getLists();
                            return Promise.resolve();
                        })
                        .catch(err => {
                            let { msg } = err;
                            vm.$message.error(msg);
                        });
                }
            },
            selectData: []
        };
    },
    created() {
        this.getProductTypeList();
        this.getTransportTypeList();
    },
    computed: {
        ...mapState('logistics', [
            'productTypeList',
            'transportTypeList',
            'unitItemTypeList'
        ])
    },
    methods: {
        ...mapActions('logistics', [
            'getProductTypeList',
            'getTransportTypeList'
        ]),
        changeTransportType(transportType) {
            const _this = this;
            _this.$api['warehouse/transportationTypeList']({
                logisticTransportationId: _this.logisticTransportId,
                transportType
            })
                .then(res => {
                    _this.logisticTransportationList = res.rows.map(i => {
                        return {
                            label: i.transportationTypeName,
                            value: i.logisticTransportationTypeId
                        };
                    });
                })
                .catch(() => {
                    _this.form.logisticTransportationTypeId = '';
                    _this.logisticTransportationList = [];
                });
        },
        getLists(params) {
            let vm = this;
            if (params) {
                vm.logisticTransportId = params.logisticTransportId;
            }
            let obj = {
                pageSize: vm.pageSize,
                pageNumber: vm.pageNo,
                sortOrder: 'asc',
                logisticTransportId: vm.logisticTransportId
            };
            vm.$api['warehouse/transportTypePage'](obj)
                .then(data => {
                    let { rows, pageSize, pageNo, total } = data;
                    vm.tableData = rows;
                    vm.pageSize = pageSize;
                    vm.pageNo = pageNo;
                    vm.total = total;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getLists();
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getLists();
        },
        handleAdd() {
            this.initForm();
            this.options.visible = true;
            this.options.title = '添加运输方式';
        },
        handleDelete(index, row) {
            let vm = this;
            let logisticTransportTypeIdList = [];
            if (row) {
                logisticTransportTypeIdList = [row.logisticTransportTypeId];
            } else {
                logisticTransportTypeIdList = vm.selectData.map(
                    item => item.logisticTransportTypeId
                );
            }
            if (vm.$editMsg(logisticTransportTypeIdList, false)) return;
            vm.$api['warehouse/transportTypeRemove']({
                logisticTransportTypeIdList
            }).then(data => {
                vm.$deleteMsg(data);
                vm.getLists();
            });
        },
        handleEdit(index, row) {
            let vm = this;
            vm.initForm();
            let logisticTransportTypeId = row.logisticTransportTypeId;
            vm.options.visible = true;
            vm.options.title = '编辑运输方式';
            vm.options.is_edit = true;
            vm.$api['warehouse/transportTypeGet']({
                logisticTransportTypeId
            }).then(({ rows }) => {
                vm.form = rows;
                vm.form.logisticTypeIds || (vm.form.logisticTypeIds = []);

                vm.changeTransportType(rows.transportType);
            });
        },
        initForm() {
            this.form = {
                weightDemensionLimitFlag: 0,
                logisticTypeIds: [],
                length: null,
                height: null,
                perimeter: null,
                weight: null,
                width: null
            };
        },
        resetForm() {},
        submitForm(cb) {
            cb && cb(false);
        }
    }
};
</script>

<style lang="scss">
.add-transport-way {
    background: #fff;
    .pagination {
        text-align: right;
        margin-top: 10px;
        // position: absolute;
        // bottom: 10px;
        // left: 0;
        // right: 0;
    }
}
.weight-demen {
    .el-input__inner {
        padding: 0 !important;
        text-align: center;
    }
}
.way-normal-input {
    width: 350px;
}
</style>
