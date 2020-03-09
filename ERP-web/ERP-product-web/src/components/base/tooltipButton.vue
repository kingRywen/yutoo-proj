<template>
  <el-tooltip class="item" :effect="properties.effect" :content="content" :placement="properties.placement" :open-delay="properties.delay">
    <span @click.stop="$emit('click')">
      <i class="iconfont __editBtns" v-html="icon"></i>
    </span>
  </el-tooltip>
</template>

<script>
import { Tooltip } from "element-ui";
import Vue from "vue";
Vue.use(Tooltip);

export default {
  name: "tooltip-button",
  props: {
    properties: {
      type: Object,
      default: () => ({
        effect: "dark",
        placement: "top-start",
        delay: 500
      })
    },
    content: {
      type: String
    },
    icon: {
      type: String
    }
  }
};
</script>

<style scoped>
.item {
  cursor: pointer;
}
</style>
