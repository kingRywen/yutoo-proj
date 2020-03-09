<template>
  <div>
    <ElInput disabled v-model.trim="value" placeholder="" type="textarea" :rows="10"></ElInput>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      value: this.params.value
    }
  },
  methods: {
    _submit() {
      return
    }
  },
}
</script>

<style>

</style>
