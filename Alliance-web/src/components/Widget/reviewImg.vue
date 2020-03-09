<template>
  <div>
    <img width="100%" :src="url" />
  </div>
</template>
<script>
export default {
  props: ['url']
}
</script>