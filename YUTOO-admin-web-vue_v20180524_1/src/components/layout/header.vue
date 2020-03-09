<template>
  <v-header class="header_wrapper">
    <div class="logo" @click="toggleNav"></div>
    <v-menu theme="dark" mode="horizontal" :data="menuData" style="line-height: 64px"></v-menu>
    <div class="right">
      <ul>
        <li>
          <a href="#">
            <v-icon type="aliwangwang"></v-icon>联系客服</a>
        </li>
        <li>
          <a href="#">
            <v-icon type="question-circle"></v-icon>帮助中心</a>
        </li>
      </ul>
    </div>
  </v-header>
</template>
<script>
import bus from "common/bus.js";
let _find = require("lodash/find");

export default {
  name: "yt-header",
  inheritAttrs: false,
  methods: {
    toggleNav() {
      bus.$emit("toggle");
    }
  },
  computed: {
    menuData() {
      const data = this.$attrs.data;
      return data.map(el => {
        if (!el.href) {
          return el;
        }
        if (el.href.indexOf(location.pathname) >= 0) {
          el.selected = true;
        }
        return el;
      });
    }
  }
};
</script>
<style lang="less">
#components-layout-demo-top-side .logo {
  width: 120px;
  height: 48px;
  background: #333;
  border-radius: 6px;
  margin: 16px 28px 16px 0;
  float: left;
}
</style>
