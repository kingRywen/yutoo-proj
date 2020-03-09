<template>
    <!-- 客服售后记录添加和编辑 -->
    <div>
        <el-form :model="ruleForm" ref="ruleForm" :rules="ruleFormRules" label-width="100px" size="small">
            <el-row type="flex" justify="space-between">
                <el-col :span="12">
                    <el-form-item label="订单号：" prop="orderNumber">
                        <el-input v-model.trim="ruleForm.orderNumber" v-if="isAdd">
                            <el-button slot="append" icon="el-icon-search" @click="getOrderID" :loading="loadingOrderId"></el-button>
                        </el-input>
                        <div v-else>{{ruleForm.orderNumber}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="productSkuList.length">
                    <el-form-item label="客户问题：" prop="customerIssueId">
                        <el-select style="width: 200px;" v-model.number="ruleForm.customerIssueId" :disabled="disabled">
                            <el-option :label="i.name" :value="i.customerIssueId" v-for="i in customerList" :key="i.id"></el-option>
                        </el-select>
                        <el-button type="primary" plain size="small" style="float: right;" @click="problemVisible=true" :disabled="disabled">客户问题管理</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

            <template v-if="productSkuList.length">
                <el-row type="flex" justify="space-between">
                    <el-col :span="12">
                        <el-form-item label="退换到仓库：" prop="returnWarehouseId">
                            <el-select style="width:100%;" v-model="ruleForm.returnWarehouseId" :disabled="disabled">
                                <el-option :label="i.warehouseName" :value="i.warehouseId" v-for="i in warehouseList" :key="i.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退货代码：" prop="returnCode">
                            <el-input v-model="ruleForm.returnCode" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="space-between">
                    <el-col :span="12">
                        <el-form-item label="ODR：" prop="odr">
                            <el-select style="width:100%;" v-model="ruleForm.odr" :disabled="disabled">
                                <el-option label="中评" value="1"></el-option>
                                <el-option label="差评" value="2"></el-option>
                                <el-option label="好评" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="处理方案：" prop="solution">
                            <el-select style="width:100%;" v-model="ruleForm.solution" :disabled="disabled">
                                <el-option :label="i.label" :value="i.value" v-for="i in solutionList" :key="i.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="space-between">
                    <el-col :span="12">
                        <el-form-item label="跟进时间：" prop="followUpTime">
                            <el-date-picker :disabled="disabled" value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.followUpTime" type="datetime" placeholder="选择日期时间" style="width:100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户评价：" prop="name">
                            {{commentInfo.length?'已评价':'未评价'}}
                            <!-- <el-rate v-model="value5" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate> -->
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="产品SKU：">
                    <yt-table :data="productSkuList" :columns="productSkuColumns" :border="true" :selection="false">
                        <el-table-column label="问题数量" width="200" align="center" slot="right">
                            <template slot-scope="scope">
                                <div style="display: flex;justify-content: center;">
                                    <el-input v-model="ruleForm.products[scope.$index].issueAmount" size="mini" type="number" style="margin:0 5px;width:50%;" v-if="addproblem" @blur="addproblem=false"></el-input>
                                    <span style="line-height: 32px;" v-else>{{ruleForm.products[scope.$index].issueAmount}}</span>
                                    <el-button type="text" icon="el-icon-edit" @click="addproblem=!addproblem" v-if="!disabled"></el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </yt-table>
                </el-form-item>
                <el-form-item label="跟进记录：">
                    <el-button type="primary" plain size="mini" round style="margin-bottom:10px;" @click="openAddfollows" v-if="!disabled">添加跟进</el-button>
                    <yt-table :data="followUprecordList" :columns="followUprecordColumns" :border="true">
                        <el-table-column label="附件" align="center" slot="right">
                            <template slot-scope="scope">
                                <a :href="item.path" v-for="item in scope.row.enclosure" title="点击下载" target="_blank" style="display:block;" :key="item.id">{{item.name}}</a>
                            </template>
                        </el-table-column>
                    </yt-table>
                </el-form-item>
                <el-form-item label="完成情况：">
                    <el-select v-model="ruleForm.performance" :disabled="disabled">
                        <el-option label="已完成" value="1"></el-option>
                        <el-option label="未完成" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>
        </el-form>
        <!-- 添加跟进 -->
        <el-dialog title="添加跟进" :visible.sync="visible" width="480px" :append-to-body="true">
            <el-form :model="followsForm" :rules="followsRules" ref="followsForm" label-width="100px" size="small">
                <el-form-item label="跟进内容：" prop="content">
                    <el-input type="textarea" class="textarea" v-model.trim="followsForm.content"/>
                </el-form-item>
                <el-form-item label="上传附件：" prop="enclosure">
                    <el-upload ref="upload" action="/" :on-change="handleChange" :fileList="fileList" :on-remove="handleRemove" :auto-upload="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="addfollows('followsForm')" :loading="addloading">确认添加</el-button>
            </span>
        </el-dialog>
        <!-- 原因管理 -->
        <el-dialog title="原因管理" :visible.sync="problemVisible" width="780px" :append-to-body="true">
            <problemManagement @change="changeProblemManage"/>
        </el-dialog>
    </div>
</template>

<script>
import { solutionList } from '../mixins';
import { mapActions, mapGetters } from 'vuex';
import problemManagement from './problemManagement';
import { oss } from '@yutoo/yutoo/utils/utils.umd.min';
import storage from 'Utils/saver';
import { CONST_PORT_CONFIG } from 'Config';
export default {
    props: {
        customerList: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            addloading: false,
            loadingOrderId: false,
            username: '',
            fileList: [],
            followsForm: {
                content: '',
                enclosure: []
            },
            followsRules: {
                content: [
                    {
                        required: true,
                        message: '请输入跟进内容',
                        trigger: 'change'
                    }
                ]
            },
            ruleFormRules: {
                orderNumber: [
                    {
                        required: true,
                        message: '请输入订单号',
                        trigger: 'change'
                    }
                ],
                followUpTime: [
                    {
                        required: true,
                        message: '请输入跟进时间',
                        trigger: 'change'
                    }
                ]
            },
            solutionList,
            addproblem: false,
            visible: false,
            problemVisible: false,
            commentInfo: [],
            ruleForm: {
                orderNumber: '',
                orderId: '',
                products: [],
                follows: [],
                performance: '0',
                returnCode: '',
                returnWarehouseId: '',
                followUpTime: '',
                solution: '',
                odr: '',
                customerIssueId: ''
            },
            productSkuList: [],
            productSkuColumns: [
                { label: 'SKU', value: 'productSku' },
                { label: '产品名称', value: 'nameZh' },
                { label: '价格', value: 'productPrice' },
                { label: '订购', value: 'orderAmount' }
            ],
            followUprecordList: [],
            followUprecordColumns: [
                { label: '跟进人', value: 'name', width: '120px' },
                { label: '跟进时间', value: 'createTime' },
                { label: '跟进内容', value: 'content' }
            ],
            isAdd: true,
            orderServiceId: null
        };
    },
    watch: {
        productSkuList(val) {
            this.ruleForm.products = val.map(i => {
                return {
                    orderServiceProductId: i.productId,
                    issueAmount: i.issueAmount ? i.issueAmount : 0
                };
            });
        }
    },
    methods: {
        //编辑
        getEditInfo(orderServiceId) {
            this.orderServiceId = orderServiceId;
            this.isAdd = false;
            this.productSkuList = [];
            if (!this.warehouseList.length) this.getWarehouseList();
            this.$api['email/logInfo']({ orderServiceId }).then(res => {
                let {
                    orderNumSystem,
                    orderId,
                    products,
                    follows,
                    performance,
                    returnCode,
                    returnWarehouseId,
                    followUpTime,
                    solution,
                    odr,
                    customerIssueId
                } = res;

                if (!products.length) {
                    this.$message.error('该订单下暂无产品信息');
                    return;
                }
                this.productSkuList = products;
                this.ruleForm.follows = follows.map(item => {
                    return {
                        content: item.content,
                        enclosure: item.enclosure
                    };
                });
                this.followUprecordList = follows.map(item => {
                    return {
                        createTime: item.createTime,
                        name: item.name,
                        content: item.content,
                        enclosure: item.enclosure
                    };
                });
                this.ruleForm.orderNumber = orderNumSystem;
                this.ruleForm.orderId = orderId;
                this.ruleForm.performance = performance + '';
                this.ruleForm.returnCode = returnCode;
                this.ruleForm.returnWarehouseId = returnWarehouseId;
                this.ruleForm.followUpTime = followUpTime;
                this.ruleForm.solution = solution;
                this.ruleForm.odr = odr ? odr + '' : '';
                this.ruleForm.customerIssueId = Number(customerIssueId);
                this.$refs.ruleForm.validate();
            });
        },
        resetForm() {
            this.isAdd = true;
            this.productSkuList = [];
            this.followUprecordList = [];
            this.$refs.ruleForm.resetFields();
        },
        //
        getFilePath() {
            return this.$api['order/getFilePath']({})
                .then(data => {
                    return data.path;
                })
                .catch(() => {});
        },

        submitForm(callback) {
            if (this.disabled) {
                return callback && callback();
            }
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if (!this.productSkuList.length) {
                        this.getOrderID();
                        return;
                    }
                    let params = this.ruleForm;
                    //编辑
                    if (!this.isAdd) {
                        params = Object.assign({}, params, {
                            orderServiceId: this.orderServiceId
                        });
                    }
                    this.$api['email/logSave'](params)
                        .then(res => {
                            this.$message.success(res.msg);
                            callback && callback();
                        })
                        .catch(err => {
                            this.$message.error(err.msg);
                        });
                } else {
                    return false;
                }
            });
        },
        handleRemove(file, fileList) {
            let index = this.followsForm.enclosure.findIndex(
                item => item.name === file.name
            );
            this.followsForm.enclosure.splice(index, 1);
            this.fileList = fileList;
        },
        handleChange(file, fileList) {
            this.fileList = fileList;
            this.followsForm.enclosure.push(file);
        },
        addfollows(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    this.addloading = true;
                    try {
                        let url = await this.getFilePath();

                        if (!url && this.fileList.length) {
                            this.$message.error(
                                '获取后台路径失败，附件暂不可上传，请稍后再试'
                            );
                            this.addloading = false;
                            return;
                        }

                        let path = await oss.batchUpload(
                            this.fileList.map(el => el.raw),
                            url,
                            CONST_PORT_CONFIG.PRODUCT_URL +
                                '/img/get/oss/signature',
                            null,
                            storage.get('local', 'token')
                        );
                        //给后台数据
                        let obj = {
                            content: this.followsForm.content,
                            enclosure: path.map(item => {
                                let index = item.lastIndexOf('/');
                                let name = item.slice(index + 1);
                                return {
                                    path: item,
                                    name
                                };
                            })
                        };
                        this.ruleForm.follows.push(obj);
                        //页面展示数据
                        let pageObj = Object.assign({}, obj, {
                            createTime: this.getTime(),
                            name: this.username
                        });
                        this.followUprecordList.push(pageObj);
                        this.addloading = false;
                        this.visible = false;
                    } catch (error) {
                        this.addloading = false;
                    }
                } else {
                    return false;
                }
            });
        },
        openAddfollows() {
            this.visible = true;
            this.fileList = [];
            this.followsForm.content = '';
            this.followsForm.enclosure = [];
            this.$nextTick(() => {
                this.$refs.upload.clearFiles();
            });
        },
        getOrderID() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.loadingOrderId = true;
                    let orderNumber = this.ruleForm.orderNumber;
                    this.$api['order/getOrderIdByNumber']({
                        orderNumber
                    })
                        .then(res => {
                            this.ruleForm.orderId = res.orderId;
                            this.getOrderInfo(res.orderId);
                            if (!this.warehouseList.length)
                                this.getWarehouseList();
                            this.loadingOrderId = false;
                        })
                        .catch(err => {
                            this.loadingOrderId = false;
                            this.$message.error(err.msg);
                        });
                }
            });
        },
        getOrderInfo(orderId) {
            this.$api['order/orderInfo']({
                orderId
            })
                .then(res => {
                    let { products, commentInfo, essentialInfo } = res.rows;
                    if (!products.length) {
                        this.$message.error('该订单下暂无产品信息');
                        return;
                    }
                    this.commentInfo = commentInfo;
                    this.productSkuList = products;
                    this.username = essentialInfo.currUserName;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },

        changeProblemManage(list) {
            this.customerList = list;
        },
        getTime() {
            var date = new Date();
            var seperator1 = '-';
            var seperator2 = ':';
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            var currentdate =
                date.getFullYear() +
                seperator1 +
                month +
                seperator1 +
                strDate +
                ' ' +
                date.getHours() +
                seperator2 +
                date.getMinutes() +
                seperator2 +
                date.getSeconds();
            return currentdate;
        },
        ...mapActions(['getWarehouseList'])
    },
    computed: {
        ...mapGetters(['warehouseList'])
    },
    components: {
        problemManagement
    }
};
</script>
<style lang="scss">
.textarea {
    textarea {
        height: 120px;
        resize: none;
    }
}
</style>