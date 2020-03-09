<template>
  <div class="look">
    <div class="mrb10">
      <div class="title mrb10">订单信息</div>
      <el-row class="info">
        <el-col :span="8" v-for="item in orderInfo" :key="item.id" class="item">
          <span class="label">{{item.label}}</span>
          <span class="value">{{ allInfoObj[item.value] || '-'}}</span>
        </el-col>
      </el-row>
    </div>
    <!--  -->
    <div class="mrb10">
      <div class="title mrb10">退款产品</div>
      <yt-table :data="allInfoObj.productInfo" :columns="columns" border :selection="false"></yt-table>
    </div>
    <!--  -->
    <div class="mrb10">
      <div class="title mrb10">退款信息</div>
      <el-row class="info">
        <el-col
          :span="index==(refundInfoList.length-1)?24:8"
          v-for="(item,index) in refundInfoList"
          :key="index"
          class="refund-item"
        >
          <span class="label">{{item.label}}</span>
          <span class="value">{{ allInfoObj.refundInfo && allInfoObj.refundInfo[item.value] || '-'}}</span>
        </el-col>
      </el-row>
    </div>
    <!--  -->
    <div class="mrb10">
      <div class="title mrb10">退款状态</div>
      <el-row class="refundStatus">
        <el-col :span="24" v-for="(item,index) in refundStatusList" :key="item.id" class="status-item">
          <el-row>
            <el-col
              :span="4"
              class="left"
              :style="((refundStatusList.length-1)==index)?'height: 80px;line-height: 60px;':''"
            >
              <span>{{item.label}}</span>
            </el-col>
            <el-col :span="20" class="right">
              <template v-if="(refundStatusList.length-1)==index">
                <el-carousel trigger="click" height="60px">
                  <el-carousel-item
                    v-for="(j,k) in (allInfoObj.refundStatus && allInfoObj.refundStatus[item.value]) || []"
                    :key="k"
                  >
                    <div style="text-align: center;">
                      <img :src="j" height="60px" width="auto" />
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </template>
              <span v-else>{{ allInfoObj.refundStatus && allInfoObj.refundStatus[item.value] || '-'}}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderInfo: [
        { label: '订单号：', value: 'orderNumber' },
        { label: '下单时间：', value: 'createTime' },
        { label: '订单金额：', value: 'orderAmount' }
      ],
      columns: [
        { label: 'SKU', value: 'productSku' },
        { label: '产品名称', value: 'productZh' },
        { label: '价格', value: 'refundPrice' },
        { label: '订购数量', value: 'orderQuantity' },
        { label: '退款数量', value: 'refundAmount' }
      ],
      refundInfoList: [
        { label: '已退金额：', value: 'retiredMoney' },
        { label: '退款类型：', value: 'refundPayTypeName' },
        { label: '退款银行：', value: 'payBank' },
        { label: '退款方式：', value: 'refundModeName' },
        { label: '收款人：', value: 'payee' },
        { label: '收款账号：', value: 'payeeAccount' },
        { label: '退款原因（一级）：', value: 'refundReasonFirstName' },
        { label: '（二级）：', value: 'refundReasonSecondName' },
        { label: '退款金额：', value: 'refundMoney' },
        { label: '平台退款原因：', value: 'refundReasonPlatformName' },
        { label: '退款类型：', value: 'refundTypeName' },
        { label: '货物处理：', value: 'cargoHandlerName' },
        { label: '退货备注：', value: 'remark' }
      ],
      refundStatusList: [
        { label: '审核状态', value: 'examineStateName' },
        { label: '审核人员', value: 'examineName' },
        { label: '退款人员', value: 'operationName' },
        { label: '退款操作时间', value: 'refundTime' },
        { label: '退款凭证', value: 'fileList' }
      ],
      allInfoObj: {
        productInfo: []
      }
    }
  },
  methods: {
    initData(row) {
      this.$api['finance/financeRefundInfo']({
        refundId: row.refundId
      }).then(res => {
        this.$nextTick(() => {
          this.allInfoObj = res.rows
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.look {
  padding: 0 10px;
  max-height: 580px;
  overflow-y: auto;
}
.mrb10 {
  margin-bottom: 10px;
}
.title {
  font-size: 15px;
  font-weight: 700;
}
.info {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  margin: 0;
  .item {
    text-align: center;
  }
  .refund-item {
    padding: 10px 0;
  }
  .label {
    font-size: 14px;
  }
  .value {
  }
}
.refundStatus {
  border: 1px solid #ebeef5;
}
.status-item {
  .el-row {
    border-bottom: 1px solid #ebeef5;
  }
  .el-col {
    padding: 10px 0;
  }
  .left {
    text-align: center;
    padding: 10px;
    border-right: 1px solid #ebeef5;
    background: #f3f3f3;
  }
  .right {
    padding-left: 10px;
  }
}
</style>

