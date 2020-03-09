<template>
  <div>
    <div class="props-item" v-for="(item, index) in properties">
      <v-card :title="item.propertyName" noHovering class="margin-bottom-20">
        <PurchaseInput v-for="(val, subIndex) in item.propertyValue" :label="val.skuStore" :type="item.propertyType" v-model="val.value" :item="{uploadMustFlag: item.mustFlag, propertyName: item.propertyName, siteId: [publicInfo.siteId]}"></PurchaseInput>
      </v-card>
    </div>
    <div class="bottom-60"></div>
    <div class="saveBtn">
      <div style="margin: 0 auto">
        <v-button type="primary" @click.prevent="submit" :loading="btnLoading">提交</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getQueryString } from "common/util";
import { fetchData, showToast } from "common/common";
import apis from "apis";
import PurchaseInput from "components/base/purchaseInput";
export default {
  components: {
    PurchaseInput
  },
  created() {
    console.log(2131);
    this.productId = +getQueryString("productId");
    this.productType = +getQueryString("productType");
    // 获取所有初始化数据
    fetchData({
      ...apis.STORE_PRODUCT_INFO,
      data: {
        productId: this.productId,
        productType: this.productType
      }
    }).then(res => {
      if (res.data.code === 0) {
        this.properties = res.data.rows.properties;
        this.publicInfo = res.data.rows.publicInfo;
      }
    });
  },
  data() {
    return {
      productId: "",
      productType: 0,

      ruleForm: {},

      properties: {},
      publicInfo: {},

      btnLoading: false
    };
  },
  methods: {
    submit() {
      this.btnLoading = true;
      fetchData({
        ...apis.STORE_PRODUCT_EDIT,
        data: {
          properties: this.properties,
          productId: this.productId,
          productType: this.productType
        }
      })
        .then(res => {
          this.btnLoading = false;
          if (res.data.code === 0) {
            showToast("success", "提交成功");
          } else {
            showToast("error", "提交失败");
          }
        })
        .catch(() => {
          this.btnLoading = false;
        });
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

.bottom-60 {
  display: block;
  width: 100%;
  height: 80px;
}
</style>
