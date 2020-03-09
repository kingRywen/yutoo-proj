<template>
  <Portfolios v-if="!isTab" :show="$attrs.show" ref="parentTab" :productid="parentId"></Portfolios>
  <vue-tabs v-else ref="tab" @tab-change="onTabClick">
    <!-- {{parentId}} -->
    <!-- 母体 -->

    <v-tab title="母体">
      <v-card class="product_box" :loading="loading" parent="1" noHovering>
        <Portfolios ref="parentTab" :productid="parentId" :up-index="curIndex" v-if="curIndex === 0" :show="$attrs.show"></Portfolios>
      </v-card>
    </v-tab>
    <!-- 变体 -->

    <v-tab v-for="(val, key) in variantEntityList" :key="key" :title="val.sku">
      <v-card class="product_box" :loading="loading" noHovering>
        <Portfolios ref="subTab" :productid="val.productId" :up-index="curIndex" v-if="(key+1) === curIndex" :show="$attrs.show"></Portfolios>
      </v-card>
    </v-tab>
  </vue-tabs>
</template>

<script>
import Portfolios from "./Portfolios";
import { getQueryString } from "common/util";
export default {
  inheritAttrs: false,
  components: {
    Portfolios
  },
  created() {
    if (getQueryString("variant")) {
      this.parentId = this.$attrs.allData.baseTab.productEntity.productId;
    }
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
      return !!this.$attrs.tabInfo.group[0];
    }
  },
  watch: {
    // 监控根组件的变体数量
    variantList: {
      immediate: true,
      deep: true,
      handler: function(val) {
        if (!val) {
          return;
        }
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
