<!-- 店铺信息 -->
<template>
  <div class="shopMsg">
    <!-- {{this.childDetail}} -->
    <!-- 1 -->
    <div class="p1">
      <span class="s1">{{this.childDetail.sellerName&&this.childDetail.sellerName!=""?this.childDetail.sellerName:"-"}}</span>
      </a>
      <span class="s2" @click="jumpTo">{{this.childDetail.sellerId&&this.childDetail.sellerId!=""?this.childDetail.sellerId:"-"}}</span>
      <div style="margin-top:20px;font-size:14px">
        当前类目：
        <span class="s3" @click="reloadAll">全部</span>

        <span class="s4" v-if="this.category">&nbsp;&gt;&nbsp;{{this.category}}</span>
      </div>
    </div>
    <!-- 2 -->
    <div class="p2" v-if="this.childDetail">
      <span>{{shopDesc}} </span>
      <a class="s2" v-if="this.childDetail.sellerDesc.length>0?true:false" @click="TextSwitch">{{this.text}}</a>
    </div>
    <!-- 3 -->
    <div class="p3">
      <span>商品总数：</span>
      <span>{{this.childDetail.productCnt}}</span>
      <span class="s3">类目总数：</span>
      <span>{{this.childDetail.categoryCnt}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "shopMsg",
  components: {},
  props: {
    childDetail: {},
    reloadAll: {}
  },
  data() {
    return {
      text: "展开"
    };
  },
  created() {},
  mounted() {},
  methods: {
    jumpTo() {
      // 点击店铺跳转
      window.open(this.childDetail.sellerUrl);
    },
    TextSwitch() {
      if (this.text == "展开") {
        this.text = "收起";
        return;
      }
      if (this.text == "收起") {
        this.text = "展开";
        return;
      }
    }
  },
  computed: {
    // 计算出文字大于400则显示一部分
    shopDesc() {
      let computedText;
      if (this.text == "展开") {
        computedText =
          this.childDetail.sellerDesc && this.childDetail.sellerDesc != ""
            ? this.childDetail.sellerDesc.length < 200
              ? this.childDetail.sellerDesc
              : this.childDetail.sellerDesc.slice(0, 200) + "......"
            : "暂无相关介绍";
        return computedText;
      }
      if (this.text == "收起") {
        computedText = this.childDetail.sellerDesc;
        return computedText;
      }
    },
    category() {
      return this.$store.state.competitive.categoryChange;
    }
  },
  watch: {}
};
</script>

<style lang='scss' scoped>
.shopMsg {
  width: 40%;
  min-height: 30px;
  .p1 {
    .s1 {
      font-size: 16px;
      font-weight: bold;
    }
    .s2 {
      color: #0000ff;
      margin-left: 40px;
      font-size: 15px;
      cursor: pointer;
      text-decoration: underline;
    }
    .s3 {
      cursor: pointer;
      padding: 2px;
      color: #9c9cff;
    }
    .s4 {
      color: #999;
      font-size: 14px;
    }
  }
  .p2 {
    margin-top: 20px;
    font-size: 14px;
    color: #555;
    .s2 {
      color: #0000ff;
      cursor: pointer;
    }
    .s2:hover {
      text-decoration: underline;
    }
  }
  .p3 {
    margin-top: 12px;
    font-size: 14px;
    .s3 {
      margin-left: 40px;
    }
  }
}
</style>
