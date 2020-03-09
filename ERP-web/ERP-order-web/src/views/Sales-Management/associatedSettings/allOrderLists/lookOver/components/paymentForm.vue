<template lang="html">
    <!-- 订单支付 -->
    <el-form :model="form" :rules="rules" ref="form" label-width="100px"  size="small">
        <el-row>
            <el-col :span="12"><el-form-item label="订单号：">{{ info.orderNumberSystem }}</el-form-item></el-col>
            <el-col :span="12"><el-form-item label="下单时间：">{{ info.createOrderTime }}</el-form-item></el-col>
        </el-row>
        <el-row>
            <el-col :span="12"><el-form-item label="订单金额：">{{ info.orderPrice }}</el-form-item></el-col>
            <el-col :span="12"><el-form-item label="已收金额：">{{ info.receivedPrice || 0}}</el-form-item></el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="收款银行：" prop="receiptBankId">
                    <el-select v-model="form.receiptBankId">
                      <el-option :label="item.bankName" :value="item.bankId" v-for="item in bankList" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收款金额：" prop="money">
                    <el-input v-model.number="form.money"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="付款类型：" prop="paymentType">
                    <el-radio-group v-model="form.paymentType">
                      <el-radio label="1">在线支付</el-radio>
                      <el-radio label="2">线下汇款</el-radio>
                      <el-radio label="3">站内账号付款</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="支付方式：" prop="payType">
                     <el-select v-model="form.payType">
                       <el-option :label="item.label" :value="item.value" v-for="item in paymentMethod" :key="item.id"></el-option>
                     </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="付款人：" prop="payer">
                    <el-input v-model.number="form.payer"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="上传凭证：" prop="receiptVoucherImg">
                    <el-upload
                        ref="upload"
                        v-model="form.receiptVoucherImg"
                        action=""
                        :limit='1'
                        :on-change='onChange'
                        :with-credentials='true'
                        :on-remove ='onRemove'
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="付款备注：" prop="remark">
            <el-input type="textarea"  v-model="form.remark" class="textarea"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    update: Function,
    data: Object
  },
  data() {
    return {
      form: {
        receiptBankId: null,
        paymentType: '1',
        payType: null,
        payer: this.data.cneeName,
        receiptVoucherImg: null,
        remark: null
      },
      rules: {
        receiptBankId: [
          {
            required: true,
            message: '请选择收款银行',
            trigger: ['change', 'blur']
          }
        ],
        money: [
          {
            required: true,
            message: '请输入付款金额',
            trigger: ['change', 'blur']
          },
          { type: 'number', message: '必须为数字值' }
        ],
        paymentType: [
          {
            required: true,
            message: '请选择付款类型',
            trigger: ['change', 'blur']
          }
        ],
        payType: [
          {
            required: true,
            message: '请选择支付方式',
            trigger: ['change', 'blur']
          }
        ],
        payer: [
          {
            required: true,
            message: '请输入付款人',
            trigger: ['change', 'blur']
          }
        ],
        receiptVoucherImg: [
          { required: true, message: '请上传凭证', trigger: 'change' }
        ]
      },
      info: {}
    }
  },
  methods: {
    submitForm(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.form, {
            orderId: this.$route.query.orderServiceId
          })
          this.$api['order/receiptSave'](params)
            .then(res => {
              this.$message.success(res.msg)
              this.update()
              callback && callback(true)
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.$refs.upload.clearFiles()
    },
    onChange(file) {
      this.form.receiptVoucherImg = file
    },
    onRemove() {
      this.form.receiptVoucherImg = null
    },
    getInfo() {
      this.$api['order/receiptInfo']({
        orderId: this.$route.query.orderServiceId
      })
        .then(res => {
          this.info = res.rows
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    ...mapActions('common', ['getBankList', 'initCommonList'])
  },
  computed: {
    ...mapGetters('common', ['bankList', 'paymentMethod'])
  }
}
</script>

<style lang="scss">
.textarea {
  textarea {
    height: 100px;
  }
}
</style>
