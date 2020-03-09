<template>
  <div style="width:1100px;margin: 0 auto">
    <nav-bar></nav-bar>
    <keep-alive :max="10">
      <router-view :key="$route.path"></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  computed: {
    cachePage() {
      return this.$store.state.app.cachePage
    }
  }
}
</script>