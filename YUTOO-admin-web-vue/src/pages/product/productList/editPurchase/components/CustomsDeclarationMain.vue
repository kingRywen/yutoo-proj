<template>
  <v-spin tip="正在读取数据." :spinning="spinning" class="purchase_box">
    <!-- {{ruleForm}} -->
    <CustomsDeclaration v-bind="$attrs" :priceUnit="priceUnit" :unit.sync="unit" v-on="$listeners" :senddata.sync="parentDataMain" :ruleform="parentDataMain" type="1" ref="ruleform" :variantForm="ruleForm"></CustomsDeclaration>
    <div class="saveBtn" v-if="!$attrs.type">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="save" :loading="saveLoading">保存</v-button>
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="submit" :loading="commitLoading">提交</v-button>
      </div>
    </div>
  </v-spin>

</template>

<script>
import CustomsDeclaration from "./CustomsDeclaration.vue";
import {
  fetchData,
  toParamUrl,
  _storage,
  showToast,
  showConfirm,
  batchValidForm
} from "common/common";
import { getQueryString, isObj } from "common/util";
import _cloneDeep from "lodash/cloneDeep";

import apis from "apis";
export default {
  inheritAttrs: false,
  components: {
    CustomsDeclaration
  },
  data() {
    return {
      keywords: [],
      spinning: false,
      saveLoading: false,
      commitLoading: false,
      unit: "USD",
      priceUnit: [],
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
    this.getPriceUnits();
    this.isVariant = getQueryString("variant");
    let api = apis.PRODUCT_ENTRY_INFO_PARENT_TAB;
    let id = +this.catelogy.categoryId;
    let productId = +getQueryString("productId");
    this.productId = productId;
    if (getQueryString("variant")) {
      api = apis.PRODUCT_ENTRY_INFO_VARIANT_TAB;
    }
    // 获取数据
    this.spinning = true;
    fetchData({
      ...api,
      data: {
        flag: null,
        parentFlag: this.isVariant ? 0 : 1,
        productId: productId
      }
    }).then(res => {
      this.spinning = false;
      if (res.data && res.data.code === 0) {
        delete res.data.code;

        // debugger;
        let { productEntryPriceEntityList, variantEntryPriceMap } = res.data;
        // 母体
        // if (
        //   !productEntryPriceEntityList ||
        //   productEntryPriceEntityList.length == 0
        // ) {
        //   let entryInfoPrice = _storage._get(
        //     "session",
        //     "purchase.productSupplierPriceEntityList.0.supplierPrice"
        //   );

        //   productEntryPriceEntityList.push({
        //     nationId: 1,
        //     nationName: "美国",
        //     entryInfoPrice,
        //     entryInfoPriceUnit: "USD",
        //     sort: null
        //   });
        // }

        let entryInfoPrice =
          (_storage._get(
            "session",
            "purchase.productSupplierPriceEntityList.0.supplierPrice"
          ) *
            40) /
          100;

        this.$set(this.ruleForm, "main", {
          ...res.data.parentEntryInfoEntity,
          edit: false,
          productEntryPriceEntityList: res.data.productEntryPriceEntityList
            .length
            ? res.data.productEntryPriceEntityList
            : [
                // 如果报关价没有或者长度为0，则带入产品价格页面的报关价，
                // 默认美国，单位USD
                {
                  nationId: 1,
                  nationName: "美国",
                  entryInfoPrice,
                  entryInfoPriceUnit: "USD",

                  sort: null,
                  edit_numStart: false,
                  edit_numEnd: false,
                  edit_sharePrice: false
                }
              ]
        });

        res.data.variantEntryInfoEntityList.forEach(element => {
          let _variant = this.variantTab.find(
            el => el.variant.productId === element.productId
          ).variant;
          const { sku, skuCustom } = _variant;
          this.$set(this.ruleForm, sku, {
            ...element,
            skuCustom,
            edit: false,
            productEntryPriceEntityList: res.data.variantEntryPriceMap[sku]
              .length
              ? res.data.variantEntryPriceMap[sku]
              : [
                  // 如果报关价没有或者长度为0，则带入产品价格页面的报关价，
                  // 默认美国，单位USD
                  {
                    nationId: 1,
                    nationName: "美国",
                    entryInfoPrice,
                    entryInfoPriceUnit: "USD",

                    edit_numStart: false,
                    edit_numEnd: false,
                    edit_sharePrice: false,
                    sort: null
                  }
                ]
          });
        });
      }
    });
  },
  methods: {
    // 获取价格单位列表
    getPriceUnits() {
      this.spinning = true;
      fetchData({
        ...apis.GLOBAL_UNIT_ITEM_LIST,
        method: "get",
        params: {}
      }).then(res => {
        this.spinning = false;
        if (res.data.code === 0) {
          this.priceUnit = res.data.rows.map(el => ({ label: el, value: el }));
        } else {
          showToast("error", res.data.msg);
        }
      });
    },
    // 表单验证
    async submitForm() {
      let forms = [this.$refs.ruleform];

      forms = forms.filter(el => el.$refs.ruleForm);

      return await batchValidForm(forms);
    },

    getEntryData() {
      const data = this.$refs.ruleform.ruleForm;
      const deleteEntryPriceIds = this.$refs.ruleform.deleteEntryPriceIds;
      const isSetVariantEntryPrice =
        this.$refs.ruleform.showField.indexOf("entryPrice") === -1;
      let ret = {
        parentEntryInfoEntity: {},
        productEntryPriceEntityList: [],
        variantEntryInfoEntityList: [],
        variantEntryPriceMap: {},
        deleteEntryPriceIds
      };

      ret.parentEntryInfoEntity = _cloneDeep(data.main);
      // debugger;
      let productEntryPriceEntityList = _cloneDeep(
        ret.parentEntryInfoEntity.productEntryPriceEntityList
      );

      ret.productEntryPriceEntityList = productEntryPriceEntityList;
      delete ret.parentEntryInfoEntity.productEntryPriceEntityList;

      for (const key in data) {
        if (data.hasOwnProperty(key) && key !== "main") {
          const element = _cloneDeep(data[key]);
          const list = _cloneDeep(element.productEntryPriceEntityList);
          delete element.productEntryPriceEntityList;
          ret.variantEntryInfoEntityList.push(element);
          if (isSetVariantEntryPrice) {
            ret.variantEntryPriceMap[key] = list;
          }
        }
      }
      return ret;
    },

    // 验证敏感关键词
    setKeywords(data) {
      let vm = this;
      // let arr = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (isObj(element)) {
            vm.setKeywords(element);
          } else {
            if (
              key === "titleEn" ||
              key === "entryNameEn" ||
              key === "entryNameZh"
            ) {
              vm.keywords.push(element);
            }
          }
        }
      }
    },

    async validKeyword(data) {
      this.setKeywords(data);
      let valis = await fetchData({
        ...apis.PRODUCT_KEY_WORD_VERIFY_1,
        data: { word: this.keywords.join(";") }
      });

      if (Object.keys(valis.data).length > 1) {
        let str = ``;
        for (const key in valis.data) {
          if (valis.data.hasOwnProperty(key)) {
            const element = valis.data[key];
            if (key === "code") {
              continue;
            }
            str += key + " " + element;
          }
        }
        return str;
      } else {
        return null;
      }
    },

    // 保存
    async save() {
      let vm = this;
      const data = this.getEntryData();
      let res = await this.validKeyword(data);
      if (res) {
        showConfirm({
          title: "存在敏感关键词 " + res + ",是否继续？",
          onOk() {
            vm.save1(data);
          }
        });
        return;
      }

      this.save1(data);
    },

    save1(data) {
      let vm = this;
      let productId = +getQueryString("productId");
      if (getQueryString("variant")) {
        productId = +getQueryString("parentId");
      }

      this.saveLoading = true;
      fetchData({
        ...apis.PRODUCT_ENTRY_INFO_UPDATE,
        data
      }).then(res => {
        this.saveLoading = false;
        if (res.data.code === 0) {
          showToast("success", "保存成功");
          // 刷新数据
          fetchData({
            ...apis.PRODUCT_ENTRY_PRICE_LIST,
            data: { productId }
          }).then(res => {
            if (res.data.code === 0) {
              let ruleForm = vm.$refs.ruleform.ruleForm;
              // debugger;
              let {
                productEntryPriceEntityList,
                variantEntryPriceMap
              } = res.data;
              ruleForm.main.productEntryPriceEntityList = productEntryPriceEntityList;
              for (const key in ruleForm) {
                if (ruleForm.hasOwnProperty(key)) {
                  let element = ruleForm[key];
                  if (key === "main") {
                    continue;
                  }
                  element = variantEntryPriceMap[key];
                }
              }
            }
          });
        } else {
          showToast("error", "保存失败");
        }
      });
    },

    async submit() {
      let vm = this;
      let productId = +getQueryString("productId");
      if (getQueryString("variant")) {
        productId = +getQueryString("parentId");
      }
      const data = this.getEntryData();

      if (await this.submitForm()) {
        let res = await this.validKeyword(data);
        if (res) {
          showConfirm({
            title: "存在敏感关键词 " + res + ",是否继续？",
            onOk() {
              vm.submit1(data);
            }
          });
          return;
        }
        vm.submit1(data);
      } else {
        this.commitLoading = false;
        showToast("error", "请填写完整正确的表单项");
      }
    },
    submit1(data) {
      this.commitLoading = true;
      fetchData({
        ...apis.PRODUCT_PURCHASE_COMMIT,
        data: {
          ...data,
          type: "entryInfo",
          productId: this.productId
        }
      }).then(res => {
        this.commitLoading = false;
        // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id

        if (res.data.code === 0) {
          showToast("success", res.data.msg);
          toParamUrl("/product/productList.html");
        } else {
          showToast("error", res.data.msg);
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
    // ruleForm: {
    //   deep: true,
    //   handler: function(val) {
    //     let parentEntryInfoEntity = [];
    //     for (const key in val) {
    //       if (val.hasOwnProperty(key)) {
    //         const el = val[key];
    //         let variant = this.variantTab.find(el => el.variant.sku === key)
    //           .variant;

    //         parentEntryInfoEntity.push({ ...variant, ...el });
    //       }
    //     }
    //     this.priceTab.variantEntryInfoEntityList = parentEntryInfoEntity;
    //   }
    // },

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
  left: 126px;
  background: #f7f7f7;
  z-index: 222;
  padding: 8px;
  box-sizing: border-box;
  button {
    width: 160px;
  }
}
</style>
