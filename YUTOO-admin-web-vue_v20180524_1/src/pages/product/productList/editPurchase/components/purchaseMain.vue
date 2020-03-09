<template>
  <div style="height:100%">
    <!-- {{sku}} <br> {{allData}} {{allData}}-->
    <vue-tabs direction="vertical" @tab-change="tabClick" ref="tab">
      <v-tab v-for="item in tabs" :key="item.title" :title="item.title" :class="{'cantUse': !sku}">
        <v-card class="product_box" :title="item.title" :loading="loading">
          <keep-alive>
            <component ref="com" :is="name" v-bind="{category, allData,formatField, allInfo}" v-if="item.component === name" :data.sync="allData[item.dataName || name]" :cate.sync="catelogy" :tabdata.sync="tabInfo" :flag.sync="flag"></component>
          </keep-alive>
        </v-card>
      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
import { fixFrameHeight } from "common/common";
// 异步组件
const VariantState = () => import("./VariantState.vue").then(m => m.default);
const productPrice = () =>
  import("./productPriceMain.vue").then(m => m.default);
const ProductHeaderSetting = () =>
  import("./ProductHeaderSetting.vue").then(m => m.default);
const CustomsDeclarationMain = () =>
  import("./CustomsDeclarationMain.vue").then(m => m.default);
const AddingFinishedProducts = () =>
  import("./AddingFinishedProductsMain.vue").then(m => m.default);
const RelatedPictures = () =>
  import("../../addProduct/components/RelatedPictures.vue").then(
    m => m.default
  );

export default {
  inheritAttrs: false,
  props: ["field", "category", "allInfo"],
  components: {
    VariantState,
    productPrice,
    ProductHeaderSetting,
    CustomsDeclarationMain,
    AddingFinishedProducts,
    RelatedPictures
  },
  data() {
    return {
      flag: 0, // 是否加入规格参数
      allData: {
        //所有要提交的数据
        variantTab: {
          variantFlag: null
        },
        entryInfoTab: {
          parentEntryInfoEntity: {},
          variantEntryInfoEntityList: []
        }
      },

      formatField: this.field, // 格式化后的动态字段 ，包括 1 无差异字段， 2 有差异字段， 3 验证规则

      // priceTab: {}, // 价格tab

      catelogy: {}, // 选择的类目

      tabInfo: {}, // tab页的详细情况
      loading: false,
      name: "VariantState",
      tabs: [
        {
          title: "变体状态",
          component: "VariantState",
          dataName: "variantTab"
        },
        {
          title: "产品价格",
          component: "productPrice",
          dataName: "priceTab"
        },
        {
          title: "相关图片",
          component: "RelatedPictures",
          dataName: "imgTab"
        },
        {
          title: "报关信息",
          component: "CustomsDeclarationMain",
          dataName: "entryInfoTab"
        },
        {
          title: "添加成品原料",
          component: "AddingFinishedProducts"
        },
        {
          title: "产品头程设置",
          component: "ProductHeaderSetting",
          dataName: "ProductHeaderSetting"
        }
      ]
    };
  },
  methods: {
    tabClick(tabIndex, newTab, oldTab) {
      // 判断是否存在第一步带来的sku，如果没有，后面的都不能切换

      console.log(tabIndex, newTab, oldTab);
      console.log(this.$refs.com);
      this.name = this.tabs[tabIndex].component;
    }
  },
  updated() {
    fixFrameHeight(1);
  },
  watch: {
    flag(val) {
      this.allData.variantTab.variantFlag = val;
    }
  },
  computed: {
    // 监控是否有选择必填项
    sku() {
      let sku = null;
      console.log(this.allData);
      try {
        sku = this.allData.variantTab.productVariantList[0].variant.sku;
      } catch (e) {
        sku = null;
      }
      return sku;
    }
  }
};
</script>

<style lang='less'>
@import "~assets/style/variables.less";

body {
  height: 100%;
}
.vue-tabs.cantUse {
  color: #999;
  background: #ddd;
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
