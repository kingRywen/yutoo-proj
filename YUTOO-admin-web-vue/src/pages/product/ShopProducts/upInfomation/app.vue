<template>
  <v-spin :spinning="spinning" tip="加载中..." style="height:100%" class="product_box">

    <el-tabs ref="tab" :tab-position="'left'" style="height: 100%;padding-bottom: 49px;" type="border-card" v-model="name" class="info____tab" lazy>
      <el-tab-pane v-for="(item, index) in tabs" :label="item.title" :key="item.title" :name="item.title" class="product_box">

        <keep-alive>
          <el-tabs ref="tabs" style="height: 100%" type="card" v-model="activeKey" lazy class="product_box">
            <el-tab-pane :label="item.nameCn" :key="item.nameCn" :name="item.nameCn" v-for="(item, index) in properties" v-if="properties.length">
              <template slot="label">
                <span>{{item.nameCn}} </span>
                <el-tooltip placement="top" :open-delay="500">
                  <div slot="content">
                    <p>{{item.descCn}}</p>
                    <p>{{item.descEn}}</p>
                  </div>
                  <i class="el-icon-info editlists_info_icon"></i>
                </el-tooltip>

              </template>
              <PurchaseInputNew direction="horizontal" :rules="{}" :data="item.properties" :labelcol="{span:6}" :wrappercol="{span:14}" :bind-field="bindField" ref="purchaseinput" :disabled="isShow"></PurchaseInputNew>
            </el-tab-pane>
          </el-tabs>
        </keep-alive>
        <v-button type="primary" v-if="publicInfo.platformFlag && !isShow" @click="apply" class="btn">一键应用平台信息</v-button>
      </el-tab-pane>
    </el-tabs>

    <div class="saveBtn" v-if="!isShow">
      <div style="margin: 0 auto">
        <v-button type="primary" @click.prevent="submit" :loading="btnLoading">提交</v-button>
      </div>
    </div>
  </v-spin>
</template>

<script>
import { getQueryString } from "common/util";
import {
  fetchData,
  showToast,
  toParamUrl,
  batchValidForm,
  showConfirm
} from "common/common";
import apis from "apis";
import PurchaseInput from "components/base/purchaseInput";
import PurchaseInputNew from "components/base/purchaseInputNew";
import { Tabs, TabPane } from "element-ui";
import Vue from "vue";
Vue.use(Tabs);
Vue.use(TabPane);
export default {
  components: {
    PurchaseInput,
    PurchaseInputNew
  },
  created() {
    this.productId = +getQueryString("storeProductId");
    this.productType = +getQueryString("productType");
    this.categoryId = +getQueryString("categoryId");
    this.isShow = getQueryString("isshow");
    // 获取所有初始化数据
    fetchData({
      ...apis.STORE_PRODUCT_INFO,
      data: {
        productId: this.productId,
        productType: this.productType
      }
    }).then(res => {
      this.spinning = false;
      if (res.data.code === 0) {
        res.data.rows.properties.forEach(el => {});
        this.properties = res.data.rows.properties;
        this.activeKey = res.data.rows.properties[0].nameCn;
        this.publicInfo = res.data.rows.publicInfo;
      }
    });
  },
  data() {
    return {
      spinning: true,
      activeKey: "基本",
      bindField: {
        label: "propertyHead",
        value: "value",
        bindval: "propertyName",
        type: "dataType",
        inputType: "controlType",
        required: "mustFlag"
      },
      name: "英语",
      tabs: [
        {
          title: "英语"
        }
      ],

      productId: "",
      productType: 0,

      ruleForm: {},

      properties: [],
      publicInfo: {},

      btnLoading: false
    };
  },
  methods: {
    apply() {
      let vm = this;
      showConfirm({
        title: "提示",
        content: "是否应用平台信息的字段值?",
        onOk() {
          // 应用平台信息
          console.log(vm.$refs.purchaseinput);
          vm.$refs.purchaseinput.forEach(element => {
            element.applyVal();
          });
        }
      });
    },
    async formValid() {
      console.log(this.$refs.purchaseinput);
      let forms = this.$refs.purchaseinput;
      return await batchValidForm(forms, true);
    },
    async submit() {
      let valid = await this.formValid();
      if (valid.length > 0) {
        // 验证不通过
        showToast("warning", "请填写必填项");
        console.log(valid);
        this.activeKey = this.properties[valid[0]].nameCn;
        return;
      }
      this.btnLoading = true;
      const properties = [];
      let arr = [];
      this.properties.forEach(el => {
        arr = arr.concat(el.properties);
      });
      arr.forEach(el => {
        const { propertyName, mustFlag, propertyValue, value } = el;
        if (propertyValue) {
          // 母体
          let _propertyValue = [];
          propertyValue.forEach(_el => {
            const { variantId, value } = _el;
            if (value != null) {
              _propertyValue.push({
                variantId,
                value
              });
            }
          });
          properties.push({
            propertyName,
            variantList: _propertyValue,
            propertyValue: value,
            mustFlag
          });
        } else {
          // 变体
          if (value != null) {
            properties.push({
              propertyName,
              value,
              mustFlag
            });
          }
        }
      });
      fetchData({
        ...apis.STORE_PRODUCT_EDIT,
        data: {
          properties,
          productId: this.productId,
          productType: this.productType
        }
      })
        .then(res => {
          this.btnLoading = false;
          if (res.data.code === 0) {
            showToast("success", "提交成功");
            toParamUrl("/product/ShopProducts.html");
          } else {
            showToast("error", res.data.msg);
          }
        })
        .catch(() => {
          this.btnLoading = false;
        });
    },

    applyVal() {
      let inputs = this.$refs.input;
      console.log(inputs);
      inputs.map(el => {
        el.setVal();
      });
      showToast("success", "应用成功");
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

.bottom-60 {
  display: block;
  width: 100%;
  height: 80px;
}
</style>
<style scoped lang="scss">
.btn {
  position: absolute;
  right: 15px;
  z-index: 999999;
  top: 15px;
}
</style>

