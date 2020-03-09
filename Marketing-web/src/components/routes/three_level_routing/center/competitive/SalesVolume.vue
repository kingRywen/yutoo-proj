<template>
  <Container></Container>
</template>

<script>
import { Container } from "./salesvolumeComponents";
// import store from '@/store/modules/salesVolume'
export default {
  components: {
    Container
  }
  // beforeRouteEnter(to, from, next) {
  //   try {
  //     store.install()
  //   } catch (error) {}

  //   next()
  // },
  // beforeRouteLeave(to, from, next) {
  //   try {
  //     store.uninstall()
  //   } catch (error) {}
  //   // 卸载store

  //   next()
  // }
};
</script>

<style>
</style>
