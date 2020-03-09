<template>
  <div style="height:100%">

    <el-tabs style="height: 100%;" type="border-card" v-model="name" class="product_box">
      <el-tab-pane v-for="(item, index) in mainTabs" :label="item.title" :key="item.title" :name="item.title" lazy style="height:100%">
        <div class="product_box" :loading="loading" ref="card" style="height:100%">
          <iframe :src="item.src" ref="frame" frameborder="0" style="width:100%;height:100%" class="frame"></iframe>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { getQueryString } from "common/util";
import { Tabs, TabPane } from "element-ui";

Vue.use(Tabs);
Vue.use(TabPane);

export default {
  data() {
    let vm = this;
    vm.isVariant = getQueryString("variant");
    vm.productId = getQueryString("productId");
    vm.parentId = getQueryString("baseProductParentId");
    return {
      src: "",
      name: "平台上架信息",
      curIndex: 0,
      loading: false,
      mainTabs: [
        {
          title: "基本信息",
          src: vm.isVariant
            ? `/product/productList/viewProductVariant.html?productId=${
                vm.productId
              }&isshow=true&variant=${vm.isVariant}&base=true&&parent=${
                vm.productId
              }&parentId=${vm.productId}`
            : "/product/productList/addProduct.html" +
              window.location.search +
              `isshow=true`
        },
        {
          title: "采购编辑",
          src:
            "/product/productList/editPurchase.html" +
            window.location.search +
            "&type=1&isshow=true&parentId=" +
            vm.parentId
        },
        {
          title: "平台上架信息",
          src:
            "/product/ShopProducts/upInfomation.html" + window.location.search
        },
        {
          title: "图片",
          src:
            "/product/ShopProducts/imgInfomation.html" + window.location.search
        }
      ]
    };
  },
  methods: {
    tabClickPurchase(tabIndex, newTab, oldTab) {
      let vm = this;
      this.src = this.mainTabs[tabIndex].src;
    }
  }
};
</script>

<style>
</style>
