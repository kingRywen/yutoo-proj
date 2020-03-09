<template>
  <v-sider collapsible :collapsed="collapsed" :trigger="false" :collapsed-width="64" style="background: transparent" class="____siderbar_wrapper">
    <v-menu ref="menu" class="menu___siderbar" mode="inline" :data="$attrs.data" :expand="true" style="height:100%" :inline-collapsed="collapsed" @item-click="itemClick"></v-menu>
    <div class="arrow" @click="$emit('update:collapsed', !collapsed)">
      <img :src="!collapsed ? arrow_left : arrow_right" alt="">
    </div>
  </v-sider>
</template>
<script>
import bus from "common/bus.js";
import arrow_left from "@/assets/arrow_left.png";
import arrow_right from "@/assets/arrow_right.png";

export default {
  name: "yt-siderbar",
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  created() {
    this.arrow_left = arrow_left;
    this.arrow_right = arrow_right;
    let vm = this;

    bus.$on("toggle", () => {
      vm.$nextTick(() => {
        vm.$emit("update:collapsed", !this.$props.collapsed);
        if (this.$props.collapsed) {
          // this.setChecked();
        }
      });
    });
  },
  methods: {
    setChecked(conditions) {
      this.$refs.menu.setCheck(conditions);
    },
    itemClick(e) {
      console.log(e);
      this.$emit("item-click", e);
    }
  }
};
</script>

