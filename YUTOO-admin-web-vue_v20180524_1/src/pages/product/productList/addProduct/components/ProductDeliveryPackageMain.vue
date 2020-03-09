<template>
  <ProductDeliveryPackage v-if="!isTab"></ProductDeliveryPackage>
  <vue-tabs v-else ref="tab" @tab-change="onTabClick">
    <!-- 母体 -->

    <v-tab title="母体">
      <v-card class="product_box" :loading="loading" parent="1" noHovering>
        <ProductDeliveryPackage ref="parentTab" :productid="parentId" :up-index="curIndex" v-if="curIndex === 0"></ProductDeliveryPackage>
      </v-card>
    </v-tab>
    <!-- 变体 -->

    <v-tab v-for="(val, key) in variantEntityList" :key="key" :title="val.sku">
      <v-card class="product_box" :loading="loading" noHovering>
        <ProductDeliveryPackage ref="subTab" :productid="val.productId" :up-index="curIndex" v-if="(key+1) === curIndex"></ProductDeliveryPackage>
      </v-card>
    </v-tab>
  </vue-tabs>
</template>

<script>
import ProductDeliveryPackage from "./ProductDeliveryPackage";
import { getQueryString } from "common/util";
export default {
  inheritAttrs: false,
  components: {
    ProductDeliveryPackage
  },
  data() {
    return {
      Tabs: {},
      loading: false,
      parentId: +getQueryString("productId"),
      curIndex: 0
    };
  },
  methods: {
    onTabClick(i, oldVue, newVue) {
      this.curIndex = i;
    }
  },
  computed: {
    // 获取变体list
    variantList() {
      let ret;
      try {
        ret = this.$attrs.allData.variantTab.productVariantList;
      } catch (e) {
        ret = [];
      }
      return ret;
    },

    // 获取basetab
    variantEntityList() {
      return this.$attrs.allData.baseTab.variantEntityList;
    },

    // 判断是否显示tab
    isTab() {
      return !!this.$attrs.tabInfo.packageTabField[0];
    }
  },
  watch: {
    // 监控根组件的变体数量
    variantList: {
      immediate: true,
      deep: true,
      handler: function(val) {
        this.Tabs = {};
        val.map(el => {
          this.Tabs[el.variant.sku] = {};
        });
      }
    }
  }
};
</script>

<style>
</style>
