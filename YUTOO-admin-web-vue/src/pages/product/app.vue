<template>
  <div id="components-layout-demo-top-side">
    <!-- {{hash}} -->
    <v-layout class="header_wrapper">
      <yt-header :data="mainMenu" :index="1"></yt-header>
      <v-layout style="flex-direction: row;">
        <yt-siderbar ref="siderbar" v-on="{toggleUrl}" :data="menuData2" @item-click="toggleUrl" :collapsed.sync="collapsed"></yt-siderbar>
        <v-layout class="main_box">
          <product-breadcrumb :hash="hash"></product-breadcrumb>
          <v-content class="____main___wrapper_layer">
            <iframe :src="frameSrc" frameborder="0" name="main" id="main" ref="main" allowtransparency="true" style="height:100%"></iframe>
          </v-content>
        </v-layout>
      </v-layout>
    </v-layout>

    <v-modal :wrapClassName="wrapFullName" :title="comTitle" :ok-text="okText" :cancel-text="cancelText" :width="modalWidth" :visible="asyncModalVisible" @ok="handleAsyncOk" ref="modal" @cancel="handleAsyncCancel" :confirm-loading="asyncConfirmLoading">
      <component :is="comName" v-on="handlers" v-bind="bindData" ref="modalContent"></component>
      <div slot="footer" v-if="modalnoBtn">
      </div>
    </v-modal>

    <!-- 产品类目树 -->
    <rightColumns v-if="showRight" @search="searchColumns"></rightColumns>

  </div>
</template>

<script>
import Vue from "vue";
import bus from "common/bus";
import productBreadcrumb from "@/components/base/productBreadcrumb";

import ytHeader from "components/layout/header.vue";
import ytSiderbar from "components/layout/siderBar.vue";
import {
  fetchAllData,
  destroyIframe,
  createIframe,
  toUrl,
  fetchData
} from "common/common";
import _concat from "lodash/concat";
import routes from "./routes";
import apis, { GET_MAIN_MENU, GET_PRODUCT_SUB_MENU } from "apis";
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
  CALBACK_TO_WAIT_FOR_EDITORS,
  PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
  SHOP_PRODUCT_REVIEW_REASON
} from "./componentName";

const router = require("common/router");

// 异步组件
const ytSearch = () =>
  import("components/base/simpleSearch.vue").then(m => m.default); // test
const EntryPrice = () =>
  import("./components/EntryPrice.vue").then(m => m.default); // 显示报关比例
const ReverseShopProduct = () =>
  import("./components/reverseShopProduct.vue").then(m => m.default); // 逆推产品
const rightColumns = () =>
  import("./components/rightColumns").then(m => m.default); // 类目树
const productColumns = () =>
  import("./components/productColumns.vue").then(m => m.default); // 产品类目组件
const setVariantProp = () =>
  import("./components/setVariantProp.vue").then(m => m.default); // 产品属性设置
const productFix = () =>
  import("./components/productFixSelect.vue").then(m => m.default); // 配件选择组件
const AddBrand = () => import("./components/addBrand.vue").then(m => m.default); // 添加品牌
const AddPersonnel = () =>
  import("./components/addPersonnel.vue").then(m => m.default); // 添加品牌
const productPackageSelect = () =>
  import("./components/productPackageSelect.vue").then(m => m.default); // 包材选择组件
const productReview = () =>
  import("./components/productReview.vue").then(m => m.default); // 基础信息审核组件
const phachaseReview = () =>
  import("./components/phachaseReview.vue").then(m => m.default); // 采购信息审核组件
const ProductPurchaseAddHeader = () =>
  import("./components/ProductPurchaseAddHeader.vue").then(m => m.default); // 采购添加头程
const ProductPurchaseSelectHeader = () =>
  import("./components/ProductPurchaseSelectHeader.vue").then(m => m.default); // 采购选择头程
const productReasonLoss = () =>
  import("./components/productReasonLoss.vue").then(m => m.default); // 产品审核失败原因
const batchProductReview = () =>
  import("./components/batchProductReview.vue").then(m => m.default); // 批量审核
const batchAssign = () =>
  import("./components/batchAssign.vue").then(m => m.default); // 批量分配
const importPrice = () =>
  import("./components/importPrice.vue").then(m => m.default); // 导入供应商报价
const batchReviseNotes = () =>
  import("./components/batchReviseNotes.vue").then(m => m.default); // 批量修改备注
const GenerateCompositeProducts = () =>
  import("./components/GenerateCompositeProducts.vue").then(m => m.default); // 生成组合产品

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
  ); //
const calBackToWaitForEditors = () =>
  import("./components/calBackToWaitForEditors.vue").then(m => m.default); // 打回待编辑
const platformReasonLoss = () =>
  import("./components/platformReasonLoss.vue").then(m => m.default); // 平台审核不通过查看原因
const platformAssign = () =>
  import("./components/platformAssign.vue").then(m => m.default); // 平台产品分配编辑人员
const platformSelectImport = () =>
  import("./components/platformSelectImport.vue").then(m => m.default); // 平台产品选择导入
const batchReplaceSuppliers = () =>
  import("./components/batchReplaceSuppliers.vue").then(m => m.default); // 批量更换供应商
const batchCustomExport = () =>
  import("./components/batchCustomExport.vue").then(m => m.default); // 批量自定义导出产品
const BatchAddProductAccessories = () =>
  import("./components/BatchAddProductAccessories.vue").then(m => m.default); // 批量添加配件
const BatchCollectionTax = () =>
  import("./components/BatchCollectionTax.vue").then(m => m.default); // 批量采集退税率
const ExtractCustomSku = () =>
  import("./components/ExtractCustomSku.vue").then(m => m.default); // 提取自定义SKU
const batchAssignPlatform = () =>
  import("./components/batchAssign_Platform.vue").then(m => m.default); // 提取自定义SKU
const batchCustomExportPlatform = () =>
  import("./components/batchCustomExport_Platform.vue").then(m => m.default); // 平台自定义导出

// 销售提报开发

const productDevelopmentCreate = () =>
  import("./productDevelopment/components/create.vue").then(m => m.default); // 创建

const calBackToWaitForEditorsDev = () =>
  import("./productDevelopment/components/calBackToWaitForEditors.vue").then(
    m => m.default
  ); // 打回待编辑

const productDevelopmentDoneDev = () =>
  import("./productDevelopment/components/productDevelopmentDoneDev.vue").then(
    m => m.default
  ); // 打回待编辑

const assignManDev = () =>
  import("./productDevelopment/components/assignManDev.vue").then(
    m => m.default
  ); // 分配

const logProductDev = () =>
  import("./productDevelopment/components/log.vue").then(m => m.default); // 提报 查看日志

const addProductDev = () =>
  import("./PlatformProductsCollection/components/add.vue").then(
    m => m.default
  ); // 添加采集

const SupplierProductReviewBtn = () =>
  import("./SupplierProductReview/components/review.vue").then(m => m.default); // 供应商产品审核 （审核按钮）

const SupplierProductQueryBtn = () =>
  import("./SupplierProductReview/components/query.vue").then(m => m.default); // 供应商产品审核 （查看按钮）

const SupplierProductBack = () =>
  import("./SupplierProductReview/components/back.vue").then(m => m.default); // 供应商产品批量退回

const BatchMoveProduct = () =>
  import("./components/BatchMoveProduct.vue").then(m => m.default); // 批量挪动产品

window._router = function(url, cb) {
  return router(url);
};

export default {
  name: "App",
  components: {
    ytHeader,
    ytSiderbar,
    setVariantProp,
    productBreadcrumb,
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
    [CALBACK_TO_WAIT_FOR_EDITORS]: calBackToWaitForEditors,
    [PRODUCT_PLT_LANGUAGE_AUDIT_INFO]: platformReasonLoss,
    productDevelopmentCreate,
    SupplierProductBack,
    AddBrand,
    AddPersonnel,
    GenerateCompositeProducts,
    BatchAddProductAccessories,
    batchCustomExportPlatform,
    BatchMoveProduct,
    ReverseShopProduct,
    ExtractCustomSku,
    ProductPurchaseAddHeader,
    ProductPurchaseSelectHeader,
    batchAssignPlatform,
    batchCustomExport,
    BatchCollectionTax,
    batchReviseNotes,
    batchReplaceSuppliers,
    productDevelopmentDoneDev,
    batchProductReview,
    importPrice,
    batchAssign,
    platformAssign,
    platformSelectImport,
    SupplyPrice,
    calBackToWaitForEditorsDev,
    SupplierProductReviewBtn,
    SupplierProductQueryBtn,
    assignManDev,
    addProductDev,
    logProductDev,
    EntryPrice,
    rightColumns
  },
  created() {
    this.hash = window.location.hash.split("?")[0];
    this.frameSrc = window.location.hash.slice(1);
    this.isShowCol();
  },
  async mounted() {
    let vm = this;
    window.onload = function() {
      console.log(123132132);
      if ("onhashchange" in window) {
        window.onhashchange = function(ev) {
          console.log(ev);
          vm.hash = window.location.hash.split("?")[0];
        };
      }
    };
    let res = await this.getMenuData();
    this.mainMenu = res;

    // 设定侧边栏高亮
    console.log(location.hash);
    const siderData = res.find(el => el.perms === "product").childMenu;
    let i = -1;

    const setFixed = (arr, parent) => {
      arr.map((el, index, self) => {
        if (el.parentId === 1) {
          i++;
        }
        if (el.childMenu) {
          el.children = el.childMenu;
        }
        if (el.childMenu) {
          setFixed(el.childMenu, el);
        } else {
          // if (el.url && el.url === location.hash.replace("#", "")) {
          if (
            el.url &&
            location.hash.indexOf(el.url.replace(".html", "")) > -1
          ) {
            this.$set(parent, "expand", true);
            el.selected = true;
            this.selected = el.name;
            this.selectedUrl = "product.html#" + el.url;
            return;
          }
        }
      });
    };

    console.log(i);

    setTimeout(() => {
      setFixed(siderData);
      this.$set(siderData[0], "expand", true);
      // siderData[i].expand = true;
      // 菜单数据设定
      this.menuData2 = siderData;
      this.$nextTick(() => {
        this.setRoute(this.menuData2);
      });
    });
  },
  data() {
    return {
      wrapFullName: null,
      hash: "",
      fold: true,
      asyncModalVisible: false,
      asyncConfirmLoading: false,
      frameSrc: null,
      collapsed: false,
      mainMenu: [],
      showRight: false,
      menuData2: [],
      modalWidth: null,
      modalnoBtn: null,
      selected: "",
      selectedUrl: "",
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
    goToLink() {
      console.log(123123);
      toUrl(this.selectedUrl);
    },
    toggleNav() {
      this.fold = !this.fold;
      bus.$emit("toggle");
    },
    // 获取菜单项
    async getMenuData() {
      return fetchData({ ...apis.MERCHANT_MENU_LIST_BY_USER, data: {} }).then(
        res => {
          console.log(res);
          return res.data.rows;
        }
      );
    },

    searchColumns(e) {
      console.log(e);
      let doc = window.document;
      let _iframe = doc.querySelector("iframe#main");
      let vm = _iframe.contentWindow.vm;
      vm.$children[0].searchColumns(e);
    },

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
      this.selectedUrl = "product.html#" + last.url;
    },

    setUrl(url) {
      console.log("设置路由");
      this.isShowCol();
      let doc = window.document;
      let self = doc.querySelector("iframe#main");
      if (!self) {
        return;
      }
      let parent = self.parentNode;
      // debugger
      let newiframe = createIframe(parent, url, "main");
      // parent.appendChild(newiframe);
      destroyIframe(self);
    },

    // 判断是否显示右边类目栏
    isShowCol() {
      if (
        window.location.hash.indexOf("#/product/platformList.html") >= 0 ||
        window.location.hash.indexOf("#/product/productList.html") >= 0
      ) {
        this.showRight = true;
      } else {
        this.showRight = false;
      }
    },

    // 返回
    back() {
      console.log(123);
      window.history.go(-1);
    },

    setRoute(data) {
      let vm = this;
      // 配置路由
      let Urls = [];
      let getUrl = function(arr) {
        arr.forEach(el => {
          if (el.url != null && el.url !== "") {
            Urls.push(el.url);
          }
          if (el.childMenu) {
            getUrl(el.childMenu);
          }
          if (!el) {
            return;
          }
        });
      };
      getUrl(data);
      Urls = _concat(Urls, routes);
      console.log(Urls);

      // // 自定义路由
      // router("/product/productList.html:id", function(id) {
      //   vm.setUrl("/product/productList.html" + id);
      // });

      // 自定义路由
      router("/product/productList/addProduct.html:id", function(id) {
        vm.setUrl("/product/productList/addProduct.html" + id);
      });
      router("/product/imageLibrary.html:id", function(id) {
        vm.setUrl("/product/imageLibrary.html" + id);
      });
      router("/product/imageLibrary.html", function(id) {
        vm.setUrl("/product/imageLibrary.html");
      });

      router("/product/productList/editPurchase.html:id", function(id) {
        vm.setUrl("/product/productList/editPurchase.html" + id);
      });

      router("/product/productList/editProduct.html:id", function(id) {
        vm.setUrl("/product/productList/editProduct.html" + id);
      });

      router("/product/platformList/viewProduct.html:id", function(id) {
        vm.setUrl("/product/platformList/viewProduct.html" + id);
      });

      router("/product/platformList/uploadProduct.html:id", function(id) {
        vm.setUrl("/product/platformList/uploadProduct.html" + id);
      });

      // 编辑lists
      router("/product/platformList/editLists.html:id", function(id) {
        vm.setUrl("/product/platformList/editLists.html" + id);
      });

      // 编辑lists审核
      router("/product/platformList/review.html:id", function(id) {
        vm.setUrl("/product/platformList/review.html" + id);
      });

      // 店铺 编辑lists
      router("/product/ShopProducts/editLists.html:id", function(id) {
        vm.setUrl("/product/ShopProducts/editLists.html" + id);
      });

      // 产品（采购，基础 编辑）
      router("/product/productList/editAll.html:id", function(id) {
        vm.setUrl("/product/productList/editAll.html" + id);
      });

      // 变体编辑
      router("/product/productList/editVariant.html:id", function(id) {
        vm.setUrl("/product/productList/editVariant.html" + id);
      });

      // 产品查看
      router("/product/productList/viewProduct.html:id", function(id) {
        vm.setUrl("/product/productList/viewProduct.html" + id);
      });

      // 产品变体查看
      router("/product/productList/viewProductVariant.html:id", function(id) {
        vm.setUrl("/product/productList/viewProductVariant.html" + id);
      });

      router("/product/ShopProducts/reviewEditLists.html:id", function(id) {
        vm.setUrl("/product/ShopProducts/reviewEditLists.html" + id);
      });

      Urls.forEach(url => {
        if (url === "/product/productList/editProduct.html") {
          router("/product/productList/editProduct.html/:id", function(id) {
            vm.setUrl(url + "#id=" + id);
          });
          return false;
        } else {
          router(url, function(id) {
            vm.setUrl(url);
          });
          return false;
        }
      });

      // 配置后进行路由设定
      let hash = location.hash.replace("#", "");
      console.log(hash);
      // if (!Urls.some(el => el === hash)) {
      //   router(Urls[0]);
      // }
    },

    // hash变化时侧边栏匹配
    setSiderBarSelected(hash) {
      hash = hash.split("/");
      const url = hash[0] + "/" + hash[1] + ".html";
      // console.log(url, "----------------------");
      this.setChecked({ url });
    },
    setChecked(conditons) {
      return this.$refs.siderbar.setChecked(conditons);
    }
  },
  watch: {
    hash(val) {
      this.setSiderBarSelected(val);
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
.toggle___span {
  cursor: pointer;
}
</style>
