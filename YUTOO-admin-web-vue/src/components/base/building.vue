<template>
  <div class="_building" @click="showMsg">
    <slot></slot>
  </div>
</template>

<script>
import { showModal } from "common/common";
export default {
  methods: {
    showMsg() {
      showModal("info", "正在建设中");
    }
  }
};
</script>

<style lang="scss" scoped>
._building {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
</style>
