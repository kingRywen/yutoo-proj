<template>
  <AddTask :edit="true" />
</template>
<script>
import AddTask from './AddTask/index'
export default {
  components: {
    AddTask
  }
}
</script>