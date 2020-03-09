<template>
  <v-spin tip="正在读取数据." :spinning="spinning" style="height:100%">
    <div class="__addproduct" style="height:100%;padding-bottom: 50px;">
      <!-- {{catelogy}} -->
      <el-tabs :tab-position="'left'" style="height: 100%;" type="border-card" :before-leave="handleBeforeLeave" v-model="name">
        <el-tab-pane v-for="(item, index) in tabs" :label="item.title" :key="item.title" :name="item.title" lazy style="height:100%">
          <v-card noHovering class="product_box" :title="item.title" :loading="loading" :bodyStyle="{overflow: 'auto', width: '100%'}">
            <keep-alive>
              <component ref="com" :is="item.component" v-bind="{edit, catelogy, allData, formatField, parentSKU, baseTab, productId, tabInfo, remarkTab, show}" @set="setData" @openload="openSpin" @close="closeSpin" @setSkuCustom='setSkuCustom' :data.sync="allData[item.dataName || name]" :cate.sync="catelogy" :sku.sync="parentSKU" :tabdata.sync="tabInfo" :flag.sync="flag"></component>
            </keep-alive>
          </v-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </v-spin>
</template>

<script>
import Vue from "vue";
import { Tabs, TabPane } from "element-ui";
import {
  fixFrameHeight,
  fetchData,
  showModal,
  handlerCode,
  setRule,
  showConfirm
} from "common/common";
import { isArray, getQueryString } from "common/util";
import apis from "apis";
import bus from "common/bus.js";
let _isEqual = require("lodash/isEqual");

Vue.use(Tabs);
Vue.use(TabPane);
// 异步组件
const productVariant = () =>
  import("./components/productVariant.vue").then(m => m.default);
const BasicInformation = () =>
  import("./components/BasicInformation.vue").then(m => m.default);
const Remark = () => import("./components/RemarkMain.vue").then(m => m.default);
const ProductRelatedAccessories = () =>
  import("./components/ProductRelatedAccessoriesMain.vue").then(m => m.default);
const Portfolios = () =>
  import("./components/PortfoliosMain.vue").then(m => m.default);
const ProductDeliveryPackage = () =>
  import("./components/ProductDeliveryPackageMain.vue").then(m => m.default);
const RelatedPictures = () =>
  import("./components/RelatedPictures.vue").then(m => m.default);

export default {
  components: {
    productVariant,
    BasicInformation,
    Remark,
    Portfolios,
    ProductRelatedAccessories,
    ProductDeliveryPackage,
    RelatedPictures
  },
  created() {
    sessionStorage.clear();
    window.onunload = function() {
      sessionStorage.clear();
    };
    // 提交后或者刷新后获取url里的参数初始化data
    let id = getQueryString("productId");
    let curTab = getQueryString("tab");
    let groupFlag = getQueryString("groupFlag");
    this.isVariant = getQueryString("variant");
    this.review = getQueryString("isshow");
    if (this.isVariant) {
      id = getQueryString("parentId");
    }
    this.productId = id;

    // 组合产品tab
    if (groupFlag) {
      this.tabs.splice(2, 0, {
        title: "组合产品",
        component: "Portfolios",
        dataName: "Portfolios"
      });
    }

    if (id) {
      this.spinning = true;
      // 如果存在productId,则判定为产品编辑页类似，
      // 请求后端获取产品信息并渲染到页面
      this.edit = true;
      this.productId = +id;
      // 根据产品Id获取类目信息
      fetchData({
        ...apis.PRODUCT_CAT,
        data: {
          productId: +id
        }
      }).then(res => {
        // this.spinning = false;
        console.log(res);
        if (res.data) {
          this.reqCount++;
          this.catelogy = res.data;
        }
      });
      // 获取基本信息
      fetchData({
        ...apis.PRODUCT_PARENT_BASE_TAB,
        data: {
          flag: 1,
          productId: this.productId,
          categoryId: this.catelogy.categoryId
        }
      }).then(res => {
        this.spinning = false;
        if (res.data.code === 0) {
          delete res.data.code;
          this.$nextTick(() => {
            this.parentSKU = res.data.productEntity.sku;
            this.allData.baseTab = res.data;
            this.allData.history = {
              updateRecordList: res.data.updateRecordList,
              commitUpdateInfoRecordList: res.data.commitUpdateInfoRecordList,
              parentChangeMap: res.data.parentChangeMap,
              variantChangeMap: res.data.variantChangeMap,
              variantRecordList: res.data.variantRecordList
            };
          });
        }
      });
    }
    if (curTab) {
      this.curTab = +curTab;
    }

    // 判断是否预览状态，如果是，禁用所有按钮
    if (
      top.location.href.indexOf("product/productList/editPurchase.html") >= 0 ||
      getQueryString("isshow")
    ) {
      this.show = true;
    }
  },
  data() {
    return {
      reqCount: 0, // 记录请求
      spinning: false, // 是否加载数据
      flag: 0, // 是否加入规格参数
      curTab: 0, // 初始化当前tab页
      edit: false, // 是否编辑页
      show: false, // 是否为预览（不能编辑）
      allData: {
        //所有要提交的数据
        variantTab: {
          variantFlag: 0
        },
        baseTab: {
          variantEntityList: []
        },
        history: {}
      },

      baseTab: {}, // 基础信息
      remarkTab: {}, // 产品备注信息

      catelogy: {}, // 选择的类目

      tabInfo: {}, // 动态字段总和
      formatField: {}, // 格式化后的动态字段 ，包括 1 无差异字段， 2 有差异字段， 3 验证规则

      parentSKU: "", // 母体SKU

      productId: "", // 产品id

      hasSave: false, // 产品变体页是否保存过

      name: "产品变体",

      loading: false,
      tabs: [
        {
          title: "产品变体",
          component: "productVariant",
          dataName: "variantTab"
        },
        {
          title: "基本信息",
          component: "BasicInformation",
          dataName: "baseTab"
        },
        {
          title: "产品备注",
          component: "Remark",
          dataName: "remarkTab"
        },

        {
          title: "相关附件",
          component: "ProductRelatedAccessories"
        },
        {
          title: "发货包材",
          component: "ProductDeliveryPackage"
        },
        {
          title: "相关图片",
          component: "RelatedPictures",
          dataName: "imgTab"
        }
      ]
    };
  },
  methods: {
    closeSpin() {
      this.spinning = false;
    },
    openSpin() {
      this.spinning = true;
    },
    // 设置自定义sku
    setSkuCustom(val, index) {
      let list = {
        ...this.allData.variantTab.productVariantList[index]
      };
      list.variant.skuCustom = val;
      this.allData.variantTab.productVariantList.splice(index, 1, list);
    },

    // 切换标签之前的钩子
    handleBeforeLeave() {
      // 新增页
      // 如果变体页没有保存,提示一下是否保存

      // 编辑页
      // 如果编辑过变体数据，提示保存，如果没有编辑数据则不提示
      if (this.edit) {
        console.log(this.$refs.com[0].tableData);
        if (
          !_isEqual(
            JSON.stringify(this.$refs.com[0].tableData),
            sessionStorage.getItem("tableData")
          )
        ) {
          showModal("info", "请先保存变体数据");
          return false;
        }
      } else {
        if (!sessionStorage.getItem("save")) {
          showModal("info", "请先保存变体数据");
          return false;
        }
      }
    },
    setData(name, val) {
      console.log(22, name, val);

      if (name == "productId") {
        this[name] = val;
        return;
      }
      this[name] = Object.assign({}, this[name], val);
    },

    // 获取动态字段
    getVariantData(id) {
      this.spinning = true;
      fetchData({
        ...apis.PRODUCT_FIELD_VARIANT_DIFFERENCE,
        data: { categoryId: id }
      }).then(res => {
        this.spinning = false;
        console.log(res);

        // 设置基本信息页的动态字段数据
        if (res.data && res.data.productTabField) {
          this.formatField.productTabField = this.setField(
            res.data.productTabField
          );
        }

        // 设置产品备注的动态字段数据
        if (res.data && res.data.remarkTabFied) {
          this.formatField.remarkTabFied = this.setField(
            res.data.remarkTabFied
          );
        }

        // 存储所有数据
        this.tabInfo = res.data;
      });
    },

    // 分离母体字段和差异字段
    setField(field) {
      let vm = this;
      let inputArrs = {};
      let variants = {};
      let vali = {};
      // 判断是否有分组字段
      if (!isArray(field)) {
        // 单个字段
        let arr = field.productSingleField;
        console.log(arr);
        // 分组字段
        let arr2 = [];
        let arr3 = [];
        let group = field.productGroupField; // 需要分组渲染的字段

        for (const key in group) {
          // 筛选差异字段
          if (group.hasOwnProperty(key)) {
            const element = group[key];
            if (element[0].variantsFlag) {
              arr3.push(element);
            } else {
              arr2.push(element);
            }

            //  设置分组字段的表单验证
            element.forEach(elIn => {
              if (elIn.rule) {
                vali[elIn.displayKey] = setRule(elIn.rule);
              }
              if (elIn.requireFlag) {
                vali[elIn.displayKey] = [
                  {
                    required: true,
                    message: "不能为空"
                  }
                ];
              }

              // vali[elIn.displayKey] = [
              //   {
              //     required: true,
              //     message: "不能为空"
              //   }
              // ];
            });
          }
        }

        inputArrs = arr.filter(el => !el.variantsFlag).concat(arr2); // 母体输入字段
        variants = arr.filter(el => el.variantsFlag).concat(arr3); // 变体字段

        // 增加表单验证
        arr.forEach(el => {
          if (el.rule) {
            vali[el.displayKey] = setRule(el.rule);
          }
          if (el.requireFlag) {
            vali[el.displayKey] = [
              {
                required: true,
                message: "不能为空"
              }
            ];
          }
          // if (
          //   el.displayKey === "nameEn" ||
          //   el.displayKey === "nameZh" ||
          //   el.displayKey === "seoTitle" ||
          //   el.displayKey === "seoKeyword" ||
          //   el.displayKey === "searchKeyword" ||
          //   el.displayKey === "seoDesc"
          // ) {
          //   vm.setKeyword(vali[el.displayKey]);
          // }
        });
      } else {
        let arr = field;

        inputArrs = arr.filter(el => !el.variantsFlag); // 母体输入字段
        variants = arr.filter(el => el.variantsFlag); // 变体字段
        // 增加表单验证
        arr.forEach(el => {
          if (el.rule) {
            vali[el.displayKey] = setRule(el.rule);
          }
          if (el.requireFlag) {
            vali[el.displayKey] = [
              {
                required: true,
                message: "不能为空"
              }
            ];
          }
          // if (
          //   el.displayKey === "nameEn" ||
          //   el.displayKey === "nameZh" ||
          //   el.displayKey === "seoTitle" ||
          //   el.displayKey === "seoKeyword" ||
          //   el.displayKey === "searchKeyword" ||
          //   el.displayKey === "seoDesc"
          // ) {
          //   vm.setKeyword(vali[el.displayKey]);
          // }
        });
      }

      return {
        inputArrs,
        variants,
        vali
      };
    },
    getKeyword() {
      return fetchData({ ...apis.PRODUCT_KEY_WORD_VERIFY }).then(res => {
        if (res.data.code === 0) {
          return res.data.rows;
        }
      });
    },

    getKeywordField(words) {
      return (rule, value, callback) => {
        let el = words.find(el => value && value.indexOf(el.keyword) > -1);
        if (el) {
          callback(
            new Error(`包含${el.sensitiveKeywordLibraryDesc} - ${el.keyword}`)
          );
        }
        callback();
      };
    },

    setKeyword(item) {
      let vm = this;
      vm.getKeyword().then(words => {
        if (item) {
          item.push({
            required: false,
            validator: vm.getKeywordField(words)
          });
        } else {
          item = {
            required: false,
            validator: vm.getKeywordField(words)
          };
        }
      });
    }
  },

  updated() {
    setTimeout(() => {
      fixFrameHeight(1);
    });
  },
  watch: {
    flag(val) {
      this.allData.variantTab.variantFlag = val;
    },

    // 监控类目选择，如果有选择不同的类目，则获取类目的动态字段
    categoryId(id) {
      this.getVariantData(id);
      // Vue.set(this.allData.baseTab, categoryId, id);
    },

    reqCount(val) {
      if (val == 3) {
        this.spinning = false;
      }
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
    },

    // 获取产品类目id
    categoryId() {
      return this.catelogy.categoryId;
    }
  },
  beforeDestroy() {
    sessionStorage.clear();
  }
};
</script>

<style lang='less' scoped>
@import "~assets/style/variables.less";

body {
  height: 100%;
  overflow-y: hidden;
  overflow: auto;
}
.el-tabs--left .el-tabs__item.is-left {
  padding: 0 32px;
}
.product_box {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
