<template lang="html">
    <div class="toSellStrategy">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item>跟卖策略管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--  -->
        <div class="toSellStrategy-content">
            <!--  -->
            <el-form :inline="true" size="small">
                <div class="search">
                    <el-form-item>
                      <el-input v-model.trim="name" placeholder="输入规则名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSearch" icon="el-icon-search">搜 索</el-button>
                    </el-form-item>

                    <!-- <el-form-item>
                        <el-button type="primary" @click="reverse">逆推</el-button>
                    </el-form-item> -->

                </div>
                <div class="mar10">
                    <el-form-item>
                      <el-button type="primary" icon="el-icon-plus"  @click="add('新增规则')">新 增 规 则</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="danger"  icon="el-icon-delete" :disabled="!selectionChangeIds.length" @click="alldel">批 量 删 除</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <!--  -->
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                style="width:100%;"
                @selection-change="handleSelectionChange"
                :data="list" border height="620px">
                <el-table-column  type="selection"  width="55" align="center"></el-table-column>
                <template v-for="(item,index) in columns">
                    <el-table-column :label="item.label"  :width="item.width" :key="index" align="center">
                        <template slot-scope="scope">
                            <span v-if="item.boole">{{ scope.row[item.value] ?'是':'否' }}</span>
                            <span v-else>{{ scope.row[item.value]}}</span>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="规则有效期" align="center" width="400">
                    <template slot-scope="scope">{{scope.row.validTimeStart || '-'}} 至 {{scope.row.validTimeEnd || '-'}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
    <el-button type="text" @click="edit('编辑规则',scope.row.sellRuleId)">编辑</el-button>
    <el-button type="text" @click="del(scope.row.sellRuleId)">删除</el-button>
</template>
                </el-table-column>
            </el-table>
            <!--   -->
            <el-pagination
                style="text-align: right;margin-top: 20px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="paginationInfo.currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="paginationInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="paginationInfo.total">
            </el-pagination>
        </div>
        <!--  -->
        <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.visible"
            top="8vh"
            width="1000px">
            <!--  -->
            <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px">
                <el-form-item label="规则名称" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="有效时间" prop="time">
                    <el-date-picker
                        v-model="dialogForm.time"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="选择时区" prop="timezone">
                    <el-select v-model="dialogForm.timezone">
                        <el-option :label="item.value" :value="item.key" v-for="item in areaList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上下架时间">
                        <el-button plain type="primary" size="small" @click="handleAllTrackingTime()">批量设置上下架时间</el-button>
                        <el-button plain type="primary" size="small" @click="addTrackingTime()">添 加</el-button>
                        <el-button plain type="primary" size="small" @click="delTrackingTime()">删 除</el-button>
                        <el-table :data="dialogForm.ruleDetails" style="width: 100%" border class="table" @selection-change="handleSelectionChangeTime">
                            <el-table-column  type="selection"  width="55" align="center"></el-table-column>
                            <template v-for="(item,index) in dialog.columns">
    <!--  -->
    <el-table-column :label="item.label" align="center">
        <template slot-scope="scope">
            <el-time-select
                @change="putawayChangeTime(dialogForm.ruleDetails[scope.$index][item.startvalue],scope.$index,item.startvalue)"
                style="margin-bottom:10px;width: auto"
                size="mini"
                placeholder="上架时间"
                v-model="dialogForm.ruleDetails[scope.$index][item.startvalue]"
                :picker-options="{
                                              start: scope.$index == 0 ? '01:00' : dialogForm.ruleDetails[scope.$index-1][item.endvalue],
                                              end: '24:00',
                                              step: '00:60'
                                            }"
            ></el-time-select>
            <el-time-select
                @change="soldoutChangeTime(dialogForm.ruleDetails[scope.$index][item.endvalue],scope.$index,item.startvalue)"
                style="width: auto"
                size="mini"
                placeholder="下架时间"
                v-model="dialogForm.ruleDetails[scope.$index][item.endvalue]"
                :picker-options="{
                                              start: '01:00',
                                              end: '24:00',
                                              step: '00:60',
                                              minTime: dialogForm.ruleDetails[scope.$index][item.startvalue]
                                            }"
            ></el-time-select>
        </template>
    </el-table-column>
</template>
                        </el-table>
                        <p class="hintcolor" v-show="hint">请选择上下架时间</p>
                </el-form-item>
                <!--  -->
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="dialogForm.remark" class="textarea"></el-input>
                </el-form-item>
                <el-form-item label="是否激活">
                    <el-switch v-model="dialogForm.activateFlag"></el-switch>
                </el-form-item>
            </el-form>
            <!--  -->
            <span slot="footer">
                <el-button
                    type="primary"
                    @click="save('dialogForm')"
                    :loading="dialog.loading"
                    class="save">保 存
                </el-button>
            </span>
        </el-dialog>
        <!--  -->
        <el-dialog title="批量设置上下架时间" :visible.sync="dialog.resetVisible">
          <el-form>
            <el-form-item label="上架时间">
                <el-time-select
                    @change="resetPutaway"
                    v-model="dialogForm.allstartTime"
                    :picker-options="{
                      start: '01:00',
                      step: '00:60',
                      end: '24:00'
                    }">
                </el-time-select>
            </el-form-item>
            <el-form-item label="下架时间">
                <el-time-select
                    @change="resetSoldout"
                    v-model="dialogForm.allendTime"
                    :picker-options="{
                      start: dialogForm.allstartTime?dialogForm.allstartTime:'01:00',
                      step: '00:60',
                      end: '24:00',
                      /* minTime: dialogForm.allendTime */
                    }">
                </el-time-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog.resetVisible = false">取 消</el-button>
            <el-button type="primary" @click="reserAllTime">确 定</el-button>
          </div>
        </el-dialog>
        <!--  -->
        





    </div>
</template>

<script>
import { getData } from 'common/http';
//查询对应的key
function getHomologousKey(key) {
    if (!key) return;
    if (key == 'mondayStartTime') return 'mondayEndTime';
    if (key == 'mondayEndTime') return 'mondayStartTime';
    if (key == 'tuesdayStartTime') return 'tuesdayEndTime';
    if (key == 'tuesdayEndTime') return 'tuesdayStartTime';
    if (key == 'wednesdayStartTime') return 'wednesdayEndTime';
    if (key == 'wednesdayEndTime') return 'wednesdayStartTime';
    if (key == 'thursdayStartTime') return 'thursdayEndTime';
    if (key == 'thursdayEndTime') return 'thursdayStartTime';
    if (key == 'fridayStartTime') return 'fridayEndTime';
    if (key == 'fridayEndTime') return 'fridayStartTime';
    if (key == 'saturdayStartTime') return 'saturdayEndTime';
    if (key == 'saturdayEndTime') return 'saturdayStartTime';
    if (key == 'sundayStartTime') return 'sundayEndTime';
    if (key == 'sundayEndTime') return 'sundayStartTime';
}
class CreateTimeObj {
    constructor(id = 1) {
        (this.mondayStartTime = ''),
            (this.mondayEndTime = ''),
            (this.tuesdayStartTime = ''),
            (this.tuesdayEndTime = ''),
            (this.wednesdayStartTime = ''),
            (this.wednesdayEndTime = ''),
            (this.thursdayStartTime = ''),
            (this.thursdayEndTime = ''),
            (this.fridayStartTime = ''),
            (this.fridayEndTime = ''),
            (this.saturdayStartTime = ''),
            (this.saturdayEndTime = ''),
            (this.sundayStartTime = ''),
            (this.sundayEndTime = ''),
            (this.id = id);
    }
}

export default {
    data() {
        return {
            // reverseDialog:true,

            name: null,
            selectTrackingTime: [],
            list: [],
            areaList: [],
            hint: false,
            loading: true,
            selectionChangeIds: [],
            sellRuleId: null,
            columns: [
                { label: '规则名称', width: '', value: 'name' },
                {
                    label: '是否激活',
                    width: '100px',
                    value: 'activateFlag',
                    boole: true
                },
                { label: '添加时间', width: '180px', value: 'createTime' },
                { label: '备注', width: '', value: 'remark' }
            ],
            dialog: {
                title: '',
                visible: false,
                loading: false,
                columns: [
                    {
                        label: '星期一',
                        startvalue: 'mondayStartTime',
                        endvalue: 'mondayEndTime'
                    },
                    {
                        label: '星期二',
                        startvalue: 'tuesdayStartTime',
                        endvalue: 'tuesdayEndTime'
                    },
                    {
                        label: '星期三',
                        startvalue: 'wednesdayStartTime',
                        endvalue: 'wednesdayEndTime'
                    },
                    {
                        label: '星期四',
                        startvalue: 'thursdayStartTime',
                        endvalue: 'thursdayEndTime'
                    },
                    {
                        label: '星期五',
                        startvalue: 'fridayStartTime',
                        endvalue: 'fridayEndTime'
                    },
                    {
                        label: '星期六',
                        startvalue: 'saturdayStartTime',
                        endvalue: 'saturdayEndTime'
                    },
                    {
                        label: '星期日',
                        startvalue: 'sundayStartTime',
                        endvalue: 'sundayEndTime'
                    }
                ],
                resetVisible: false,
                soldoutChangeValue: null, //下架时间
                resetSoldoutValue: null //批量设置下架时间改变时
            },
            dialogForm: {
                name: '',
                time: [], //validTimeStart  //validTimeEnd
                timezone: '',
                remark: '',
                activateFlag: false,
                ruleDetails: [new CreateTimeObj()],
                allstartTime: '',
                allendTime: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入规则名称',
                        trigger: 'blur'
                    }
                ],
                time: [
                    {
                        required: true,
                        message: '请选择有效时间',
                        trigger: 'change'
                    }
                ],
                timezone: [
                    { required: true, message: '请选择时区', trigger: 'change' }
                ]
            },
            paginationInfo: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    computed: {
        //判断最后一个对象是否填写
        isFillIn() {
            let length = this.dialogForm.ruleDetails.length;
            let obj = this.dialogForm.ruleDetails[length - 1];
            let status = false;
            for (let key in obj) {
                if (key == 'id') continue;
                let homologousKey = getHomologousKey(key);
                if (obj[key] && obj[homologousKey]) {
                    status = true;
                    break;
                }
            }
            return status;
        }
    },
    mounted() {
        this.getList();
    },
    components: {},
    methods: {
        //打开弹框
        reverse() {
            this.reverseDialog = true;
        },
        submitForm() {
            this.$refs.a.submit();
        },

        //搜索
        onSearch() {
            this.getList('search');
        },
        //添加
        add(title) {
            this.empty();
            this.handleStatus(true, title);
        },
        //编辑
        edit(title, sellRuleId) {
            this.handleStatus(true, title);
            this.sellRuleId = sellRuleId;
            this.http('sell/rule/info', { sellRuleId }, data => {
                let ruleInfo = { ...data.data.rows };
                this.dialogForm.name = ruleInfo.name;
                this.dialogForm.time = [
                    ruleInfo.validTimeStart,
                    ruleInfo.validTimeEnd
                ];
                this.dialogForm.timezone = ruleInfo.timezone;
                this.dialogForm.remark = ruleInfo.remark;
                this.dialogForm.activateFlag = ruleInfo.activateFlag
                    ? true
                    : false;
                if (
                    ruleInfo.ruleDetails instanceof Array &&
                    ruleInfo.ruleDetails.length
                ) {
                    this.dialogForm.ruleDetails = [];
                    ruleInfo.ruleDetails.forEach((item, index) => {
                        this.dialogForm.ruleDetails.push(
                            new CreateTimeObj(index + 1)
                        );
                        for (let k in this.dialogForm.ruleDetails[index]) {
                            for (let j in item) {
                                if (k == j) {
                                    this.dialogForm.ruleDetails[index][k] =
                                        item[j];
                                }
                            }
                        }
                    });
                }
            });
        },
        //保存
        save(formName) {
            // this.dialog.visible = false
            this.$refs[formName].validate(valid => {
                if (valid && this.isFillIn) {
                    this.dialog.loading = true;
                    let params = Object.assign({}, this.dialogForm);
                    params['validTimeStart'] = params.time[0];
                    params['validTimeEnd'] = params.time[1];
                    params.activateFlag = params.activateFlag ? 1 : 0;
                    if (this.dialog.title == '新增规则') {
                        this.http('sell/rule/save', params, data => {
                            this.hintMsg(data.data.msg);
                            this.dialog.visible = false;
                            this.getList();
                        });
                    } else {
                        params['sellRuleId'] = this.sellRuleId;
                        this.http('sell/rule/update', params, data => {
                            this.hintMsg(data.data.msg);
                            this.dialog.visible = false;
                            this.getList();
                        });
                    }
                } else {
                    this.hint = true;
                    return false;
                }
            });
        },
        //删除
        isDel(params) {
            this.http('sell/rule/remove', params, data => {
                this.hintMsg(data.data.msg);
                this.getList();
            });
        },
        //批量删除
        alldel() {
            if (this.selectionChangeIds.length) {
                this.isDel({ sellRuleIds: this.selectionChangeIds });
            } else {
                this.hintMsg('请选择要批量删除的规则', 'warning');
            }
        },
        //单个删除
        del(sellRuleId) {
            this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.isDel({ sellRuleIds: Array.of(sellRuleId) });
                })
                .catch(() => {
                    return false;
                });
        },
        //勾选
        handleSelectionChange(val) {
            this.selectionChangeIds = val.map(item => item.sellRuleId);
        },
        //添加跟卖时间
        addTrackingTime() {
            let length = this.dialogForm.ruleDetails.length;
            let id = length
                ? this.dialogForm.ruleDetails[length - 1]['id'] + 1
                : 1;
            let trackingObj = new CreateTimeObj(id);
            if (length) {
                const status = this.isFillIn;
                if (status) {
                    this.dialogForm.ruleDetails.push(trackingObj);
                } else {
                    this.hintMsg('必须选择一条跟卖时间才可添加', 'warning');
                }
            } else {
                this.dialogForm.ruleDetails.push(trackingObj);
            }
        },
        //删除跟卖时间
        delTrackingTime() {
            if (this.selectTrackingTime.length) {
                this.dialogForm.ruleDetails.forEach((i, index) => {
                    if (this.selectTrackingTime.find(j => j.id == i.id)) {
                        this.dialogForm.ruleDetails.splice(index, 1);
                    }
                });
            } else {
                this.hintMsg('请选择需要删除的跟卖时间', 'warning');
            }
        },
        //批量设置上下架时间
        handleAllTrackingTime() {
            if (this.selectTrackingTime.length) {
                this.dialog.resetVisible = true;
                this.dialogForm.allstartTime = '';
                this.dialogForm.allendTime = '';
            } else {
                this.hintMsg('请选择需要批量设置的跟卖时间', 'warning');
            }
        },
        //选择跟卖时间
        handleSelectionChangeTime(val) {
            this.selectTrackingTime = val;
        },
        //批量设置所有时间
        reserAllTime() {
            this.dialogForm.ruleDetails.forEach((i, index) => {
                this.selectTrackingTime.forEach((j, index) => {
                    if (i.id == j.id) {
                        console.log(i);
                        let allstartTime = this.dialogForm.allstartTime;
                        let allendTime = this.dialogForm.allendTime;
                        if (allstartTime) {
                            i.mondayStartTime = allstartTime;
                            i.tuesdayStartTime = allstartTime;
                            i.wednesdayStartTime = allstartTime;
                            i.thursdayStartTime = allstartTime;
                            i.fridayStartTime = allstartTime;
                            i.saturdayStartTime = allstartTime;
                            i.sundayStartTime = allstartTime;
                        }
                        if (allendTime) {
                            i.mondayEndTime = allendTime;
                            i.tuesdayEndTime = allendTime;
                            i.wednesdayEndTime = allendTime;
                            i.thursdayEndTime = allendTime;
                            i.fridayEndTime = allendTime;
                            i.saturdayEndTime = allendTime;
                            i.sundayEndTime = allendTime;
                        }
                    }
                });
            });
            this.dialog.resetVisible = false;
        },
        //批量设置上下架时间改变时
        resetPutaway(val) {
            console.log(val);
            if (val && this.resetSoldoutValue) {
                let putawayValue = val.split(':')[0];
                if (this.resetSoldoutValue < Number(putawayValue)) {
                    this.dialogForm.allendTime = null;
                }
            }
        },
        resetSoldout(val) {
            if (val) {
                let num = val.split(':')[0];
                this.resetSoldoutValue = Number(num);
            }
        },
        /*
            1.下架时间要大于上架时间
            2.数组的最后一项，
                上架时间  >需要大于上一项的下架时间
                下架时间  >大于当前上架时间 以此类推
        */
        //上架时间change
        putawayChangeTime(value, index, name) {
            // console.log(value,index,name)
            if (value && this.soldoutChangeValue) {
                let num = value.split(':')[0];
                //如果下架时间小于上架时间，清空下架时间
                if (this.soldoutChangeValue < Number(num)) {
                    let key = getHomologousKey(name);
                    this.dialogForm.ruleDetails[index][key] = null;
                }
            }
        },
        //下架时间change
        soldoutChangeTime(value, index, name) {
            // console.log(value,index,name)
            if (value) {
                let num = value.split(':')[0];
                this.soldoutChangeValue = Number(num);
            }
            let key = getHomologousKey(name);
            let ismsg = this.dialogForm.ruleDetails[index][key];
            if (ismsg) {
                this.hint = false;
            }
        },
        //获取列表数据
        getList(val = 'table') {
            this.loading = true;
            let params = {
                pageSize: this.paginationInfo.pageSize,
                pageNumber: this.paginationInfo.currentPage
            };
            if (val == 'search') params['name'] = this.name;
            this.http('sell/rule/list', params, data => {
                this.list = data.data.rows.rows;
                this.paginationInfo.pageSize = data.data.rows.pageSize;
                this.paginationInfo.currentPage = data.data.rows.pageNo;
                this.paginationInfo.total = data.data.rows.total;
            });
        },
        //获取时区
        getAreaList() {
            if (this.areaList.length) return;
            this.http('sell/rule/timezone/list', {}, data => {
                this.areaList = data.data.rows;
            });
        },
        handleSizeChange(val) {
            this.paginationInfo.pageSize = val;
            this.name ? this.getList('search') : this.getList();
        },
        handleCurrentChange(val) {
            this.paginationInfo.currentPage = val;
            this.name ? this.getList('search') : this.getList();
        },
        http(url, params, callback) {
            getData(url, params).then(res => {
                this.loading = false;
                this.dialog.loading = false;
                if (res.data.code == 0) {
                    callback && callback(res);
                } else {
                    this.hintMsg(res.data.msg, 'error');
                }
            });
        },
        //改变弹框状态
        handleStatus(boole, str) {
            this.dialog.title = str;
            this.dialog.visible = boole;
            this.getAreaList();
        },
        //提示信息
        hintMsg(msg, type = 'success') {
            this.$message({
                showClose: true,
                type,
                message: msg
            });
        },
        empty() {
            for (let key in this.dialogForm) {
                if (key == 'ruleDetails') {
                    this.dialogForm[key] = [new CreateTimeObj()];
                    continue;
                }
                if (key == 'activateFlag') {
                    this.dialogForm[key] = false;
                    continue;
                }
                if (key == 'time') {
                    this.dialogForm[key] = [];
                    continue;
                }
                this.dialogForm[key] = '';
            }
        }
    }
};
</script>

<style lang="scss">
@import '../../../assets/style/style-scss/layout.scss';
.el-table th {
    background-color: #f3f3f3;
}
.pad10 {
    padding: 10px;
}
.mar10 {
    margin: 10px 0;
    .el-form-item {
        margin-bottom: 0;
    }
}
.toSellStrategy {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.toSellStrategy-content {
    @extend .pad10;
    flex: 1;
    background: #fff;
    .search {
        @extend .pad10;
        background: #f2f2f2;
        border-radius: 5px;
        .el-form-item {
            margin-bottom: 0;
        }
    }
}
.el-dialog__footer {
    text-align: center !important;
    .save {
        width: 200px;
    }
}
.textarea {
    textarea {
        min-height: 100px !important;
    }
}
.hintcolor {
    color: #f56c6c;
    font-size: 12px;
    margin-top: -7px;
}
</style>
