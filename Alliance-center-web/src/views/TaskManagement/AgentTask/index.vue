<template>
  <list v-if="$route.name !== 'viewsTaskManagementAgentTaskView'"></list>
  <ViewInfo v-else />
</template>
<script>
import list from './list'
import ViewInfo from './View'
export default {
  components: {
    list,
    ViewInfo
  }
}
</script>