<template>
  <div>
    <!-- {{imgs}} {{$attrs.tabInfo.imgTabField}} -->

    <!-- 只显示母体 -->
    <v-card class="product_box" :loading="loading" v-if="$attrs.tabInfo && $attrs.tabInfo.imgTabField[0] != 1">
      <keep-alive>
        <uploadImg @setvariantimg="setvariantimg" ref="upload" :imgs.sync="imgs" parent="1" :product-id="parentId"></uploadImg>
      </keep-alive>
    </v-card>

    <!-- 显示母体和变体 -->
    <vue-tabs v-else ref="tab" @tab-change="onTabChange">
      <!-- 母体 -->
      <v-tab title="母体">
        <v-card class="product_box" :loading="loading">
          <keep-alive>
            <uploadImg @setvariantimg="setvariantimg" ref="upload" :imgs.sync="imgs" parent="1" :product-id="parentId"></uploadImg>
          </keep-alive>
        </v-card>
      </v-tab>
      <!-- 变体 -->
      <v-tab v-for="(val, key) in variantEntityList" :key="key" :title="val.sku">
        <v-card class="product_box" :loading="loading">
          <keep-alive>
            <uploadImg ref="upload" :variantFiles="imgs" :product-id="val.productId"></uploadImg>
          </keep-alive>
        </v-card>
      </v-tab>
    </vue-tabs>

  </div>
</template>

<script>
import { getQueryString } from "common/util";
import uploadImg from "components/base/uploadImg.vue";
export default {
  inheritAttrs: false,
  components: {
    uploadImg
  },
  created() {
    this.parentId = +getQueryString("productId");
  },
  data() {
    return {
      parentId: "",
      Tabs: {},
      loading: false,
      imgs: [] // 与母体的图片信息同步
    };
  },
  methods: {
    setvariantimg(file) {},
    onTabChange(n, newEl, oldEl) {
      this.$nextTick(() => {
        newEl.$children[0].$children[0].refreshData();
      });
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

    variantEntityList() {
      let ret = [];
      try {
        ret = this.$attrs.allData.baseTab.variantEntityList;
      } catch (e) {
        let lists = this.$attrs.allData.variantTab.productVariantList;
        lists.map((el, i) => {
          ret[i] = {
            sku: el.variant.sku,
            productId: el.variant.productId
          };
        });
      }
      return ret;
    }
  },
  watch: {
    // // 监控根组件的变体数量
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
