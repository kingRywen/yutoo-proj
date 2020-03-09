<template>
  <ContainerKeyLexicon></ContainerKeyLexicon>
</template>

<script>
import { ContainerKeyLexicon } from "./myAttentionComponents";
// import store from "@/store/modules/salesVolume";
export default {
  components: {
    ContainerKeyLexicon
  }
  // beforeRouteEnter(to, from, next) {
  //   store.install();
  //   next();
  // },
  // beforeRouteLeave(to, from, next) {
  //   // 卸载store
  //   store.uninstall();
  //   next();
  // }
};
</script>

<style>
</style>
