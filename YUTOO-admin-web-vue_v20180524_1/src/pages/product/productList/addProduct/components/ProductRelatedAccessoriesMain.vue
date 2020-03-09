<template>
  <ProductRelatedAccessories v-if="!isTab" :product-id="parentId"></ProductRelatedAccessories>

  <vue-tabs v-else ref="tab" @tab-change="onTabClick">
    <!-- 母体 -->
    <v-tab title="母体">
      <v-card class="product_box" :loading="loading" parent="1" noHovering>
        <ProductRelatedAccessories :product-id="parentId" :up-index="curIndex" parent="1" v-if="curIndex === 0"></ProductRelatedAccessories>
      </v-card>
    </v-tab>
    <!-- 变体 -->
    <v-tab v-for="(val, key) in variantEntityList" :key="key" :title="val.sku">
      <v-card class="product_box" :loading="loading" noHovering>
        <ProductRelatedAccessories :product-id="val.productId" :up-index="curIndex" v-if="curIndex === key+1"></ProductRelatedAccessories>
      </v-card>
    </v-tab>
  </vue-tabs>
</template>

<script>
import ProductRelatedAccessories from "./ProductRelatedAccessories";
import { getQueryString } from "common/util";
export default {
  inheritAttrs: false,
  components: {
    ProductRelatedAccessories
  },
  data() {
    return {
      Tabs: {},
      loading: false,
      curIndex: 0
    };
  },
  methods: {
    onTabClick(i, oldVue, newVue) {
      console.log(i);
      this.curIndex = i;
    }
  },
  computed: {
    // 获取basetab
    variantEntityList() {
      return this.$attrs.allData.baseTab.variantEntityList;
    },
    // 获取变体list
    variantList() {
      let ret;
      try {
        ret = this.$attrs.allData.baseTab.variantEntityList;
      } catch (e) {
        ret = [];
      }
      return ret;
    },

    // 判断是否显示tab
    isTab() {
      return !!this.$attrs.tabInfo.attachmentTabField[0];
    },

    parentId() {
      return +getQueryString("productId");
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
          this.Tabs[el.sku] = {};
        });
      }
    }
  }
};
</script>

<style>
</style>
