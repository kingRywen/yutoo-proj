<template>
  <div>
    <v-input-number :min="0" size="large" v-model="value1" @change="_handleChange"></v-input-number> ~ &nbsp;
    <v-input-number size="large" :min="range.min" :max="range.max" v-model="value2" @change="_handleChange"></v-input-number>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: 0,
      value2: 0,
      range: {}
    };
  },
  methods: {
    _handleChange(v) {
      console.log(v);
      if (this.value1 > this.value2) {
        this.$emit("update:range", []);
      } else {
        this.$emit("update:range", [this.value1, this.value2]);
      }
    }
  }
};
</script>

<style>
</style>
