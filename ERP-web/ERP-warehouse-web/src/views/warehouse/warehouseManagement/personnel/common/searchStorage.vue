<template>
  <div class="search-storage"></div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    submitForm(cb) {
      cb && cb()
    },
    resetForm() {}
  }
}
</script>

<style lang='scss'>
.search-storage {
  background: #fff;
}
</style>