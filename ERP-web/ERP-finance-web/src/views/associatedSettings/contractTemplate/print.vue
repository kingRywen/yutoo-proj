<template>
  <div class="print">
    <div class="noprint" style="text-align: right;
    position: absolute;
    top: -50px;
    right: 40px;">
      <el-button type="text" icon="el-icon-printer" @click="printPage">打印合同</el-button>
      <!-- <el-button type="text" icon="el-icon-download">下载合同</el-button> -->
    </div>

    <table class="compact" :class="tableClass" style="width:790px">
      <tbody>
        <tr class="normal-tr">
          <td colspan="3">
            <h2 style="margin-left: 320px">采购合同</h2>
          </td>
        </tr>
        <tr class="normal-tr">
          <td colspan="3">合同编号: {{form.ruleInfo}}</td>
        </tr>
        <tr class="normal-tr">
          <td>甲方: {{form.companyName}}</td>
          <td>电话: {{form.phone}}</td>
          <td>QQ: {{form.qq}}</td>
        </tr>
        <tr class="normal-tr">
          <td colspan="3">地址: {{form.companyAddress}}</td>
        </tr>
        <tr class="normal-tr">
          <td>乙方:</td>
          <td>电话:</td>
          <td>QQ:</td>
        </tr>
        <tr class="normal-tr">
          <td colspan="3">地址:</td>
        </tr>
        <tr class="normal-tr">
          <td colspan="3">
            <p>甲、乙双方本着平等、自愿、协商一至的原则，经过充分协商，根据下列条款订立合同：</p>
            <p class="bolder">(一) 、 采购明细及交货方式如下： 下单号({{form.lowerSingleNumber}})</p>
            <table class="showBorder">
              <tr>
                <td>产品编号</td>
                <td>报送英文名(中文名)</td>
                <td>名称</td>
                <td>图片</td>
                <td>自定义SKU</td>
                <td>数量(PCS)</td>
                <td>单价(RMB)</td>
                <td>金额(RMB)</td>
              </tr>
              <tr v-for="item in form.products" :key="item.id">
                <!--  { "customSku": "bra-0093-B+C-M", "quantity": 4, "productId": "8912", "totalPrice": 12, "nameZh": "sbsdb", "price": 3, "productImg": "https://yutoo-admin-erp.oss-cn-shenzhen.aliyuncs.com/upload/1/product/img/20190117/1547688821404/1547688819868.jpg", "nameEn": "dddd" } -->
                <td>{{item.productId}}</td>
                <td>{{item.nameEn}}({{item.nameZh}})</td>
                <td>{{item.nameZh}}</td>
                <td>
                  <img :src="item.productImg" width="50" />
                </td>
                <td>{{item.customSku}}</td>
                <td>{{item.quantity}}</td>
                <td>{{item.price}}</td>
                <td>{{item.totalPrice}}</td>
              </tr>
              <tr>
                <td rowspan="2" colspan="6">备注：</td>
                <td>运费</td>
                <td>{{form.freightAmount}}</td>
              </tr>
              <tr>
                <td>合计</td>
                <td>{{compactTotalPrice}}</td>
              </tr>
            </table>
            <p>合计金额(RMB)： {{compactTotalPrice | numToBig}}</p>
            <p>交货日期： {{form.time}}</p>
            <!-- <p>交货地点： {{}}</p>
            <p>价格条款： {{}}</p>-->
            <p>付款方式： {{form.paymentMethodName}}</p>
            <p class="bolder">(二) 、 合同条款：</p>
            <div ref="html" id="html" style="text-indent: 2rem;" v-html="form.contractClause"></div>
            <p>
              <br />
            </p>
            <p>
              <br />
            </p>

            <el-row>
              <el-col :span="6" style="text-align:right">
                <p>甲方签名(盖公章)：</p>
                <p>日期：</p>
              </el-col>
              <el-col :offset="6" :span="6" style="text-align:right">
                <p>乙方签名(盖公章)：</p>
                <p>日期：</p>
              </el-col>
            </el-row>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import storage from 'Utils/saver.js'
import { smalltoBIG } from 'Utils/tools'
export default {
  data() {
    return {
      form: {
        contractClause: ''
      },
      tableClass: 'gridtable',
      compactTotalPrice: ''
    }
  },
  created() {
    this.form = storage.get('local', 'contract-template-print')
  },
  methods: {
    getFormData(params) {
      this.form = params
    },
    printPage() {
      window.print()
    }
  },
  filters: {
    numToBig(val) {
      return smalltoBIG(val)
    }
  }
}
</script>

<style lang='scss'>
.print {
  // .noprint {
  //   display: none !important;
  // }
  width: 800px;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  margin: auto;
  margin-top: 50px;
  table {
    margin-top: 60px;
  }
  .line1 {
    font-size: 12px !important;
    p {
      line-height: 1 !important;
    }
  }
  table.compact {
    td {
      border-color: transparent;
    }
    .showBorder {
      margin-top: 0;
      td {
        border-color: #333;
      }
    }
    line-height: 1.8;
    margin-top: 0;
    border: none;
    h2 {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }
  }
  #html {
    p {
      white-space: normal;
    }
  }
  .normal-tr {
    padding: 0;
    & > td {
      padding: 6px;
    }
  }
}
</style>