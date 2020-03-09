<template lang="html">

    <el-menu
        :unique-opened='true'
        :router="true"
        class="submenu"
        :default-active="activeIndex"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        :collapse="isCollapse">

        <template v-for="(item,index) in navList">
            <el-submenu :index="index+1+''" :key="index">
                <template slot="title">
                  <i :class="item.icon || 'el-icon-location'"></i>
                  <span class="submenu-title">{{item.name}}</span>
                </template>

                <el-menu-item :index="j.path" class="item" v-for="(j,jindex) in item.children" :key="jindex">
                    {{j.name}}
                </el-menu-item>
            </el-submenu>
        </template>
        <!--  -->

    </el-menu>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '/salesManagement/associatedSettings/allOrderLists'
    }
  },
  created() {},
  watch: {
    $route: {
      handler(to) {
        this.activeIndex = to.matched[1].path
      },
      immediate: true
    }
  },

  methods: {
    // eslint-disable-next-line
    handleOpen() {
      // console.log(key, keyPath);
    },
    // eslint-disable-next-line
    handleClose() {
      // console.log(key, keyPath);
    },
    handleSelect() {
      // console.log(index, indexPath)
    }
  },
  computed: {
    navList() {
      return this.$store.state.nav.menu
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
