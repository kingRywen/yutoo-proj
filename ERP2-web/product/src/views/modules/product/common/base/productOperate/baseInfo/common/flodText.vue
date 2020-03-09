<template>
  <el-button
    type="text"
    class="flod-text"
    :style="{marginLeft: left}"
    @click="$emit('handleClick',isHide)"
  >
    {{text}}
    <i :class="!isHide ? 'el-icon-arrow-down': 'el-icon-arrow-up'"></i>
  </el-button>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: "添加更多信息填写"
    },
    left: {
      type: String,
      default: "170px"
    }
  },
  computed: {
    isHide: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang='scss'>
.flod-text {
  background: #fff;
}
</style>