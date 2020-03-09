<template>
  <div>
    <el-row :gutter="20" type="flex" class="per100">
      <el-col :span="12">
        <SimpleForm
          labelWidth="120px"
          :fields="payFields"
          :default-data="defaultPayData"
          ref="activate"
          @datachange="handlePayDataChange"
        ></SimpleForm>
      </el-col>
      <el-col :span="12" class="txc">
        <div class="txc mt20">
          <el-radio :label="0" v-model="selectPayStyle">支付宝</el-radio>
          <el-radio :label="1" v-model="selectPayStyle">微信</el-radio>
        </div>
        <img class="mt10" v-if="selectPayStyle === 0" src="./alipay.gif">
        <img class="mt10" v-else src="./weipay.png">
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    orderId: {
      type: [String, Number],
      default: null
    }
  },
  // created() {
  //   if (!this.orderId) {
  //     this.getPrice(this.defaultPayData.effectiveTime)
  //   }
  // },
  data() {
    let vm = this
    return {
      secondData: {},
      // defaultPayData:{},
      selectPayStyle: 0,
      payFields: [
        {
          label: '订单编号',
          name: 'orderId',
          disabled: true
        },
        {
          label: '购买时长（月）',
          name: 'effectiveTime',
          type: 'number',
          min: 1,
          onChange(item, val) {
            // debugger
            vm.getPrice(val)
          }
        },
        {
          label: '购买配额',
          name: 'ipCount',
          disabled: true
        },
        {
          noShow: true,
          type: 'currency',
          label: '应付金额',
          name: 'needPay',
          disabled: true
        },
        // {
        //   label: '实付金额',
        //   name: 'realPay',
        //   disabled: true
        // },
        {
          label: '支付姓名',
          name: 'payName',
          required: true
        },
        {
          label: '支付账号',
          name: 'payAccount',
          required: true
        },
        {
          label: '留言',
          name: 'remark',
          type: 'textarea',
          rows: 5
        }
      ]
    }
  },
  methods: {
    handlePayDataChange(data) {},
    getData() {
      return this.$refs.activate.formData
    },
    getPrice(month) {
      let vm = this
      return vm.$api[`main/ipPriceNeedPay`]({
        totalPrice: vm.defaultPayData.totalPrice,
        month
      })
        .then(data => {
          vm.$refs.activate.setData({ needPay: data })
        })
        .catch(err => {})
    }
  },
  computed: {
    defaultPayData() {
      if (Object.keys(this.secondData).length) {
        return this.secondData
      }
      return this.data
    }
  },
  watch: {
    orderId: {
      immediate: true,
      handler(orderId) {
        if (orderId) {
          this.payFields.splice(2, 1)
          this.$api[`main/merchantOrderRenewInfo`]({ orderId })
            .then(data => {
              this.secondData = data.rows
              this.getPrice(data.rows.effectiveTime)
            })
            .catch(err => {})
        } else {
          this.secondData = {}
        }
      }
    },
    data: {
      deep: true,
      handler(val) {
        this.getPrice(val.effectiveTime)
      }
    }
  }
}
</script>

<style>
</style>
