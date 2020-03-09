<template>
  <component :is="componentId" v-bind="$attrs"></component>
</template>
<script>
import valid from './components/valid'
import invalid from './components/invalid'
export default {
  components: {
    invalid,
    valid
  },
  data() {
    return {
      componentId:
        this.$attrs.curQuery.rootType == 'VALID' ? 'valid' : 'invalid'
    }
  }
}
</script>