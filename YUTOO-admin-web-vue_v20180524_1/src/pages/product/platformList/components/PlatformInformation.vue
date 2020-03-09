<template>
  <div style="height:100%">
    <!-- {{siteList}} -->
    <!-- 平台信息 -->
    <v-card style="height:100%" noHovering>
      <vue-tabs ref="tab" direction="vertical">
        <v-tab v-for="item in tabs" :key="item.title" :title="item.title">
          <keep-alive>
            <component ref="com" v-if="name === item.component" :is="name" v-bind="{siteList,parent,moduleDifferenceList,variant,disable:$attrs.disable}"></component>
          </keep-alive>
        </v-tab>
      </vue-tabs>
    </v-card>
    <!-- 平台信息 -->
  </div>
</template>

<script>
import { fetchData } from "common/common";
import { getQueryString } from "common/util";
import apis from "apis";
import langForms from "./langForms";

export default {
  inheritAttrs: false,
  components: {
    langForms
  },
  created() {
    // 获取英语页面字段
    let productPltDetailId = +getQueryString("productPltDetailId");
    fetchData({
      ...apis.PRODUCT_PLT_DETAIL_A_EN_TAB,
      data: {
        productPltDetailId
      }
    }).then(res => {
      console.log(res);
      this.siteList = res.data.siteList;
      this.moduleDifferenceList = res.data.moduleDifferenceList;
      this.parent = res.data.parent;
      this.variant = res.data.variant;
    });
  },
  data() {
    return {
      name: "langForms",
      siteList: {}, // 站点信息
      parent: {}, // 公共字段
      moduleDifferenceList: {}, // 公共差异字段
      variant: {}, // 变体公共模板字段

      allData: {
        parent: {},
        variant: [],
        siteList: [],
        variantMap: {},
        parentMap: {}
      }, // 传服务器数据
      tabs: [
        {
          title: "英语",
          component: "langForms",
          dataName: "f"
        }
      ]
    };
  }
};
</script>

<style>
</style>
