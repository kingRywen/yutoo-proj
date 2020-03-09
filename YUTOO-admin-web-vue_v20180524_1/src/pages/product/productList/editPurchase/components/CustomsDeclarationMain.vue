<template>
  <div class="purchase_box">
    <!-- {{priceTab}} -->
    <CustomsDeclaration v-bind="$attrs" v-on="$listeners" :senddata.sync="parentDataMain" :rule-form="parentDataMain" type="1"></CustomsDeclaration>
    <!-- 母体差异字段 -->
    <CustomsDeclaration v-bind="$attrs" v-on="$listeners" :senddata.sync="parentDataSub" type='2'></CustomsDeclaration>
    <!-- 变体差异字段 -->
    <CustomsDeclaration v-bind="$attrs" v-on="$listeners" v-for="item in variantTab" :senddata.sync="ruleForm[item.variant.sku]" type='3' :sku="item.variant.sku" :key="item.variant.sku"></CustomsDeclaration>

    <div class="saveBtn">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="save">保存</v-button>
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="submit">提交</v-button>
      </div>
    </div>
  </div>

</template>

<script>
import CustomsDeclaration from "./CustomsDeclaration.vue";
import { fetchData, showModal } from "common/common";
import { getQueryString } from "common/util";

import apis from "apis";
export default {
  inheritAttrs: false,
  components: {
    CustomsDeclaration
  },
  data() {
    return {
      parentDataMain: {}, // 母体基本字段
      parentDataSub: {}, // 母体差异字段
      ruleForm: {}, // 变体字段
      priceTab: {
        parentEntryInfoEntity: [],
        variantEntryInfoEntityList: []
        // parentPriceMap: {
        //   productPriceEntity: {},
        //   productPriceRelEntityList: []
        // }
      }, // 新数据
      priceTabOld: {} // 获取到的服务器数据
    };
  },
  created() {
    let id = +this.catelogy.categoryId;
    let productId = +getQueryString("productId");
    // 获取数据
    fetchData({
      ...apis.PRODUCT_ENTRY_INFO_PARENT_TAB,
      data: {
        productId: productId
      }
    }).then(res => {
      if (res.data && res.data.code === 0) {
        delete res.data.code;
        this.priceTabOld = this.priceTab = res.data;
        this.parentDataMain = this.priceTab.parentEntryInfoEntity;
      }
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
          priceTab: {},
          entryInfoTab: this.priceTab,
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

    // 提交到服务器
    formSubmit() {
      // 把多选转化为字符
      fetchData({
        ...apis.PRODUCT_BASE_SAVE,
        data: {
          variantTab: this.variantTab,
          baseTab: this.baseTab,
          remarkTab: this.remarkTab,
          imgTab: {
            productParentImgEntityList: {},
            productVariantImgEntityMap: {}
          },
          deleteVariantIds: [],
          deleteImgIds: []
        }
      }).then(res => {
        console.log(res);

        console.log(location);

        if (res.data.code === 0) {
          showModal("info", "保存成功");
          // this.$emit("set", "remarkTab", this.remarkTab);
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
          priceTab: this.$attrs.allData.priceTab,
          entryInfoTab: this.priceTab,
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
          this.priceTabOld.parentEntryInfoEntity,
          val
        );
        this.priceTab.parentEntryInfoEntity = res;
      } catch (e) {
        this.priceTab.parentEntryInfoEntity = val;
      }
    },

    // 监控变体的输入字段组
    ruleForm: {
      deep: true,
      handler: function(val) {
        let parentEntryInfoEntity = [];
        for (const key in val) {
          if (val.hasOwnProperty(key)) {
            const el = val[key];
            let variant = this.variantTab.find(el => el.variant.sku === key)
              .variant;

            parentEntryInfoEntity.push({
              productPriceRelEntityList: [],
              productPriceEntity: { ...variant, ...el }
            });
          }
        }
        this.priceTab.parentEntryInfoEntity = parentEntryInfoEntity;
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
