<template>
  <div>

    <div v-if="isInput">
      <v-input v-if="$attrs.type != 'num'" :value="value" style="width:120px" size="small" @input="val=> value = val"></v-input>
      <InitInput v-else :min="1" :value.sync="value"></InitInput>
      <v-button type="primary" size="small" @click="edit" :loading="loading">修改</v-button>
      <v-button size="small" @click="cancel">取消</v-button>
    </div>
    <span v-else>{{ value }}</span>
  </div>
</template>

<script>
import InitInput from "components/base/initInput.vue";

export default {
  inheritAttrs: false,
  components: {
    InitInput
  },
  props: ["text", "item"],
  data() {
    return {
      value: this.text,
      loading: false
    };
  },
  methods: {
    edit() {
      this.loading = true;
      this.$emit("edit", this);
    },
    onchange(val) {
      console.log(val);
      this.value = 1;
    },
    cancel() {
      this.value = this.text;
      this.loading = false;
      this.$emit("cancel", this.value);
    }
  },
  computed: {
    isInput() {
      return this.$attrs.isInput;
    }
  }
};
</script>

<style>
</style>
