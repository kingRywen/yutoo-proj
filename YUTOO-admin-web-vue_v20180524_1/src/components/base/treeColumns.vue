<template>
  <div>
    <v-tree :data="tree" show-line v-on="$listeners"></v-tree>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    tree: {
      type: Array,
      default: []
    }
  },
  mounted () {
    
  },
  computed: {
    newListeners() {
      let vm = this;
      return Object.assign({}, this.$listeners, {
        select: function(arr) {
          vm.$emit('select', arr)
        }
      });
    }
  }
};
</script>

<style>

</style>
