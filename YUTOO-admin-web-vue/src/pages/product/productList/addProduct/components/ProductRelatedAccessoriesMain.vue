<template>
  <div>
    <ProductRelatedAccessories v-if="!isTab" :product-id="parentId" parent="1" :show="$attrs.show"></ProductRelatedAccessories>

    <el-tabs v-else ref="tab" type="border-card" v-model="name" class="__flex__column___ fixedHeight" style="padding-bottom: 0;">
      <el-tab-pane label="母体" key="母体" name="母体" lazy>
        <ProductRelatedAccessories :product-id="parentId" v-if="name === '母体'" :up-index="curIndex" parent="1" :show="$attrs.show"></ProductRelatedAccessories>
      </el-tab-pane>
      <el-tab-pane v-for="(val, key) in variantEntityList" :label="val.sku" :key="val.sku" :name="val.sku" lazy>
        <ProductRelatedAccessories :product-id="val.productId" v-if="name === val.sku" :up-index="curIndex" :show="$attrs.show"></ProductRelatedAccessories>
      </el-tab-pane>
    </el-tabs>
    <div class="saveBtn" v-if="!$attrs.show">
      <div style="margin: 0 auto">
        <v-button type="primary" :disabled="$attrs.show" :loading="commitLoading" v-if="!$attrs.show && !variantMode" @click.prevent="submit">提交</v-button>
      </div>
    </div>
  </div>

</template>

<script>
import ProductRelatedAccessories from "./ProductRelatedAccessories";
import { fetchData, toParamUrl, handlerCode } from "common/common";
import apis from "apis";
import { getQueryString } from "common/util";
export default {
  inheritAttrs: false,
  components: {
    ProductRelatedAccessories
  },
  created() {
    this.productId = +getQueryString("productId");
    this.variantMode = +getQueryString("variant");
  },
  data() {
    return {
      commitLoading: false,
      Tabs: {},
      loading: false,
      curIndex: 0,
      name: "母体"
    };
  },
  methods: {
    submit() {
      this.commitLoading = true;
      fetchData({
        ...apis.PRODUCT_BASE_COMMIT,
        data: {
          productId: this.productId
        }
      }).then(res => {
        this.commitLoading = false;
        handlerCode(res, () => {
          toParamUrl("/product/productList.html");
        });
      });
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
