<template>
  <div class="plan-preview">
    <el-row class="main">
      <el-col :span="6">店铺名称：{{info.storeName}}</el-col>
      <el-col :span="6">批次号：{{info.batchNumber}}</el-col>
      <el-col :span="6">发货时间：{{info.sendTimeString}}</el-col>
      <el-col :span="6">ShippingID：{{info.shippingId}}</el-col>
    </el-row>
    <el-row class="track">
      <el-col :span="24">运单号：{{info.trackingNumbers && info.trackingNumbers.join('，')}}</el-col>
    </el-row>
    <yt-table class="mt10" :selection="false" :columns="columns" :data="info.rows"></yt-table>
  </div>
</template>
<script>
export default {
  props: ['queries'],
  data() {
    return {
      columns: [
        {
          label: 'SellerSKU',
          value: 'sellerSku'
        },
        {
          label: 'FNSKU',
          value: 'fnsku'
        },
        {
          label: '计划数量',
          value: 'planShiped'
        },
        {
          label: '实发数量',
          value: 'shipped'
        },
        {
          label: '签收数量',
          value: 'received'
        },
        {
          label: '问题数量',
          value: 'inCase'
        }
      ],
      info: {
        rows: [],
        trackingNumbers: []
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.$api[`fba/FbaReplenishShippingViewReceiving`](this.queries).then(
        data => {
          this.info = data.data
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.plan-preview {
  font-family: Arial, Helvetica, sans-serif;
  .main {
    .el-col {
      // line-height: 2;
      padding: 10px;
      background-color: #d3dce6;
      &:nth-child(even) {
        background-color: #e5e9f2;
      }
      &:first-child {
        border-radius: 5px 0 0 5px;
      }
      &:last-child {
        border-radius: 0 5px 5px 0;
      }
    }
  }
  .track {
    margin-top: 8px;
    .el-col {
      border-radius: 5px;
      padding: 10px;
      background-color: #d3dce6;
    }
  }
}
</style>