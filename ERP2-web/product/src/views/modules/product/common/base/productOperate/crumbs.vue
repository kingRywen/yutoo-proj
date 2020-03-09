<template>
  <div class="crumbs" separator-class="el-icon-arrow-right">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang='scss'>
.crumbs {
  background: #fff;
  margin-bottom: 16px;
  margin-top: 6px;
  color: rgb(182, 182, 182);
}
</style>