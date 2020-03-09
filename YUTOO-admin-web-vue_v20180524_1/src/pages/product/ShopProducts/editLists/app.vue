<template>
  <div style="height:100%">
    <!-- {{src}} -->
    <vue-tabs @tab-change="tabClickPurchase" ref="tab">
      <v-tab v-for="(item, index) in mainTabs" :key="item.title" :title="item.title">
        <v-card class="product_box" :title="item.title" :loading="loading" v-if="item.src == src" ref="card">
          <iframe :src="src" ref="frame" frameborder="0" style="width:100%;height:700px" class="frame"></iframe>
        </v-card>

      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: "/product/productList/addProduct.html" + window.location.search,
      curIndex: 0,
      loading: false,
      mainTabs: [
        {
          title: "基本信息",
          src: "/product/productList/addProduct.html" + window.location.search
        },
        {
          title: "采购编辑",
          src: "/product/productList/editPurchase.html" + window.location.search
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
