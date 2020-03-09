<template>
  <div>
    <vue-tabs ref="tab" style="min-height:360px;height:100%" v-if="!$attrs.img">
      <v-tab v-for="(val, key) in tabs" :key="val.name" :title="val.name">
        <h3 style="padding:20px" v-if="reason[val.name] && reason[val.name].auditReason">原因: {{reason[val.name] && reason[val.name].auditReason}}</h3>
        <h3 style="padding:20px" v-else>
          原因: (没有填写原因)
        </h3>
      </v-tab>
    </vue-tabs>
    <div style="min-height:360px;height:100%" v-else>原因:
      <span v-if="audit.auditReason">{{audit.auditReason}}</span>
      <span v-else>{{(没有填写原因)}}</span>

    </div>
  </div>

</template>

<script>
import { fetchData, showToast } from "common/common";
import apis from "apis";
export default {
  data() {
    return {
      name: "PlatformInformation",
      auditMap: this.$attrs.props.item.auditMap,
      languageIdMap: this.$attrs.props.item.languageIdMap,
      item: this.$attrs.props.item,
      ids: [],

      audit: {},

      reason: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    ok() {},
    onTabClick() {},
    getData() {
      let api;
      if (this.$attrs.img) {
        // 图片审核
        fetchData({
          ...apis.PRODUCT_PLT_AUDIT_IMG_INFO,
          data: {
            productId: this.item.productId,
            platformId: this.item.platformId
          }
        }).then(res => {
          console.log(res);

          if (res.data.code === 0) {
            delete res.data.code;
            this.audit = res.data.audit;
          } else {
            showToast("error", res.data.msg);
          }
        });
      } else {
        // 语种审核
        fetchData({
          ...apis.PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
          data: {
            languageIds: this.ids,
            productPlatformId: this.item.productPlatformId,
            productPltDetailId: this.item.productId
          }
        }).then(res => {
          console.log(res);

          if (res.data.code === 0) {
            delete res.data.code;
            this.reason = res.data;
          } else {
            showToast("error", res.data.msg);
          }
        });
      }
    }
  },
  computed: {
    tabs() {
      let ret = [];
      this.ids = [];
      for (const key in this.auditMap) {
        if (this.auditMap.hasOwnProperty(key)) {
          const element = this.auditMap[key];
          if (element === 3 && this.languageIdMap[key]) {
            this.ids.push(this.languageIdMap[key]);
            ret.push({
              name: key,
              id: this.languageIdMap[key]
            });
          }
        }
      }
      return ret;
    }
  }
};
</script>

<style>
</style>
