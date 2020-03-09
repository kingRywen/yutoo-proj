<template>
  <div class="_____flex">
    <v-input size="large" :precision="2" :price="true" :value="value" @input="handleChange" :min="min" ref="input">
      <v-select size="lg" slot="after" style="width: 60px;" placeholder="单位" :data="data" :allowClear="false" v-model="unit" @change="$emit('update:unit', $event)"></v-select>
    </v-input>
    
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    min: {
      type: Number,
      default: 0
    },
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
  },
  methods: {
    handleChange(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style scoped>
._____flex {
  display: flex;
}
</style>
