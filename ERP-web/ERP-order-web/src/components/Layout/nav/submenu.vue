<template lang="html">

    <el-menu
        :unique-opened='true'
        :router="true"
        v-if="refresh"
        class="submenu"
        ref="menu"
        :default-active="activeIndex"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        :collapse="isCollapse">

        <template v-for="(item,index) in navList">
            <el-submenu :index="index+1+''" :key="item.name">
                <template slot="title">
                  <i :class="item.icon || 'el-icon-location'"></i>
                  <span class="submenu-title">{{item.name}}</span>
                </template>

                <el-menu-item :index="j.path" class="item" v-for="(j) in item.children" :key="j.path">
                    {{j.name}}
                </el-menu-item>
            </el-submenu>
        </template>
        <!--  -->

    </el-menu>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      refresh: true,
      activeIndex: '/salesManagement/associatedSettings/allOrderLists'
    }
  },
  watch: {
    $route: {
      handler(to) {
        this.activeIndex = to.matched[2].path
        // this.$nextTick(() => {
        //   this.$refs.menu && (this.$refs.menu.activeIndex = to.matched[2].path)
        // })
        // if (to.meta.isLeaf) {
        //   this.activeIndex = to.matched[2].path
        // } else {
        //   this.activeIndex = to.matched[2].path
        // }
      },
      immediate: true
    }
  },

  methods: {
    // eslint-disable-next-line
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    // eslint-disable-next-line
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleSelect(index, indexPath) {
      // console.log(index, indexPath)
    }
  },
  computed: {
    navList() {
      return this.$store.state.nav.submenu
    },
    isCollapse() {
      return this.$store.state.isSubmenuUnfold
    }
  }
}
</script>

<style lang="scss">
.submenu {
  height: 100%;
  &:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-submenu__title {
    text-align: left;
  }
  .submenu-title {
    font-weight: 600;
  }
  .item {
    text-align: left;
  }
}
</style>
