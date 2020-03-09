<template>
  <ContainerBank></ContainerBank>
</template>

<script>
import { ContainerBank } from "./myAttentionComponents";
// import store from "@/store/modules/salesVolume";
export default {
  components: {
    ContainerBank
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
