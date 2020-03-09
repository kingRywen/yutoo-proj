<template>
  <iframe :src="src" frameborder="0" name="submain" ref="submain" allowtransparency="true" style="height:100%;width:100%"></iframe>
</template>

<script>
export default {
  props: ["src"],
  methods: {
    // 确认按钮
    ok() {
      this.$root.$children[0].asyncModalVisible = false;
      this.$listeners.set();
    }
  }
};
</script>

<style>
</style>
