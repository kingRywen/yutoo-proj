<template>
  <div class="_____flex">
    <v-input-number size="large" :value="value || ''" @change="$emit('input', $event)" :min="1" ref="input">
    </v-input-number>
    <v-select size="lg" style="width: 60px;" placeholder="单位" :data="data" :allowClear="false" v-model="unit" @change="$emit('update:unit', $event)"></v-select>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    data: Array
  },
  mounted() {
    this.unit = this.data.find(el => el.label === "RMB").value;
    this.$emit("update:unit", this.unit);
    this.$emit("reset");
  },
  data() {
    return {
      unit: null
    };
  }
};
</script>

<style scoped>
._____flex {
  display: block;
}
</style>
