<template>
  <div class="remark" ref="content">

    <!-- 母体基本字段 -->
    <Remark v-bind="$attrs" v-on="$listeners" :sku="getSKU" isParent="1" @change="setParentDiffer" :model="ruleForm.productParentRemark" ref="parentBase"></Remark>
    <!-- 母体差异字段 -->
    <h2 style="margin:30px 0">母体差异字段</h2>
    <Remark v-bind="$attrs" v-on="$listeners" :sku="getSKU" @change="setParentDiffer" :model="ruleForm.productParentRemark" ref="parentDiffer"></Remark>
    <!-- 变体差异字段 -->
    <Remark v-bind="$attrs" v-on="$listeners" v-for="(val, key, index) in variantList" :model="ruleForm.productVariantRemarkMap" :sku="val.variant.sku" differ="1" @change="setSubDiffer(val.variant.sku, $event)" :ref="val.variant.sku"></Remark>

    <div class="saveBtn">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="submitForm">保存</v-button>
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="submit">提交</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Remark from "./Remark.vue";
import { fetchData, showModal, toParamUrl, showToast } from "common/common";
import { isArray } from "common/util";
import apis from "apis";
export default {
  inheritAttrs: false,
  props: ["data"],
  components: {
    Remark
  },
  mounted() {
    if (this.$attrs.show) {
      let input = this.$refs.content.querySelectorAll("input,select,textarea");
      input.forEach(el => (el.disabled = true));
    }

    // 如果是编辑页
    if (this.$attrs.edit) {
      this.ruleForm = this.$attrs.remarkTab;
      // fetchData({
      //   ...apis.PRODUCT_REMARK_PARENT_BASE_TAB,
      //   data: {
      //     productId: +this.$attrs.productId
      //   }
      // }).then(res => {
      //   console.log(res, "-----------------------------");
      //   if (res.data && res.data.code === 0) {
      //     this.ruleForm = res.data;
      //   }
      // });
    }
  },
  data: () => ({
    defaultMsg: "",
    config: {
      initialFrameWidth: null,
      initialFrameHeight: 350
    },

    ruleForm: {
      productParentRemark: {},
      productVariantRemarkMap: {}
    },
    rangeTime: ["", ""],
    upload: {
      name: "file",
      action: "/upload"
    },
    rules: {},
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 18
    },

    inputArrs: [], //基础属性字段
    variants: [], // 变体差异字段
    // productVariantRemarkMap: {}, // 存储变体数据

    remarkTab: {
      // 最终要提交的数据
      productVariantRemarkMap: {},
      productParentRemark: {}
    }
  }),
  methods: {
    // 上传文件监听事件
    onUploadChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        showToast("success", info.file.name + " 上传成功.");
      } else if (info.file.status === "error") {
        showToast("warning", info.file.name + " 上传失败.");
      }
    },

    // 设置母体字段
    setParentDiffer(val) {
      console.log(val);
      Vue.set(
        this.remarkTab,
        "productParentRemark",
        Object.assign({}, this.remarkTab.productParentRemark, val)
      );
    },

    // 设置变体字段
    setSubDiffer(sku, val) {
      console.log(val);
      Vue.set(
        this.remarkTab,
        "productVariantRemarkMap",
        Object.assign({}, this.remarkTab.productVariantRemarkMap, val)
      );
    },

    save() {
      // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id
      this.formSubmit();
    },

    submit() {
      if (!Object.keys(this.baseTab).length) {
        showModal("error", "请填写基本信息并保存");
        return;
      }

      fetchData({
        ...apis.PRODUCT_BASE_COMMIT,
        data: {
          variantTab: this.variantTab,
          baseTab: this.baseTab,
          remarkTab: this.remarkTab,
          deleteVariantIds: []
        }
      }).then(res => {
        // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id

        if (res.data.code === 0) {
          showModal("info", "提交成功");
        } else {
          showModal("error", "提交失败");
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
          this.$emit("set", "remarkTab", this.remarkTab);
        } else {
          showModal("error", "保存失败");
        }
      });
    },

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
    }
  },
  watch: {
    // 监听表单字段输入
    ruleForm: {
      handler: function(v) {
        console.log(v);
        // this.remarkTab = v;
      },
      deep: true
    },

    // 初始化日期
    rangeTime: {
      handler: function(v) {
        this.ruleForm.saleTimeStart = v[0];
        this.ruleForm.saleTimeEnd = v[1];
        console.log(this.ruleForm);
      },
      deep: true,
      immediate: true
    },

    // 监控根组件的变体数量
    variantList: {
      immediate: true,
      deep: true,
      handler: function(val) {
        this.remarkTab.productVariantRemarkMap = {};
        val.map(el => {
          this.remarkTab.productVariantRemarkMap[el.variant.sku] = {};
        });
      }
    }
  },
  computed: {
    // 获取变体list
    variantList() {
      let ret;
      try {
        ret = this.$attrs.allData.variantTab.productVariantList;
      } catch (e) {
        ret = [];
      }
      return ret;
    },

    // 根据根组件的动态字段来渲染表单
    renderedField() {
      return this.$attrs.formatField.remarkTabFied;
    },

    // 获取母体sku
    getSKU() {
      return this.$attrs.parentSKU;
    },

    // 父组件的值（其它tab页编辑的值）
    variantTab() {
      // 产品变体
      return this.$attrs.allData.variantTab;
    },
    baseTabOrigin() {
      // 基本信息
      return this.$attrs.allData.baseTab;
    },
    baseTab() {
      let ret = Object.assign({}, this.baseTabOrigin);
      if (isArray(ret.productEntity.platformIds)) {
        ret.productEntity.platformIds = ret.productEntity.platformIds.join(";");
      }

      return ret;
    }
  }
};
</script>

<style lang="less">
.remark {
  .ant-form-inline .ant-form-item {
    margin-bottom: 24px;
  }
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
