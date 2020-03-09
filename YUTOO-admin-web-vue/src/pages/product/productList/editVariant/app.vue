<template>

    <div class="__addproduct" style="height:100%;padding-bottom: 50px;">
      <!-- {{catelogy}} -->
      <el-tabs :tab-position="'left'" style="height: 100%;" type="border-card" :before-leave="handleBeforeLeave" v-model="name">
        <el-tab-pane v-for="(item, index) in tabs" :label="item.title" :key="item.title" :name="item.title" lazy style="height:100%">
          <v-card noHovering class="product_box" :title="item.title" :loading="loading" :bodyStyle="{overflow: 'auto', width: '100%'}">
            <keep-alive>
              <component ref="com" :is="item.component" v-bind="{edit, catelogy, allData, formatField, parentSKU, baseTab, productId, tabInfo, remarkTab, show}" @set="setData" @setSkuCustom='setSkuCustom' :data.sync="allData[item.dataName || name]" :cate.sync="catelogy" :sku.sync="parentSKU" :tabdata.sync="tabInfo" :flag.sync="flag"></component>
            </keep-alive>
          </v-card>
        </el-tab-pane>
      </el-tabs>
    </div>

</template>

<script>
import Vue from "vue";
import { Tabs, TabPane } from "element-ui";
import {
  fixFrameHeight,
  fetchData,
  showModal,
  showToast,
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
  import("../addProduct/components/productVariant.vue").then(m => m.default);
const BasicInformation = () =>
  import("../addProduct/components/BasicInformation.vue").then(m => m.default);
const Remark = () =>
  import("../addProduct/components/RemarkMain.vue").then(m => m.default);
const ProductRelatedAccessories = () =>
  import("../addProduct/components/ProductRelatedAccessoriesMain.vue").then(
    m => m.default
  );
const ProductDeliveryPackage = () =>
  import("../addProduct/components/ProductDeliveryPackageMain.vue").then(
    m => m.default
  );
const RelatedPictures = () =>
  import("../addProduct/components/RelatedPictures.vue").then(m => m.default);

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
    let vm = this
    sessionStorage.clear();
    window.onunload = function() {
      sessionStorage.clear();
    };
    // 提交后或者刷新后获取url里的参数初始化data
    let id = getQueryString("productId");
    let curTab = getQueryString("tab");

    if (id) {
      
      // 如果存在productId,则判定为产品编辑页类似，
      // 请求后端获取产品信息并渲染到页面
      vm.edit = true;
      vm.productId = +id;

      // 获取变体信息
      fetchData({
        ...apis.PRODUCT_VARIANT_BASE_TAB,
        data: {
          productId: +id,
          categoryId: vm.catelogy.categoryId
        }
      }).then(res => {
        if (res.data.code === 0) {
          vm.reqCount++;
          delete res.data.code;
          vm.$nextTick(() => {
            vm.parentSKU = res.data.productEntity.sku;
            vm.allData.baseTab = res.data;
            vm.allData.history = {
              updateRecordList: res.data.updateRecordList,
              variantRecordList: res.data.variantRecordList
            };
          });
        }
        // 根据产品Id获取类目信息
        fetchData({
          ...apis.PRODUCT_CAT,
          data: {
            productId: res.data.productEntity.productId
          }
        }).then(res1 => {

          console.log(res1);
          if (res1.data) {
            this.catelogy = res1.data;
            this.getVariantData(res1.data.categoryId);
          }
        });

        // // 
        // if (res.data.code === 0) {
        //   delete res.data.code;
        //   this.$nextTick(() => {
        //     this.parentSKU = res.data.productEntity.sku;
        //     this.allData.baseTab = res.data;
        //     // this.allData.variantTab =
        //   });
        // }
      });


    }
    if (curTab) {
      this.curTab = +curTab;
    }

    console.log(window.location, "======================");

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
        }
      },

      baseTab: {}, // 基础信息
      remarkTab: {}, // 产品备注信息

      catelogy: {}, // 选择的类目

      tabInfo: {}, // 动态字段总和
      formatField: {}, // 格式化后的动态字段 ，包括 1 无差异字段， 2 有差异字段， 3 验证规则

      parentSKU: "", // 母体SKU

      productId: "", // 产品id

      hasSave: false, // 产品变体页是否保存过

      name: "基本信息",

      loading: false,
      tabs: [
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
    // 设置自定义sku
    setSkuCustom(val, index) {
      let list = {
        ...this.allData.variantTab.productVariantList[index]
      };
      list.variant.skuCustom = val;
      this.allData.variantTab.productVariantList.splice(index, 1, list);
    },

    // 切换标签之前的钩子
    handleBeforeLeave() {},

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
</style>
