<template>
  <transition :name="name" mode="out-in">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: "custom-transition",
  props: {
    name: {
      type: String,
      default: "fade"
    }
  }
};
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.75s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
