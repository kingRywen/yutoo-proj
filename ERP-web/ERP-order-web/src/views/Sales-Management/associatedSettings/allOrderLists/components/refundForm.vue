<template>
  <!-- 申请退款 -->
  <div>
    <el-form :model="form" ref="form" label-width="100px" size="small">
      <el-form-item label="包含订单" prop="name">
        <span class="total">{{orderIds.length || 0 }}</span>个
      </el-form-item>
      <el-row>
        <el-col :span="18">
          <el-form-item
            label="退款原因"
            prop="refundReasonFirstId"
            :rules="[
            { required: true, message: '请选择一级退款原因', trigger: 'change' },
          ]"
          >
            <el-select placeholder="一级原因" style="width:100%;" v-model="form.refundReasonFirstId" @change="changeReason">
              <el-option :label="i.name" :value="i.refundReasonId" v-for="(i,j) in oneReason" :key="j"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" plain size="small" @click="manage">退款原因管理</el-button>
        </el-col>
      </el-row>
      <el-form-item
        prop="refundReasonSecondId"
        :rules="[
                     { required: twoReason.length?true:false, message: '请选择二级退款原因', trigger: 'change' },
                  ]"
      >
        <el-select placeholder="二级原因" style="width:100%;" v-model="form.refundReasonSecondId">
          <el-option :label="i.name" :value="i.refundReasonId" v-for="(i,j) in twoReason" :key="j"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="平台退款原因"
        prop="refundReasonPlatform"
        :rules="[
         { required: platformId==1?true:false, message: '请选择平台退款原因', trigger: 'change' },
      ]"
      >
        <el-select style="width:100%;" v-model="form.refundReasonPlatform">
          <el-option
            :label="i.name"
            :value="i.orderRefundPlatformReasonId"
            v-for="i in platformReasonList"
            :key="i.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="退款类型"
        prop="refundType"
        :rules="[
        { required: true, message: '请选择退款类型：', trigger: 'change' },
      ]"
      >
        <el-select style="width:100%;" v-model="form.refundType">
          <el-option label="未发货退款" value="1"/>
          <el-option label="已发货退款" value="2"/>
          <el-option label="部分退款" value="3"/>
          <el-option label="全额退款" value="4"/>
        </el-select>
      </el-form-item>
      <el-form-item
        label="货物处理"
        prop="cargoHandler"
        :rules="[
        { required: true, message: '请选择货物处理方式', trigger: 'change' },
      ]"
      >
        <el-select style="width:100%;" v-model="form.cargoHandler">
          <el-option label="未退货" value="1"/>
          <el-option label="退货上架" value="2"/>
          <el-option label="退货退回" value="3"/>
          <el-option label="未发货" value="4"/>
        </el-select>
      </el-form-item>
      <el-form-item label="退款备注">
        <el-input type="textarea" class="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <!--  -->
    <el-dialog
      title="退回原因管理"
      :visible.sync="dialogVisible"
      width="1200px"
      center
      top="90px"
      :append-to-body="true"
      lock-scroll
    >
      <div class="dialogVisible-content">
        <el-scrollbar style="height:100%;min-height:560px">
          <backMoneyManage ref="backMoneyManage" :list="oneReason" :update="getReasonList"/>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import backMoneyManage from 'Views/Sales-Management/associatedSettings/allOrderLists/lookOver/components/backMoneyManage.vue'
/* eslint-disable */
export default {
  components: {
    backMoneyManage
  },
  props: {
    orderIds: {
      type: Array,
      default: () => []
    },
    platformId: [String, Number]
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        refundReasonFirstId: '',
        refundReasonSecondId: '',
        refundReasonPlatform: '',
        refundType: '',
        cargoHandler: '',
        remark: ''
      },
      platformReasonList: [],
      oneReason: [],
      twoReason: []
    }
  },
  methods: {
    //退款原因管理
    manage() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.backMoneyManage.getReasonList()
      })
    },
    //一级原因改变触发
    changeReason(val) {
      this.form.refundReasonSecondId = null
      this.oneReason.forEach(item => {
        if (item.refundReasonId == val) {
          this.twoReason = item.child
        }
      })
    },
    //获取退款原因
    getReasonList() {
      this.$api['order/refundReasonGetReasonList']()
        .then(res => {
          this.oneReason = res.rows
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    //获取平台退款原因
    getPlatformReasonList(platformId = 1) {
      this.$api['order/refundGetReasonList']({
        platformId: this.platformId
      })
        .then(res => {
          this.platformReasonList = res.rows
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    submitForm(callback) {
      return this.$refs.form.validate().then(() => {
        let params = Object.assign({}, this.form, {
          orderIds: this.orderIds
        })
        return this.$api['order/orderRefundBatchSave'](params)
          .then(res => {
            this.$message.success(res.msg)
            callback && callback()
          })
          .catch(err => {
            this.$message.error(err.msg)
          })
      })
    }
  },
  mounted() {
    this.getPlatformReasonList()
    this.getReasonList()
  }
}
</script>

<style lang="scss">
.total {
  font-size: 14px;
  color: red;
}
.textarea {
  textarea {
    height: 120px;
    resize: none;
  }
}
</style>