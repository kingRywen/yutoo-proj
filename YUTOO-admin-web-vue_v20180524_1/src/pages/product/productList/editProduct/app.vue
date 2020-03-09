<template>
  <div style="height:100%">
    <vue-tabs direction="vertical" @tab-change="tabClick">
      <v-tab v-for="item in tabs" :key="item.title" :title="item.title">
        <v-card class="product_box" :title="item.title" :loading="loading">
          <keep-alive>
            <component :is="name" v-if="item.component === name" :edit="true"></component>
          </keep-alive>
        </v-card>
      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
import { fixFrameHeight } from "common/common";
import { getQueryString } from "common/util";
// 异步组件
const productVariant = () =>
  import("../addProduct/components/productVariant.vue").then(m => m.default);
const BasicInformation = () =>
  import("../addProduct/components/BasicInformation.vue").then(m => m.default);
const Remark = () =>
  import("../addProduct/components/Remark.vue").then(m => m.default);
const ProductRelatedAccessories = () =>
  import("../addProduct/components/ProductRelatedAccessories.vue").then(
    m => m.default
  );
const ProductDeliveryPackage = () =>
  import("../addProduct/components/ProductDeliveryPackage.vue").then(
    m => m.default
  );
const RelatedPictures = () =>
  import("../addProduct/components/RelatedPictures.vue").then(m => m.default);

export default {
  created() {
    console.log(getQueryString("categoryId"));
  },
  components: {
    productVariant,
    BasicInformation,
    Remark,
    ProductRelatedAccessories,
    ProductDeliveryPackage,
    RelatedPictures
  },
  data() {
    return {
      loading: false,
      name: "productVariant",
      tabs: [
        {
          title: "产品变体",
          component: "productVariant"
        },
        {
          title: "基本信息",
          component: "BasicInformation"
        },
        {
          title: "产品备注",
          component: "Remark"
        },
        {
          title: "产品相关附件",
          component: "ProductRelatedAccessories"
        },
        {
          title: "产品发货包材",
          component: "ProductDeliveryPackage"
        },
        {
          title: "相关图片",
          component: "RelatedPictures"
        }
      ]
    };
  },
  methods: {
    tabClick(tabIndex, newTab, oldTab) {
      console.log(tabIndex, newTab, oldTab);
      this.name = this.tabs[tabIndex].component;
    }
  },
  updated() {
    fixFrameHeight(1);
  }
};
</script>

<style lang='less'>
@import "~assets/style/variables.less";

body {
  height: 100%;
}

.vue-tabs {
  width: 120px @iehack;
  height: 100%;
  display: table @iehack;
  justify-content: center @iehack;
  .left-vertical-tabs {
    display: table-cell @iehack;
    // float: left;
    min-width: 126px;
    background: @sub-title-color;
    border-right: 1px solid @sub-title-color-border;
    .nav-tabs {
      border: none;
      li {
        a {
          margin-right: 0;
          &:active,
          &:hover,
          &:focus,
          &:visited {
            border-color: transparent;
            background-color: @title-color;
            background: linear-gradient(
              to left,
              @title-color,
              lighten(@title-color, 20%)
            );
            color: gray;
            border-radius: 0;
          }
        }
        &.active {
          a {
            border-color: transparent;
            background-color: @title-color;
            background: linear-gradient(
              to left,
              @title-color,
              lighten(@title-color, 20%)
            );
            color: @bg-color;
            border-radius: 0;
          }
        }
      }
    }
  }
  .tab-content {
    display: table-cell @iehack;
    flex: auto;
    // float: left@iehack;

    .tab-container {
      width: 100%;
      height: 100%;
      .product_box.ant-card {
        height: 100%;
        border: none;
        .ant-card-head {
          height: 42px;
          line-height: 42px;
        }
      }
    }
  }
}
</style>
