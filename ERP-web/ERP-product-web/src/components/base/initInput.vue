<template>
  <v-input-number v-bind="$attrs" :value="value" :step="1" @change="handlerChange"></v-input-number>
</template>

<script>
import { fixNumber } from "common/util";
export default {
  name: 'initInput',
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  inheritAttrs: false,
  data () {
    return{
      newVal: ''
    }
  },
  methods: {
    handlerChange (val) {
      this.$emit('update:value', Math.ceil(val))
    }
  }
}
</script>

<style>

</style>
