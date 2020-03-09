<template>
  <div class="appMain">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    isLoading() {
      return this.$store.state.isloading
    }
  }
}
</script>
<style lang="scss">
.appMain {
  background: #fff;
  //   border-radius: 5px;
  overflow-y: auto;
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  top: 54px;
}
</style>
