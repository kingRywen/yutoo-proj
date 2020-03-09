<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item :to="{ path:item.path }" v-for="(item) in routerList" :key="item.meta.title">
        <span>{{item.meta.title}}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      routerList: null
    }
  },
  watch: {
    $route() {
      this.getRouterName()
    }
  },
  methods: {
    getRouterName() {
      let matched = this.$route.matched.filter(item => item.meta.title)
      const first = matched[0]
      if (
        first &&
        first.meta.title.trim().toLocaleLowerCase() !== '/'.toLocaleLowerCase()
      ) {
        matched = [{ path: '/', meta: { title: '首页' } }].concat(matched)
      }
      this.routerList = matched
    }
  },
  mounted() {
    this.getRouterName()
  }
}
</script>

<style lang="scss">
.breadcrumb {
  padding-bottom: 20px;
}
// .v-enter,
// .v-leave-to {
//   opacity: 0;
//   transform: translateY(10px);
// }

// .v-enter-active,
// .v-leave-active {
//   transition: all 0.25s ease-in-out;
// }
// .v-move {
//   transition: all 0.25s ease-in-out;
// }
// .v-leave-active {
//   position: absolute;
// }
</style>
