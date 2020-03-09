<template>
  <div>
    <!-- {{$attrs.tabInfo}} -->

    <!-- 只显示母体 -->
    <div class="product_box" :loading="loading" noHovering v-if="$attrs.tabInfo && !$attrs.tabInfo.imgTabField[0]">
      <keep-alive>
        <uploadImg ref="upload" :imgs.sync="imgs" parent="1" :product-id="parentId || productId" :show="$attrs.show" :base-save="true"></uploadImg>
      </keep-alive>
    </div>

    <!-- 显示母体和变体 -->
    <el-tabs v-else ref="tab" type="border-card" v-model="name" class="__flex__column___ fixedHeight" style="padding-bottom: 0;">
      <el-tab-pane label="母体" key="母体" name="母体" lazy>
        <uploadImg ref="upload" v-if="name === '母体'" :imgs.sync="imgs" :parent="1" :product-id="parentId || productId" :show="$attrs.show" :base-save="true"></uploadImg>
      </el-tab-pane>
      <template v-if="!isPurchase">
        <el-tab-pane v-for="(val, key) in variantEntityList" :label="val.sku" :key="val.sku" :name="val.sku" lazy>
          <uploadImg ref="upload" v-if="name === val.sku" :variantFiles="imgs" :product-id="val.productId" :show="$attrs.show" :base-save="true"></uploadImg>
        </el-tab-pane>
      </template>
      <template v-else-if="$attrs.allInfo.imgTabField[0] != null">
        <el-tab-pane v-for="(val, key) in variantList" :label="val.variant.sku" :key="val.variant.sku" :name="val.variant.sku" v-if="val.variant.activateFlag != 0" lazy>
          <uploadImg ref="upload" :variantFiles="imgs" v-if="name === val.variant.sku" :product-id="val.variant.productId" :show="$attrs.show" :base-save="true"></uploadImg>
        </el-tab-pane>
      </template>

    </el-tabs>
    <div class="saveBtn" v-if="!$attrs.show">
      <div style="margin: 0 auto">
        <v-button type="primary" :disabled="$attrs.show" :loading="commitLoading" v-if="!$attrs.show && !variantMode" @click.prevent="submit">提交</v-button>
      </div>
    </div>

  </div>
</template>

<script>
import { getQueryString } from "common/util";
import { fetchData, handlerCode, toParamUrl } from "common/common";
import uploadImg from "components/base/uploadImg.vue";
import apis from "apis";
export default {
  inheritAttrs: false,
  props: ["isPurchase"],
  components: {
    uploadImg
  },
  created() {
    this.productId = +getQueryString("productId");
    this.variantMode = +getQueryString("variant");
    if (getQueryString("variant")) {
      if (this.$attrs.allData.baseTab) {
        this.parentId = this.$attrs.allData.baseTab.productEntity.productId;
      } else {
        // 查看变体的时候的母体Id
        this.parentId = this.$attrs["parent-id"];
      }
    }
  },
  data() {
    return {
      commitLoading: false,
      name: "母体",
      parentId: "",
      Tabs: {},
      loading: false,
      imgs: [] // 与母体的图片信息同步
    };
  },

  methods: {
    submit() {
      let api = apis.PRODUCT_BASE_COMMIT;
      if (this.isPurchase) {
        api = apis.PRODUCT_PURCHASE_COMMIT;
      }
      this.commitLoading = true;
      fetchData({
        ...api,
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
