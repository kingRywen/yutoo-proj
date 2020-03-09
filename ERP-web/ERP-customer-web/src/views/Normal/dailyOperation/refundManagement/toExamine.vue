<template>
  <!-- 退款审核 -->
  <el-form
    ref="ruleForm"
    label-width="120px"
    :model="form"
    size="small"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <h3 class="dialogItemTitle">订单信息</h3>
    <el-row class="border mb10">
      <el-col :span="8" v-for="item in infoList" :key="item.id">
        <el-form-item :label="item.label+'：'">{{item.value}}</el-form-item>
      </el-col>
    </el-row>

    <!--  -->
    <h3 class="dialogItemTitle">退款产品</h3>
    <div class="border mb10">
      <yt-table :data="productList" :columns="productcolumns" :border="true" :selection="false" class="mb10"></yt-table>
    </div>

    <h3 class="dialogItemTitle">操作</h3>
    <div class="border mb10">
      <el-form-item
        label="操作状态："
        prop="state"
        :rules="[
            { required:true, message: '请选择状态', trigger: 'change' },
        ]"
      >
        <el-radio-group v-model="form.state">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="0">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="原因："
        prop="examineRemark"
        :rules="[
            { required:form.state?false:true, message: '请输入原因', trigger: 'change' },
        ]"
      >
        <el-input type="textarea" class="textarea" v-model.trim="form.examineRemark"/>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      infoList: [],
      productList: [],
      productcolumns: [
        { label: '图片', value: 'productImg', img: true },
        { label: 'SKU', value: 'productSku' },
        { label: '产品名称', value: 'nameZh' },
        { label: '价格', value: 'productPrice' },
        { label: '订购数量', value: 'orderAmount' },
        { label: '退款数量', value: 'refundAmount' }
      ],
      form: {
        state: 0,
        examineRemark: ''
      }
    }
  },
  methods: {
    submitForm(orderRefundId, callback) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api['email/refundExamine'](
            Object.assign(
              {},
              {
                orderRefundIds: Array.of(orderRefundId)
              },
              this.form
            )
          ).then(res => {
            this.$message.success(res.msg)
            callback && callback()
          })
        } else {
          return false
        }
      })
    },
    /* eslint-disable */
    async getInfo(orderRefundId) {
      let {} = await this.getBaseInfo(orderRefundId)

      // let {} = await this.getOrderInfo()
    },
    getBaseInfo(orderRefundId) {
      this.loading = true
      return this.$api['email/refundInfo']({ orderRefundId })
        .then(res => {
          let {
            orderNumSystem,
            orderTime,
            orderAmount,
            retiredMoney,
            refundModeName,
            orderNumPlatform,
            refundMoney,
            customerDetail,
            deliveryStatusName,
            refundPayTypeName,
            payee,
            applyTime,
            refundStatusName,
            payeeAccount,
            refundTime,
            refundTypeName,
            refundReasonPlatformName,
            products
          } = res.rows
          this.productList = products
          this.infoList = [
            { label: '订单号', value: orderNumSystem },
            { label: '下单时间', value: orderTime },
            { label: '订单金额', value: orderAmount },
            { label: '已退金额', value: retiredMoney },
            { label: '退款类型', value: refundModeName },
            { label: '平台订单号', value: orderNumPlatform },
            { label: '退款金额', value: refundMoney },
            { label: '状态', value: deliveryStatusName },
            { label: '退款方式', value: refundPayTypeName },
            { label: '收款人', value: payee },
            { label: '申请时间', value: applyTime },
            { label: '退款状态', value: refundStatusName },
            { label: '收款账号', value: payeeAccount },
            { label: '退款时间', value: refundTime },
            { label: '退款类型', value: refundTypeName },
            {
              label: '平台退款原因',
              value: refundReasonPlatformName
            },
            { label: '客户详情', value: customerDetail }
          ]
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getOrderInfo() {
      //
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/css/common.scss';
</style>