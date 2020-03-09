<template>
  <div>
    <v-form style="margin-bottom:20px" direction="horizontal">
      <v-row>
        <v-col span="24">
          <v-form-item label="sku" :label-col="{span:4}" :wrapper-col="{span:16}">
            <!-- {{skus}} -->
            <div v-for="item in skus.parent">
              <div v-if="item.parentSku" class="margin-bottom-20">
                <h3>{{item.parentSku}}</h3>
                <p style="text-indent:20px" v-for="i in item.variantSkuCustomList">{{i}}</p>
                <p style="text-indent:20px" v-for="i in item.variantSkuList">{{i}}</p>
              </div>
            </div>
          </v-form-item>
        </v-col>
      </v-row>

    </v-form>
    <div style="text-align:center">
      <v-button type="primary" @click="ok" size="large">保存</v-button>
    </div>
  </div>
</template>

<script>
import { fetchData } from "common/common";
import apis from "apis";

export default {
  inheritAttrs: false,
  created() {
    let api;
    if (this.$attrs.sku) {
      api = apis.PRODUCT_BATCH_SKU;
    } else {
      api = apis.PRODUCT_BATCH_CUSTOM_SKU_GET;
    }
    let { parentIds, variantIds } = this.$attrs;
    fetchData({
      ...api,
      data: { parentIds, variantIds }
    }).then(res => {
      delete res.data.code;
      this.skus = res.data;
    });
  },
  data() {
    return {
      skus: { parent: null }
    };
  },
  methods: {
    // 确认按钮
    ok() {
      this.$listeners.set(this);
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style>
</style>
