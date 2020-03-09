<template>
  <AddTask :edit="true" :quick="true" />
</template>
<script>
import AddTask from '../AddTask/index'
export default {
  components: {
    AddTask
  }
}
</script>