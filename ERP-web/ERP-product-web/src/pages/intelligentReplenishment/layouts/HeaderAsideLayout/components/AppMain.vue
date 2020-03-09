<template lang="html">
  <section class="app-main">
    <!-- <router-view></router-view> -->
    <transition name="fade" mode="out-in">
        <router-view></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain"
};
</script>
<style>
.app-main {
  height: 100%;
}
</style>
