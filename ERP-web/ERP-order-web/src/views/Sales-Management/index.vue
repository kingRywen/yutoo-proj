<template>
  <router-view/>
</template>
<script>
import storage from 'Utils/saver'

export default {
  watch: {
    $route(to, from) {
      console.log(to, from)
      if (from.name === 'orderFormStrategy') {
        storage.remove('session', 'strategyTabName')
      }
    }
  }
}
</script>
