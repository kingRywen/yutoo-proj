<template>
  <div>
    <ProductDeliveryPackage v-if="!isTab" :productid="parentId" :up-index="curIndex" :show="$attrs.show" :parent="1"></ProductDeliveryPackage>

    <el-tabs v-else ref="tab" type="border-card" v-model="name" class="__flex__column___ fixedHeight" style="padding-bottom: 0;">
      <el-tab-pane label="母体" key="母体" name="母体" lazy>
        <ProductDeliveryPackage ref="parentTab" :productid="parentId" v-if="name === '母体'" :up-index="curIndex" :show="$attrs.show" :parent="1"></ProductDeliveryPackage>
      </el-tab-pane>
      <el-tab-pane v-for="(val, key) in variantEntityList" :label="val.sku" :key="val.sku" :name="val.sku" lazy>
        <ProductDeliveryPackage ref="subTab" :productid="val.productId" :up-index="curIndex" v-if="name === val.sku" :show="$attrs.show"></ProductDeliveryPackage>
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
import ProductDeliveryPackage from "./ProductDeliveryPackage";
import { fetchData, toParamUrl, handlerCode } from "common/common";
import apis from "apis";
import { getQueryString } from "common/util";
export default {
  inheritAttrs: false,
  components: {
    ProductDeliveryPackage
  },
  created() {
    this.productId = +getQueryString("productId");
    this.variantMode = +getQueryString("variant");
    if (getQueryString("variant")) {
      this.parentId = this.$attrs.allData.baseTab.productEntity.productId;
    }
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
  data() {
    return {
      commitLoading: false,
      name: "母体",
      Tabs: {},
      loading: false,
      parentId: +getQueryString("productId"),
      curIndex: 0
    };
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
