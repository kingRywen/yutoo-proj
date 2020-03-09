<template>
  <List v-if="$route.name === 'partFour'" />
  <router-view v-else></router-view>
</template>

<script>
export default {
  components:{
    List: () => import('./List.vue')
  }
}
</script>

<style>

</style>
