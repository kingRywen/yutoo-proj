<!-- 公共弹窗 -->
<template>
  <div class="common_dialog">
    <section class="imgcon">
      <div class="__img_wrapper">
        <img class="loadingImg" :key="data.data.imageUrl" v-if="data.data.imageUrl" v-lazy="data.data.imageUrl?data.data.imageUrl:'-'">
      </div>
      <div class="flex_1">
        <div class="content">
          <span>标题 ：</span>
          <span class="title">{{data.data.title||"-"}}</span>
          <div style="margin-top:5px;">
            <span class="inline_block">ASIN ：</span>
            <span class="inline_block">{{data.data.sku||"-"}}</span>
            <span class="inline_block" style="margin-left:20px;">卖家名称 ：</span>
            <span class="inline_block">{{data.data.sellerName||"-"}}</span>
            <ul class="ul">
              <li class="top left">好评占比</li>
              <li class="top">{{data.data.positiveRate | KeepTwoDecimal}}</li>
              <!-- 价格 -->
              <li class="top">价格</li>

              <el-tooltip v-if="data.data.price!==''&&data.data.price!==null" placement="top" :open-delay="50">
                <div slot="content">{{data.data.price | filterHtml}}</div>
                <li class="lg __row_1"> {{data.data.price||"-"}}</li>
              </el-tooltip>

              <li v-if="data.data.price===''||data.data.price==null" class="top">-</li>
              <!-- 价格 end-->
              <li class="top">
                订单数
              </li class="top">
              <li>{{data.data.orderCnt!==null&&data.data.orderCnt!==0?data.data.orderCnt:"-"}}</li>
              <li class="left">Q&A数</li>
              <li>{{data.data.qaCnt || "-"}}</li>
              <li>是否包邮</li>
              <li>{{data.data.isPinkage&&data.data.isPinkage===1?"是":data.data.isPinkage===0?"否":'-'}}</li>
              <li>评分</li>
              <li>{{data.data.starCnt || "-"}}</li>
              <li class="left">评价总数</li>
              <li>{{data.data.reviewCnt || "-"}}</li>
              <li>卖家数</li>
              <li>{{data.data.sellerCnt || "-"}}</li>
              <li>是否在售</li>
              <li>{{data.data.isSales&&data.data.isSales===1?"是":data.data.isSales===0?"否":'-'}}</li>
              <li class="left">发货方式</li>
              <li>{{data.data.fbpFlag | FBA_Filter_Intable}}</li>
              <li>BSR排名</li>
              <li>{{data.data.rank || "-"}}</li>
              <li>变体数</li>
              <li>{{data.data.skuCnt || "-"}}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["data"],
  data() {
    return {};
  },

  created() {
    // for (let i in this.data.data) {
    //   this.data.data[i] = null;
    // }
  },
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.common_dialog {
  .spe {
    .el-form-item__label {
      line-height: 0;
    }
  }
}
.imgcon {
  width: 100%;
  height: 180px;
  display: flex;
  .__img_wrapper {
    width: 180px;
    height: 160px;
    margin-left: 20px;
    overflow: hidden;
    background-color: #e8e8e8;
    img {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    img[lazy="loaded"] {
      background: #fff;
    }
  }
  .flex_1 {
    flex: 1;
    width: 100%;
    height: 94%;
    .content {
      margin-left: 30px;
      .ul {
        width: 600px;
        box-sizing: border-box !important;
        border-top: 1px solid #e4e4e4;
        margin-top: 10px;
        &:after {
          clear: both;
          display: table;
          content: " ";
        }
        li {
          // display: inline-block;
          float: left;
          width: 100px;
          text-align: center;
          list-style: none;
          border-right: 1px solid #e4e4e4;
          border-bottom: 1px solid #e4e4e4;
          box-sizing: border-box !important;
          height: 28px;
          line-height: 28px;
        }
        li:nth-child(odd) {
          background: #f2f2f2;
        }
        .left {
          border-left: 1px solid #e4e4e4;
        }
      }
    }
  }
}
</style>
