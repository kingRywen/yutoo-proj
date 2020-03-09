<template>
  <Add :copy="copy" :new-var="newVar" :edit="true" />
</template>
<script>
import Add from '../add/index';
export default {
  props: {
    copy: {
      default: false
    },
    newVar: {
      default: false
    }
  },
  components: {
    Add
  }
}
</script>