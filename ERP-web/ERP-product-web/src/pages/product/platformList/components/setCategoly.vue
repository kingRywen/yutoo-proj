<template>
  <v-form direction="horizontal" :model="site" ref="site">
    <!-- {{sitelis}} =={{site}} -->
    <PurchaseInput v-model="site.cate" label="选择类目" type="100" @input="site.templ=null"></PurchaseInput>
    <v-form-item :label-col="{span:4}" label="选择模板" :wrapper-col="{span:16}">
      <v-select size="lg" style="width: 100%;" :data="temp" v-model="site.templ" label="name" clue="catePltTemplateId"></v-select>
    </v-form-item>

    <PurchaseInput v-model="site.all" label="字段" type="1" v-for="item in items"></PurchaseInput>
  </v-form>
</template>

<script>
import PurchaseInput from "components/base/purchaseInput";
import { fetchData, handlerCode, showToast } from "common/common";
import apis from "apis";

export default {
  name: "setCategoly",
  inheritAttrs: false,
  props: ["sitelis"],
  components: {
    PurchaseInput
  },
  created() {
    if (!this.sitelis.siteInfo.siteCategoryInfo) {
      return;
    }
    let arr = this.sitelis.siteInfo.siteCategoryInfo.split(";");
    arr = arr.map(el => +el);
    this.site.cate = arr;
    this.site.templ = this.sitelis.siteInfo.templateId;

    this.getTemp(this.sitelis.siteInfo.templateId);
  },
  data() {
    return {
      first: true,
      site: {
        cate: [],
        templ: null
      }, //站点类目和模板操作
      items: [], // 站点字段

      temp: [] // 类目模板
    };
  },
  methods: {
    getTemp(data) {
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_MODULE,
        data: {
          siteCategoryId:
            this.sitelis.siteInfo.categoryId ||
            this.site.cate[this.site.cate.length - 1]
        }
      }).then(res => {
        console.log(res);
        if (res.data.categoryList.length <= 0) {
          showToast("error", "无此模板，请重新选择类目");
        } else {
          this.temp = res.data.categoryList;
          this.first = false;
          // this.site.templ = "";
        }
      });
    }
  },
  watch: {
    site: {
      deep: true,
      handler: function(val) {
        this.$emit("update:cate", val);
      }
    },
    "site.cate"(val) {
      // this.site.templ = "";
      // 获取模板
      this.getTemp(val);
    }
    // temp(val) {
    //   if (this.first) {
    //     return;
    //   }
    //   this.site.templ = null;
    // }
  }
};
</script>

<style>
</style>
