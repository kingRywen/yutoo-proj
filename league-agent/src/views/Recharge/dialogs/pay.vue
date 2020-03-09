<template>
  <div>
    <el-row :gutter="60" type="flex" class="per100">
      <el-col :span="15" style="padding-left: 0">
        <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
      </el-col>
      <el-col :span="9" class="right" style="padding-right: 0">
        <el-form size="mini" label-width="80px" v-if="selectedStyleObj">
          <div>
            <ElFormItem label="充值方式">
              <el-select v-model="selectPayStyle" placeholder="请选择支付方式">
                <el-option v-for="(value,key) in payStyle" :key="key" :label="value.name" :value="key"></el-option>
              </el-select>
            </ElFormItem>
          </div>
          <div>
            <ElFormItem label="收款账号">{{selectedStyleObj.recipientAccount}}</ElFormItem>
          </div>
          <!-- <img style="margin-top:30px" v-if="selectPayStyle === 0" src="./alipay.gif" /> -->
          <div class="__img_wrapper qrcode">
            <img :key="selectedStyleObj.qrCode" v-lazy="selectedStyleObj.qrCode" class="loadingImg" />
          </div>
          <div v-if="selectedStyleObj.remark" class="mt20 remark">备注：{{selectedStyleObj.remark}}</div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { debounce } from 'throttle-debounce'
export default {
  props: ['id'],
  data() {
    let getMoney = debounce(300, data => {
      // data.shouldPay = data.money
      this.$api[`agent/merchantPayShouldPay`]({ money: data.money }).then(
        data1 => {
          data.shouldPay = data1.rows
        }
      )
    })
    return {
      selectPayStyle: null,
      payStyle: {},
      formSchema: {
        money: {
          widget: 'currency',
          label: '充值金额（$）',
          required: true,
          min: 1,
          max: 999999999.99,
          change: getMoney
        },
        shouldPay: {
          widget: 'currency',
          disabled: true,
          signal: '￥',
          label: '应付金额',
          controls: false
        },
        payer: {
          required: true,
          maxlength: 255,
          label: '支付姓名'
        },
        payAccount: {
          required: true,
          maxlength: 255,
          label: '支付账号'
        },
        leaveWord: {
          widget: 'textarea',
          maxlength: 500,
          rows: 4,
          label: '留言'
        }
      },
      value: {}
    }
  },
  computed: {
    selectedStyleObj() {
      return this.payStyle[this.selectPayStyle]
    }
  },
  created() {
    if (this.id) {
      this.getInfo()
    }
    this.getPayStyle()
  },
  methods: {
    getPayStyle() {
      this.$api[`agent/paySetPayType`]({}).then(data => {
        this.payStyle = data.rows
        let key = Object.keys(data.rows)[0]
        // this.selectedStyleObj = data.rows[key]
        this.selectPayStyle = key
      })
    },
    getInfo() {
      this.$api[`agent/merchantPayInfo`]({ id: this.id }).then(data => {
        this.value = data.rows
      })
    },
    _submit(dia) {
      this.$set(dia.options, 'noShowLoading', true)
      return this.$refs.form.validate().then(() => {
        return this.$confirm(
          '请确定已经通过支付宝或微信二维码支付了正确金额',
          '注意',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            dia.options.noShowLoading = false
            return this.$api[`agent/merchantPayPay`]({
              ...this.value,
              payType: this.selectPayStyle
            })
          })
          .catch(() => {})
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.right {
  border-left: 1px solid #ddd;
}
.per100 {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.qrcode {
  width: 100%;
  height: auto;
}
.remark {
  font-size: 12px;
  opacity: 0.6;
}
</style>