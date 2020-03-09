<template>
  <Move :params="params" ref="move" :platSiteId="platSiteId" />
</template>
<script>
import Move from './moveProduct.vue';
export default {
  // props: ['params','platSiteId'],
  props: {
    params: Object,
    platSiteId: Number,
  },
  components: {
    Move
  },
  methods: {
    _submit() {
      return this.$refs.move._submit()
    }
  },
}
</script>