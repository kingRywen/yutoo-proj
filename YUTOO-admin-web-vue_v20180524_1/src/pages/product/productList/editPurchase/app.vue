<template>
  <div style="height:100%">

    <!-- 单页模式 -->

    <!-- 编辑标签页 -->
    <vue-tabs @tab-change="tabClickPurchase">
      <v-tab v-for="item in mainTabs" :key="item.title" :title="item.title">
        <v-card class="product_box" :title="item.title" :loading="loading" v-if="item.component">
          <keep-alive>
            <component :is="namePurchese" v-if="item.component === namePurchese" :field="formatField" :category="category" :all-info="tabInfo" :edit="true"></component>
          </keep-alive>
        </v-card>
        <v-card class="product_box" :title="item.title" :loading="loading" v-else>
          <iframe :src="src" ref="frame" frameborder="0" style="width:100%;height:700px"></iframe>
        </v-card>

      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
import { fixFrameHeight, fetchData, setRule } from "common/common";
import { getQueryString, isArray } from "common/util";
import apis from "apis";

const purchaseMain = () =>
  import("./components/purchaseMain.vue").then(m => m.default);

export default {
  mounted() {
    console.log(window, "--------------------------------");
    let id = getQueryString("productId");
    this.src =
      "/product/productList/addProduct.html" +
      window.location.search +
      "&type=1";
    // 获取类目信息
    this.getCategory(id);
  },
  components: {
    purchaseMain
  },
  data() {
    return {
      formatField: {}, // 格式化后的动态字段 ，包括 1 无差异字段， 2 有差异字段， 3 验证规则
      category: {}, // 产品类目
      tabInfo: {},
      src: "",
      loading: false,

      namePurchese: "addProduct",
      mainTabs: [
        {
          title: "基本信息"
        },
        {
          title: "采购编辑",
          component: "purchaseMain"
        }
      ]
    };
  },
  methods: {
    tabClickPurchase(tabIndex, newTab, oldTab) {
      console.log(tabIndex, newTab, oldTab);
      this.namePurchese = this.mainTabs[tabIndex].component;
    },

    // 获取类目信息
    getCategory(id) {
      fetchData({
        ...apis.PRODUCT_CAT,
        data: { productId: +id }
      }).then(res => {
        console.log(res);
        this.category = res.data;
      });
    },

    // 获取动态字段
    getVariantData(id) {
      fetchData({
        ...apis.PRODUCT_FIELD_PURCHASE_VARIANT_DIFFERENCE,
        data: { categoryId: id }
      }).then(res => {
        console.log(res);

        // 设置产品价格的动态字段数据
        if (res.data && res.data.priceTabField) {
          this.formatField.priceTabField = this.setField(
            res.data.priceTabField
          );
        }

        // 设置报关信息的动态字段数据
        if (res.data && res.data.entryInfoTabField) {
          this.formatField.entryInfoTabField = this.setField(
            res.data.entryInfoTabField
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
        let arr = field.priceSingleField;
        console.log(arr);
        // 分组字段
        let arr2 = [];
        let arr3 = [];
        let group = field.priceGroupField; // 需要分组渲染的字段

        for (const key in group) {
          // 筛选差异字段
          if (group.hasOwnProperty(key)) {
            const element = group[key];
            if (element[0].variantsFlag) {
              arr3.push(element);
            } else {
              arr2.push(element);
            }

            //  设置表单验证
            element.forEach(elIn => {
              let rule = elIn.rule;
              if (rule) {
                vali[elIn.displayKey] = setRule(rule);
              }
              if (elIn.requireFlag && !elIn.rule) {
                vali[elIn.displayKey] = [
                  {
                    required: true,
                    message: "不能为空"
                  }
                ];
              }
            });
          }
        }

        inputArrs = arr.filter(el => !el.variantsFlag).concat(arr2); // 母体输入字段
        variants = arr.filter(el => el.variantsFlag).concat(arr3); // 变体字段

        // 增加表单验证
        arr.forEach(el => {
          let rule = el.rule;
          if (rule) {
            vali[el.displayKey] = setRule(rule);
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
          let rule = el.rule;
          if (rule) {
            vali[el.displayKey] = setRule(rule);
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
    fixFrameHeight(1);
  },
  watch: {
    // 监控类目获取类目的动态字段
    category(val) {
      this.getVariantData(val.categoryId);
    }
  }
};
</script>

<style lang='less'>
@import "~assets/style/variables.less";

body {
  height: 100%;
}

.purchase_box {
  overflow: auto;
  height: 560px;
}

.vue-tabs {
  width: 120px @iehack;
  height: 100%;
  display: table @iehack;
  justify-content: center @iehack;
  .tab-content {
    height: 100%;
  }
  .left-vertical-tabs {
    display: table-cell @iehack;
    // float: left;
    min-width: 126px;
    background: @sub-title-color;
    border-right: 1px solid @sub-title-color-border;
    .nav-tabs {
      border: none;
      font-size: 14px;
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
