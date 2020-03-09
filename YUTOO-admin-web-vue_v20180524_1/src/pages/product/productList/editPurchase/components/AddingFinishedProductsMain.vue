<template>
  <ProductDeliveryPackage v-if="!!isTab" ref="parentTab" :productid="parentId" :up-index="curIndex"></ProductDeliveryPackage>
  <vue-tabs v-else ref="tab" @tab-change="onTabClick">
    <!-- 母体 -->

    <v-tab title="母体">
      <v-card class="product_box" :loading="loading" parent="1" noHovering>
        <ProductDeliveryPackage ref="parentTab" :productid="parentId" :up-index="curIndex" v-if="curIndex ==0"></ProductDeliveryPackage>
      </v-card>
    </v-tab>
    <!-- 变体 -->

    <v-tab v-for="(val, key) in variantEntityList" :key="key" :title="val.variant.sku">
      <v-card class="product_box" :loading="loading" noHovering>
        <ProductDeliveryPackage ref="subTab" :productid="val.variant.productId" :up-index="curIndex" v-if="curIndex == key+1"></ProductDeliveryPackage>
      </v-card>
    </v-tab>
  </vue-tabs>
</template>

<script>
import ProductDeliveryPackage from "./AddingFinishedProducts";
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
      let ret;
      try {
        ret = this.$attrs.allData.variantTab.productVariantList;
      } catch (e) {
        ret = [];
      }
      return ret;
    },

    // 判断是否显示tab
    isTab() {
      console.log(this.$attrs);
      return !!this.$attrs.allInfo.materialsTabField[0];
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
