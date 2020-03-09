<template>
  <div class="purchase_box">
    <!-- {{variantTab}} <br><br>{{priceTab.variantPriceList}} -->
    <!-- {{ruleForm}} <br><br> {{priceTab}} -->
    {{priceTab}}
    <!-- 母体基本字段 -->
    <productPrice v-bind="$attrs" v-on="$listeners" :senddata.sync="parentDataMain" :ruleform="parentDataMain" type="1"></productPrice>
    <!-- 母体差异字段 -->
    <productPrice v-bind="$attrs" v-on="$listeners" :senddata.sync="parentDataSub" type='2'></productPrice>
    <!-- 变体差异字段 -->
    <productPrice v-bind="$attrs" v-on="$listeners" v-for="item in variantTab" v-if="item.variant.activateFlag" :senddata.sync="ruleForm[item.variant.sku]" type='3' :sku="item.variant.sku" :key="item.variant.sku"></productPrice>

    <div class="saveBtn">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="save">保存</v-button>
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="submit">提交</v-button>
      </div>
    </div>
  </div>

</template>

<script>
import productPrice from "./productPrice.vue";
import { fetchData, showModal, handlerCode } from "common/common";
import { getQueryString } from "common/util";

import apis from "apis";
export default {
  inheritAttrs: false,
  components: {
    productPrice
  },
  data() {
    return {
      parentDataMain: {}, // 母体基本字段
      parentDataSub: {}, // 母体差异字段
      ruleForm: {}, // 变体字段
      priceTab: {
        variantPriceList: [],
        parentPriceMap: {
          productPriceEntity: {},
          productPriceRelEntityList: []
        }
      }, // 新数据
      priceTabOld: {} // 获取到的服务器数据
    };
  },
  created() {
    let id = +this.catelogy.categoryId;
    let productId = +getQueryString("productId");

    // 获取数据
    fetchData({
      ...apis.PRODUCT_PRICE_PARENT_TAB,
      data: {
        productId: productId
      }
    }).then(res => {
      handlerCode(res, () => {
        delete res.data.code;
        this.priceTabOld = this.priceTab = res.data;
        this.parentDataMain = this.priceTab.parentPriceMap.productPriceEntity;
      });
    });
  },
  methods: {
    // 表单验证
    submitForm() {
      let valis = [this.$refs.parentBase.submitForm()];
      Promise.all(valis)
        .then(res => {
          console.log("验证成功");
          this.formSubmit();
        })
        .catch(e => {
          console.log("验证失败");
          showToast("error", "请填写完整信息");
        });
    },

    // 保存
    save() {
      fetchData({
        ...apis.PRODUCT_PURCHASE_SAVE,
        data: {
          productId: +getQueryString("productId"),
          priceTab: this.priceTab,
          entryInfoTab: {},
          deletePriceReferenceIds: []
        }
      }).then(res => {
        // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id

        if (res.data.code === 0) {
          showModal("info", "保存成功");
        } else {
          showModal("error", "保存失败");
        }
      });
    },

    submit() {
      fetchData({
        ...apis.PRODUCT_PURCHASE_COMMIT,
        data: {
          productId: +getQueryString("productId"),
          priceTab: this.priceTab,
          entryInfoTab: {},
          deletePriceReferenceIds: []
        }
      }).then(res => {
        // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id

        if (res.data.code === 0) {
          showModal("info", "提交成功");
        } else {
          showModal("error", "提交失败");
        }
      });
    }
  },
  watch: {
    // 监控母体的输入字段
    parentData(val) {
      try {
        let res = Object.assign(
          {},
          this.priceTabOld.parentPriceMap.productPriceEntity,
          val
        );
        this.priceTab.parentPriceMap.productPriceEntity = res;
      } catch (e) {
        this.priceTab.parentPriceMap.productPriceEntity = val;
      }
    },

    // 监控变体的输入字段组
    ruleForm: {
      deep: true,
      handler: function(val) {
        let variantPriceList = [];
        for (const key in val) {
          if (val.hasOwnProperty(key)) {
            const el = val[key];
            let variant = this.variantTab.find(el => el.variant.sku === key)
              .variant;

            if (variant) {
              variantPriceList.push({
                productPriceRelEntityList: [],
                productPriceEntity: { ...variant, ...el }
              });
            }
          }
        }
        this.priceTab.variantPriceList = variantPriceList;
      }
    },

    // 监控提交到服务器的字段，直接输出到根组件
    priceTab: {
      deep: true,
      handler: function(val) {
        this.$emit("update:data", val);
      }
    }
  },
  computed: {
    variantTab() {
      return this.$attrs.allData.variantTab.productVariantList;
    },

    // 获取所有母体字段
    parentData() {
      return { ...this.parentDataMain, ...this.parentDataSub };
    },

    catelogy() {
      return this.$attrs.category;
    }
  }
};
</script>

<style lang="less">
.saveBtn {
  position: fixed;
  width: 100%;
  text-align: center;
  bottom: 0;
  left: 0;
  background: #f7f7f7;
  z-index: 222;
  padding: 20px;
  box-sizing: border-box;
  button {
    width: 160px;
  }
}
</style>
