<template>
  <div>
    <!-- {{variantList}} -->
    <!-- 站点操作 -->
    <v-card :title="list.siteName + '站'" v-for="(list, index) in siteList" noHovering style="margin-left:20px" class="margin-bottom-20">
      <setCategoly :cate.sync="site[list.siteInfo.siteId]" :sitelis="list"></setCategoly>
    </v-card>

    <div v-if="getFieldDataParam.catePltTempIds.length">
      <!-- 公共字段 -->
      <v-card title="公共字段" noHovering style="margin-left:20px" class="margin-bottom-20">
        <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm1">
          <!-- 模板公共 -->
          <PurchaseInput v-for="item in basicField" v-model="ruleForm[item.displayKey]" :item="item" :data-type="item.dataType" :label="item.displayName" :type="item.propertyType"></PurchaseInput>
        </v-form>
        <v-form direction="horizontal" :model="parentDaynOrign" :rules="rules" ref="ruleForm2">
          <!-- 动态公共 -->
          <PurchaseInput v-for="item in templData.dynamicList" v-model="parentDaynOrign[item.displayKey]" :data-type="item.dataType" @input="publicDaynInput(item, $event)" :item="item" :label="item.displayName" :type="item.propertyType"></PurchaseInput>

        </v-form>
      </v-card>

      <!-- 母体差异字段 -->
      <v-card :title="`母体差异字段`" noHovering style="margin-left:20px" class="margin-bottom-20">
        <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm3">
          <!-- 模板差异 -->
          <PurchaseInput v-for="item in basicVariantField" v-model="ruleForm[item.displayKey]" :data-type="item.dataType" @input="parentTemplDiffInput(item, $event)" :item="item" :label="item.displayName" :type="item.propertyType"></PurchaseInput>
        </v-form>
        <v-form direction="horizontal" :model="parentDaynOrign" :rules="rules" ref="ruleForm4">
          <!-- 动态差异 -->
          <PurchaseInput v-for="item in templData.differenceList" v-model="parentDaynOrign[item.displayKey]" :data-type="item.dataType" @input="parentDynaDiffInput(item, $event)" :item="item" :label="item.displayName" :type="item.propertyType"></PurchaseInput>
        </v-form>
      </v-card>

      <!-- 变体差异字段 -->
      <v-card :title="`SKU:${key}差异字段`" noHovering style="margin-left:20px" v-for="(vari, key, index) in $attrs.variant" class="margin-bottom-20">
        <v-form direction="horizontal" :model="ruleFormVarinat[key]" :rules="rules" :ref="'ruleForm'">
          <!-- 模板差异 -->
          <PurchaseInput v-for="item in basicVariantField" v-model="ruleFormVarinat[key][item.displayKey]" :data-type="item.dataType" @input="variantTemplDiffInput(item, $event)" :item="item" :label="item.displayName" :type="item.propertyType"></PurchaseInput>
        </v-form>
        <v-form direction="horizontal" :model="variantDaynOrign[key]" :rules="rules" :ref="'ruleForm'">
          <!-- 动态差异 -->
          <PurchaseInput v-for="item in templData.differenceList" v-model="variantDaynOrign[key][item.displayKey]" :data-type="item.dataType" @input="variantDynaDiffInput(item, $event, key)" :item="item" :label="item.displayName" :type="item.propertyType"></PurchaseInput>
        </v-form>
      </v-card>

    </div>
  </div>
</template>

<script>
import PurchaseInput from "components/base/purchaseInput";
import setCategoly from "./setCategoly.vue";
import { fetchData, showModal, showToast } from "common/common";
import { getQueryString } from "common/util";
import bus from "common/bus";
import apis from "apis";

export default {
  inheritAttrs: false,
  // props: ["siteList"],
  components: {
    PurchaseInput,
    setCategoly
  },
  created() {
    // 监控父组件的按钮事件
    bus.$on("save", () => {
      this.go();
    });
    bus.$on("submit", () => {
      this.submitForm(() => {
        this.submit();
      });
    });
  },
  data() {
    return {
      ruleForm: {}, // 母体输入绑定值

      ruleFormVarinat: {}, // 变体输入绑定值

      parentDaynOrign: {}, // 母体动态字段输入绑定值
      variantDaynOrign: {}, // 变体动态字段输入绑定值

      parentMap: {}, // 母体动态字段传输
      variantMap: {}, // 变体动态字段传输

      allData: {},

      rules: {}, // 验证数据
      site: {}, //站点类目和模板操作

      getFieldDataParam: {
        // 获取模板字段的参数
        productPltDetailId: "",
        productId: "",
        catePltTempIds: []
      },

      // 获取到的模板字段信息
      templData: {}
    };
  },
  methods: {
    // 验证所有必填字段的表单
    submitForm(callback) {
      let p1 = new Promise((resolve, reject) => {
        this.$refs.ruleForm1.validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      let p2 = new Promise((resolve, reject) => {
        this.$refs.ruleForm2.validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      let p3 = new Promise((resolve, reject) => {
        this.$refs.ruleForm3.validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      let p4 = new Promise((resolve, reject) => {
        this.$refs.ruleForm4.validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      let p5 = this.$refs.ruleForm.map(form => {
        return new Promise((resolve, reject) => {
          form.validate(valid => {
            if (valid) {
              resolve();
            } else {
              reject();
            }
          });
        });
      });

      callback();

      // Promise.all([p1, p2, p3, p4])
      //   .then(() => {
      //     console.log("通过验证");
      //     callback();
      //   })
      //   .catch(() => {
      //     showToast("error", "请填写必填字段");
      //     console.log("没有通过验证");
      //   });
    },

    getFieldData() {
      // 请求类目字段 如果是编辑状态还带有值 - -！！
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_FIELD,
        data: this.getFieldDataParam
      }).then(res => {
        let rules = {};
        console.log(res);
        delete res.data.code;
        this.templData = res.data;

        // 添加验证
        this.templData.differenceList.forEach(el => {
          if (el.uploadMustFlag) {
            rules[el.displayKey] = {
              required: true,
              message: "不能为空"
            };
          }
        });
        this.templData.dynamicList.forEach(el => {
          if (el.uploadMustFlag) {
            rules[el.displayKey] = {
              required: true,
              message: "不能为空"
            };
          }
        });
        this.templData.moduleDifferenceList.forEach(el => {
          if (el.uploadMustFlag) {
            rules[el.displayKey] = {
              required: true,
              message: "不能为空"
            };
          }
        });
        this.rules = rules;

        // 初始化所有已编辑过的值
        // 初始化母体动态公共字段
        for (const key in res.data.parentMap) {
          if (res.data.parentMap.hasOwnProperty(key)) {
            const el = res.data.parentMap[key];
            if (
              !(el.propertyName in this.parentDaynOrign) ||
              this.parentDaynOrign[el.propertyName] == null
            ) {
              this.parentDaynOrign[el.propertyName] = el.propertyValue;
            }
          }
        }

        // 初始化变体差异字段
        // res.data.variantMap()
        for (const key in res.data.variantMap) {
          if (res.data.variantMap.hasOwnProperty(key)) {
            const element = res.data.variantMap[key];
            for (const k in element) {
              if (element.hasOwnProperty(k)) {
                const el = element[k];
                console.log(k, key, el.propertyValue);
                this.variantDaynOrign[k][key] = el.propertyValue;
              }
            }
          }
        }
        // variantDaynOrign
      });
    },

    // 母体公共差异字段输入
    parentTemplDiffInput(item, val) {
      // this.publicDaynInput(item, val);
    },

    // 母体动态差异字段输入
    parentDynaDiffInput(item, val) {
      this.publicDaynInput(item, val);
    },

    // 变体模板差异字段输入
    variantTemplDiffInput(item, val) {
      // this.publicDaynInput(item, val);
    },

    // 变体动态差异字段输入
    variantDynaDiffInput(item, val, key) {
      console.log(item, val, key);
      let value = {
        ...this.variantMap,
        [item.displayKey]: {
          [key]: {
            productPltDetailId: this.variantList[key].productPltDetailId,
            modelPropertyId: item.catePltTempPropId,
            propertyValue: val,
            propertyName: item.displayKey
          }
        }
      };
      this.$set(this.variantMap, item.displayKey, {
        ...this.variantMap[item.displayKey],
        [key]: {
          productPltDetailId: this.variantList[key].productPltDetailId,
          modelPropertyId: item.catePltTempPropId,
          propertyValue: val,
          propertyName: item.displayKey
        }
      });
    },

    // 母体动态公共字段输入
    publicDaynInput(item, val) {
      console.log(item, val);
      this.$set(this.parentMap, item.displayKey, {
        productPltDetailId: this.getFieldDataParam.productPltDetailId,
        modelPropertyId: item.catePltTempPropId,
        propertyValue: val,
        propertyName: item.displayKey
      });
    },

    // 保存
    go() {
      // this.submitForm();
      let variant = [];
      this.allData = {
        parent: this.ruleForm,
        variant: this.ruleFormVarinat,
        siteList: this.siteList,
        variantMap: this.variantMap,
        parentMap: this.parentMap
      };

      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_SAVE,
        data: this.allData
      }).then(res => {
        if (res.data.code === 0) {
          showModal("success", "保存成功");
        } else {
          showModal("error", "保存失败");
        }
      });
    },

    // 提交
    submit() {
      console.log("提交");
      let variant = [];
      this.allData = {
        parent: this.ruleForm,
        variant: this.ruleFormVarinat,
        siteList: this.siteList,
        variantMap: this.variantMap,
        parentMap: this.parentMap
      };

      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_COMMIT,
        data: this.allData
      }).then(res => {
        if (res.data.code === 0) {
          showModal("success", "提交成功");
        } else {
          showModal("error", "提交失败");
        }
      });
    }
  },
  watch: {
    siteList(val) {
      val.map(el => {
        this.$set(this.site, el.siteInfo.siteId, {});

        // 获取初始模板数据的catePltTempIds
        this.getFieldDataParam.catePltTempIds.push(el.siteInfo.templateId);
      });
    },
    site: {
      deep: true,
      handler: function(val, oldVal) {
        // 获取选择的类目id
        let cateId = [];
        for (const key in val) {
          console.log(val);
          if (val.hasOwnProperty(key)) {
            const el = val[key];
            if (!el.templ) {
              continue;
            }
            cateId.push(el.templ);
          }
        }

        this.siteList.map(el => {
          // 获取设置的模板id
          let siteMain = val[el.siteInfo.siteId];
          let len = 1;
          if (siteMain.cate) {
            len = siteMain.cate.length;
            el.siteInfo.categoryId = siteMain.cate[len - 1];
            el.siteInfo.templateId = siteMain.templ;
          }
        });

        if (cateId.length <= 0) {
          return;
        }

        this.getFieldDataParam.catePltTempIds = cateId;
      }
    },
    getFieldDataParam: {
      // immediate: true,
      deep: true,
      handler: function() {
        this.getFieldData();
      }
    },

    parent(val) {
      this.getFieldDataParam.productPltDetailId = val.productPltDetailId;
      this.getFieldDataParam.productId = val.productId;
      this.ruleForm = { ...val };
    },

    // 监控变体列表，生成保存变体的数据对象
    variantList(val) {
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          const el = val[key];
          const {
            productPltDetailId,
            parentPltDetailId,
            productId,
            languageId,
            productPlatformId,
            sku
          } = el;
          this.$set(this.ruleFormVarinat, key, {
            productPltDetailId,
            parentPltDetailId,
            productId,
            languageId,
            productPlatformId,
            sku
          });
          this.$set(this.variantDaynOrign, key, { ...el });
        }
      }
    }
  },
  computed: {
    siteList() {
      return this.$attrs.siteList;
    },
    moduleDifferenceList() {
      return this.$attrs.moduleDifferenceList;
    },
    parent() {
      return this.$attrs.parent;
    },
    variantList() {
      return this.$attrs.variant;
    },

    // 公共模板基本字段
    basicField() {
      if (!this.templData.moduleDifferenceList) {
        return;
      }
      return this.templData.moduleDifferenceList.filter(
        el => el.variantsDisparityFlag == 0
      );
    },

    // 公共模板差异字段
    basicVariantField() {
      if (!this.templData.moduleDifferenceList) {
        return;
      }
      return this.templData.moduleDifferenceList.filter(
        el => el.variantsDisparityFlag == 1
      );
    }
  }
};
</script>

<style>
</style>
