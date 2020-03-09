<template>
  <v-spin tip="加载中..." :spinning="spinning" style="height: 100%;">
    <el-tabs style="height: 100%;" type="border-card" tab-position="left" v-if="imgs[0] && imgs[0].imgList" class="__imginformation">
      <el-tab-pane :label="item.skuStore" v-for="item in imgs" :key="item.skuStore" lazy>
        <keep-alive>
          <UploadImg :oss="true" :has-img="item.imgList" :product-type="productType" @refresh="getData" :product-id="productId" :platform-value="item.platformValue" :platform-image="item.platformImage" :show="isShow" :variant-id="item.variantId"></UploadImg>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <UploadImg :oss="true" v-else :has-img="imgs" :product-type="productType" @refresh="getData" :product-id="productId" :show="isShow" :variant-id="imgs[0] && imgs[0].variantId"></UploadImg>
  </v-spin>
</template>

<script>
import Vue from "vue";
import UploadImg from "components/base/uploadImg";
import { Tabs, TabPane } from "element-ui";
import { fetchData, showConfirm } from "common/common";
import apis from "apis";
import { getQueryString } from "common/util";

Vue.use(Tabs);
Vue.use(TabPane);

export default {
  components: {
    UploadImg,
    Tabs,
    TabPane
  },
  created() {
    this.isShow = getQueryString("isshow") == "true";
    this.getData();
  },
  data() {
    return {
      spinning: false,
      imgs: [],
      productType: null,
      productId: null
    };
  },
  methods: {
    getData() {
      this.productId = +getQueryString("storeProductId");
      this.productType = +getQueryString("productType");
      this.spinning = true;
      fetchData({
        ...apis.STORE_PRODUCT_IMG,
        data: {
          productId: this.productId,
          productType: this.productType
        }
      }).then(res => {
        this.spinning = false;
        if (res.data.code === 0) {
          this.imgs = res.data.rows;
        }
      });
    }
  }
};
</script>

<style>
.__imginformation .el-tabs__content {
  overflow: auto;
}
</style>
