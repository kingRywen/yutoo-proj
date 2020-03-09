<template lang="html">
    <div class="chart">
        <el-row :gutter="10">
            <el-col :span="12">
                <layout>
                    <template slot="title">SOUQ全站商品统计</template>
                    <template slot="content">
  <el-row>
    <el-col :span="6" class="statistics_item">
      <div @click="goGoods(1)">
        <h3>商品总数</h3>
        <p>
          <count-to class="font-num" :startVal='0' :endVal.number='statisticsLeft_Data.productCnt || 0' :duration='1800'></count-to>
          <!-- <span class="font-num">{{statisticsLeft_Data.productCnt | toThousands }}</span> -->
          <el-button type="success" size="mini" class="btn">件</el-button>
        </p>
      </div>
    </el-col>
    <el-col :span="6" class="statistics_item">
      <div @click="goGoods(2)">
        <h3>近7天新增产品总数</h3>
        <p>
          <count-to class="font-num" :startVal='0' :endVal.number='statisticsLeft_Data.newProductCntD7 || 0' :duration='1800'></count-to>
          <!-- <span class="font-num">{{statisticsLeft_Data.newProductCntD7 | toThousands}}</span> -->
          <el-button type="success" size="mini" class="btn">件</el-button>
        </p>
      </div>
    </el-col>
    <el-col :span="6" class="statistics_item">
      <div @click="goGoods(3)">
        <h3>有销量的商品总数</h3>
        <p>
          <count-to class="font-num" :startVal='0' :endVal.number='statisticsLeft_Data.salesProductCnt || 0' :duration='1800'></count-to>
          <!-- <span class="font-num">{{statisticsLeft_Data.salesProductCnt | toThousands}}</span> -->
          <el-button type="success" size="mini" class="btn">件</el-button>
        </p>
      </div>
    </el-col>
    <el-col :span="6" class="statistics_item">
      <div @click="goGoods(4,statisticsLeft_Data.sku)">
        <h3>销量最高产品</h3>
        <p>
          <span class="font-num">{{statisticsLeft_Data.sku}}</span>
        </p>
      </div>
    </el-col>
  </el-row>
</template>
                </layout>
            </el-col>
            <el-col :span="12">
                <layout>
                    <template slot="title">SOUQ全站店铺统计</template>
                    <template slot="content">
  <el-row>
    <el-col :span="6" class="statistics_item" @click="goRouter(1)">
      <div @click="goShop(1)">
        <h3>店铺总数</h3>
        <p>
          <count-to class="font-num" :startVal='0' :endVal.number='statisticsRight_Data.shopCnt || 0' :duration='1800'></count-to>
          <!-- <span class="font-num">{{statisticsRight_Data.shopCnt | toThousands}}</span> -->
          <el-button type="success" size="mini" class="btn">件</el-button>
        </p>
      </div>
    </el-col>
    <el-col :span="6" class="statistics_item" @click="goRouter(2)">
      <div @click="goShop(2)">
        <h3>近7天新增店铺总数</h3>
        <p>
          <count-to class="font-num" :startVal='0' :endVal.number='statisticsRight_Data.newShopCntD7 || 0' :duration='1800'></count-to>
          <!-- <span class="font-num">{{statisticsRight_Data.newShopCntD7 | toThousands}}</span> -->
          <el-button type="success" size="mini" class="btn">件</el-button>
        </p>
      </div>
    </el-col>
    <el-col :span="6" class="statistics_item" @click="goRouter(3)">
      <div @click="goShop(3)">
        <h3>有销量的店铺总数</h3>
        <p>
          <count-to class="font-num" :startVal='0' :endVal.number='statisticsRight_Data.salesShopCnt || 0' :duration='1800'></count-to>
          <!-- <span class="font-num">{{statisticsRight_Data.salesShopCnt | toThousands}}</span> -->
          <el-button type="success" size="mini" class="btn">件</el-button>
        </p>
      </div>
    </el-col>
    <el-col :span="6" class="statistics_item" @click="goRouter(4,statisticsRight_Data.sellerName)">
      <div @click="goShop(4,statisticsRight_Data.sellerName)">
        <h3>最高销量店铺</h3>
        <p>
          <span class="font-num">{{statisticsRight_Data.sellerName}}</span>
        </p>
      </div>
    </el-col>
  </el-row>
</template>
                </layout>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import countTo from "vue-count-to";
import layout from "../base/layout";
export default {
  props: {
    statisticsLeft_Data: {
      type: Object,
      default: function() {
        return {};
      }
    },
    statisticsRight_Data: {
      type: Object,
      default: function() {
        return {};
      }
    },
    paramsGoods: {
      type: String,
      default: ""
    },
    paramsShop: {
      type: String,
      default: ""
    }
  },
  filters: {
    toThousands(num) {
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    }
  },
  methods: {
    //获取今天时间
    getDate() {
      let date = new Date();
      let year = date.getFullYear(); //获取当前年份
      let mon = date.getMonth() + 1; //获取当前月份
      let day = date.getDate(); //获取当前日
      return (
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    //
    goGoods(num, msg) {
      let query = {};
      switch (num) {
        case 1:
          if (this.paramsGoods) {
            query["parentCategory"] = this.paramsGoods;
          }
          break;
        case 2:
          query["releaseData"] = [
            this.statisticsLeft_Data.statTime,
            this.getDate()
          ].join(",");
          break;
        case 3:
          query["reviewCnt"] = 1;
          break;
        case 4:
          query["top1"] = msg;
          break;
      }
      this.$router.push({
        path: "/product/ProductAnalysis",
        query
      });
      console.log(query);
    },
    goShop(num, msg) {
      let query = {};
      switch (num) {
        case 1:
          if (this.paramsShop) {
            query["parentCategory"] = this.paramsShop;
          }
          break;
        case 2:
          query["releaseData"] = [
            this.statisticsLeft_Data.statTime,
            this.getDate()
          ].join(",");
          break;
        case 3:
          query["reviewCnt"] = 1;
          break;
        case 4:
          query["top1"] = msg;
          break;
      }
      this.$router.push({
        path: "/shop/ShopAnalysis",
        query
      });
    }
  },
  components: {
    layout,
    countTo
  }
};
</script>

<style lang="scss">
.statistics_item {
  border-right: 1px solid rgba(229, 229, 229, 1);
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
  &:last-child {
    border: none;
    padding-right: 0;
  }
  &:first-child {
    padding-left: 0;
  }
  h3 {
    margin: 10px 0 0 0;
    padding: 0;
    font-size: 15px;
    color: #424f62;
    font-weight: 400;
  }
  p {
    margin: 24px 0 0 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    span {
      line-height: 28px;
      font-family: "NSimSun";
      font-weight: 600;
      font-size: 14px;
      color: #202020;
      &:last-child {
        margin: 0 auto;
      }
    }
    .btn {
      cursor: auto;
      height: 25px;
      margin-left: 10px;
      font-size: 16px;
      padding: 0px 15px;
      background: rgba(48, 204, 123, 1);
      border: none;
      span {
        color: #fff;
      }
    }
  }
}
</style>
