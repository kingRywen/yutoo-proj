<template>
  <div class="btns">
    <template v-for="item in btns">
      <ElButton
        :type='item.type'
        :plain='item.plain'
        :key="item.id"
        @click="item.fn()"
        v-if="item.show == false ? false : true"
        :disabled="item.disabled"
      >{{ item.name }}</ElButton>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    btns: {
      type: Array,
      default: () => [
      ]
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang='scss'>
.btns {
  background: #fff;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  // .btns-item {
  //   background: #3ab6fe;
  //   color: white;
  // }
}
</style>