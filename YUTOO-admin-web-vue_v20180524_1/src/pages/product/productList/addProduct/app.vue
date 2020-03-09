<template>
  <div style="height:100%">
    <!-- {{allData}} <br>{{baseTab}} -->
    <vue-tabs direction="vertical" @tab-change="tabClick" ref="tab">
      <v-tab v-for="item in tabs" :key="item.title" :title="item.title">
        <v-card class="product_box" :title="item.title" :loading="loading">
          <keep-alive>
            <component ref="com" :is="name" v-bind="{edit, catelogy, allData, formatField, parentSKU, baseTab, productId, tabInfo, remarkTab}" @set="setData" v-if="item.component === name" :data.sync="allData[item.dataName || name]" :cate.sync="catelogy" :sku.sync="parentSKU" :tabdata.sync="tabInfo" :flag.sync="flag"></component>
          </keep-alive>
        </v-card>
      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import {
  fixFrameHeight,
  fetchData,
  showModal,
  handlerCode,
  setRule
} from "common/common";
import { isArray, getQueryString } from "common/util";
import apis from "apis";
// 异步组件
const productVariant = () =>
  import("./components/productVariant.vue").then(m => m.default);
const BasicInformation = () =>
  import("./components/BasicInformation.vue").then(m => m.default);
const Remark = () => import("./components/RemarkMain.vue").then(m => m.default);
const ProductRelatedAccessories = () =>
  import("./components/ProductRelatedAccessoriesMain.vue").then(m => m.default);
const ProductDeliveryPackage = () =>
  import("./components/ProductDeliveryPackageMain.vue").then(m => m.default);
const RelatedPictures = () =>
  import("./components/RelatedPictures.vue").then(m => m.default);

export default {
  components: {
    productVariant,
    BasicInformation,
    Remark,
    ProductRelatedAccessories,
    ProductDeliveryPackage,
    RelatedPictures
  },
  created() {
    // 提交后或者刷新后获取url里的参数初始化data
    let id = getQueryString("productId");
    let curTab = getQueryString("tab");

    if (id) {
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
        console.log(res);
        if (res.data) {
          this.catelogy = res.data;
        }
      });

      // 获取基本信息
      fetchData({
        ...apis.PRODUCT_PARENT_BASE_TAB,
        data: {
          productId: +id,
          categoryId: this.catelogy.categoryId
        }
      }).then(res => {
        if (res.data.code === 0) {
          delete res.data.code;
          this.allData.baseTab = res.data;
        }
      });

      // 获取备注信息
      fetchData({
        ...apis.PRODUCT_REMARK_PARENT_BASE_TAB,
        data: {
          productId: this.productId
        }
      }).then(res => {
        if (res.data && res.data.code === 0) {
          // this.ruleForm = res.data;
          this.remarkTab = res.data;
          // this.
        }
      });
    }
    if (curTab) {
      this.curTab = +curTab;
    }
  },
  data() {
    return {
      flag: 0, // 是否加入规格参数
      curTab: 0, // 初始化当前tab页
      edit: false, // 是否编辑页
      allData: {
        //所有要提交的数据
        variantTab: {
          variantFlag: 0
        },
        baseTab: {
          variantEntityList: []
        }
      },

      baseTab: {}, // 基础信息
      remarkTab: {}, // 产品备注信息

      catelogy: {}, // 选择的类目

      tabInfo: {}, // 动态字段总和
      formatField: {}, // 格式化后的动态字段 ，包括 1 无差异字段， 2 有差异字段， 3 验证规则

      parentSKU: "", // 母体SKU

      productId: "", // 产品id

      name: "productVariant",

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
          title: "产品相关附件",
          component: "ProductRelatedAccessories"
        },
        {
          title: "产品发货包材",
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
    tabClick(tabIndex, newTab, oldTab) {
      // 判断是否存在第一步带来的sku，如果没有，后面的都不能切换
      if (!this.sku && tabIndex != 0) {
        showModal("error", "请设置产品变体");
        return;
      }
      if (
        !this.productId &&
        (tabIndex == 3 || tabIndex == 4 || tabIndex == 5)
      ) {
        showModal("error", "请先保存基本信息");
        return;
      }

      console.log(tabIndex, newTab, oldTab);
      console.log(this.$refs.com);
      this.name = this.tabs[tabIndex].component;
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
      fetchData({
        ...apis.PRODUCT_FIELD_VARIANT_DIFFERENCE,
        data: { categoryId: id }
      }).then(res => {
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
              if (elIn.requireFlag && !elIn.rule) {
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
          if (el.requireFlag && !el.rule) {
            vali[el.displayKey] = [
              {
                required: true,
                message: "不能为空"
              }
            ];
          }
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
          if (el.requireFlag && !el.rule) {
            vali[el.displayKey] = [
              {
                required: true,
                message: "不能为空"
              }
            ];
          }
        });
      }

      return {
        inputArrs,
        variants,
        vali
      };
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
  }
};
</script>

<style lang='less'>
@import "~assets/style/variables.less";

body {
  height: 100%;
  overflow-y: hidden;
  overflow: auto;
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
        width: 100%;
        .ant-card-head {
          width: 100%;
          height: 42px;
          line-height: 42px;
        }
        .ant-card-body {
          width: 100%;
          overflow-x: auto;
          height: 100%;
        }
      }
    }
  }
}
</style>
