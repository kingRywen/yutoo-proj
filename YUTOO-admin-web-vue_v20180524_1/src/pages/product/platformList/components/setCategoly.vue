<template>
  <v-form direction="horizontal" :model="site" ref="site">
    <PurchaseInput v-model="site.cate" label="选择类目" type="100"></PurchaseInput>
    <v-form-item :label-col="{span:4}" label="选择模板" :wrapper-col="{span:16}">
      <v-select size="lg" style="width: 100%;" :data="temp" v-model="site.templ" label="name" clue="catePltTemplateId"></v-select>
    </v-form-item>

    <PurchaseInput v-model="site.all" label="字段" type="1" v-for="item in items"></PurchaseInput>
  </v-form>
</template>

<script>
import PurchaseInput from "components/base/purchaseInput";
import { fetchData, handlerCode, showModal } from "common/common";
import apis from "apis";

export default {
  name: "setCategoly",
  inheritAttrs: false,
  props: ["sitelis"],
  components: {
    PurchaseInput
  },
  created() {
    // fetchData({ ...apis.PRODUCT_PLT_DETAIL_A_EN_CATEGORY }).then(res => {
    //   console.log(res);
    // });
  },
  data() {
    return {
      site: {
        cate: []
      }, //站点类目和模板操作
      items: [], // 站点字段

      temp: [] // 类目模板
    };
  },
  watch: {
    sitelis(val) {
      this.site.cate.push(val.siteInfo.categoryId);
      this.temp = [val.siteInfo.templateId];
    },

    site: {
      deep: true,
      handler: function(val) {
        this.$emit("update:cate", val);
      }
    },
    "site.cate"(val) {
      // 获取模板
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_MODULE,
        data: {
          siteCategoryId:
            this.sitelis.siteInfo.templateId ||
            this.site.cate[this.site.cate.length - 1]
        }
      }).then(res => {
        console.log(res);
        handlerCode(res, () => {
          if (res.data.categoryList.length <= 0) {
            showModal("error", "无此模板，请重新选择类目");
          } else {
            this.temp = res.data.categoryList;
          }
        });
      });
    }
  }
};
</script>

<style>
</style>
