<template>
  <div class="txc">
    <img :src="url" />
  </div>
</template>
<script>
export default {
  props: ['url']
}
</script>