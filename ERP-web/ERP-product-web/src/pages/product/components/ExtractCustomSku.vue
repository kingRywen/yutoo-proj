<template>
  <div>
    <v-form style="margin-bottom:20px;max-height:500px;overflow: auto" direction="horizontal">
      <v-row>
        <v-col span="24">
          <v-form-item :label-col="{span:4}" :wrapper-col="{span:16}">
            <!-- {{skus}} -->
            <div v-for="item in skus.parent">
              <div v-if="item.parentSku" class="margin-bottom-20">
                <h3><b>{{item.parentSku}}</b></h3>
                <ul style="opacity:0.8">
                  <li v-for="i in item.variantSkuCustomList">{{i}}</li>
                  <li v-for="i in item.variantSkuList">{{i}}</li>
                </ul>
                <!-- <p style="text-indent:12px" v-for="i in item.variantSkuCustomList">{{i}}</p>
                <p style="text-indent:12px" v-for="i in item.variantSkuList">{{i}}</p> -->
              </div>
            </div>
          </v-form-item>
        </v-col>
      </v-row>

    </v-form>
    <div style="text-align:center">
      <v-button v-clipboard:copy="skuCopyText" v-clipboard:success="onCopy" v-clipboard:error="onError" type="primary" size="large">复制</v-button>
    </div>
  </div>
</template>

<script>
import VueClipboards from 'vue-clipboard2';
import Vue from 'vue';
import { fetchData, showToast } from "common/common";
import apis from "apis";
Vue.use(VueClipboards);

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
  computed: {
    skuCopyText() {
      let parent = this.skus.parent, arrs = []
      if (parent) {
        parent.forEach(el => {
          arrs.push(el.parentSku, '\n')
          let _a = el.variantSkuCustomList ? el.variantSkuCustomList : el.variantSkuList
          _a.forEach((_el, index) => {
            if (index !== _a.length -1) {
              arrs.push(_el, '\n')
            } else {
              arrs.push(_el, '\n\n')
            }
          })
        })
      }
      return arrs.join('')
    }
  },
  methods: {
    onCopy() {
      showToast('success', '复制成功')
    },
    onError() {
      showToast('error', '复制失败，请手动复制')
    },
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
