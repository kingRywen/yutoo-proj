<template>
    <!-- 审核 -->
    <el-form :loading="loading" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm" size="small">
        <h3>订单基本信息</h3>
        <el-row class="info">
            <el-col :span="8" v-for="item in orderInfoList" :key="item.id">
                <el-form-item :label="item.label+'：'">
                    <p class="text">{{item.value}}</p>
                </el-form-item>
            </el-col>
        </el-row>
        <h3>收货人信息</h3>
        <el-row class="info">
            <el-col :span="8">
                <el-form-item label="Frist Name：" prop="cneeFirstName">
                    <el-input v-model.trim="ruleForm.cneeFirstName"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="Lrist Name：" prop="cneeLastName">
                    <el-input v-model.trim="ruleForm.cneeLastName"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="电子邮箱：" prop="cneeEmail">
                    <el-input v-model.trim="ruleForm.cneeEmail"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系电话：" prop="cneePhone">
                    <el-input v-model="ruleForm.cneePhone"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="公司名称：" prop="cneeCompanyName">
                    <el-input v-model.trim="ruleForm.cneeCompanyName"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="邮编：" prop="cneePostcode">
                    <el-input v-model="ruleForm.cneePostcode"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="运输方式：" prop="transportTypeSystem">
                    <el-select v-model="ruleForm.transportTypeSystem">
                        <el-option :label="i.label" :value="i.value" v-for="i in transportTypeList" :key="i.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="收货国家：" prop="cneeCountryId">
                    <el-select v-model="ruleForm.cneeCountryId">
                        <el-option :label="i.label" :value="i.value" v-for="i in countryList" :key="i.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="省：" prop="cneeProvince">
                    <el-input v-model.trim="ruleForm.cneeProvince"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="市：" prop="cneeCity">
                    <el-input v-model.trim="ruleForm.cneeCity"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="区：" prop="cneeArea">
                    <el-input v-model.trim="ruleForm.cneeArea"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="地址1：" prop="cneeAddressDetailFirst">
                    <el-input v-model.trim="ruleForm.cneeAddressDetailFirst"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="地址2：" prop="cneeAddressDetailSecond">
                    <el-input v-model.trim="ruleForm.cneeAddressDetailSecond"/>
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="地址3：" prop="cneeAddressDetailThird">
                    <el-input v-model.trim="ruleForm.cneeAddressDetailThird"/>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

function createRules(
    message = '',
    type,
    pattern,
    required = true,
    trigger = 'change'
) {
    let obj = {
        message,
        required,
        trigger
    };
    if (pattern) obj['pattern'] = pattern;
    if (type) obj['type'] = type;

    return obj;
}
export default {
    data() {
        return {
            loading: false,
            ruleForm: {
                cneeFirstName: '',
                cneeLastName: '',
                cneeEmail: '',
                cneePhone: '',
                cneeCompanyName: '',
                cneePostcode: '',
                transportTypeSystem: '',
                cneeCountryId: '',
                cneeProvince: '',
                cneeCity: '',
                cneeArea: '',
                cneeAddressDetailFirst: '',
                cneeAddressDetailSecond: '',
                cneeAddressDetailThird: ''
            },
            rules: {
                cneeFirstName: createRules('请输入Frist Name'),
                cneeLastName: createRules('请输入Lrist Name'),
                cneeEmail: createRules('请输入邮箱', 'email'),
                cneePhone: createRules('请输入电话'),
                cneeCompanyName: createRules('请输入名称'),
                cneePostcode: createRules('请输入邮编'),
                transportTypeSystem: createRules('请选择运输方式'),
                cneeCountryId: createRules('请选择收货国家'),
                cneeProvince: createRules('请输入省'),
                cneeCity: createRules('请输入所在市'),
                cneeArea: createRules('请输入区域'),
                cneeAddressDetailFirst: createRules('请输入地址')
            },
            orderInfoList: []
        };
    },
    methods: {
        submitForm(orderId, callback) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.ruleForm, {
                        orderId
                    });
                    this.$api['email/examineUpdate'](params).then(res => {
                        this.$message.success(res.msg);
                        callback && callback();
                    });
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
        },
        getOrderInfo(orderId) {
            this.$api['order/orderInfo']({ orderId }).then(res => {
                let {
                    buyerInfo: {
                        cneeMemberId,
                        cneeFirstName,
                        cneeLastName,
                        cneeEmail,
                        cneePhone,
                        cneeCompanyName,
                        postcode,
                        transportType,
                        cneeCountryId,
                        cneeProvince,
                        cneeCity,
                        cneeArea,
                        cneeAddressDetailFirst,
                        cneeAddressDetailSecond,
                        cneeAddressDetailThird
                    },
                    essentialInfo: {
                        orderTypeName,
                        orderNumPlatform,
                        storeName,
                        createOrderReasonName
                    }
                } = res.rows;
                //订单信息
                this.orderInfoList = [
                    { label: '订单类型', value: orderTypeName },
                    { label: '平台订单号', value: orderNumPlatform },
                    { label: '买家ID', value: cneeMemberId },
                    { label: '订单来源店铺', value: storeName },
                    { label: '新增订单原因', value: createOrderReasonName }
                ];
                //收货人信息
                this.ruleForm.cneeFirstName = cneeFirstName;
                this.ruleForm.cneeLastName = cneeLastName;
                this.ruleForm.cneeEmail = cneeEmail;
                this.ruleForm.cneePhone = cneePhone;
                this.ruleForm.cneeCompanyName = cneeCompanyName;
                this.ruleForm.cneePostcode = postcode;
                this.ruleForm.transportTypeSystem = transportType;
                this.ruleForm.cneeCountryId = cneeCountryId;
                this.ruleForm.cneeProvince = cneeProvince;
                this.ruleForm.cneeCity = cneeCity;
                this.ruleForm.cneeArea = cneeArea;
                this.ruleForm.cneeAddressDetailFirst = cneeAddressDetailFirst;
                this.ruleForm.cneeAddressDetailSecond = cneeAddressDetailSecond;
                this.ruleForm.cneeAddressDetailThird = cneeAddressDetailThird;
            });
        },
        ...mapActions(['getTransportTypeList', 'getCountryList'])
    },
    mounted() {
        if (!this.transportTypeList.length) this.getTransportTypeList();
        if (!this.countryList.length) this.getCountryList();
    },
    computed: {
        ...mapGetters(['transportTypeList', 'countryList'])
    }
};
</script>
<style lang="scss">
.ruleForm {
    h3 {
        font-weight: 700;
        font-size: 14px;
    }
    .info {
        margin: 10px 0 25px;
        padding: 18px 18px 0;
        border: 1px solid #ccc;
        border-radius: 5px;
        .text {
            text-align: center;
            background: #edecec;
            border-radius: 5px;
            color: #606266;
            word-break: break-all;
        }
    }
}
</style>
