<template>
  <div id="components-layout-demo-top-side">
    <v-layout class="header_wrapper">
      <yt-header :data="mainMenu"></yt-header>
      <v-layout style="flex-direction: row;">
        <yt-siderbar v-on="{toggleUrl}" :data="menuData2" @item-click="toggleUrl" :collapsed.sync="collapsed"></yt-siderbar>
        <v-layout class="main_box" style="padding:0 24px 24px">
          <v-breadcrumb style="margin:12px 0">
            <v-breadcrumb-item>{{selected}}</v-breadcrumb-item>
          </v-breadcrumb>
          <v-content style="margin: 0; min-height: 680px">
            <iframe :src="frameSrc" frameborder="0" name="main" id="main" ref="main" allowtransparency="true"></iframe>
          </v-content>
        </v-layout>
      </v-layout>
    </v-layout>

    <v-modal :title="comTitle" :ok-text="okText" :cancel-text="cancelText" :width="modalWidth" :visible="asyncModalVisible" @ok="handleAsyncOk" ref="modal" @cancel="handleAsyncCancel" :confirm-loading="asyncConfirmLoading">
      <component :is="comName" v-on="handlers" v-bind="bindData" ref="modalContent"></component>
    </v-modal>

  </div>
</template>

<script>
import Vue from "vue";
import ytHeader from "components/layout/header.vue";
import ytSiderbar from "components/layout/siderBar.vue";
import { fetchAllData, destroyIframe, createIframe } from "common/common";
import _concat from "lodash/concat";
import routes from "./routes";
import { GET_MAIN_MENU, GET_PRODUCT_SUB_MENU } from "apis";
import {
  YT_SEARCH,
  YT_PRODUCT_COLUMNS,
  YT_PRODUCT_FIX,
  YT_PRODUCT_PACKAGE,
  YT_PRODUCT_SHOW,
  COLOR_PICKER,
  YT_PRODUCT_SHOW_REASON,
  PRODUCT_VARIANT_STATUS,
  SHOP_PRODUCT_REVIEW,
  YT_PRODUCT_SHOW_PHCHASE,
  PRODUCTHEADEREDITING,
  PRODUCTHEADERTOGGLE,
  SHOP_PRODUCT_REVIEW_REASON
} from "./componentName";
const router = require("common/router");

// 异步组件
const ytSearch = () =>
  import("components/base/simpleSearch.vue").then(m => m.default); // test
const productColumns = () =>
  import("./components/productColumns.vue").then(m => m.default); // 产品类目组件
const productFix = () =>
  import("./components/productFixSelect.vue").then(m => m.default); // 配件选择组件
const productPackageSelect = () =>
  import("./components/productPackageSelect.vue").then(m => m.default); // 包材选择组件
const productReview = () =>
  import("./components/productReview.vue").then(m => m.default); // 基础信息审核组件
const phachaseReview = () =>
  import("./components/phachaseReview.vue").then(m => m.default); // 采购信息审核组件
const productReasonLoss = () =>
  import("./components/productReasonLoss.vue").then(m => m.default); // 产品审核失败原因
const checkPicker = () =>
  import("./components/checkPicker.vue").then(m => m.default); // 颜色选择器
const isVariantState = () =>
  import("./components/isVariantState.vue").then(m => m.default); // 变体状态
const shopListReview = () =>
  import("./components/shopListReview.vue").then(m => m.default); // 刊登信息审核
const shopListReviewReason = () =>
  import("./components/shopListReviewReason.vue").then(m => m.default); // 店铺上架失败原因
const SupplyPrice = () =>
  import("./productList/editPurchase/components/SupplyPrice.vue").then(
    m => m.default
  ); // 颜色选择器

const ProductHeaderEditing = () =>
  import("./productList/editPurchase/components/ProductHeaderEditing.vue").then(
    m => m.default
  ); // 头程编辑

const ProductHeaderToggle = () =>
  import("./productList/editPurchase/components/ProductHeaderToggle.vue").then(
    m => m.default
  ); // 头程编辑

window._router = function(url, cb) {
  return router(url);
};

export default {
  name: "App",
  components: {
    ytHeader,
    ytSiderbar,
    [YT_PRODUCT_COLUMNS]: productColumns,
    [YT_PRODUCT_FIX]: productFix,
    [YT_PRODUCT_PACKAGE]: productPackageSelect,
    [YT_PRODUCT_SHOW]: productReview,
    [YT_PRODUCT_SHOW_REASON]: productReasonLoss,
    [YT_SEARCH]: ytSearch,
    [YT_PRODUCT_SHOW_PHCHASE]: phachaseReview,
    [COLOR_PICKER]: checkPicker,
    [PRODUCT_VARIANT_STATUS]: isVariantState,
    [SHOP_PRODUCT_REVIEW]: shopListReview,
    [SHOP_PRODUCT_REVIEW_REASON]: shopListReviewReason,
    [PRODUCTHEADEREDITING]: ProductHeaderEditing,
    [PRODUCTHEADERTOGGLE]: ProductHeaderToggle,
    SupplyPrice
  },
  mounted() {
    // 获取菜单项, 获取路由并设置
    // fetchAllData([GET_MAIN_MENU, GET_PRODUCT_SUB_MENU]).then(res => {
    //   console.log(res);
    //   this.mainMenu = res[0].data.rows;

    //   // 设定侧边栏高亮
    //   console.log(location.hash);
    //   const siderData = res[1].data;
    //   let i = 0;
    //   const setFixed = (arr, parent) => {
    //     arr.map((el, index, self) => {
    //       if (el.children) {
    //         setFixed(el.children, el);
    //       } else {
    //         if (el.url && el.url === location.hash.replace("#", "")) {
    //           parent.expand = true;
    //           el.selected = true;
    //           this.selected = el.name;
    //           i = index;
    //           return;
    //         }
    //       }
    //     });
    //   };
    //   siderData[0].expand = true;

    //   // 菜单数据设定
    //   this.menuData2 = res[1].data;
    //   this.setRoute(res[1].data);

    //   setTimeout(() => {
    //     setFixed(siderData);
    //   });
    // });
    let res = [
      {
        rows: [
          {
            icon: "desktop",
            name: "我的工作台",
            href: "/admin.html"
          },
          {
            icon: "appstore",
            name: "产品库中心",
            href: "/product.html#/product/productList.html"
          },
          {
            icon: "rocket",
            name: "仓储物流管理"
          },
          {
            icon: "shop",
            name: "销售管理"
          },
          {
            icon: "customer-service",
            name: "CRM客服管理"
          },
          {
            icon: "setting",
            name: "系统管理"
          },
          {
            icon: "pay-circle-o",
            name: "财务管理"
          },
          {
            icon: "area-chart",
            name: "报告中心"
          }
        ]
      },
      [
        {
          name: "产品管理",
          icon: "appstore",
          children: [
            {
              name: "产品库",
              icon: "api",
              children: [
                {
                  name: "产品",
                  url: "/product/productList.html"
                },
                {
                  name: "平台产品",
                  url: "/product/platformList.html"
                },
                {
                  name: "店铺产品",
                  url: "/product/ShopProducts.html"
                }
              ]
            },
            {
              name: "产品开发",
              icon: "tool",
              children: [
                {
                  name: "销售提报开发",
                  url: "/product/productDevelopment.html"
                },
                {
                  name: "平台产品采集",
                  url: "/product/PlatformProductsCollection.html"
                },
                {
                  name: "供应商产品审核",
                  url: "/product/SupplierProductReview.html"
                }
              ]
            },
            {
              name: "相关设置",
              icon: "setting",
              children: [
                {
                  name: "店铺管理",
                  url: "/product/StoreManagement.html"
                },
                {
                  name: "产品类目管理",
                  url: "/product/ProductCategoryManagement.html"
                },
                {
                  name: "敏感关键字管理",
                  url: "/product/SensitiveKeyword.html"
                },
                {
                  name: "渠道sku生成规则",
                  url: "/product/SkuGenerationRules.html"
                },
                {
                  name: "sku平台标题管理",
                  url: "/product/SkuPlatformTitle.html"
                },
                {
                  name: "批量修改渠道关联",
                  url: "/product/ModifyChannelAssociations.html"
                }
              ]
            }
          ]
        },
        {
          name: "采购管理",
          icon: "shop",
          children: [
            {
              name: "采购单管理"
            },
            {
              name: "质检管理"
            },
            {
              name: "采购财务账号管理"
            }
          ]
        },
        {
          name: "供应商管理",
          icon: "team",
          children: [
            {
              name: "供应商列表"
            },
            {
              name: "采购点管理"
            },
            {
              name: "供应商账期赚理"
            }
          ]
        }
      ]
    ];
    // this.mainMenu = res[0].data.rows;
    this.mainMenu = res[0].rows;

    // 设定侧边栏高亮
    console.log(location.hash);
    const siderData = res[1];
    console.log(siderData);
    let i = 0;
    const setFixed = (arr, parent) => {
      arr.map((el, index, self) => {
        if (el.children) {
          setFixed(el.children, el);
        } else {
          if (el.url && el.url === location.hash.replace("#", "")) {
            parent.expand = true;
            el.selected = true;
            this.selected = el.name;
            i = index;
            return;
          }
        }
      });
    };
    siderData[0].expand = true;

    // 菜单数据设定
    this.menuData2 = res[1];
    this.setRoute(res[1]);

    setTimeout(() => {
      setFixed(siderData);
    });
  },
  data() {
    return {
      asyncModalVisible: false,
      asyncConfirmLoading: false,
      frameSrc: "/product/productList.html",
      collapsed: false,
      mainMenu: [],
      menuData2: [],
      modalWidth: null,
      selected: "",
      comName: "",
      comTitle: "",
      okText: "确认",
      cancelText: "取消",

      iframeData: {},

      bindData: {},
      handlers: {}
    };
  },
  methods: {
    showAsyncModal() {
      this.asyncModalVisible = true;
    },
    handleAsyncOk() {
      // this.asyncConfirmLoading = true;
      this.$refs.modalContent.ok();
    },

    handleAsyncCancel() {
      this.asyncModalVisible = false;
    },

    toggleUrl(e) {
      console.log(e);
      let last = e[e.length - 1];
      // 监听侧边栏点击事件
      router(last.url);
      this.selected = last.name;
    },

    setUrl(url) {
      let doc = window.document;
      let self = doc.querySelector("iframe#main");
      let parent = self.parentNode;
      let newiframe = createIframe(parent, url, "main");
      parent.appendChild(newiframe);
      destroyIframe(self);
    },

    setRoute(data) {
      let vm = this;
      // 配置路由
      let Urls = [];
      let getUrl = function(arr) {
        arr.forEach(el => {
          if (el.url) {
            Urls.push(el.url);
          }
          if (el.children) {
            getUrl(el.children);
          }
          if (!el) {
            return;
          }
        });
      };
      getUrl(data);
      Urls = _concat(Urls, routes);
      console.log(Urls);

      // 自定义路由
      router("/product/productList/addProduct.html:id", function(id) {
        console.log(id);
        vm.setUrl("/product/productList/addProduct.html" + id);
      });

      router("/product/productList/editPurchase.html:id", function(id) {
        console.log(id);
        vm.setUrl("/product/productList/editPurchase.html" + id);
      });

      router("/product/productList/editProduct.html:id", function(id) {
        console.log(id);
        vm.setUrl("/product/productList/editProduct.html" + id);
      });

      router("/product/platformList/uploadProduct.html:id", function(id) {
        console.log(id);
        vm.setUrl("/product/platformList/uploadProduct.html" + id);
      });

      // 编辑lists
      router("/product/platformList/editLists.html:id", function(id) {
        console.log(id);
        vm.setUrl("/product/platformList/editLists.html" + id);
      });

      // 编辑lists审核
      router("/product/platformList/review.html:id", function(id) {
        console.log(id);
        vm.setUrl("/product/platformList/review.html" + id);
      });

      // 店铺 编辑lists
      router("/product/ShopProducts/editLists.html:id", function(id) {
        console.log(id);
        vm.setUrl("/product/ShopProducts/editLists.html" + id);
      });

      Urls.forEach(url => {
        if (url === "/product/productList/editProduct.html") {
          router("/product/productList/editProduct.html/:id", function(id) {
            console.log(id);
            vm.setUrl(url + "#id=" + id);
          });
        } else {
          router(url, function() {
            vm.setUrl(url);
          });
        }
      });

      // 配置后进行路由设定
      let hash = location.hash.replace("#", "");
      console.log(hash);
      // if (!Urls.some(el => el === hash)) {
      //   router(Urls[0]);
      // }
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";

.ant-layout {
  display: table @iehack;
  width: 100% @iehack;
  justify-content: center @iehack;
  .ant-layout-sider {
    display: table-cell @iehack;
  }
  .main_box {
    display: table-cell @iehack;
    width: 100% @iehack;
  }
}
</style>