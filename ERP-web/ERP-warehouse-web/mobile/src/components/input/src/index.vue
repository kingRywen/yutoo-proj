<template>
  <div class="yt-input">
    <span>
      <slot name="left"></slot>
    </span>
    <span>
      <slot></slot>
    </span>
    <input
      class="input"
      :type="type"
      :value="value"
      @input="el=>$emit('input', el.target.value)"
      :style="styles"
      :placeholder="placeholder"
    >
    <span>
      <slot name="right"></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'yt-input',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    styles: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang='scss'>
.yt-input {
  display: inline-block;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  .input {
    width: 100%;
    border-radius: 0px;
    outline: none;
    height: 24px;
  }
}
</style>