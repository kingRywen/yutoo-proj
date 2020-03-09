<template>
  <div style="height:100%">
    <el-tabs style="height: 100%;" type="border-card" v-model="name">
      <el-tab-pane v-for="(item, index) in mainTabs" :label="item.title" :key="item.title" :name="item.title" lazy>
        <v-card v-if="item.title === '基本信息'" noHovering class="product_box" :title="item.title" :loading="loading">
          <iframe :src="src" frameborder="0" class="review__frame"></iframe>
        </v-card>
        <v-card v-else noHovering class="product_box" :title="item.title" :loading="loading">
          <div>
            <v-form direction="horizontal" :model="ruleForm" ref="ruleform">
              <v-row>
                <v-col span="24">
                  <v-form-item label="审核" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="[{required:true, message: '请选择审核结果'}]" prop="auditStatus" required>
                    <v-radio-group v-model="ruleForm.auditStatus" @change="change" :data="[{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]">
                    </v-radio-group>
                  </v-form-item>
                </v-col>
                <v-col span="24">
                  <v-form-item label="原因" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.auditReason"></v-input>
                  </v-form-item>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { Tabs, TabPane } from "element-ui";
import apis from "apis";
import { fetchData, showConfirm, toParamUrl, showToast } from "common/common";
// 异步组件
const productVariant = () =>
  import("../productList/addProduct/components/productVariant.vue").then(
    m => m.default
  );
const BasicInformation = () =>
  import("../productList/addProduct/components/BasicInformation.vue").then(
    m => m.default
  );
const Remark = () =>
  import("../productList/addProduct/components/Remark.vue").then(
    m => m.default
  );
const ProductRelatedAccessories = () =>
  import("../productList/addProduct/components/ProductRelatedAccessories.vue").then(
    m => m.default
  );
const ProductDeliveryPackage = () =>
  import("../productList/addProduct/components/ProductDeliveryPackage.vue").then(
    m => m.default
  );
const RelatedPictures = () =>
  import("../productList/addProduct/components/RelatedPictures.vue").then(
    m => m.default
  );

Vue.use(Tabs);
Vue.use(TabPane);

export default {
  inheritAttrs: false,
  components: {
    productVariant,
    BasicInformation,
    Remark,
    ProductRelatedAccessories,
    ProductDeliveryPackage,
    RelatedPictures
  },
  created() {
    console.log(this.$attrs);
    this.ruleForm.productIds = [this.$attrs.item.productId];
    this.ruleForm.auditType = this.$attrs.item.productBaseStatus == 2 ? 1 : 2;
    this.ruleForm.auditStatus = this.$attrs.item.auditStatus;
  },
  data() {
    return {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
      ruleForm: {
        auditStatus: null
      },
      rules: {},
      loading: false,
      name: "审核",
      mainTabs: [
        {
          title: "审核"
        },
        {
          title: "基本信息"
        }
      ],
      tabs: [
        {
          title: "产品变体",
          component: "productVariant"
        },
        {
          title: "基本信息",
          component: "BasicInformation"
        },
        {
          title: "产品备注",
          component: "Remark"
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
          component: "RelatedPictures"
        }
      ]
    };
  },
  methods: {
    change(val) {
      this.ruleForm.auditStatus = val;
    },
    ok() {
      let self = this;
      this.$refs.ruleform[0].validate(valid => {
        if (valid) {
          showConfirm({
            title: "您是否提交审核结果",
            content: "",
            onOk: function() {
              self.$root.$children[0].asyncConfirmLoading = true;
              console.log({ ...self.ruleForm, auditType: 1 });
              // 提交审核
              fetchData({
                ...apis.PRODUCT_AUDIT_UPDATE,
                data: { ...self.ruleForm, auditType: 1 }
              }).then(res => {
                if (res.data.code === 0) {
                  self.$root.$children[0].asyncModalVisible = false;
                  self.$root.$children[0].asyncConfirmLoading = false;
                  self.$listeners.set();
                } else {
                  showToast("error", res.data.msg);
                  self.$root.$children[0].asyncConfirmLoading = false;
                }
              });
            }
          });
        } else {
          this.name = "审核";
        }
      });
    }
  },
  computed: {
    src() {
      let hash =
        "/product/productList/addProduct.html?productId=" +
        this.$attrs.item.productId +
        "&isshow=true";
      return hash;
    }
  }
};
</script>

<style lang='less'>
@import "~assets/style/variables.less";

body {
  height: 100%;
}

.vue-tabs {
  width: 120px @iehack;
  height: 100%;
  display: table @iehack;
  justify-content: center @iehack;
  .left-vertical-tabs {
    display: table-cell @iehack;
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
        .ant-card-head {
          height: 42px;
          line-height: 42px;
        }
      }
    }
  }
}
</style>
