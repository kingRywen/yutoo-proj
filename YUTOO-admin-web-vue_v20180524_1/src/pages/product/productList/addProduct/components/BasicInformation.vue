<template>
  <div ref="content" class="basic">
    <!-- {{ruleForm}} <br><br> {{variantNum}} <br><br> {{variants}} <br><br> {{variantEntityList}} -->
    <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">
      <v-row :gutter="20">
        <v-col span="12">
          <v-form-item label="产品SKU" :label-col="labelCol" :wrapper-col="wrapperCol" required has-feedback>
            <v-input type="text" placeholder="" v-model="ruleForm.sku" disabled></v-input>
          </v-form-item>
        </v-col>
      </v-row>
      <v-row :gutter="20">
        <input-variant v-for="item in inputArrs" :edit="$attrs.edit" :item="item" :cate="catelogy" :options="baseEnum" :group="item.propertyGroupName" :label="item.propertyName" :disabled="item.disabled" :prop="item.displayKey" :data-type="item.dateType" :input-type="item.inputType" :key="item.displayKey" :type="item.inputType" v-model="ruleForm[item.displayKey]" @selectmore="selectmore" :labelcol="labelCol" :ruleForm="ruleForm" :wrappercol="wrapperCol" :cate-detail="ruleForm.categoryDetail"></input-variant>
      </v-row>
      <v-row :gutter="20">
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
            <h3>差异值</h3>
          </v-form-item>
        </v-col>
      </v-row>

      <!-- 母体差异值 -->
      <v-row :gutter="20" v-if="variantNum.length">
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
            <h3>{{'母体差异值'}}</h3>
          </v-form-item>
        </v-col>
        <v-col span="24" class="margin-bottom-20">
          <div v-for="(item, varIndex) in variants" :key="item.displayKey">
            <input-variant :item="item" :edit="$attrs.edit" v-if="item.displayKey != 'sku_custom'" :label="item.propertyName" :options="baseEnum" :data-type="item.dataType" :input-type="item.inputType" :disabled="item.disabled" :prop="item.displayKey" :type="item.inputType" :value="ruleForm[item.displayKey]" @input="setParentVal(item, $event)" :labelcol="labelCol" :wrappercol="wrapperCol" :cate-detail="ruleForm.categoryDetail"></input-variant>
            <!-- 有个字段不匹配，重新匹配一下 -->
            <input-variant :item="item" v-else :edit="$attrs.edit" :label="item.propertyName" :data-type="item.dataType" :options="baseEnum" :input-type="item.inputType" :disabled="item.disabled" :prop="item.displayKey" :type="item.inputType" v-model="ruleForm['skuCustom']" :labelcol="labelCol" :wrappercol="wrapperCol"></input-variant>
          </div>
        </v-col>
      </v-row>
      <!-- 母体差异值 -->

      <!-- 变体差异值 -->
      <v-row :gutter="20" v-for="(ii, index) in variantNum">
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
            <h3>{{'变体SKU:' + ii.variant.sku + ' 的差异值'}}</h3>
          </v-form-item>
        </v-col>
        <v-col span="24" class="margin-bottom-20">
          <div v-for="(item, varIndex) in variants" :key="item.displayKey">

            <input-variant :item="item" :edit="$attrs.edit" v-if="item.displayKey != 'sku_custom'" :options="baseEnum" :label="item.propertyName" :data-type="item.dataType" :input-type="item.inputType" :disabled="item.disabled" :prop="item.displayKey" :type="item.inputType" :value="variantEntityList[index][item.displayKey]" @input="setVariantValue(index, $event, item.displayKey)" :labelcol="labelCol" :wrappercol="wrapperCol" :cate-detail="ruleForm.categoryDetail"></input-variant>
            <!-- 有个字段不匹配，重新匹配一下 -->
            <input-variant :item="item" :edit="$attrs.edit" v-else :label="item.propertyName" :options="baseEnum" :data-type="item.dataType" :input-type="item.inputType" :disabled="true" :prop="item.displayKey" :type="item.inputType" :value="variantEntityList[index]['skuCustom']" @input="setVariantValue(index, $event, 'skuCustom')" :labelcol="labelCol" :wrappercol="wrapperCol"></input-variant>
          </div>
        </v-col>
      </v-row>
      <!-- 变体差异值 -->

    </v-form>
    <div class="saveBtn">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="save">保存</v-button>
        <v-button type="primary" v-if="!$attrs.show && reviewBtn" @click.prevent="submit">提交</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import inputVariant from "components/base/inputVariant.vue";
import { fetchData, showModal, toParamUrl } from "common/common";
import { isArray, getQueryString } from "common/util";
import apis from "apis";
let _cloneDeep = require("lodash/cloneDeep");

export default {
  inheritAttrs: false,
  components: {
    inputVariant
  },
  created() {
    console.log(this.$attrs.renderedField);
    this.getSku();
    this.getProperties();
    this.getEnumList();
    this.getBaseEnumList();

    if (getQueryString("type") == 1) {
      this.reviewBtn = true;
    }
  },
  mounted() {
    if (this.$attrs.show) {
      let input = this.$refs.content.querySelectorAll("input,select,textarea");
      input.forEach(el => (el.disabled = true));
    }
  },
  data: () => ({
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 14
    },
    labelCol1: {
      span: 3
    },
    wrapperCol1: {
      span: 19
    },
    ruleForm: {
      sku: "",
      platformIds: [],
      shareFlag: 0,
      variantFlag: 0,
      overseaFlag: 0,
      photoFlag: 0,
      plugFlag: 0,
      productType: 1
    },
    variantEntityList: [],
    isEdit: [],
    propertyEntityList: [],

    rules: {
      skuCustom: [
        {
          required: true,
          message: "请输入自定义SKU"
        }
      ],
      notEmpty: [
        {
          required: true,
          message: "不能为空"
        }
      ],
      purchaseId: [
        {
          required: true,
          message: "请选择采购人员"
        }
      ]
    },
    upOptions: [
      { label: "亚马逊", value: "amazon" },
      { label: "eabay", value: "eabay" },
      { label: "速卖通", value: "express" },
      { label: "wish", value: "wish" }
    ],
    inputArrs: [], //基础属性字段
    variants: [], // 变体差异字段
    propertys: [], // 扩展属性字段
    baseEnum: {}, // 基本信息页面下拉数据获取
    enumList: [], // 插头数据
    reviewBtn: false, // 是否显示提交审核按钮
    baseList: {
      // 基本信息页面下拉数据字典表
      developId: "developList",
      plugId: "plugTypeList",
      warehouseId: "warehouseList",
      riskType: "productRiskList",
      unit: "unitList",
      logisticType: "logisticList",
      brand: "brandList",
      productType: "productTypeList",
      purchaseId: "purchaseList"
    }
    // variantNum: 2 // 变体个数
  }),
  methods: {
    // 获取扩展属性
    getProperties() {
      fetchData({
        ...apis.PRODUCT_FIELD_EXTEND,
        data: {
          sourceType: this.$attrs.catelogy.sourceType,
          categoryId: this.categoryId
        }
      }).then(res => {
        this.propertys = res.data;
      });
    },

    // 设置变体差异属性的值
    setVariantValue(index, val, key) {
      console.log(index, val);
      Vue.set(
        this.variantEntityList,
        index,
        Object.assign({}, this.variantEntityList[index], {
          [key]: val
        })
      );
    },

    // 母体差异值输入时，同时改变变体的值
    setParentVal(item, val) {
      // 母体
      this.ruleForm[item.displayKey] = val;
      // 变体
      this.variantEntityList.forEach((el, index) => {
        if (!this.isEdit[index]) {
          // 排除sku 自定义sku
          if (item.displayKey == "sku" || item.displayKey == "skuCustom") {
            return;
          }
          // 没有编辑过变体的值 就同步
          Vue.set(el, item.displayKey, val);
          // el[item.displayKey] = val;
        }
      });
    },

    // 多选
    selectmore(val) {
      console.log(val);
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          const element = val[key];
          Vue.set(this.ruleForm, key, element);
        }
      }
    },

    // 获取插头数据
    getEnumList() {
      fetchData({
        ...apis.GLOBAL_ENUM_LIST,
        data: {
          type: 4
        }
      }).then(res => {
        console.log("获取插头数据", res);

        this.enumList = res.data;
      });
    },

    // 获取下拉，单选，多选选项
    getBaseEnumList() {
      fetchData({
        ...apis.PRODUCT_BASE_ENUM,
        data: {}
      }).then(res => {
        let ress = res.data;
        delete ress.code;
        console.log("获取下拉，单选，多选选项", ress);
        this.baseEnum = res.data;
      });
    },

    // 获取产品的sku
    getSku() {
      fetchData({
        ...apis._PRODUCT_SKU_GET,
        data: {
          num: 1
        }
      }).then(res => {
        console.log(res);
        // this.ruleForm.sku = res.data.skuList[0];
        this.$set(this.ruleForm, "sku", res.data.skuList[0]);
        this.$emit("update:sku", res.data.skuList[0]);
      });
    },

    // 保存
    save() {
      this.submitForm("ruleForm");
      this.formSubmit();
    },

    // 保存到服务器
    formSubmit() {
      let baseTab = this.baseTab;
      if (isArray(baseTab.productEntity.platformIds)) {
        baseTab.productEntity.platformIds = baseTab.productEntity.platformIds.join(
          ";"
        );
      }

      fetchData({
        ...apis.PRODUCT_BASE_SAVE,
        data: {
          variantTab: this.variantTab,
          baseTab: this.baseTab,
          remarkTab: {
            productVariantRemarkMap: {},
            productParentRemark: {}
          },
          deleteVariantIds: []
        }
      }).then(res => {
        // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id

        if (res.data.code === 0) {
          showModal("info", "保存成功");
          if (this.$attrs.edit) {
            return;
          }
          toParamUrl("/product/productList/addProduct.html", {
            productId: res.data.productId
          });
        } else {
          showModal("error", "保存失败");
        }
      });
    },

    // 提交到服务器
    submit() {
      if (!Object.keys(this.$attrs.remarkTab).length) {
        showModal("error", "请填写产品备注并保存");
        return;
      }

      if (isArray(this.baseTab.productEntity.platformIds)) {
        baseTab.productEntity.platformIds = baseTab.productEntity.platformIds.join(
          ";"
        );
      }

      fetchData({
        ...apis.PRODUCT_BASE_COMMIT,
        data: {
          variantTab: this.variantTab,
          baseTab: this.baseTab,
          remarkTab: {},
          deleteVariantIds: []
        }
      }).then(res => {
        // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id
        if (res.data.code === 0) {
          showModal("success", "提交成功");
          // toParamUrl("/product/productList/addProduct.html", {
          //   productId: res.data.productId || +getQueryString("productId")
          // });
        } else {
          showModal("error", "提交失败");
        }
      });
    },

    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.reviewBtn = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 提交审核
    review() {
      this.$emit("set", "baseTab", this.baseTab);
    }
  },
  watch: {
    ruleForm: {
      handler: function(v) {
        console.log(v);
        // this.submitForm("ruleForm");
        this.$nextTick(() => {
          this.submitForm("ruleForm");
        });
      },
      deep: true,
      immediate: true
    },
    variantNum: {
      deep: true,
      immediate: true,
      handler: function(val) {
        if (val.length == this.variantEntityList.length) {
          val.map((el, index) => {
            if (
              !this.variantEntityList[index].sku ||
              !this.variantEntityList[index].skuCustom
            ) {
              Vue.set(this.variantEntityList, index, {
                ...(this.allData.baseTab.variantEntityList[index] || {
                  productId: null,
                  parentProductId: null,
                  merchantId: 1
                }),
                sku: this.variantTab.productVariantList[index].variant.sku,
                skuCustom: this.variantTab.productVariantList[index].variant
                  .skuCustom
              });
            }
          });
          return;
        } else if (val.length > this.variantEntityList.length) {
          val.map((el, index) => {
            if (index < this.variantEntityList.length) {
              return;
            } else {
              Vue.set(this.variantEntityList, index, {
                ...(this.allData.baseTab.variantEntityList[index] || {
                  productId: null,
                  parentProductId: null,
                  merchantId: 1
                }),
                sku: this.variantTab.productVariantList[index].variant.sku,
                skuCustom: this.variantTab.productVariantList[index].variant
                  .skuCustom
              });
            }
          });
        } else {
          this.variantEntityList.length = val.length;
        }
      }
    },
    categoryId() {
      // this.getVariantData();
      this.getProperties();
      this.ruleForm = {};
      this.getSku();
    },

    // 绑定动态字段
    renderedField: {
      immediate: true,
      handler: function(val) {
        console.log(val);
        let reverses = val.inputArrs.sort((a, b) => {
          let m, n;
          if (isArray(a)) {
            m = a[0].propertySort;
          } else {
            m = a.propertySort;
          }
          if (isArray(b)) {
            n = b[0].propertySort;
          } else {
            n = b.propertySort;
          }
          return m - n;
        });
        this.inputArrs = reverses;
        this.variants = val.variants;
        this.rules = val.vali;
      }
    },

    // 监控basetab数据渲染到初始ruleForm
    "allData.baseTab"(val) {
      if (!this.$attrs.edit) {
        return;
      }
      this.ruleForm = val.productEntity;
      // 验证表单
      this.$nextTick(() => {
        this.submitForm("ruleForm");
      });
    }
  },
  computed: {
    // 最终提交表单的数据集合
    baseTab() {
      // 设置母体的提交数据
      let productEntity = Object.assign({}, this.ruleForm, {
        platformIds: this.ruleForm.platformIds
          ? this.ruleForm.platformIds.join(";")
          : null,
        sourceType: 1,
        categoryId: this.categoryId,
        categoryDetail: this.catelogy.categoryDetail // 用来显示类目层次的字段
      });

      // 提交时插入空字符
      if (!this.$attrs.edit) {
        this.variantEntityList.map(elMain => {
          this.variants.map(el => {
            if (el.displayKey === "sku") {
              return;
            }
            if (elMain[el.displayKey] != null) {
              return;
            }
            if (el.dateType === 2) {
              elMain[el.displayKey] = "";
            } else {
              elMain[el.displayKey] = 0;
            }
          });
        });
      }

      return {
        variantEntityList: this.variantEntityList,
        productEntity,
        propertyEntityList: this.propertyEntityList
      };
    },

    allData() {
      return this.$attrs.allData;
    },

    categoryId() {
      return this.$attrs.catelogy.categoryId;
    },

    catelogy() {
      return this.$attrs.catelogy;
    },

    variantNum() {
      let ret;
      try {
        ret = this.$attrs.allData.variantTab.productVariantList;
      } catch (e) {
        ret = [];
      }
      return ret;
    },

    variantTab() {
      return this.$attrs.allData.variantTab;
    },

    // 根据根组件的动态字段来渲染表单
    renderedField() {
      return this.$attrs.formatField.productTabField;
    }
  }
};
</script>

<style lang="less">
.basic {
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
}
.vue-tabs .tab-content .tab-container .product_box.ant-card .ant-card-body {
  height: calc(100% - 115px);
}
</style>
