<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BasicContainer'
}
</script>

<style scoped>
.container {
  height: 100%;
}
</style>
