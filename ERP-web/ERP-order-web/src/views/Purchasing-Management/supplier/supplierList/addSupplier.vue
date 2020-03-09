<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="supplier-ruleForm" size="small">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-form-item label="采购类型：" prop="purchaseType">
          <el-select v-model="ruleForm.purchaseType">
            <el-option :label="i.label" :value="i.value" v-for="i in purchaseTypeList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-checkbox
          style="padding-left: 20px;line-height: 32px;"
          v-model="ruleForm.supplierSystemFlag"
          :true-label="1"
          :false-label="0"
        >供应商登录系统供货</el-checkbox>
      </el-col>
      <el-col :span="7" v-if="ruleForm.supplierSystemFlag">
        <el-form-item label="账号：" prop="supplierAccount">
          <el-input v-model="ruleForm.supplierAccount"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7" v-if="ruleForm.supplierSystemFlag">
        <el-form-item label="密码：" prop="supplierPassword">
          <el-input v-model="ruleForm.supplierPassword"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!--  -->
    <el-row :gutter="10">
      <el-col :span="12">
        <el-row>
          <el-col :span="14">
            <el-form-item label="供应商发货地：" prop="deliveryProvince">
              <el-select v-model="ruleForm.deliveryProvince" placeholder="请选择省">
                <el-option :label="i.label" :value="i.value" v-for="i in purchaseTypeList" :key="i.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="deliveryCity" class="itemMargin">
              <el-select v-model="ruleForm.deliveryCity" placeholder="请选择城市">
                <el-option :label="i.label" :value="i.value" v-for="i in purchaseTypeList" :key="i.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-col :span="12">
          <el-checkbox
            style="padding-left: 20px;line-height: 32px;"
            v-model="ruleForm.invoiceFlag"
            :true-label="1"
            :false-label="0"
          >
            是否开具发票
            <span>（一般纳税人税票）</span>
          </el-checkbox>
        </el-col>
        <el-col :span="12" v-if="ruleForm.invoiceFlag">
          <el-form-item label="开票税点：" prop="tax">
            <el-input v-model="ruleForm.tax"></el-input>
          </el-form-item>
        </el-col>
      </el-col>
    </el-row>
    <!--  -->
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票人资质：" prop="drawerAptitude">
              <el-select v-model="ruleForm.drawerAptitude">
                <el-option :label="i.label" :value="i.value" v-for="i in drawerAptitudeList" :key="i.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票人类型：" prop="drawerType">
              <el-select v-model="ruleForm.drawerType">
                <el-option :label="i.label" :value="i.value" v-for="i in drawerTypeList" :key="i.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票人地址：" prop="drawerProvince">
              <el-select v-model="ruleForm.drawerProvince">
                <el-option :label="i.label" :value="i.value" v-for="i in drawerTypeList" :key="i.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="itemMargin" prop="drawerCity">
              <el-select v-model="ruleForm.drawerCity" style="width:100%">
                <el-option :label="i.label" :value="i.value" v-for="i in drawerTypeList" :key="i.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--  -->
    <el-form-item label="供应商名称：" prop="supplierName">
      <el-input v-model="ruleForm.supplierName"></el-input>
    </el-form-item>
    <el-form-item label="供应商传真：" prop="supplierFax">
      <el-input v-model="ruleForm.supplierFax"></el-input>
    </el-form-item>
    <!--  -->
    <el-row>
      <el-col :span="15">
        <div>
          <el-form-item label="对应的仓库：" prop="depot">
            <el-select v-model="ruleForm.depot">
              <el-option :label="i.label" :value="i.value" v-for="i in depotList" :key="i.id"></el-option>
            </el-select>
            <span style="color:#c0c4cc;">（有多个本地仓库打印采购单时选择）</span>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="9">
        <el-form-item label="供应商地址：" prop="supplierAddress">
          <el-input v-model="ruleForm.supplierAddress"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!--  -->
    <el-row>
      <el-col :span="8">
        <el-form-item label="法人代表：" prop="legalDelegate">
          <el-input v-model="ruleForm.legalDelegate"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="总经理：" prop="manager">
          <el-input v-model="ruleForm.manager"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="总经理电话：" prop="managerPhoneCode">
          <el-input v-model="ruleForm.managerPhoneCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系人：" prop="contact">
          <el-input v-model="ruleForm.contact"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系人微信：" prop="contactWechat">
          <el-input v-model="ruleForm.contactWechat"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="联系人旺旺：" prop="contactWangwang">
          <el-input v-model="ruleForm.contactWangwang"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系人MNS：" prop="contactMsn">
          <el-input v-model="ruleForm.contactMsn"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系人邮箱：" prop="contactMail">
          <el-input v-model="ruleForm.contactMail"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="供应商网站：" prop="supplierWebsite">
          <el-input v-model="ruleForm.supplierWebsite"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="供应商备注：" prop="supplierRemarks">
          <el-input type="textarea" v-model="ruleForm.supplierRemarks" class="textarea"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="供应商级别：" prop="supplierLevel">
          <el-select v-model="ruleForm.supplierLevel">
            <el-option :label="i.label" :value="i.value" v-for="i in supplierLevelList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否供应商备货：" prop="supplierStockFlag">
          <el-select v-model="ruleForm.supplierStockFlag">
            <el-option :label="i.label" :value="i.value" v-for="i in supplierStockFlagList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否黑名单：" prop="blacklistFlag">
          <el-select v-model="ruleForm.blacklistFlag">
            <el-option :label="i.label" :value="i.value" v-for="i in supplierStockFlagList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开户银行：" prop="bank">
          <el-input v-model="ruleForm.bank"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="开户地址：" prop="bankAddress">
          <el-input v-model="ruleForm.bankAddress"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="银行账号：" prop="bankAccount">
          <el-input v-model="ruleForm.bankAccount"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="账户名：" prop="accountName">
          <el-input v-model="ruleForm.accountName"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="票据类型：" prop="billType">
          <el-select v-model="ruleForm.billType">
            <el-option :label="i.label" :value="i.value" v-for="i in billTypeList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="结算时间：" prop="settlementTimeType">
          <el-select v-model="ruleForm.settlementTimeType">
            <el-option :label="i.label" :value="i.value" v-for="i in settlementTimeTypeList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="付款方式：" prop="paymentMethod">
          <el-select v-model="ruleForm.paymentMethod">
            <el-option :label="i.label" :value="i.value" v-for="i in paymentMethodList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="账期：" prop="accountPeriod">
          <el-select v-model="ruleForm.accountPeriod">
            <el-option :label="i.label" :value="i.value" v-for="i in accountPeriodList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="起始日：" prop="startDay">
          <el-date-picker v-model="ruleForm.startDay" type="date" placeholder="选择日期" style="width:100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责开发人：" prop="responsibleDeveloper">
          <el-select v-model="ruleForm.responsibleDeveloper">
            <el-option :label="i.label" :value="i.value" v-for="i in responsibleDeveloperList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="采购点：" prop="purchasePoint">
          <el-select v-model="ruleForm.purchasePoint">
            <el-option :label="i.label" :value="i.value" v-for="i in purchasePointList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="采购人：" prop="purchaseId">
          <el-select v-model="ruleForm.purchaseId">
            <el-option :label="i.label" :value="i.value" v-for="i in purchaseIdList" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <el-checkbox
            style="line-height: 32px;"
            v-model="ruleForm.fbaCodeFlag"
            :true-label="1"
            :false-label="0"
          >是否可以提供FBA条码服务</el-checkbox>
          <span style="color:#c0c4cc;">（提供贴FBA条码服务的供应商对应的产品支持走海外直采流程）</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      depotList: [],
      drawerTypeList: [
        { label: '生产型', value: 1 },
        { label: '贸易型', value: 2 }
      ],
      drawerAptitudeList: [
        { label: '一般纳税人认定满2年', value: 1 },
        { label: '一般纳税人认定不满2年', value: 2 },
        { label: '小规模', value: 3 }
      ],
      purchaseTypeList: [
        { label: '市场采购', value: 1 },
        { label: '网络采购', value: 2 },
        { label: '工厂采购', value: 3 },
        { label: '自主生产', value: 4 }
      ],
      supplierLevelList: [
        { label: '最优', value: 'A' },
        { label: '最差', value: 'E' }
      ],
      supplierStockFlagList: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      billTypeList: [
        { label: '增值税发票', value: 1 },
        { label: '普通发票', value: 2 },
        { label: '收据', value: 3 },
        { label: '其他', value: 4 }
      ],
      settlementTimeTypeList: [
        { label: '按下单时间', value: 1 },
        { label: '按销单时间', value: 2 },
        { label: '按入库时间', value: 3 }
      ],
      paymentMethodList: [
        { label: '现金付款', value: 1 },
        { label: '网络在线付款', value: 2 },
        { label: '转账付款', value: 3 },
        { label: '阿里账期付款', value: 4 }
      ],
      accountPeriodList: [],
      responsibleDeveloperList: [],
      purchasePointList: [],
      purchaseIdList: [],
      ruleForm: {
        purchaseType: '',
        supplierSystemFlag: 1,
        supplierAccount: '',
        supplierPassword: '',

        deliveryProvince: '',
        deliveryCity: '',
        invoiceFlag: 1,
        tax: '',

        drawerAptitude: '',
        drawerType: '',
        drawerProvince: '',
        drawerCity: '',
        supplierName: '',
        supplierFax: '',

        depot: '',
        supplierAddress: '',

        legalDelegate: '',
        manager: '',
        managerPhoneCode: '',
        contact: '',
        contactWechat: '',
        contactWangwang: '',
        contactMsn: '',
        contactMail: '',
        supplierWebsite: '',
        supplierRemarks: '',
        supplierLevel: '',
        supplierStockFlag: '',
        blacklistFlag: '',
        bank: '',
        bankAddress: '',
        bankAccount: '',
        accountName: '',
        billType: '',
        settlementTimeType: '',
        paymentMethod: '',
        accountPeriod: '',
        startDay: '',
        responsibleDeveloper: '',
        purchasePoint: '',
        purchaseId: '',
        fbaCodeFlag: 0
      },
      rules: {}
    }
  }
}
</script>
<style lang="scss">
.supplier-ruleForm {
  max-height: 500px;
  padding-right: 20px;
  padding-top: 10px;
  overflow-y: auto;
  .itemMargin {
    .el-form-item__content {
      margin-left: 10px !important;
    }
  }
  .textarea {
    textarea {
      height: 100px;
      resize: none;
    }
  }
}
</style>