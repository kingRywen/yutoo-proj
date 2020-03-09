<template>
  <div>
    <h5-editor />
  </div>
</template>
<script>
export default {
  components: {
    H5Editor: () => import('Components/core/main.vue')
  }
}
</script>